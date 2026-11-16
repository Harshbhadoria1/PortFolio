import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const OWNER_NAME = 'Harsh Bhadoria';
const OWNER_EMAIL = 'harshbhadoria6@gmail.com';

const INJECTION_PATTERNS: RegExp[] = [
  /<\s*script\b/i,
  /<\s*iframe\b/i,
  /<\s*object\b/i,
  /<\s*embed\b/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
  /\bon(?:error|load|click|mouseover|focus|submit)\s*=/i,
  /\$\s*(?:gt|gte|lt|lte|ne|in|nin|where|regex)\b/i,
  /\b(?:union\s+select|drop\s+table|insert\s+into|delete\s+from)\b/i,
];

function sanitizeInput(raw: string): string {
  return raw
    .replace(/\0/g, '')
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function hasThreat(raw: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(raw));
}

function validateContactPayload(email: string, message: string) {
  const errors: { email?: string; message?: string } = {};
  if (hasThreat(email)) errors.email = 'Blocked potentially unsafe characters in email input.';
  if (hasThreat(message)) errors.message = 'Blocked unsafe script or injection syntax in message.';

  const sanitizedEmail = sanitizeInput(email).slice(0, 160);
  const sanitizedMessage = sanitizeInput(message).slice(0, 2000);
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!errors.email) {
    if (!sanitizedEmail) errors.email = 'Please enter your email address so Harsh can reply.';
    else if (!emailPattern.test(sanitizedEmail)) errors.email = 'That does not look like a valid email address.';
  }
  if (!errors.message) {
    if (!sanitizedMessage) errors.message = 'Please write a short message before sending.';
    else if (sanitizedMessage.length < 5) errors.message = 'Message is a little too short (at least 5 characters).';
    else if (message.trim().length > 2000) errors.message = 'Message exceeds 2000 characters — keep it concise!';
  }

  return {
    valid: Object.keys(errors).length === 0,
    sanitizedEmail,
    sanitizedMessage,
    errors,
  };
}

interface StoredInquiry {
  id: string;
  senderEmail: string;
  message: string;
  receivedAt: string;
  deliveryMode: 'smtp' | 'relay' | 'saved-with-mailto';
}

const PORT = Number(process.env.PORT || 3000);
const INQUIRIES_FILE = path.resolve(process.cwd(), '.data', 'inquiries.json');

// Sliding-window rate limiter per IP for /api/contact (max 6 requests per 60s)
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 6;
const ipRequestLog = new Map<string, number[]>();

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction): void {
  const isProd = process.env.NODE_ENV === 'production';
  const scriptSrc = isProd
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  const csp = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self' https://formsubmit.co ws: wss:",
    "frame-src 'self'",
    "object-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'self' https://aistudio.google.com https://*.google.com https://*.googleusercontent.com https://*.run.app",
  ].join('; ');

  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
}

function contactRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const clientIp = (req.ip || req.socket.remoteAddress || 'unknown').slice(0, 64);
  const now = Date.now();
  const timestamps = (ipRequestLog.get(clientIp) || []).filter((ts) => now - ts < RATE_WINDOW_MS);

  if (timestamps.length >= RATE_MAX_REQUESTS) {
    res.status(429).json({
      ok: false,
      error: 'Too many messages sent briefly. Please wait a minute and try again.',
    });
    return;
  }

  timestamps.push(now);
  ipRequestLog.set(clientIp, timestamps);
  next();
}

async function persistInquiry(inquiry: StoredInquiry): Promise<void> {
  try {
    await fs.mkdir(path.dirname(INQUIRIES_FILE), { recursive: true });
    let existing: StoredInquiry[] = [];
    try {
      const raw = await fs.readFile(INQUIRIES_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        existing = parsed;
      }
    } catch {
      existing = [];
    }
    existing.unshift(inquiry);
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify(existing.slice(0, 100), null, 2), 'utf8');
  } catch (err) {
    console.warn('Unable to persist inquiry locally:', err);
  }
}

async function trySendViaSmtp(senderEmail: string, message: string): Promise<boolean> {
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  if (!smtpUser || !smtpPass) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const recipient = process.env.CONTACT_RECEIVER_EMAIL || OWNER_EMAIL;
  const safeEmail = escapeHtml(senderEmail);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  await transporter.sendMail({
    from: `"Harsh Portfolio" <${smtpUser}>`,
    to: recipient,
    replyTo: senderEmail,
    subject: `New Portfolio Message from ${senderEmail}`,
    text: `Sender Email: ${senderEmail}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>New Portfolio Inquiry for Harsh Bhadoria</h2>
        <p><strong>From:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="padding: 12px 16px; background: #f1f5f9; border-radius: 8px;">${safeMessage}</blockquote>
      </div>
    `,
  });

  return true;
}

async function tryRelayViaFormSubmit(senderEmail: string, message: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: senderEmail,
        message,
        _subject: `Portfolio Message from ${senderEmail}`,
        _template: 'table',
      }),
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(securityHeadersMiddleware);
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, owner: OWNER_NAME, secured: true });
  });

  app.post('/api/contact', contactRateLimiter, async (req, res) => {
    // Reject automated bots filling hidden honeypot field
    if (typeof req.body?.honeypot === 'string' && req.body.honeypot.trim().length > 0) {
      res.status(400).json({ ok: false, error: 'Automated submission blocked.' });
      return;
    }

    const email = typeof req.body?.email === 'string' ? req.body.email : '';
    const message = typeof req.body?.message === 'string' ? req.body.message : '';

    const validation = validateContactPayload(email, message);
    if (!validation.valid) {
      res.status(400).json({
        ok: false,
        errors: validation.errors,
      });
      return;
    }

    const trimmedEmail = validation.sanitizedEmail;
    const trimmedMessage = validation.sanitizedMessage;

    let deliveryMode: StoredInquiry['deliveryMode'] = 'saved-with-mailto';
    try {
      const sentSmtp = await trySendViaSmtp(trimmedEmail, trimmedMessage);
      if (sentSmtp) {
        deliveryMode = 'smtp';
      } else {
        const sentRelay = await tryRelayViaFormSubmit(trimmedEmail, trimmedMessage);
        if (sentRelay) {
          deliveryMode = 'relay';
        }
      }
    } catch (err) {
      console.warn('Email transport fallback triggered:', err);
    }

    const inquiry: StoredInquiry = {
      id: `inq_${Date.now().toString(36)}`,
      senderEmail: trimmedEmail,
      message: trimmedMessage,
      receivedAt: new Date().toISOString(),
      deliveryMode,
    };

    await persistInquiry(inquiry);

    const subject = encodeURIComponent(`Portfolio Inquiry from ${trimmedEmail}`);
    const body = encodeURIComponent(`From: ${trimmedEmail}\n\n${trimmedMessage}`);
    const mailtoUrl = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;

    res.status(200).json({
      ok: true,
      deliveryMode,
      recipient: OWNER_EMAIL,
      mailtoUrl,
      inquiry: {
        id: inquiry.id,
        receivedAt: inquiry.receivedAt,
      },
    });
  });

  app.get('/Harsh_Bhadoria_Resume.pdf', async (_req, res) => {
    const pdfPath = path.resolve(process.cwd(), 'public', 'Harsh_Bhadoria_Resume.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Harsh_Bhadoria_Resume.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.sendFile(pdfPath, (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ ok: false, error: 'Resume PDF not found' });
      }
    });
  });

  app.get('/resume.html', (_req, res) => {
    const htmlPath = path.resolve(process.cwd(), 'public', 'resume.html');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(htmlPath, (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ ok: false, error: 'Resume HTML not found' });
      }
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir, { maxAge: '1d' }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Harsh Bhadoria Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

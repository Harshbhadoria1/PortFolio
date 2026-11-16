import { Check, Clock, Copy, Github, Linkedin, Mail, Phone, Send } from 'lucide-react';
import { useEffect, useState, type FormEvent, type RefObject } from 'react';
import { HARSH_PROFILE } from '../data/portfolioData';
import { formatGwaliorTime, validateContactForm } from '../utils/portfolioLogic';

interface ContactSectionProps {
  emailInputRef: RefObject<HTMLInputElement | null>;
}

interface SubmissionSuccess {
  senderEmail: string;
  deliveryMode: 'smtp' | 'relay' | 'saved-with-mailto';
  mailtoUrl: string;
}

function GwaliorClock() {
  const [gwaliorTime, setGwaliorTime] = useState(() => formatGwaliorTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setGwaliorTime(formatGwaliorTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
          Gwalior, Madhya Pradesh
        </span>
        <span>IST (UTC+5:30)</span>
      </div>
      <p className="mt-1.5 font-mono text-xl font-semibold text-white tabular-nums">
        {gwaliorTime}
      </p>
    </div>
  );
}

export function ContactSection({ emailInputRef }: ContactSectionProps) {
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; message?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sentResult, setSentResult] = useState<SubmissionSuccess | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(HARSH_PROFILE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = validateContactForm(senderEmail, message);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setIsSending(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: validation.sanitizedEmail,
          message: validation.sanitizedMessage,
          honeypot,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
        } else {
          setServerError('Could not deliver your message right now. Please try the direct email link.');
        }
        return;
      }

      setSentResult({
        senderEmail: senderEmail.trim(),
        deliveryMode: data.deliveryMode,
        mailtoUrl: data.mailtoUrl,
      });
      setSenderEmail('');
      setMessage('');
    } catch {
      setServerError('Network issue while sending. You can also message harshbhadoria6@gmail.com directly.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="section-cv relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left: Direct Contact Form -> Sends to Harsh's Gmail */}
          <div className="glass-surface sheen-card flex flex-col justify-between rounded-3xl p-7 sm:p-10 lg:col-span-7">
            <div>
              <p className="font-mono text-xs text-emerald-300">Direct Message to Gmail</p>
              <h2 className="font-hero mt-2 text-3xl font-extrabold tracking-tight text-white text-balance sm:text-4xl">
                Drop your email &amp; message — lands{' '}
                <span className="font-editorial shimmer-text text-4xl font-normal italic sm:text-5xl">
                  straight
                </span>{' '}
                with Harsh.
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                Hiring for Python Data Science, GenAI, or Full Stack MERN roles — or pitching a build? Write below and hit send.
              </p>

              {sentResult ? (
                <div className="mt-7 rounded-2xl border border-emerald-400/50 bg-emerald-950/60 p-6 shadow-lg">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/25 text-emerald-300">
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-white">
                        Message Sent to Harsh!
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                        Thanks <span className="font-semibold text-white">{sentResult.senderEmail}</span> — your message has been dispatched toward{' '}
                        <span className="font-mono text-sky-300">{HARSH_PROFILE.email}</span>.
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <a
                          href={sentResult.mailtoUrl}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-300 whitespace-nowrap shrink-0"
                        >
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                          Also Open in Your Mail App
                        </a>
                        <button
                          type="button"
                          onClick={() => setSentResult(null)}
                          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Send Another Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                {/* Invisible anti-bot honeypot field */}
                <input
                  type="text"
                  name="companyWebsite"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                {/* 1. User Email Input */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-slate-200"
                  >
                    Your Email Address
                  </label>
                  <input
                    ref={emailInputRef}
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={senderEmail}
                    onChange={(e) => {
                      setSenderEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    aria-invalid={Boolean(fieldErrors.email)}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/25"
                  />
                  {fieldErrors.email && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-amber-300">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* 2. Message Textarea Below */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-slate-200"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Hey Harsh, loved AgriNext and Weather-fm! Let's talk about..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (fieldErrors.message) {
                        setFieldErrors((prev) => ({ ...prev, message: undefined }));
                      }
                    }}
                    aria-invalid={Boolean(fieldErrors.message)}
                    className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/25"
                  />
                  {fieldErrors.message && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-amber-300">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {serverError && (
                  <p role="alert" className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200">
                    {serverError}
                  </p>
                )}

                {/* 3. Send Button Below */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/15 transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer sm:w-auto"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {isSending ? 'Sending to Harsh...' : 'Send Message to Harsh'}
                </button>
              </form>
              )}
            </div>

            <p className="mt-6 border-t border-white/10 pt-4 text-xs text-slate-400">
              Recipient: <span className="font-mono text-slate-200">{HARSH_PROFILE.email}</span> · Based in Aditya Puram, Gwalior
            </p>
          </div>

          {/* Right: Direct Contact Cards & Live Gwalior Station */}
          <div className="glass-surface flex flex-col justify-between rounded-3xl p-7 sm:p-8 lg:col-span-5">
            <div>
              <p className="font-mono text-xs text-amber-300">Direct Channels</p>
              <h3 className="font-display mt-2 text-2xl font-bold text-white">
                Reach Harsh Directly
              </h3>

              <div className="mt-6 space-y-3">
                {/* Copyable Gmail */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Gmail</p>
                    <a
                      href={`mailto:${HARSH_PROFILE.email}`}
                      className="mt-0.5 block truncate font-mono text-sm font-medium text-white hover:text-sky-300"
                    >
                      {HARSH_PROFILE.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy Harsh Bhadoria email address"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Phone */}
                <a
                  href={HARSH_PROFILE.phoneHref}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 transition-colors hover:border-sky-400/40"
                >
                  <div>
                    <p className="text-xs text-slate-400">Phone Call</p>
                    <p className="mt-0.5 font-mono text-sm font-medium text-white">
                      {HARSH_PROFILE.phone}
                    </p>
                  </div>
                  <Phone className="h-4 w-4 text-sky-300 shrink-0" aria-hidden="true" />
                </a>

                {/* WhatsApp Chat Direct Link */}
                <a
                  href={HARSH_PROFILE.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Chat with Harsh Bhadoria on WhatsApp (+91 9399781973)"
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-950/30 p-3.5 transition-colors hover:border-[#25D366]/65 hover:bg-emerald-950/50"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-emerald-300">WhatsApp Chat</p>
                    <p className="mt-0.5 font-mono text-sm font-medium text-white">
                      {HARSH_PROFILE.phone} <span className="font-sans text-xs text-slate-400">· Message directly</span>
                    </p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366] transition-transform duration-150 group-hover:scale-105">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4.5 w-4.5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.391c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.016-1.297-4.984-4.328-5.141-4.531-.141-.203-1.234-1.641-1.234-3.125s.781-2.219 1.063-2.516c.281-.297.609-.375.813-.375.203 0 .406 0 .578.016.188.016.438-.078.688.516.25.609.859 2.094.938 2.25.078.156.125.328.031.531-.094.203-.141.328-.297.5-.156.172-.313.391-.453.516-.156.156-.313.313-.141.625.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.344 2.438 1.5.313.156.484.125.672-.078.188-.203.766-.891.969-1.203.203-.313.406-.266.688-.156.281.109 1.781.844 2.078.984.313.156.516.234.594.359.078.125.078.734-.172 1.438z" />
                    </svg>
                  </span>
                </a>

                {/* LinkedIn */}
                <a
                  href={HARSH_PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-colors hover:border-sky-400/40"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">LinkedIn</p>
                    <p className="mt-0.5 truncate font-mono text-sm font-medium text-white">
                      {HARSH_PROFILE.linkedinHandle}
                    </p>
                  </div>
                  <Linkedin className="h-4 w-4 text-sky-300 shrink-0" aria-hidden="true" />
                </a>

                {/* GitHub */}
                <a
                  href={HARSH_PROFILE.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-colors hover:border-sky-400/40"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">GitHub</p>
                    <p className="mt-0.5 truncate font-mono text-sm font-medium text-white">
                      {HARSH_PROFILE.githubHandle}
                    </p>
                  </div>
                  <Github className="h-4 w-4 text-sky-300 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </div>

            <GwaliorClock />
          </div>
        </div>
      </div>
    </section>
  );
}

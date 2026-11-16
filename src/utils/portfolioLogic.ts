import {
  DEV_EXCUSES,
  type ProjectCategory,
  type ProjectItem,
  type SkillCategory,
  type SkillItem,
} from '../data/portfolioData';

export interface ContactValidationResult {
  valid: boolean;
  sanitizedEmail: string;
  sanitizedMessage: string;
  errors: {
    email?: string;
    message?: string;
  };
}

export interface EpochSimulationState {
  epoch: number;
  lossHistory: number[];
  accuracy: number;
  chaiCups: number;
  statusNote: string;
}

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

export function sanitizeTextInput(raw: string): string {
  return raw
    .replace(/\0/g, '')
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export function hasInjectionThreat(raw: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(raw));
}

export function isSafeExternalUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/')) return !trimmed.startsWith('//');
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' || parsed.protocol === 'mailto:' || parsed.protocol === 'tel:';
  } catch {
    return false;
  }
}

export function filterSkills(skills: SkillItem[], category: SkillCategory): SkillItem[] {
  if (category === 'all') {
    return skills;
  }
  return skills.filter((skill) => skill.category === category);
}

export function filterProjects(projects: ProjectItem[], category: ProjectCategory): ProjectItem[] {
  if (category === 'all') {
    return projects;
  }
  return projects.filter((project) => project.category === category);
}

export function validateContactForm(email: string, message: string): ContactValidationResult {
  const errors: ContactValidationResult['errors'] = {};

  if (hasInjectionThreat(email)) {
    errors.email = 'Blocked potentially unsafe characters in email input.';
  }
  if (hasInjectionThreat(message)) {
    errors.message = 'Blocked unsafe script or injection syntax in message.';
  }

  const sanitizedEmail = sanitizeTextInput(email).slice(0, 160);
  const sanitizedMessage = sanitizeTextInput(message).slice(0, 2000);

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!errors.email) {
    if (!sanitizedEmail) {
      errors.email = 'Please enter your email address so Harsh can reply.';
    } else if (!emailPattern.test(sanitizedEmail)) {
      errors.email = 'That does not look like a valid email address.';
    }
  }

  if (!errors.message) {
    if (!sanitizedMessage) {
      errors.message = 'Please write a short message before sending.';
    } else if (sanitizedMessage.length < 5) {
      errors.message = 'Message is a little too short (at least 5 characters).';
    } else if (message.trim().length > 2000) {
      errors.message = 'Message exceeds 2000 characters — keep it concise!';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    sanitizedEmail,
    sanitizedMessage,
    errors,
  };
}

export function formatGwaliorTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

export function getNextBugSquashRank(squashedCount: number): string {
  if (squashedCount === 0) return 'Untested Prod';
  if (squashedCount < 5) return 'Junior Hotfixer';
  if (squashedCount < 12) return 'Pandas Wrangler';
  if (squashedCount < 25) return 'MERN & ML Exterminator';
  return 'Zero-Bug Grandmaster';
}

export function pickDevExcuse(currentIndex: number): { index: number; text: string } {
  const nextIndex = (currentIndex + 1) % DEV_EXCUSES.length;
  return {
    index: nextIndex,
    text: DEV_EXCUSES[nextIndex],
  };
}

export function stepTrainingEpoch(
  state: EpochSimulationState,
  action: 'train' | 'chai' | 'reset',
): EpochSimulationState {
  if (action === 'reset') {
    return {
      epoch: 1,
      lossHistory: [0.92],
      accuracy: 54.2,
      chaiCups: 1,
      statusNote: 'Epoch 1 initialized. Model is guessing like a Monday morning.',
    };
  }

  if (action === 'chai') {
    const nextChai = state.chaiCups + 1;
    const boostedAcc = Math.min(99.4, Number((state.accuracy + 3.4).toFixed(1)));
    const lastLoss = state.lossHistory[state.lossHistory.length - 1] ?? 0.92;
    const boostedLoss = Math.max(0.04, Number((lastLoss * 0.78).toFixed(2)));
    return {
      epoch: state.epoch + 1,
      lossHistory: [...state.lossHistory.slice(-9), boostedLoss],
      accuracy: boostedAcc,
      chaiCups: nextChai,
      statusNote: `Chai #${nextChai} deployed! Gradient descent suddenly found motivation.`,
    };
  }

  const nextEpoch = state.epoch + 1;
  const lastLoss = state.lossHistory[state.lossHistory.length - 1] ?? 0.92;
  const nextLoss = Math.max(0.05, Number((lastLoss * 0.74).toFixed(2)));
  const nextAccuracy = Math.min(98.9, Number((state.accuracy + (100 - state.accuracy) * 0.24).toFixed(1)));

  let statusNote = `Epoch ${nextEpoch} converged smoothly — loss dropped to ${nextLoss}.`;
  if (nextAccuracy >= 95) {
    statusNote = `Epoch ${nextEpoch}: ${nextAccuracy}% accuracy! Ship before validation set notices.`;
  }

  return {
    epoch: nextEpoch,
    lossHistory: [...state.lossHistory.slice(-9), nextLoss],
    accuracy: nextAccuracy,
    chaiCups: state.chaiCups,
    statusNote,
  };
}

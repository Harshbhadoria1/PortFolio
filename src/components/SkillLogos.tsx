import type { ReactNode } from 'react';

export function SkillLogo({ id }: { id: string }): ReactNode {
  switch (id) {
    case 'python':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path
            fill="#3776AB"
            d="M15.8 3C9.6 3 10 5.7 10 5.7v2.8h5.9v.9H7.6S3 8.9 3 15.1c0 6.2 4 6 4 6h2.4v-2.9s-.1-4 3.9-4h5.9s3.3.1 3.3-3.2V6.3S23 3 15.8 3zm-3.2 2a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z"
          />
          <path
            fill="#FFD43B"
            d="M16.2 29c6.2 0 5.8-2.7 5.8-2.7v-2.8h-5.9v-.9h8.3s4.6.5 4.6-5.7c0-6.2-4-6-4-6h-2.4v2.9s.1 4-3.9 4h-5.9s-3.3-.1-3.3 3.2v4.7S9 29 16.2 29zm3.2-2a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z"
          />
        </svg>
      );
    case 'pandas':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="8" y="4" width="3.5" height="9" rx="1" fill="#E2E8F0" />
          <rect x="8" y="15" width="3.5" height="3.5" rx="1" fill="#FACC15" />
          <rect x="8" y="20.5" width="3.5" height="7.5" rx="1" fill="#E2E8F0" />
          <rect x="14.5" y="11" width="3.5" height="17" rx="1" fill="#38BDF8" />
          <rect x="21" y="4" width="3.5" height="11" rx="1" fill="#E2E8F0" />
          <rect x="21" y="17" width="3.5" height="3.5" rx="1" fill="#F43F5E" />
          <rect x="21" y="22.5" width="3.5" height="5.5" rx="1" fill="#E2E8F0" />
        </svg>
      );
    case 'numpy':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <polygon points="16,3 28,9.5 16,16 4,9.5" fill="#4DABF7" />
          <polygon points="4,11 15,17 15,29 4,23" fill="#1C7ED6" />
          <polygon points="28,11 17,17 17,29 28,23" fill="#339AF0" />
          <path d="M9 15.5v7l3-1.8v-4l3 5.3v-6.8" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'sklearn':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <circle cx="12" cy="18" r="8" fill="#F97316" fillOpacity="0.9" />
          <circle cx="21" cy="13" r="7" fill="#38BDF8" fillOpacity="0.88" />
          <path d="M12 18c2-4 5-5 9-5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'genai':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <defs>
            <linearGradient id="genaiGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
          <path
            fill="url(#genaiGrad)"
            d="M16 3l2.9 8.1L27 14l-8.1 2.9L16 25l-2.9-8.1L5 14l8.1-2.9L16 3z"
          />
          <circle cx="25" cy="7" r="2" fill="#FBBF24" />
          <circle cx="7" cy="24" r="1.6" fill="#38BDF8" />
        </svg>
      );
    case 'ml':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <line x1="7" y1="9" x2="16" y2="16" stroke="#38BDF8" strokeWidth="1.7" />
          <line x1="7" y1="23" x2="16" y2="16" stroke="#38BDF8" strokeWidth="1.7" />
          <line x1="16" y1="16" x2="25" y2="10" stroke="#FBBF24" strokeWidth="1.7" />
          <line x1="16" y1="16" x2="25" y2="22" stroke="#34D399" strokeWidth="1.7" />
          <circle cx="7" cy="9" r="3" fill="#38BDF8" />
          <circle cx="7" cy="23" r="3" fill="#38BDF8" />
          <circle cx="16" cy="16" r="3.6" fill="#FBBF24" />
          <circle cx="25" cy="10" r="2.8" fill="#34D399" />
          <circle cx="25" cy="22" r="2.8" fill="#34D399" />
        </svg>
      );
    case 'dl':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="4" y="6" width="5" height="20" rx="2.5" fill="#818CF8" />
          <rect x="13.5" y="4" width="5" height="24" rx="2.5" fill="#38BDF8" />
          <rect x="23" y="8" width="5" height="16" rx="2.5" fill="#34D399" />
          <path d="M9 12h4.5M9 20h4.5M18.5 14H23M18.5 18H23" stroke="#FBBF24" strokeWidth="1.5" />
        </svg>
      );
    case 'data-science':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="4" y="5" width="24" height="22" rx="4" fill="rgba(56,189,248,0.14)" stroke="#38BDF8" strokeWidth="1.6" />
          <path d="M8 21l5-6 4 3 7-8" stroke="#34D399" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="13" cy="15" r="2" fill="#FBBF24" />
          <circle cx="24" cy="10" r="2" fill="#FBBF24" />
        </svg>
      );
    case 'data-analytics':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="5" y="18" width="4.5" height="9" rx="1.2" fill="#38BDF8" />
          <rect x="13.5" y="12" width="4.5" height="15" rx="1.2" fill="#34D399" />
          <rect x="22" y="6" width="4.5" height="21" rx="1.2" fill="#FBBF24" />
          <path d="M6 13l9-5 9-3" stroke="#E2E8F0" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'matplotlib':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <circle cx="16" cy="16" r="11" fill="none" stroke="#94A3B8" strokeWidth="1.4" />
          <circle cx="16" cy="16" r="6" fill="none" stroke="#94A3B8" strokeWidth="1.1" strokeDasharray="2 2" />
          <path d="M16 16L16 5A11 11 0 0125.5 10.5z" fill="#38BDF8" fillOpacity="0.85" />
          <path d="M16 16L25 22A11 11 0 0114 26.8z" fill="#F97316" fillOpacity="0.85" />
          <path d="M16 16L6 14A11 11 0 0111 6.2z" fill="#34D399" fillOpacity="0.85" />
        </svg>
      );
    case 'scipy-plotly':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path
            d="M4 21c3.5-8 7-11 12-11s8.5 3 12 11"
            stroke="#38BDF8"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="10" cy="12" r="2.2" fill="#FBBF24" />
          <circle cx="16" cy="10" r="2.4" fill="#34D399" />
          <circle cx="22" cy="13" r="2.2" fill="#A78BFA" />
          <line x1="4" y1="24" x2="28" y2="24" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      );
    case 'fastapi':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <circle cx="16" cy="16" r="12" fill="#059669" />
          <path fill="#fff" d="M17.5 6.5L10 17h5.6l-1.1 8.5L22 15h-5.6l1.1-8.5z" />
        </svg>
      );
    case 'flask-streamlit':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path
            d="M13 5h6M14 5v6.5L7.5 23.5A2.5 2.5 0 009.7 27h12.6a2.5 2.5 0 002.2-3.5L18 11.5V5"
            stroke="#E2E8F0"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9.6 21h12.8l1.4 2.7a1.5 1.5 0 01-1.3 2.3H9.5a1.5 1.5 0 01-1.3-2.3L9.6 21z" fill="#FF4B4B" />
        </svg>
      );
    case 'dsa':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <line x1="16" y1="7" x2="9" y2="16" stroke="#94A3B8" strokeWidth="1.8" />
          <line x1="16" y1="7" x2="23" y2="16" stroke="#94A3B8" strokeWidth="1.8" />
          <line x1="9" y1="16" x2="6" y2="25" stroke="#94A3B8" strokeWidth="1.8" />
          <line x1="9" y1="16" x2="13" y2="25" stroke="#94A3B8" strokeWidth="1.8" />
          <line x1="23" y1="16" x2="26" y2="25" stroke="#94A3B8" strokeWidth="1.8" />
          <circle cx="16" cy="7" r="3.2" fill="#FBBF24" />
          <circle cx="9" cy="16" r="2.8" fill="#38BDF8" />
          <circle cx="23" cy="16" r="2.8" fill="#38BDF8" />
          <circle cx="6" cy="25" r="2.3" fill="#34D399" />
          <circle cx="13" cy="25" r="2.3" fill="#34D399" />
          <circle cx="26" cy="25" r="2.3" fill="#34D399" />
        </svg>
      );
    case 'cpp':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <polygon points="16,3 27.5,9.5 27.5,22.5 16,29 4.5,22.5 4.5,9.5" fill="#00599C" />
          <text
            x="16"
            y="19.5"
            textAnchor="middle"
            fill="#fff"
            fontSize="10.5"
            fontWeight="800"
            fontFamily="monospace"
          >
            C++
          </text>
        </svg>
      );
    case 'react':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <circle cx="16" cy="16" r="2.6" fill="#61DAFB" />
          <ellipse cx="16" cy="16" rx="12" ry="4.6" fill="none" stroke="#61DAFB" strokeWidth="1.6" />
          <ellipse
            cx="16"
            cy="16"
            rx="12"
            ry="4.6"
            fill="none"
            stroke="#61DAFB"
            strokeWidth="1.6"
            transform="rotate(60 16 16)"
          />
          <ellipse
            cx="16"
            cy="16"
            rx="12"
            ry="4.6"
            fill="none"
            stroke="#61DAFB"
            strokeWidth="1.6"
            transform="rotate(120 16 16)"
          />
        </svg>
      );
    case 'nodejs':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <polygon points="16,3 27,9.5 27,22.5 16,29 5,22.5 5,9.5" fill="#3C873A" />
          <text
            x="16"
            y="19.5"
            textAnchor="middle"
            fill="#fff"
            fontSize="9.5"
            fontWeight="800"
            fontFamily="monospace"
          >
            JS
          </text>
        </svg>
      );
    case 'javascript':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="4" y="4" width="24" height="24" rx="4" fill="#F7DF1E" />
          <text
            x="19"
            y="24"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="12"
            fontWeight="900"
            fontFamily="sans-serif"
          >
            JS
          </text>
        </svg>
      );
    case 'html-css':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path
            fill="#38BDF8"
            d="M16 9c-3.6 0-5.8 1.8-6.6 5.4 1.3-1.8 2.8-2.4 4.6-2 1 .2 1.7.9 2.5 1.7 1.3 1.3 2.8 2.8 6 2.8 3.6 0 5.8-1.8 6.6-5.4-1.3 1.8-2.8 2.4-4.6 2-1-.2-1.7-.9-2.5-1.7C20.7 10.5 19.2 9 16 9zm-6.5 8c-3.6 0-5.8 1.8-6.6 5.4 1.3-1.8 2.8-2.4 4.6-2 1 .2 1.7.9 2.5 1.7 1.3 1.3 2.8 2.8 6 2.8 3.6 0 5.8-1.8 6.6-5.4-1.3 1.8-2.8 2.4-4.6 2-1-.2-1.7-.9-2.5-1.7-1.3-1.3-2.8-2.8-6-2.8z"
          />
        </svg>
      );
    case 'mysql':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <ellipse cx="16" cy="8" rx="9" ry="3.6" fill="#00758F" stroke="#38BDF8" strokeWidth="1.2" />
          <path d="M7 8v15c0 2 4 3.6 9 3.6s9-1.6 9-3.6V8" fill="#00758F" fillOpacity="0.65" stroke="#38BDF8" strokeWidth="1.2" />
          <path d="M7 15.5c0 2 4 3.6 9 3.6s9-1.6 9-3.6" fill="none" stroke="#F29111" strokeWidth="1.5" />
        </svg>
      );
    case 'postgresql':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path
            d="M16 4c-5.8 0-10 3.6-10 9.4 0 4.5 2.7 7.6 6.2 8.8v4.3c0 1.4 1.4 2.5 2.8 2.5 1.3 0 2.2-.9 2.2-2.2v-4.2c4.4-.6 8.8-3.8 8.8-9.2C26 7.6 21.8 4 16 4z"
            fill="#336791"
            stroke="#93C5FD"
            strokeWidth="1.4"
          />
          <circle cx="13" cy="12" r="1.4" fill="#fff" />
          <circle cx="19" cy="12" r="1.4" fill="#fff" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path
            d="M16 3.5c-2.5 3.6-6.2 7.5-6.2 13.4 0 4.8 3 8.4 5.7 9.8l.5 2.8h1l.5-2.8c2.7-1.4 5.7-5 5.7-9.8C23.2 11 18.5 7.1 16 3.5z"
            fill="#10AA50"
          />
          <line x1="16" y1="8" x2="16" y2="27" stroke="#A7F3D0" strokeWidth="1.3" />
        </svg>
      );
    case 'docker':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="6" y="11" width="4" height="3.5" rx="0.6" fill="#38BDF8" />
          <rect x="11" y="11" width="4" height="3.5" rx="0.6" fill="#38BDF8" />
          <rect x="16" y="11" width="4" height="3.5" rx="0.6" fill="#38BDF8" />
          <rect x="11" y="6.5" width="4" height="3.5" rx="0.6" fill="#38BDF8" />
          <rect x="16" y="6.5" width="4" height="3.5" rx="0.6" fill="#38BDF8" />
          <path
            d="M4 16.5h20.5c1.5 0 2.6-.7 3.3-1.8.8 1.5.5 3.8-.8 5.6-1.8 2.6-5.2 4.7-10.5 4.7C9.6 25 4.8 22 4 16.5z"
            fill="#0EA5E9"
          />
        </svg>
      );
    case 'git-github':
    default:
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <line x1="10" y1="7" x2="10" y2="24" stroke="#F97316" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M10 13c0-3 11-2 11 5" stroke="#F97316" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="10" cy="8" r="2.8" fill="#F97316" />
          <circle cx="10" cy="24" r="2.8" fill="#F97316" />
          <circle cx="21" cy="18" r="2.8" fill="#FBBF24" />
        </svg>
      );
  }
}

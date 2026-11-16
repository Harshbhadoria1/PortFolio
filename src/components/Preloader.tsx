import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { HARSH_PROFILE } from '../data/portfolioData';

interface PreloaderProps {
  onFinish: () => void;
}

const CHAPTERS = [
  '01. Python & Data Science',
  '02. Generative AI & Machine Learning',
  '03. Full Stack MERN Engineering',
];

const WAVE_BARS = [
  { delay: '0ms', color: 'from-emerald-400 to-teal-300', peak: 0.48 },
  { delay: '70ms', color: 'from-emerald-400 to-sky-400', peak: 0.72 },
  { delay: '140ms', color: 'from-teal-300 to-sky-400', peak: 0.92 },
  { delay: '210ms', color: 'from-sky-400 to-indigo-400', peak: 0.64 },
  { delay: '280ms', color: 'from-sky-400 to-violet-400', peak: 1.0 },
  { delay: '350ms', color: 'from-indigo-400 to-violet-400', peak: 0.82 },
  { delay: '420ms', color: 'from-violet-400 to-fuchsia-400', peak: 0.56 },
  { delay: '490ms', color: 'from-violet-400 to-amber-300', peak: 0.88 },
  { delay: '560ms', color: 'from-amber-300 to-emerald-400', peak: 0.96 },
  { delay: '630ms', color: 'from-emerald-400 to-sky-400', peak: 0.68 },
  { delay: '700ms', color: 'from-sky-400 to-violet-400', peak: 0.84 },
  { delay: '770ms', color: 'from-violet-400 to-amber-300', peak: 0.54 },
  { delay: '840ms', color: 'from-emerald-300 to-sky-300', peak: 0.76 },
  { delay: '910ms', color: 'from-sky-300 to-emerald-400', peak: 0.45 },
];

const LOUVER_COLUMNS = [0, 1, 2, 3];

export function Preloader({ onFinish }: PreloaderProps) {
  const [progress, setProgress] = useState(12);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [rippleBoost, setRippleBoost] = useState(false);
  const [parting, setParting] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setRemoved(true);
      onFinish();
      return;
    }

    const dismiss = () => {
      setParting(true);
      setTimeout(() => {
        setRemoved(true);
        onFinish();
      }, 420);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKey);

    const timers = [
      setTimeout(() => setProgress(44), 180),
      setTimeout(() => {
        setProgress(76);
        setChapterIdx(1);
      }, 520),
      setTimeout(() => {
        setProgress(100);
        setChapterIdx(2);
      }, 920),
      setTimeout(() => dismiss(), 1480),
    ];

    return () => {
      window.removeEventListener('keydown', handleKey);
      timers.forEach(clearTimeout);
    };
  }, [onFinish]);

  if (removed) return null;

  const triggerEnter = () => {
    if (parting) return;
    setProgress(100);
    setParting(true);
    setTimeout(() => {
      setRemoved(true);
      onFinish();
    }, 380);
  };

  const triggerWaveBoost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRippleBoost(true);
    setProgress((p) => Math.min(100, p + 18));
    setTimeout(() => setRippleBoost(false), 260);
  };

  return (
    <div
      role="dialog"
      aria-label="Kinetic Louver Preloader"
      onClick={triggerEnter}
      className={`fixed inset-0 z-50 cursor-pointer select-none overflow-hidden ${
        parting ? 'pointer-events-none' : ''
      }`}
    >
      {/* 4-Column Architectural Stage Louvers (Lift sequentially on reveal) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-4"
      >
        {LOUVER_COLUMNS.map((col) => (
          <motion.div
            key={col}
            initial={{ y: '0%' }}
            animate={{ y: parting ? '-104%' : '0%' }}
            transition={{
              duration: 0.38,
              delay: parting ? col * 0.045 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative h-full border-r border-white/[0.05] bg-[#05050A] last:border-r-0"
          >
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-emerald-500/[0.07] to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Foreground Typographic & Harmonic Signal Stage */}
      <motion.div
        animate={{ opacity: parting ? 0 : 1, y: parting ? -14 : 0 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex h-full w-full flex-col justify-between px-6 py-8 sm:px-12 sm:py-10"
      >
        {/* Top Bar: Quiet Identity & Tabular Percentage */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-medium tracking-wide text-slate-400">
            {HARSH_PROFILE.name} <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span> Gwalior, India
          </span>
          <span className="font-mono text-xs font-semibold text-emerald-300 tabular-nums">
            {String(progress).padStart(3, '0')}%
          </span>
        </div>

        {/* Centerpiece: Harmonic Wave + Liquid-Filled Typography Wipe */}
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          {/* Interactive GPU Harmonic Signal Wave */}
          <button
            type="button"
            onClick={triggerWaveBoost}
            aria-label="Pulse harmonic signal wave"
            className="group mb-7 flex h-16 items-end justify-center gap-2 rounded-2xl px-4 py-2 transition-transform duration-150 hover:scale-105 active:scale-95 cursor-pointer sm:gap-2.5"
          >
            {WAVE_BARS.map((bar, idx) => (
              <span
                key={idx}
                style={{
                  animationDelay: bar.delay,
                  height: `${Math.round(bar.peak * (rippleBoost ? 52 : 42))}px`,
                }}
                className={`animate-wave-bar w-1.5 rounded-full bg-gradient-to-t ${bar.color} opacity-90 transition-[height] duration-200 sm:w-2`}
              />
            ))}
          </button>

          {/* Outlined Stroke Text + Liquid Gradient Fill Wipe */}
          <div className="relative inline-flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
            <div className="relative inline-block">
              <span
                aria-hidden="true"
                className="font-hero block text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl lg:text-8xl"
                style={{ WebkitTextStroke: '1.25px rgba(255, 255, 255, 0.24)' }}
              >
                HARSH
              </span>
              <span
                className="font-hero shimmer-text absolute inset-0 block text-5xl font-extrabold tracking-tight transition-[clip-path] duration-500 ease-out sm:text-7xl lg:text-8xl"
                style={{ clipPath: `inset(0 ${Math.max(0, 100 - progress)}% 0 0)` }}
              >
                HARSH
              </span>
            </div>

            <span className="font-editorial text-4xl italic text-slate-100 sm:text-6xl lg:text-7xl">
              Bhadoria
            </span>
          </div>

          {/* Hairline Horizon Progress Beam */}
          <div
            aria-hidden="true"
            className="mt-7 h-[2px] w-64 overflow-hidden rounded-full bg-white/10 sm:w-80"
          >
            <div
              style={{ transform: `scaleX(${progress / 100})` }}
              className="h-full w-full origin-left bg-gradient-to-r from-emerald-400 via-sky-400 to-amber-300 transition-transform duration-300 ease-out"
            />
          </div>

          {/* Clean Narrative Chapter Indicator */}
          <p className="mt-4 text-sm font-medium tracking-wide text-slate-300">
            {CHAPTERS[chapterIdx]}
          </p>
        </div>

        {/* Bottom Bar: Minimal Hint & Skip Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Python Data Science <span aria-hidden="true" className="mx-1.5">·</span> Generative AI <span aria-hidden="true" className="mx-1.5">·</span> Full Stack MERN
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerEnter();
            }}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 transition-colors hover:border-emerald-300/50 hover:bg-white/10 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Enter Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
}

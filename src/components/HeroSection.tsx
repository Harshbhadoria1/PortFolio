import {
  ArrowUpRight,
  Coffee,
  Cpu,
  Database,
  FileText,
  Github,
  Linkedin,
  MapPin,
  Palette,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DEV_EXCUSES, HARSH_PROFILE } from '../data/portfolioData';
import { pickDevExcuse } from '../utils/portfolioLogic';
import type { AuroraTheme } from './AuroraCanvasBackground';

type BioVibe = 'serious' | 'honest' | 'gwalior';

interface HeroSectionProps {
  onOpenResume: () => void;
  auroraTheme: AuroraTheme;
  onChangeTheme: (theme: AuroraTheme) => void;
}

const VIBE_OPTIONS: { id: BioVibe; label: string }[] = [
  { id: 'serious', label: 'Engineer' },
  { id: 'honest', label: 'Honest Dev' },
  { id: 'gwalior', label: 'Gwalior Mode' },
];

const THEME_OPTIONS: { id: AuroraTheme; label: string; swatch: string }[] = [
  { id: 'aurora', label: 'Aurora Velvet', swatch: 'bg-indigo-400' },
  { id: 'emerald', label: 'Cyber Mint', swatch: 'bg-emerald-400' },
  { id: 'violet', label: 'Neon Prism', swatch: 'bg-violet-400' },
  { id: 'solar', label: 'Solar Dusk', swatch: 'bg-amber-400' },
];

const CYCLING_ROLES = [
  'Python Data Scientist',
  'GenAI & ML Engineer',
  'Full Stack MERN Builder',
  'Gwalior Problem Solver',
];

export function HeroSection({ onOpenResume, auroraTheme, onChangeTheme }: HeroSectionProps) {
  const [vibe, setVibe] = useState<BioVibe>('serious');
  const [chaiCheers, setChaiCheers] = useState(14);
  const [chaiBurstKey, setChaiBurstKey] = useState(0);
  const [excuseIdx, setExcuseIdx] = useState(0);
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIdx((prev) => (prev + 1) % CYCLING_ROLES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleNextExcuse = () => {
    const next = pickDevExcuse(excuseIdx);
    setExcuseIdx(next.index);
  };

  const handleSendChai = () => {
    setChaiCheers((c) => c + 1);
    setChaiBurstKey((k) => k + 1);
  };

  return (
    <section id="about" className="relative pt-28 pb-10 sm:pt-28 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1440px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Mixed Expressive Typography, Animated Role & Bio Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass-surface sheen-card flex flex-col justify-between rounded-3xl p-6 sm:p-8 lg:col-span-7"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-emerald-300/95">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Gwalior, India
                  </span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  {/* Animated Morphing Role Line */}
                  <div className="relative flex h-6 min-w-[185px] items-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={CYCLING_ROLES[roleIdx]}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="font-mono text-xs font-semibold leading-normal text-sky-300 whitespace-nowrap"
                      >
                        {CYCLING_ROLES[roleIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Live Aurora Atmosphere Switcher */}
                <div
                  role="group"
                  aria-label="Switch background aurora palette"
                  className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/70 p-1"
                >
                  <Palette className="ml-1.5 mr-0.5 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  {THEME_OPTIONS.map((opt) => {
                    const active = auroraTheme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChangeTheme(opt.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-white/15 text-white shadow-sm'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${opt.swatch}`} aria-hidden="true" />
                        <span className="hidden sm:inline">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Balanced Typographic Contrast: Syne Bold + Instrument Serif Italic */}
              <h1 className="font-hero mt-5 text-[1.8rem] font-extrabold leading-[1.15] tracking-tight text-white text-balance sm:text-4xl lg:text-[2.55rem] lg:leading-[1.12]">
                Training{' '}
                <span className="font-editorial shimmer-text text-[2.15rem] font-normal italic sm:text-[2.75rem] lg:text-[3rem]">
                  ML models
                </span>
                , shipping MERN{' '}
                <span className="font-editorial bg-gradient-to-r from-amber-200 via-rose-200 to-violet-300 bg-clip-text text-[2.15rem] font-normal italic text-transparent sm:text-[2.75rem] lg:text-[3rem]">
                  craft
                </span>{' '}
                &amp; trusting chai over sleep.
              </h1>

              {/* Bio Tone Switcher */}
              <div className="mt-5">
                <div
                  role="tablist"
                  aria-label="Choose Harsh's Bio Tone"
                  className="inline-flex w-full items-center justify-between gap-1 rounded-xl border border-white/10 bg-slate-950/65 p-1 sm:w-auto sm:justify-start"
                >
                  {VIBE_OPTIONS.map((option) => {
                    const active = vibe === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setVibe(option.id)}
                        className={`flex-1 rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer sm:flex-none sm:px-3.5 ${
                          active
                            ? 'bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 shadow-sm'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                <motion.p
                  key={vibe}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="mt-3.5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base"
                >
                  {HARSH_PROFILE.heroBios[vibe]}
                </motion.p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <p className="font-mono text-xs text-slate-400">
                Python <span aria-hidden="true" className="text-emerald-400">·</span> Pandas &amp; NumPy{' '}
                <span aria-hidden="true" className="text-sky-400">·</span> GenAI &amp; ML{' '}
                <span aria-hidden="true" className="text-violet-400">·</span> React &amp; Node.js{' '}
                <span aria-hidden="true" className="text-amber-400">·</span> Docker &amp; SQL
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <motion.a
                  href="#projects"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/15 transition-opacity hover:opacity-95 whitespace-nowrap shrink-0"
                >
                  Explore Projects
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </motion.a>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onOpenResume}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-emerald-300/45 hover:bg-white/10 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                  View Resume
                </motion.button>

                <motion.a
                  href="#playground"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/15 px-4 py-3 text-sm font-semibold text-violet-200 transition-colors hover:bg-violet-500/25 whitespace-nowrap shrink-0"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
                  AI Playground
                </motion.a>
              </div>

              <div className="flex flex-wrap items-center gap-5 border-t border-white/10 pt-5 text-xs font-medium text-slate-400">
                <a
                  href={HARSH_PROFILE.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  github.com/Harshbhadoria1
                </a>
                <a
                  href={HARSH_PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-300"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Compact Orbital Profile Card + Animated Quote Generator */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between gap-6 lg:col-span-5"
          >
            {/* Compact Orbital Profile Card (Photo Kept Clean & Proportional) */}
            <div className="glass-surface glass-surface-hover sheen-card relative flex flex-col items-center overflow-hidden rounded-3xl p-6 text-center sm:p-7">
              {/* Floating Animated Micro-Icons around Avatar */}
              <div
                aria-hidden="true"
                className="animate-float-gentle absolute top-6 left-7 hidden h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-500/10 text-emerald-300 sm:flex"
              >
                <Cpu className="h-4 w-4" />
              </div>
              <div
                aria-hidden="true"
                className="animate-float-alt absolute top-8 right-7 hidden h-9 w-9 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-500/10 text-violet-300 sm:flex"
              >
                <Database className="h-4 w-4" />
              </div>

              {/* Floating Animated Tech Orbits */}
              <div className="relative mt-2 flex h-48 w-48 items-center justify-center">
                <div
                  aria-hidden="true"
                  className="animate-orbit-slow absolute inset-0 rounded-full border border-dashed border-emerald-400/45"
                >
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-md border border-emerald-400/45 bg-slate-950/90 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                    Python
                  </span>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-md border border-amber-400/45 bg-slate-950/90 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    GenAI
                  </span>
                  <span className="absolute top-1/2 -right-5 -translate-y-1/2 rounded-md border border-violet-400/45 bg-slate-950/90 px-2 py-0.5 font-mono text-[10px] text-violet-300">
                    ML
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="animate-orbit-reverse absolute inset-3 rounded-full border border-sky-400/30"
                />

                {/* Clean Compact Avatar with Prismatic Rim */}
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-emerald-400/75 bg-slate-900 shadow-2xl shadow-emerald-500/15 transition-transform duration-200 hover:scale-105 hover:rotate-2">
                  <img
                    src={HARSH_PROFILE.photoUrl}
                    alt="Harsh Bhadoria profile portrait"
                    referrerPolicy="no-referrer"
                    decoding="async"
                    fetchPriority="high"
                    className="h-full w-full scale-110 object-cover object-[50%_22%]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <h2
                  data-text={HARSH_PROFILE.name}
                  tabIndex={0}
                  className="glitch-name font-hero cursor-default text-2xl font-extrabold tracking-tight text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded"
                >
                  {HARSH_PROFILE.name}
                </h2>
                <p className="mt-1 text-xs font-medium text-emerald-300">
                  B.Tech CSE · ITM University, Gwalior
                </p>
                <p className="mt-1.5 font-mono text-xs text-slate-400">
                  Data Science · GenAI · Full Stack MERN
                </p>
              </div>

              {/* Fun Chai Micro-Interaction with Fuel Meter + Floating Burst */}
              <div className="relative mt-4 flex w-full max-w-[230px] flex-col items-center gap-2.5">
                <AnimatePresence>
                  {chaiBurstKey > 0 && (
                    <motion.span
                      key={`burst-${chaiBurstKey}`}
                      initial={{ opacity: 1, y: 0, scale: 0.85 }}
                      animate={{ opacity: 0, y: -36, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-6 font-mono text-xs font-bold text-amber-300"
                    >
                      +1 Masala Chai!
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.9, rotate: -6 }}
                  onClick={handleSendChai}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-300/35 bg-amber-400/15 px-4 py-2 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-400/25 cursor-pointer"
                >
                  <Coffee className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                  Send Chai ({chaiCheers})
                </motion.button>

                {/* Live Chai Fuel Gauge */}
                <div className="w-full">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span>Chai Fuel</span>
                    <span className="text-amber-300">
                      {Math.min(100, Math.round((chaiCheers / 20) * 100))}%
                      {chaiCheers >= 20 ? ' · Overdrive' : ''}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      animate={{ width: `${Math.min(100, (chaiCheers / 20) * 100)}%` }}
                      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Funny Dev Excuse Generator */}
            <div className="glass-surface sheen-card flex flex-1 flex-col justify-between gap-4 rounded-3xl p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs text-amber-300">Certified Developer Truths</p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleNextExcuse}
                  aria-label="Generate another funny developer truth"
                  className="group inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-emerald-400/45 hover:text-white cursor-pointer"
                >
                  <RefreshCw
                    className="h-3.5 w-3.5 text-emerald-300 transition-transform duration-300 group-hover:rotate-90"
                    aria-hidden="true"
                  />
                  Spin Quote
                </motion.button>
              </div>

              <motion.p
                key={excuseIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="font-editorial text-xl leading-snug italic text-white sm:text-2xl"
              >
                {DEV_EXCUSES[excuseIdx]}
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Summary Strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="glass-surface mt-6 grid grid-cols-1 gap-4 rounded-2xl p-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <p className="font-display text-lg font-bold text-white">Python &amp; Data Science</p>
            <p className="mt-1 text-xs text-slate-400">Pandas, NumPy, Matplotlib, Seaborn, SciPy</p>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-emerald-300">GenAI &amp; Machine Learning</p>
            <p className="mt-1 text-xs text-slate-400">Scikit-learn, LLM Workflows, FastAPI &amp; Streamlit</p>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-sky-300">MERN + SQL / NoSQL</p>
            <p className="mt-1 text-xs text-slate-400">React, Node, Express, MySQL, PostgreSQL, MongoDB</p>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-amber-300">DSA &amp; Containers</p>
            <p className="mt-1 text-xs text-slate-400">C++ Algorithms, Docker, Git &amp; GitHub</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import {
  Activity,
  ArrowUpRight,
  Bug,
  Coffee,
  ExternalLink,
  Eye,
  Github,
  Music,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import {
  PROJECTS_DATA,
  WEATHER_MOOD_PRESETS,
  type ProjectCategory,
  type ProjectItem,
} from '../data/portfolioData';
import {
  filterProjects,
  getNextBugSquashRank,
  stepTrainingEpoch,
  type EpochSimulationState,
} from '../utils/portfolioLogic';

interface FeaturedProjectsProps {
  onSelectProject: (project: ProjectItem) => void;
}

const PROJECT_FILTERS: { id: ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'fullstack', label: 'Full Stack MERN' },
  { id: 'realtime', label: 'Real-Time Systems' },
  { id: 'frontend', label: 'Creative Frontend' },
];

export function FeaturedProjects({ onSelectProject }: FeaturedProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const [selectedWeatherId, setSelectedWeatherId] = useState<string>(WEATHER_MOOD_PRESETS[0].id);
  const [squashedBugs, setSquashedBugs] = useState<number>(0);
  const [bugCoords, setBugCoords] = useState<{ x: number; y: number }>({ x: 52, y: 48 });
  const [mlSim, setMlSim] = useState<EpochSimulationState>({
    epoch: 1,
    lossHistory: [0.92],
    accuracy: 54.2,
    chaiCups: 1,
    statusNote: 'Epoch 1 initialized. Click "Run Epoch" or feed the model Masala Chai.',
  });

  const [verdictAccepted, setVerdictAccepted] = useState(false);
  const [dodgeAttempts, setDodgeAttempts] = useState(0);

  const filteredProjects = filterProjects(PROJECTS_DATA, activeFilter);
  const activeMood =
    WEATHER_MOOD_PRESETS.find((w) => w.id === selectedWeatherId) || WEATHER_MOOD_PRESETS[0];

  const handleSquashBug = () => {
    setSquashedBugs((prev) => prev + 1);
    const nextX = 16 + ((squashedBugs * 37 + 29) % 66);
    const nextY = 20 + ((squashedBugs * 53 + 17) % 58);
    setBugCoords({ x: nextX, y: nextY });
  };

  // Build SVG polyline points for live ML loss curve (high loss near top y=14, low loss near bottom y=84)
  const lossPoints = mlSim.lossHistory
    .map((loss, idx) => {
      const denom = Math.max(1, mlSim.lossHistory.length - 1);
      const x = mlSim.lossHistory.length === 1 ? 140 : (idx / denom) * 260 + 10;
      const y = 84 - loss * 70;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <section id="projects" className="section-cv relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1440px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs text-emerald-300">Featured Projects</p>
            <h2 className="font-hero mt-2 text-3xl font-extrabold tracking-tight text-white text-balance sm:text-4xl lg:text-[2.65rem]">
              Shipped products with clean{' '}
              <span className="font-editorial shimmer-text text-4xl font-normal italic sm:text-5xl">
                interfaces
              </span>{' '}
              &amp; real-time impact.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Inspect architecture pipelines inside any project modal or launch live Vercel deployments directly.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter Featured Projects"
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-slate-950/80 p-1"
          >
            {PROJECT_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`relative rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive ? 'text-slate-950' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="projectFilterPill"
                      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400 to-sky-400 shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bento Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {filteredProjects.map((project) => {
            const isHeroBento = project.featuredWide && activeFilter === 'all';
            return (
              <article
                key={project.id}
                className={`glass-surface glass-surface-hover sheen-card group flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-7 ${
                  isHeroBento ? 'lg:col-span-12 lg:grid lg:grid-cols-12 lg:gap-8' : 'lg:col-span-4'
                }`}
              >
                <div className={`flex flex-1 flex-col justify-between ${isHeroBento ? 'lg:col-span-7' : ''}`}>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono text-xs text-slate-400">
                        {project.timeframe} <span aria-hidden="true">·</span> {project.teamLabel}
                      </p>
                      <span className="font-mono text-[11px] font-medium text-emerald-300">
                        {project.impactMetric}
                      </span>
                    </div>

                    <h3 className="font-display mt-3 text-2xl font-bold tracking-tight text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-sky-300">{project.subtitle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{project.summary}</p>

                    {!isHeroBento && (
                      <div className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-slate-300">
                        {project.architectureFlow.map((node, i) => (
                          <span key={node} className="inline-flex items-center gap-1.5">
                            <span className="rounded-lg border border-white/10 bg-slate-950/70 px-2 py-1">
                              {node}
                            </span>
                            {i < project.architectureFlow.length - 1 && (
                              <span aria-hidden="true" className="text-emerald-400">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-4 font-mono text-xs text-slate-400">
                      {project.stack.join(' · ')}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-all hover:scale-[1.02] hover:bg-white/20 active:scale-[0.97] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
                      View Project
                    </button>

                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:scale-[1.02] hover:opacity-95 active:scale-[0.97] whitespace-nowrap shrink-0"
                      >
                        See Live Demo
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition-all hover:scale-[1.02] hover:border-emerald-300/45 hover:text-white active:scale-[0.97] whitespace-nowrap shrink-0"
                      >
                        <Github className="h-3.5 w-3.5" aria-hidden="true" />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>

                {isHeroBento && (
                  <div className="mt-6 flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/75 p-5 lg:col-span-5 lg:mt-0">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-300">
                        System Architecture Blueprint
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {project.architectureFlow.map((node, idx) => (
                          <div
                            key={node}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-xs text-slate-200"
                          >
                            <span className="text-[10px] font-bold text-sky-400">
                              0{idx + 1}
                            </span>
                            <span className="truncate">{node}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-xs leading-relaxed text-slate-300">
                      {project.highlights.slice(0, 2).map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Dedicated Interactive AI & Code Playground */}
        <div id="playground" className="mt-14 scroll-mt-24">
          <div className="mb-8">
            <p className="font-mono text-xs text-amber-300">Interactive Playground</p>
            <h2 className="font-hero mt-2 text-3xl font-extrabold tracking-tight text-white text-balance sm:text-4xl">
              Don&apos;t just read my resume —{' '}
              <span className="font-editorial shimmer-text text-4xl font-normal italic sm:text-5xl">
                play
              </span>{' '}
              with my mini-labs.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Lab 1: Python ML Epoch & Chai Loss Simulator */}
            <div className="glass-surface flex flex-col justify-between rounded-3xl p-6 sm:p-7 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-sky-300">ML Training Simulator</p>
                    <h3 className="font-display mt-1 text-xl font-bold text-white">
                      Chai-Powered Gradient Descent
                    </h3>
                  </div>
                  <button
                    type="button"
                    aria-label="Reset ML training simulator"
                    onClick={() => setMlSim((s) => stepTrainingEpoch(s, 'reset'))}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Live Loss SVG Chart */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/75 p-4">
                  <div className="flex items-center justify-between font-mono text-xs text-slate-400">
                    <span>Epoch {mlSim.epoch}</span>
                    <span className="text-emerald-300 tabular-nums">
                      Acc: {mlSim.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <svg viewBox="0 0 280 96" className="mt-2 h-24 w-full" aria-label="Model loss curve">
                    <line x1="10" y1="84" x2="270" y2="84" stroke="rgba(255,255,255,0.08)" />
                    <line x1="10" y1="48" x2="270" y2="48" stroke="rgba(255,255,255,0.05)" />
                    <polyline
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={lossPoints}
                    />
                  </svg>
                  <p className="mt-1 font-mono text-[11px] text-slate-300">{mlSim.statusNote}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setMlSim((s) => stepTrainingEpoch(s, 'train'))}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-400 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-transform hover:scale-[1.02] hover:bg-sky-300 active:scale-[0.97] cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  Run Epoch
                </button>
                <button
                  type="button"
                  onClick={() => setMlSim((s) => stepTrainingEpoch(s, 'chai'))}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/30 bg-amber-400/15 px-3.5 py-2 text-xs font-semibold text-amber-200 transition-transform hover:scale-[1.02] hover:bg-amber-400/25 active:scale-[0.97] cursor-pointer"
                >
                  <Coffee className="h-3.5 w-3.5" aria-hidden="true" />
                  Add Chai ({mlSim.chaiCups})
                </button>
              </div>
            </div>

            {/* Lab 2: Weather-fm Mood Matcher */}
            <div className="glass-surface flex flex-col justify-between rounded-3xl p-6 sm:p-7 lg:col-span-4">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-sky-300">Weather-fm Preview</p>
                    <h3 className="font-display mt-1 text-xl font-bold text-white">
                      Weather-to-Music
                    </h3>
                  </div>
                  <a
                    href="https://wheather-fm.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300 hover:text-sky-200 whitespace-nowrap shrink-0"
                  >
                    Live
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Select Weather Mood">
                  {WEATHER_MOOD_PRESETS.map((preset) => {
                    const selected = preset.id === activeMood.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setSelectedWeatherId(preset.id)}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                          selected
                            ? 'bg-sky-400 text-slate-950'
                            : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {preset.weatherLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/75 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300">
                      <Music className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold text-white">
                        {activeMood.trackTitle}
                      </p>
                      <p className="font-mono text-[11px] text-slate-400">
                        {activeMood.cityContext} · {activeMood.bpm} BPM
                      </p>
                    </div>
                  </div>
                  <div aria-hidden="true" className="flex h-8 items-end gap-1 shrink-0">
                    {[0, 0.16, 0.32, 0.48].map((delay) => (
                      <span
                        key={`${activeMood.id}-${delay}`}
                        style={{ animationDelay: `${delay}s` }}
                        className="animate-eq-bar h-7 w-1 rounded-full bg-gradient-to-t from-sky-400 to-amber-300"
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-300">{activeMood.vibeNote}</p>
              </div>
            </div>

            {/* Lab 3: Squash the Prod Bug Arcade */}
            <div className="glass-surface flex flex-col justify-between rounded-3xl p-6 sm:p-7 lg:col-span-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-amber-300">Bug Arcade</p>
                  <h3 className="font-display mt-1 text-xl font-bold text-white">
                    Squash Prod Bug
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Reset bug squash score"
                  onClick={() => setSquashedBugs(0)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="relative mt-4 h-36 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/75">
                <div className="pointer-events-none absolute inset-x-3 top-2.5 flex items-center justify-between font-mono text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Activity className="h-3 w-3 text-sky-300" aria-hidden="true" />
                    {squashedBugs}
                  </span>
                  <span className="text-amber-300">{getNextBugSquashRank(squashedBugs)}</span>
                </div>

                <motion.button
                  type="button"
                  aria-label="Squash the runaway production bug"
                  onClick={handleSquashBug}
                  animate={{ left: `${bugCoords.x}%`, top: `${bugCoords.y}%` }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  whileTap={{ scale: 0.78 }}
                  style={{ transform: 'translate(-50%, -50%)' }}
                  className="absolute inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/45 bg-amber-400/20 text-amber-300 shadow-lg hover:bg-amber-400/30 cursor-pointer"
                >
                  <Bug className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-sky-300 shrink-0" aria-hidden="true" />
                Click fast before the demo!
              </p>
            </div>
          </div>

          {/* Playful Recruiter Verdict Widget */}
          <div className="glass-surface mt-6 flex flex-col justify-between gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="font-mono text-xs text-emerald-300">Recruiter Decision Engine</p>
              <h3 className="font-display mt-1 text-xl font-bold text-white">
                {verdictAccepted
                  ? 'Excellent choice — 100% of neural layers in Gwalior approve!'
                  : 'Should we invite Harsh Bhadoria for an interview?'}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {verdictAccepted
                  ? 'Jump straight to the Gmail card below and send your first hello.'
                  : dodgeAttempts > 0
                    ? 'Plot twist: "Maybe Later" politely transformed into a solid Yes.'
                    : 'Zero overfitting guaranteed. Backed by Pandas, GenAI, React & chai.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {verdictAccepted ? (
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-300"
                >
                  Open Gmail Form
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setVerdictAccepted(true)}
                    className="rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-300 cursor-pointer"
                  >
                    Yes, Schedule Intro
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ x: dodgeAttempts === 0 ? 6 : 0 }}
                    onClick={() => {
                      if (dodgeAttempts === 0) {
                        setDodgeAttempts(1);
                      } else {
                        setVerdictAccepted(true);
                      }
                    }}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-300/40 hover:text-white cursor-pointer"
                  >
                    {dodgeAttempts === 0 ? 'Maybe Later' : 'Okay fine, Yes!'}
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

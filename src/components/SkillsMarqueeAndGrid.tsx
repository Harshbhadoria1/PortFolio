import { motion } from 'motion/react';
import { useState } from 'react';
import { SKILLS_DATA, type SkillCategory } from '../data/portfolioData';
import { filterSkills } from '../utils/portfolioLogic';
import { SkillLogo } from './SkillLogos';

const SKILL_TABS: { id: SkillCategory; label: string }[] = [
  { id: 'all', label: 'All (24)' },
  { id: 'ai-ml', label: 'AI, ML & GenAI' },
  { id: 'data-science', label: 'Data Science & Analytics' },
  { id: 'python-dsa', label: 'Python & DSA' },
  { id: 'fullstack', label: 'Full Stack Web' },
  { id: 'databases-devops', label: 'Databases & DevOps' },
];

const MARQUEE_LOGOS: { id: string; label: string }[] = [
  { id: 'genai', label: 'GenAI' },
  { id: 'ml', label: 'Machine Learning' },
  { id: 'python', label: 'Python' },
  { id: 'pandas', label: 'Pandas' },
  { id: 'numpy', label: 'NumPy' },
  { id: 'sklearn', label: 'Scikit-learn' },
  { id: 'matplotlib', label: 'Matplotlib & Seaborn' },
  { id: 'fastapi', label: 'FastAPI' },
  { id: 'flask-streamlit', label: 'Streamlit & Flask' },
  { id: 'dsa', label: 'DSA' },
  { id: 'react', label: 'React.js' },
  { id: 'nodejs', label: 'Node.js & Express' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'mysql', label: 'MySQL' },
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'docker', label: 'Docker' },
  { id: 'git-github', label: 'Git & GitHub' },
];

export function SkillsMarqueeAndGrid() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('genai');

  const visibleSkills = filterSkills(SKILLS_DATA, activeCategory);
  const activeSkill =
    SKILLS_DATA.find((s) => s.id === selectedSkillId) || visibleSkills[0] || SKILLS_DATA[0];

  return (
    <section id="skills" className="section-cv relative py-10 sm:py-16">
      {/* Kinetic Logo Marquee Divider */}
      <div className="mb-10 overflow-hidden border-y border-white/10 bg-slate-950/75 py-3">
        <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap font-mono text-xs text-slate-200 will-change-transform">
          {[...MARQUEE_LOGOS, ...MARQUEE_LOGOS].map((item, idx) => (
            <span key={`${item.id}-${idx}`} className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/5 p-1">
                <SkillLogo id={item.id} />
              </span>
              <span>{item.label}</span>
              <span aria-hidden="true" className="ml-4 text-emerald-400/75">
                /
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1440px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs text-emerald-300">Technical Arsenal · Compact 5-Column Grid</p>
            <h2 className="font-hero mt-1.5 text-3xl font-extrabold tracking-tight text-white text-balance sm:text-4xl">
              Python{' '}
              <span className="font-editorial shimmer-text text-4xl font-normal italic sm:text-5xl">
                Data Science
              </span>
              , GenAI &amp; Dockerized Craft.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Hover or tap any skill card across the 4-to-5 column grid to inspect my honest engineering note in the live spotlight.
            </p>
          </div>

          {/* Interactive Selected Skill Spotlight */}
          {activeSkill && (
            <div
              key={activeSkill.id}
              className="glass-surface sheen-card flex items-center gap-3.5 rounded-2xl border-emerald-400/40 px-4 py-3 lg:w-[420px] shrink-0"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-400/40 bg-slate-950/90 shadow-inner">
                <SkillLogo id={activeSkill.id} />
              </div>
              <div className="min-w-0">
                <p className="font-display truncate text-sm font-bold text-white">
                  {activeSkill.name}
                </p>
                <p className="truncate font-mono text-[11px] text-emerald-300">
                  {activeSkill.proficiency}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-300">
                  {activeSkill.quip}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Category Tabs */}
        <div
          role="tablist"
          aria-label="Filter Skills by Category"
          className="mt-6 flex flex-wrap items-center gap-1.5 self-start rounded-xl border border-white/10 bg-slate-950/80 p-1.5 sm:inline-flex"
        >
          {SKILL_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(tab.id)}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive ? 'text-slate-950' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="skillTabPill"
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400 to-sky-400 shadow-sm"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Ultra-Compact 4-to-5 Column Kinetic Glass Skills Grid (Mobile 2 -> Tablet 3 -> Laptop 4 -> PC/TV 5) */}
        <div
          data-testid="skills-grid"
          className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
        >
          {visibleSkills.map((skill) => {
            const isSelected = activeSkill?.id === skill.id;
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => setSelectedSkillId(skill.id)}
                onMouseEnter={() => setSelectedSkillId(skill.id)}
                className={`glass-surface glass-surface-hover group relative flex items-center gap-2.5 overflow-hidden rounded-2xl p-3 text-left transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer ${
                  isSelected ? 'border-emerald-400/65 bg-emerald-950/35' : ''
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-slate-950/85 shadow-inner transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10">
                  <SkillLogo id={skill.id} />
                </div>

                <div className="min-w-0">
                  <span className="font-display block truncate text-[13px] font-bold text-white transition-colors group-hover:text-emerald-300">
                    {skill.name}
                  </span>
                  <p className="mt-0.5 truncate text-[10.5px] font-medium text-sky-300/85">
                    {skill.proficiency}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

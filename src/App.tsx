import { ArrowUp } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { AuroraCanvasBackground, type AuroraTheme } from './components/AuroraCanvasBackground';
import { ContactSection } from './components/ContactSection';
import { FeaturedProjects } from './components/FeaturedProjects';
import { HeroSection } from './components/HeroSection';
import { JourneyAndResume } from './components/JourneyAndResume';
import { Navbar } from './components/Navbar';
import { Preloader } from './components/Preloader';
import { PySnakeArcade } from './components/PySnakeArcade';
import { SkillsMarqueeAndGrid } from './components/SkillsMarqueeAndGrid';
import { HARSH_PROFILE, type ProjectItem } from './data/portfolioData';

const ProjectDetailModal = lazy(() =>
  import('./components/InteractiveModals').then((m) => ({ default: m.ProjectDetailModal })),
);
const ResumePreviewModal = lazy(() =>
  import('./components/InteractiveModals').then((m) => ({ default: m.ResumePreviewModal })),
);

const ORB_GRADIENTS: Record<AuroraTheme, { top: string; mid: string }> = {
  aurora: {
    top: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0) 70%)',
    mid: 'radial-gradient(circle, rgba(52,211,153,0.14) 0%, rgba(52,211,153,0) 70%)',
  },
  emerald: {
    top: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0) 70%)',
    mid: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0) 70%)',
  },
  violet: {
    top: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0) 70%)',
    mid: 'radial-gradient(circle, rgba(232,121,249,0.14) 0%, rgba(232,121,249,0) 70%)',
  },
  solar: {
    top: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0) 70%)',
    mid: 'radial-gradient(circle, rgba(251,113,133,0.14) 0%, rgba(251,113,133,0) 70%)',
  },
};

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [auroraTheme, setAuroraTheme] = useState<AuroraTheme>('aurora');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const handleHireClick = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 450);
    }
  };

  useEffect(() => {
    const themes: AuroraTheme[] = ['aurora', 'emerald', 'violet', 'solar'];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === 't') {
        setAuroraTheme((prev) => themes[(themes.indexOf(prev) + 1) % themes.length]);
      } else if (key === 'r') {
        setResumeOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeOrbColors = ORB_GRADIENTS[auroraTheme];

  return (
    <div id="top" className="relative min-h-screen overflow-x-clip bg-[#05050A] text-slate-100">
      <AnimatePresence>
        {!preloaderDone && <Preloader onFinish={() => setPreloaderDone(true)} />}
      </AnimatePresence>

      {/* Interactive Silk Aurora Canvas Background */}
      <AuroraCanvasBackground theme={auroraTheme} />

      {/* Zero-Blur Radial Atmospheric Orbs & Floating Geometry */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          style={{ background: activeOrbColors.top }}
          className="absolute -top-36 left-[-8%] h-[540px] w-[540px] rounded-full"
        />
        <div
          style={{ background: activeOrbColors.mid }}
          className="absolute top-[32%] right-[-10%] h-[520px] w-[520px] rounded-full"
        />
        <div className="animate-float-gentle absolute top-44 right-[10%] hidden h-16 w-16 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 lg:block" />
        <div className="animate-float-gentle absolute top-[55%] left-[4%] hidden h-12 w-12 rotate-45 rounded-xl border border-amber-300/20 bg-amber-400/5 lg:block" />
      </div>

      <Navbar onHireClick={handleHireClick} />

      <main className="relative z-10">
        <HeroSection
          onOpenResume={() => setResumeOpen(true)}
          auroraTheme={auroraTheme}
          onChangeTheme={setAuroraTheme}
        />
        <SkillsMarqueeAndGrid />
        <FeaturedProjects onSelectProject={(proj) => setSelectedProject(proj)} />
        <JourneyAndResume onOpenResume={() => setResumeOpen(true)} />
        <PySnakeArcade />
        <ContactSection emailInputRef={emailInputRef} />
      </main>

      {/* Clean Minimal Footer (Zero Terminal) */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/85 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8 2xl:max-w-[1440px]">
          <p className="text-center text-xs text-slate-400 sm:text-left">
            © {new Date().getFullYear()} {HARSH_PROFILE.name}. Built in Gwalior with Python Data Science curiosity, React &amp; Liquid Glassmorphism.{' '}
            <span className="hidden font-mono text-[11px] text-slate-500 md:inline">
              · Shortcuts: [T] Aurora Theme · [R] Resume
            </span>
          </p>
          <a
            href="#top"
            aria-label="Scroll back to top"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </footer>

      <Suspense fallback={null}>
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
        <ResumePreviewModal
          open={resumeOpen}
          onClose={() => setResumeOpen(false)}
        />
      </Suspense>
    </div>
  );
}

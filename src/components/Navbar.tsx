import { Menu, X } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useState } from 'react';
import { HARSH_PROFILE } from '../data/portfolioData';
import { AnimatedLogo } from './AnimatedLogo';

interface NavbarProps {
  onHireClick: () => void;
}

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Playground', href: '#playground' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({ onHireClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 32, restDelta: 0.001 });

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl 2xl:max-w-[1440px]">
        <div className="glass-nav relative flex items-center justify-between gap-8 rounded-2xl px-4 py-2.5 sm:px-5">
          {/* Top Scroll Progress Bar */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX }}
            className="pointer-events-none absolute inset-x-4 bottom-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 via-violet-400 to-amber-300"
          />

          {/* Zone 1: Animated Brand Logo + Wordmark */}
          <a
            href="#top"
            className="inline-flex items-center gap-3 font-hero text-lg font-extrabold tracking-tight text-white transition-colors hover:text-emerald-300 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 rounded-md"
          >
            <AnimatedLogo size="sm" />
            <span>{HARSH_PROFILE.name}</span>
          </a>

          {/* Zone 2: Desktop Nav Links */}
          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative py-1 text-sm font-medium text-slate-300 transition-colors hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 rounded-sm"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-emerald-400 to-sky-400 transition-transform duration-200 group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={onHireClick}
              className="hidden sm:inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-sm font-bold text-slate-950 transition-opacity hover:opacity-95 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              Hire Harsh
            </motion.button>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 md:hidden cursor-pointer"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="glass-nav mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onHireClick();
              }}
              className="mt-2 rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300 cursor-pointer"
            >
              Hire Harsh
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

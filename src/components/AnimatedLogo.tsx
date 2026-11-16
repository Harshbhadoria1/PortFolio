import { motion } from 'motion/react';

interface AnimatedLogoProps {
  size?: 'sm' | 'lg';
}

export function AnimatedLogo({ size = 'sm' }: AnimatedLogoProps) {
  const dimensions = size === 'lg' ? 'h-24 w-24' : 'h-10 w-10';

  return (
    <motion.div
      whileHover={{ rotate: 14, scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 320, damping: 16 }}
      className={`relative inline-flex items-center justify-center ${dimensions} shrink-0`}
      aria-hidden="true"
    >
      {/* Outer Holographic Orbital Ring */}
      <svg
        viewBox="0 0 100 100"
        className="animate-orbit-slow absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <linearGradient id={`hb-ring-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="35%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={`url(#hb-ring-${size})`}
          strokeWidth={size === 'lg' ? '2.5' : '4.2'}
          strokeDasharray="18 10 42 10"
          strokeLinecap="round"
        />
        <circle cx="95" cy="50" r={size === 'lg' ? '3.5' : '5.5'} fill="#FBBF24" />
        <circle cx="5" cy="50" r={size === 'lg' ? '3' : '4.5'} fill="#34D399" />
      </svg>

      {/* Inner Counter-Rotating Geometric Reticle */}
      <svg
        viewBox="0 0 100 100"
        className="animate-orbit-reverse absolute inset-0 h-full w-full opacity-80"
        fill="none"
      >
        <polygon
          points="50,15 85,50 50,85 15,50"
          stroke="#A78BFA"
          strokeWidth={size === 'lg' ? '1.8' : '2.4'}
          strokeDasharray="6 8"
          strokeLinejoin="round"
        />
      </svg>

      {/* Luminous Inner Core + Kinetic Monogram */}
      <div className="relative flex h-[62%] w-[62%] items-center justify-center rounded-full border border-white/20 bg-slate-950/90 shadow-inner">
        <span
          className={`font-hero shimmer-text relative font-extrabold tracking-tight ${
            size === 'lg' ? 'text-2xl' : 'text-[11px]'
          }`}
        >
          HB
        </span>
      </div>
    </motion.div>
  );
}

import { useEffect, useRef } from 'react';

export type AuroraTheme = 'aurora' | 'emerald' | 'solar' | 'violet';

interface AuroraCanvasBackgroundProps {
  theme: AuroraTheme;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  colorIndex: number;
}

const PALETTES: Record<
  AuroraTheme,
  { c1: string; c2: string; c3: string; dot: string; mote: string; trail: string[] }
> = {
  aurora: {
    c1: 'rgba(16, 185, 129, 0.22)',
    c2: 'rgba(99, 102, 241, 0.24)',
    c3: 'rgba(56, 189, 248, 0.20)',
    dot: 'rgba(148, 163, 184, 0.14)',
    mote: 'rgba(167, 139, 250, 0.55)',
    trail: ['#34D399', '#38BDF8', '#A78BFA', '#FBBF24'],
  },
  emerald: {
    c1: 'rgba(16, 185, 129, 0.26)',
    c2: 'rgba(20, 184, 166, 0.22)',
    c3: 'rgba(56, 189, 248, 0.18)',
    dot: 'rgba(52, 211, 153, 0.15)',
    mote: 'rgba(52, 211, 153, 0.58)',
    trail: ['#34D399', '#2DD4BF', '#38BDF8', '#A7F3D0'],
  },
  solar: {
    c1: 'rgba(245, 158, 11, 0.22)',
    c2: 'rgba(244, 63, 94, 0.19)',
    c3: 'rgba(56, 189, 248, 0.16)',
    dot: 'rgba(251, 191, 36, 0.14)',
    mote: 'rgba(251, 191, 36, 0.55)',
    trail: ['#FBBF24', '#FB7185', '#F97316', '#38BDF8'],
  },
  violet: {
    c1: 'rgba(167, 139, 250, 0.26)',
    c2: 'rgba(236, 72, 153, 0.19)',
    c3: 'rgba(56, 189, 248, 0.20)',
    dot: 'rgba(192, 132, 252, 0.15)',
    mote: 'rgba(244, 114, 182, 0.55)',
    trail: ['#A78BFA', '#F472B6', '#38BDF8', '#34D399'],
  },
};

function createGlowSprite(color: string): HTMLCanvasElement {
  const sprite = document.createElement('canvas');
  sprite.width = 32;
  sprite.height = 32;
  const sctx = sprite.getContext('2d');
  if (sctx) {
    const grad = sctx.createRadialGradient(16, 16, 1, 16, 16, 15);
    grad.addColorStop(0, color);
    grad.addColorStop(0.45, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 32, 32);
  }
  return sprite;
}

export function AuroraCanvasBackground({ theme }: AuroraCanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<AuroraTheme>(theme);
  const spriteCacheRef = useRef<Record<string, HTMLCanvasElement[]>>({});
  const dotCacheRef = useRef<{ width: number; height: number; theme: AuroraTheme; canvas: HTMLCanvasElement } | null>(null);

  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    // Render soft aurora at 0.5x internal scale for 4x lower pixel fill cost
    const SCALE = 0.5;
    let cssWidth = window.innerWidth;
    let cssHeight = window.innerHeight;
    let width = Math.max(320, Math.floor(cssWidth * SCALE));
    let height = Math.max(240, Math.floor(cssHeight * SCALE));
    canvas.width = width;
    canvas.height = height;

    const pointer = {
      x: width * 0.5,
      y: height * 0.35,
      targetX: width * 0.5,
      targetY: height * 0.35,
      lastTrailX: -999,
      lastTrailY: -999,
    };

    const trailParticles: TrailParticle[] = [];
    const MAX_TRAIL_PARTICLES = 24;
    let colorCursor = 0;

    const motes = Array.from({ length: 22 }, (_, idx) => ({
      x: ((idx * 197) % 1000) / 1000,
      y: ((idx * 313) % 1000) / 1000,
      radius: 0.9 + (idx % 3) * 0.45,
      speed: 0.35 + (idx % 5) * 0.14,
      phase: idx * 0.7,
    }));

    const getSpritesForTheme = (themeName: AuroraTheme) => {
      if (!spriteCacheRef.current[themeName]) {
        spriteCacheRef.current[themeName] = PALETTES[themeName].trail.map(createGlowSprite);
      }
      return spriteCacheRef.current[themeName];
    };

    const getDotLayer = (themeName: AuroraTheme) => {
      const existing = dotCacheRef.current;
      if (
        existing &&
        existing.width === width &&
        existing.height === height &&
        existing.theme === themeName
      ) {
        return existing.canvas;
      }

      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d', { alpha: false });
      if (octx) {
        octx.fillStyle = '#05050A';
        octx.fillRect(0, 0, width, height);
        octx.fillStyle = PALETTES[themeName].dot;
        const step = 28; // matches 56px in CSS space
        for (let x = 12; x < width; x += step) {
          for (let y = 12; y < height; y += step) {
            octx.fillRect(x, y, 1, 1);
          }
        }
      }
      dotCacheRef.current = { width, height, theme: themeName, canvas: off };
      return off;
    };

    let t = 0;
    let frameId = 0;
    let lastDrawTime = 0;

    const handleResize = () => {
      cssWidth = window.innerWidth;
      cssHeight = window.innerHeight;
      width = Math.max(320, Math.floor(cssWidth * SCALE));
      height = Math.max(240, Math.floor(cssHeight * SCALE));
      canvas.width = width;
      canvas.height = height;
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = e.clientX * SCALE;
      pointer.targetY = e.clientY * SCALE;

      if (prefersReduced || !isFinePointer) return;

      const dx = e.clientX - pointer.lastTrailX;
      const dy = e.clientY - pointer.lastTrailY;
      if (dx * dx + dy * dy < 100) return;

      pointer.lastTrailX = e.clientX;
      pointer.lastTrailY = e.clientY;

      const colorIndex = colorCursor % 4;
      colorCursor += 1;

      if (trailParticles.length >= MAX_TRAIL_PARTICLES) {
        trailParticles.shift();
      }
      trailParticles.push({
        x: e.clientX * SCALE,
        y: e.clientY * SCALE,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42 - 0.14,
        life: 1,
        maxLife: 22,
        size: 7 + Math.random() * 6,
        colorIndex,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const drawRibbon = (
      baseY: number,
      amp: number,
      freq: number,
      speed: number,
      color: string,
      thickness: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      for (let x = 0; x <= width + 32; x += 32) {
        const wave =
          Math.sin(x * freq + t * speed) * amp +
          Math.cos(x * freq * 0.55 - t * speed * 0.7) * (amp * 0.55);
        ctx.lineTo(x, baseY + wave);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, baseY - amp, 0, baseY + thickness);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'rgba(5, 5, 10, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const render = (now: number) => {
      if (document.hidden) {
        if (!prefersReduced) {
          frameId = requestAnimationFrame(render);
        }
        return;
      }

      // Run at ~60fps when cursor trail is active, and throttle smoothly to ~28fps when idle
      const hasTrail = trailParticles.length > 0;
      const minInterval = hasTrail ? 16 : 34;
      if (lastDrawTime !== 0 && now - lastDrawTime < minInterval) {
        if (!prefersReduced) {
          frameId = requestAnimationFrame(render);
        }
        return;
      }
      const dtScale = lastDrawTime === 0 ? 1 : Math.min(2.5, (now - lastDrawTime) / 16.67);
      lastDrawTime = now;

      const currentTheme = themeRef.current;
      const palette = PALETTES[currentTheme];
      if (!prefersReduced) {
        t += 0.012 * dtScale;
        pointer.x += (pointer.targetX - pointer.x) * 0.1;
        pointer.y += (pointer.targetY - pointer.y) * 0.1;
      }

      // 1. Pre-baked obsidian base + dot matrix (single blit, zero loops)
      ctx.drawImage(getDotLayer(currentTheme), 0, 0);

      // 2. Flowing Silk Aurora Ribbons (3 ribbons at 0.5x scale)
      drawRibbon(height * 0.22, 32, 0.0052, 0.85, palette.c2, 175);
      drawRibbon(height * 0.44, 34, 0.0042, -0.7, palette.c1, 180);
      drawRibbon(height * 0.70, 26, 0.0062, 0.65, palette.c3, 155);

      // 3. Drifting Luminous Stardust Motes (zero save/restore)
      ctx.fillStyle = palette.mote;
      for (const m of motes) {
        const px = ((m.x * width + Math.sin(t * m.speed + m.phase) * 14) + width) % width;
        const py = ((m.y * height - t * 7 * m.speed) % height + height) % height;
        ctx.globalAlpha = 0.35 + 0.48 * (0.5 + 0.5 * Math.sin(t * 2 + m.phase));
        ctx.beginPath();
        ctx.arc(px, py, m.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 4. Interactive Pointer Prismatic Halo
      const halo = ctx.createRadialGradient(pointer.x, pointer.y, 4, pointer.x, pointer.y, 160);
      halo.addColorStop(0, palette.c3);
      halo.addColorStop(1, 'rgba(5, 5, 10, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(
        Math.max(0, pointer.x - 160),
        Math.max(0, pointer.y - 160),
        320,
        320,
      );

      // 5. Sprite-Cached Cursor Trail Particles (zero shadowBlur!)
      if (hasTrail) {
        const sprites = getSpritesForTheme(currentTheme);
        for (let i = trailParticles.length - 1; i >= 0; i--) {
          const p = trailParticles[i];
          p.x += p.vx * dtScale;
          p.y += p.vy * dtScale;
          p.life -= dtScale / p.maxLife;
          if (p.life <= 0) {
            trailParticles.splice(i, 1);
            continue;
          }
          const drawSize = p.size * (0.4 + p.life * 0.6);
          ctx.globalAlpha = p.life * 0.82;
          ctx.drawImage(
            sprites[p.colorIndex],
            p.x - drawSize * 0.5,
            p.y - drawSize * 0.5,
            drawSize,
            drawSize,
          );
        }
        ctx.globalAlpha = 1;
      }

      if (!prefersReduced) {
        frameId = requestAnimationFrame(render);
      }
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="aurora-background"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}

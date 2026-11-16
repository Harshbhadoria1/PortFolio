import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Gamepad2,
  Pause,
  Play,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createInitialSnakeState,
  queueSnakeDirection,
  stepSnakeGame,
  type Direction,
  type SnakeGameState,
} from '../utils/snakeLogic';

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export function PySnakeArcade() {
  const [gameState, setGameState] = useState<SnakeGameState>(() =>
    createInitialSnakeState('idle'),
  );
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = window.localStorage.getItem('harsh_pysnake_best');
      return saved ? Math.max(0, Number.parseInt(saved, 10) || 0) : 0;
    } catch {
      return 0;
    }
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<SnakeGameState>(gameState);
  const particlesRef = useRef<BurstParticle[]>([]);
  const lastStepRef = useRef<number>(0);

  stateRef.current = gameState;

  const updateBestScore = useCallback((score: number) => {
    setBestScore((prev) => {
      const next = Math.max(prev, score);
      try {
        window.localStorage.setItem('harsh_pysnake_best', String(next));
      } catch {
        // Ignore storage errors in sandboxed iframes
      }
      return next;
    });
  }, []);

  const startGame = useCallback(() => {
    particlesRef.current = [];
    lastStepRef.current = performance.now();
    setGameState(createInitialSnakeState('playing'));
  }, []);

  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev.status === 'playing') return { ...prev, status: 'paused' };
      if (prev.status === 'paused') {
        lastStepRef.current = performance.now();
        return { ...prev, status: 'playing' };
      }
      return prev;
    });
  }, []);

  const handleTurn = useCallback((dir: Direction) => {
    setGameState((prev) => {
      if (prev.status === 'idle') {
        lastStepRef.current = performance.now();
        const started = createInitialSnakeState('playing');
        return queueSnakeDirection(started, dir);
      }
      if (prev.status !== 'playing') return prev;
      return queueSnakeDirection(prev, dir);
    });
  }, []);

  // Keyboard listener: active only when playing/paused and never hijacks page scroll otherwise
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      const currentStatus = stateRef.current.status;
      const key = e.key;

      if (currentStatus === 'playing') {
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
          e.preventDefault();
          handleTurn('UP');
        } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
          e.preventDefault();
          handleTurn('DOWN');
        } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
          e.preventDefault();
          handleTurn('LEFT');
        } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
          e.preventDefault();
          handleTurn('RIGHT');
        } else if (key === 'p' || key === 'P') {
          e.preventDefault();
          togglePause();
        }
      } else if (currentStatus === 'paused' && (key === 'p' || key === 'P' || key === ' ')) {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleTurn, togglePause]);

  // Simulation + on-demand Canvas 2D renderer (stops rAF loop completely when idle/gameover)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let rafId = 0;
    let logicalW = 400;
    let logicalH = 260;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      logicalW = Math.max(280, Math.round(rect.width));
      logicalH = Math.max(180, Math.round(rect.height));
      const targetW = Math.round(logicalW * dpr);
      const targetH = Math.round(logicalH * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const drawFrame = (now: number) => {
      const current = stateRef.current;
      if (current.status === 'playing' && now - lastStepRef.current >= current.tickMs) {
        lastStepRef.current = now;
        const { nextState, ateFood } = stepSnakeGame(current);
        stateRef.current = nextState;
        setGameState(nextState);

        if (ateFood) {
          updateBestScore(nextState.score);
          const color = ateFood === 'chai' ? '#FBBF24' : '#34D399';
          for (let i = 0; i < 10; i += 1) {
            const angle = (Math.PI * 2 * i) / 10;
            particlesRef.current.push({
              x: current.food.x + 0.5,
              y: current.food.y + 0.5,
              vx: Math.cos(angle) * (0.08 + Math.random() * 0.08),
              vy: Math.sin(angle) * (0.08 + Math.random() * 0.08),
              life: 1,
              color,
            });
          }
        }
      }

      const activeState = stateRef.current;
      const w = logicalW;
      const h = logicalH;
      const cellW = w / activeState.cols;
      const cellH = h / activeState.rows;

      // Clear background
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, w, h);

      // Subtle data-grid dots
      ctx.fillStyle = 'rgba(148, 163, 184, 0.11)';
      for (let gx = 0; gx < activeState.cols; gx += 1) {
        for (let gy = 0; gy < activeState.rows; gy += 1) {
          ctx.fillRect(gx * cellW + cellW * 0.5 - 0.75, gy * cellH + cellH * 0.5 - 0.75, 1.5, 1.5);
        }
      }

      // Draw Food orb
      const fx = (activeState.food.x + 0.5) * cellW;
      const fy = (activeState.food.y + 0.5) * cellH;
      const pulse = activeState.status === 'playing' ? 0.85 + Math.sin(now * 0.008) * 0.16 : 0.92;
      const radius = Math.min(cellW, cellH) * 0.34 * pulse;

      const foodGlow = ctx.createRadialGradient(fx, fy, 1, fx, fy, radius * 2.2);
      if (activeState.food.kind === 'chai') {
        foodGlow.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
        foodGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      } else {
        foodGlow.addColorStop(0, 'rgba(52, 211, 153, 0.95)');
        foodGlow.addColorStop(1, 'rgba(52, 211, 153, 0)');
      }
      ctx.fillStyle = foodGlow;
      ctx.beginPath();
      ctx.arc(fx, fy, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = activeState.food.kind === 'chai' ? '#FCD34D' : '#34D399';
      ctx.beginPath();
      ctx.arc(fx, fy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Update & draw burst particles
      const alive: BurstParticle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.06;
        if (p.life > 0) {
          alive.push(p);
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x * cellW, p.y * cellH, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      particlesRef.current = alive;

      // Draw Snake body segments
      activeState.snake.forEach((seg, idx) => {
        const pad = Math.min(cellW, cellH) * 0.1;
        const sx = seg.x * cellW + pad;
        const sy = seg.y * cellH + pad;
        const sw = Math.max(4, cellW - pad * 2);
        const sh = Math.max(4, cellH - pad * 2);
        const t = idx / Math.max(1, activeState.snake.length - 1);

        if (idx === 0) {
          ctx.fillStyle = '#38BDF8';
        } else {
          ctx.fillStyle = `rgba(52, 211, 153, ${Math.max(0.42, 0.95 - t * 0.5)})`;
        }

        ctx.beginPath();
        ctx.roundRect(sx, sy, sw, sh, Math.min(6, sw * 0.35));
        ctx.fill();

        if (idx === 0) {
          ctx.fillStyle = '#020617';
          const eyeR = Math.max(1.2, Math.min(sw, sh) * 0.13);
          ctx.beginPath();
          ctx.arc(sx + sw * 0.34, sy + sh * 0.38, eyeR, 0, Math.PI * 2);
          ctx.arc(sx + sw * 0.68, sy + sh * 0.38, eyeR, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (activeState.status === 'playing' || particlesRef.current.length > 0) {
        rafId = requestAnimationFrame(drawFrame);
      } else {
        rafId = 0;
      }
    };

    const startOrDraw = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(drawFrame);
    };

    resizeCanvas();
    startOrDraw();

    const ro = new ResizeObserver(() => {
      resizeCanvas();
      startOrDraw();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [gameState.status, updateBestScore]);

  return (
    <section id="arcade" aria-label="Mini Arcade Game" className="section-cv relative py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1440px]">
        <div className="glass-surface sheen-card rounded-3xl p-5 sm:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left Info, Live HUD & Touch/Mobile D-Pad */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-5">
              <div>
                <p className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-300">
                  <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Mini Break Arcade
                </p>
                <h2 className="font-hero mt-1.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  PySnake{' '}
                  <span className="font-editorial shimmer-text text-3xl font-normal italic sm:text-4xl">
                    Data Hunter
                  </span>
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Eat green Data Nodes (+10) and golden Chai orbs (+25). Guide the Python with Arrow keys, WASD, or the on-screen D-pad.
                </p>
              </div>

              {/* Compact Tabular Score HUD */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-2xl border border-white/10 bg-slate-950/75 px-3 py-2.5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Score
                  </p>
                  <p
                    data-testid="snake-score"
                    className="mt-0.5 font-mono text-xl font-bold text-emerald-300 tabular-nums"
                  >
                    {gameState.score}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/75 px-3 py-2.5">
                  <p className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    <Trophy className="h-3 w-3 text-amber-300" aria-hidden="true" />
                    Best
                  </p>
                  <p className="mt-0.5 font-mono text-xl font-bold text-amber-300 tabular-nums">
                    {Math.max(bestScore, gameState.score)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/75 px-3 py-2.5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Nodes
                  </p>
                  <p className="mt-0.5 font-mono text-xl font-bold text-sky-300 tabular-nums">
                    {gameState.foodsEaten}
                  </p>
                </div>
              </div>

              {/* Primary Action Controls + Touch D-Pad */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {gameState.status === 'idle' || gameState.status === 'gameover' ? (
                    <button
                      type="button"
                      onClick={startGame}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-opacity hover:opacity-95 cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                      {gameState.status === 'gameover' ? 'Play Again' : 'Start PySnake'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={togglePause}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/15 cursor-pointer"
                    >
                      {gameState.status === 'paused' ? (
                        <>
                          <Play className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                          Resume [P]
                        </>
                      ) : (
                        <>
                          <Pause className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                          Pause [P]
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    aria-label="Restart PySnake game"
                    onClick={startGame}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Responsive Touch / Click D-Pad */}
                <div
                  role="group"
                  aria-label="Snake direction controls"
                  className="grid grid-cols-3 gap-1.5"
                >
                  <div />
                  <button
                    type="button"
                    aria-label="Move Snake Up"
                    onClick={() => handleTurn('UP')}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-slate-950/80 text-slate-200 transition-colors hover:border-emerald-400/50 hover:text-emerald-300 active:scale-95 cursor-pointer"
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <div />
                  <button
                    type="button"
                    aria-label="Move Snake Left"
                    onClick={() => handleTurn('LEFT')}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-slate-950/80 text-slate-200 transition-colors hover:border-emerald-400/50 hover:text-emerald-300 active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Move Snake Down"
                    onClick={() => handleTurn('DOWN')}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-slate-950/80 text-slate-200 transition-colors hover:border-emerald-400/50 hover:text-emerald-300 active:scale-95 cursor-pointer"
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Move Snake Right"
                    onClick={() => handleTurn('RIGHT')}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-slate-950/80 text-slate-200 transition-colors hover:border-emerald-400/50 hover:text-emerald-300 active:scale-95 cursor-pointer"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Crisp Canvas2D Arena */}
            <div className="relative lg:col-span-7">
              <div className="relative aspect-[20/13] w-full overflow-hidden rounded-2xl border border-emerald-400/25 bg-[#050814] shadow-2xl">
                <canvas
                  ref={canvasRef}
                  data-testid="pysnake-canvas"
                  aria-label="PySnake interactive canvas arena"
                  className="block h-full w-full"
                />

                {gameState.status !== 'playing' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050814]/75 p-4 text-center">
                    <p className="font-mono text-xs uppercase tracking-widest text-emerald-300">
                      {gameState.status === 'idle'
                        ? 'Ready to Collect Data'
                        : gameState.status === 'paused'
                          ? 'Simulation Paused'
                          : `Game Over · Score ${gameState.score}`}
                    </p>
                    <button
                      type="button"
                      onClick={gameState.status === 'paused' ? togglePause : startGame}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Play className="h-4 w-4" aria-hidden="true" />
                      {gameState.status === 'idle'
                        ? 'Play PySnake'
                        : gameState.status === 'paused'
                          ? 'Resume Run'
                          : 'Try Again'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

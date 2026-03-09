'use client';

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CelebrationType = 'badge' | 'quiz' | 'module' | 'certification';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'star' | 'triangle';
  gravity: number;
  drag: number;
  life: number;
  maxLife: number;
}

interface CelebrationState {
  active: boolean;
  type: CelebrationType;
  progress: number; // 0-1 normalized time
}

interface CelebrationContextType {
  celebrate: (type: CelebrationType) => void;
}

/* ------------------------------------------------------------------ */
/*  Config per celebration type                                        */
/* ------------------------------------------------------------------ */

const CONFIG: Record<
  CelebrationType,
  {
    duration: number;
    title: string;
    subtitle: string;
    icon: string;
    particleCount: number;
    colors: string[];
    glowColor: string;
  }
> = {
  badge: {
    duration: 3000,
    title: 'Badge Unlocked!',
    subtitle: 'You earned a new achievement',
    icon: '\u{1F3C5}',
    particleCount: 60,
    colors: ['#FFD700', '#A855F7', '#3B82F6', '#F59E0B', '#8B5CF6', '#60A5FA'],
    glowColor: '#FFD700',
  },
  quiz: {
    duration: 2500,
    title: 'Quiz Passed!',
    subtitle: 'Great job on the assessment',
    icon: '\u2705',
    particleCount: 40,
    colors: ['#22C55E', '#4ADE80', '#86EFAC', '#16A34A', '#15803D', '#A7F3D0'],
    glowColor: '#22C55E',
  },
  module: {
    duration: 2000,
    title: 'Module Complete!',
    subtitle: 'On to the next chapter',
    icon: '\u{1F4D6}',
    particleCount: 25,
    colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#818CF8', '#A78BFA'],
    glowColor: '#3B82F6',
  },
  certification: {
    duration: 4000,
    title: 'Certification Earned!',
    subtitle: 'You are now certified — congratulations!',
    icon: '\u{1F3C6}',
    particleCount: 80,
    colors: ['#FFD700', '#FDE047', '#FBBF24', '#F59E0B', '#FFFFFF', '#FEF3C7', '#A855F7'],
    glowColor: '#FFD700',
  },
};

/* ------------------------------------------------------------------ */
/*  CSS Keyframes (injected once)                                      */
/* ------------------------------------------------------------------ */

const KEYFRAMES = `
@keyframes cel-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes cel-fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes cel-bounce-in {
  0%   { transform: scale(0); opacity: 0; }
  50%  { transform: scale(1.25); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes cel-glow-pulse {
  0%, 100% { text-shadow: 0 0 20px var(--cel-glow), 0 0 40px var(--cel-glow), 0 0 60px var(--cel-glow); }
  50%      { text-shadow: 0 0 30px var(--cel-glow), 0 0 60px var(--cel-glow), 0 0 90px var(--cel-glow); }
}
@keyframes cel-ring-fill {
  from { stroke-dashoffset: 283; }
  to   { stroke-dashoffset: 0; }
}
@keyframes cel-shine {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes cel-float-up {
  0%   { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
}
@keyframes cel-star-twinkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50%      { opacity: 1; transform: scale(1) rotate(180deg); }
}
@keyframes cel-count-pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}
`;

let keyframesInjected = false;
function injectKeyframes() {
  if (keyframesInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
  keyframesInjected = true;
}

/* ------------------------------------------------------------------ */
/*  Particle helpers                                                   */
/* ------------------------------------------------------------------ */

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function createParticle(
  id: number,
  type: CelebrationType,
  colors: string[],
  canvasW: number,
  canvasH: number,
): Particle {
  const color = colors[Math.floor(Math.random() * colors.length)];
  const shapes: Particle['shape'][] = ['circle', 'square', 'star', 'triangle'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const life = randomBetween(0.7, 1);

  if (type === 'badge' || type === 'certification') {
    // Explode from center
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(type === 'certification' ? 6 : 4, type === 'certification' ? 14 : 10);
    return {
      id,
      x: canvasW / 2,
      y: canvasH / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - randomBetween(2, 5),
      size: randomBetween(4, type === 'certification' ? 10 : 8),
      color,
      opacity: 1,
      rotation: Math.random() * 360,
      rotationSpeed: randomBetween(-8, 8),
      shape: type === 'certification' ? (Math.random() > 0.5 ? 'star' : shape) : shape,
      gravity: 0.15,
      drag: 0.98,
      life,
      maxLife: life,
    };
  }

  if (type === 'quiz') {
    // Rain from top
    return {
      id,
      x: randomBetween(0, canvasW),
      y: randomBetween(-100, -20),
      vx: randomBetween(-1, 1),
      vy: randomBetween(2, 6),
      size: randomBetween(4, 8),
      color,
      opacity: 1,
      rotation: Math.random() * 360,
      rotationSpeed: randomBetween(-5, 5),
      shape,
      gravity: 0.05,
      drag: 0.995,
      life,
      maxLife: life,
    };
  }

  // module — gentle sparkles from random positions
  return {
    id,
    x: randomBetween(canvasW * 0.2, canvasW * 0.8),
    y: randomBetween(canvasH * 0.2, canvasH * 0.8),
    vx: randomBetween(-1.5, 1.5),
    vy: randomBetween(-2, -0.5),
    size: randomBetween(2, 5),
    color,
    opacity: 1,
    rotation: Math.random() * 360,
    rotationSpeed: randomBetween(-3, 3),
    shape: Math.random() > 0.4 ? 'star' : 'circle',
    gravity: 0.02,
    drag: 0.99,
    life,
    maxLife: life,
  };
}

/* ------------------------------------------------------------------ */
/*  Canvas renderer                                                    */
/* ------------------------------------------------------------------ */

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.globalAlpha = p.opacity * (p.life / p.maxLife);
  ctx.fillStyle = p.color;

  const s = p.size;

  switch (p.shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'square':
      ctx.fillRect(-s / 2, -s / 2, s, s);
      break;
    case 'star': {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const method = i === 0 ? 'moveTo' : 'lineTo';
        ctx[method](Math.cos(angle) * s / 2, Math.sin(angle) * s / 2);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -s / 2);
      ctx.lineTo(s / 2, s / 2);
      ctx.lineTo(-s / 2, s / 2);
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  ParticleCanvas — handles the requestAnimationFrame loop            */
/* ------------------------------------------------------------------ */

function ParticleCanvas({
  type,
  duration,
}: {
  type: CelebrationType;
  duration: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);
  const nextIdRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const config = CONFIG[type];
    const particles = particlesRef.current;
    particles.length = 0;

    // Initial burst
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(
        createParticle(nextIdRef.current++, type, config.colors, canvas.width, canvas.height),
      );
    }

    // For certification: additional waves
    const waveTimers: ReturnType<typeof setTimeout>[] = [];
    if (type === 'certification') {
      for (let wave = 1; wave <= 3; wave++) {
        waveTimers.push(
          setTimeout(() => {
            for (let i = 0; i < 30; i++) {
              particles.push(
                createParticle(nextIdRef.current++, type, config.colors, canvas.width, canvas.height),
              );
            }
          }, wave * 800),
        );
      }
    }

    // For quiz: continuous rain
    let rainInterval: ReturnType<typeof setInterval> | null = null;
    if (type === 'quiz') {
      rainInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
          particles.push(
            createParticle(nextIdRef.current++, type, config.colors, canvas.width, canvas.height),
          );
        }
      }, 150);
    }

    startRef.current = performance.now();

    function tick(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fade out particles in the last 30% of the animation
      const fadeMultiplier = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics update
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.life -= 0.005;
        p.opacity = fadeMultiplier;

        // Remove dead particles
        if (p.life <= 0 || p.y > canvas.height + 50 || p.x < -50 || p.x > canvas.width + 50) {
          particles.splice(i, 1);
          continue;
        }

        drawParticle(ctx, p);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      waveTimers.forEach(clearTimeout);
      if (rainInterval) clearInterval(rainInterval);
    };
  }, [type, duration]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Animated counter (for quiz score)                                  */
/* ------------------------------------------------------------------ */

function AnimatedCounter({ from, to, duration }: { from: number; to: number; duration: number }) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, duration]);

  return (
    <span
      style={{
        fontSize: '3rem',
        fontWeight: 800,
        fontVariantNumeric: 'tabular-nums',
        animation: 'cel-count-pulse 0.6s ease-in-out infinite',
        color: '#22C55E',
      }}
    >
      {value}%
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress ring (for module)                                         */
/* ------------------------------------------------------------------ */

function ProgressRing({ duration }: { duration: number }) {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" style={{ marginBottom: 8 }}>
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="rgba(59,130,246,0.15)"
        strokeWidth="6"
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="283"
        strokeDashoffset="283"
        transform="rotate(-90 50 50)"
        style={{
          animation: `cel-ring-fill ${duration * 0.6}ms ease-out forwards`,
          filter: 'drop-shadow(0 0 6px #3B82F680)',
        }}
      />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fill="white"
        fontSize="28"
        style={{ userSelect: 'none' }}
      >
        {'\u2713'}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  CelebrationOverlay — the visible component                         */
/* ------------------------------------------------------------------ */

function CelebrationOverlayInner({
  state,
  onDone,
}: {
  state: CelebrationState;
  onDone: () => void;
}) {
  const config = CONFIG[state.type];
  const [fading, setFading] = useState(false);

  useEffect(() => {
    injectKeyframes();

    const fadeTimer = setTimeout(() => setFading(true), config.duration - 500);
    const doneTimer = setTimeout(onDone, config.duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [config.duration, onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        animation: fading
          ? 'cel-fade-out 500ms ease-out forwards'
          : 'cel-fade-in 300ms ease-out forwards',
      }}
    >
      {/* Dark vignette backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Particle canvas */}
      <ParticleCanvas type={state.type} duration={config.duration} />

      {/* Center content */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          animation: 'cel-bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        {/* Icon */}
        {state.type === 'module' ? (
          <ProgressRing duration={config.duration} />
        ) : state.type === 'quiz' ? (
          <AnimatedCounter from={0} to={100} duration={config.duration * 0.5} />
        ) : (
          <div
            style={{
              fontSize: state.type === 'certification' ? '5rem' : '4rem',
              lineHeight: 1,
              filter: state.type === 'certification'
                ? 'drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 40px #FFD70080)'
                : 'drop-shadow(0 0 12px #FFD70080)',
              ...(state.type === 'certification'
                ? {
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    animation: 'cel-shine 1.5s ease-in-out infinite',
                  }
                : {}),
            }}
          >
            {config.icon}
          </div>
        )}

        {/* Title */}
        <h2
          style={{
            ['--cel-glow' as string]: config.glowColor,
            margin: 0,
            fontSize: state.type === 'certification' ? '2.5rem' : '2rem',
            fontWeight: 800,
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: '-0.02em',
            animation: 'cel-glow-pulse 1.5s ease-in-out infinite',
            textShadow: `0 0 20px ${config.glowColor}, 0 0 40px ${config.glowColor}`,
          }}
        >
          {config.title}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            margin: 0,
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {config.subtitle}
        </p>

        {/* Decorative stars for certification */}
        {state.type === 'certification' && (
          <div style={{ position: 'absolute', inset: -60, pointerEvents: 'none' }}>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const radius = 120;
              return (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`,
                    fontSize: '1.5rem',
                    animation: `cel-star-twinkle 1.2s ease-in-out ${i * 0.15}s infinite`,
                  }}
                >
                  {'\u2B50'}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Context + Provider + Hook                                          */
/* ------------------------------------------------------------------ */

const CelebrationContext = createContext<CelebrationContextType>({
  celebrate: () => {},
});

export function useCelebration(): CelebrationContextType {
  return useContext(CelebrationContext);
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CelebrationState | null>(null);

  const celebrate = useCallback((type: CelebrationType) => {
    setState({ active: true, type, progress: 0 });
  }, []);

  const handleDone = useCallback(() => {
    setState(null);
  }, []);

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      {state?.active && <CelebrationOverlayInner state={state} onDone={handleDone} />}
    </CelebrationContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export                                                     */
/* ------------------------------------------------------------------ */

export default function CelebrationOverlay() {
  // This component is a no-op by itself — use CelebrationProvider + useCelebration()
  // Exported as default per requirements; the provider is the real entry point.
  return null;
}

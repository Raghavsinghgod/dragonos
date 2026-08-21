// DragonOS Wallpaper - Authentic red Chinese dragon embossed on black leather
// The default wallpaper is the real photographic asset at /dragon-wallpaper.jpg
// (not an approximation). Stars/embers are pure CSS; parallax is a single RAF.
import { useEffect, useRef } from 'react';

// Pre-computed star data — no React state or refs
const STARS = Array.from({ length: 50 }, (_, i) => ({
  x: (((i * 37 + 13) % 100) + 100) % 100,
  y: (((i * 53 + 7) % 100) + 100) % 100,
  size: 0.5 + ((i * 31) % 30) / 20,
  delay: ((i * 17) % 50) / 10,
  duration: 2 + ((i * 23) % 40) / 10,
}));

const EMBERS = Array.from({ length: 10 }, (_, i) => ({
  x: 30 + ((i * 41) % 40),
  y: 50 + ((i * 29) % 50),
  delay: ((i * 13) % 80) / 10,
  duration: 5 + ((i * 37) % 60) / 10,
  size: 1 + ((i * 19) % 25) / 10,
}));

export const DEFAULT_WALLPAPER = '/dragon-wallpaper.jpg';

// ─── Main component ───────────────────────────────────────
export default function Wallpaper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  // RAF-throttled parallax — no setState, direct DOM manipulation.
  // Photo is scaled 1.08 so translation never reveals empty edges.
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          const { x, y } = mouseRef.current;
          if (photoRef.current) {
            photoRef.current.style.transform = `scale(1.08) translate(${x * -14}px, ${y * -10}px)`;
          }
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden bg-[#050508]">
      {/* Default wallpaper — the authentic dragon-on-leather photograph */}
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: `url(${DEFAULT_WALLPAPER})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.08)',
          willChange: 'transform',
        }}
        ref={photoRef}
        role="img"
        aria-label="Red Chinese dragon embossed on black leather"
      />

      {/* Subtle crimson ambient bloom behind the dragon */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 50% 48%, rgba(220,38,38,0.05) 0%, transparent 65%)',
        }}
      />

      {/* Stars — ALL CSS animation, zero framer-motion */}
      <div className="stars-layer absolute inset-0 pointer-events-none" aria-hidden="true">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Embers — ALL CSS animation, zero framer-motion */}
      <div className="embers-layer absolute inset-0 pointer-events-none" aria-hidden="true">
        {EMBERS.map((e, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: `${e.x}%`,
              width: e.size,
              height: e.size,
              animationDelay: `${e.delay}s`,
              animationDuration: `${e.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Gentle vignette — the photo is already dark; keep this light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 45%, transparent 40%, rgba(5,5,8,0.35) 70%, rgba(5,5,8,0.7) 100%)',
        }}
      />
    </div>
  );
}

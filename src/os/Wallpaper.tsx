// DragonOS Wallpaper - Premium coiled Chinese dragon on black leather
// OPTIMIZED: CSS animations for stars/embers (0 framer-motion overhead),
// single RAF for parallax, memoized SVG
import { useEffect, useRef, useCallback } from 'react';

// Pre-computed star data — no need for React state or refs
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

// Memoized SVG dragon — renders once, never re-renders
const DragonSVG = (() => {
  const spines = [95, 115, 135, 155, 175, 195, 215];
  const lowerScales = [
    'M225 535 Q235 525 245 535', 'M205 530 Q215 520 225 530',
    'M185 515 Q195 505 205 515', 'M170 495 Q180 485 190 495',
    'M160 470 Q170 460 180 470', 'M165 445 Q175 435 185 445',
    'M185 430 Q195 420 205 430', 'M210 425 Q220 415 230 425',
  ];
  const midScales = [
    'M270 450 Q280 440 290 450', 'M295 440 Q305 430 315 440',
    'M320 425 Q330 415 340 425', 'M345 405 Q355 395 360 405',
    'M358 380 Q365 370 355 375', 'M345 355 Q350 345 340 350',
    'M325 330 Q330 320 320 325', 'M300 315 Q308 308 315 315',
  ];
  const upperScales = [
    'M230 330 Q240 320 250 330', 'M210 325 Q220 315 230 325',
    'M185 315 Q195 305 205 315', 'M165 298 Q175 288 185 298',
    'M152 275 Q160 265 170 275', 'M155 252 Q165 242 175 252',
    'M170 232 Q180 222 190 232', 'M195 218 Q205 208 215 218',
  ];

  return (
    <svg
      viewBox="0 0 500 650"
      className="absolute left-1/2 top-1/2 w-[380px] h-[495px] md:w-[520px] md:h-[675px]"
      style={{ willChange: 'transform' }}
    >
      <defs>
        <radialGradient id="wGlow" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#dc2626" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dragonBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="30%" stopColor="#dc2626" />
          <stop offset="60%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="dragonHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </linearGradient>
        <filter id="wGlow2">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <ellipse cx="250" cy="280" rx="200" ry="260" fill="url(#wGlow)" />

      <g filter="url(#wGlow2)">
        {/* Tail */}
        <path d="M250 610 Q280 620 310 605 Q340 585 350 555 Q355 530 340 510 Q320 495 295 500 Q270 508 260 525" fill="none" stroke="url(#dragonBody)" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
        <path d="M250 610 Q245 625 235 630 Q225 628 230 615" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <path d="M340 515 Q360 505 370 520 Q365 530 350 525" fill="#dc2626" opacity="0.5" />
        <path d="M345 520 Q365 515 375 530 Q370 540 355 535" fill="#dc2626" opacity="0.4" />

        {/* Lower body coil */}
        <path d="M260 525 Q240 545 210 540 Q175 530 155 505 Q140 480 150 455 Q165 430 195 425 Q225 422 250 440" fill="none" stroke="url(#dragonBody)" strokeWidth="14" strokeLinecap="round" />
        <path d="M260 525 Q240 545 210 540 Q175 530 155 505 Q140 480 150 455 Q165 430 195 425 Q225 422 250 440" fill="none" stroke="url(#dragonHighlight)" strokeWidth="5" strokeLinecap="round" opacity="0.3" />

        {/* Mid body coil */}
        <path d="M250 440 Q280 458 310 445 Q345 428 360 395 Q370 365 355 335 Q335 310 305 305 Q275 302 255 320" fill="none" stroke="url(#dragonBody)" strokeWidth="16" strokeLinecap="round" />
        <path d="M250 440 Q280 458 310 445 Q345 428 360 395 Q370 365 355 335 Q335 310 305 305 Q275 302 255 320" fill="none" stroke="url(#dragonHighlight)" strokeWidth="6" strokeLinecap="round" opacity="0.25" />

        {/* Upper body coil */}
        <path d="M255 320 Q230 338 200 330 Q165 318 150 288 Q140 260 155 235 Q175 215 205 212 Q230 210 250 225" fill="none" stroke="url(#dragonBody)" strokeWidth="18" strokeLinecap="round" />
        <path d="M255 320 Q230 338 200 330 Q165 318 150 288 Q140 260 155 235 Q175 215 205 212 Q230 210 250 225" fill="none" stroke="url(#dragonHighlight)" strokeWidth="7" strokeLinecap="round" opacity="0.2" />

        {/* Neck */}
        <path d="M250 225 Q265 205 270 175 Q275 140 265 110 Q255 85 240 75" fill="none" stroke="url(#dragonBody)" strokeWidth="20" strokeLinecap="round" />
        <path d="M250 225 Q265 205 270 175 Q275 140 265 110 Q255 85 240 75" fill="none" stroke="url(#dragonHighlight)" strokeWidth="8" strokeLinecap="round" opacity="0.2" />

        {/* Head */}
        <ellipse cx="230" cy="65" rx="42" ry="32" fill="url(#dragonBody)" />
        <ellipse cx="228" cy="55" rx="30" ry="18" fill="url(#dragonHighlight)" opacity="0.15" />

        {/* Snout */}
        <path d="M195 70 Q185 65 180 58 Q182 50 195 48 Q210 46 225 50" fill="#b91c1c" opacity="0.8" />
        <circle cx="192" cy="58" r="2.5" fill="#7f1d1d" />
        <circle cx="200" cy="56" r="2" fill="#7f1d1d" />
        <ellipse cx="180" cy="55" rx="8" ry="5" fill="#dc2626" opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite" />
        </ellipse>

        {/* Eyes */}
        <ellipse cx="215" cy="55" rx="8" ry="6" fill="#050508" />
        <ellipse cx="248" cy="55" rx="7" ry="5.5" fill="#050508" />
        <circle cx="217" cy="54" r="4" fill="#dc2626" />
        <circle cx="250" cy="54" r="3.5" fill="#dc2626" />
        <ellipse cx="217" cy="54" rx="1.5" ry="3.5" fill="#050508" />
        <ellipse cx="250" cy="54" rx="1.3" ry="3" fill="#050508" />
        <circle cx="219" cy="52" r="1.2" fill="#fca5a5" opacity="0.6" />
        <circle cx="252" cy="52" r="1" fill="#fca5a5" opacity="0.6" />

        {/* Brow ridges */}
        <path d="M200 48 Q210 40 225 43" fill="none" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M238 43 Q252 40 260 47" fill="none" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />

        {/* Horns */}
        <path d="M210 40 Q195 15 185 -5 Q180 -15 190 -20 Q200 -15 205 0 Q212 20 215 38" fill="url(#dragonBody)" opacity="0.95" />
        <path d="M210 40 Q195 15 185 -5 Q180 -15 190 -20" fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.2" />
        <path d="M250 38 Q265 12 278 -8 Q285 -18 275 -22 Q265 -16 260 2 Q252 22 248 38" fill="url(#dragonBody)" opacity="0.95" />
        <path d="M250 38 Q265 12 278 -8 Q285 -18 275 -22" fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.2" />

        {/* Ear fins */}
        <path d="M198 45 Q180 30 175 38 Q178 48 195 50" fill="#b91c1c" opacity="0.6" />
        <path d="M262 43 Q280 28 285 36 Q282 46 265 48" fill="#b91c1c" opacity="0.6" />

        {/* Whiskers */}
        <path d="M195 68 Q160 55 120 40 Q100 32 80 35" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        <path d="M192 75 Q155 68 115 60 Q90 55 65 60" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M195 82 Q165 80 130 78 Q105 78 85 85" fill="none" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <path d="M265 68 Q300 52 340 38 Q360 30 380 32" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        <path d="M268 75 Q305 65 345 55 Q370 48 395 52" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M265 82 Q295 78 330 72 Q355 68 375 75" fill="none" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

        {/* Spines */}
        {spines.map((y, i) => {
          const x = 260 + Math.sin((y - 95) / 130 * Math.PI) * 15;
          const h = 8 + (i % 3) * 3;
          return <path key={`sp${i}`} d={`M${x} ${y} L${x + h} ${y - h * 1.5} L${x + 2} ${y + 3}`} fill="#dc2626" opacity={0.4 + (i % 2) * 0.15} />;
        })}

        {/* Scales */}
        {lowerScales.map((d, i) => <path key={`ls${i}`} d={d} fill="none" stroke="#7f1d1d" strokeWidth="0.8" opacity="0.35" />)}
        {midScales.map((d, i) => <path key={`ms${i}`} d={d} fill="none" stroke="#7f1d1d" strokeWidth="0.8" opacity="0.3" />)}
        {upperScales.map((d, i) => <path key={`us${i}`} d={d} fill="none" stroke="#7f1d1d" strokeWidth="0.8" opacity="0.3" />)}

        {/* Claws */}
        <g opacity="0.7">
          <path d="M150 475 L135 488 M153 478 L140 492 M156 481 L148 495" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M355 400 L370 412 M352 403 L365 418 M349 406 L358 420" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>

        {/* Mouth + chin */}
        <path d="M190 68 Q205 75 225 72 Q245 70 260 65" fill="none" stroke="#7f1d1d" strokeWidth="1.5" opacity="0.5" />
        <path d="M210 80 Q225 88 240 82" fill="none" stroke="#b91c1c" strokeWidth="1" opacity="0.4" />
      </g>
    </svg>
  );
})();

// ─── Main component ───────────────────────────────────────
export default function Wallpaper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragonRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  // RAF-throttled parallax — no setState, direct DOM manipulation
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      };
      // Apply parallax via RAF to avoid layout thrash
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;
          if (dragonRef.current) {
            dragonRef.current.style.transform = `translate(calc(-50% + ${mx * 12}px), calc(-50% + ${my * 12}px))`;
          }
          if (glowRef.current) {
            glowRef.current.style.transform = `translate(calc(-50% + ${mx * 8}px), calc(-50% + ${my * 8}px))`;
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
      {/* Leather texture — CSS filter, no JS overhead */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <filter id="leather">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="6" stitchTiles="stitch" seed="2" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feComponentTransfer in="gray" result="dark">
              <feFuncR type="linear" slope="0.12" intercept="0.02" />
              <feFuncG type="linear" slope="0.12" intercept="0.02" />
              <feFuncB type="linear" slope="0.12" intercept="0.02" />
            </feComponentTransfer>
          </filter>
          <filter id="leatherGrain">
            <feTurbulence type="turbulence" baseFrequency="1.5" numOctaves="3" stitchTiles="stitch" seed="5" result="grain" />
            <feColorMatrix type="saturate" values="0" in="grain" result="gGray" />
            <feComponentTransfer in="gGray">
              <feFuncA type="linear" slope="0.08" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#leather)" />
        <rect width="100%" height="100%" filter="url(#leatherGrain)" />
      </svg>

      {/* Ambient glow — RAF parallax via ref */}
      <div ref={glowRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[700px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.06) 0%, rgba(127,29,29,0.03) 40%, transparent 70%)',
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

      {/* Dragon — RAF parallax via ref, CSS float animation */}
      <div ref={dragonRef} className="absolute left-1/2 top-1/2 dragon-float" style={{ willChange: 'transform' }}>
        {DragonSVG}
      </div>

      {/* Vignette — pure CSS, no JS */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 25%, rgba(5,5,8,0.4) 55%, rgba(5,5,8,0.85) 80%, rgba(5,5,8,0.97) 100%)',
        }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(5,5,8,0.6) 0%, transparent 15%, transparent 85%, rgba(5,5,8,0.6) 100%), linear-gradient(to bottom, rgba(5,5,8,0.3) 0%, transparent 10%, transparent 90%, rgba(5,5,8,0.4) 100%)',
        }} />
    </div>
  );
}

// DragonOS Wallpaper - Black leather texture, red dragon, stars, embers, vignette, parallax
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  x: number; y: number; size: number; delay: number; duration: number;
}
interface Ember {
  x: number; y: number; delay: number; duration: number; size: number;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3,
  }));
}

function generateEmbers(count: number): Ember[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: 60 + Math.random() * 40,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
    size: 2 + Math.random() * 3,
  }));
}

export default function Wallpaper() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const stars = useRef(generateStars(50)).current;
  const embers = useRef(generateEmbers(10)).current;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      setMouse({ x: cx, y: cy });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden bg-[#050508]">
      {/* Leather texture via SVG noise */}
      <svg className="absolute inset-0 w-full h-full opacity-30" aria-hidden="true">
        <filter id="leatherNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#leatherNoise)" opacity="0.4" />
      </svg>

      {/* Stars */}
      {stars.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Embers */}
      {embers.map((e, i) => (
        <motion.div
          key={`ember-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${e.x}%`,
            width: e.size,
            height: e.size,
            background: `radial-gradient(circle, #dc2626 0%, #7f1d1d 60%, transparent 100%)`,
          }}
          animate={{
            y: [0, -200],
            opacity: [0.8, 0],
            x: [0, Math.random() * 40 - 20],
          }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          initial={{ top: `${e.y}%` }}
        />
      ))}

      {/* Red Dragon SVG with parallax */}
      <motion.svg
        viewBox="0 0 400 500"
        className="absolute left-1/2 top-1/2 w-[350px] h-[440px] md:w-[500px] md:h-[625px]"
        style={{
          transform: `translate(calc(-50% + ${mouse.x * 15}px), calc(-50% + ${mouse.y * 15}px))`,
        }}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <radialGradient id="wDragGlow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
          </radialGradient>
          <filter id="wDragFilter">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="200" cy="200" rx="160" ry="200" fill="url(#wDragGlow)" />
        <g filter="url(#wDragFilter)" fill="#dc2626" opacity="0.95">
          {/* Head */}
          <ellipse cx="200" cy="85" rx="45" ry="36" />
          {/* Horns */}
          <path d="M165 65 L148 20 L172 55Z" />
          <path d="M235 65 L252 20 L228 55Z" />
          {/* Eyes */}
          <circle cx="184" cy="80" r="6" fill="#050508" />
          <circle cx="216" cy="80" r="6" fill="#050508" />
          <circle cx="186" cy="79" r="2.5" fill="#dc2626" />
          <circle cx="218" cy="79" r="2.5" fill="#dc2626" />
          {/* Neck */}
          <path d="M170 115 Q145 155 155 210 Q165 250 200 270 Q235 250 245 210 Q255 155 230 115Z" />
          {/* Body */}
          <path d="M155 210 Q115 250 125 310 Q135 355 175 375 Q155 395 145 435 Q165 470 200 480 Q235 470 255 435 Q245 395 225 375 Q265 355 275 310 Q285 250 245 210" />
          {/* Wings */}
          <path d="M150 170 Q100 130 80 160 Q70 190 110 200 Q100 180 120 170 Q110 210 130 205Z" opacity="0.7" />
          <path d="M250 170 Q300 130 320 160 Q330 190 290 200 Q300 180 280 170 Q290 210 270 205Z" opacity="0.7" />
          {/* Claws */}
          <path d="M165 375 L145 395 M171 378 L155 400 M177 381 L165 403" stroke="#dc2626" strokeWidth="2.5" fill="none" />
          <path d="M235 375 L255 395 M229 378 L245 400 M223 381 L235 403" stroke="#dc2626" strokeWidth="2.5" fill="none" />
          {/* Tail */}
          <path d="M200 480 Q220 490 240 485 Q260 475 270 455 Q275 440 260 430" fill="none" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
          {/* Whiskers */}
          <path d="M176 95 Q140 88 130 78" fill="none" stroke="#dc2626" strokeWidth="1.5" />
          <path d="M224 95 Q260 88 270 78" fill="none" stroke="#dc2626" strokeWidth="1.5" />
          {/* Scale details */}
          <path d="M175 180 Q185 190 200 185 Q215 190 225 180" fill="none" stroke="#050508" strokeWidth="1" opacity="0.3" />
          <path d="M170 220 Q185 232 200 225 Q215 232 230 220" fill="none" stroke="#050508" strokeWidth="1" opacity="0.3" />
          <path d="M168 260 Q185 272 200 265 Q215 272 232 260" fill="none" stroke="#050508" strokeWidth="1" opacity="0.3" />
        </g>
      </motion.svg>

      {/* Heavy vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.7) 70%, rgba(5,5,8,0.95) 100%)',
        }}
      />
    </div>
  );
}

// DragonOS Wallpaper - Premium coiled Chinese dragon on black leather
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Star { x: number; y: number; size: number; delay: number; duration: number; }
interface Ember { x: number; y: number; delay: number; duration: number; size: number; }

function genStars(n: number): Star[] {
  return Array.from({ length: n }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: 0.5 + Math.random() * 1.5, delay: Math.random() * 5,
    duration: 2 + Math.random() * 4,
  }));
}
function genEmbers(n: number): Ember[] {
  return Array.from({ length: n }, () => ({
    x: 30 + Math.random() * 40, y: 50 + Math.random() * 50,
    delay: Math.random() * 8, duration: 5 + Math.random() * 6,
    size: 1 + Math.random() * 2.5,
  }));
}

export default function Wallpaper() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const stars = useRef(genStars(50)).current;
  const embers = useRef(genEmbers(10)).current;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouse({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden bg-[#050508]">
      {/* ─── Leather Texture ─── */}
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
          {/* Fine grain overlay for leather feel */}
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

      {/* ─── Subtle ambient red glow behind dragon ─── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[700px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.06) 0%, rgba(127,29,29,0.03) 40%, transparent 70%)',
          transform: `translate(calc(-50% + ${mouse.x * 8}px), calc(-50% + ${mouse.y * 8}px))`,
        }} />

      {/* ─── Twinkling Stars ─── */}
      {stars.map((s, i) => (
        <motion.div key={`s-${i}`} className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.08, 0.5, 0.08] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ─── Rising Embers ─── */}
      {embers.map((e, i) => (
        <motion.div key={`e-${i}`} className="absolute rounded-full"
          style={{
            left: `${e.x}%`, width: e.size, height: e.size,
            background: 'radial-gradient(circle, #dc2626 0%, #7f1d1d 50%, transparent 100%)',
          }}
          animate={{ y: [0, -350], opacity: [0.7, 0], x: [0, (Math.random() - 0.5) * 50] }}
          transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: 'easeOut' }}
          initial={{ top: `${e.y}%` }}
        />
      ))}

      {/* ─── Premium Coiled Chinese Dragon SVG ─── */}
      <motion.svg
        viewBox="0 0 500 650"
        className="absolute left-1/2 top-1/2 w-[380px] h-[495px] md:w-[520px] md:h-[675px]"
        style={{
          transform: `translate(calc(-50% + ${mouse.x * 12}px), calc(-50% + ${mouse.y * 12}px))`,
          filter: 'drop-shadow(0 0 30px rgba(220,38,38,0.15)) drop-shadow(0 0 60px rgba(220,38,38,0.05))',
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
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

        {/* Ambient glow */}
        <ellipse cx="250" cy="280" rx="200" ry="260" fill="url(#wGlow)" />

        <g filter="url(#wGlow2)">
          {/* ═══ TAIL (bottom, curves up-right then spirals) ═══ */}
          <path
            d="M250 610 Q280 620 310 605 Q340 585 350 555 Q355 530 340 510 Q320 495 295 500 Q270 508 260 525"
            fill="none" stroke="url(#dragonBody)" strokeWidth="8" strokeLinecap="round" opacity="0.9"
          />
          {/* Tail tip detail */}
          <path
            d="M250 610 Q245 625 235 630 Q225 628 230 615"
            fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" opacity="0.7"
          />
          {/* Tail fin */}
          <path d="M340 515 Q360 505 370 520 Q365 530 350 525" fill="#dc2626" opacity="0.5" />
          <path d="M345 520 Q365 515 375 530 Q370 540 355 535" fill="#dc2626" opacity="0.4" />

          {/* ═══ LOWER BODY COIL (S-curve bottom) ═══ */}
          <path
            d="M260 525 Q240 545 210 540 Q175 530 155 505 Q140 480 150 455 Q165 430 195 425 Q225 422 250 440"
            fill="none" stroke="url(#dragonBody)" strokeWidth="14" strokeLinecap="round"
          />
          {/* Body highlight strip */}
          <path
            d="M260 525 Q240 545 210 540 Q175 530 155 505 Q140 480 150 455 Q165 430 195 425 Q225 422 250 440"
            fill="none" stroke="url(#dragonHighlight)" strokeWidth="5" strokeLinecap="round" opacity="0.3"
          />

          {/* ═══ MID BODY (S-curve center) ═══ */}
          <path
            d="M250 440 Q280 458 310 445 Q345 428 360 395 Q370 365 355 335 Q335 310 305 305 Q275 302 255 320"
            fill="none" stroke="url(#dragonBody)" strokeWidth="16" strokeLinecap="round"
          />
          <path
            d="M250 440 Q280 458 310 445 Q345 428 360 395 Q370 365 355 335 Q335 310 305 305 Q275 302 255 320"
            fill="none" stroke="url(#dragonHighlight)" strokeWidth="6" strokeLinecap="round" opacity="0.25"
          />

          {/* ═══ UPPER BODY (S-curve top, coils toward head) ═══ */}
          <path
            d="M255 320 Q230 338 200 330 Q165 318 150 288 Q140 260 155 235 Q175 215 205 212 Q230 210 250 225"
            fill="none" stroke="url(#dragonBody)" strokeWidth="18" strokeLinecap="round"
          />
          <path
            d="M255 320 Q230 338 200 330 Q165 318 150 288 Q140 260 155 235 Q175 215 205 212 Q230 210 250 225"
            fill="none" stroke="url(#dragonHighlight)" strokeWidth="7" strokeLinecap="round" opacity="0.2"
          />

          {/* ═══ NECK (curves up to head) ═══ */}
          <path
            d="M250 225 Q265 205 270 175 Q275 140 265 110 Q255 85 240 75"
            fill="none" stroke="url(#dragonBody)" strokeWidth="20" strokeLinecap="round"
          />
          <path
            d="M250 225 Q265 205 270 175 Q275 140 265 110 Q255 85 240 75"
            fill="none" stroke="url(#dragonHighlight)" strokeWidth="8" strokeLinecap="round" opacity="0.2"
          />

          {/* ═══ HEAD ═══ */}
          {/* Head base */}
          <ellipse cx="230" cy="65" rx="42" ry="32" fill="url(#dragonBody)" />
          {/* Head top highlight */}
          <ellipse cx="228" cy="55" rx="30" ry="18" fill="url(#dragonHighlight)" opacity="0.15" />

          {/* Snout */}
          <path d="M195 70 Q185 65 180 58 Q182 50 195 48 Q210 46 225 50" fill="#b91c1c" opacity="0.8" />
          {/* Nostrils */}
          <circle cx="192" cy="58" r="2.5" fill="#7f1d1d" />
          <circle cx="200" cy="56" r="2" fill="#7f1d1d" />
          {/* Fire breath glow */}
          <ellipse cx="180" cy="55" rx="8" ry="5" fill="#dc2626" opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite" />
          </ellipse>

          {/* Eyes */}
          <ellipse cx="215" cy="55" rx="8" ry="6" fill="#050508" />
          <ellipse cx="248" cy="55" rx="7" ry="5.5" fill="#050508" />
          {/* Iris */}
          <circle cx="217" cy="54" r="4" fill="#dc2626" />
          <circle cx="250" cy="54" r="3.5" fill="#dc2626" />
          {/* Pupil slit */}
          <ellipse cx="217" cy="54" rx="1.5" ry="3.5" fill="#050508" />
          <ellipse cx="250" cy="54" rx="1.3" ry="3" fill="#050508" />
          {/* Eye highlight */}
          <circle cx="219" cy="52" r="1.2" fill="#fca5a5" opacity="0.6" />
          <circle cx="252" cy="52" r="1" fill="#fca5a5" opacity="0.6" />

          {/* Brow ridges */}
          <path d="M200 48 Q210 40 225 43" fill="none" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M238 43 Q252 40 260 47" fill="none" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />

          {/* ═══ HORNS (long, curved, majestic) ═══ */}
          {/* Left horn */}
          <path d="M210 40 Q195 15 185 -5 Q180 -15 190 -20 Q200 -15 205 0 Q212 20 215 38"
            fill="url(#dragonBody)" opacity="0.95" />
          <path d="M210 40 Q195 15 185 -5 Q180 -15 190 -20"
            fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.2" />
          {/* Right horn */}
          <path d="M250 38 Q265 12 278 -8 Q285 -18 275 -22 Q265 -16 260 2 Q252 22 248 38"
            fill="url(#dragonBody)" opacity="0.95" />
          <path d="M250 38 Q265 12 278 -8 Q285 -18 275 -22"
            fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.2" />

          {/* Ear fins */}
          <path d="M198 45 Q180 30 175 38 Q178 48 195 50" fill="#b91c1c" opacity="0.6" />
          <path d="M262 43 Q280 28 285 36 Q282 46 265 48" fill="#b91c1c" opacity="0.6" />

          {/* ═══ WHISKERS (long, flowing) ═══ */}
          {/* Left whiskers */}
          <path d="M195 68 Q160 55 120 40 Q100 32 80 35" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          <path d="M192 75 Q155 68 115 60 Q90 55 65 60" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M195 82 Q165 80 130 78 Q105 78 85 85" fill="none" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          {/* Right whiskers */}
          <path d="M265 68 Q300 52 340 38 Q360 30 380 32" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          <path d="M268 75 Q305 65 345 55 Q370 48 395 52" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M265 82 Q295 78 330 72 Q355 68 375 75" fill="none" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

          {/* ═══ MANE / DORSAL FIN ═══ */}
          {/* Spines along the back of the neck */}
          {[95, 115, 135, 155, 175, 195, 215].map((y, i) => {
            const x = 260 + Math.sin((y - 95) / 130 * Math.PI) * 15;
            const h = 8 + (i % 3) * 3;
            return (
              <path key={`spine-${i}`}
                d={`M${x} ${y} L${x + h} ${y - h * 1.5} L${x + 2} ${y + 3}`}
                fill="#dc2626" opacity={0.4 + (i % 2) * 0.15}
              />
            );
          })}

          {/* ═══ SCALES (texture on body coils) ═══ */}
          {/* Lower coil scales */}
          {[
            'M225 535 Q235 525 245 535', 'M205 530 Q215 520 225 530',
            'M185 515 Q195 505 205 515', 'M170 495 Q180 485 190 495',
            'M160 470 Q170 460 180 470', 'M165 445 Q175 435 185 445',
            'M185 430 Q195 420 205 430', 'M210 425 Q220 415 230 425',
          ].map((d, i) => (
            <path key={`ls-${i}`} d={d} fill="none" stroke="#7f1d1d" strokeWidth="0.8" opacity="0.35" />
          ))}
          {/* Mid coil scales */}
          {[
            'M270 450 Q280 440 290 450', 'M295 440 Q305 430 315 440',
            'M320 425 Q330 415 340 425', 'M345 405 Q355 395 360 405',
            'M358 380 Q365 370 355 375', 'M345 355 Q350 345 340 350',
            'M325 330 Q330 320 320 325', 'M300 315 Q308 308 315 315',
          ].map((d, i) => (
            <path key={`ms-${i}`} d={d} fill="none" stroke="#7f1d1d" strokeWidth="0.8" opacity="0.3" />
          ))}
          {/* Upper coil scales */}
          {[
            'M230 330 Q240 320 250 330', 'M210 325 Q220 315 230 325',
            'M185 315 Q195 305 205 315', 'M165 298 Q175 288 185 298',
            'M152 275 Q160 265 170 275', 'M155 252 Q165 242 175 252',
            'M170 232 Q180 222 190 232', 'M195 218 Q205 208 215 218',
          ].map((d, i) => (
            <path key={`us-${i}`} d={d} fill="none" stroke="#7f1d1d" strokeWidth="0.8" opacity="0.3" />
          ))}

          {/* ═══ CLAWS ═══ */}
          {/* Lower body claws (where it coils) */}
          <g opacity="0.7">
            <path d="M150 475 L135 488 M153 478 L140 492 M156 481 L148 495"
              stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M355 400 L370 412 M352 403 L365 418 M349 406 L358 420"
              stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>

          {/* ═══ MOUTH LINE ═══ */}
          <path d="M190 68 Q205 75 225 72 Q245 70 260 65"
            fill="none" stroke="#7f1d1d" strokeWidth="1.5" opacity="0.5" />

          {/* ═══ CHIN DETAIL ═══ */}
          <path d="M210 80 Q225 88 240 82"
            fill="none" stroke="#b91c1c" strokeWidth="1" opacity="0.4" />
        </g>
      </motion.svg>

      {/* ─── Heavy Vignette ─── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 50% 45%, transparent 25%, rgba(5,5,8,0.4) 55%, rgba(5,5,8,0.85) 80%, rgba(5,5,8,0.97) 100%)
          `,
        }} />

      {/* ─── Extra edge darkening ─── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(5,5,8,0.6) 0%, transparent 15%, transparent 85%, rgba(5,5,8,0.6) 100%),
            linear-gradient(to bottom, rgba(5,5,8,0.3) 0%, transparent 10%, transparent 90%, rgba(5,5,8,0.4) 100%)
          `,
        }} />
    </div>
  );
}

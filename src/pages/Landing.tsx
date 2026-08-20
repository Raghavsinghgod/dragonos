// DragonOS Landing Page — A stunning, thematic introduction to the web OS
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';

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

const features = [
  { icon: '🪟', title: 'Floating Windows', desc: 'Drag, resize, snap, and stack — a full window manager in the browser.' },
  { icon: '🐉', title: 'Dragon Wallpaper', desc: 'Animated SVG dragon with parallax, twinkling stars, and rising embers.' },
  { icon: '💻', title: '28 Apps', desc: 'Productivity, creativity, and focus tools — all running inside your browser OS.' },
  { icon: '⌨️', title: 'Keyboard Shortcuts', desc: 'Ctrl+K command palette, Alt+1-9 quick launch, and hidden easter eggs.' },
  { icon: '🔊', title: 'Sound Engine', desc: 'Every interaction has a sound — generated live via the WebAudio API.' },
  { icon: '🚀', title: 'Instant Boot', desc: 'Animated boot sequence with dragon logo and spring-loaded animations.' },
];

const appIcons = ['📊', '📝', '📅', '✅', '💻', '🔢', '🕐', '🎯', '🔄', '📋', '🍅', '⚙️', '📔', '💰', '😊', '🔒', '🎨', '🃏', '⌨️', '🏆', '📈', '🎧', '🌐', '🌍', '🌤️', '📋', '⚡', '📄'];

export default function Landing() {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const stars = useRef(generateStars(40)).current;
  const embers = useRef(generateEmbers(8)).current;
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
    <div ref={containerRef} className="min-h-screen bg-[#050508] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Leather noise texture */}
        <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
          <filter id="lNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#lNoise)" opacity="0.3" />
        </svg>

        {/* Stars */}
        {stars.map((s, i) => (
          <motion.div
            key={`ls-${i}`}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            animate={{ opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Embers */}
        {embers.map((e, i) => (
          <motion.div
            key={`le-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${e.x}%`,
              width: e.size,
              height: e.size,
              background: 'radial-gradient(circle, #dc2626 0%, #7f1d1d 60%, transparent 100%)',
            }}
            animate={{ y: [0, -300], opacity: [0.6, 0] }}
            transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: 'easeOut' }}
            initial={{ top: `${e.y}%` }}
          />
        ))}

        {/* Heavy vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.6) 70%, rgba(5,5,8,0.95) 100%)' }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐉</span>
          <span className="font-display text-lg tracking-wide text-white/90">DragonOS</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="px-5 py-2 rounded-full text-sm font-inter text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 md:pt-20 pb-20">
        {/* Dragon SVG with parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8"
          style={{ transform: `translate(${mouse.x * 10}px, ${mouse.y * 10}px)` }}
        >
          <motion.svg
            viewBox="0 0 200 260"
            className="w-28 h-36 md:w-40 md:h-52"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <defs>
              <radialGradient id="heroGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
              </radialGradient>
              <filter id="heroFilter">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.ellipse
              cx="100" cy="100" rx="80" ry="100"
              fill="url(#heroGlow)"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <g filter="url(#heroFilter)" fill="#dc2626">
              <ellipse cx="100" cy="45" rx="22" ry="18" />
              <path d="M85 35 L78 15 L88 30Z" />
              <path d="M115 35 L122 15 L112 30Z" />
              <circle cx="92" cy="42" r="3" fill="#050508" />
              <circle cx="108" cy="42" r="3" fill="#050508" />
              <circle cx="93" cy="41" r="1" fill="#dc2626" />
              <circle cx="109" cy="41" r="1" fill="#dc2626" />
              <path d="M88 60 Q75 80 80 110 Q85 130 100 140 Q115 130 120 110 Q125 80 112 60Z" />
              <path d="M80 110 Q60 130 65 160 Q70 180 90 190 Q80 200 75 220 Q85 240 100 245 Q115 240 125 220 Q120 200 110 190 Q130 180 135 160 Q140 130 120 110" />
              <path d="M75 90 Q50 70 40 85 Q35 100 55 105 Q50 95 60 90 Q55 110 65 108Z" opacity="0.8" />
              <path d="M125 90 Q150 70 160 85 Q165 100 145 105 Q150 95 140 90 Q145 110 135 108Z" opacity="0.8" />
              <path d="M85 190 L75 200 M88 192 L80 202 M91 194 L85 203" stroke="#dc2626" strokeWidth="1.5" fill="none" />
              <path d="M115 190 L125 200 M112 192 L120 202 M109 194 L115 203" stroke="#dc2626" strokeWidth="1.5" fill="none" />
              <path d="M100 245 Q110 250 120 248 Q130 242 135 230 Q138 220 130 215" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
              <path d="M88 50 Q70 45 65 40" fill="none" stroke="#dc2626" strokeWidth="1" />
              <path d="M112 50 Q130 45 135 40" fill="none" stroke="#dc2626" strokeWidth="1" />
            </g>
          </motion.svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl text-center tracking-wide leading-tight"
        >
          <span className="text-white/95">Your Desktop,</span>
          <br />
          <span className="text-[#dc2626]">Reimagined.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-5 text-center text-white/40 max-w-lg text-sm md:text-base font-inter leading-relaxed"
        >
          A fully interactive web operating system with floating windows, 28 built-in apps,
          an animated dragon wallpaper, sound engine, and everything that makes an OS feel alive —
          all running in your browser.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 flex gap-4"
        >
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-3 rounded-full bg-[#dc2626] text-white font-inter font-medium text-sm hover:bg-[#dc2626]/80 transition-all duration-300 shadow-lg shadow-[#dc2626]/20 hover:shadow-[#dc2626]/40"
          >
            Launch DragonOS
          </button>
          <a
            href="#features"
            className="px-8 py-3 rounded-full border border-white/10 text-white/60 font-inter text-sm hover:bg-white/5 hover:text-white/80 transition-all duration-300"
          >
            Learn More
          </a>
        </motion.div>
      </section>

      {/* App Grid Preview */}
      <section className="relative z-10 px-6 md:px-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl p-6 border border-white/5 overflow-hidden"
            style={{ background: 'rgba(12,12,18,0.6)', backdropFilter: 'blur(40px)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[10px] text-white/20 font-inter">DragonOS Desktop</span>
            </div>
            <div className="grid grid-cols-7 md:grid-cols-10 gap-3">
              {appIcons.map((icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  viewport={{ once: true }}
                  className="aspect-square rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-xl hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200 cursor-default"
                >
                  {icon}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl md:text-3xl text-white/90 tracking-wide">Built Different</h2>
          <p className="mt-3 text-white/30 text-sm font-inter">Everything a desktop OS should be — in a browser tab.</p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: '-50px' }}
              className="p-5 rounded-xl border border-white/5 hover:border-[#dc2626]/10 transition-all duration-300 group"
              style={{ background: 'rgba(12,12,18,0.4)' }}
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 text-sm text-white/80 font-display tracking-wide">{f.title}</h3>
              <p className="mt-2 text-xs text-white/30 font-inter leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="relative z-10 px-6 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-2xl text-center text-white/90 tracking-wide mb-8">Power at Your Fingertips</h2>
          <div className="space-y-3">
            {[
              { keys: 'Ctrl + K', desc: 'Command Palette — fuzzy search all apps' },
              { keys: 'Alt + 1–9', desc: 'Quick launch pinned apps' },
              { keys: 'Alt + D', desc: 'Show / hide desktop' },
              { keys: 'Ctrl + Shift + D', desc: 'Toggle the side drawer' },
              { keys: 'Esc', desc: 'Close overlays and modals' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <span className="text-xs text-white/50 font-inter">{s.desc}</span>
                <kbd className="text-[11px] text-white/30 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono whitespace-nowrap ml-4">
                  {s.keys}
                </kbd>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-3xl mb-4">🐉</p>
          <h2 className="font-display text-2xl md:text-3xl text-white/90 tracking-wide">Ready to Boot?</h2>
          <p className="mt-3 text-sm text-white/30 font-inter">Your desktop is one click away.</p>
          <button
            onClick={() => navigate('/auth')}
            className="mt-8 px-10 py-3.5 rounded-full bg-[#dc2626] text-white font-inter font-medium text-sm hover:bg-[#dc2626]/80 transition-all duration-300 shadow-lg shadow-[#dc2626]/20 hover:shadow-[#dc2626]/40"
          >
            Enter DragonOS
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 md:px-12 py-6 text-center">
        <p className="text-[10px] text-white/20 font-inter">
          DragonOS — A web operating system built with React, TypeScript, and Framer Motion
        </p>
      </footer>
    </div>
  );
}

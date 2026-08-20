// DragonOS Landing Page — 10x Enhanced, premium visual experience
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  AppWindow, Globe, Layers, Keyboard, Volume2, Zap,
  LayoutDashboard, FileText, Calendar, CheckSquare, Terminal,
  Calculator, Timer, Settings, BookOpen, DollarSign, Smile,
  Lock, Palette, Type, Trophy, Activity, Headphones,
  Languages, CloudSun, ClipboardList, FileCode, Target,
  RefreshCw, Columns3, Sparkles, ArrowRight,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────
interface Star { x: number; y: number; size: number; delay: number; duration: number; }
interface Ember { x: number; y: number; delay: number; duration: number; size: number; }

function genStars(n: number): Star[] {
  return Array.from({ length: n }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: 0.5 + Math.random() * 2, delay: Math.random() * 5,
    duration: 2 + Math.random() * 4,
  }));
}
function genEmbers(n: number): Ember[] {
  return Array.from({ length: n }, () => ({
    x: Math.random() * 100, y: 55 + Math.random() * 45,
    delay: Math.random() * 6, duration: 5 + Math.random() * 5,
    size: 1.5 + Math.random() * 3,
  }));
}

// ─── Animated Counter ─────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Data ─────────────────────────────────────────────────
const features = [
  { icon: <AppWindow size={22} />, title: 'Window Manager', desc: 'Drag, snap, stack, and resize floating windows with 8-direction handles — just like a real desktop.' },
  { icon: <Globe size={22} />, title: 'Dragon Wallpaper', desc: 'Animated SVG dragon, twinkling stars, rising embers, and mouse-reactive parallax depth.' },
  { icon: <Layers size={22} />, title: '28 Built-in Apps', desc: 'From Kanban boards to Pomodoro timers, calculators to mood trackers — everything you need.' },
  { icon: <Keyboard size={22} />, title: 'Keyboard Shortcuts', desc: 'Ctrl+K command palette, Alt+1-9 quick launch, and a hidden Konami code easter egg.' },
  { icon: <Volume2 size={22} />, title: 'WebAudio Sound Engine', desc: 'Every click, snap, and open has a procedurally generated sound via the Web Audio API.' },
  { icon: <Zap size={22} />, title: 'Instant Boot Sequence', desc: 'Apple-style animated boot with floating dragon logo, spinning loader, and spring animations.' },
];

const appIconList = [
  { Icon: LayoutDashboard, name: 'Dashboard' }, { Icon: FileText, name: 'Notepad' },
  { Icon: Calendar, name: 'Calendar' }, { Icon: CheckSquare, name: 'Todo' },
  { Icon: Terminal, name: 'Terminal' }, { Icon: Calculator, name: 'Calculator' },
  { Icon: Timer, name: 'Pomodoro' }, { Icon: Target, name: 'Goals' },
  { Icon: RefreshCw, name: 'Habits' }, { Icon: Columns3, name: 'Kanban' },
  { Icon: Settings, name: 'Settings' }, { Icon: BookOpen, name: 'Journal' },
  { Icon: DollarSign, name: 'Expenses' }, { Icon: Smile, name: 'Mood' },
  { Icon: Lock, name: 'Vault' }, { Icon: Palette, name: 'Doodle' },
  { Icon: Layers, name: 'Flashcards' }, { Icon: Type, name: 'Typing Test' },
  { Icon: Trophy, name: 'Achievements' }, { Icon: Activity, name: 'Sys Monitor' },
  { Icon: Headphones, name: 'Focus Sounds' }, { Icon: Globe, name: 'Browser' },
  { Icon: Languages, name: 'Translator' }, { Icon: CloudSun, name: 'Weather' },
  { Icon: ClipboardList, name: 'Clipboard' }, { Icon: Zap, name: 'Quick Notes' },
  { Icon: FileCode, name: 'Markdown' },
];

const stats = [
  { value: 28, suffix: '+', label: 'Built-in Apps' },
  { value: 0, suffix: 'ms', label: 'Input Lag' },
  { value: 100, suffix: '%', label: 'Browser-Based' },
  { value: 12, suffix: '+', label: 'Keyboard Shortcuts' },
];

const shortcuts = [
  { keys: ['Ctrl', 'K'], desc: 'Command Palette', detail: 'Fuzzy search every app by name' },
  { keys: ['Alt', '1-9'], desc: 'Quick Launch', detail: 'Open any pinned app instantly' },
  { keys: ['Alt', 'D'], desc: 'Show Desktop', detail: 'Minimize or restore all windows' },
  { keys: ['Ctrl', '⇧', 'D'], desc: 'Side Drawer', detail: 'Quick actions, clock, and notes' },
  { keys: ['Esc'], desc: 'Close Overlays', detail: 'Dismiss modals, palettes, and menus' },
];

// ─── Dragon SVG Component ─────────────────────────────────
function DragonSVG({ className = '', withGlow = true }: { className?: string; withGlow?: boolean }) {
  return (
    <svg viewBox="0 0 200 260" className={className}>
      <defs>
        <radialGradient id="dGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <filter id="dFilter">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {withGlow && (
          <filter id="dOuterGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        )}
      </defs>
      {withGlow && (
        <motion.ellipse cx="100" cy="100" rx="80" ry="100" fill="url(#dGlow)"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
      <g filter="url(#dFilter)" fill="#dc2626">
        <ellipse cx="100" cy="45" rx="22" ry="18" />
        <path d="M85 35 L78 15 L88 30Z" /><path d="M115 35 L122 15 L112 30Z" />
        <circle cx="92" cy="42" r="3" fill="#050508" />
        <circle cx="108" cy="42" r="3" fill="#050508" />
        <circle cx="93" cy="41" r="1" fill="#ff4444" />
        <circle cx="109" cy="41" r="1" fill="#ff4444" />
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
    </svg>
  );
}

// ─── Window Mockup for Desktop Preview ────────────────────
function WindowMockup({ title, children, className = '', style = {} }: {
  title: string; children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div className={`rounded-xl overflow-hidden ${className}`} style={{
      background: 'rgba(12,12,18,0.88)', backdropFilter: 'blur(40px)',
      border: '1px solid rgba(220,38,38,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      ...style,
    }}>
      <div className="flex items-center gap-2 px-3 h-8 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[9px] text-white/25 font-inter">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

// ─── Terminal Mockup ──────────────────────────────────────
const terminalLines = [
  { prompt: '~', cmd: 'dragonos --status', color: 'text-[#dc2626]' },
  { output: '✓ 28 apps loaded', color: 'text-[#22c55e]' },
  { output: '✓ Window manager active', color: 'text-[#22c55e]' },
  { output: '✓ Sound engine online', color: 'text-[#22c55e]' },
  { output: '✓ Dragon wallpaper rendering', color: 'text-[#22c55e]' },
  { prompt: '~', cmd: 'open terminal', color: 'text-[#dc2626]' },
  { output: 'Terminal launched — Welcome to DragonOS!', color: 'text-white/60' },
];

function TerminalMockup() {
  const [lineIdx, setLineIdx] = useState(-1);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let i = 0;
        const iv = setInterval(() => {
          setLineIdx(i);
          i++;
          if (i >= terminalLines.length) clearInterval(iv);
        }, 400);
      }
    }, { threshold: 0.3 });
    const el = document.getElementById('terminal-mock');
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div id="terminal-mock" className="rounded-xl overflow-hidden font-mono text-[11px] leading-5"
      style={{ background: 'rgba(5,5,8,0.95)', border: '1px solid rgba(220,38,38,0.1)' }}>
      <div className="flex items-center gap-2 px-3 h-7 border-b border-white/5">
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[9px] text-white/20 font-inter">Terminal</span>
      </div>
      <div className="p-3 min-h-[180px]">
        {terminalLines.map((l, i) => (
          <div key={i} className={`${i <= lineIdx ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            {'output' in l ? (
              <span className={l.color}>{l.output}</span>
            ) : (
              <span><span className="text-[#dc2626]">dragon</span><span className="text-white/40">@</span><span className="text-[#dc2626]">{l.prompt}</span> <span className="text-white/80">{l.cmd}</span></span>
            )}
          </div>
        ))}
        {lineIdx >= 0 && lineIdx < terminalLines.length && (
          <span className="inline-block w-2 h-4 bg-[#dc2626] animate-terminalBlink ml-0.5" />
        )}
      </div>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const stars = useRef(genStars(60)).current;
  const embers = useRef(genEmbers(12)).current;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

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

  const pinnedApps = useMemo(() => appIconList.slice(0, 8), []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* ─── Global Background ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Leather noise */}
        <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
          <filter id="lNoise2">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#lNoise2)" opacity="0.3" />
        </svg>

        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #dc2626, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, #dc2626, transparent 70%)' }} />

        {/* Stars */}
        {stars.map((s, i) => (
          <motion.div key={`s-${i}`} className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Embers */}
        {embers.map((e, i) => (
          <motion.div key={`e-${i}`} className="absolute rounded-full"
            style={{
              left: `${e.x}%`, width: e.size, height: e.size,
              background: 'radial-gradient(circle, #dc2626 0%, #7f1d1d 60%, transparent 100%)',
            }}
            animate={{ y: [0, -400], opacity: [0.7, 0] }}
            transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: 'easeOut' }}
            initial={{ top: `${e.y}%` }}
          />
        ))}

        {/* Vignette */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(5,5,8,0.5) 60%, rgba(5,5,8,0.95) 100%)' }} />
      </div>

      {/* ─── Navigation ─── */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-20 flex items-center justify-between px-6 md:px-16 py-5">
        <div className="flex items-center gap-3">
          <div className="animate-glowPulse"><DragonSVG className="w-7 h-9" withGlow={false} /></div>
          <span className="font-display text-lg tracking-widest text-white/90">DRAGONOS</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#features" className="hidden md:block text-xs text-white/40 hover:text-white/70 transition-colors font-inter">Features</a>
          <a href="#apps" className="hidden md:block text-xs text-white/40 hover:text-white/70 transition-colors font-inter">Apps</a>
          <a href="#shortcuts" className="hidden md:block text-xs text-white/40 hover:text-white/70 transition-colors font-inter">Shortcuts</a>
          <button onClick={() => navigate('/dashboard')}
            className="px-5 py-2 rounded-full text-xs font-inter font-medium text-white bg-[#dc2626]/90 hover:bg-[#dc2626] transition-all duration-300 shadow-lg shadow-[#dc2626]/20 hover:shadow-[#dc2626]/40 hover:scale-105 active:scale-95">
            Launch OS
          </button>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 flex flex-col items-center justify-center px-6 pt-8 md:pt-14 pb-16">

        {/* Dragon with animated rings */}
        <div className="relative mb-10"
          style={{ transform: `translate(${mouse.x * 15}px, ${mouse.y * 15}px)` }}>
          {/* Expanding rings */}
          {[0, 0.7, 1.4].map((delay, i) => (
            <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-full border border-[#dc2626]/10 animate-ringExpand"
                style={{ animationDelay: `${delay}s` }} />
            </div>
          ))}
          {/* Dragon */}
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative animate-dragonFloat animate-glowPulse">
            <DragonSVG className="w-32 h-44 md:w-44 md:h-60" />
          </motion.div>
        </div>

        {/* Title with gradient animation */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-center">
          <span className="block font-display text-5xl md:text-7xl lg:text-8xl tracking-wider leading-none text-white/95">
            Your Desktop,
          </span>
          <span className="block font-display text-5xl md:text-7xl lg:text-8xl tracking-wider leading-none mt-1 animate-textGlow"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #ff4444 25%, #dc2626 50%, #991b1b 75%, #dc2626 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 6s ease infinite',
            }}>
            Reimagined.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-center text-white/35 max-w-xl text-sm md:text-base font-inter leading-relaxed">
          A fully interactive web operating system with floating windows, 28 built-in apps,
          animated dragon wallpaper, procedural sound engine — all running in your browser.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')}
            className="group relative px-8 py-3.5 rounded-full bg-[#dc2626] text-white font-inter font-medium text-sm
              hover:bg-[#dc2626]/80 transition-all duration-300 shadow-xl shadow-[#dc2626]/25 hover:shadow-[#dc2626]/50
              hover:scale-105 active:scale-95 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={15} />
              Launch DragonOS
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
          </button>
          <a href="#features"
            className="px-8 py-3.5 rounded-full border border-white/10 text-white/50 font-inter text-sm
              hover:bg-white/5 hover:text-white/80 hover:border-white/20 transition-all duration-300">
            Explore Features
          </a>
        </motion.div>
      </motion.section>

      {/* ─── Desktop Preview with Live Windows ─── */}
      <section className="relative z-10 px-4 md:px-12 pb-20">
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: '-80px' }}
          className="max-w-5xl mx-auto">

          {/* Outer glow frame */}
          <div className="relative p-[1px] rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.05), rgba(220,38,38,0.15))' }}>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(5,5,8,0.95)' }}>
              {/* Titlebar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="ml-3 text-[10px] text-white/20 font-inter tracking-wider">DragonOS Desktop</span>
              </div>

              {/* Desktop area with floating windows */}
              <div className="relative h-[340px] md:h-[420px] overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #050508 0%, #0a0a0f 50%, #050508 100%)' }}>

                {/* Background stars for desktop */}
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="absolute rounded-full bg-white/20"
                    style={{
                      left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                      width: 1 + Math.random() * 1.5, height: 1 + Math.random() * 1.5,
                    }} />
                ))}

                {/* Floating Window 1 — Dashboard */}
                <div className="absolute top-6 left-6 md:left-10 w-[220px] md:w-[280px] animate-windowFloat1">
                  <WindowMockup title="Dashboard">
                    <div className="grid grid-cols-2 gap-2">
                      {['Tasks: 12', 'Habits: 5', 'Goals: 3', 'Streak: 7d'].map((t, i) => (
                        <div key={i} className="rounded-lg p-2 text-[9px] font-inter"
                          style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.08)' }}>
                          <span className="text-white/50">{t}</span>
                        </div>
                      ))}
                    </div>
                    {/* Mini chart */}
                    <div className="mt-2 h-8 flex items-end gap-[2px]">
                      {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm bg-[#dc2626]/30" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </WindowMockup>
                </div>

                {/* Floating Window 2 — Terminal */}
                <div className="absolute top-16 right-4 md:right-16 w-[200px] md:w-[260px] animate-windowFloat2">
                  <WindowMockup title="Terminal">
                    <div className="font-mono text-[9px] leading-4 space-y-1">
                      <div><span className="text-[#dc2626]">dragon</span><span className="text-white/30">@~$</span> <span className="text-white/60">ls apps/</span></div>
                      <div className="text-white/40">dashboard  clock  todo  calendar</div>
                      <div className="text-white/40">terminal   kanban habits goals</div>
                      <div><span className="text-[#dc2626]">dragon</span><span className="text-white/30">@~$</span> <span className="text-white/60">open kanban</span></div>
                      <div className="text-[#22c55e]">✓ Kanban board launched</div>
                    </div>
                  </WindowMockup>
                </div>

                {/* Floating Window 3 — Todo */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-[35%] w-[180px] md:w-[220px] animate-windowFloat3">
                  <WindowMockup title="Todo">
                    <div className="space-y-1.5">
                      {[
                        { text: 'Review PR #42', done: true },
                        { text: 'Deploy v2.1', done: false },
                        { text: 'Write tests', done: false },
                      ].map((t, i) => (
                        <div key={i} className="flex items-center gap-2 text-[9px] font-inter">
                          <div className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center
                            ${t.done ? 'bg-[#dc2626] border-[#dc2626]' : 'border-white/20'}`}>
                            {t.done && <span className="text-[7px] text-white">✓</span>}
                          </div>
                          <span className={t.done ? 'text-white/25 line-through' : 'text-white/50'}>{t.text}</span>
                        </div>
                      ))}
                    </div>
                  </WindowMockup>
                </div>

                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24"
                  style={{ background: 'linear-gradient(to top, rgba(5,5,8,1), transparent)' }} />
              </div>

              {/* Dock bar */}
              <div className="flex items-center justify-center gap-3 py-3 border-t border-white/5"
                style={{ background: 'rgba(12,12,18,0.6)', backdropFilter: 'blur(40px)' }}>
                {pinnedApps.map(({ Icon, name }, i) => (
                  <motion.div key={i} title={name}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center
                      text-white/35 hover:text-[#dc2626] hover:bg-[#dc2626]/[0.06] hover:border-[#dc2626]/15
                      hover:scale-110 hover:-translate-y-1 transition-all duration-200 cursor-default">
                    <Icon size={16} />
                  </motion.div>
                ))}
                <div className="w-px h-6 bg-white/5 mx-1" />
                {appIconList.slice(8, 12).map(({ Icon, name }, i) => (
                  <motion.div key={`m-${i}`} title={name}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/[0.02] border border-white/3 flex items-center justify-center
                      text-white/20 hover:text-white/50 transition-all duration-200 cursor-default">
                    <Icon size={14} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="relative z-10 px-6 md:px-12 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
              className="text-center">
              <div className="font-display text-3xl md:text-4xl text-[#dc2626] tracking-wider">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-[10px] text-white/30 font-inter uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── App Grid ─── */}
      <section id="apps" className="relative z-10 px-6 md:px-12 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] text-[#dc2626]/80 border border-[#dc2626]/15 font-inter uppercase tracking-widest mb-4">
            28 Apps & Counting
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-white/90 tracking-wide">Everything You Need</h2>
          <p className="mt-3 text-white/30 text-sm font-inter max-w-md mx-auto">
            Productivity, creativity, and focus tools — each one a fully functional app running inside your browser.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto grid grid-cols-7 md:grid-cols-9 gap-2 md:gap-3">
          {appIconList.map(({ Icon, name }, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.025 }} viewport={{ once: true }}
              title={name}
              className="aspect-square rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-1
                text-white/30 hover:bg-[#dc2626]/[0.06] hover:border-[#dc2626]/15 hover:text-[#dc2626]
                hover:scale-110 hover:-translate-y-1 transition-all duration-200 cursor-default group">
              <Icon size={16} className="group-hover:drop-shadow-[0_0_6px_rgba(220,38,38,0.4)]" />
              <span className="text-[7px] font-inter opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5">{name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] text-[#dc2626]/80 border border-[#dc2626]/15 font-inter uppercase tracking-widest mb-4">
            Built Different
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-white/90 tracking-wide">Every Detail, Crafted</h2>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }} viewport={{ once: true, margin: '-50px' }}
              className="group relative p-6 rounded-2xl border border-white/5 hover:border-[#dc2626]/20
                transition-all duration-500 overflow-hidden"
              style={{ background: 'rgba(12,12,18,0.4)' }}>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(220,38,38,0.06) 0%, transparent 70%)' }} />
              {/* Shimmer line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
                <div className="h-full w-1/3 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4), transparent)' }} />
              </div>

              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/10 flex items-center justify-center
                  text-[#dc2626] group-hover:bg-[#dc2626]/15 group-hover:scale-110 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-sm text-white/85 font-display tracking-wide">{f.title}</h3>
                <p className="mt-2 text-xs text-white/30 font-inter leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Interactive Terminal Demo ─── */}
      <section className="relative z-10 px-6 md:px-12 py-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] text-[#dc2626]/80 border border-[#dc2626]/15 font-inter uppercase tracking-widest mb-4">
              Live Preview
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-white/90 tracking-wide leading-snug">
              Real Commands.<br />Real Results.
            </h2>
            <p className="mt-4 text-sm text-white/30 font-inter leading-relaxed">
              The built-in terminal responds to real commands. Open apps, check system stats, change themes — all from the command line.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['help', 'open <app>', 'clear', 'stats', 'theme dragon'].map((cmd, i) => (
                <code key={i} className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[10px] text-white/40 font-mono">
                  {cmd}
                </code>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }} viewport={{ once: true }}>
            <TerminalMockup />
          </motion.div>
        </div>
      </section>

      {/* ─── Keyboard Shortcuts ─── */}
      <section id="shortcuts" className="relative z-10 px-6 md:px-12 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] text-[#dc2626]/80 border border-[#dc2626]/15 font-inter uppercase tracking-widest mb-4">
              Keyboard-First
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-white/90 tracking-wide">Power at Your Fingertips</h2>
          </div>

          <div className="space-y-3">
            {shortcuts.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }} viewport={{ once: true }}
                className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5
                  hover:border-[#dc2626]/10 hover:bg-white/[0.03] transition-all duration-300">
                <div>
                  <span className="text-xs text-white/60 font-inter font-medium">{s.desc}</span>
                  <span className="block text-[10px] text-white/25 font-inter mt-0.5">{s.detail}</span>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  {s.keys.map((k, j) => (
                    <span key={j}>
                      <kbd className="text-[10px] text-white/40 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/8
                        font-mono whitespace-nowrap group-hover:border-[#dc2626]/15 group-hover:text-white/50 transition-all">
                        {k}
                      </kbd>
                      {j < s.keys.length - 1 && <span className="text-white/15 mx-0.5 text-[10px]">+</span>}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 px-6 md:px-12 py-28">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }} viewport={{ once: true }}
          className="relative max-w-2xl mx-auto text-center">
          {/* Background rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 0.8, 1.6].map((delay, i) => (
              <div key={i} className="absolute w-64 h-64 rounded-full border border-[#dc2626]/5 animate-ringExpand"
                style={{ animationDelay: `${delay}s` }} />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="animate-dragonFloat animate-glowPulse">
                <DragonSVG className="w-16 h-22" />
              </div>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white/90 tracking-wide animate-textGlow">
              Ready to Boot?
            </h2>
            <p className="mt-4 text-sm text-white/30 font-inter">Your desktop is one click away. No install. No account. Just open.</p>
            <button onClick={() => navigate('/dashboard')}
              className="group mt-10 px-12 py-4 rounded-full bg-[#dc2626] text-white font-inter font-medium text-sm
                hover:bg-[#dc2626]/80 transition-all duration-300 shadow-2xl shadow-[#dc2626]/30 hover:shadow-[#dc2626]/50
                hover:scale-105 active:scale-95 relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles size={15} />
                Enter DragonOS
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <DragonSVG className="w-5 h-6" withGlow={false} />
            <span className="font-display text-xs tracking-widest text-white/30">DRAGONOS</span>
          </div>
          <div className="flex items-center gap-6">
            {['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'].map((t, i) => (
              <span key={i} className="text-[10px] text-white/15 font-inter">{t}</span>
            ))}
          </div>
          <p className="text-[10px] text-white/15 font-inter">© 2026 DragonOS — Built with passion</p>
        </div>
      </footer>
    </div>
  );
}

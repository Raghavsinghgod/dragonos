import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useOS, useDesktop } from '@/core/store';
import { sounds } from '@/core/audio';
import { initApps, prefetchApps } from '@/core/registry';
import Boot from '@/shell/boot';
import WindowManager from '@/shell/windowmanager';
import Dock from '@/shell/dock';
import Launcher from '@/shell/launcher';
import Palette from '@/shell/palette';
import Drawer from '@/shell/drawer';
import Widgets from '@/shell/widgets';
import Sleep from '@/shell/sleep';
import Toasts from '@/shell/toasts';
import Konami from '@/shell/konami';
import { Columns3, Monitor, Settings, Rocket, Volume2, VolumeX, Palette as PaletteIcon, Moon, LayoutGrid } from 'lucide-react';
import type { ReactNode } from 'react';

const LAUNCHABLE_APPS = [
  'dashboard', 'notepad', 'todo', 'calendar', 'terminal', 'calculator', 'clock',
  'goals', 'habits', 'kanban', 'pomodoro', 'settings', 'journal', 'expenses',
  'mood', 'vault', 'doodle', 'flashcards', 'typingtest', 'achievements',
  'systemmonitor', 'focussounds', 'browser', 'translator', 'weather',
  'clipboard', 'quicknotes', 'markdown',
];

// Pre-computed star fields — no state, no refs, pure CSS animation below
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

const wallpaper = '/dragon-wallpaper.jpg';

function Wallpaper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

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
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.08)',
          willChange: 'transform',
        }}
        ref={photoRef}
        role="img"
        aria-label="Red Chinese dragon embossed on black leather"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 50% 48%, rgba(220,38,38,0.05) 0%, transparent 65%)',
        }}
      />
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

interface MenuItem {
  label: string;
  icon: ReactNode;
  action: () => void;
  divider?: boolean;
}

function ContextMenu({ onOpenSettings, onOpenLaunchpad }: { onOpenSettings: () => void; onOpenLaunchpad: () => void }) {
  const { dispatch } = useOS();
  const desktop = useDesktop();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

  const handleContext = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    window.addEventListener('contextmenu', handleContext);
    window.addEventListener('click', close);
    return () => {
      window.removeEventListener('contextmenu', handleContext);
      window.removeEventListener('click', close);
    };
  }, [handleContext, close]);

  const menuItems: MenuItem[] = useMemo(() => [
    { label: 'Cascade Windows', icon: <Columns3 size={14} />, action: () => { dispatch({ type: 'CASCADE_WINDOWS' }); sounds.snap(); } },
    { label: 'Show Desktop', icon: <Monitor size={14} />, action: () => { dispatch({ type: 'SHOW_DESKTOP' }); sounds.minimize(); } },
    { label: 'Settings', icon: <Settings size={14} />, action: () => { onOpenSettings(); sounds.click(); } },
    { label: 'Launchpad', icon: <Rocket size={14} />, action: () => { onOpenLaunchpad(); sounds.click(); } },
    { label: 'Manage Widgets', icon: <LayoutGrid size={14} />, action: () => { document.dispatchEvent(new CustomEvent('dragonos-toggle-widgets')); sounds.click(); } },
    { label: '', icon: null, action: () => {}, divider: true },
    { label: 'Toggle Sound', icon: desktop.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />, action: () => { dispatch({ type: 'TOGGLE_SOUND' }); sounds.click(); } },
    { label: 'Cycle Wallpaper', icon: <PaletteIcon size={14} />, action: () => {
      const themes = ['dragon', 'minimal', 'neon'];
      const next = themes[(themes.indexOf(desktop.wallpaperTheme) + 1) % themes.length];
      dispatch({ type: 'SET_WALLPAPER', theme: next });
      sounds.snap();
    }},
    { label: '', icon: null, action: () => {}, divider: true },
    { label: 'Sleep', icon: <Moon size={14} />, action: () => { dispatch({ type: 'SLEEP' }); sounds.minimize(); } },
  ], [desktop.soundEnabled, desktop.wallpaperTheme, dispatch, onOpenSettings, onOpenLaunchpad]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="lgglass lglass-strong fixed z-[97] min-w-[200px] rounded-xl overflow-hidden py-1"
      style={{ left: pos.x, top: pos.y }}
      onClick={e => e.stopPropagation()}
    >
      {menuItems.map((item, i) => (
        item.divider ? (
          <div key={i} className="my-1 border-t border-white/5" />
        ) : (
          <button
            key={i}
            onClick={() => { item.action(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors font-inter"
          >
            <span className="text-white/40 w-5 flex items-center justify-center">{item.icon}</span>
            {item.label}
          </button>
        )
      ))}
    </motion.div>
  );
}

export function notfound() {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center gap-5 px-6 font-inter">
      <p className="font-display text-7xl md:text-8xl tracking-[0.2em] text-[#dc2626] drop-shadow-[0_0_24px_rgba(220,38,38,0.35)]">
        404
      </p>
      <p className="text-white/60 text-sm md:text-base">
        This corner of the lair doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-2 px-5 py-2.5 rounded-lg border border-[#dc2626]/40 text-[#dc2626] text-sm tracking-wide hover:bg-[#dc2626]/10 hover:border-[#dc2626]/70 transition-colors"
      >
        Return to desktop
      </Link>
    </div>
  );
}

export default function Desktop() {
  const { openApp } = useOS();
  const desktop = useDesktop();
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  useEffect(() => { initApps(); }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent).detail - 1;
      if (idx >= 0 && idx < 9) openApp(LAUNCHABLE_APPS[idx]);
    };
    document.addEventListener('dragonos-open-app-by-index', handler);
    return () => document.removeEventListener('dragonos-open-app-by-index', handler);
  }, [openApp]);

  useEffect(() => {
    const handler = (e: Event) => {
      const name = ((e as CustomEvent).detail as string).toLowerCase();
      const match = LAUNCHABLE_APPS.find(id => id.includes(name));
      if (match) openApp(match);
    };
    document.addEventListener('dragonos-open-app-by-name', handler);
    return () => document.removeEventListener('dragonos-open-app-by-name', handler);
  }, [openApp]);

  const closeStartMenu = useCallback(() => setStartMenuOpen(false), []);
  const openSettings = useCallback(() => openApp('settings'), [openApp]);
  const openLaunchpad = useCallback(() => setStartMenuOpen(true), []);

  const showDesktop = desktop.booted;

  useEffect(() => {
    if (showDesktop) prefetchApps();
  }, [showDesktop]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#050508]">
      {!showDesktop && <Boot />}

      {showDesktop && <Wallpaper />}

      {showDesktop && <WindowManager />}

      {showDesktop && <Dock onOpenLauncher={openLaunchpad} />}

      <Launcher isOpen={startMenuOpen} onClose={closeStartMenu} />

      {showDesktop && (
        <ContextMenu
          onOpenSettings={openSettings}
          onOpenLaunchpad={openLaunchpad}
        />
      )}

      <Palette />

      {showDesktop && <Drawer />}

      <Sleep />

      {showDesktop && <Widgets />}

      <Toasts />

      <Konami />
    </div>
  );
}

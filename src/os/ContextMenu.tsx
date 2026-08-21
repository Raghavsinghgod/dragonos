// DragonOS desktop right-click menu
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS, useDesktop } from './context';
import { sounds } from './sounds';
import { Columns3, Monitor, Settings, Rocket, Volume2, VolumeX, Palette, Moon, LayoutGrid } from 'lucide-react';
import type { ReactNode } from 'react';

interface MenuItem {
  label: string;
  icon: ReactNode;
  action: () => void;
  divider?: boolean;
}

export default function ContextMenu({ onOpenSettings, onOpenLaunchpad }: { onOpenSettings: () => void; onOpenLaunchpad: () => void }) {
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

  // Memoize menu items — only rebuild when desktop state or dispatch changes
  const menuItems: MenuItem[] = useMemo(() => [
    { label: 'Cascade Windows', icon: <Columns3 size={14} />, action: () => { dispatch({ type: 'CASCADE_WINDOWS' }); sounds.snap(); } },
    { label: 'Show Desktop', icon: <Monitor size={14} />, action: () => { dispatch({ type: 'SHOW_DESKTOP' }); sounds.minimize(); } },
    { label: 'Settings', icon: <Settings size={14} />, action: () => { onOpenSettings(); sounds.click(); } },
    { label: 'Launchpad', icon: <Rocket size={14} />, action: () => { onOpenLaunchpad(); sounds.click(); } },
    { label: 'Manage Widgets', icon: <LayoutGrid size={14} />, action: () => { document.dispatchEvent(new CustomEvent('dragonos-toggle-widgets')); sounds.click(); } },
    { label: '', icon: null, action: () => {}, divider: true },
    { label: 'Toggle Sound', icon: desktop.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />, action: () => { dispatch({ type: 'TOGGLE_SOUND' }); sounds.click(); } },
    { label: 'Cycle Wallpaper', icon: <Palette size={14} />, action: () => {
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
      style={{
        left: pos.x,
        top: pos.y,
      }}
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

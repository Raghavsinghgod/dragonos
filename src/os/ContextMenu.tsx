// DragonOS Context Menu - Right-click desktop context menu
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from '../context';
import { sounds } from '../sounds';

interface MenuItem {
  label: string;
  icon: string;
  action: () => void;
  divider?: boolean;
}

export default function ContextMenu({ onOpenSettings, onOpenLaunchpad }: { onOpenSettings: () => void; onOpenLaunchpad: () => void }) {
  const { dispatch, state } = useOS();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

  const handleContext = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    setOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener('contextmenu', handleContext);
    window.addEventListener('click', () => setOpen(false));
    return () => {
      window.removeEventListener('contextmenu', handleContext);
    };
  }, [handleContext]);

  const menuItems: MenuItem[] = [
    { label: 'Cascade Windows', icon: '🪟', action: () => { dispatch({ type: 'CASCADE_WINDOWS' }); sounds.snap(); } },
    { label: 'Show Desktop', icon: '🖥️', action: () => { dispatch({ type: 'SHOW_DESKTOP' }); sounds.minimize(); } },
    { label: 'Settings', icon: '⚙️', action: () => { onOpenSettings(); sounds.click(); } },
    { label: 'Launchpad', icon: '🚀', action: () => { onOpenLaunchpad(); sounds.click(); } },
    { label: '', icon: '', action: () => {}, divider: true },
    { label: 'Toggle Sound', icon: state.desktop.soundEnabled ? '🔊' : '🔇', action: () => { dispatch({ type: 'TOGGLE_SOUND' }); sounds.click(); } },
    { label: 'Cycle Wallpaper', icon: '🎨', action: () => {
      const themes = ['dragon', 'minimal', 'neon'];
      const next = themes[(themes.indexOf(state.desktop.wallpaperTheme) + 1) % themes.length];
      dispatch({ type: 'SET_WALLPAPER', theme: next });
      sounds.snap();
    }},
    { label: '', icon: '', action: () => {}, divider: true },
    { label: 'Sleep', icon: '😴', action: () => { dispatch({ type: 'SLEEP' }); sounds.minimize(); } },
  ];

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="fixed z-[97] min-w-[200px] rounded-xl overflow-hidden py-1"
      style={{
        left: pos.x,
        top: pos.y,
        background: 'rgba(12,12,18,0.92)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)',
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
            <span className="text-sm w-5 text-center">{item.icon}</span>
            {item.label}
          </button>
        )
      ))}
    </motion.div>
  );
}

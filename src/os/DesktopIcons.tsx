// DragonOS Desktop Icons - Optimized gradient tiles
// OPTIMIZED: Memoized callbacks, memo icon items, split context
import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useOS } from './context';
import { sounds } from './sounds';
import { appIconsLg } from './icons';
import type { ReactNode } from 'react';

interface DesktopApp {
  id: string;
  name: string;
  icon: ReactNode;
  gradient: string;
}

const DESKTOP_APPS: DesktopApp[] = [
  { id: 'dashboard', name: 'Dashboard', icon: appIconsLg.dashboard, gradient: 'from-red-900/40 to-red-600/20' },
  { id: 'notepad', name: 'Notepad', icon: appIconsLg.notepad, gradient: 'from-amber-900/40 to-amber-600/20' },
  { id: 'todo', name: 'Todo', icon: appIconsLg.todo, gradient: 'from-green-900/40 to-green-600/20' },
  { id: 'calendar', name: 'Calendar', icon: appIconsLg.calendar, gradient: 'from-blue-900/40 to-blue-600/20' },
  { id: 'terminal', name: 'Terminal', icon: appIconsLg.terminal, gradient: 'from-gray-900/60 to-gray-600/20' },
  { id: 'goals', name: 'Goals', icon: appIconsLg.goals, gradient: 'from-orange-900/40 to-orange-600/20' },
  { id: 'clock', name: 'Clock', icon: appIconsLg.clock, gradient: 'from-purple-900/40 to-purple-600/20' },
  { id: 'calculator', name: 'Calculator', icon: appIconsLg.calculator, gradient: 'from-slate-900/40 to-slate-600/20' },
];

// Individual icon — memoized
const DesktopIcon = memo(function DesktopIcon({
  app,
  isSelected,
  onSelect,
  onOpen,
}: {
  app: DesktopApp;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * DESKTOP_APPS.indexOf(app), type: 'spring', stiffness: 300, damping: 25 }}
      onClick={() => { onSelect(app.id); sounds.click(); }}
      onDoubleClick={() => { sounds.open(); onOpen(app.id); }}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all w-[72px] ${
        isSelected ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'
      } bg-gradient-to-br ${app.gradient}`}
    >
      <span className="text-[#dc2626]">{app.icon}</span>
      <span className="text-[9px] text-white/60 font-inter leading-tight text-center">{app.name}</span>
    </motion.button>
  );
});

export default function DesktopIcons() {
  const { openApp } = useOS();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => setSelected(id), []);
  const handleOpen = useCallback((id: string) => openApp(id), [openApp]);

  return (
    <div className="fixed left-4 top-4 z-[5] grid grid-cols-2 gap-3">
      {DESKTOP_APPS.map(app => (
        <DesktopIcon
          key={app.id}
          app={app}
          isSelected={selected === app.id}
          onSelect={handleSelect}
          onOpen={handleOpen}
        />
      ))}
    </div>
  );
}

// DragonOS Desktop Icons - Gradient tiles for pinned apps
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOS } from '../context';
import { sounds } from '../sounds';

interface DesktopApp {
  id: string;
  name: string;
  icon: string;
  gradient: string;
}

const desktopApps: DesktopApp[] = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊', gradient: 'from-red-900/40 to-red-600/20' },
  { id: 'notepad', name: 'Notepad', icon: '📝', gradient: 'from-amber-900/40 to-amber-600/20' },
  { id: 'todo', name: 'Todo', icon: '✅', gradient: 'from-green-900/40 to-green-600/20' },
  { id: 'calendar', name: 'Calendar', icon: '📅', gradient: 'from-blue-900/40 to-blue-600/20' },
  { id: 'terminal', name: 'Terminal', icon: '💻', gradient: 'from-gray-900/60 to-gray-600/20' },
  { id: 'goals', name: 'Goals', icon: '🎯', gradient: 'from-orange-900/40 to-orange-600/20' },
  { id: 'clock', name: 'Clock', icon: '🕐', gradient: 'from-purple-900/40 to-purple-600/20' },
  { id: 'calculator', name: 'Calculator', icon: '🔢', gradient: 'from-slate-900/40 to-slate-600/20' },
];

export default function DesktopIcons() {
  const { openApp } = useOS();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="fixed left-4 top-4 z-[5] grid grid-cols-2 gap-3">
      {desktopApps.map((app, i) => (
        <motion.button
          key={app.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * i, type: 'spring', stiffness: 300, damping: 25 }}
          onClick={() => {
            setSelected(app.id);
            sounds.click();
          }}
          onDoubleClick={() => {
            sounds.open();
            openApp(app.id);
          }}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all w-[72px] ${
            selected === app.id ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'
          } bg-gradient-to-br ${app.gradient}`}
        >
          <span className="text-2xl">{app.icon}</span>
          <span className="text-[9px] text-white/60 font-inter leading-tight text-center">{app.name}</span>
        </motion.button>
      ))}
    </div>
  );
}

// DragonOS Start Menu - Searchable app launcher grid
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from './context';
import { sounds } from './sounds';
import { appIcons, Search, Moon, Power } from './icons';
import type { ReactNode } from 'react';

interface AppInfo {
  id: string;
  name: string;
  icon: ReactNode;
  category: string;
  pinned?: boolean;
}

const allApps: AppInfo[] = [
  { id: 'dashboard', name: 'Dashboard', icon: appIcons.dashboard, category: 'Core', pinned: true },
  { id: 'clock', name: 'Clock', icon: appIcons.clock, category: 'Core', pinned: true },
  { id: 'notepad', name: 'Notepad', icon: appIcons.notepad, category: 'Core', pinned: true },
  { id: 'calendar', name: 'Calendar', icon: appIcons.calendar, category: 'Core' },
  { id: 'todo', name: 'Todo', icon: appIcons.todo, category: 'Core', pinned: true },
  { id: 'goals', name: 'Goals', icon: appIcons.goals, category: 'Core' },
  { id: 'habits', name: 'Habits', icon: appIcons.habits, category: 'Core' },
  { id: 'kanban', name: 'Kanban', icon: appIcons.kanban, category: 'Core' },
  { id: 'terminal', name: 'Terminal', icon: appIcons.terminal, category: 'Core' },
  { id: 'calculator', name: 'Calculator', icon: appIcons.calculator, category: 'Core' },
  { id: 'pomodoro', name: 'Pomodoro', icon: appIcons.pomodoro, category: 'Core' },
  { id: 'settings', name: 'Settings', icon: appIcons.settings, category: 'Core', pinned: true },
  { id: 'journal', name: 'Journal', icon: appIcons.journal, category: 'Extra' },
  { id: 'expenses', name: 'Expenses', icon: appIcons.expenses, category: 'Extra' },
  { id: 'mood', name: 'Mood', icon: appIcons.mood, category: 'Extra' },
  { id: 'vault', name: 'Vault', icon: appIcons.vault, category: 'Extra' },
  { id: 'doodle', name: 'Doodle', icon: appIcons.doodle, category: 'Extra' },
  { id: 'flashcards', name: 'Flashcards', icon: appIcons.flashcards, category: 'Extra' },
  { id: 'typingtest', name: 'Typing Test', icon: appIcons.typingtest, category: 'Extra' },
  { id: 'achievements', name: 'Achievements', icon: appIcons.achievements, category: 'Extra' },
  { id: 'systemmonitor', name: 'System Monitor', icon: appIcons.systemmonitor, category: 'Extra' },
  { id: 'focussounds', name: 'Focus Sounds', icon: appIcons.focussounds, category: 'Extra' },
  { id: 'browser', name: 'Browser', icon: appIcons.browser, category: 'Extra' },
  { id: 'translator', name: 'Translator', icon: appIcons.translator, category: 'Extra' },
  { id: 'weather', name: 'Weather', icon: appIcons.weather, category: 'Extra' },
  { id: 'clipboard', name: 'Clipboard', icon: appIcons.clipboard, category: 'Extra' },
  { id: 'quicknotes', name: 'Quick Notes', icon: appIcons.quicknotes, category: 'Extra' },
  { id: 'markdown', name: 'Markdown', icon: appIcons.markdown, category: 'Extra' },
];

export { allApps };

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const { openApp, state, dispatch } = useOS();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filtered = allApps.filter(app =>
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  const pinnedApps = allApps.filter(app => app.pinned);
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleOpen = (appId: string) => {
    sounds.click();
    openApp(appId);
    onClose();
  };

  const handleSleep = () => {
    sounds.minimize();
    dispatch({ type: 'SLEEP' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[98]"
            onClick={onClose}
          />
          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[99] w-[420px] max-w-[95vw] rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(12,12,18,0.88)',
              backdropFilter: 'blur(40px) saturate(1.5)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Header */}
            <div className="p-5 pb-3">
              <p className="text-xs text-white/40 font-inter">{greeting()}, {state.desktop.username}</p>
              <div className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                <span className="text-white/30"><Search size={14} /></span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search apps..."
                  className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/30 outline-none font-inter"
                />
              </div>
            </div>

            {/* Pinned Apps (when no search) */}
            {!query && (
              <div className="px-5 pb-3">
                <p className="text-[10px] text-white/30 uppercase tracking-wider font-inter mb-2">Pinned</p>
                <div className="grid grid-cols-4 gap-2">
                  {pinnedApps.map(app => (
                    <button
                      key={app.id}
                      onClick={() => handleOpen(app.id)}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5 transition-colors text-[#dc2626]"
                    >
                      {app.icon}
                      <span className="text-[10px] text-white/50 font-inter">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Apps */}
            <div className="px-5 pb-4 max-h-[300px] overflow-y-auto">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-inter mb-2">
                {query ? `${filtered.length} results` : 'All Apps'}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(query ? filtered : allApps).map(app => (
                  <button
                    key={app.id}
                    onClick={() => handleOpen(app.id)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5 transition-colors text-[#dc2626]"
                  >
                    {app.icon}
                    <span className="text-[10px] text-white/50 font-inter text-center truncate w-full">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer with user and sleep */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#dc2626]/20 flex items-center justify-center text-[#dc2626]">
                  <Moon size={14} />
                </div>
                <span className="text-xs text-white/40 font-inter">{state.desktop.username}</span>
              </div>
              <button
                onClick={handleSleep}
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors font-inter"
              >
                <Power size={12} /> Sleep
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

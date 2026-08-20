// DragonOS Command Palette - Ctrl+K Raycast-style fuzzy search
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from './context';
import { sounds } from './sounds';
import { allApps } from './StartMenu';

export default function CommandPalette() {
  const { openApp, dispatch } = useOS();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = useCallback(() => setOpen(prev => !prev), []);

  useEffect(() => {
    const handler = () => toggle();
    document.addEventListener('dragonos-command-palette', handler);
    return () => document.removeEventListener('dragonos-command-palette', handler);
  }, [toggle]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        sounds.close();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const results = allApps.filter(app =>
    app.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const handleSelect = (appId: string) => {
    sounds.click();
    openApp(appId);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40"
            onClick={() => { setOpen(false); sounds.close(); }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-[480px] max-w-[95vw] rounded-xl overflow-hidden"
            style={{
              background: 'rgba(12,12,18,0.95)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <span className="text-white/30 text-sm">🔍</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search apps..."
                className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/30 outline-none font-inter"
              />
              <kbd className="text-[10px] text-white/20 px-1.5 py-0.5 rounded border border-white/10 font-mono">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[320px] overflow-y-auto py-1">
              {results.map(app => (
                <button
                  key={app.id}
                  onClick={() => handleSelect(app.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
                >
                  <span className="text-xl">{app.icon}</span>
                  <span className="text-sm text-white/70 font-inter">{app.name}</span>
                  <span className="ml-auto text-[10px] text-white/20 font-inter">{app.category}</span>
                </button>
              ))}
              {results.length === 0 && (
                <p className="px-4 py-6 text-xs text-white/30 text-center font-inter">No apps found</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5 text-[10px] text-white/20 font-inter">
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
              <span>ESC Close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

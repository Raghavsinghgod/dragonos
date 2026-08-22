// DragonOS command palette — Ctrl+K fuzzy app search with keyboard navigation
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from '@/core/store';
import { sounds } from '@/core/audio';
import { allApps } from './launcher';
import { Search } from '@/ui/icons';

export default function CommandPalette() {
  const openApp = useOS().openApp;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset search state here rather than in an effect — no cascading renders
  const toggle = useCallback(() => {
    setOpen(prev => !prev);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handler = () => toggle();
    document.addEventListener('dragonos-command-palette', handler);
    return () => document.removeEventListener('dragonos-command-palette', handler);
  }, [toggle]);

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

  // Memoized filtered results
  const results = useMemo(() => {
    return allApps.filter(app =>
      app.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      sounds.click();
      openApp(results[selectedIndex].id);
      setOpen(false);
    }
  }, [results, selectedIndex, openApp]);



  const handleSelect = useCallback((appId: string) => {
    sounds.click();
    openApp(appId);
    setOpen(false);
  }, [openApp]);

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
            className="lgglass lglass-strong fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-[480px] max-w-[95vw] rounded-xl overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <span className="text-white/30"><Search size={16} /></span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search apps..."
                className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/30 outline-none font-inter"
              />
              <kbd className="text-[10px] text-white/20 px-1.5 py-0.5 rounded border border-white/10 font-mono">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[320px] overflow-y-auto py-1">
              {results.map((app, i) => (
                <button
                  key={app.id}
                  onClick={() => handleSelect(app.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-[#dc2626] ${
                    i === selectedIndex ? 'bg-white/5' : 'hover:bg-white/5'
                  }`}
                >
                  {app.icon}
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

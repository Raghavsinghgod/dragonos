// DragonOS drawer — right-edge panel with clock, quick actions and notes
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS, useDesktop } from './context';
import { sounds } from './sounds';
import { save, load } from './persist';
import { appIcons } from './icons';
import { Moon, Sun, Volume2 } from 'lucide-react';

export default function Drawer() {
  const { dispatch, openApp } = useOS();
  const desktop = useDesktop();
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(() => load('drawer-volume', 70));
  const [brightness, setBrightness] = useState(() => load('drawer-brightness', 100));
  const [quickNote, setQuickNote] = useState(() => load('drawer-note', ''));
  const [time, setTime] = useState(new Date());
  const [todos, setTodos] = useState(() => load<{ id: string; text: string; done: boolean }[]>('drawer-todos', []));
  const [newTodo, setNewTodo] = useState('');

  // Only run clock when drawer is open
  useEffect(() => {
    if (!open) return;
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, [open]);

  useEffect(() => {
    const handler = () => setOpen(prev => !prev);
    document.addEventListener('dragonos-toggle-drawer', handler);
    return () => document.removeEventListener('dragonos-toggle-drawer', handler);
  }, []);

  // Debounced saves
  useEffect(() => { save('drawer-volume', volume); }, [volume]);
  useEffect(() => { save('drawer-brightness', brightness); }, [brightness]);
  useEffect(() => { save('drawer-note', quickNote); }, [quickNote]);
  useEffect(() => { save('drawer-todos', todos); }, [todos]);

  const addQuickTodo = useCallback(() => {
    if (!newTodo.trim()) return;
    setTodos(prev => [...prev, { id: Date.now().toString(), text: newTodo.trim(), done: false }]);
    setNewTodo('');
    sounds.click();
  }, [newTodo]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    sounds.click();
  }, []);

  const closeDrawer = useCallback(() => setOpen(false), []);

  const quickActions = useMemo(() => [
    { icon: appIcons.dashboard, label: 'Dashboard', action: () => openApp('dashboard') },
    { icon: appIcons.notepad, label: 'Notepad', action: () => openApp('notepad') },
    { icon: appIcons.todo, label: 'Todo', action: () => openApp('todo') },
    { icon: appIcons.pomodoro, label: 'Pomodoro', action: () => openApp('pomodoro') },
    { icon: <Moon size={18} />, label: 'Sleep', action: () => { dispatch({ type: 'SLEEP' }); setOpen(false); } },
    { icon: appIcons.settings, label: 'Settings', action: () => openApp('settings') },
  ], [openApp, dispatch]);

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const s = time.getSeconds().toString().padStart(2, '0');

  return (
    <>
      {/* Edge trigger */}
      <div
        className="fixed right-0 top-0 bottom-20 w-1 z-40 hover:w-2 transition-all cursor-pointer"
        style={{ background: 'linear-gradient(to right, transparent, rgba(220,38,38,0.1))' }}
        onClick={() => { setOpen(true); sounds.open(); }}
      />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[96]"
              onClick={closeDrawer}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lgglass lglass-strong fixed right-0 top-0 bottom-0 w-[320px] max-w-[90vw] z-[97] flex flex-col overflow-y-auto border-l border-white/[0.06]"
            >
              {/* Clock */}
              <div className="p-6 text-center">
                <p className="font-mono text-4xl text-white/90 tracking-wider">
                  {h}<span className="animate-pulse">:</span>{m}<span className="text-lg text-white/30 ml-1">:{s}</span>
                </p>
                <p className="text-[10px] text-white/30 mt-1 font-inter">
                  {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="px-4 pb-4">
                <p className="text-[10px] text-white/30 uppercase tracking-wider font-inter mb-2">Quick Actions</p>
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => { a.action(); closeDrawer(); }}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <span className="text-white/50">{a.icon}</span>
                      <span className="text-[9px] text-white/40 font-inter">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brightness */}
              <div className="px-4 pb-3">
                <div className="flex items-center gap-3">
                  <Sun size={14} className="text-white/40 flex-shrink-0" />
                  <input type="range" min={0} max={100} value={brightness}
                    onChange={e => setBrightness(Number(e.target.value))}
                    className="flex-1 h-1 bg-white/10 rounded-full appearance-none accent-[#dc2626]" />
                  <span className="text-[10px] text-white/30 w-6 text-right font-mono">{brightness}</span>
                </div>
              </div>

              {/* Volume */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-3">
                  <Volume2 size={14} className="text-white/40 flex-shrink-0" />
                  <input type="range" min={0} max={100} value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    className="flex-1 h-1 bg-white/10 rounded-full appearance-none accent-[#dc2626]" />
                  <span className="text-[10px] text-white/30 w-6 text-right font-mono">{volume}</span>
                </div>
              </div>

              {/* Mini Todo */}
              <div className="px-4 pb-4">
                <p className="text-[10px] text-white/30 uppercase tracking-wider font-inter mb-2">Quick Todos</p>
                <div className="flex gap-1 mb-2">
                  <input value={newTodo} onChange={e => setNewTodo(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addQuickTodo()}
                    placeholder="Add task..."
                    className="flex-1 text-xs bg-white/5 rounded-lg px-3 py-1.5 text-white/70 placeholder:text-white/20 outline-none font-inter" />
                  <button onClick={addQuickTodo}
                    className="text-xs px-2 py-1.5 rounded-lg bg-[#dc2626]/20 text-[#dc2626] hover:bg-[#dc2626]/30 transition-colors">+</button>
                </div>
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {todos.map(t => (
                    <button key={t.id} onClick={() => toggleTodo(t.id)}
                      className="w-full flex items-center gap-2 text-xs text-white/50 hover:text-white/70 transition-colors py-1 font-inter">
                      <span className={`w-3 h-3 rounded border ${t.done ? 'bg-[#dc2626] border-[#dc2626]' : 'border-white/20'}`}>
                        {t.done && <span className="text-[8px] text-white ml-0.5">✓</span>}
                      </span>
                      <span className={t.done ? 'line-through opacity-40' : ''}>{t.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Note */}
              <div className="px-4 pb-4">
                <p className="text-[10px] text-white/30 uppercase tracking-wider font-inter mb-2">Quick Note</p>
                <textarea
                  value={quickNote}
                  onChange={e => setQuickNote(e.target.value)}
                  placeholder="Jot something down..."
                  rows={3}
                  className="w-full text-xs bg-white/5 rounded-lg px-3 py-2 text-white/60 placeholder:text-white/20 outline-none resize-none font-caveat text-sm"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

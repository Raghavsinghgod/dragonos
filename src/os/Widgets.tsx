// DragonOS Desktop Widgets - Customizable, draggable glass-morphism widgets
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePersist, save, load } from './persist';
import { Clock, Calendar, CheckSquare, Target, Timer, Quote, GripVertical, X, Plus } from 'lucide-react';
import type { ReactNode } from 'react';

// ─── Widget Types ─────────────────────────────────────────
export type WidgetType = 'clock' | 'date' | 'todo' | 'habits' | 'pomodoro' | 'quote';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  visible: boolean;
}

const defaultWidgets: WidgetConfig[] = [
  { id: 'w-clock', type: 'clock', x: 20, y: 20, visible: true },
  { id: 'w-date', type: 'date', x: 20, y: 180, visible: true },
  { id: 'w-quote', type: 'quote', x: 20, y: 280, visible: true },
];

const widgetMeta: Record<WidgetType, { label: string; icon: ReactNode; defaultW: number; defaultH: number }> = {
  clock: { label: 'Clock', icon: <Clock size={14} />, defaultW: 200, defaultH: 140 },
  date: { label: 'Date', icon: <Calendar size={14} />, defaultW: 200, defaultH: 80 },
  todo: { label: 'Quick Todo', icon: <CheckSquare size={14} />, defaultW: 220, defaultH: 200 },
  habits: { label: 'Habits', icon: <Target size={14} />, defaultW: 220, defaultH: 160 },
  pomodoro: { label: 'Pomodoro', icon: <Timer size={14} />, defaultW: 200, defaultH: 120 },
  quote: { label: 'Quote', icon: <Quote size={14} />, defaultW: 240, defaultH: 90 },
};

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Stewart Brand" },
  { text: "The best time to plant a tree was 20 years ago.", author: "Chinese Proverb" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "The dragon who sleeps still dreams of fire.", author: "DragonOS" },
];

// ─── Throttle helper for drag ─────────────────────────────
function useThrottledCallback(fn: (x: number, y: number) => void, ms: number) {
  const lastRun = useRef(0);
  const rafId = useRef(0);
  return useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastRun.current >= ms) {
      lastRun.current = now;
      fn(x, y);
    } else {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        lastRun.current = Date.now();
        fn(x, y);
      });
    }
  }, [fn, ms]);
}

// ─── Draggable Wrapper ────────────────────────────────────
function DraggableWidget({ config, onMove, onRemove, children }: {
  config: WidgetConfig;
  onMove: (x: number, y: number) => void;
  onRemove: () => void;
  children: ReactNode;
}) {
  const dragRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const throttledMove = useThrottledCallback((x: number, y: number) => onMove(x, y), 16);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    const rect = dragRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove2 = (e: MouseEvent) => {
      const nx = e.clientX - offset.current.x;
      const ny = e.clientY - offset.current.y;
      throttledMove(nx, ny);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove2);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove2);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, throttledMove]);

  return (
    <div ref={dragRef}
      className="absolute select-none"
      style={{
        left: config.x, top: config.y,
        zIndex: dragging ? 100 : 10,
        cursor: dragging ? 'grabbing' : 'default',
      }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="rounded-xl overflow-hidden group"
        style={{
          background: 'rgba(12,12,18,0.75)',
          backdropFilter: 'blur(30px) saturate(1.4)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: dragging ? '0 20px 60px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.3)',
          width: widgetMeta[config.type].defaultW,
          transition: 'box-shadow 0.3s',
        }}>
        {/* Drag handle + remove */}
        <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing"
            onMouseDown={onDragStart}>
            <GripVertical size={10} className="text-white/20" />
            <span className="text-[9px] text-white/25 font-inter">{widgetMeta[config.type].label}</span>
          </div>
          <button onClick={onRemove}
            className="w-4 h-4 rounded flex items-center justify-center text-white/20 hover:text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors">
            <X size={10} />
          </button>
        </div>
        <div className="p-3">{children}</div>
      </motion.div>
    </div>
  );
}

// ─── Widget Content Components ────────────────────────────

function ClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';

  const secAngle = s * 6;
  const minAngle = m * 6 + s * 0.1;
  const hourAngle = h12 * 30 + m * 0.5;

  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 60 60" className="w-14 h-14 flex-shrink-0">
        <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 - 90) * Math.PI / 180;
          return <circle key={i} cx={30 + 24 * Math.cos(a)} cy={30 + 24 * Math.sin(a)} r="1" fill="rgba(255,255,255,0.2)" />;
        })}
        <line x1="30" y1="30" x2={30 + 14 * Math.cos((hourAngle - 90) * Math.PI / 180)}
          y2={30 + 14 * Math.sin((hourAngle - 90) * Math.PI / 180)}
          stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="30" x2={30 + 20 * Math.cos((minAngle - 90) * Math.PI / 180)}
          y2={30 + 20 * Math.sin((minAngle - 90) * Math.PI / 180)}
          stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="30" x2={30 + 22 * Math.cos((secAngle - 90) * Math.PI / 180)}
          y2={30 + 22 * Math.sin((secAngle - 90) * Math.PI / 180)}
          stroke="#dc2626" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="30" cy="30" r="2" fill="#dc2626" />
      </svg>
      <div>
        <p className="font-mono text-xl text-white/80 tracking-wider">
          {h.toString().padStart(2, '0')}<span className="animate-pulse text-[#dc2626]">:</span>{m.toString().padStart(2, '0')}
        </p>
        <p className="text-[10px] text-white/30 font-inter mt-0.5">{s.toString().padStart(2, '0')}s {ampm}</p>
      </div>
    </div>
  );
}

function DateWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(iv);
  }, []);

  const formatted = useMemo(() => ({
    weekday: now.toLocaleDateString('en-US', { weekday: 'long' }),
    month: now.toLocaleDateString('en-US', { month: 'long' }),
    day: now.getDate(),
    year: now.getFullYear(),
  }), [now]);

  return (
    <div className="text-center">
      <p className="font-display text-2xl text-white/85 tracking-wide">{formatted.weekday}</p>
      <p className="text-xs text-white/40 font-inter mt-1">{formatted.month} {formatted.day}, {formatted.year}</p>
    </div>
  );
}

function TodoWidget() {
  const [todos, setTodos] = usePersist<{ id: string; text: string; done: boolean }[]>('widget-todos', [
    { id: '1', text: 'Build something great', done: false },
    { id: '2', text: 'Ship it', done: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const add = useCallback(() => {
    if (!newTodo.trim()) return;
    setTodos(prev => [...prev, { id: Date.now().toString(), text: newTodo.trim(), done: false }]);
    setNewTodo('');
  }, [newTodo, setTodos]);

  const toggle = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, [setTodos]);

  const remove = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, [setTodos]);

  const { done, total } = useMemo(() => ({
    done: todos.filter(t => t.done).length,
    total: todos.length,
  }), [todos]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-white/30 font-inter">Quick Todo</span>
        <span className="text-[10px] text-[#dc2626]/60 font-mono">{done}/{total}</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 mb-2.5 overflow-hidden">
        <div className="h-full rounded-full bg-[#dc2626]/60 transition-all duration-500"
          style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }} />
      </div>
      <div className="space-y-1 max-h-[100px] overflow-y-auto">
        {todos.map(t => (
          <div key={t.id} className="flex items-center gap-2 group/item">
            <button onClick={() => toggle(t.id)}
              className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors
                ${t.done ? 'bg-[#dc2626] border-[#dc2626]' : 'border-white/15 hover:border-white/30'}`}>
              {t.done && <span className="text-[7px] text-white">✓</span>}
            </button>
            <span className={`text-[11px] font-inter flex-1 truncate ${t.done ? 'text-white/20 line-through' : 'text-white/50'}`}>
              {t.text}
            </span>
            <button onClick={() => remove(t.id)}
              className="opacity-0 group-hover/item:opacity-100 text-white/20 hover:text-[#dc2626] transition-all">
              <X size={10} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-2">
        <input value={newTodo} onChange={e => setNewTodo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add task..."
          className="flex-1 text-[11px] bg-white/[0.04] rounded-lg px-2.5 py-1.5 text-white/60 placeholder:text-white/15 outline-none font-inter border border-white/5 focus:border-[#dc2626]/20 transition-colors" />
        <button onClick={add}
          className="w-7 h-7 rounded-lg bg-[#dc2626]/15 text-[#dc2626] hover:bg-[#dc2626]/25 transition-colors flex items-center justify-center text-xs">
          +
        </button>
      </div>
    </div>
  );
}

function HabitsWidget() {
  const [habits] = usePersist<{ name: string; completions: string[] }[]>('widget-habits', [
    { name: 'Exercise', completions: [] },
    { name: 'Read', completions: [] },
    { name: 'Meditate', completions: [] },
  ]);

  const { today, weekDates } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const dayOfWeek = (now.getDay() + 6) % 7;
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - dayOfWeek + i);
      return d.toISOString().split('T')[0];
    });
    return { today: todayStr, weekDates: dates };
  }, []);

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-white/30 font-inter">This Week</span>
      </div>
      <div className="flex gap-1 mb-1.5">
        <div className="w-14" />
        {days.map((d, i) => (
          <div key={i} className={`flex-1 text-center text-[8px] font-inter
            ${weekDates[i] === today ? 'text-[#dc2626]' : 'text-white/20'}`}>
            {d}
          </div>
        ))}
      </div>
      {habits.map((h, hi) => (
        <div key={hi} className="flex items-center gap-1 mb-1">
          <span className="w-14 text-[10px] text-white/40 font-inter truncate">{h.name}</span>
          {weekDates.map((date, di) => {
            const done = h.completions.includes(date);
            const isToday = date === today;
            return (
              <div key={di} className={`flex-1 aspect-square rounded-[3px] flex items-center justify-center transition-colors
                ${done ? 'bg-[#dc2626]/60' : isToday ? 'bg-white/[0.06] border border-[#dc2626]/20' : 'bg-white/[0.03]'}`}>
                {done && <span className="text-[7px] text-white">✓</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function PomodoroWidget() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const isBreakRef = useRef(false);

  // Keep ref in sync
  useEffect(() => { isBreakRef.current = isBreak; }, [isBreak]);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(iv);
          setRunning(false);
          if (!isBreakRef.current) {
            setSessions(s => s + 1);
            setIsBreak(true);
            return 5 * 60;
          } else {
            setIsBreak(false);
            return 25 * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const totalSeconds = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <div className="text-center">
      <p className="text-[10px] text-white/30 font-inter mb-1">
        {isBreak ? '☕ Break' : '🎯 Focus'}
      </p>
      <p className="font-mono text-2xl text-white/80 tracking-wider">
        {mins.toString().padStart(2, '0')}<span className="animate-pulse text-[#dc2626]">:</span>{secs.toString().padStart(2, '0')}
      </p>
      <div className="flex justify-center my-2">
        <svg viewBox="0 0 40 40" className="w-10 h-10">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle cx="20" cy="20" r="16" fill="none" stroke="#dc2626" strokeWidth="3"
            strokeLinecap="round" strokeDasharray={`${progress} 100`}
            transform="rotate(-90 20 20)" className="transition-all duration-1000" />
        </svg>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => setRunning(r => !r)}
          className="text-[10px] px-3 py-1 rounded-full bg-[#dc2626]/15 text-[#dc2626] hover:bg-[#dc2626]/25 transition-colors font-inter">
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setRunning(false); setIsBreak(false); setSeconds(25 * 60); }}
          className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-white/30 hover:text-white/50 transition-colors font-inter">
          Reset
        </button>
      </div>
      <p className="text-[9px] text-white/20 font-inter mt-1.5">Sessions: {sessions}</p>
    </div>
  );
}

function QuoteWidget() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * quotes.length));

  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % quotes.length), 15000);
    return () => clearInterval(iv);
  }, []);

  const q = quotes[idx];

  return (
    <div className="text-center">
      <Quote size={16} className="text-[#dc2626]/30 mx-auto mb-2" />
      <p className="text-[11px] text-white/50 font-inter leading-relaxed italic">&ldquo;{q.text}&rdquo;</p>
      <p className="text-[9px] text-white/25 font-inter mt-2">— {q.author}</p>
    </div>
  );
}

// ─── Widget Add Panel ─────────────────────────────────────
function AddWidgetPanel({ onAdd, onClose, existing }: {
  onAdd: (type: WidgetType) => void;
  onClose: () => void;
  existing: WidgetType[];
}) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[95] rounded-xl overflow-hidden"
      style={{
        background: 'rgba(12,12,18,0.92)', backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
      <div className="px-4 py-3 border-b border-white/5">
        <p className="text-[10px] text-white/30 font-inter uppercase tracking-wider">Add Widget</p>
      </div>
      <div className="p-2 grid grid-cols-3 gap-1.5">
        {(Object.keys(widgetMeta) as WidgetType[]).map(type => {
          const meta = widgetMeta[type];
          const already = existing.includes(type);
          return (
            <button key={type} disabled={already}
              onClick={() => { onAdd(type); onClose(); }}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all
                ${already
                  ? 'text-white/15 cursor-not-allowed'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'}`}>
              {meta.icon}
              <span className="text-[9px] font-inter">{meta.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main Widgets Component ───────────────────────────────
export default function Widgets() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => load('widgets', defaultWidgets));
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { save('widgets', widgets); }, [widgets]);

  const updatePos = useCallback((id: string, x: number, y: number) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: false } : w));
  }, []);

  const addWidget = useCallback((type: WidgetType) => {
    const id = `w-${type}-${Date.now()}`;
    const screenW = window.innerWidth;
    setWidgets(prev => [
      ...prev.filter(w => w.type !== type || !w.visible),
      {
        id, type,
        x: screenW - widgetMeta[type].defaultW - 20,
        y: 100 + prev.filter(w => w.visible).length * 30,
        visible: true,
      },
    ]);
  }, []);

  const visibleWidgets = useMemo(() => widgets.filter(w => w.visible), [widgets]);
  const existingTypes = useMemo(() => visibleWidgets.map(w => w.type), [visibleWidgets]);

  useEffect(() => {
    const handler = () => setShowAdd(prev => !prev);
    document.addEventListener('dragonos-toggle-widgets', handler as EventListener);
    return () => document.removeEventListener('dragonos-toggle-widgets', handler as EventListener);
  }, []);

  const renderContent = useCallback((type: WidgetType) => {
    switch (type) {
      case 'clock': return <ClockWidget />;
      case 'date': return <DateWidget />;
      case 'todo': return <TodoWidget />;
      case 'habits': return <HabitsWidget />;
      case 'pomodoro': return <PomodoroWidget />;
      case 'quote': return <QuoteWidget />;
    }
  }, []);

  return (
    <>
      {/* Desktop widget area - right side */}
      <div className="fixed right-4 top-4 z-[5]">
        <div className="flex flex-col gap-0">
          {visibleWidgets.map(w => (
            <DraggableWidget key={w.id} config={w}
              onMove={(x, y) => updatePos(w.id, x, y)}
              onRemove={() => removeWidget(w.id)}>
              {renderContent(w.type)}
            </DraggableWidget>
          ))}
        </div>
      </div>

      {/* Add widget button */}
      <button onClick={() => setShowAdd(prev => !prev)}
        className="fixed bottom-20 right-4 z-[45] w-8 h-8 rounded-full bg-white/[0.04] border border-white/8
          flex items-center justify-center text-white/30 hover:text-[#dc2626] hover:bg-[#dc2626]/10
          hover:border-[#dc2626]/15 transition-all duration-200"
        title="Add Widget">
        <Plus size={14} />
      </button>

      {showAdd && <AddWidgetPanel onAdd={addWidget} onClose={() => setShowAdd(false)} existing={existingTypes} />}
    </>
  );
}

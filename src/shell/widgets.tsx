// DragonOS desktop widgets — draggable liquid-glass cards with a manage panel.
// Layering: widgets live BELOW windows (z 5–8) so open apps always cover them.
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersist } from '@/core/persist';
import {
  Clock, Calendar, CheckSquare, Target, Timer, Quote,
  GripVertical, X, Plus, RotateCcw,
} from 'lucide-react';
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
  { id: 'w-clock', type: 'clock', x: 24, y: 24, visible: true },
  { id: 'w-date', type: 'date', x: 24, y: 190, visible: true },
  { id: 'w-quote', type: 'quote', x: 24, y: 300, visible: true },
];

const widgetMeta: Record<WidgetType, {
  label: string;
  desc: string;
  icon: ReactNode;
  defaultW: number;
}> = {
  clock:    { label: 'Clock',     desc: 'Analog & digital time',   icon: <Clock size={14} />,       defaultW: 200 },
  date:     { label: 'Date',      desc: 'Today at a glance',       icon: <Calendar size={14} />,    defaultW: 200 },
  todo:     { label: 'Quick Todo',desc: 'Mini task list',          icon: <CheckSquare size={14} />, defaultW: 220 },
  habits:   { label: 'Habits',    desc: 'Weekly streak grid',      icon: <Target size={14} />,      defaultW: 220 },
  pomodoro: { label: 'Pomodoro',  desc: '25/5 focus timer',        icon: <Timer size={14} />,       defaultW: 200 },
  quote:    { label: 'Quote',     desc: 'Rotating wisdom',         icon: <Quote size={14} />,       defaultW: 240 },
};

// Exported for the Settings app — single source of truth for the catalog
export const widgetTypes = (Object.keys(widgetMeta) as WidgetType[]).map(type => ({
  type,
  ...widgetMeta[type],
}));

const QUOTES = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'Stay hungry, stay foolish.', author: 'Stewart Brand' },
  { text: 'The best time to plant a tree was 20 years ago.', author: 'Chinese Proverb' },
  { text: 'Code is like humor. When you have to explain it, it is bad.', author: 'Cory House' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'The dragon who sleeps still dreams of fire.', author: 'DragonOS' },
];

// ─── RAF throttle ─────────────────────────────────────────
function useRafThrottle() {
  const rafId = useRef(0);
  return useCallback((fn: () => void) => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0;
      fn();
    });
  }, []);
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
  const throttle = useRafThrottle();

  // Keep a stable ref to the latest move handler so the drag listeners
  // never need to re-subscribe mid-drag
  const onMoveRef = useRef(onMove);
  useEffect(() => { onMoveRef.current = onMove; }, [onMove]);

  // Drag from anywhere on the card except interactive controls
  const onDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, textarea, select, a, [data-no-drag]')) return;
    e.preventDefault();
    setDragging(true);
    const rect = dragRef.current?.getBoundingClientRect();
    if (rect) offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove2 = (e: MouseEvent) => {
      const nx = e.clientX - offset.current.x;
      const ny = e.clientY - offset.current.y;
      throttle(() => onMoveRef.current(nx, ny));
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove2);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove2);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, throttle]);

  return (
    <div
      ref={dragRef}
      className="absolute select-none"
      // Below the window layer at all times — windows start at z 11
      style={{
        left: config.x,
        top: config.y,
        zIndex: dragging ? 8 : 5,
        cursor: dragging ? 'grabbing' : 'default',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: dragging ? 1.03 : 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
        className="lgglass rounded-2xl cursor-grab active:cursor-grabbing"
        onMouseDown={onDragStart}
        style={{
          width: widgetMeta[config.type].defaultW,
          boxShadow: dragging
            ? 'inset 0 1px 0 rgba(255,255,255,0.14), 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(220,38,38,0.15)'
            : undefined,
        }}
      >
        {/* Grip header — affordance; the whole card drags */}
        <div className="relative flex items-center justify-between px-2.5 py-1.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-1.5 -my-1 py-1 pr-2" title="Drag to move">
            <GripVertical size={11} className="text-white/30" />
            <span className="text-[9px] uppercase tracking-[0.14em] text-white/35 font-inter">
              {widgetMeta[config.type].label}
            </span>
          </div>
          <button
            onClick={onRemove}
            aria-label={`Remove ${widgetMeta[config.type].label} widget`}
            className="w-5 h-5 rounded-md flex items-center justify-center text-white/25 hover:text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors"
          >
            <X size={11} />
          </button>
        </div>
        <div className="relative p-3">{children}</div>
      </motion.div>
    </div>
  );
}

// ─── Memoized Widget Content Components ────────────────────

const ClockWidget = memo(function ClockWidget() {
  const [time, setTime] = useState(() => new Date());
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
});

const DateWidget = memo(function DateWidget() {
  const [now, setNow] = useState(() => new Date());
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
});

const TodoWidget = memo(function TodoWidget() {
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
        <span className="text-[10px] text-white/30 font-inter">Progress</span>
        <span className="text-[10px] text-[#dc2626]/60 font-mono">{done}/{total}</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 mb-2.5 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-[#7f1d1d] to-[#dc2626] transition-all duration-500"
          style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }} />
      </div>
      <div className="space-y-1 max-h-[100px] overflow-y-auto">
        {todos.map(t => (
          <div key={t.id} className="flex items-center gap-2 group/item">
            <button onClick={() => toggle(t.id)}
              aria-label={t.done ? 'Mark incomplete' : 'Mark complete'}
              className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors
                ${t.done ? 'bg-[#dc2626] border-[#dc2626]' : 'border-white/15 hover:border-white/30'}`}>
              {t.done && <span className="text-[7px] text-white">✓</span>}
            </button>
            <span className={`text-[11px] font-inter flex-1 truncate ${t.done ? 'text-white/20 line-through' : 'text-white/50'}`}>
              {t.text}
            </span>
            <button onClick={() => remove(t.id)} aria-label="Delete task"
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
          className="flex-1 min-w-0 text-[11px] bg-white/[0.04] rounded-lg px-2.5 py-1.5 text-white/60 placeholder:text-white/15 outline-none font-inter border border-white/5 focus:border-[#dc2626]/20 transition-colors" />
        <button onClick={add} aria-label="Add task"
          className="w-7 h-7 flex-shrink-0 rounded-lg bg-[#dc2626]/15 text-[#dc2626] hover:bg-[#dc2626]/25 transition-colors flex items-center justify-center text-xs">
          +
        </button>
      </div>
    </div>
  );
});

const HabitsWidget = memo(function HabitsWidget() {
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
      <div className="text-[10px] text-white/30 font-inter mb-2">This Week</div>
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
});

const PomodoroWidget = memo(function PomodoroWidget() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const isBreakRef = useRef(false);

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

  const reset = useCallback(() => {
    setRunning(false);
    setIsBreak(false);
    setSeconds(25 * 60);
  }, []);

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
        <button onClick={reset}
          className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-white/30 hover:text-white/50 transition-colors font-inter">
          Reset
        </button>
      </div>
      <p className="text-[9px] text-white/20 font-inter mt-1.5">Sessions: {sessions}</p>
    </div>
  );
});

const QuoteWidget = memo(function QuoteWidget() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    const iv = setInterval(() => setIdx(prev => (prev + 1) % QUOTES.length), 15000);
    return () => clearInterval(iv);
  }, []);

  const quote = QUOTES[idx];

  return (
    <div className="text-center">
      <p className="text-[11px] text-white/50 font-caveat leading-relaxed italic">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="text-[9px] text-white/25 font-inter mt-1.5">— {quote.author}</p>
    </div>
  );
});

// ─── Main Widgets Component ───────────────────────────────
export default function Widgets() {
  const [widgets, setWidgets] = usePersist<WidgetConfig[]>('widgets', defaultWidgets);
  const [showManager, setShowManager] = useState(false);

  // Context menu can open the manager
  useEffect(() => {
    const handler = () => setShowManager(prev => !prev);
    document.addEventListener('dragonos-toggle-widgets', handler);
    return () => document.removeEventListener('dragonos-toggle-widgets', handler);
  }, []);

  const updatePos = useCallback((id: string, x: number, y: number) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, [setWidgets]);

  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: false } : w));
  }, [setWidgets]);

  // Show/hide a widget type — adds at a sensible cascade spot when new
  const toggleType = useCallback((type: WidgetType) => {
    setWidgets(prev => {
      const existing = prev.find(w => w.type === type);
      if (existing) {
        return prev.map(w => w.id === existing.id ? { ...w, visible: !w.visible } : w);
      }
      const count = prev.length;
      return [...prev, {
        id: `w-${type}-${Date.now()}`,
        type,
        x: typeof window !== 'undefined' ? Math.max(24, Math.min(window.innerWidth - 280, 24 + (count % 4) * 250)) : 24,
        y: 24 + Math.floor(count / 4) * 220,
        visible: true,
      }];
    });
  }, [setWidgets]);

  const resetLayout = useCallback(() => {
    setWidgets(defaultWidgets.map(w => ({ ...w })));
  }, [setWidgets]);

  // Settings app toggles widget types / resets layout remotely
  useEffect(() => {
    const onToggleType = (e: Event) => toggleType((e as CustomEvent).detail as WidgetType);
    const onReset = () => resetLayout();
    document.addEventListener('dragonos-widget-toggle', onToggleType);
    document.addEventListener('dragonos-widgets-reset', onReset);
    return () => {
      document.removeEventListener('dragonos-widget-toggle', onToggleType);
      document.removeEventListener('dragonos-widgets-reset', onReset);
    };
  }, [toggleType, resetLayout]);

  const allTypes = useMemo(() => Object.keys(widgetMeta) as WidgetType[], []);
  const visibleWidgets = useMemo(() => widgets.filter(w => w.visible), [widgets]);

  const widgetComponents: Record<WidgetType, React.ComponentType> = {
    clock: ClockWidget,
    date: DateWidget,
    todo: TodoWidget,
    habits: HabitsWidget,
    pomodoro: PomodoroWidget,
    quote: QuoteWidget,
  };

  const activeCount = visibleWidgets.length;

  return (
    <>
      {/* Visible widgets */}
      <AnimatePresence>
        {visibleWidgets.map(config => {
          const Comp = widgetComponents[config.type];
          if (!Comp) return null;
          return (
            <DraggableWidget
              key={config.id}
              config={config}
              onMove={(x, y) => updatePos(config.id, x, y)}
              onRemove={() => removeWidget(config.id)}
            >
              <Comp />
            </DraggableWidget>
          );
        })}
      </AnimatePresence>

      {/* Manager FAB */}
      <div className="fixed bottom-20 right-4 z-20">
        <button
          onClick={() => setShowManager(p => !p)}
          aria-label="Manage widgets"
          title="Manage widgets"
          className="lgglass w-10 h-10 rounded-full flex items-center justify-center text-white/45 hover:text-[#dc2626] hover:shadow-[0_0_18px_rgba(220,38,38,0.25)] transition-all duration-200 active:scale-95"
        >
          <Plus size={17} className={showManager ? 'rotate-45 transition-transform duration-200' : 'transition-transform duration-200'} />
        </button>
      </div>

      {/* Manage Widgets panel */}
      <AnimatePresence>
        {showManager && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="lgglass lglass-strong fixed bottom-[8.5rem] right-4 z-20 w-72 rounded-2xl"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-4 pt-3.5 pb-2.5 border-b border-white/[0.06]">
              <div>
                <p className="text-[11px] font-medium text-white/80 font-inter tracking-wide">Widgets</p>
                <p className="text-[9px] text-white/30 font-inter mt-0.5">{activeCount} on desktop</p>
              </div>
              <button
                onClick={() => setShowManager(false)}
                aria-label="Close"
                className="w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            {/* Toggle list */}
            <div className="py-1.5">
              {allTypes.map(type => {
                const meta = widgetMeta[type];
                const isOn = widgets.some(w => w.type === type && w.visible);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    role="switch"
                    aria-checked={isOn}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-[#dc2626]/80 flex-shrink-0">
                      {meta.icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[11px] text-white/70 font-inter leading-tight">{meta.label}</span>
                      <span className="block text-[9px] text-white/30 font-inter mt-0.5">{meta.desc}</span>
                    </span>
                    <span className={`lg-switch ${isOn ? '' : ''}`} data-on={isOn}>
                      <span className="lg-switch-knob" />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer actions */}
            <div className="border-t border-white/[0.06] px-4 py-2.5 flex items-center justify-between">
              <button
                onClick={resetLayout}
                className="flex items-center gap-1.5 text-[10px] text-white/35 hover:text-[#dc2626] transition-colors font-inter"
              >
                <RotateCcw size={10} />
                Reset layout
              </button>
              <button
                onClick={() => setShowManager(false)}
                className="text-[10px] px-3 py-1 rounded-full bg-[#dc2626]/15 text-[#dc2626] hover:bg-[#dc2626]/25 transition-colors font-inter"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

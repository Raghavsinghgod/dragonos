// DragonOS System Monitor App
import { useState, useEffect } from 'react';
import { load } from '@/state/persistence/local-storage';

export default function SystemMonitor() {
  const [data, setData] = useState<number[]>(() => Array.from({ length: 30 }, () => Math.random() * 30));

  useEffect(() => {
    const interval = setInterval(() => {
      const todos = load<{ done: boolean }[]>('todos', []);
      const habits = load<{ completions: string[] }[]>('habits', []);
      const doneCount = todos.filter(t => t.done).length;
      const habitCount = habits.filter(h => {
        const today = new Date().toISOString().split('T')[0];
        return h.completions.includes(today);
      }).length;
      const activity = Math.min(100, (doneCount * 5 + habitCount * 10 + Math.random() * 20));
      setData(prev => [...prev.slice(1), activity]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const current = data[data.length - 1];
  const avg = data.reduce((a, b) => a + b, 0) / data.length;

  return (
    <div className="p-4 font-inter space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-lg text-[#dc2626] font-mono">{Math.round(current)}%</p>
          <p className="text-[9px] text-white/30">CPU</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-lg text-white/80 font-mono">{Math.round(avg)}%</p>
          <p className="text-[9px] text-white/30">Avg</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-lg text-white/80 font-mono">{data.length}s</p>
          <p className="text-[9px] text-white/30">Window</p>
        </div>
      </div>

      {/* Graph */}
      <div className="h-[180px] rounded-xl bg-white/[0.02] p-3 relative overflow-hidden">
        <div className="absolute inset-0 flex items-end gap-[2px] p-3">
          {data.map((v, i) => (
            <div key={i} className="flex-1 rounded-t transition-all duration-300"
              style={{
                height: `${v}%`,
                background: v > 70 ? '#dc2626' : v > 40 ? '#f59e0b' : '#22c55e',
                opacity: 0.6 + (i / data.length) * 0.4,
              }} />
          ))}
        </div>
        {/* Grid lines */}
        {[25, 50, 75].map(y => (
          <div key={y} className="absolute left-0 right-0 border-t border-white/5" style={{ top: `${100 - y}%` }} />
        ))}
      </div>

      <p className="text-[9px] text-white/20 text-center">
        Productivity CPU — reacts to your task completions and habit ticks
      </p>
    </div>
  );
}

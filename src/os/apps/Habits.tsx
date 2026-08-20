// DragonOS Habits App
import { useState, useMemo } from 'react';
import { usePersist } from '../persist';
import { sounds } from '../sounds';
import type { Habit } from '../types';

function last7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function getStreak(completions: string[]): number {
  let streak = 0;
  const d = new Date();
  while (completions.includes(d.toISOString().split('T')[0])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function Habits() {
  const [habits, setHabits] = usePersist<Habit[]>('habits', []);
  const [newName, setNewName] = useState('');
  const days = useMemo(() => last7Days(), []);
  const today = new Date().toISOString().split('T')[0];

  const addHabit = () => {
    if (!newName.trim()) return;
    setHabits([...habits, { id: Date.now().toString(), name: newName.trim(), completions: [] }]);
    setNewName('');
    sounds.click();
  };

  const toggle = (habitId: string, date: string) => {
    setHabits(habits.map(h => {
      if (h.id !== habitId) return h;
      const completions = h.completions.includes(date)
        ? h.completions.filter(d => d !== date)
        : [...h.completions, date];
      // Check for 7-day streak celebration
      if (completions.filter(d => days.includes(d)).length === 7) sounds.victory();
      return { ...h, completions };
    }));
  };

  const deleteHabit = (id: string) => setHabits(habits.filter(h => h.id !== id));

  return (
    <div className="p-4 font-inter space-y-3">
      <div className="flex gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addHabit()}
          placeholder="New habit..."
          className="flex-1 text-sm bg-white/5 rounded-lg px-3 py-2 text-white/70 placeholder:text-white/20 outline-none" />
        <button onClick={addHabit} className="px-3 py-2 rounded-lg bg-[#dc2626] text-white text-sm">Add</button>
      </div>

      <div className="space-y-2 max-h-[350px] overflow-y-auto">
        {habits.map(h => {
          const streak = getStreak(h.completions);
          const weekDone = days.filter(d => h.completions.includes(d)).length;
          return (
            <div key={h.id} className="p-3 rounded-xl bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/70">{h.name}</span>
                <div className="flex items-center gap-2">
                  {streak > 0 && <span className="text-[10px] text-[#dc2626] font-mono">🔥 {streak}d</span>}
                  <button onClick={() => deleteHabit(h.id)} className="text-[10px] text-white/20 hover:text-red-400">×</button>
                </div>
              </div>
              <div className="flex gap-1.5">
                {days.map(d => {
                  const done = h.completions.includes(d);
                  const isToday = d === today;
                  return (
                    <button key={d} onClick={() => toggle(h.id, d)}
                      className={`flex-1 h-8 rounded-lg text-[9px] transition-all ${
                        done
                          ? 'bg-[#dc2626]/30 text-[#dc2626]'
                          : isToday
                            ? 'bg-white/10 text-white/40 ring-1 ring-[#dc2626]/50'
                            : 'bg-white/5 text-white/20'
                      }`}>
                      {done ? '✓' : d.slice(5)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

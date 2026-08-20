// DragonOS Mood App
import { useState, useMemo } from 'react';
import { save, load } from '../persist';
import { sounds } from '../sounds';
import type { MoodEntry } from '../types';

const moods = ['😫', '😟', '😐', '😊', '🤩'];
const moodColors: Record<string, string> = { '😫': '#ef4444', '😟': '#f59e0b', '😐': '#6b7280', '😊': '#3b82f6', '🤩': '#22c55e' };

export default function Mood() {
  const [entries, setEntries] = load<MoodEntry[]>('mood-entries', []);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const todayMood = entries.find(e => e.date === today);

  const month = new Date().toISOString().slice(0, 7);
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  const monthEntries = useMemo(() => {
    const map: Record<string, string> = {};
    entries.filter(e => e.date.startsWith(month)).forEach(e => { map[e.date] = e.mood; });
    return map;
  }, [entries, month]);

  const setMood = (mood: string) => {
    const existing = entries.find(e => e.date === selectedDate);
    if (existing) setEntries(entries.map(e => e.date === selectedDate ? { ...e, mood } : e));
    else setEntries([...entries, { date: selectedDate, mood }]);
    sounds.complete();
  };

  return (
    <div className="p-4 font-inter space-y-4 max-h-full overflow-y-auto">
      {/* Today */}
      <div className="text-center">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">How are you feeling today?</p>
        <div className="flex justify-center gap-3">
          {moods.map(m => (
            <button key={m} onClick={() => setMood(m)}
              className={`text-3xl p-2 rounded-xl transition-all ${
                todayMood?.mood === m ? 'bg-white/10 scale-110 ring-1 ring-white/20' : 'hover:bg-white/5 opacity-50 hover:opacity-100'
              }`}>{m}</button>
          ))}
        </div>
      </div>

      {/* Monthly Heat Strip */}
      <div>
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = `${month}-${(i + 1).toString().padStart(2, '0')}`;
            const mood = monthEntries[d];
            const isToday = d === today;
            const isSelected = d === selectedDate;
            return (
              <button key={i} onClick={() => { setSelectedDate(d); }}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                  mood ? '' : isToday ? 'bg-white/10 ring-1 ring-[#dc2626]/50' : 'bg-white/[0.02]'
                } ${isSelected ? 'ring-1 ring-white/30' : ''}`}
                style={mood ? { background: `${moodColors[mood]}22` } : {}}>
                {mood || <span className="text-[8px] text-white/15">{i + 1}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="p-3 rounded-xl bg-white/5">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">This Month</p>
        <div className="flex justify-around">
          {moods.map(m => {
            const count = Object.values(monthEntries).filter(v => v === m).length;
            return (
              <div key={m} className="text-center">
                <p className="text-xl">{m}</p>
                <p className="text-[10px] text-white/30 font-mono">{count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

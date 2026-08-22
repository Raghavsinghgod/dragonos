// DragonOS Journal App
import { useState } from 'react';
import { usePersist } from '@/core/persist';
import type { JournalEntry } from '@/core/store';

export default function Journal() {
  const [entries, setEntries] = usePersist<JournalEntry[]>('journal-entries', []);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [content, setContent] = useState(entries.find(e => e.date === selectedDate)?.content || '');

  const handleContentChange = (val: string) => {
    setContent(val);
    const existing = entries.find(e => e.date === selectedDate);
    if (existing) {
      setEntries(entries.map(e => e.date === selectedDate ? { ...e, content: val } : e));
    } else {
      setEntries([...entries, { date: selectedDate, content: val }]);
    }
  };

  // Get streak
  let streak = 0;
  const d = new Date();
  while (entries.some(e => e.date === d.toISOString().split('T')[0])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  // Recent dates
  const recentDates: string[] = [];
  const dd = new Date();
  for (let i = 0; i < 7; i++) {
    recentDates.push(dd.toISOString().split('T')[0]);
    dd.setDate(dd.getDate() - 1);
  }

  return (
    <div className="flex h-full font-inter">
      {/* Sidebar */}
      <div className="w-[140px] border-r border-white/5 p-2 flex flex-col">
        {streak > 0 && (
          <div className="text-center py-2 mb-2">
            <p className="text-[9px] text-white/30">Streak</p>
            <p className="text-lg text-[#dc2626] font-mono">🔥 {streak}</p>
          </div>
        )}
        <div className="flex-1 space-y-0.5 overflow-y-auto">
          {recentDates.map(date => {
            const hasEntry = entries.some(e => e.date === date && e.content);
            const isSelected = date === selectedDate;
            return (
              <button key={date} onClick={() => { setSelectedDate(date); setContent(entries.find(e => e.date === date)?.content || ''); }}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] ${
                  isSelected ? 'bg-[#dc2626]/10 text-white/80' : 'text-white/40 hover:bg-white/5'
                }`}>
                <div className="flex items-center gap-1.5">
                  {hasEntry && <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />}
                  {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
          <p className="text-xs text-white/50">
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <textarea
          value={content}
          onChange={e => handleContentChange(e.target.value)}
          placeholder="How was your day?"
          className="flex-1 bg-transparent p-4 text-sm text-white/70 outline-none resize-none font-caveat text-base leading-relaxed"
        />
      </div>
    </div>
  );
}

// DragonOS Calendar App
import { useState, useMemo } from 'react';
import { usePersist } from '@/state/persistence/local-storage';
import type { CalendarEvent } from '@/types/os.types';

export default function Calendar() {
  const [events, setEvents] = usePersist<CalendarEvent[]>('calendar-events', []);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEvent, setNewEvent] = useState('');
  const [newTime, setNewTime] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first

  const days = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDay, daysInMonth]);

  const eventsOnDate = (date: string) => events.filter(e => e.date === date);

  const addEvent = () => {
    if (!newEvent.trim()) return;
    const ev: CalendarEvent = { id: Date.now().toString(), title: newEvent.trim(), date: selectedDate, time: newTime || undefined };
    setEvents([...events, ev]);
    setNewEvent(''); setNewTime(''); setShowAdd(false);
  };

  const deleteEvent = (id: string) => setEvents(events.filter(e => e.id !== id));

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex h-full font-inter">
      {/* Month Grid */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setViewDate(new Date(year, month - 1))} className="text-white/30 hover:text-white/60 text-sm px-2">‹</button>
          <h3 className="text-sm text-white/80 font-display">{monthName}</h3>
          <button onClick={() => setViewDate(new Date(year, month + 1))} className="text-white/30 hover:text-white/60 text-sm px-2">›</button>
        </div>
        <button onClick={() => { setViewDate(new Date()); setSelectedDate(today); }}
          className="text-[9px] text-[#dc2626] mb-2 hover:underline">Today</button>
        <div className="grid grid-cols-7 gap-0.5">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className="text-center text-[9px] text-white/20 py-1">{d}</div>
          ))}
          {days.map((d, i) => {
            if (d === null) return <div key={`e-${i}`} />;
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;
            const hasEvents = eventsOnDate(dateStr).length > 0;
            return (
              <button key={i} onClick={() => setSelectedDate(dateStr)}
                className={`relative flex flex-col items-center py-1.5 rounded-lg text-xs transition-colors ${
                  isSelected ? 'bg-[#dc2626]/20 text-white' : isToday ? 'text-[#dc2626] font-bold' : 'text-white/50 hover:bg-white/5'
                }`}>
                {d}
                {hasEvents && <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#f87171]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-[180px] border-l border-white/5 p-3 flex flex-col">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">{selectedDate}</p>
        <div className="flex-1 space-y-1.5 overflow-y-auto">
          {eventsOnDate(selectedDate).map(ev => (
            <div key={ev.id} className="group flex items-center justify-between p-2 rounded-lg bg-white/5">
              <div>
                <p className="text-xs text-white/70">{ev.title}</p>
                {ev.time && <p className="text-[9px] text-white/30 font-mono">{ev.time}</p>}
              </div>
              <button onClick={() => deleteEvent(ev.id)}
                className="text-[10px] text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100">×</button>
            </div>
          ))}
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="mt-2 w-full py-1.5 rounded-lg bg-[#dc2626]/20 text-[#dc2626] text-[10px] hover:bg-[#dc2626]/30 transition-colors">
          + Add Event
        </button>
        {showAdd && (
          <div className="mt-2 space-y-1.5">
            <input value={newEvent} onChange={e => setNewEvent(e.target.value)} placeholder="Event name"
              className="w-full text-xs bg-white/5 rounded px-2 py-1.5 text-white/70 placeholder:text-white/20 outline-none" />
            <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
              className="w-full text-xs bg-white/5 rounded px-2 py-1.5 text-white/70 outline-none" />
            <button onClick={addEvent}
              className="w-full py-1.5 rounded-lg bg-[#dc2626] text-white text-[10px]">Save</button>
          </div>
        )}
      </div>
    </div>
  );
}

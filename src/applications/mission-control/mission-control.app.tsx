// DragonOS Dashboard - Today overview
import { useMemo } from 'react';
import { load } from '@/state/persistence/local-storage';
import type { TodoItem, Habit, Goal, CalendarEvent } from '@/types/os.types';

export default function Dashboard() {
  const todos = load<TodoItem[]>('todos', []);
  const habits = load<Habit[]>('habits', []);
  const goals = load<Goal[]>('goals', []);
  const events = load<CalendarEvent[]>('events', []);

  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const doneToday = todos.filter(t => t.done).length;
    const totalTodos = todos.length;
    const habitsTicked = habits.filter(h => h.completions.includes(today)).length;
    const totalHabits = habits.length;
    const goalProgress = goals.length > 0
      ? Math.round(goals.reduce((sum, g) => {
          const done = g.milestones.filter(m => m.done).length;
          return sum + (g.milestones.length > 0 ? done / g.milestones.length : 0);
        }, 0) / goals.length * 100)
      : 0;
    const todayEvents = events.filter(e => e.date === today);
    const streaks = habits.filter(h => {
      let streak = 0;
      const d = new Date();
      while (h.completions.includes(d.toISOString().split('T')[0])) {
        streak++;
        d.setDate(d.getDate() - 1);
      }
      return streak;
    }).map(h => {
      let streak = 0;
      const d = new Date();
      while (h.completions.includes(d.toISOString().split('T')[0])) {
        streak++;
        d.setDate(d.getDate() - 1);
      }
      return { name: h.name, streak };
    }).filter(s => s.streak > 0);
    return { doneToday, totalTodos, habitsTicked, totalHabits, goalProgress, todayEvents, streaks };
  }, [todos, habits, goals, events, today]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning ☀️';
    if (h < 18) return 'Good afternoon 🌤️';
    return 'Good evening 🌙';
  };

  return (
    <div className="p-6 font-inter space-y-5">
      <div>
        <p className="text-white/40 text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h2 className="text-xl text-white/90 font-display mt-1">{greeting()}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Tasks */}
        <div className="rounded-xl p-4 bg-white/5 border border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Tasks Done</p>
          <p className="text-2xl text-white/90 mt-1 font-mono">{stats.doneToday}/{stats.totalTodos}</p>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#dc2626] rounded-full transition-all" style={{ width: `${stats.totalTodos > 0 ? (stats.doneToday / stats.totalTodos) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Habits */}
        <div className="rounded-xl p-4 bg-white/5 border border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Habits Ticked</p>
          <p className="text-2xl text-white/90 mt-1 font-mono">{stats.habitsTicked}/{stats.totalHabits}</p>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${stats.totalHabits > 0 ? (stats.habitsTicked / stats.totalHabits) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Goals */}
        <div className="rounded-xl p-4 bg-white/5 border border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Goal Progress</p>
          <p className="text-2xl text-white/90 mt-1 font-mono">{stats.goalProgress}%</p>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${stats.goalProgress}%` }} />
          </div>
        </div>

        {/* Events */}
        <div className="rounded-xl p-4 bg-white/5 border border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Today's Events</p>
          <p className="text-2xl text-white/90 mt-1 font-mono">{stats.todayEvents.length}</p>
          {stats.todayEvents.length > 0 && (
            <p className="text-[10px] text-white/40 mt-1">{stats.todayEvents[0].title}</p>
          )}
        </div>
      </div>

      {/* Streaks */}
      {stats.streaks.length > 0 && (
        <div className="rounded-xl p-4 bg-white/5 border border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Active Streaks 🔥</p>
          <div className="flex flex-wrap gap-2">
            {stats.streaks.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-full">
                <span>{s.name}</span>
                <span className="text-[#dc2626] font-mono">{s.streak}d</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

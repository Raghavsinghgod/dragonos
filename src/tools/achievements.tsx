// DragonOS Achievements App
import { load } from '@/core/persist';

const allAchievements = [
  { id: 'first-note', title: 'First Note', desc: 'Created your first notepad note', icon: '📝' },
  { id: 'streak-7', title: '7-Day Streak', desc: 'Maintained a habit for 7 days', icon: '🔥' },
  { id: 'tasks-10', title: 'Task Master', desc: 'Completed 10 tasks', icon: '✅' },
  { id: 'goal-done', title: 'Goal Completed', desc: 'Completed all milestones in a goal', icon: '🎯' },
  { id: 'konami', title: 'Dragon Tamer', desc: 'Found the Konami code', icon: '🐉' },
  { id: 'first-journal', title: 'Dear Diary', desc: 'Wrote your first journal entry', icon: '📔' },
  { id: 'expense-track', title: 'Money Minder', desc: 'Tracked 10 expenses', icon: '💰' },
  { id: 'pomodoro-5', title: 'Focused', desc: 'Completed 5 pomodoro sessions', icon: '🍅' },
  { id: 'kanban-user', title: 'Organizer', desc: 'Created 5 kanban cards', icon: '📋' },
  { id: 'habit-3', title: 'Habit Formed', desc: 'Tracked 3 different habits', icon: '🔄' },
  { id: 'mood-week', title: 'Mood Tracker', desc: 'Logged mood for 7 days', icon: '😊' },
  { id: 'drawer-user', title: 'Power User', desc: 'Used the drawer panel', icon: '📊' },
];

function checkUnlocked(id: string): boolean {
  switch (id) {
    case 'first-note': return load<unknown[]>('notepad-notes', []).length > 0;
    case 'tasks-10': return load<{ done: boolean }[]>('todos', []).filter(t => t.done).length >= 10;
    case 'goal-done': return load<{ milestones: { done: boolean }[] }[]>('goals', [])
      .some(g => g.milestones.length > 0 && g.milestones.every(m => m.done));
    case 'first-journal': return load<{ content: string }[]>('journal-entries', []).some(e => e.content);
    case 'expense-track': return load<unknown[]>('expenses-list', []).length >= 10;
    case 'pomodoro-5': return load<number>('pomodoro-sessions', 0) >= 5;
    case 'kanban-user': return load<{ cards: unknown[] }[]>('kanban-cols', []).some(c => c.cards.length >= 3);
    case 'habit-3': return load<unknown[]>('habits', []).length >= 3;
    case 'mood-week': return load<unknown[]>('mood-entries', []).length >= 7;
    default: return false;
  }
}

export default function Achievements() {
  const unlocked = allAchievements.filter(a => checkUnlocked(a.id));
  const locked = allAchievements.filter(a => !checkUnlocked(a.id));

  return (
    <div className="p-4 font-inter space-y-4 max-h-full overflow-y-auto">
      <div className="text-center mb-4">
        <p className="text-2xl text-white/80 font-mono">{unlocked.length}/{allAchievements.length}</p>
        <p className="text-[10px] text-white/30">Achievements Unlocked</p>
        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[200px] mx-auto">
          <div className="h-full bg-[#dc2626] rounded-full transition-all"
            style={{ width: `${(unlocked.length / allAchievements.length) * 100}%` }} />
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Unlocked</p>
          <div className="grid grid-cols-2 gap-2">
            {unlocked.map(a => (
              <div key={a.id} className="p-3 rounded-xl bg-[#dc2626]/5 border border-[#dc2626]/10">
                <span className="text-2xl">{a.icon}</span>
                <p className="text-xs text-white/80 mt-1">{a.title}</p>
                <p className="text-[9px] text-white/40 mt-0.5">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Locked</p>
          <div className="grid grid-cols-2 gap-2">
            {locked.map(a => (
              <div key={a.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 opacity-40">
                <span className="text-2xl grayscale">🔒</span>
                <p className="text-xs text-white/50 mt-1">{a.title}</p>
                <p className="text-[9px] text-white/20 mt-0.5">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

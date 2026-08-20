// DragonOS Goals App
import { useState, useEffect } from 'react';
import { save, load } from '../persist';
import { sounds } from '../sounds';
import type { Goal } from '../types';

const emojis = ['🎯', '🏆', '💪', '📚', '🎨', '🏃', '💰', '🧘', '🎸', '✈️', '🎬', '💻', '🌟', '🔥', '❤️'];

export default function Goals() {
  const [goals, setGoals] = load<Goal[]>('goals', []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState('');

  const selected = goals.find(g => g.id === selectedId);

  const addGoal = () => {
    const goal: Goal = { id: Date.now().toString(), emoji: '🎯', title: 'New Goal', milestones: [] };
    setGoals([...goals, goal]);
    setSelectedId(goal.id);
  };

  const updateEmoji = (id: string, emoji: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, emoji } : g));
    setShowEmoji(null);
    sounds.click();
  };

  const updateTitle = (id: string, title: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, title } : g));
  };

  const addMilestone = () => {
    if (!selected || !newMilestone.trim()) return;
    const ms = { id: Date.now().toString(), text: newMilestone.trim(), done: false };
    setGoals(goals.map(g => g.id === selected.id ? { ...g, milestones: [...g.milestones, ms] } : g));
    setNewMilestone('');
  };

  const toggleMilestone = (goalId: string, msId: string) => {
    setGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      const updated = g.milestones.map(m => m.id === msId ? { ...m, done: !m.done } : m);
      const allDone = updated.length > 0 && updated.every(m => m.done);
      if (allDone) sounds.victory();
      return { ...g, milestones: updated };
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const deleteMilestone = (goalId: string, msId: string) => {
    setGoals(goals.map(g => g.id === goalId ? { ...g, milestones: g.milestones.filter(m => m.id !== msId) } : g));
  };

  return (
    <div className="flex h-full font-inter">
      {/* Card Gallery */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm text-white/80 font-display">Goals</h3>
          <button onClick={addGoal} className="text-[10px] text-[#dc2626] hover:text-[#dc2626]/80">+ New</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {goals.map(g => {
            const done = g.milestones.filter(m => m.done).length;
            const total = g.milestones.length;
            const progress = total > 0 ? (done / total) * 100 : 0;
            return (
              <button key={g.id} onClick={() => setSelectedId(g.id)}
                className={`relative p-3 rounded-xl text-left transition-all ${
                  selectedId === g.id ? 'bg-[#dc2626]/10 ring-1 ring-[#dc2626]/30' : 'bg-white/5 hover:bg-white/8'
                }`}>
                <div className="relative inline-block">
                  <span className="text-2xl">{g.emoji}</span>
                  <button onClick={(e) => { e.stopPropagation(); setShowEmoji(showEmoji === g.id ? null : g.id); }}
                    className="absolute -top-1 -right-1 text-[8px] bg-white/10 rounded-full w-3.5 h-3.5 flex items-center justify-center text-white/30">✏️</button>
                </div>
                {showEmoji === g.id && (
                  <div className="absolute z-10 p-2 rounded-lg bg-[rgba(12,12,18,0.95)] border border-white/10 grid grid-cols-5 gap-1 mt-1">
                    {emojis.map(e => (
                      <button key={e} onClick={(ev) => { ev.stopPropagation(); updateEmoji(g.id, e); }}
                        className="text-sm hover:bg-white/10 rounded p-0.5">{e}</button>
                    ))}
                  </div>
                )}
                <input value={g.title} onChange={e => updateTitle(g.id, e.target.value)}
                  onClick={e => e.stopPropagation()}
                  className="block mt-1 text-xs text-white/70 bg-transparent outline-none w-full font-inter" />
                {total > 0 && (
                  <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#dc2626] rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}
                <p className="text-[9px] text-white/20 mt-1">{done}/{total} milestones</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Milestone Panel */}
      {selected ? (
        <div className="w-[200px] border-l border-white/5 p-3 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg">{selected.emoji}</span>
            <button onClick={() => deleteGoal(selected.id)} className="text-[10px] text-white/20 hover:text-red-400">Delete</button>
          </div>
          <div className="flex gap-1 mb-2">
            <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMilestone()}
              placeholder="Add milestone..."
              className="flex-1 text-[10px] bg-white/5 rounded px-2 py-1.5 text-white/60 placeholder:text-white/20 outline-none" />
            <button onClick={addMilestone} className="text-[10px] px-2 py-1.5 rounded bg-[#dc2626]/20 text-[#dc2626]">+</button>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto">
            {selected.milestones.map(ms => (
              <div key={ms.id} className="flex items-center gap-2 py-1 group">
                <button onClick={() => toggleMilestone(selected.id, ms.id)}
                  className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${
                    ms.done ? 'bg-[#dc2626] border-[#dc2626]' : 'border-white/20'
                  }`}>
                  {ms.done && <span className="text-[7px] text-white">✓</span>}
                </button>
                <span className={`flex-1 text-[10px] ${ms.done ? 'line-through text-white/30' : 'text-white/60'}`}>{ms.text}</span>
                <button onClick={() => deleteMilestone(selected.id, ms.id)}
                  className="text-[8px] text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100">×</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-[200px] border-l border-white/5 flex items-center justify-center text-[10px] text-white/20 font-inter">
          Select a goal
        </div>
      )}
    </div>
  );
}

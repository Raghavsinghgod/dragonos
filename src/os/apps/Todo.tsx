// DragonOS Todo App
import { useState, useEffect, useMemo } from 'react';
import { save, load } from '../persist';
import { sounds } from '../sounds';
import type { TodoItem } from '../types';

type Filter = 'all' | 'active' | 'done';
type Priority = 'LOW' | 'MED' | 'HIGH';

const priorityColors: Record<Priority, string> = {
  LOW: 'bg-blue-500/20 text-blue-400',
  MED: 'bg-yellow-500/20 text-yellow-400',
  HIGH: 'bg-red-500/20 text-red-400',
};

export default function Todo() {
  const [todos, setTodos] = load<TodoItem[]>('todos', []);
  const [filter, setFilter] = useState<Filter>('all');
  const [newText, setNewText] = useState('');
  const [celebrated, setCelebrated] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.done);
    if (filter === 'done') return todos.filter(t => t.done);
    return todos;
  }, [todos, filter]);

  const doneCount = todos.filter(t => t.done).length;
  const progress = todos.length > 0 ? (doneCount / todos.length) * 100 : 0;
  const allDone = todos.length > 0 && doneCount === todos.length;

  useEffect(() => {
    if (allDone && !celebrated) {
      sounds.victory();
      setCelebrated(true);
    }
  }, [allDone, celebrated]);

  const addTodo = () => {
    if (!newText.trim()) return;
    setTodos([...todos, {
      id: Date.now().toString(),
      text: newText.trim(),
      priority: 'MED',
      done: false,
      createdAt: Date.now(),
    }]);
    setNewText('');
    sounds.click();
  };

  const toggleDone = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    sounds.click();
  };

  const cyclePriority = (id: string) => {
    const order: Priority[] = ['LOW', 'MED', 'HIGH'];
    setTodos(todos.map(t => {
      if (t.id !== id) return t;
      const next = order[(order.indexOf(t.priority) + 1) % 3];
      return { ...t, priority: next };
    }));
  };

  const deleteTodo = (id: string) => setTodos(todos.filter(t => t.id !== id));

  const clearDone = () => { setTodos(todos.filter(t => !t.done)); sounds.click(); };

  return (
    <div className="p-4 font-inter space-y-3">
      {/* Add */}
      <div className="flex gap-2">
        <input value={newText} onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..."
          className="flex-1 text-sm bg-white/5 rounded-lg px-3 py-2 text-white/70 placeholder:text-white/20 outline-none" />
        <button onClick={addTodo}
          className="px-3 py-2 rounded-lg bg-[#dc2626] text-white text-sm hover:bg-[#dc2626]/80 transition-colors">Add</button>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-[10px] text-white/30 mb-1">
          <span>{doneCount}/{todos.length} done</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#dc2626] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {allDone && (
        <div className="text-center py-2 text-sm text-green-400 animate-bounce">🎉 All tasks done!</div>
      )}

      {/* Filters */}
      <div className="flex gap-1">
        {(['all', 'active', 'done'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-[10px] capitalize transition-colors ${
              filter === f ? 'bg-white/10 text-white/80' : 'text-white/30 hover:text-white/50'
            }`}>{f}</button>
        ))}
        <button onClick={clearDone}
          className="ml-auto px-3 py-1 rounded-lg text-[10px] text-white/20 hover:text-red-400 transition-colors">Clear done</button>
      </div>

      {/* List */}
      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {filtered.map(todo => (
          <div key={todo.id}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${todo.done ? 'bg-white/[0.02]' : 'bg-white/5 hover:bg-white/[0.07]'}`}>
            <button onClick={() => toggleDone(todo.id)}
              className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                todo.done ? 'bg-[#dc2626] border-[#dc2626]' : 'border-white/20 hover:border-white/40'
              }`}>
              {todo.done && <span className="text-[8px] text-white">✓</span>}
            </button>
            <span className={`flex-1 text-xs ${todo.done ? 'line-through text-white/30' : 'text-white/70'}`}>{todo.text}</span>
            <button onClick={() => cyclePriority(todo.id)}
              className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </button>
            <button onClick={() => deleteTodo(todo.id)}
              className="text-[10px] text-white/20 hover:text-red-400">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

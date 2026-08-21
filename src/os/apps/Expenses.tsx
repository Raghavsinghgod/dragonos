// DragonOS Expenses App
import { useState, useMemo } from 'react';
import { usePersist } from '../persist';
import { sounds } from '../sounds';
import type { Expense } from '../types';

const categories = ['🍔 Food', '🏠 Housing', '🎮 Fun', '🛒 Shopping', '🚗 Transport', '📚 Education', '💰 Other'];
const catColors: Record<string, string> = {
  '🍔 Food': '#f59e0b', '🏠 Housing': '#3b82f6', '🎮 Fun': '#a855f7',
  '🛒 Shopping': '#ec4899', '🚗 Transport': '#22c55e', '📚 Education': '#06b6d4', '💰 Other': '#6b7280',
};

export default function Expenses() {
  const [expenses, setExpenses] = usePersist<Expense[]>('expenses-list', []);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [note, setNote] = useState('');
  const [budget, setBudget] = usePersist('expenses-budget', 2000);

  const month = new Date().toISOString().slice(0, 7);
  const monthExpenses = useMemo(
    () => expenses.filter(e => e.date.startsWith(month)),
    [expenses, month],
  );
  const total = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const progress = Math.min(100, (total / budget) * 100);

  const byCat = useMemo(() => {
    const map: Record<string, number> = {};
    monthExpenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [monthExpenses]);

  const addExpense = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setExpenses([...expenses, {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
      note,
    }]);
    setAmount(''); setNote('');
    sounds.click();
  };

  const deleteExpense = (id: string) => setExpenses(expenses.filter(e => e.id !== id));

  return (
    <div className="p-4 font-inter space-y-4 max-h-full overflow-y-auto">
      {/* Budget Ring */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke={progress > 90 ? '#ef4444' : '#dc2626'}
              strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-white/70 font-mono">{Math.round(progress)}%</span>
          </div>
        </div>
        <div>
          <p className="text-lg text-white/80 font-mono">${total.toFixed(2)}</p>
          <p className="text-[9px] text-white/30">of ${budget} budget</p>
          <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))}
            className="mt-1 text-[9px] bg-white/5 rounded px-2 py-1 text-white/40 w-20 outline-none" />
        </div>
      </div>

      {/* Add */}
      <div className="p-3 rounded-xl bg-white/5 space-y-2">
        <div className="flex gap-2">
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="$0.00"
            className="w-24 text-sm bg-white/5 rounded-lg px-3 py-2 text-white/70 outline-none font-mono" />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="flex-1 text-xs bg-white/5 rounded-lg px-2 py-2 text-white/70 outline-none">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={addExpense} className="px-3 py-2 rounded-lg bg-[#dc2626] text-white text-xs">Add</button>
        </div>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)"
          className="w-full text-xs bg-white/5 rounded-lg px-3 py-1.5 text-white/50 outline-none" />
      </div>

      {/* Category Bars */}
      <div className="space-y-1.5">
        {byCat.map(([cat, amt]) => (
          <div key={cat} className="flex items-center gap-2">
            <span className="text-[10px] text-white/40 w-24 truncate">{cat}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${(amt / total) * 100}%`, background: catColors[cat] || '#666' }} />
            </div>
            <span className="text-[10px] text-white/30 font-mono w-16 text-right">${amt.toFixed(0)}</span>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="space-y-1">
        {monthExpenses.slice(-10).reverse().map(e => (
          <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] group">
            <div>
              <span className="text-[10px] text-white/50">{e.category}</span>
              {e.note && <span className="text-[9px] text-white/20 ml-2">{e.note}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60 font-mono">${e.amount.toFixed(2)}</span>
              <button onClick={() => deleteExpense(e.id)}
                className="text-[9px] text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100">×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

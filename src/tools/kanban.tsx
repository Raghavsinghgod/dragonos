// DragonOS Kanban Board
import { useState } from 'react';
import { usePersist } from '@/core/persist';
import { sounds } from '@/core/audio';
import type { KanbanColumn } from '@/core/store';

const tagColors = ['#dc2626', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];

export default function Kanban() {
  const [columns, setColumns] = usePersist<KanbanColumn[]>('kanban-cols', [
    { id: '1', title: 'To Do', cards: [] },
    { id: '2', title: 'In Progress', cards: [] },
    { id: '3', title: 'Done', cards: [] },
  ]);
  const [dragCard, setDragCard] = useState<{ colId: string; cardId: string } | null>(null);
  const [newCard, setNewCard] = useState<Record<string, string>>({});
  const [colorIdx, setColorIdx] = useState(0);

  const addCard = (colId: string) => {
    const text = newCard[colId]?.trim();
    if (!text) return;
    const card = { id: Date.now().toString(), text, color: tagColors[colorIdx % tagColors.length] };
    setColumns(columns.map(c => c.id === colId ? { ...c, cards: [...c.cards, card] } : c));
    setNewCard({ ...newCard, [colId]: '' });
    setColorIdx(colorIdx + 1);
    sounds.click();
  };

  const deleteCard = (colId: string, cardId: string) => {
    setColumns(columns.map(c => c.id === colId ? { ...c, cards: c.cards.filter(card => card.id !== cardId) } : c));
  };

  const renameColumn = (colId: string, title: string) => {
    setColumns(columns.map(c => c.id === colId ? { ...c, title } : c));
  };

  const addColumn = () => {
    setColumns([...columns, { id: Date.now().toString(), title: 'New Column', cards: [] }]);
    sounds.click();
  };

  const deleteColumn = (colId: string) => {
    setColumns(columns.filter(c => c.id !== colId));
  };

  const onDragStart = (colId: string, cardId: string) => setDragCard({ colId, cardId });

  const onDrop = (targetColId: string) => {
    if (!dragCard || dragCard.colId === targetColId) { setDragCard(null); return; }
    const sourceCol = columns.find(c => c.id === dragCard.colId);
    const card = sourceCol?.cards.find(c => c.id === dragCard.cardId);
    if (!card) { setDragCard(null); return; }
    setColumns(columns.map(c => {
      if (c.id === dragCard.colId) return { ...c, cards: c.cards.filter(cd => cd.id !== card.id) };
      if (c.id === targetColId) return { ...c, cards: [...c.cards, card] };
      return c;
    }));
    setDragCard(null);
    sounds.snap();
  };

  return (
    <div className="flex h-full font-inter overflow-x-auto p-4 gap-3">
      {columns.map(col => (
        <div key={col.id} className="w-[200px] flex-shrink-0 flex flex-col bg-white/5 rounded-xl p-2"
          onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col.id)}>
          <div className="flex items-center justify-between mb-2 px-1">
            <input value={col.title} onChange={e => renameColumn(col.id, e.target.value)}
              className="text-xs text-white/70 font-semibold bg-transparent outline-none w-full" />
            <span className="text-[9px] text-white/20 ml-1">{col.cards.length}</span>
            <button onClick={() => deleteColumn(col.id)} className="text-[10px] text-white/20 hover:text-red-400 ml-1">×</button>
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto min-h-[60px]">
            {col.cards.map(card => (
              <div key={card.id} draggable onDragStart={() => onDragStart(col.id, card.id)}
                className="p-2 rounded-lg bg-[rgba(12,12,18,0.6)] border border-white/5 cursor-grab active:cursor-grabbing group flex items-start gap-2">
                <div className="w-1 h-full rounded-full flex-shrink-0 mt-0.5" style={{ background: card.color }} />
                <span className="flex-1 text-[11px] text-white/60">{card.text}</span>
                <button onClick={() => deleteCard(col.id, card.id)}
                  className="text-[9px] text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-2">
            <input value={newCard[col.id] || ''} onChange={e => setNewCard({ ...newCard, [col.id]: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addCard(col.id)}
              placeholder="Add card..."
              className="flex-1 text-[10px] bg-white/5 rounded px-2 py-1.5 text-white/60 placeholder:text-white/20 outline-none" />
            <button onClick={() => addCard(col.id)} className="text-[10px] px-2 py-1.5 rounded bg-white/5 text-white/30">+</button>
          </div>
        </div>
      ))}
      <button onClick={addColumn}
        className="w-[120px] flex-shrink-0 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs hover:border-white/20 transition-colors">
        + Column
      </button>
    </div>
  );
}

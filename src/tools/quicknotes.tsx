// DragonOS Quick Notes App
import { useState } from 'react';
import { usePersist } from '@/core/persist';
import { sounds } from '@/core/audio';

interface QNote { id: string; text: string; time: number; }

export default function QuickNotes() {
  const [notes, setNotes] = usePersist<QNote[]>('quick-notes', []);
  const [input, setInput] = useState('');

  const addNote = () => {
    if (!input.trim()) return;
    setNotes([{ id: Date.now().toString(), text: input.trim(), time: Date.now() }, ...notes]);
    setInput('');
    sounds.click();
  };

  const deleteNote = (id: string) => setNotes(notes.filter(n => n.id !== id));

  return (
    <div className="p-4 font-inter space-y-3">
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addNote()}
          placeholder="Quick note..."
          className="flex-1 text-sm bg-white/5 rounded-lg px-3 py-2 text-white/70 outline-none font-caveat" />
        <button onClick={addNote} className="px-3 py-2 rounded-lg bg-[#dc2626] text-white text-xs">Add</button>
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {notes.map(n => (
          <div key={n.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.03] group">
            <span className="text-[10px] text-white/30 font-mono mt-0.5 shrink-0">
              {new Date(n.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <p className="flex-1 text-sm text-white/60 font-caveat">{n.text}</p>
            <button onClick={() => deleteNote(n.id)}
              className="text-[10px] text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100">×</button>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-xs text-white/20 text-center py-8">No notes yet</p>
        )}
      </div>
    </div>
  );
}

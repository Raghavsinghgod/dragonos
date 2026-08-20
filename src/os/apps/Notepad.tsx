// DragonOS Notepad App
import { useState, useEffect, useRef } from 'react';
import { save, load } from '../persist';
import type { Note } from '../types';

export default function Notepad() {
  const [notes, setNotes] = load<Note[]>('notepad-notes', []);
  const [activeId, setActiveId] = useState<string>(notes[0]?.id || '');
  const [saved, setSaved] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeNote = notes.find(n => n.id === activeId);

  const createNote = () => {
    const id = Date.now().toString();
    const note: Note = { id, title: 'Untitled', content: '', createdAt: Date.now(), updatedAt: Date.now() };
    setNotes([note, ...notes]);
    setActiveId(id);
  };

  const updateContent = (content: string) => {
    setNotes(notes.map(n => n.id === activeId ? { ...n, content, updatedAt: Date.now() } : n));
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaved(true);
    }, 1000);
  };

  const updateTitle = (title: string) => {
    setNotes(notes.map(n => n.id === activeId ? { ...n, title, updatedAt: Date.now() } : n));
  };

  const deleteNote = (id: string) => {
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (activeId === id) setActiveId(remaining[0]?.id || '');
  };

  useEffect(() => { save('notepad-notes', notes); }, [notes]);

  const words = activeNote ? activeNote.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = activeNote ? activeNote.content.length : 0;

  const exportTxt = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${activeNote.title}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full font-inter">
      {/* Sidebar */}
      <div className="w-[160px] border-r border-white/5 flex flex-col">
        <button onClick={createNote}
          className="m-2 px-3 py-1.5 rounded-lg bg-[#dc2626]/20 text-[#dc2626] text-[10px] hover:bg-[#dc2626]/30 transition-colors">
          + New Note
        </button>
        <div className="flex-1 overflow-y-auto px-1">
          {notes.map(n => (
            <div key={n.id}
              onClick={() => setActiveId(n.id)}
              className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-xs mb-0.5 ${
                n.id === activeId ? 'bg-white/8 text-white/80' : 'text-white/40 hover:bg-white/5'
              }`}>
              <span className="truncate">{n.title || 'Untitled'}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }}
                className="text-white/20 hover:text-red-400 text-[10px]">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      {activeNote ? (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
            <input value={activeNote.title} onChange={e => updateTitle(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white/80 outline-none font-inter" />
            <span className={`text-[9px] ${saved ? 'text-green-400/50' : 'text-white/20'}`}>
              {saved ? 'Saved' : 'Saving...'}
            </span>
            <button onClick={exportTxt} className="text-[10px] text-white/30 hover:text-white/50 px-2 py-1 rounded bg-white/5">Export</button>
          </div>
          <textarea
            value={activeNote.content}
            onChange={e => updateContent(e.target.value)}
            placeholder="Start writing..."
            className="flex-1 bg-transparent text-sm text-white/70 p-4 outline-none resize-none leading-relaxed font-caveat text-base"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(255,255,255,0.03) 27px, rgba(255,255,255,0.03) 28px)',
              backgroundSize: '100% 28px',
              lineHeight: '28px',
              paddingTop: '4px',
            }}
          />
          <div className="flex justify-between px-3 py-1.5 border-t border-white/5 text-[9px] text-white/20">
            <span>{words} words</span>
            <span>{chars} chars</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/20 text-xs font-inter">
          No notes yet. Create one!
        </div>
      )}
    </div>
  );
}

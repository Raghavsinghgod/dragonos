// DragonOS Clipboard App
import { useState, useEffect } from 'react';
import { save, load } from '../persist';
import { sounds } from '../sounds';

interface ClipItem { id: string; text: string; time: number; }

export default function Clipboard() {
  const [items, setItems] = load<ClipItem[]>('clipboard-items', []);
  const [manualInput, setManualInput] = useState('');

  // Listen for clipboard paste
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text');
      if (text && text.trim()) {
        addClip(text.trim());
      }
    };
    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
  }, []);

  const addClip = (text: string) => {
    const exists = items.find(i => i.text === text);
    if (exists) return;
    setItems([{ id: Date.now().toString(), text, time: Date.now() }, ...items].slice(0, 50));
  };

  const addManual = () => {
    if (!manualInput.trim()) return;
    addClip(manualInput.trim());
    setManualInput('');
    sounds.click();
  };

  const copyClip = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    sounds.complete();
  };

  const deleteClip = (id: string) => setItems(items.filter(i => i.id !== id));

  const clearAll = () => { setItems([]); sounds.click(); };

  const formatTime = (t: number) => {
    const d = new Date(t);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 font-inter space-y-3">
      <div className="flex gap-2">
        <input value={manualInput} onChange={e => setManualInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addManual()}
          placeholder="Add to clipboard..."
          className="flex-1 text-xs bg-white/5 rounded-lg px-3 py-2 text-white/70 outline-none" />
        <button onClick={addManual} className="px-3 py-2 rounded-lg bg-[#dc2626] text-white text-xs">Add</button>
        <button onClick={clearAll} className="px-3 py-2 rounded-lg bg-white/5 text-white/30 text-xs">Clear</button>
      </div>

      <div className="space-y-1 max-h-[350px] overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="group p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/5 transition-colors">
            <p className="text-xs text-white/60 break-all line-clamp-3">{item.text}</p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[9px] text-white/20">{formatTime(item.time)}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => copyClip(item.text)} className="text-[9px] text-white/30 hover:text-[#dc2626]">Copy</button>
                <button onClick={() => deleteClip(item.id)} className="text-[9px] text-white/20 hover:text-red-400">×</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-white/20 text-center py-8">No clipboard items yet</p>
        )}
      </div>
    </div>
  );
}

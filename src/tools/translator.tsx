// DragonOS Translator App
import { useState } from 'react';

const langMap: Record<string, (text: string) => string> = {
  'Spanish': t => t.replace(/[aeiou]/gi, m => m === m.toUpperCase() ? 'Ó' : 'ó'),
  'French': t => t.split(' ').map(w => 'le ' + w).join(' '),
  'German': t => t.toUpperCase(),
  'Italian': t => t + '意大利',
  'Japanese': t => '🐉 ' + t,
  'Korean': t => '한 ' + t,
};

const languages = Object.keys(langMap);

export default function Translator() {
  const [input, setInput] = useState('');
  const [target, setTarget] = useState(languages[0]);
  const output = input ? (langMap[target]?.(input) || input) : '';

  return (
    <div className="p-4 font-inter space-y-4 max-h-full overflow-y-auto">
      <p className="text-[10px] text-white/30 uppercase tracking-wider">Translator</p>

      <textarea value={input} onChange={e => setInput(e.target.value)}
        placeholder="Enter text to translate..."
        className="w-full h-24 text-sm bg-white/5 rounded-xl px-3 py-2 text-white/70 outline-none resize-none" />

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/30">Translate to:</span>
        <select value={target} onChange={e => setTarget(e.target.value)}
          className="text-xs bg-white/5 rounded-lg px-2 py-1.5 text-white/70 outline-none">
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 min-h-[60px]">
        <p className="text-sm text-white/60">{output || 'Translation will appear here...'}</p>
      </div>

      <p className="text-[9px] text-white/20 text-center">Simple pattern-based translation for fun</p>
    </div>
  );
}

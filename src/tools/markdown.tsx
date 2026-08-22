// DragonOS Markdown Editor App
import { useState } from 'react';
import { save, load } from '@/core/persist';

function renderMd(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold text-white/80 mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-white/80 mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-white/90 mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white/80">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-white/60">$1</em>')
    .replace(/`(.+?)`/g, '<code class="text-[#dc2626] bg-white/5 px-1 rounded text-xs">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="text-sm text-white/60 ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-sm text-white/60 ml-4 list-decimal">$2</li>')
    .replace(/^(?!<[hlu])(.+)$/gm, '<p class="text-sm text-white/60 leading-relaxed mb-1">$1</p>');
}

export default function Markdown() {
  const [content, setContent] = useState(() => load('md-content', '# Hello DragonOS\n\nThis is a **markdown** editor.\n\n- Item one\n- Item two\n- Item three\n\n## Features\n\nWrite in the *left panel*, see the preview on the *right*.\n\n`Code` is supported too!'));

  const handleChange = (val: string) => {
    setContent(val);
    save('md-content', val);
  };

  return (
    <div className="flex h-full font-inter">
      <div className="flex-1 border-r border-white/5 flex flex-col">
        <div className="px-3 py-1.5 border-b border-white/5 text-[9px] text-white/20 uppercase tracking-wider">Editor</div>
        <textarea value={content} onChange={e => handleChange(e.target.value)}
          className="flex-1 bg-transparent p-3 text-xs text-white/60 outline-none resize-none font-mono leading-relaxed"
          placeholder="Write markdown..." />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-3 py-1.5 border-b border-white/5 text-[9px] text-white/20 uppercase tracking-wider">Preview</div>
        <div className="flex-1 p-3 overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: renderMd(content) }} />
      </div>
    </div>
  );
}

// DragonOS Browser App
import { useState } from 'react';

const bookmarks = [
  { name: 'Google', url: 'https://www.google.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'YouTube', url: 'https://www.youtube.com' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org' },
];

export default function Browser() {
  const [url, setUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('https://www.google.com');

  const navigate = () => {
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setUrl(finalUrl);
  };

  return (
    <div className="flex flex-col h-full font-inter">
      {/* URL Bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
        <button onClick={() => {}} className="text-white/20 text-sm">←</button>
        <button onClick={() => {}} className="text-white/20 text-sm">→</button>
        <input value={inputUrl} onChange={e => setInputUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && navigate()}
          className="flex-1 text-xs bg-white/5 rounded-lg px-3 py-1.5 text-white/70 outline-none font-mono" />
        <button onClick={navigate} className="text-[10px] text-[#dc2626] px-2">Go</button>
      </div>
      {/* Bookmarks */}
      <div className="flex gap-1 px-3 py-1.5 border-b border-white/5 overflow-x-auto">
        {bookmarks.map(b => (
          <button key={b.name} onClick={() => { setInputUrl(b.url); setUrl(b.url); }}
            className="text-[9px] text-white/30 hover:text-white/50 px-2 py-0.5 rounded bg-white/5 whitespace-nowrap">
            {b.name}
          </button>
        ))}
      </div>
      {/* Frame */}
      <div className="flex-1 bg-white">
        <iframe src={url} className="w-full h-full border-0" title="Browser" sandbox="allow-scripts allow-same-origin" />
      </div>
    </div>
  );
}

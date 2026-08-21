// DragonOS Vault App
import { useState } from 'react';
import { usePersist } from '@/state/persistence/local-storage';
import { sounds } from '@/lib/audio/cues';
import type { Bookmark } from '@/types/os.types';

export default function Vault() {
  const [bookmarks, setBookmarks] = usePersist<Bookmark[]>('vault-bookmarks', []);
  const [query, setQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newTags, setNewTags] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = bookmarks.filter(b =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const addBookmark = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setBookmarks([...bookmarks, {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: newUrl.trim(),
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
    }]);
    setNewTitle(''); setNewUrl(''); setNewTags(''); setShowAdd(false);
    sounds.click();
  };

  const deleteBookmark = (id: string) => setBookmarks(bookmarks.filter(b => b.id !== id));

  const allTags = [...new Set(bookmarks.flatMap(b => b.tags))];

  return (
    <div className="p-4 font-inter space-y-3 max-h-full overflow-y-auto">
      <div className="flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search bookmarks..." className="flex-1 text-sm bg-white/5 rounded-lg px-3 py-2 text-white/70 placeholder:text-white/20 outline-none" />
        <button onClick={() => setShowAdd(!showAdd)} className="px-3 py-2 rounded-lg bg-[#dc2626] text-white text-xs">+</button>
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {allTags.map(t => (
            <button key={t} onClick={() => setQuery(t)}
              className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 hover:text-white/50">{t}</button>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="p-3 rounded-xl bg-white/5 space-y-2">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title"
            className="w-full text-xs bg-white/5 rounded-lg px-3 py-2 text-white/70 outline-none" />
          <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL"
            className="w-full text-xs bg-white/5 rounded-lg px-3 py-2 text-white/70 outline-none" />
          <input value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="Tags (comma-separated)"
            className="w-full text-xs bg-white/5 rounded-lg px-3 py-2 text-white/70 outline-none" />
          <button onClick={addBookmark} className="w-full py-2 rounded-lg bg-[#dc2626] text-white text-xs">Save</button>
        </div>
      )}

      <div className="space-y-1.5">
        {filtered.map(b => (
          <div key={b.id} className="p-3 rounded-xl bg-white/5 group flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs text-white/70 truncate">{b.title}</p>
              <p className="text-[9px] text-white/30 truncate mt-0.5">{b.url}</p>
              {b.tags.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {b.tags.map(t => (
                    <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30">{t}</span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => deleteBookmark(b.id)}
              className="text-[10px] text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// DragonOS Flashcards App
import { useState } from 'react';
import { sounds } from '@/core/audio';

interface Card { id: string; front: string; back: string; }
interface Deck { id: string; name: string; cards: Card[]; }

export default function Flashcards() {
  const [decks] = useState<Deck[]>([
    { id: '1', name: 'Sample Deck', cards: [
      { id: '1', front: 'What is DragonOS?', back: 'A web-based operating system built with React' },
      { id: '2', front: 'What powers the sound engine?', back: 'WebAudio API — zero audio files' },
      { id: '3', front: 'What is the default font?', back: 'Cinzel for display, Inter for body' },
    ]},
  ]);
  const [activeDeck] = useState(decks[0]);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const card = activeDeck.cards[cardIdx];
  const total = activeDeck.cards.length;

  const grade = (isCorrect: boolean) => {
    if (isCorrect) { setCorrect(c => c + 1); sounds.complete(); }
    else { setWrong(w => w + 1); sounds.error(); }
    setFlipped(false);
    if (cardIdx < total - 1) setCardIdx(i => i + 1);
  };

  const reset = () => { setCardIdx(0); setCorrect(0); setWrong(0); setFlipped(false); };

  if (!card) return <div className="p-4 text-white/40 text-xs font-inter">No cards available</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 font-inter gap-4">
      <p className="text-[10px] text-white/30">{activeDeck.name} — {cardIdx + 1}/{total}</p>

      {/* Card */}
      <div className="w-[300px] h-[180px] perspective-1000 cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className={`relative w-full h-full transition-transform duration-500`}
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
          <div className="absolute inset-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-6"
            style={{ backfaceVisibility: 'hidden' }}>
            <p className="text-white/80 text-center text-sm">{card.front}</p>
          </div>
          <div className="absolute inset-0 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/20 flex items-center justify-center p-6"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <p className="text-white/80 text-center text-sm">{card.back}</p>
          </div>
        </div>
      </div>

      <p className="text-[9px] text-white/20">{flipped ? 'How did you do?' : 'Click to flip'}</p>

      {flipped && (
        <div className="flex gap-3">
          <button onClick={() => grade(false)} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-xs">❌ Wrong</button>
          <button onClick={() => grade(true)} className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 text-xs">✅ Correct</button>
        </div>
      )}

      <div className="flex gap-4 text-xs text-white/40">
        <span>✅ {correct}</span>
        <span>❌ {wrong}</span>
        <button onClick={reset} className="text-[#dc2626] hover:underline">Reset</button>
      </div>
    </div>
  );
}

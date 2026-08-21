// DragonOS easter egg — Konami code triggers confetti rain + fanfare
import { useEffect, useState } from 'react';
import { sounds } from '@/lib/audio/cues';

const EMOJIS = ['🐉', '🎆', '🎉', '✨', '🔥', '💎', '🎊', '⭐', '❤️', '🖤'];

function genParticles() {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: (((i * 37 + 13) % 100) + 100) % 100,
    emoji: EMOJIS[i % EMOJIS.length],
    rotation: (i * 137) % 720,
    delay: ((i * 17) % 150) / 100,
    duration: 3 + ((i * 23) % 20) / 10,
  }));
}

const PARTICLES = genParticles();

export default function KonamiCode() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handler = () => {
      setActive(true);
      try { sounds.fanfare(); } catch { /* */ }
      setTimeout(() => setActive(false), 5000);
    };
    document.addEventListener('dragonos-konami', handler);
    return () => document.removeEventListener('dragonos-konami', handler);
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden konami-out">
      {/* Confetti particles — CSS animation */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="konami-particle"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Secret message */}
      <div className="konami-message">
        <p className="text-5xl mb-4">🐉</p>
        <p className="text-2xl font-display text-[#dc2626] font-bold">You found the Dragon!</p>
        <p className="text-sm text-white/50 mt-2 font-inter">The ancient dragon smiles upon you.</p>
      </div>
    </div>
  );
}

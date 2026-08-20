// DragonOS Konami Code Easter Egg
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from './sounds';

interface Particle {
  id: number;
  x: number;
  emoji: string;
  rotation: number;
  delay: number;
}

export default function KonamiCode() {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handler = () => {
      setActive(true);
      // Generate confetti
      const emojis = ['🐉', '🎆', '🎉', '✨', '🔥', '💎', '🎊', '⭐', '❤️', '🖤'];
      const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 1.5,
      }));
      setParticles(newParticles);
      try { sounds.fanfare(); } catch {}
      setTimeout(() => setActive(false), 5000);
    };
    document.addEventListener('dragonos-konami', handler);
    return () => document.removeEventListener('dragonos-konami', handler);
  }, []);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden"
        exit={{ opacity: 0 }}
      >
        {/* Confetti */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ y: -50, opacity: 1, rotate: 0 }}
            animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotation + 720 }}
            transition={{ duration: 3 + Math.random() * 2, delay: p.delay, ease: 'easeIn' }}
            className="absolute text-2xl"
            style={{ left: `${p.x}%` }}
          >
            {p.emoji}
          </motion.div>
        ))}

        {/* Secret Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <p className="text-5xl mb-4">🐉</p>
          <p className="text-2xl font-display text-[#dc2626] font-bold">You found the Dragon!</p>
          <p className="text-sm text-white/50 mt-2 font-inter">The ancient dragon smiles upon you.</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

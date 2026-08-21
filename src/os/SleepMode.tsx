// DragonOS sleep mode — fades to a live clock; click or key to wake
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS, useDesktop } from './context';
import { sounds } from './sounds';

export default function SleepMode() {
  const { dispatch } = useOS();
  const desktop = useDesktop();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!desktop.sleeping) return;
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, [desktop.sleeping]);

  const wake = useCallback(() => {
    sounds.open();
    dispatch({ type: 'WAKE' });
  }, [dispatch]);

  if (!desktop.sleeping) return null;

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[9998] bg-[#050508] flex flex-col items-center justify-center cursor-pointer"
        onClick={wake}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-6xl md:text-8xl text-white/80 tracking-wider"
        >
          {h}:{m}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
          className="mt-6 text-xs text-white/30 font-inter tracking-widest uppercase"
        >
          saving your day...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 text-[10px] text-white/20 font-inter"
        >
          click anywhere to wake
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}

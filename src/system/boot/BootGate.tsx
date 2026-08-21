// DragonOS boot — macOS-style: black screen, glowing dragon mark, thin progress
// rail synced to a 2-second timer. Click still skips.
import { useEffect, useRef, useState, useCallback } from 'react';
import { useOS } from '@/state/os/providers';
import { sounds } from '@/lib/audio/cues';

const BOOT_DURATION = 2000; // ms

export default function BootSequence() {
  const { state, dispatch } = useOS();
  const [leaving, setLeaving] = useState(false);
  const bootedRef = useRef(false);

  useEffect(() => {
    if (state.desktop.booted) return;

    // Plain function — hooks must never be called inside effects
    const finish = () => {
      if (bootedRef.current) return;
      bootedRef.current = true;
      setLeaving(true);
      try { sounds.boot(); } catch { /* */ }
      // Hand off to the desktop mid-fade for a seamless transition
      setTimeout(() => dispatch({ type: 'BOOT' }), 280);
    };

    const t = setTimeout(finish, BOOT_DURATION);
    return () => clearTimeout(t);
  }, [state.desktop.booted, dispatch]);

  const skip = useCallback(() => {
    if (bootedRef.current) return;
    try { sounds.click(); } catch { /* */ }
    bootedRef.current = true;
    setLeaving(true);
    setTimeout(() => dispatch({ type: 'BOOT' }), 180);
  }, [dispatch]);

  if (state.desktop.booted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black cursor-pointer ${leaving ? 'boot-exit' : 'boot-enter'}`}
      onClick={skip}
      role="button"
      aria-label="Boot screen — click to skip"
    >
      {/* Dragon emblem — the authentic photo, masked into a glowing round mark */}
      <div className="boot-emblem" aria-hidden="true" />

      {/* Wordmark — Cinzel, letterspaced */}
      <h1 className="mt-7 font-display text-lg md:text-xl text-white/90 pl-[0.45em] boot-wordmark">
        DRAGON<span className="text-[#dc2626]">OS</span>
      </h1>

      {/* Progress rail — fills over exactly 2s, macOS-thin */}
      <div
        className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-40 md:w-52 h-[3px] bg-white/10 rounded-full overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-full rounded-full boot-progress bg-gradient-to-r from-[#7f1d1d] via-[#dc2626] to-[#ef4444]" />
      </div>

      <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] text-white/25 font-inter tracking-widest">
        Click anywhere to skip
      </p>
    </div>
  );
}

// DragonOS Boot Sequence — cinematic Apple-style intro
// Automatic 4-second boot timer (progress bar synced), click still skips.
// Layers: wallpaper photo Ken-Burns backdrop → glowing dragon logo →
// DRAGONOS wordmark → spinner arc → progress rail → auto-boot.
import { useEffect, useRef, useState, useCallback } from 'react';
import { useOS } from './context';
import { sounds } from './sounds';
import { DEFAULT_WALLPAPER } from './Wallpaper';

const BOOT_DURATION = 4000; // ms — auto-boot timer

export default function BootSequence() {
  const { state, dispatch } = useOS();
  const [showSpinner, setShowSpinner] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const bootedRef = useRef(false);

  useEffect(() => {
    if (state.desktop.booted) return;

    const finish = () => {
      if (bootedRef.current) return;
      bootedRef.current = true;
      setLeaving(true); // fade-out overlay first…
      try { sounds.boot(); } catch { /* */ }
      // …then mount the desktop mid-fade for a seamless hand-off
      setTimeout(() => dispatch({ type: 'BOOT' }), 350);
    };

    const t1 = setTimeout(() => setShowSpinner(true), 1200);
    const t2 = setTimeout(finish, BOOT_DURATION);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [state.desktop.booted, dispatch]);

  const skip = useCallback(() => {
    try { sounds.click(); } catch { /* */ }
    if (bootedRef.current) return;
    bootedRef.current = true;
    setLeaving(true);
    setTimeout(() => dispatch({ type: 'BOOT' }), 200);
  }, [dispatch]);

  if (state.desktop.booted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-[#050508] cursor-pointer ${leaving ? 'boot-exit' : 'boot-enter'}`}
      onClick={skip}
      role="button"
      aria-label="Boot screen — click to skip"
    >
      {/* Wallpaper photo backdrop — dimmed, slow Ken Burns zoom */}
      <div
        className="absolute inset-0 bg-no-repeat boot-backdrop"
        style={{
          backgroundImage: `url(${DEFAULT_WALLPAPER})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
      {/* Dark scrim so the logo pops */}
      <div className="absolute inset-0 bg-[#050508]/55" aria-hidden="true" />

      {/* Center stage */}
      <div className="relative h-full flex flex-col items-center justify-center">
        {/* Dragon Logo — CSS float + glow pulse only */}
        <div className="boot-dragon">
          <svg viewBox="0 0 200 260" className="w-40 h-52 md:w-52 md:h-68">
            <defs>
              <radialGradient id="dragonGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <ellipse cx="100" cy="100" rx="80" ry="100" fill="url(#dragonGlow)" className="boot-glow-pulse" />
            <g filter="url(#glow)" fill="#dc2626">
              <ellipse cx="100" cy="45" rx="22" ry="18" />
              <path d="M85 35 L78 15 L88 30Z" />
              <path d="M115 35 L122 15 L112 30Z" />
              <circle cx="92" cy="42" r="3" fill="#050508" />
              <circle cx="108" cy="42" r="3" fill="#050508" />
              <circle cx="93" cy="41" r="1" fill="#dc2626" />
              <circle cx="109" cy="41" r="1" fill="#dc2626" />
              <path d="M88 60 Q75 80 80 110 Q85 130 100 140 Q115 130 120 110 Q125 80 112 60Z" />
              <path d="M80 110 Q60 130 65 160 Q70 180 90 190 Q80 200 75 220 Q85 240 100 245 Q115 240 125 220 Q120 200 110 190 Q130 180 135 160 Q140 130 120 110" />
              <path d="M75 90 Q50 70 40 85 Q35 100 55 105 Q50 95 60 90 Q55 110 65 108Z" opacity="0.8" />
              <path d="M125 90 Q150 70 160 85 Q165 100 145 105 Q150 95 140 90 Q145 110 135 108Z" opacity="0.8" />
              <path d="M85 190 L75 200 M88 192 L80 202 M91 194 L85 203" stroke="#dc2626" strokeWidth="1.5" fill="none" />
              <path d="M115 190 L125 200 M112 192 L120 202 M109 194 L115 203" stroke="#dc2626" strokeWidth="1.5" fill="none" />
              <path d="M100 245 Q110 250 120 248 Q130 242 135 230 Q138 220 130 215" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
              <path d="M88 50 Q70 45 65 40" fill="none" stroke="#dc2626" strokeWidth="1" />
              <path d="M112 50 Q130 45 135 40" fill="none" stroke="#dc2626" strokeWidth="1" />
            </g>
          </svg>
        </div>

        {/* Wordmark — Cinzel, letterspaced, fades up after the dragon */}
        <h1 className="mt-6 font-display text-xl md:text-2xl tracking-[0.45em] text-white/90 boot-wordmark pl-[0.45em]">
          DRAGON<span className="text-[#dc2626]">OS</span>
        </h1>

        {/* Spinner arc — appears at 1.2s */}
        {showSpinner && (
          <div className="mt-10 boot-spinner" aria-hidden="true" />
        )}
      </div>

      {/* Progress rail — fills over exactly BOOT_DURATION */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden" aria-hidden="true">
        <div className="h-full bg-gradient-to-r from-[#7f1d1d] via-[#dc2626] to-[#ef4444] rounded-full boot-progress" />
      </div>

      {/* Skip hint */}
      <p className="absolute bottom-8 left-0 right-0 text-center text-[11px] text-white/35 font-inter tracking-widest animate-pulse">
        Click anywhere to skip
      </p>
    </div>
  );
}

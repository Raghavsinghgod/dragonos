// DragonOS Boot Sequence - Optimized Apple-style boot
// OPTIMIZED: Reduced animation overhead, direct timeout management,
// skipped heavy framer-motion where CSS suffices
import { useEffect, useState, useCallback } from 'react';
import { useOS } from './context';
import { sounds } from './sounds';

export default function BootSequence() {
  const { state, dispatch } = useOS();
  const [phase, setPhase] = useState<'logo' | 'spinner' | 'done'>('logo');
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (state.desktop.booted) return;
    const t1 = setTimeout(() => setPhase('spinner'), 2200);
    const t2 = setTimeout(() => setShowSkip(true), 1500);
    const t3 = setTimeout(() => {
      try { sounds.boot(); } catch { /* */ }
      dispatch({ type: 'BOOT' });
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [state.desktop.booted, dispatch]);

  const skip = useCallback(() => {
    try { sounds.click(); } catch { /* */ }
    dispatch({ type: 'BOOT' });
  }, [dispatch]);

  if (state.desktop.booted) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050508] cursor-pointer boot-fade-out"
      onClick={skip}
    >
      {/* Dragon Logo — CSS animation only */}
      {phase === 'logo' && (
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
      )}

      {/* Spinner — CSS only */}
      {phase === 'spinner' && (
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="boot-spinner" />
        </div>
      )}

      {/* Skip hint */}
      {showSkip && (
        <p className="absolute bottom-12 text-xs text-white/40 font-inter tracking-wider animate-pulse">
          Click anywhere to skip
        </p>
      )}
    </div>
  );
}

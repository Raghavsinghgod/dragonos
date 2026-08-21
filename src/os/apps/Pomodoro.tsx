// DragonOS Pomodoro App
import { useState, useEffect, useRef } from 'react';
import { sounds } from '../sounds';
import { usePersist } from '../persist';

export default function Pomodoro() {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = usePersist<number>('pomodoro-sessions', 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const WORK = 25 * 60;
  const BREAK = 5 * 60;

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          if (mode === 'work') {
            sounds.complete();
            setSessions(s => s + 1);
            setMode('break');
            return BREAK;
          } else {
            sounds.open();
            setMode('work');
            return WORK;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running, mode]);

  const start = () => { sounds.click(); setRunning(true); };
  const stop = () => { sounds.click(); setRunning(false); };
  const reset = () => { sounds.click(); setRunning(false); setSeconds(mode === 'work' ? WORK : BREAK); };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const maxSeconds = mode === 'work' ? WORK : BREAK;
  const progress = ((maxSeconds - seconds) / maxSeconds) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 font-inter gap-6">
      <p className="text-[10px] text-white/30 uppercase tracking-widest">{mode === 'work' ? '🎯 Focus Time' : '☕ Break Time'}</p>

      {/* Circular progress */}
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle cx="60" cy="60" r="54" fill="none" stroke={mode === 'work' ? '#dc2626' : '#22c55e'}
            strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-3xl text-white/90">{fmt(seconds)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={running ? stop : start}
          className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors ${
            running ? 'bg-red-500/20 text-red-400' : 'bg-[#dc2626] text-white'
          }`}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} className="px-4 py-2 rounded-xl text-sm bg-white/5 text-white/50">Reset</button>
      </div>

      <div className="text-center">
        <p className="text-xs text-white/40">Sessions completed</p>
        <p className="text-2xl text-white/80 font-mono mt-1">{sessions}</p>
      </div>
    </div>
  );
}

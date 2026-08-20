// DragonOS Clock App
import { useState, useEffect, useRef } from 'react';

type Tab = 'analog' | 'world' | 'stopwatch' | 'timer';

export default function Clock() {
  const [tab, setTab] = useState<Tab>('analog');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'analog', label: 'Analog' },
    { id: 'world', label: 'World' },
    { id: 'stopwatch', label: 'Stopwatch' },
    { id: 'timer', label: 'Timer' },
  ];

  return (
    <div className="flex flex-col h-full font-inter">
      <div className="flex border-b border-white/5">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 text-[10px] uppercase tracking-wider transition-colors ${tab === t.id ? 'text-[#dc2626] border-b border-[#dc2626]' : 'text-white/30 hover:text-white/50'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4">
        {tab === 'analog' && <AnalogClock time={time} />}
        {tab === 'world' && <WorldClocks />}
        {tab === 'stopwatch' && <Stopwatch />}
        {tab === 'timer' && <CountdownTimer />}
      </div>
    </div>
  );
}

function AnalogClock({ time }: { time: Date }) {
  const h = time.getHours() % 12;
  const m = time.getMinutes();
  const s = time.getSeconds();
  const hDeg = h * 30 + m * 0.5;
  const mDeg = m * 6;
  const sDeg = s * 6;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 200 200" className="w-44 h-44">
        <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x1 = 100 + 80 * Math.cos(angle);
          const y1 = 100 + 80 * Math.sin(angle);
          const x2 = 100 + 88 * Math.cos(angle);
          const y2 = 100 + 88 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />;
        })}
        {/* Hour hand */}
        <line x1="100" y1="100" x2={100 + 45 * Math.cos((hDeg - 90) * Math.PI / 180)}
          y2={100 + 45 * Math.sin((hDeg - 90) * Math.PI / 180)}
          stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        {/* Minute hand */}
        <line x1="100" y1="100" x2={100 + 65 * Math.cos((mDeg - 90) * Math.PI / 180)}
          y2={100 + 65 * Math.sin((mDeg - 90) * Math.PI / 180)}
          stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {/* Second hand */}
        <line x1="100" y1="100" x2={100 + 70 * Math.cos((sDeg - 90) * Math.PI / 180)}
          y2={100 + 70 * Math.sin((sDeg - 90) * Math.PI / 180)}
          stroke="#dc2626" strokeWidth="1" strokeLinecap="round" />
        <circle cx="100" cy="100" r="3" fill="#dc2626" />
      </svg>
      <p className="font-mono text-2xl text-white/80">
        {time.getHours().toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
      </p>
    </div>
  );
}

function WorldClocks() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const zones = [
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
  ];

  return (
    <div className="space-y-3">
      {zones.map(z => {
        const t = time.toLocaleTimeString('en-US', { timeZone: z.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return (
          <div key={z.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <span className="text-xs text-white/50">{z.name}</span>
            <span className="font-mono text-sm text-white/80">{t}</span>
          </div>
        );
      })}
    </div>
  );
}

function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  const tick = () => {
    setElapsed(Date.now() - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => { startRef.current = Date.now() - elapsed; setRunning(true); rafRef.current = requestAnimationFrame(tick); };
  const stop = () => { setRunning(false); cancelAnimationFrame(rafRef.current); };
  const reset = () => { setRunning(false); setElapsed(0); setLaps([]); cancelAnimationFrame(rafRef.current); };
  const lap = () => { setLaps([elapsed, ...laps]); };

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-mono text-4xl text-white/80">{fmt(elapsed)}</p>
      <div className="flex gap-2">
        <button onClick={running ? stop : start}
          className={`px-4 py-1.5 rounded-lg text-xs font-inter ${running ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={lap} disabled={!running}
          className="px-4 py-1.5 rounded-lg text-xs bg-white/5 text-white/50 font-inter disabled:opacity-30">Lap</button>
        <button onClick={reset} className="px-4 py-1.5 rounded-lg text-xs bg-white/5 text-white/50 font-inter">Reset</button>
      </div>
      {laps.length > 0 && (
        <div className="w-full max-h-[150px] overflow-y-auto space-y-1">
          {laps.map((l, i) => (
            <div key={i} className="flex justify-between text-xs text-white/40 font-mono px-2 py-1 bg-white/5 rounded">
              <span>Lap {laps.length - i}</span><span>{fmt(l)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CountdownTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [initial, setInitial] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const presets = [60, 180, 300, 600, 900, 1800];

  const start = () => {
    if (seconds <= 0) return;
    setInitial(seconds);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current!); setRunning(false); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const stop = () => { clearInterval(intervalRef.current!); setRunning(false); };
  const reset = () => { stop(); setSeconds(0); setInitial(0); };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = initial > 0 ? (seconds / initial) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-mono text-4xl text-white/80">{fmt(seconds)}</p>
      {initial > 0 && (
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#dc2626] rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="flex flex-wrap gap-2 justify-center">
        {presets.map(p => (
          <button key={p} onClick={() => { if (!running) setSeconds(p); }}
            className="px-3 py-1 rounded-lg text-[10px] bg-white/5 text-white/40 hover:text-white/60 font-mono">
            {fmt(p)}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={running ? stop : start} disabled={seconds <= 0 && !running}
          className={`px-4 py-1.5 rounded-lg text-xs font-inter ${running ? 'bg-red-500/20 text-red-400' : 'bg-[#dc2626]/20 text-[#dc2626]'}`}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} className="px-4 py-1.5 rounded-lg text-xs bg-white/5 text-white/50 font-inter">Reset</button>
      </div>
    </div>
  );
}

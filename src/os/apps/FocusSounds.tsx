// DragonOS Focus Sounds App
import { useState, useRef, useCallback, useEffect } from 'react';

type SoundType = 'rain' | 'brown' | 'fire' | 'wind';

interface SoundDef { id: SoundType; name: string; icon: string; }

const soundDefs: SoundDef[] = [
  { id: 'rain', name: 'Rain', icon: '🌧️' },
  { id: 'brown', name: 'Brown Noise', icon: '🟤' },
  { id: 'fire', name: 'Fireplace', icon: '🔥' },
  { id: 'wind', name: 'Wind', icon: '🌬️' },
];

export default function FocusSounds() {
  const [active, setActive] = useState<SoundType | null>(null);
  const [volume, setVolume] = useState(50);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  const stopAll = useCallback(() => {
    nodesRef.current.forEach(n => { try { n.disconnect(); } catch { /* already disconnected */ } });
    nodesRef.current = [];
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
  }, []);

  const playSound = useCallback((type: SoundType) => {
    stopAll();
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = volume / 100;
    gain.connect(ctx.destination);

    if (type === 'brown') {
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.02 * white) / 1.02;
        last = data[i];
        data[i] *= 3.5;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.connect(gain);
      src.start();
      nodesRef.current.push(src);
    } else if (type === 'rain') {
      for (let i = 0; i < 3; i++) {
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * (0.3 + Math.sin(j / (ctx.sampleRate * 0.5 + i * 0.3)) * 0.2);
        }
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000 + i * 500;
        filter.Q.value = 0.5;
        src.connect(filter).connect(gain);
        src.start();
        nodesRef.current.push(src);
      }
    } else if (type === 'fire') {
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const crackle = Math.random() > 0.997 ? (Math.random() * 0.5) : 0;
        data[i] = (Math.random() * 2 - 1) * 0.3 * (0.5 + Math.sin(i / 3000) * 0.5) + crackle;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      src.connect(filter).connect(gain);
      src.start();
      nodesRef.current.push(src);
    } else if (type === 'wind') {
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.01 * white) / 1.01;
        last = data[i];
        data[i] *= 5 * (0.5 + 0.5 * Math.sin(i / (ctx.sampleRate * 2)));
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 0.3;
      src.connect(filter).connect(gain);
      src.start();
      nodesRef.current.push(src);
    }

    setActive(type);
  }, [volume, stopAll]);

  useEffect(() => () => stopAll(), [stopAll]);

  const toggle = (type: SoundType) => {
    if (active === type) { stopAll(); setActive(null); }
    else playSound(type);
  };

  return (
    <div className="p-4 font-inter space-y-4">
      <p className="text-[10px] text-white/30 uppercase tracking-wider">Ambient Sounds</p>
      <div className="grid grid-cols-2 gap-2">
        {soundDefs.map(s => (
          <button key={s.id} onClick={() => toggle(s.id)}
            className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
              active === s.id ? 'bg-[#dc2626]/10 ring-1 ring-[#dc2626]/30' : 'bg-white/5 hover:bg-white/8'
            }`}>
            <span className="text-2xl">{s.icon}</span>
            <span className="text-xs text-white/60">{s.name}</span>
            {active === s.id && (
              <div className="flex gap-0.5">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-0.5 bg-[#dc2626] rounded-full animate-pulse"
                    style={{ height: 4 + Math.random() * 8, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 px-2">
        <span className="text-xs text-white/30">🔊</span>
        <input type="range" min={0} max={100} value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="flex-1 h-1 bg-white/10 rounded-full appearance-none accent-[#dc2626]" />
        <span className="text-[10px] text-white/30 w-6 text-right font-mono">{volume}</span>
      </div>
      <p className="text-[9px] text-white/20 text-center">Sounds generated via WebAudio API</p>
    </div>
  );
}

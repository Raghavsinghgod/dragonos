// DragonOS Typing Test App
import { useState, useEffect, useRef } from 'react';

const sentences = [
  "The quick brown fox jumps over the lazy dog",
  "Pack my box with five dozen liquor jugs",
  "How vexingly quick daft zebras jump",
  "The five boxing wizards jump quickly",
  "Sphinx of black quartz judge my vow",
];

export default function TypingTest() {
  const [text, setText] = useState(() => sentences[Math.floor(Math.random() * sentences.length)]);
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  useEffect(() => {
    if (running && input.length > 0) {
      const elapsed = (Date.now() - startRef.current) / 1000 / 60;
      const words = input.trim().split(/\s+/).length;
      setWpm(Math.round(words / elapsed));
      let correct = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] === text[i]) correct++;
      }
      setAccuracy(input.length > 0 ? Math.round((correct / input.length) * 100) : 100);
    }
  }, [input, running, text]);

  const start = () => {
    setText(sentences[Math.floor(Math.random() * sentences.length)]);
    setInput('');
    setTime(30);
    setWpm(0);
    setAccuracy(100);
    setFinished(false);
    setRunning(true);
    startRef.current = Date.now();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 font-inter gap-4">
      <div className="flex gap-4 text-sm">
        <div className="text-center">
          <p className="text-2xl text-white/80 font-mono">{wpm}</p>
          <p className="text-[9px] text-white/30">WPM</p>
        </div>
        <div className="text-center">
          <p className="text-2xl text-white/80 font-mono">{time}s</p>
          <p className="text-[9px] text-white/30">Time</p>
        </div>
        <div className="text-center">
          <p className="text-2xl text-white/80 font-mono">{accuracy}%</p>
          <p className="text-[9px] text-white/30">Accuracy</p>
        </div>
      </div>

      {/* Text display */}
      <div className="max-w-[400px] text-sm leading-relaxed font-mono">
        {text.split('').map((char, i) => {
          let color = 'text-white/30';
          if (i < input.length) {
            color = input[i] === char ? 'text-green-400' : 'text-red-400';
          } else if (i === input.length) {
            color = 'text-white border-b border-[#dc2626]';
          }
          return <span key={i} className={color}>{char}</span>;
        })}
      </div>

      <input
        value={input}
        onChange={e => { if (running) setInput(e.target.value); }}
        disabled={!running}
        placeholder={running ? 'Start typing...' : 'Press Start'}
        className="w-full max-w-[400px] text-sm bg-white/5 rounded-lg px-4 py-3 text-white/70 outline-none font-mono disabled:opacity-30"
        autoFocus
      />

      <button onClick={start}
        className="px-6 py-2 rounded-xl bg-[#dc2626] text-white text-sm hover:bg-[#dc2626]/80 transition-colors">
        {finished ? 'Try Again' : running ? 'Typing...' : 'Start'}
      </button>
    </div>
  );
}

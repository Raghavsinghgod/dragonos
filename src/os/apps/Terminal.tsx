// DragonOS Terminal App
import { useState, useRef, useEffect } from 'react';

interface Line {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { text: 'DragonOS Terminal v1.0', type: 'output' },
    { text: 'Type "help" for available commands.', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const [hacking, setHacking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const execute = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1).join(' ');

    const newLines: Line[] = [...lines, { text: `$ ${cmd}`, type: 'input' }];

    switch (command) {
      case 'help':
        newLines.push({ text: 'Commands: help, open <app>, clear, date, stats, hack, sudo win, theme <name>, echo <text>', type: 'output' });
        break;
      case 'clear':
        setLines([]);
        setInput('');
        return;
      case 'date':
        newLines.push({ text: new Date().toString(), type: 'output' });
        break;
      case 'stats':
        newLines.push({ text: `Apps: 28 | Uptime: ${Math.floor((Date.now() - performance.timeOrigin) / 1000)}s | Memory: ∞`, type: 'output' });
        break;
      case 'hack':
        setHacking(true);
        setLines([...newLines]);
        const hackLines: Line[] = [];
        const chars = '█▓▒░║═╬╣╠╩╦┼─│┌┐└┘├┤┬┴';
        let count = 0;
        const iv = setInterval(() => {
          let line = '';
          for (let i = 0; i < 50; i++) line += chars[Math.floor(Math.random() * chars.length)];
          hackLines.push({ text: line, type: 'output' });
          setLines([...newLines, ...hackLines.slice(-20)]);
          count++;
          if (count > 30) {
            clearInterval(iv);
            hackLines.push({ text: 'Access granted. You are the dragon. 🐉', type: 'success' });
            setLines([...newLines, ...hackLines]);
            setHacking(false);
          }
        }, 80);
        setInput('');
        return;
      case 'sudo':
        if (args === 'win') {
          newLines.push({ text: '🏆 You win! The dragon grants you ultimate power.', type: 'success' });
        } else {
          newLines.push({ text: `sudo: unknown command "${args}"`, type: 'error' });
        }
        break;
      case 'open':
        newLines.push({ text: `Opening ${args}...`, type: 'success' });
        document.dispatchEvent(new CustomEvent('dragonos-open-app-by-name', { detail: args }));
        break;
      case 'theme':
        newLines.push({ text: `Theme set to "${args || 'default'}"`, type: 'success' });
        break;
      case 'echo':
        newLines.push({ text: args, type: 'output' });
        break;
      case '':
        break;
      default:
        newLines.push({ text: `Command not found: ${command}. Type "help" for available commands.`, type: 'error' });
    }

    setLines(newLines);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#050508] font-mono text-xs"
      onClick={() => inputRef.current?.focus()}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap break-all ${
            line.type === 'input' ? 'text-[#dc2626]' :
            line.type === 'error' ? 'text-red-400' :
            line.type === 'success' ? 'text-green-400' :
            'text-white/60'
          }`}>{line.text}</div>
        ))}
        {hacking && <div className="text-[#dc2626] animate-pulse">▌</div>}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 border-t border-white/5">
        <span className="text-[#dc2626]">$</span>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && execute(input)}
          className="flex-1 bg-transparent text-white/70 outline-none" autoFocus />
      </div>
    </div>
  );
}

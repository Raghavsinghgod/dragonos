// DragonOS Calculator App
import { useState, useEffect, useCallback } from 'react';
import { sounds } from '../sounds';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const input = useCallback((val: string) => {
    sounds.click();
    if (fresh) { setDisplay(val); setFresh(false); }
    else setDisplay(d => d === '0' ? val : d + val);
  }, [fresh]);

  const operator = useCallback((nextOp: string) => {
    sounds.click();
    if (prev !== null && op && !fresh) {
      const result = calc(prev, parseFloat(display), op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(parseFloat(display));
    }
    setOp(nextOp);
    setFresh(true);
  }, [prev, op, display, fresh]);

  const equals = useCallback(() => {
    if (prev === null || !op) return;
    sounds.complete();
    const result = calc(prev, parseFloat(display), op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setFresh(true);
  }, [prev, op, display]);

  const clear = () => { sounds.click(); setDisplay('0'); setPrev(null); setOp(null); setFresh(true); };
  const percent = () => { sounds.click(); setDisplay(String(parseFloat(display) / 100)); };
  const sign = () => { sounds.click(); setDisplay(String(-parseFloat(display))); };
  const dot = () => { sounds.click(); if (!display.includes('.')) setDisplay(d => d + '.'); setFresh(false); };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') input(e.key);
      else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') operator(e.key);
      else if (e.key === 'Enter' || e.key === '=') equals();
      else if (e.key === 'Escape') clear();
      else if (e.key === '.') dot();
      else if (e.key === '%') percent();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [input, operator, equals]);

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const mapOp = (b: string) => {
    switch (b) {
      case '÷': return '/';
      case '×': return '*';
      case '−': return '-';
      case '+': return '+';
      default: return b;
    }
  };

  return (
    <div className="flex flex-col h-full p-3 font-inter">
      {/* Display */}
      <div className="text-right px-2 py-3 mb-2">
        <p className="font-mono text-3xl text-white/90 truncate">{display}</p>
      </div>

      {/* Buttons */}
      <div className="flex-1 grid gap-1.5" style={{ gridTemplateRows: `repeat(${buttons.length}, 1fr)` }}>
        {buttons.map((row, ri) => (
          <div key={ri} className="grid gap-1.5" style={{ gridTemplateColumns: row.map(b => b === '0' ? '2fr' : '1fr').join(' ') }}>
            {row.map(b => {
              const isOp = ['÷', '×', '−', '+', '='].includes(b);
              const isFunc = ['C', '±', '%'].includes(b);
              return (
                <button key={b} onClick={() => {
                  if (b === 'C') clear();
                  else if (b === '±') sign();
                  else if (b === '%') percent();
                  else if (b === '.') dot();
                  else if (b === '=') equals();
                  else if (isOp) operator(mapOp(b));
                  else input(b);
                }}
                  className={`rounded-xl text-sm font-medium transition-all active:scale-95 ${
                    isOp ? 'bg-[#dc2626]/30 text-[#dc2626] hover:bg-[#dc2626]/40' :
                    isFunc ? 'bg-white/10 text-white/70 hover:bg-white/15' :
                    'bg-white/5 text-white/80 hover:bg-white/10'
                  }`}>
                  {b}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function calc(a: number, b: number, op: string): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 0;
    default: return b;
  }
}

// DragonOS Doodle App
import { useRef, useState } from 'react';

const colors = ['#dc2626', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ffffff', '#6b7280'];
const sizes = [2, 4, 8, 12, 20];

export default function Doodle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#dc2626');
  const [size, setSize] = useState(4);
  const [drawing, setDrawing] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const getPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent) => {
    setDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => setDrawing(false);

  const clear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
  };

  const saveImg = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'doodle.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full font-inter">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-white/5">
        <div className="flex gap-1">
          {colors.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ background: c }} />
          ))}
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex gap-1">
          {sizes.map(s => (
            <button key={s} onClick={() => setSize(s)}
              className={`w-6 h-6 rounded flex items-center justify-center ${size === s ? 'bg-white/10' : ''}`}>
              <div className="rounded-full bg-white" style={{ width: s, height: s }} />
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          <button onClick={clear} className="text-[10px] text-white/30 hover:text-white/50 px-2 py-1 rounded bg-white/5">Clear</button>
          <button onClick={saveImg} className="text-[10px] text-[#dc2626] hover:text-[#dc2626]/80 px-2 py-1 rounded bg-[#dc2626]/10">Save</button>
        </div>
      </div>
      {/* Canvas */}
      <div className="flex-1 bg-[#0a0a0f]">
        <canvas ref={canvasRef} width={600} height={400}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} />
      </div>
    </div>
  );
}

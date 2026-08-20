// DragonOS Window Manager - Floating windows with drag, resize, snap, z-stacking
import { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from '../context';
import { sounds } from '../sounds';
import type { WindowState } from '../types';

function WindowFrame({ win }: { win: WindowState }) {
  const { state, dispatch, closeApp } = useOS();
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, wx: 0, wy: 0 });

  // 8-direction resize
  const resizeRef = useRef<HTMLDivElement>(null);
  const resizeDir = useRef('');
  const resizeStart = useRef({ x: 0, y: 0, wx: 0, wy: 0, ww: 0, wh: 0 });

  const onDragStart = (e: React.MouseEvent) => {
    if (win.maximized) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, wx: win.x, wy: win.y };
    dispatch({ type: 'FOCUS_WINDOW', windowId: win.id });
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      let nx = dragStart.current.wx + dx;
      let ny = dragStart.current.wy + dy;
      // Edge snapping
      if (nx <= 0) { /* left snap - show preview */ }
      if (nx + win.width >= window.innerWidth - 2) { /* right snap */ }
      if (ny <= 0) { ny = 0; /* top = maximize on drop */ }
      dispatch({ type: 'MOVE_WINDOW', windowId: win.id, x: nx, y: Math.max(0, ny) });
    };
    const onUp = (e: MouseEvent) => {
      setIsDragging(false);
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      // Snap logic
      if (e.clientX <= 2) {
        dispatch({ type: 'MOVE_WINDOW', windowId: win.id, x: 0, y: 0 });
        dispatch({ type: 'RESIZE_WINDOW', windowId: win.id, width: window.innerWidth / 2, height: window.innerHeight - 80 });
        sounds.snap();
      } else if (e.clientX >= window.innerWidth - 2) {
        dispatch({ type: 'MOVE_WINDOW', windowId: win.id, x: window.innerWidth / 2, y: 0 });
        dispatch({ type: 'RESIZE_WINDOW', windowId: win.id, width: window.innerWidth / 2, height: window.innerHeight - 80 });
        sounds.snap();
      } else if (e.clientY <= 2) {
        dispatch({ type: 'MAXIMIZE_WINDOW', windowId: win.id });
        sounds.snap();
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging, win, dispatch]);

  const onResizeStart = (e: React.MouseEvent, dir: string) => {
    if (win.maximized) return;
    e.preventDefault();
    e.stopPropagation();
    resizeDir.current = dir;
    resizeStart.current = { x: e.clientX, y: e.clientY, wx: win.x, wy: win.y, ww: win.width, wh: win.height };
    dispatch({ type: 'FOCUS_WINDOW', windowId: win.id });
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      let { wx, wy, ww, wh } = resizeStart.current;
      const d = resizeDir.current;
      let nw = ww, nh = wh, nx = wx, ny = wy;
      if (d.includes('e')) nw = Math.max(win.minWidth, ww + dx);
      if (d.includes('w')) { nw = Math.max(win.minWidth, ww - dx); nx = wx + ww - nw; }
      if (d.includes('s')) nh = Math.max(win.minHeight, wh + dy);
      if (d.includes('n')) { nh = Math.max(win.minHeight, wh - dy); ny = wy + wh - nh; }
      dispatch({ type: 'RESIZE_WINDOW', windowId: win.id, width: nw, height: nh, x: nx, y: ny });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleClose = () => {
    sounds.close();
    closeApp(win.id);
  };

  const handleMinimize = () => {
    sounds.minimize();
    dispatch({ type: 'MINIMIZE_WINDOW', windowId: win.id });
  };

  const handleMaximize = () => {
    sounds.snap();
    dispatch({ type: 'MAXIMIZE_WINDOW', windowId: win.id });
  };

  const handleTitleDoubleClick = () => {
    handleMaximize();
  };

  // Get app component from registry
  const appComponent = appComponents[win.appId];

  const resizeCursors: Record<string, string> = {
    n: 'cursor-n-resize', s: 'cursor-s-resize', e: 'cursor-e-resize', w: 'cursor-w-resize',
    ne: 'cursor-ne-resize', nw: 'cursor-nw-resize', se: 'cursor-se-resize', sw: 'cursor-sw-resize',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(12px)' }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        x: win.maximized ? 0 : win.x,
        y: win.maximized ? 0 : win.y,
        width: win.maximized ? '100vw' : win.width,
        height: win.maximized ? 'calc(100vh - 80px)' : win.height,
      }}
      exit={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        filter: { duration: 0.3 },
      }}
      className="absolute flex flex-col rounded-xl overflow-hidden shadow-2xl"
      style={{
        zIndex: win.zIndex,
        top: win.maximized ? 0 : undefined,
        left: win.maximized ? 0 : undefined,
        background: 'rgba(12,12,18,0.88)',
        backdropFilter: 'blur(40px) saturate(1.5)',
        border: state.desktop.wallpaperTheme === 'dragon' ? '1px solid rgba(220,38,38,0.15)' : '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseDown={() => dispatch({ type: 'FOCUS_WINDOW', windowId: win.id })}
    >
      {/* Titlebar */}
      <div
        ref={dragRef}
        onMouseDown={onDragStart}
        onDoubleClick={handleTitleDoubleClick}
        className="flex items-center h-10 px-3 shrink-0 select-none"
        style={{ cursor: win.maximized ? 'default' : 'grab' }}
      >
        {/* Traffic lights */}
        <div className="flex gap-2 mr-3">
          <button onClick={handleClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors" />
          <button onClick={handleMinimize} className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-colors" />
          <button onClick={handleMaximize} className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors" />
        </div>
        <span className="text-xs text-white/50 font-inter truncate">{win.title}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {appComponent && <appComponent windowId={win.id} />}
      </div>

      {/* Resize handles (8 directions) */}
      {(['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const).map(dir => (
        <div
          key={dir}
          onMouseDown={(e) => onResizeStart(e, dir)}
          className={`absolute ${resizeCursors[dir]}`}
          style={{
            ...(dir.includes('n') ? { top: -3, height: 6 } : {}),
            ...(dir.includes('s') ? { bottom: -3, height: 6 } : {}),
            ...(dir.includes('e') ? { right: -3, width: 6 } : {}),
            ...(dir.includes('w') ? { left: -3, width: 6 } : {}),
            ...(!dir.includes('n') && !dir.includes('s') ? { top: 6, bottom: 6 } : {}),
            ...(!dir.includes('e') && !dir.includes('w') ? { left: 6, right: 6 } : {}),
          }}
        />
      ))}
    </motion.div>
  );
}

// Global app component registry
let appComponents: Record<string, React.ComponentType<{ windowId: string }>> = {};

export function setAppComponents(components: Record<string, React.ComponentType<{ windowId: string }>>) {
  appComponents = components;
}

export default function WindowManager() {
  const { state } = useOS();
  const openWindows = Object.values(state.windows).filter(w => w.isOpen);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      <AnimatePresence>
        {openWindows.map(win => (
          <div key={win.id} className="pointer-events-auto">
            {win.animState !== 'closing' ? (
              <WindowFrame win={win} />
            ) : (
              <WindowCloseFrame win={win} />
            )}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function WindowCloseFrame({ win }: { win: WindowState }) {
  const { closeApp } = useOS();
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      animate={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
      transition={{ duration: 0.25 }}
      onAnimationComplete={() => {
        // Remove from state
      }}
      className="absolute flex flex-col rounded-xl overflow-hidden"
      style={{
        zIndex: win.zIndex,
        top: win.y,
        left: win.x,
        width: win.width,
        height: win.height,
        background: 'rgba(12,12,18,0.88)',
        backdropFilter: 'blur(40px)',
      }}
    />
  );
}

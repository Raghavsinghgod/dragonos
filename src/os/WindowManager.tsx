// DragonOS window manager — draggable, resizable windows with edge snapping
import { useCallback, useRef, useState, useEffect, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOS, useWindows } from './context';
import { sounds } from './sounds';
import type { WindowState } from './types';

// ─── App Component Registry (stable reference) ────────────
let appComponents: Record<string, React.ComponentType<{ windowId: string }>> = {};

export function setAppComponents(components: Record<string, React.ComponentType<{ windowId: string }>>) {
  appComponents = components;
}

// ─── RAF throttle helper ──────────────────────────────────
function useRafThrottle() {
  const rafId = useRef(0);
  const useCallback2 = useCallback;

  return useCallback2((fn: () => void) => {
    if (rafId.current) return; // Already scheduled
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0;
      fn();
    });
  }, []);
}

// ─── WindowFrame — Memoized, RAF-throttled drag/resize ────
const WindowFrame = memo(function WindowFrame({ win }: { win: WindowState }) {
  const { dispatch, closeApp } = useOS();
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, wx: 0, wy: 0 });
  const rafThrottle = useRafThrottle();

  // Resize state
  const resizeRef = useRef('');
  const resizeStart = useRef({ x: 0, y: 0, wx: 0, wy: 0, ww: 0, wh: 0 });

  // ─── Drag handlers ───
  const onDragStart = useCallback((e: React.MouseEvent) => {
    if (win.maximized) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, wx: win.x, wy: win.y };
    dispatch({ type: 'FOCUS_WINDOW', windowId: win.id });
  }, [win.maximized, win.x, win.y, win.id, dispatch]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      rafThrottle(() => {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const nx = dragStart.current.wx + dx;
        let ny = dragStart.current.wy + dy;
        if (ny <= 0) ny = 0;
        dispatch({ type: 'MOVE_WINDOW', windowId: win.id, x: nx, y: Math.max(0, ny) });
      });
    };
    const onUp = (e: MouseEvent) => {
      setIsDragging(false);
      // Edge snap on release
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
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, win.id, dispatch, rafThrottle]);

  // ─── Resize handlers ───
  const onResizeStart = useCallback((e: React.MouseEvent, dir: string) => {
    if (win.maximized) return;
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = dir;
    resizeStart.current = { x: e.clientX, y: e.clientY, wx: win.x, wy: win.y, ww: win.width, wh: win.height };
    dispatch({ type: 'FOCUS_WINDOW', windowId: win.id });

    const onMove = (e: MouseEvent) => {
      rafThrottle(() => {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        const { wx, wy, ww, wh } = resizeStart.current;
        const d = resizeRef.current;
        let nw = ww, nh = wh, nx = wx, ny = wy;
        if (d.includes('e')) nw = Math.max(win.minWidth, ww + dx);
        if (d.includes('w')) { nw = Math.max(win.minWidth, ww - dx); nx = wx + ww - nw; }
        if (d.includes('s')) nh = Math.max(win.minHeight, wh + dy);
        if (d.includes('n')) { nh = Math.max(win.minHeight, wh - dy); ny = wy + wh - nh; }
        dispatch({ type: 'RESIZE_WINDOW', windowId: win.id, width: nw, height: nh, x: nx, y: ny });
      });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [win, dispatch, rafThrottle]);

  // ─── Action handlers — stable via useCallback ───
  const handleClose = useCallback(() => { sounds.close(); closeApp(win.id); }, [closeApp, win.id]);
  const handleMinimize = useCallback(() => { sounds.minimize(); dispatch({ type: 'MINIMIZE_WINDOW', windowId: win.id }); }, [dispatch, win.id]);
  const handleMaximize = useCallback(() => { sounds.snap(); dispatch({ type: 'MAXIMIZE_WINDOW', windowId: win.id }); }, [dispatch, win.id]);
  const handleTitleDoubleClick = useCallback(() => { handleMaximize(); }, [handleMaximize]);
  const handleFocus = useCallback(() => { dispatch({ type: 'FOCUS_WINDOW', windowId: win.id }); }, [dispatch, win.id]);

  const AppComponent = appComponents[win.appId];

  const resizeCursors: Record<string, string> = {
    n: 'cursor-n-resize', s: 'cursor-s-resize', e: 'cursor-e-resize', w: 'cursor-w-resize',
    ne: 'cursor-ne-resize', nw: 'cursor-nw-resize', se: 'cursor-se-resize', sw: 'cursor-sw-resize',
  };

  const isClosing = win.animState === 'closing';

  return (
    <motion.div
      /* Open: expands up from near the dock with a blur-to-sharp spring.
         Close: the whole window — content included — shrinks back into the blur. */
      initial={{ opacity: 0, scale: 0.82, filter: 'blur(18px)' }}
      animate={
        isClosing
          ? { opacity: 0, scale: 0.78, filter: 'blur(16px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={
        isClosing
          ? { duration: 0.28, ease: [0.4, 0, 1, 1] }
          : { type: 'spring', stiffness: 340, damping: 24, filter: { duration: 0.35 } }
      }
      className="win-glass absolute flex flex-col rounded-xl overflow-hidden pointer-events-auto"
      style={{
        zIndex: win.zIndex,
        top: win.maximized ? 0 : win.y,
        left: win.maximized ? 0 : win.x,
        width: win.maximized ? '100vw' : win.width,
        height: win.maximized ? 'calc(100vh - 80px)' : win.height,
        transformOrigin: '50% 85%',
      }}
      onMouseDown={handleFocus}
    >
      {/* Titlebar */}
      <div
        onMouseDown={onDragStart}
        onDoubleClick={handleTitleDoubleClick}
        className="flex items-center h-10 px-3 shrink-0 select-none"
        style={{ cursor: win.maximized ? 'default' : 'grab' }}
      >
        <div className="flex gap-2 mr-3">
          <button onClick={handleClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors" />
          <button onClick={handleMinimize} className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-colors" />
          <button onClick={handleMaximize} className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors" />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {win.icon && <span className="text-white/50 flex-shrink-0 [&_svg]:w-3.5 [&_svg]:h-3.5">{win.icon}</span>}
          <span className="text-xs text-white/50 font-inter truncate">{win.title}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {AppComponent && <AppComponent windowId={win.id} />}
      </div>

      {/* 8-direction resize handles */}
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
});

// ─── Main WindowManager — only re-renders on windows change ──
export default function WindowManager() {
  const windows = useWindows();

  // Open windows (closing ones stay until their exit animation finishes)
  const openWindows = useMemo(
    () => Object.values(windows).filter(w => w.isOpen),
    [windows]
  );

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {openWindows.map(win => (
        <WindowFrame key={win.id} win={win} />
      ))}
    </div>
  );
}

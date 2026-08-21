// DragonOS dock — Apple-style magnification bar with running-app indicators
import { memo, useMemo, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { useOS, useWindows } from './context';
import { sounds } from './sounds';
import { appIcons } from './icons';
import type { ReactNode } from 'react';

interface DockItem {
  id: string;
  name: string;
  icon: ReactNode;
  order: number;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: appIcons.dashboard, order: 0 },
  { id: 'notepad', name: 'Notepad', icon: appIcons.notepad, order: 1 },
  { id: 'calendar', name: 'Calendar', icon: appIcons.calendar, order: 2 },
  { id: 'todo', name: 'Todo', icon: appIcons.todo, order: 3 },
  { id: 'terminal', name: 'Terminal', icon: appIcons.terminal, order: 4 },
  { id: 'calculator', name: 'Calculator', icon: appIcons.calculator, order: 5 },
  { id: 'clock', name: 'Clock', icon: appIcons.clock, order: 6 },
  { id: 'settings', name: 'Settings', icon: appIcons.settings, order: 7 },
];

const SORTED_ITEMS = [...DOCK_ITEMS].sort((a, b) => a.order - b.order);

// Individual dock button — memoized
const DockButton = memo(function DockButton({
  item,
  isRunning,
  scale,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onOpen,
}: {
  item: DockItem;
  isRunning: boolean;
  scale: number;
  isHovered: boolean;
  onMouseEnter: (e: React.MouseEvent, index: number) => void;
  onMouseLeave: () => void;
  onOpen: (id: string) => void;
}) {
  const idx = SORTED_ITEMS.indexOf(item);

  return (
    <div
      className="dock-item"
      onMouseEnter={(e) => onMouseEnter(e, idx)}
      onMouseLeave={onMouseLeave}
    >
      <button
        onMouseUp={() => { sounds.click(); onOpen(item.id); }}
        className="dock-btn"
        style={{
          transform: `scale(${scale}) translateY(${isHovered ? -8 : 0}px)`,
          filter: isHovered ? 'drop-shadow(0 0 8px rgba(220,38,38,0.5))' : 'none',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s',
        }}
      >
        <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-[#dc2626]">
          {item.icon}
        </span>
        {isRunning && (
          <div className="dock-indicator" />
        )}
      </button>
    </div>
  );
});

export default function Dock({ onOpenLauncher }: { onOpenLauncher?: () => void }) {
  const openApp = useOS().openApp;
  const windows = useWindows();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number } | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  // Memoized running apps set — only recalculates when windows change
  const runningApps = useMemo(() => {
    const set = new Set<string>();
    for (const w of Object.values(windows)) {
      if (w.isOpen && !w.minimized) set.add(w.appId);
    }
    return set;
  }, [windows]);

  // Stable callbacks
  const handleMouseMove = useCallback((e: React.MouseEvent, index: number) => {
    setHoveredIndex(index);
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setTooltip({ name: SORTED_ITEMS[index].name, x: e.clientX - rect.left });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setTooltip(null);
  }, []);

  const handleOpen = useCallback((id: string) => {
    openApp(id);
  }, [openApp]);

  // Scale calculation — pure function, no state
  const getScale = useCallback((index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.35;
    if (distance === 1) return 1.2;
    if (distance === 2) return 1.08;
    return 1;
  }, [hoveredIndex]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50"
    >
      <div
        ref={dockRef}
        className="dock-bar"
      >
        {SORTED_ITEMS.map((item) => (
          <DockButton
            key={item.id}
            item={item}
            isRunning={runningApps.has(item.id)}
            scale={getScale(SORTED_ITEMS.indexOf(item))}
            isHovered={hoveredIndex === SORTED_ITEMS.indexOf(item)}
            onMouseEnter={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onOpen={handleOpen}
          />
        ))}

        {/* Launcher — separator + grid button, macOS Launchpad style */}
        <div className="mx-1 h-9 w-px self-center bg-white/15" aria-hidden="true" />
        <button
          onMouseUp={() => { sounds.click(); onOpenLauncher?.(); }}
          className="dock-btn group"
          title="Launchpad"
          aria-label="Open Launchpad"
        >
          <LayoutGrid className="w-7 h-7 md:w-8 md:h-8 text-white/70 transition-all duration-200 group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(220,38,38,0.5)]" />
        </button>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="dock-tooltip"
              style={{ left: tooltip.x, transform: 'translateX(-50%)' }}
            >
              {tooltip.name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

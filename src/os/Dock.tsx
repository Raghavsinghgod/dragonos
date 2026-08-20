// DragonOS Dock - Apple-style with magnification, running indicators, tooltips
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from '../context';
import { sounds } from '../sounds';

interface DockItem {
  id: string;
  name: string;
  icon: string;
  order: number;
}

const dockItems: DockItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊', order: 0 },
  { id: 'notepad', name: 'Notepad', icon: '📝', order: 1 },
  { id: 'calendar', name: 'Calendar', icon: '📅', order: 2 },
  { id: 'todo', name: 'Todo', icon: '✅', order: 3 },
  { id: 'terminal', name: 'Terminal', icon: '💻', order: 4 },
  { id: 'calculator', name: 'Calculator', icon: '🔢', order: 5 },
  { id: 'clock', name: 'Clock', icon: '🕐', order: 6 },
  { id: 'settings', name: 'Settings', icon: '⚙️', order: 7 },
];

export default function Dock() {
  const { state, openApp, dispatch } = useOS();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number } | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent, index: number) => {
    setHoveredIndex(index);
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setTooltip({ name: dockItems[index].name, x: e.clientX - rect.left });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setTooltip(null);
  }, []);

  const getScale = useCallback((index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.35;
    if (distance === 1) return 1.2;
    if (distance === 2) return 1.08;
    return 1;
  }, [hoveredIndex]);

  const runningApps = Object.values(state.windows)
    .filter(w => w.isOpen && !w.minimized)
    .map(w => w.appId);

  // Sort by dock order
  const sortedItems = [...dockItems].sort((a, b) => a.order - b.order);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50"
    >
      <div
        ref={dockRef}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-end gap-1 px-3 pb-2 pt-1.5 rounded-2xl"
        style={{
          background: 'rgba(12,12,18,0.6)',
          backdropFilter: 'blur(48px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {sortedItems.map((item, index) => {
          const isRunning = runningApps.includes(item.id);
          const scale = getScale(index);
          const isHovered = hoveredIndex === index;

          return (
            <motion.button
              key={item.id}
              onMouseEnter={(e) => handleMouseMove(e, index)}
              onMouseUp={() => {
                sounds.click();
                openApp(item.id);
              }}
              animate={{
                scale,
                y: isHovered ? -8 : 0,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative flex flex-col items-center group"
            >
              <motion.span
                className="text-2xl md:text-3xl leading-none select-none"
                animate={{
                  filter: isHovered ? 'drop-shadow(0 0 8px rgba(220,38,38,0.5))' : 'none',
                }}
              >
                {item.icon}
              </motion.span>
              {/* Running indicator dot */}
              {isRunning && (
                <motion.div
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#dc2626]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    boxShadow: '0 0 6px rgba(220,38,38,0.8)',
                  }}
                />
              )}
            </motion.button>
          );
        })}

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-8 px-2 py-0.5 rounded text-[10px] text-white/80 font-inter whitespace-nowrap"
              style={{
                left: tooltip.x,
                transform: 'translateX(-50%)',
                background: 'rgba(12,12,18,0.9)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {tooltip.name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import { memo, useMemo, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { useOS, useWindows } from "@/core/store";
import { sounds } from "@/core/audio";
import { appIcons } from "@/ui/icons";
import type { ReactNode } from "react";

interface dockitem {
  id: string;
  name: string;
  icon: ReactNode;
}

const dockitems: dockitem[] = [
  { id: "dashboard", name: "Dashboard", icon: appIcons.dashboard },
  { id: "notepad", name: "Notepad", icon: appIcons.notepad },
  { id: "calendar", name: "Calendar", icon: appIcons.calendar },
  { id: "todo", name: "Todo", icon: appIcons.todo },
  { id: "terminal", name: "Terminal", icon: appIcons.terminal },
  { id: "calculator", name: "Calculator", icon: appIcons.calculator },
  { id: "clock", name: "Clock", icon: appIcons.clock },
  { id: "settings", name: "Settings", icon: appIcons.settings },
];

const curve = [1.35, 1.2, 1.08];

const DockButton = memo(function DockButton({
  item,
  index,
  scale,
  hovered,
  running,
  onhover,
  onleave,
  onopen,
}: {
  item: dockitem;
  index: number;
  scale: number;
  hovered: boolean;
  running: boolean;
  onhover: (e: React.MouseEvent, index: number) => void;
  onleave: () => void;
  onopen: (id: string) => void;
}) {
  return (
    <div
      className="dock-item"
      onMouseEnter={(e) => onhover(e, index)}
      onMouseLeave={onleave}
    >
      <button
        onMouseUp={() => {
          sounds.click();
          onopen(item.id);
        }}
        className="dock-btn"
        style={{
          transform: `scale(${scale}) translateY(${hovered ? -8 : 0}px)`,
          filter: hovered ? "drop-shadow(0 0 8px rgba(220,38,38,0.5))" : "none",
          transition:
            "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s",
        }}
      >
        <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-[#dc2626]">
          {item.icon}
        </span>
        {running && <div className="dock-indicator" />}
      </button>
    </div>
  );
});

export default function Dock({
  onOpenLauncher,
}: {
  onOpenLauncher?: () => void;
}) {
  const { openApp } = useOS();
  const windows = useWindows();
  const [hoveredindex, sethoveredindex] = useState<number | null>(null);
  const [tooltip, settooltip] = useState<{ name: string; x: number } | null>(
    null,
  );
  const dockref = useRef<HTMLDivElement>(null);

  const runningapps = useMemo(() => {
    const ids = new Set<string>();
    for (const w of Object.values(windows)) {
      if (w.isOpen && !w.minimized) ids.add(w.appId);
    }
    return ids;
  }, [windows]);

  const trackhover = useCallback((e: React.MouseEvent, index: number) => {
    sethoveredindex(index);
    if (dockref.current) {
      const rect = dockref.current.getBoundingClientRect();
      settooltip({ name: dockitems[index].name, x: e.clientX - rect.left });
    }
  }, []);

  const clearhover = useCallback(() => {
    sethoveredindex(null);
    settooltip(null);
  }, []);

  const launch = useCallback((id: string) => openApp(id), [openApp]);

  const magnify = (index: number) => {
    if (hoveredindex === null) return 1;
    return curve[Math.abs(index - hoveredindex)] ?? 1;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50"
    >
      <div ref={dockref} className="dock-bar lgglass">
        {dockitems.map((item, index) => (
          <DockButton
            key={item.id}
            item={item}
            index={index}
            scale={magnify(index)}
            hovered={hoveredindex === index}
            running={runningapps.has(item.id)}
            onhover={trackhover}
            onleave={clearhover}
            onopen={launch}
          />
        ))}

        <div
          className="mx-1 h-9 w-px self-center bg-white/15"
          aria-hidden="true"
        />
        <button
          onMouseUp={() => {
            sounds.click();
            onOpenLauncher?.();
          }}
          className="dock-btn group"
          title="Launchpad"
          aria-label="Open Launchpad"
        >
          <LayoutGrid className="w-7 h-7 md:w-8 md:h-8 text-white/70 transition-all duration-200 group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(220,38,38,0.5)]" />
        </button>

        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="dock-tooltip"
              style={{ left: tooltip.x, transform: "translateX(-50%)" }}
            >
              {tooltip.name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

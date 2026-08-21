// DragonOS desktop — root orchestrator that assembles the shell
import { useState, useEffect, useCallback } from 'react';
import { useOS, useDesktop } from './context';
import { initApps } from './apps';
import BootSequence from './BootSequence';
import Wallpaper from './Wallpaper';
import WindowManager from './WindowManager';
import Dock from './Dock';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import CommandPalette from './CommandPalette';
import Drawer from './Drawer';
import DesktopIcons from './DesktopIcons';
import SleepMode from './SleepMode';
import Toasts from './Toasts';
import KonamiCode from './Konami';
import Widgets from './Widgets';

const BOOTED_APPS = [
  'dashboard', 'notepad', 'todo', 'calendar', 'terminal', 'calculator', 'clock',
  'goals', 'habits', 'kanban', 'pomodoro', 'settings', 'journal', 'expenses',
  'mood', 'vault', 'doodle', 'flashcards', 'typingtest', 'achievements',
  'systemmonitor', 'focussounds', 'browser', 'translator', 'weather',
  'clipboard', 'quicknotes', 'markdown',
];

export default function Desktop() {
  const { openApp } = useOS();
  const desktop = useDesktop();
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  useEffect(() => { initApps(); }, []);

  // Listen for Alt+1-9 — stable handler
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const idx = detail - 1;
      if (idx >= 0 && idx < 9) openApp(BOOTED_APPS[idx]);
    };
    document.addEventListener('dragonos-open-app-by-index', handler);
    return () => document.removeEventListener('dragonos-open-app-by-index', handler);
  }, [openApp]);

  // Listen for open-by-name from terminal — stable handler
  useEffect(() => {
    const handler = (e: Event) => {
      const name = ((e as CustomEvent).detail as string).toLowerCase();
      const match = BOOTED_APPS.find(id => id.includes(name));
      if (match) openApp(match);
    };
    document.addEventListener('dragonos-open-app-by-name', handler);
    return () => document.removeEventListener('dragonos-open-app-by-name', handler);
  }, [openApp]);

  const closeStartMenu = useCallback(() => setStartMenuOpen(false), []);
  const openSettings = useCallback(() => openApp('settings'), [openApp]);
  const openLaunchpad = useCallback(() => setStartMenuOpen(true), []);

  // Memoize not-booted state for boot sequence
  const showBoot = !desktop.booted;
  const showDesktop = desktop.booted;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#050508]">
      {/* Boot Sequence */}
      {showBoot && <BootSequence />}

      {/* Wallpaper — always renders, uses RAF parallax (zero state updates) */}
      {showDesktop && <Wallpaper />}

      {/* Desktop Icons */}
      {showDesktop && <DesktopIcons />}

      {/* Windows */}
      {showDesktop && <WindowManager />}

      {/* Dock */}
      {showDesktop && <Dock onOpenLauncher={openLaunchpad} />}

      {/* Start Menu */}
      <StartMenu isOpen={startMenuOpen} onClose={closeStartMenu} />

      {/* Context Menu */}
      {showDesktop && (
        <ContextMenu
          onOpenSettings={openSettings}
          onOpenLaunchpad={openLaunchpad}
        />
      )}

      {/* Command Palette */}
      <CommandPalette />

      {/* Drawer */}
      {showDesktop && <Drawer />}

      {/* Sleep Mode */}
      <SleepMode />

      {/* Desktop Widgets */}
      {showDesktop && <Widgets />}

      {/* Toasts — CSS transitions, lightweight */}
      <Toasts />

      {/* Konami Code Easter Egg */}
      <KonamiCode />
    </div>
  );
}

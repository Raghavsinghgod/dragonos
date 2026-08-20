// DragonOS Desktop - Main orchestrator
import { useState, useEffect, useCallback } from 'react';
import { useOS } from './context';
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

export default function Desktop() {
  const { state, openApp } = useOS();
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  useEffect(() => { initApps(); }, []);

  // Listen for open-app-by-index (Alt+1-9)
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const appIds = ['dashboard', 'notepad', 'todo', 'calendar', 'terminal', 'calculator', 'clock', 'goals', 'habits'];
      const idx = e.detail - 1;
      if (idx >= 0 && idx < appIds.length) openApp(appIds[idx]);
    };
    document.addEventListener('dragonos-open-app-by-index', handler as EventListener);
    return () => document.removeEventListener('dragonos-open-app-by-index', handler as EventListener);
  }, [openApp]);

  // Listen for open-app-by-name (terminal)
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const name = (e.detail as string).toLowerCase();
      const match = ['dashboard', 'notepad', 'todo', 'calendar', 'terminal', 'calculator', 'clock',
        'goals', 'habits', 'kanban', 'pomodoro', 'settings', 'journal', 'expenses', 'mood',
        'vault', 'doodle', 'flashcards', 'typingtest', 'achievements', 'systemmonitor',
        'focussounds', 'browser', 'translator', 'weather', 'clipboard', 'quicknotes', 'markdown'
      ].find(id => id.includes(name));
      if (match) openApp(match);
    };
    document.addEventListener('dragonos-open-app-by-name', handler as EventListener);
    return () => document.removeEventListener('dragonos-open-app-by-name', handler as EventListener);
  }, [openApp]);

  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    // Only if clicking directly on desktop, not on windows/icons
    if (e.target === e.currentTarget) {
      // Close any open start menu
    }
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#050508]" onClick={handleDesktopClick}>
      {/* Boot Sequence */}
      {!state.desktop.booted && <BootSequence />}

      {/* Wallpaper */}
      {state.desktop.booted && <Wallpaper />}

      {/* Desktop Icons */}
      {state.desktop.booted && <DesktopIcons />}

      {/* Windows */}
      {state.desktop.booted && <WindowManager />}

      {/* Dock */}
      {state.desktop.booted && (
        <div onClick={() => setStartMenuOpen(prev => !prev)}>
          <Dock />
        </div>
      )}

      {/* Start Menu */}
      <StartMenu isOpen={startMenuOpen} onClose={() => setStartMenuOpen(false)} />

      {/* Context Menu */}
      {state.desktop.booted && (
        <ContextMenu
          onOpenSettings={() => openApp('settings')}
          onOpenLaunchpad={() => setStartMenuOpen(true)}
        />
      )}

      {/* Command Palette */}
      <CommandPalette />

      {/* Drawer */}
      {state.desktop.booted && <Drawer />}

      {/* Sleep Mode */}
      <SleepMode />

      {/* Desktop Widgets */}
      {state.desktop.booted && <Widgets />}

      {/* Toasts */}
      <Toasts />

      {/* Konami */}
      <KonamiCode />
    </div>
  );
}

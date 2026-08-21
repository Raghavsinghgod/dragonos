// DragonOS desktop — root orchestrator that assembles the shell
import { useState, useEffect, useCallback } from 'react';
import { useOS, useDesktop } from '@/state/os/providers';
import { initApps } from '@/applications';
import BootGate from '@/system/boot/BootGate';
import DesktopBackdrop from '@/system/desktop/DesktopBackdrop';
import WindowField from '@/system/windowing/WindowField';
import DockRail from '@/system/dock/DockRail';
import AppDrawer from '@/system/app-drawer/AppDrawer';
import DesktopContextMenu from '@/system/desktop/DesktopContextMenu';
import CommandPalette from '@/system/command-palette/CommandPalette';
import DrawerPanel from '@/system/drawer/DrawerPanel';
import SleepCurtain from '@/system/sleep/SleepCurtain';
import ToastShelf from '@/system/toasts/ToastShelf';
import KonamiRitual from '@/system/easter-egg/KonamiRitual';
import WidgetField from '@/system/widgets/WidgetField';

const LAUNCHABLE_APPS = [
  'dashboard', 'notepad', 'todo', 'calendar', 'terminal', 'calculator', 'clock',
  'goals', 'habits', 'kanban', 'pomodoro', 'settings', 'journal', 'expenses',
  'mood', 'vault', 'doodle', 'flashcards', 'typingtest', 'achievements',
  'systemmonitor', 'focussounds', 'browser', 'translator', 'weather',
  'clipboard', 'quicknotes', 'markdown',
];

export default function DesktopStage() {
  const { openApp } = useOS();
  const desktop = useDesktop();
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  useEffect(() => { initApps(); }, []);

  // Alt+1-9 launches apps by dock position (raised by the shortcut director)
  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent).detail - 1;
      if (idx >= 0 && idx < 9) openApp(LAUNCHABLE_APPS[idx]);
    };
    document.addEventListener('dragonos-open-app-by-index', handler);
    return () => document.removeEventListener('dragonos-open-app-by-index', handler);
  }, [openApp]);

  // `open <name>` from the terminal resolves fuzzy against this list
  useEffect(() => {
    const handler = (e: Event) => {
      const name = ((e as CustomEvent).detail as string).toLowerCase();
      const match = LAUNCHABLE_APPS.find(id => id.includes(name));
      if (match) openApp(match);
    };
    document.addEventListener('dragonos-open-app-by-name', handler);
    return () => document.removeEventListener('dragonos-open-app-by-name', handler);
  }, [openApp]);

  const closeStartMenu = useCallback(() => setStartMenuOpen(false), []);
  const openSettings = useCallback(() => openApp('settings'), [openApp]);
  const openLaunchpad = useCallback(() => setStartMenuOpen(true), []);

  const showDesktop = desktop.booted;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#050508]">
      {!showDesktop && <BootGate />}

      {/* Living wallpaper: photo base + CSS particles + RAF parallax */}
      {showDesktop && <DesktopBackdrop />}

      {/* Open windows */}
      {showDesktop && <WindowField />}

      {/* Magnifying dock with launchpad button */}
      {showDesktop && <DockRail onOpenLauncher={openLaunchpad} />}

      {/* Searchable app drawer */}
      <AppDrawer isOpen={startMenuOpen} onClose={closeStartMenu} />

      {/* Right-click desktop menu */}
      {showDesktop && (
        <DesktopContextMenu
          onOpenSettings={openSettings}
          onOpenLaunchpad={openLaunchpad}
        />
      )}

      {/* Ctrl+K palette */}
      <CommandPalette />

      {/* Right-edge quick panel: clock, sliders, notes, habits */}
      {showDesktop && <DrawerPanel />}

      <SleepCurtain />

      {/* Draggable desktop widgets + manager panel */}
      {showDesktop && <WidgetField />}

      <ToastShelf />

      {/* Up up down down... */}
      <KonamiRitual />
    </div>
  );
}

// The single source of truth for what DragonOS can launch.
// Every window, dock icon, drawer tile and palette entry derives
// from this table — nothing else hardcodes an app id.
//
// Apps are loaded through `React.lazy` + dynamic imports: the shell
// ships without any app code, and each app becomes its own chunk that
// loads the first time (or when prefetched during idle time) it opens.
import { lazy, type ComponentType, type ReactNode } from 'react';
import { setAppRegistry } from '@/state/os/providers';
import { setAppComponents } from '@/system/windowing/WindowField';
import { appIcons } from '@/ui/icons/icon-map';

type AppComponent = ComponentType<{ windowId: string }>;

// One loader per app — the ONLY place an app module path appears.
const appLoaders = {
  dashboard:     () => import('@/applications/mission-control/mission-control.app'),
  clock:         () => import('@/applications/time-harbor/time-harbor.app'),
  notepad:       () => import('@/applications/quill-pad/quill-pad.app'),
  calendar:      () => import('@/applications/almanac/almanac.app'),
  todo:          () => import('@/applications/task-runway/task-runway.app'),
  goals:         () => import('@/applications/north-star/north-star.app'),
  habits:        () => import('@/applications/habit-forge/habit-forge.app'),
  kanban:        () => import('@/applications/flow-board/flow-board.app'),
  terminal:      () => import('@/applications/dragon-terminal/dragon-terminal.app'),
  calculator:    () => import('@/applications/reckoner/reckoner.app'),
  pomodoro:      () => import('@/applications/ember-focus/ember-focus.app'),
  settings:      () => import('@/applications/control-sanctum/control-sanctum.app'),
  journal:       () => import('@/applications/dragon-journal/dragon-journal.app'),
  expenses:      () => import('@/applications/coin-ledger/coin-ledger.app'),
  mood:          () => import('@/applications/mood-runes/mood-runes.app'),
  vault:         () => import('@/applications/key-vault/key-vault.app'),
  doodle:        () => import('@/applications/sketch-nest/sketch-nest.app'),
  flashcards:    () => import('@/applications/memory-sparks/memory-sparks.app'),
  typingtest:    () => import('@/applications/key-sprint/key-sprint.app'),
  achievements:  () => import('@/applications/trophy-hall/trophy-hall.app'),
  systemmonitor: () => import('@/applications/pulse-watch/pulse-watch.app'),
  focussounds:   () => import('@/applications/soundscape/soundscape.app'),
  browser:       () => import('@/applications/web-porthole/web-porthole.app'),
  translator:    () => import('@/applications/tongue-bridge/tongue-bridge.app'),
  weather:       () => import('@/applications/sky-watch/sky-watch.app'),
  clipboard:     () => import('@/applications/clip-ledger/clip-ledger.app'),
  quicknotes:    () => import('@/applications/ember-notes/ember-notes.app'),
  markdown:      () => import('@/applications/rune-writer/rune-writer.app'),
} satisfies Record<string, () => Promise<{ default: AppComponent }>>;

export interface AppDefinition {
  name: string;
  icon: ReactNode;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  component: AppComponent;
}

const registry = {
  dashboard:     { name: 'Dashboard',      icon: appIcons.dashboard,     defaultWidth: 700, defaultHeight: 500, minWidth: 400, minHeight: 300, component: lazy(appLoaders.dashboard) },
  clock:         { name: 'Clock',          icon: appIcons.clock,         defaultWidth: 450, defaultHeight: 450, minWidth: 350, minHeight: 350, component: lazy(appLoaders.clock) },
  notepad:       { name: 'Notepad',        icon: appIcons.notepad,       defaultWidth: 600, defaultHeight: 450, minWidth: 350, minHeight: 300, component: lazy(appLoaders.notepad) },
  calendar:      { name: 'Calendar',       icon: appIcons.calendar,      defaultWidth: 600, defaultHeight: 420, minWidth: 400, minHeight: 300, component: lazy(appLoaders.calendar) },
  todo:          { name: 'Todo',           icon: appIcons.todo,          defaultWidth: 420, defaultHeight: 480, minWidth: 300, minHeight: 300, component: lazy(appLoaders.todo) },
  goals:         { name: 'Goals',          icon: appIcons.goals,         defaultWidth: 600, defaultHeight: 450, minWidth: 400, minHeight: 300, component: lazy(appLoaders.goals) },
  habits:        { name: 'Habits',         icon: appIcons.habits,        defaultWidth: 450, defaultHeight: 420, minWidth: 350, minHeight: 300, component: lazy(appLoaders.habits) },
  kanban:        { name: 'Kanban',         icon: appIcons.kanban,        defaultWidth: 700, defaultHeight: 480, minWidth: 500, minHeight: 300, component: lazy(appLoaders.kanban) },
  terminal:      { name: 'Terminal',       icon: appIcons.terminal,      defaultWidth: 600, defaultHeight: 400, minWidth: 400, minHeight: 250, component: lazy(appLoaders.terminal) },
  calculator:    { name: 'Calculator',     icon: appIcons.calculator,    defaultWidth: 280, defaultHeight: 400, minWidth: 240, minHeight: 350, component: lazy(appLoaders.calculator) },
  pomodoro:      { name: 'Pomodoro',       icon: appIcons.pomodoro,      defaultWidth: 380, defaultHeight: 450, minWidth: 300, minHeight: 350, component: lazy(appLoaders.pomodoro) },
  settings:      { name: 'Settings',       icon: appIcons.settings,      defaultWidth: 420, defaultHeight: 500, minWidth: 320, minHeight: 350, component: lazy(appLoaders.settings) },
  journal:       { name: 'Journal',        icon: appIcons.journal,       defaultWidth: 550, defaultHeight: 420, minWidth: 350, minHeight: 300, component: lazy(appLoaders.journal) },
  expenses:      { name: 'Expenses',       icon: appIcons.expenses,      defaultWidth: 450, defaultHeight: 500, minWidth: 350, minHeight: 350, component: lazy(appLoaders.expenses) },
  mood:          { name: 'Mood',           icon: appIcons.mood,          defaultWidth: 450, defaultHeight: 420, minWidth: 350, minHeight: 300, component: lazy(appLoaders.mood) },
  vault:         { name: 'Vault',          icon: appIcons.vault,         defaultWidth: 450, defaultHeight: 450, minWidth: 350, minHeight: 300, component: lazy(appLoaders.vault) },
  doodle:        { name: 'Doodle',         icon: appIcons.doodle,        defaultWidth: 620, defaultHeight: 450, minWidth: 400, minHeight: 300, component: lazy(appLoaders.doodle) },
  flashcards:    { name: 'Flashcards',     icon: appIcons.flashcards,    defaultWidth: 400, defaultHeight: 400, minWidth: 300, minHeight: 300, component: lazy(appLoaders.flashcards) },
  typingtest:    { name: 'Typing Test',    icon: appIcons.typingtest,    defaultWidth: 500, defaultHeight: 380, minWidth: 380, minHeight: 300, component: lazy(appLoaders.typingtest) },
  achievements:  { name: 'Achievements',   icon: appIcons.achievements,  defaultWidth: 500, defaultHeight: 450, minWidth: 350, minHeight: 300, component: lazy(appLoaders.achievements) },
  systemmonitor: { name: 'System Monitor', icon: appIcons.systemmonitor, defaultWidth: 500, defaultHeight: 400, minWidth: 380, minHeight: 300, component: lazy(appLoaders.systemmonitor) },
  focussounds:   { name: 'Focus Sounds',   icon: appIcons.focussounds,   defaultWidth: 380, defaultHeight: 350, minWidth: 300, minHeight: 280, component: lazy(appLoaders.focussounds) },
  browser:       { name: 'Browser',        icon: appIcons.browser,       defaultWidth: 700, defaultHeight: 500, minWidth: 400, minHeight: 300, component: lazy(appLoaders.browser) },
  translator:    { name: 'Translator',     icon: appIcons.translator,    defaultWidth: 400, defaultHeight: 380, minWidth: 300, minHeight: 280, component: lazy(appLoaders.translator) },
  weather:       { name: 'Weather',        icon: appIcons.weather,       defaultWidth: 350, defaultHeight: 480, minWidth: 280, minHeight: 300, component: lazy(appLoaders.weather) },
  clipboard:     { name: 'Clipboard',      icon: appIcons.clipboard,     defaultWidth: 400, defaultHeight: 450, minWidth: 300, minHeight: 300, component: lazy(appLoaders.clipboard) },
  quicknotes:    { name: 'Quick Notes',    icon: appIcons.quicknotes,    defaultWidth: 380, defaultHeight: 420, minWidth: 300, minHeight: 280, component: lazy(appLoaders.quicknotes) },
  markdown:      { name: 'Markdown',       icon: appIcons.markdown,      defaultWidth: 650, defaultHeight: 450, minWidth: 400, minHeight: 300, component: lazy(appLoaders.markdown) },
} satisfies Record<string, AppDefinition>;

export type AppId = keyof typeof registry;

/** Pushes the registry into the window layer. Called once by the desktop stage on mount. */
export function initApps() {
  const meta: Record<string, Omit<AppDefinition, 'component'>> = {};
  const components: Record<string, AppComponent> = {};
  for (const [id, app] of Object.entries(registry)) {
    const { component, ...rest } = app;
    meta[id] = rest;
    components[id] = component;
  }
  setAppRegistry(meta);
  setAppComponents(components);
}

let prefetchStarted = false;

/**
 * Warms every app chunk once the desktop is visible, during idle time.
 * Keeps the initial payload light while making each app's *first* open
 * feel as instant as every open after it.
 */
export function prefetchApps() {
  if (prefetchStarted || typeof window === 'undefined') return;
  prefetchStarted = true;

  const warmAll = () => {
    for (const load of Object.values(appLoaders)) {
      // Failures here are harmless — React.lazy retries on next render.
      load().catch(() => {});
    }
  };

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(warmAll, { timeout: 4000 });
  } else {
    setTimeout(warmAll, 2000);
  }
}

export default registry;

// The single source of truth for what DragonOS can launch.
// Every window, dock icon, drawer tile and palette entry derives
// from this table — nothing else hardcodes an app id.
import type { ComponentType, ReactNode } from 'react';
import { setAppRegistry } from '@/state/os/providers';
import { setAppComponents } from '@/system/windowing/WindowField';
import { appIcons } from '@/ui/icons/icon-map';

import MissionControl from '@/applications/mission-control/mission-control.app';
import TimeHarbor from '@/applications/time-harbor/time-harbor.app';
import QuillPad from '@/applications/quill-pad/quill-pad.app';
import Almanac from '@/applications/almanac/almanac.app';
import TaskRunway from '@/applications/task-runway/task-runway.app';
import NorthStar from '@/applications/north-star/north-star.app';
import HabitForge from '@/applications/habit-forge/habit-forge.app';
import FlowBoard from '@/applications/flow-board/flow-board.app';
import DragonTerminal from '@/applications/dragon-terminal/dragon-terminal.app';
import Reckoner from '@/applications/reckoner/reckoner.app';
import EmberFocus from '@/applications/ember-focus/ember-focus.app';
import ControlSanctum from '@/applications/control-sanctum/control-sanctum.app';
import DragonJournal from '@/applications/dragon-journal/dragon-journal.app';
import CoinLedger from '@/applications/coin-ledger/coin-ledger.app';
import MoodRunes from '@/applications/mood-runes/mood-runes.app';
import KeyVault from '@/applications/key-vault/key-vault.app';
import SketchNest from '@/applications/sketch-nest/sketch-nest.app';
import MemorySparks from '@/applications/memory-sparks/memory-sparks.app';
import KeySprint from '@/applications/key-sprint/key-sprint.app';
import TrophyHall from '@/applications/trophy-hall/trophy-hall.app';
import PulseWatch from '@/applications/pulse-watch/pulse-watch.app';
import Soundscape from '@/applications/soundscape/soundscape.app';
import WebPorthole from '@/applications/web-porthole/web-porthole.app';
import TongueBridge from '@/applications/tongue-bridge/tongue-bridge.app';
import SkyWatch from '@/applications/sky-watch/sky-watch.app';
import ClipLedger from '@/applications/clip-ledger/clip-ledger.app';
import EmberNotes from '@/applications/ember-notes/ember-notes.app';
import RuneWriter from '@/applications/rune-writer/rune-writer.app';

export interface AppDefinition {
  name: string;
  icon: ReactNode;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  component: ComponentType<{ windowId: string }>;
}

const registry = {
  dashboard:     { name: 'Dashboard',      icon: appIcons.dashboard,     defaultWidth: 700, defaultHeight: 500, minWidth: 400, minHeight: 300, component: MissionControl },
  clock:         { name: 'Clock',          icon: appIcons.clock,         defaultWidth: 450, defaultHeight: 450, minWidth: 350, minHeight: 350, component: TimeHarbor },
  notepad:       { name: 'Notepad',        icon: appIcons.notepad,       defaultWidth: 600, defaultHeight: 450, minWidth: 350, minHeight: 300, component: QuillPad },
  calendar:      { name: 'Calendar',       icon: appIcons.calendar,      defaultWidth: 600, defaultHeight: 420, minWidth: 400, minHeight: 300, component: Almanac },
  todo:          { name: 'Todo',           icon: appIcons.todo,          defaultWidth: 420, defaultHeight: 480, minWidth: 300, minHeight: 300, component: TaskRunway },
  goals:         { name: 'Goals',          icon: appIcons.goals,         defaultWidth: 600, defaultHeight: 450, minWidth: 400, minHeight: 300, component: NorthStar },
  habits:        { name: 'Habits',         icon: appIcons.habits,        defaultWidth: 450, defaultHeight: 420, minWidth: 350, minHeight: 300, component: HabitForge },
  kanban:        { name: 'Kanban',         icon: appIcons.kanban,        defaultWidth: 700, defaultHeight: 480, minWidth: 500, minHeight: 300, component: FlowBoard },
  terminal:      { name: 'Terminal',       icon: appIcons.terminal,      defaultWidth: 600, defaultHeight: 400, minWidth: 400, minHeight: 250, component: DragonTerminal },
  calculator:    { name: 'Calculator',     icon: appIcons.calculator,    defaultWidth: 280, defaultHeight: 400, minWidth: 240, minHeight: 350, component: Reckoner },
  pomodoro:      { name: 'Pomodoro',       icon: appIcons.pomodoro,      defaultWidth: 380, defaultHeight: 450, minWidth: 300, minHeight: 350, component: EmberFocus },
  settings:      { name: 'Settings',       icon: appIcons.settings,      defaultWidth: 420, defaultHeight: 500, minWidth: 320, minHeight: 350, component: ControlSanctum },
  journal:       { name: 'Journal',        icon: appIcons.journal,       defaultWidth: 550, defaultHeight: 420, minWidth: 350, minHeight: 300, component: DragonJournal },
  expenses:      { name: 'Expenses',       icon: appIcons.expenses,      defaultWidth: 450, defaultHeight: 500, minWidth: 350, minHeight: 350, component: CoinLedger },
  mood:          { name: 'Mood',           icon: appIcons.mood,          defaultWidth: 450, defaultHeight: 420, minWidth: 350, minHeight: 300, component: MoodRunes },
  vault:         { name: 'Vault',          icon: appIcons.vault,         defaultWidth: 450, defaultHeight: 450, minWidth: 350, minHeight: 300, component: KeyVault },
  doodle:        { name: 'Doodle',         icon: appIcons.doodle,        defaultWidth: 620, defaultHeight: 450, minWidth: 400, minHeight: 300, component: SketchNest },
  flashcards:    { name: 'Flashcards',     icon: appIcons.flashcards,    defaultWidth: 400, defaultHeight: 400, minWidth: 300, minHeight: 300, component: MemorySparks },
  typingtest:    { name: 'Typing Test',    icon: appIcons.typingtest,    defaultWidth: 500, defaultHeight: 380, minWidth: 380, minHeight: 300, component: KeySprint },
  achievements:  { name: 'Achievements',   icon: appIcons.achievements,  defaultWidth: 500, defaultHeight: 450, minWidth: 350, minHeight: 300, component: TrophyHall },
  systemmonitor: { name: 'System Monitor', icon: appIcons.systemmonitor, defaultWidth: 500, defaultHeight: 400, minWidth: 380, minHeight: 300, component: PulseWatch },
  focussounds:   { name: 'Focus Sounds',   icon: appIcons.focussounds,   defaultWidth: 380, defaultHeight: 350, minWidth: 300, minHeight: 280, component: Soundscape },
  browser:       { name: 'Browser',        icon: appIcons.browser,       defaultWidth: 700, defaultHeight: 500, minWidth: 400, minHeight: 300, component: WebPorthole },
  translator:    { name: 'Translator',     icon: appIcons.translator,    defaultWidth: 400, defaultHeight: 380, minWidth: 300, minHeight: 280, component: TongueBridge },
  weather:       { name: 'Weather',        icon: appIcons.weather,       defaultWidth: 350, defaultHeight: 480, minWidth: 280, minHeight: 300, component: SkyWatch },
  clipboard:     { name: 'Clipboard',      icon: appIcons.clipboard,     defaultWidth: 400, defaultHeight: 450, minWidth: 300, minHeight: 300, component: ClipLedger },
  quicknotes:    { name: 'Quick Notes',    icon: appIcons.quicknotes,    defaultWidth: 380, defaultHeight: 420, minWidth: 300, minHeight: 280, component: EmberNotes },
  markdown:      { name: 'Markdown',       icon: appIcons.markdown,      defaultWidth: 650, defaultHeight: 450, minWidth: 400, minHeight: 300, component: RuneWriter },
} satisfies Record<string, AppDefinition>;

export type AppId = keyof typeof registry;

/** Pushes the registry into the window layer. Called once by the desktop stage on mount. */
export function initApps() {
  const meta: Record<string, Omit<AppDefinition, 'component'>> = {};
  const components: Record<string, ComponentType<{ windowId: string }>> = {};
  for (const [id, app] of Object.entries(registry)) {
    const { component, ...rest } = app;
    meta[id] = rest;
    components[id] = component;
  }
  setAppRegistry(meta);
  setAppComponents(components);
}

export default registry;

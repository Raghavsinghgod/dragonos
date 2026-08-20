// DragonOS App Registry
import type { ComponentType } from 'react';
import { setAppRegistry, setAppComponents } from '../context';

// Lazy imports for all apps
import Dashboard from './Dashboard';
import Clock from './Clock';
import Notepad from './Notepad';
import Calendar from './Calendar';
import Todo from './Todo';
import Goals from './Goals';
import Habits from './Habits';
import Kanban from './Kanban';
import Terminal from './Terminal';
import Calculator from './Calculator';
import Pomodoro from './Pomodoro';
import Settings from './Settings';
import Journal from './Journal';
import Expenses from './Expenses';
import Mood from './Mood';
import Vault from './Vault';
import Doodle from './Doodle';
import Flashcards from './Flashcards';
import TypingTest from './TypingTest';
import Achievements from './Achievements';
import SystemMonitor from './SystemMonitor';
import FocusSounds from './FocusSounds';
import Browser from './Browser';
import Translator from './Translator';
import Weather from './Weather';
import Clipboard from './Clipboard';
import QuickNotes from './QuickNotes';
import Markdown from './Markdown';

const registry: Record<string, {
  name: string; icon: string;
  defaultWidth: number; defaultHeight: number;
  minWidth: number; minHeight: number;
  component: ComponentType<{ windowId: string }>;
}> = {
  dashboard:     { name: 'Dashboard', icon: '📊', defaultWidth: 700, defaultHeight: 500, minWidth: 400, minHeight: 300, component: Dashboard },
  clock:         { name: 'Clock', icon: '🕐', defaultWidth: 450, defaultHeight: 450, minWidth: 350, minHeight: 350, component: Clock },
  notepad:       { name: 'Notepad', icon: '📝', defaultWidth: 600, defaultHeight: 450, minWidth: 350, minHeight: 300, component: Notepad },
  calendar:      { name: 'Calendar', icon: '📅', defaultWidth: 600, defaultHeight: 420, minWidth: 400, minHeight: 300, component: Calendar },
  todo:          { name: 'Todo', icon: '✅', defaultWidth: 420, defaultHeight: 480, minWidth: 300, minHeight: 300, component: Todo },
  goals:         { name: 'Goals', icon: '🎯', defaultWidth: 600, defaultHeight: 450, minWidth: 400, minHeight: 300, component: Goals },
  habits:        { name: 'Habits', icon: '🔄', defaultWidth: 450, defaultHeight: 420, minWidth: 350, minHeight: 300, component: Habits },
  kanban:        { name: 'Kanban', icon: '📋', defaultWidth: 700, defaultHeight: 480, minWidth: 500, minHeight: 300, component: Kanban },
  terminal:      { name: 'Terminal', icon: '💻', defaultWidth: 600, defaultHeight: 400, minWidth: 400, minHeight: 250, component: Terminal },
  calculator:    { name: 'Calculator', icon: '🔢', defaultWidth: 280, defaultHeight: 400, minWidth: 240, minHeight: 350, component: Calculator },
  pomodoro:      { name: 'Pomodoro', icon: '🍅', defaultWidth: 380, defaultHeight: 450, minWidth: 300, minHeight: 350, component: Pomodoro },
  settings:      { name: 'Settings', icon: '⚙️', defaultWidth: 420, defaultHeight: 500, minWidth: 320, minHeight: 350, component: Settings },
  journal:       { name: 'Journal', icon: '📔', defaultWidth: 550, defaultHeight: 420, minWidth: 350, minHeight: 300, component: Journal },
  expenses:      { name: 'Expenses', icon: '💰', defaultWidth: 450, defaultHeight: 500, minWidth: 350, minHeight: 350, component: Expenses },
  mood:          { name: 'Mood', icon: '😊', defaultWidth: 450, defaultHeight: 420, minWidth: 350, minHeight: 300, component: Mood },
  vault:         { name: 'Vault', icon: '🔒', defaultWidth: 450, defaultHeight: 450, minWidth: 350, minHeight: 300, component: Vault },
  doodle:        { name: 'Doodle', icon: '🎨', defaultWidth: 620, defaultHeight: 450, minWidth: 400, minHeight: 300, component: Doodle },
  flashcards:    { name: 'Flashcards', icon: '🃏', defaultWidth: 400, defaultHeight: 400, minWidth: 300, minHeight: 300, component: Flashcards },
  typingtest:    { name: 'Typing Test', icon: '⌨️', defaultWidth: 500, defaultHeight: 380, minWidth: 380, minHeight: 300, component: TypingTest },
  achievements:  { name: 'Achievements', icon: '🏆', defaultWidth: 500, defaultHeight: 450, minWidth: 350, minHeight: 300, component: Achievements },
  systemmonitor: { name: 'System Monitor', icon: '📈', defaultWidth: 500, defaultHeight: 400, minWidth: 380, minHeight: 300, component: SystemMonitor },
  focussounds:   { name: 'Focus Sounds', icon: '🎧', defaultWidth: 380, defaultHeight: 350, minWidth: 300, minHeight: 280, component: FocusSounds },
  browser:       { name: 'Browser', icon: '🌐', defaultWidth: 700, defaultHeight: 500, minWidth: 400, minHeight: 300, component: Browser },
  translator:    { name: 'Translator', icon: '🌍', defaultWidth: 400, defaultHeight: 380, minWidth: 300, minHeight: 280, component: Translator },
  weather:       { name: 'Weather', icon: '🌤️', defaultWidth: 350, defaultHeight: 480, minWidth: 280, minHeight: 300, component: Weather },
  clipboard:     { name: 'Clipboard', icon: '📋', defaultWidth: 400, defaultHeight: 450, minWidth: 300, minHeight: 300, component: Clipboard },
  quicknotes:    { name: 'Quick Notes', icon: '⚡', defaultWidth: 380, defaultHeight: 420, minWidth: 300, minHeight: 280, component: QuickNotes },
  markdown:      { name: 'Markdown', icon: '📄', defaultWidth: 650, defaultHeight: 450, minWidth: 400, minHeight: 300, component: Markdown },
};

export function initApps() {
  const reg: Record<string, { name: string; icon: string; defaultWidth: number; defaultHeight: number; minWidth: number; minHeight: number }> = {};
  const components: Record<string, ComponentType<{ windowId: string }>> = {};
  for (const [id, app] of Object.entries(registry)) {
    reg[id] = app;
    components[id] = app.component;
  }
  setAppRegistry(reg);
  setAppComponents(components);
}

export default registry;

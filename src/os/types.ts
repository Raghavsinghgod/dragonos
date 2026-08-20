// DragonOS Type Definitions
import type { ReactNode } from 'react';

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  isOpen: boolean;
  animState: 'opening' | 'open' | 'closing' | 'minimizing';
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: ReactNode;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  component: React.ComponentType<{ windowId: string }>;
  pinned?: boolean;
  dockOrder?: number;
}

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'achievement';
  duration?: number;
}

export interface DesktopState {
  username: string;
  soundEnabled: boolean;
  wallpaperTheme: string;
  booted: boolean;
  sleeping: boolean;
  windowOrder: string[];
  lastZIndex: number;
}

export interface TodoItem {
  id: string;
  text: string;
  priority: 'LOW' | 'MED' | 'HIGH';
  done: boolean;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
}

export interface Goal {
  id: string;
  emoji: string;
  title: string;
  milestones: { id: string; text: string; done: boolean }[];
}

export interface Habit {
  id: string;
  name: string;
  completions: string[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: { id: string; text: string; color: string }[];
}

export interface JournalEntry {
  date: string;
  content: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export interface MoodEntry {
  date: string;
  mood: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

// DragonOS Context - Global state management
import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { save, load } from './persist';
import type { WindowState, Toast, DesktopState } from './types';

interface OSState {
  desktop: DesktopState;
  windows: Record<string, WindowState>;
  toasts: Toast[];
  nextZ: number;
  konamiProgress: number[];
  windowOrder: string[];
}

type OSAction =
  | { type: 'BOOT' }
  | { type: 'SLEEP' }
  | { type: 'WAKE' }
  | { type: 'SET_USERNAME'; name: string }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SET_WALLPAPER'; theme: string }
  | { type: 'OPEN_WINDOW'; windowId: string; appId: string; title: string; icon: React.ReactNode; width: number; height: number; minWidth: number; minHeight: number }
  | { type: 'CLOSE_WINDOW'; windowId: string }
  | { type: 'MINIMIZE_WINDOW'; windowId: string }
  | { type: 'MAXIMIZE_WINDOW'; windowId: string }
  | { type: 'RESTORE_WINDOW'; windowId: string }
  | { type: 'FOCUS_WINDOW'; windowId: string }
  | { type: 'MOVE_WINDOW'; windowId: string; x: number; y: number }
  | { type: 'RESIZE_WINDOW'; windowId: string; width: number; height: number; x?: number; y?: number }
  | { type: 'SHOW_DESKTOP' }
  | { type: 'CASCADE_WINDOWS' }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'KONAMI_KEY'; key: number }
  | { type: 'RESET_KONAMI' }
  | { type: 'FACTORY_RESET' };

const defaultDesktop: DesktopState = {
  username: 'Dragon',
  soundEnabled: true,
  wallpaperTheme: 'dragon',
  booted: false,
  sleeping: false,
  windowOrder: [],
  lastZIndex: 0,
};

function osReducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    case 'BOOT':
      return { ...state, desktop: { ...state.desktop, booted: true } };
    case 'SLEEP':
      return { ...state, desktop: { ...state.desktop, sleeping: true } };
    case 'WAKE':
      return { ...state, desktop: { ...state.desktop, sleeping: false } };
    case 'SET_USERNAME':
      return { ...state, desktop: { ...state.desktop, username: action.name } };
    case 'TOGGLE_SOUND':
      return { ...state, desktop: { ...state.desktop, soundEnabled: !state.desktop.soundEnabled } };
    case 'SET_WALLPAPER':
      return { ...state, desktop: { ...state.desktop, wallpaperTheme: action.theme } };
    case 'OPEN_WINDOW': {
      const existing = state.windows[action.windowId];
      if (existing && existing.isOpen && !existing.minimized) {
        // Already open and visible, just focus
        return osReducer(state, { type: 'FOCUS_WINDOW', windowId: action.windowId });
      }
      if (existing && existing.minimized) {
        return osReducer(state, { type: 'RESTORE_WINDOW', windowId: action.windowId });
      }
      const newZ = state.nextZ + 1;
      const w: WindowState = {
        id: action.windowId,
        appId: action.appId,
        title: action.title,
        icon: action.icon,
        x: 100 + (Object.keys(state.windows).length % 8) * 30,
        y: 60 + (Object.keys(state.windows).length % 8) * 30,
        width: action.width,
        height: action.height,
        minWidth: action.minWidth,
        minHeight: action.minHeight,
        minimized: false,
        maximized: false,
        zIndex: newZ,
        isOpen: true,
        animState: 'opening',
      };
      return {
        ...state,
        windows: { ...state.windows, [action.windowId]: w },
        nextZ: newZ,
        windowOrder: [...state.windowOrder.filter(id => id !== action.windowId), action.windowId],
      };
    }
    case 'CLOSE_WINDOW': {
      const win = state.windows[action.windowId];
      if (!win) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.windowId]: { ...win, animState: 'closing' },
        },
      };
    }
    case 'MINIMIZE_WINDOW': {
      const win = state.windows[action.windowId];
      if (!win) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.windowId]: { ...win, minimized: true, animState: 'minimizing' },
        },
      };
    }
    case 'MAXIMIZE_WINDOW': {
      const win = state.windows[action.windowId];
      if (!win) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.windowId]: {
            ...win,
            maximized: !win.maximized,
            x: win.maximized ? 100 : 0,
            y: win.maximized ? 60 : 0,
            width: win.maximized ? win.width : window.innerWidth,
            height: win.maximized ? win.height : window.innerHeight - 80,
          },
        },
      };
    }
    case 'RESTORE_WINDOW': {
      const win = state.windows[action.windowId];
      if (!win) return state;
      const newZ = state.nextZ + 1;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.windowId]: { ...win, minimized: false, animState: 'opening', zIndex: newZ },
        },
        nextZ: newZ,
      };
    }
    case 'FOCUS_WINDOW': {
      const win = state.windows[action.windowId];
      if (!win) return state;
      const newZ = state.nextZ + 1;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.windowId]: { ...win, zIndex: newZ },
        },
        nextZ: newZ,
      };
    }
    case 'MOVE_WINDOW': {
      const win = state.windows[action.windowId];
      if (!win) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.windowId]: { ...win, x: action.x, y: action.y, maximized: false },
        },
      };
    }
    case 'RESIZE_WINDOW': {
      const win = state.windows[action.windowId];
      if (!win) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.windowId]: {
            ...win,
            width: Math.max(win.minWidth, action.width),
            height: Math.max(win.minHeight, action.height),
            ...(action.x !== undefined ? { x: action.x } : {}),
            ...(action.y !== undefined ? { y: action.y } : {}),
            maximized: false,
          },
        },
      };
    }
    case 'SHOW_DESKTOP': {
      const allMinimized = Object.values(state.windows).every(w => w.minimized);
      const windows = { ...state.windows };
      for (const id of Object.keys(windows)) {
        windows[id] = { ...windows[id], minimized: !allMinimized };
      }
      return { ...state, windows };
    }
    case 'CASCADE_WINDOWS': {
      const openWins = Object.values(state.windows).filter(w => w.isOpen && !w.minimized);
      const windows = { ...state.windows };
      openWins.forEach((w, i) => {
        windows[w.id] = { ...w, x: 80 + i * 30, y: 60 + i * 30 };
      });
      return { ...state, windows };
    }
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'KONAMI_KEY': {
      const sequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
      const progress = [...state.konamiProgress, action.key];
      if (progress.length > 10) progress.shift();
      const matches = progress.length === sequence.length && progress.every((v, i) => v === sequence[i]);
      return { ...state, konamiProgress: matches ? [] : progress };
    }
    case 'RESET_KONAMI':
      return { ...state, konamiProgress: [] };
    case 'FACTORY_RESET':
      return {
        desktop: { ...defaultDesktop, booted: false },
        windows: {},
        toasts: [],
        nextZ: 0,
        konamiProgress: [],
        windowOrder: [],
      };
    default:
      return state;
  }
}

const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

interface OSContextValue {
  state: OSState;
  dispatch: React.Dispatch<OSAction>;
  openApp: (appId: string) => void;
  closeApp: (windowId: string) => void;
  addToast: (title: string, message: string, type?: Toast['type']) => void;
}

const OSContext = createContext<OSContextValue | null>(null);

export function useOS(): OSContextValue {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error('useOS must be used within OSProvider');
  return ctx;
}

// App registry will be set up outside
let appRegistryRef: Record<string, { name: string; icon: React.ReactNode; defaultWidth: number; defaultHeight: number; minWidth: number; minHeight: number }> = {};

export function setAppRegistry(reg: typeof appRegistryRef) {
  appRegistryRef = reg;
}

export function OSProvider({ children }: { children: React.ReactNode }) {
  const savedDesktop = load<DesktopState>('desktop', defaultDesktop);
  const [state, dispatch] = useReducer(osReducer, {
    desktop: { ...defaultDesktop, ...savedDesktop, booted: false, sleeping: false },
    windows: {},
    toasts: [],
    nextZ: 10,
    konamiProgress: [],
    windowOrder: [],
  });

  // Save desktop state
  useEffect(() => {
    if (state.desktop.booted) {
      save('desktop', {
        username: state.desktop.username,
        soundEnabled: state.desktop.soundEnabled,
        wallpaperTheme: state.desktop.wallpaperTheme,
      });
    }
  }, [state.desktop.username, state.desktop.soundEnabled, state.desktop.wallpaperTheme, state.desktop.booted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Close command palette or topmost window
        document.dispatchEvent(new CustomEvent('dragonos-escape'));
      }
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('dragonos-command-palette'));
      }
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        dispatch({ type: 'SHOW_DESKTOP' });
      }
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('dragonos-open-app-by-index', { detail: parseInt(e.key) }));
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('dragonos-toggle-drawer'));
      }
      // Konami code
      dispatch({ type: 'KONAMI_KEY', key: e.keyCode });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  // Check konami
  useEffect(() => {
    const sequence = konamiSequence;
    if (state.konamiProgress.length === 10 && state.konamiProgress.every((v, i) => v === sequence[i])) {
      document.dispatchEvent(new CustomEvent('dragonos-konami'));
      dispatch({ type: 'RESET_KONAMI' });
    }
  }, [state.konamiProgress, dispatch]);

  const openApp = useCallback((appId: string) => {
    const reg = appRegistryRef[appId];
    if (!reg) return;
    const windowId = `win-${appId}`;
    dispatch({
      type: 'OPEN_WINDOW',
      windowId,
      appId,
      title: reg.name,
      icon: reg.icon,
      width: reg.defaultWidth,
      height: reg.defaultHeight,
      minWidth: reg.minWidth,
      minHeight: reg.minHeight,
    });
  }, [dispatch]);

  const closeApp = useCallback((windowId: string) => {
    dispatch({ type: 'CLOSE_WINDOW', windowId });
  }, [dispatch]);

  const addToast = useCallback((title: string, message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    dispatch({ type: 'ADD_TOAST', toast: { id, title, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3000);
  }, [dispatch]);

  return (
    <OSContext.Provider value={{ state, dispatch, openApp, closeApp, addToast }}>
      {children}
    </OSContext.Provider>
  );
}

export default OSProvider;

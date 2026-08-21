# 🐉 DragonOS

A dragon-themed **web operating system** that runs entirely in your browser. Floating windows, a magnifying dock, draggable widgets, 28 built-in apps, a cinematic boot sequence, and a crimson-on-black leather aesthetic — no backend required, no sign-in, everything persists locally.

---

## ✨ Highlights

| | |
|---|---|
| 🖥️ **Window Manager** | Drag by titlebar, 8-direction resize, edge snapping (left/right = split, top = maximize), z-stacking, double-click to maximize, macOS traffic-light controls, spring blur-to-sharp **open animation** and blur-shrink **close animation** |
| 🚀 **Boot Sequence** | 2-second macOS-style boot: glowing dragon emblem cropped from the real wallpaper photo, letterspaced Cinzel wordmark, progress rail synced to the timer. Click to skip |
| 🧊 **Liquid Glass** | Shared glass material (`.lgglass`) with specular rims for the dock, menus, drawer, palette, toasts and widgets — plus a calmer translucent material (`.win-glass`) for app windows so content stays crisp |
| 🎛️ **Widgets** | Draggable glass cards (Clock, Date, Quick Todo, Habits, Pomodoro, Quote) with a full **manage panel** — iOS-style toggles, live count, layout reset. Also manageable from the Settings app |
| 🚪 **Dock** | Gaussian-curve magnification, running-app indicators, tooltips, Launchpad button |
| ⌨️ **Keyboard-first** | `Ctrl+K` command palette, `Alt+1–9` app launching, `Alt+D` show desktop, `Ctrl+Shift+D` drawer, `Esc` close overlays |
| 🥚 **Easter Egg** | ↑↑↓↓←→←→BA — confetti rain + fanfare |
| 💤 **Sleep Mode** | Screen fades to a live clock; click to wake |
| 🔔 **Toasts** | Color-coded notifications for every meaningful action, 3s auto-dismiss |

---

## 📦 The 28 Apps

**Core productivity:** Dashboard · Notepad · Calendar · Todo · Goals · Habits · Kanban Board · Journal · Quick Notes · Markdown Editor

**Time & focus:** Clock (world clocks, stopwatch, timer) · Pomodoro · Focus Sounds

**Tools:** Terminal (fake shell with `help`, `open`, `hack`, `sudo win`…) · Calculator · Translator · Weather · Browser · Clipboard Manager · Vault (passwords) · Doodle · Flashcards · Typing Test

**Insights:** Expenses · Mood Tracker · Achievements · System Monitor · Settings

---

## 🏗️ Architecture

```
src/
├── main.tsx              # Router — every route boots the desktop
├── pages/
│   ├── Dashboard.tsx     # Mounts OSProvider + Desktop
│   └── NotFound.tsx      # Themed 404
└── os/
    ├── Desktop.tsx       # Root orchestrator — assembles the shell
    ├── context.tsx       # Global state: reducer split into fine-grained
    │                     #   contexts (desktop / windows / toasts / actions)
    ├── WindowManager.tsx # Window lifecycle, drag, resize, snapping
    ├── Dock.tsx          # Magnifying dock + launchpad
    ├── StartMenu.tsx     # Searchable launcher (exports `allApps`)
    ├── CommandPalette.tsx# Ctrl+K fuzzy search
    ├── ContextMenu.tsx   # Right-click desktop menu
    ├── Drawer.tsx        # Right-edge quick panel
    ├── Widgets.tsx       # Widget system + manage panel (+ exports catalog)
    ├── Wallpaper.tsx     # Photo wallpaper, CSS stars/embers, RAF parallax
    ├── BootSequence.tsx  # 2s boot
    ├── Toasts.tsx        # Notification stack
    ├── SleepMode.tsx     # Sleep overlay
    ├── Konami.tsx        # Easter egg
    ├── persist.ts        # usePersist — debounced localStorage hook
    ├── sounds.ts         # WebAudio engine — lazy init, rate-limited blips
    ├── icons.tsx         # Lucide icon map for all apps
    └── apps/             # 28 self-contained app components + registry
```

### State model

- **No backend.** All state lives in `localStorage` (namespaced `dragonos.*`) via the `usePersist` hook — writes are debounced 500ms and skipped entirely on first mount, so booting 20 apps costs zero storage writes.
- **Window state** flows through a reducer exposed as *split contexts* — components subscribe only to the slice they use (`useWindows`, `useToasts`, `useDesktop`, `useOS` for actions), so a dragging window never re-renders the dock.
- **Window lifecycle:** `OPEN → FOCUS / MINIMIZE / MAXIMIZE → CLOSE (animState 'closing') → REMOVE` — closed windows are fully removed from state 320ms after the exit animation, so reopening always works.

### Rendering & performance

- Wallpaper particles (50 stars + 10 embers) are **pure CSS keyframes** — zero JS per frame
- Mouse parallax uses a **single `requestAnimationFrame`** writing transforms directly to the DOM (no React re-renders)
- Window/widget drag and resize are **RAF-throttled** with positions applied as plain styles (no tween lag)
- Hot leaves (`DockButton`, `ToastItem`, every widget) are `React.memo`; handlers are `useCallback`-stable
- Sounds are synthesized with WebAudio (no audio files), lazily initialized and rate-limited

---

## ⌨️ Keyboard Shortcuts

| Keys | Action |
|---|---|
| `Ctrl+K` | Command palette |
| `Alt+1` … `Alt+9` | Open app by index |
| `Alt+D` | Show desktop |
| `Ctrl+Shift+D` | Toggle drawer |
| `Esc` | Close overlays |

---

## 🧩 Widget System

Widgets are free-floating glass cards on the desktop:

- **Drag** from anywhere on a card (interactive controls excluded)
- **Manage** via the `+` FAB (bottom-right), right-click desktop → *Manage Widgets*, or **Settings → Desktop Widgets**
- Toggle each type on/off, reset the layout — changes apply live everywhere
- Widgets render **below windows** (z 5–8) so apps always take priority

---

## 🛠️ Development

```bash
bun install        # install dependencies
bun dev            # dev server (managed by the platform in Freebuff)
bun tsc -b --noEmit  # typecheck
bun run build      # production build
bun run lint       # eslint
```

**Stack:** React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · Framer Motion · Lucide icons · WebAudio

### Conventions

- New apps: create `src/os/apps/MyApp.tsx`, register it in `src/os/apps/index.ts`, add its icon in `src/os/icons.tsx`
- Persisted data: `usePersist<T>('my-key', fallback)` — keys are namespaced automatically
- Theming: black `#050508`, crimson `#dc2626`, glass via `.lgglass` / `.win-glass`, fonts `font-display` (Cinzel), `font-inter`, `font-mono` (JetBrains Mono), `font-caveat`

---

*Built with fire and code.* 🔥

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
├── main.tsx                  # Entry — mounts DragonOsRoot
├── DragonOsRoot.tsx          # Router + last-resort crash boundary
│
├── system/                   # The OS shell (feature-first, no 'components' dumping ground)
│   ├── boot/BootGate.tsx     # 2s boot sequence
│   ├── desktop/              # DesktopStage orchestrator, backdrop, context menu, 404
│   ├── windowing/WindowField.tsx   # Window lifecycle, drag, resize, snapping
│   ├── dock/DockRail.tsx     # Gaussian-magnifying dock + launchpad
│   ├── app-drawer/           # Searchable launcher grid
│   ├── command-palette/      # Ctrl+K fuzzy search
│   ├── drawer/               # Right-edge quick panel
│   ├── widgets/              # Draggable desktop widgets + manage panel
│   ├── sleep/ · toasts/ · easter-egg/
│
├── applications/             # One folder per app, registered in index.ts
│   └── <app-name>/<app-name>.app.tsx
│
├── state/
│   ├── os/providers.tsx      # Reducer split into fine-grained contexts
│   │                         #   (desktop / windows / toasts / actions)
│   └── persistence/local-storage.ts  # save/load + usePersist (debounced)
│
├── lib/audio/cues.ts         # WebAudio engine — synthesized UI sounds
├── types/os.types.ts         # Shared domain types
└── ui/icons/icon-map.tsx     # Lucide icon map for all apps
```

### State model

- **No backend.** All state lives in `localStorage` (namespaced `dragonos.*`) via the `usePersist` hook (`state/persistence/local-storage.ts`) — writes are debounced 500ms and skipped entirely on first mount, so booting 20 apps costs zero storage writes.
- **Window state** flows through a reducer exposed as *split contexts* — components subscribe only to the slice they use (`useWindows`, `useToasts`, `useDesktop`, `useOS` for actions), so a dragging window never re-renders the dock.
- **Window lifecycle:** `OPEN → FOCUS / MINIMIZE / MAXIMIZE → CLOSE (animState 'closing') → REMOVE` — closed windows are fully removed from state 320ms after the exit animation, so reopening always works.

### Rendering & performance

- Wallpaper particles (50 stars + 10 embers) are **pure CSS keyframes** — zero JS per frame
- Mouse parallax uses a **single `requestAnimationFrame`** writing transforms directly to the DOM (no React re-renders)
- Window/widget drag and resize are **RAF-throttled** with positions applied as plain styles (no tween lag)
- Hot leaves (`DockButton`, `ToastItem`, every widget) are `React.memo`; handlers are `useCallback`-stable
- Sounds are synthesized with WebAudio (no audio files), lazily initialized and rate-limited
- **Every app is its own lazy chunk** (`React.lazy` + dynamic import): the shell ships without any app code, windows show a small crimson spinner while a chunk streams in, and `prefetchApps()` warms all 28 chunks via `requestIdleCallback` right after boot — first open feels as fast as every open after

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

- New apps: create `src/applications/my-app/my-app.app.tsx`, add one loader line **and** one registry row in `src/applications/index.ts` (apps load lazily from that table — don't import app components anywhere else), add its icon in `src/ui/icons/icon-map.tsx`
- Persisted data: `usePersist<T>('my-key', fallback)` from `@/state/persistence/local-storage` — keys are namespaced automatically
- Theming: black `#050508`, crimson `#dc2626`, glass via `.lgglass` / `.win-glass`, fonts `font-display` (Cinzel), `font-inter`, `font-mono` (JetBrains Mono), `font-caveat`

---

*Built with fire and code.* 🔥

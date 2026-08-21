# DragonOS Devlog

Notes from building a dragon-themed web OS in a browser tab. Mostly for future me, partly so the weird decisions have a paper trail.

---

## Entry 1 — Why build an OS in a browser?

Because the desktop metaphor is fun and nobody stops you.

The pitch I wrote down was one line: *"macOS, but if it were summoned instead of installed."* Black leather, red Chinese dragon, glass everywhere. The kind of thing that sounds like a screensaver until you realize a window manager is just... rectangles with opinions about z-index.

No backend. No login. If you close the tab, your stuff survives in localStorage and that's the whole database. I kept asking myself "would a real OS make me sign in to use a calculator?" No. It would not.

---

## Entry 2 — The boot screen ate two days

I knew I wanted an Apple-style boot: logo, spinner, done. What I did not expect was how many ways there are to get that wrong.

First version had a hand-drawn SVG dragon floating over a spinning arc. It looked okay in screenshots and cheap in motion — like clip art pretending to be a logo. Then I found the actual image I wanted (a red dragon embossed on real black leather) and everything changed: now the boot screen shows *that*, cropped tight into a glowing circle, breathing slowly on pure black. Two seconds, a thin progress bar synced to the timer, click to skip.

The lesson I keep relearning: one authentic asset beats ten clever approximations. I deleted the SVG dragon without ceremony.

Also learned that `useCallback` inside `useEffect` is illegal (obviously, once it's pointed out) and React will crash your whole boot sequence to remind you. That crash report named the exact line. Rude, but fair.

---

## Entry 3 — Windows are where the lies live

Every tutorial makes window dragging look trivial. None of them mention:

- If position goes through a spring animation, every mouse-move tweens behind the cursor and the window feels drunk. Fix: plain styles while dragging, springs only for open/close.
- Edge snapping sounds cute until you decide left edge = half split, top = maximize, and then you have to actually implement maximize as a *state*, not a size.
- Closing a window is a lifecycle, not a boolean. My first version set a "closing" flag for the exit animation and then... never removed anything. Invisible zombie windows sat there eating clicks forever, and clicking a dock icon would "focus" the corpse instead of opening the app. You couldn't open any app twice. Ever.

That last one shipped briefly. Nobody died, but I felt it.

Now: open expands from near the dock with a blur-to-sharp spring, close shrinks the *real* window (content and all) back into the blur, and 320ms later the state is gone completely. Reopening works every time, which honestly felt like a feature launch by itself.

---

## Entry 4 — The dock, or: gaussian curves are free

Dock magnification is just a distance falloff — 1.35x for the hovered icon, 1.2x neighbors, 1.08x next ring, spring back on leave. Ten lines of math doing all the work. The trick was resisting framer-motion for each icon; transforms + CSS transitions hit 60fps and cost nothing.

Added a Launchpad button after realizing my "click anywhere on the dock opens the menu" hack meant *every app click also popped the launcher*. One of those bugs that's hilarious in hindsight and mortifying in the moment.

---

## Entry 5 — Twenty-eight apps, or: the grind

Nobody warns you that an OS is mostly apps. Dashboard, Notepad, Calendar, Todo, Goals, Habits, Kanban, Terminal (fake shell — `sudo win` grants ultimate power), Calculator, Pomodoro, Journal, Expenses, Mood, Vault, Doodle, Flashcards, Typing Test, Achievements, System Monitor, Focus Sounds, Translator, Weather, Clipboard, Quick Notes, Markdown...

Each one is small. Each one needs somewhere to save its data. Enter `usePersist` — useState that writes through to localStorage, debounced so typing in Notepad doesn't hammer disk. Later I noticed every app wrote its fallback value back to storage on mount. Twenty apps booting = twenty pointless writes. Now the hook skips the first write entirely. Boot costs nothing until you actually change something.

Terminal's fake hacking animation remains my favorite five minutes of work. It's a wall of block characters and a smug success message. Perfect.

---

## Entry 6 — Widgets, and the great z-index war

Widgets were supposed to be easy: little glass cards, drag them around. Three fights happened:

1. **They floated above open windows.** A widget dragged to z-index 100 while windows start at 11. Fixed by demoting widgets to layer 5–8 permanently. Apps always win. This is correct — widgets are wallpaper with features.
2. **Dragging only worked from a tiny grip handle** nobody could find. Now the whole card drags, except buttons/inputs, which stay clickable. The grip stays as decoration and honesty.
3. **Managing them needed a home.** There's a "+" button, a context-menu item, AND a section in Settings now. All three flip the same switches live. iOS-style toggles because of course.

---

## Entry 7 — Liquid glass, tempered

Apple announced liquid glass and suddenly flat panels felt naked. So: one shared material — frosted tint, a specular top edge, a rim that catches light along the curve and fades into crimson. Dock, menus, drawer, palette, toasts, widgets all drink from it.

Then I used it on app windows and hated it. Content behind double-blur looks moody for about four seconds and then you're trying to read text through syrup. App windows got their own calmer translucent material instead. Glass is for chrome; clarity is for content. Also killed the hover shine on widgets — it was showing off.

---

## Entry 8 — The performance panic

At some point I opened the profiler and had a small heart attack, then did the boring work:

- 50 twinkling stars + 10 embers moved from JS animation loops to pure CSS keyframes. Zero per-frame JS.
- Mouse parallax became one rAF writing transforms straight to the DOM. React never knows the mouse moved. Good.
- Split the giant state context into slices so a window drag doesn't re-render the dock.
- RAF-throttled all drag/resize handlers.
- Memoized the leaves (dock buttons, toasts, widgets).

Nothing exotic. It's all "don't do work you don't need," which is 90% of performance advice wearing a trench coat.

---

## Entry 9 — Deleting things feels amazing

Big cleanup pass: ripped out the landing page and auth entirely (why was a local-only OS asking me to sign in?), deleted dead components, replaced emoji icons with real Lucide ones, renamed the project folder from template junk to DragonOS, drew an actual dragon favicon, rewrote the 404 so it stops looking like a default.

Found a manifest literally titled "freebuff.com application" with a white background. On a black-leather OS. Crimes.

Also ran the linter with the strict React compiler rules on. Thirty-nine errors. Math.random() during render (the typing test reshuffled its sentence every keystroke-adjacent render), setState cascades in effects, TDZ bugs hiding in Clipboard, `any` types holding hands across Achievements. All fixed. Zero errors now, and the code reads like something a careful person wrote, which is the point.

---

## Entry 10 — The 400 that wasn't mine (it was mine)

Mystery 400 errors after removing login. Turned out the auth provider was still mounted, dutifully refreshing a token that no longer existed against a backend nothing used anymore. Every page load, a polite request to a server: "here's this dead credential, validate it please." Server: 400.

Fix was deleting three lines. The best bugs are the ones where the fix is deletion.

---

## Where it stands

Boots in two seconds. Twenty-eight apps, six draggable widgets, a dock with gaussian physics, keyboard shortcuts, a command palette, sleep mode, a konami code, synthesized UI sounds, and a wallpaper of an actual dragon on actual leather. All client-side, all offline, all persisted.

Things I'd do differently: start with the window lifecycle design instead of discovering it via zombie bug; pick the wallpaper asset on day one; never animate positions through springs.

Things I'd do again: the boot screen. The terminal easter egg. Saying no to a backend.

Next up, maybe: multiple desktops? Window tabs? Honestly, probably just using it and fixing what annoys me. That's how real software gets good anyway.

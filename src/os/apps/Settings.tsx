// DragonOS Settings App
import { useState } from 'react';
import { Flame } from 'lucide-react';
import { useOS } from '../context';
import { save, load, clearAll } from '../persist';
import { sounds } from '../sounds';
import { widgetTypes, type WidgetType } from '../Widgets';
import type { WidgetConfig } from '../Widgets';

export default function Settings() {
  const { state, dispatch, addToast } = useOS();
  const [username, setUsername] = useState(state.desktop.username);
  const [resetConfirm, setResetConfirm] = useState(0);

  // Local mirror of widget visibility — changes are broadcast to the live
  // desktop layer via events so both views stay in sync instantly.
  const [widgetOn, setWidgetOn] = useState<Record<string, boolean>>(() => {
    const cfg = load<WidgetConfig[]>('widgets', []);
    return Object.fromEntries(widgetTypes.map(w => [
      w.type,
      cfg.some(c => c.type === w.type && c.visible),
    ]));
  });

  const toggleWidget = (type: WidgetType) => {
    setWidgetOn(prev => ({ ...prev, [type]: !prev[type] }));
    document.dispatchEvent(new CustomEvent('dragonos-widget-toggle', { detail: type }));
    sounds.click();
  };

  const resetWidgets = () => {
    setWidgetOn(Object.fromEntries(widgetTypes.map(w => [w.type, ['clock', 'date', 'quote'].includes(w.type)])));
    document.dispatchEvent(new CustomEvent('dragonos-widgets-reset'));
    sounds.click();
  };

  const shortcuts = [
    { keys: 'Ctrl+K', desc: 'Command Palette' },
    { keys: 'Esc', desc: 'Close overlay' },
    { keys: 'Alt+D', desc: 'Show Desktop' },
    { keys: 'Alt+1-9', desc: 'Open apps' },
    { keys: 'Ctrl+Shift+D', desc: 'Toggle Drawer' },
  ];

  const handleSave = () => {
    dispatch({ type: 'SET_USERNAME', name: username });
    addToast('Settings', 'Settings saved!', 'success');
    sounds.complete();
  };

  const handleReset = () => {
    if (resetConfirm < 2) {
      setResetConfirm(r => r + 1);
      return;
    }
    clearAll();
    dispatch({ type: 'FACTORY_RESET' });
    sounds.error();
    window.location.reload();
  };

  return (
    <div className="p-4 font-inter space-y-4 max-h-full overflow-y-auto">
      <h3 className="text-sm text-white/80 font-display">Settings</h3>

      {/* Username */}
      <div className="p-3 rounded-xl bg-white/5">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Username</p>
        <div className="flex gap-2">
          <input value={username} onChange={e => setUsername(e.target.value)}
            className="flex-1 text-sm bg-white/5 rounded-lg px-3 py-2 text-white/70 outline-none" />
          <button onClick={handleSave} className="px-3 py-2 rounded-lg bg-[#dc2626] text-white text-xs">Save</button>
        </div>
      </div>

      {/* Sound Toggle */}
      <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/70">Sound Effects</p>
          <p className="text-[9px] text-white/30">Toggle system sounds</p>
        </div>
        <button onClick={() => { dispatch({ type: 'TOGGLE_SOUND' }); sounds.click(); }}
          className={`w-10 h-5 rounded-full transition-colors ${state.desktop.soundEnabled ? 'bg-[#dc2626]' : 'bg-white/10'}`}>
          <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-0.5 ${state.desktop.soundEnabled ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      {/* Wallpaper */}
      <div className="p-3 rounded-xl bg-white/5">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Wallpaper Theme</p>
        <div className="flex gap-2">
          {['dragon', 'minimal', 'neon'].map(theme => (
            <button key={theme} onClick={() => { dispatch({ type: 'SET_WALLPAPER', theme }); sounds.click(); }}
              className={`flex-1 py-2 rounded-lg text-[10px] capitalize transition-colors ${
                state.desktop.wallpaperTheme === theme ? 'bg-[#dc2626]/20 text-[#dc2626] ring-1 ring-[#dc2626]/30' : 'bg-white/5 text-white/40'
              }`}>{theme}</button>
          ))}
        </div>
      </div>

      {/* Desktop Widgets */}
      <div className="p-3 rounded-xl bg-white/5">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Desktop Widgets</p>
        <div className="space-y-0.5">
          {widgetTypes.map(w => (
            <button key={w.type} onClick={() => toggleWidget(w.type)} role="switch" aria-checked={!!widgetOn[w.type]}
              className="w-full flex items-center gap-3 py-1.5 text-left hover:bg-white/[0.03] rounded-lg px-1 -mx-1 transition-colors">
              <span className="w-6 h-6 rounded-md bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-[#dc2626]/80 flex-shrink-0 [&_svg]:w-3 [&_svg]:h-3">
                {w.icon}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[11px] text-white/70 leading-tight">{w.label}</span>
                <span className="block text-[9px] text-white/30 mt-0.5">{w.desc}</span>
              </span>
              <span className="lg-switch" data-on={!!widgetOn[w.type]}>
                <span className="lg-switch-knob" />
              </span>
            </button>
          ))}
        </div>
        <button onClick={resetWidgets}
          className="mt-2 w-full py-1.5 rounded-lg bg-white/5 text-[10px] text-white/40 hover:text-white/60 transition-colors">
          Reset Widget Layout
        </button>
      </div>

      {/* Shortcuts */}
      <div className="p-3 rounded-xl bg-white/5">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Keyboard Shortcuts</p>
        <div className="space-y-1.5">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-white/50">{s.desc}</span>
              <kbd className="text-[9px] text-white/30 px-1.5 py-0.5 rounded bg-white/5 font-mono">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Factory Reset */}
      <div className="p-3 rounded-xl bg-white/5 border border-red-500/10">
        <p className="text-[10px] text-red-400/50 uppercase tracking-wider mb-2">Danger Zone</p>
        <button onClick={handleReset}
          className={`w-full py-2 rounded-lg text-xs transition-colors ${
            resetConfirm > 0 ? 'bg-red-500/30 text-red-400' : 'bg-white/5 text-white/30 hover:text-white/50'
          }`}>
          {resetConfirm === 0 ? 'Factory Reset' : resetConfirm === 1 ? 'Click again to confirm...' : 'Final click to reset!'}
        </button>
      </div>

      {/* About */}
      <div className="p-3 rounded-xl bg-white/5 text-center">
        <Flame className="w-6 h-6 mx-auto mb-1 text-[#dc2626]" />
        <p className="text-xs text-white/50">DragonOS v1.0</p>
        <p className="text-[9px] text-white/20 mt-0.5">Built with fire and code</p>
      </div>
    </div>
  );
}

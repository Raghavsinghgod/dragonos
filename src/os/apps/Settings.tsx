// DragonOS Settings App
import { useState } from 'react';
import { useOS } from '../context';
import { save, load, clearAll } from '../persist';
import { sounds } from '../sounds';

export default function Settings() {
  const { state, dispatch, addToast } = useOS();
  const [username, setUsername] = useState(state.desktop.username);
  const [resetConfirm, setResetConfirm] = useState(0);

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
        <p className="text-lg mb-1">🐉</p>
        <p className="text-xs text-white/50">DragonOS v1.0</p>
        <p className="text-[9px] text-white/20 mt-0.5">Built with fire and code</p>
      </div>
    </div>
  );
}

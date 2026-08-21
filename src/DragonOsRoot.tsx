// Router + last-resort error boundary. If something above the OS crashes,
// you get a readable crash card instead of a black screen.
import { Component, type ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import DesktopStage from '@/system/desktop/DesktopStage';
import NotFoundRoute from '@/system/desktop/NotFoundRoute';

type CrashState = { hasError: boolean; message: string };

class RootBoundary extends Component<{ children: ReactNode }, CrashState> {
  state: CrashState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): CrashState {
    return { hasError: true, message: error.message || 'Unknown runtime error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white p-6 font-inter">
          <div className="max-w-lg text-center">
            <p className="font-display text-2xl tracking-[0.15em] text-[#dc2626]">
              The dragon stumbled
            </p>
            <p className="mt-3 text-xs text-white/50 break-words">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 px-5 py-2.5 rounded-lg border border-[#dc2626]/40 text-[#dc2626] text-sm hover:bg-[#dc2626]/10 transition-colors"
            >
              Rekindle
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Every path lands in the OS — there is no marketing site here.
export default function DragonOsRoot() {
  return (
    <RootBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DesktopStage />} />
          <Route path="/dashboard" element={<DesktopStage />} />
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </BrowserRouter>
    </RootBoundary>
  );
}

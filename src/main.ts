import { StrictMode, Component, createElement, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { OSProvider } from '@/core/store';
import Desktop, { notfound } from '@/shell/desktop';
import '@/index.css';

type crashstate = { hasError: boolean; message: string };

class boundary extends Component<{ children: ReactNode }, crashstate> {
  state: crashstate = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): crashstate {
    return { hasError: true, message: error.message || 'Unknown runtime error' };
  }

  render() {
    if (this.state.hasError) {
      return createElement(
        'div',
        { className: 'min-h-screen flex items-center justify-center bg-[#050508] text-white p-6 font-inter' },
        createElement(
          'div',
          { className: 'max-w-lg text-center' },
          createElement('p', { className: 'font-display text-2xl tracking-[0.15em] text-[#dc2626]' }, 'The dragon stumbled'),
          createElement('p', { className: 'mt-3 text-xs text-white/50 break-words' }, this.state.message),
          createElement(
            'button',
            {
              type: 'button',
              onClick: () => window.location.reload(),
              className: 'mt-6 px-5 py-2.5 rounded-lg border border-[#dc2626]/40 text-[#dc2626] text-sm hover:bg-[#dc2626]/10 transition-colors',
            },
            'Rekindle',
          ),
        ),
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  createElement(
    StrictMode,
    null,
    createElement(
      boundary,
      null,
      createElement(
        BrowserRouter,
        null,
        createElement(
          OSProvider,
          null,
          createElement(
            Routes,
            null,
            createElement(Route, { path: '/', element: createElement(Desktop) }),
            createElement(Route, { path: '/dashboard', element: createElement(Desktop) }),
            createElement(Route, { path: '*', element: createElement(notfound) }),
          ),
        ),
      ),
    ),
  ),
);

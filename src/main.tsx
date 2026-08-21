// Entry point. Everything else hangs off DragonOsRoot — router,
// crash boundary and the desktop itself live there.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DragonOsRoot from '@/DragonOsRoot';
import '@/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DragonOsRoot />
  </StrictMode>,
);

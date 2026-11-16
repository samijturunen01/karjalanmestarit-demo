import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/mona-sans/wdth.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import './styles/index.css';
import App from './App';
import { preloadRoute } from './routes';

// Works at a domain root and under a GitHub Pages sub-path (BASE_PATH at build time)
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production pages are prerendered (scripts/prerender.mjs). Hydrate only when the
// prerendered route is the one being visited; otherwise (404.html, or a host that
// falls back to index.html) render fresh. Load the page's chunk first so hydration
// renders synchronously.
const path = (window.location.pathname.slice(basename === '/' ? 0 : basename.length) || '/').replace(/(.)\/+$/, '$1');
const prerendered = container.dataset.path;
preloadRoute(path).finally(() => {
  if (container.firstElementChild && prerendered === path) hydrateRoot(container, app);
  else {
    container.textContent = '';
    createRoot(container).render(app);
  }
});

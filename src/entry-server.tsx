import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';

export { pageMeta, notFoundMeta } from './content/seo';
export { company, contactGroups } from './content/company';
export { services } from './content/services';
export { preloadAll } from './routes';

/** Render one route to HTML for prerendering (see scripts/prerender.mjs). */
export function render(url: string): string {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
  return renderToString(
    <StrictMode>
      <StaticRouter location={url} basename={basename}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}

import { lazy, type ComponentType, type ReactElement } from 'react';

/**
 * Route-level code splitting that stays hydration-safe:
 *  - each page module can be preloaded; once loaded, the page renders
 *    synchronously (no Suspense fallback), so prerendered HTML hydrates as-is;
 *  - the server preloads every page before rendering;
 *  - the client preloads the current page before hydrating, and the target
 *    page while the transition sheet is covering the screen.
 */
type Loader = () => Promise<{ default: ComponentType }>;

export type PageComponent = {
  (): ReactElement;
  preload: () => Promise<void>;
};

function lazyPage(factory: Loader): PageComponent {
  let Loaded: ComponentType | null = null;
  let promise: Promise<void> | null = null;
  const preload = () =>
    (promise ??= factory().then((m) => {
      Loaded = m.default;
    }));
  const Lazy = lazy(() => preload().then(() => ({ default: Loaded as ComponentType })));
  function Page() {
    return Loaded ? <Loaded /> : <Lazy />;
  }
  Page.preload = preload;
  return Page;
}

export const pages = {
  services: lazyPage(() => import('./pages/Services').then((m) => ({ default: m.Services }))),
  serviceDetail: lazyPage(() => import('./pages/ServiceDetail').then((m) => ({ default: m.ServiceDetail }))),
  references: lazyPage(() => import('./pages/References').then((m) => ({ default: m.References }))),
  company: lazyPage(() => import('./pages/Company').then((m) => ({ default: m.Company }))),
  contact: lazyPage(() => import('./pages/Contact').then((m) => ({ default: m.Contact }))),
  notFound: lazyPage(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound }))),
};

/** Preload the page module for a pathname (relative to the router basename). */
export function preloadRoute(pathname: string): Promise<void> {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/') return Promise.resolve();
  if (p === '/palvelut') return pages.services.preload();
  if (p.startsWith('/palvelut/')) return pages.serviceDetail.preload();
  if (p === '/referenssit') return pages.references.preload();
  if (p === '/yritys') return pages.company.preload();
  if (p === '/yhteystiedot') return pages.contact.preload();
  return pages.notFound.preload();
}

export function preloadAll(): Promise<void> {
  return Promise.all(Object.values(pages).map((p) => p.preload())).then(() => {});
}

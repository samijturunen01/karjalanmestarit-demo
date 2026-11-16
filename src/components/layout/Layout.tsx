import { Suspense, useEffect, useRef, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router';
import { metaFor } from '../../content/seo';
import { DemoNotice } from './DemoNotice';
import { Footer } from './Footer';
import { Header } from './Header';
import { RouteChangeEffects } from './Navigation';
import { useReveals } from './useReveals';

/**
 * Lives INSIDE the Suspense boundary: React hydrates the boundary's content in
 * a later pass than the shell, so DOM work (reveals) must wait for it here.
 */
function PageScope({ pathname, children }: { pathname: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref, pathname);
  useEffect(() => {
    window.__kmBooted = true;
  }, []);
  return <div ref={ref}>{children}</div>;
}

export function Layout() {
  const { pathname } = useLocation();

  // Client-side navigation: keep <title> and description in sync with the route
  useEffect(() => {
    const meta = metaFor(pathname);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [pathname]);

  return (
    <>
      <RouteChangeEffects />
      <a href="#main" className="skip-link">
        Siirry sisältöön
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-[100svh]" />}>
          <PageScope pathname={pathname}>
            <Outlet />
          </PageScope>
        </Suspense>
      </main>
      <Footer />
      <DemoNotice />
    </>
  );
}

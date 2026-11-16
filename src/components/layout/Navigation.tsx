import { type ComponentProps, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router';
import { motionOK, useIsoLayoutEffect } from '../../lib/motion';
import { preloadRoute } from '../../routes';

/**
 * After every location change: reset scroll (or jump to the #hash) for new
 * entries, and move focus to <main> so keyboard and screen-reader users start
 * at the new page's content. Back/forward (POP) keeps the browser's own
 * scroll restoration.
 */
export function RouteChangeEffects() {
  const location = useLocation();
  const navType = useNavigationType();

  useIsoLayoutEffect(() => {
    if (navType === 'POP') return;
    const hash = location.hash.slice(1);
    const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
    const main = document.getElementById('main');
    if (main && !hash) main.focus({ preventScroll: true });
  }, [location.key]);

  return null;
}

type AppLinkProps = ComponentProps<typeof Link> & { to: string };

const pathOf = (to: string) => to.split(/[?#]/)[0];

/**
 * Internal link. The target page's chunk is prefetched on hover/focus and
 * loaded before navigating, so the new page renders at once without a blank
 * Suspense fallback. Same-page links scroll instead. Modifier-clicks behave normally.
 */
export function AppLink({ to, onClick, ...rest }: AppLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const [path, hash] = to.split('#');
    const samePage = !path || path === location.pathname;
    e.preventDefault();
    if (samePage) {
      const smooth = motionOK() ? 'smooth' : 'auto';
      const target = hash ? document.getElementById(hash) : null;
      if (target) {
        target.scrollIntoView({ behavior: smooth });
        history.replaceState(history.state, '', `#${hash}`);
      } else window.scrollTo({ top: 0, behavior: smooth });
      return;
    }
    preloadRoute(pathOf(to))
      .catch(() => undefined)
      .then(() => navigate(to));
  };

  const prefetch = () => void preloadRoute(pathOf(to)).catch(() => undefined);
  const { onMouseEnter, onFocus, ...others } = rest;
  return (
    <Link
      to={to}
      onClick={handle}
      onMouseEnter={(e) => {
        prefetch();
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        prefetch();
        onFocus?.(e);
      }}
      {...others}
    />
  );
}

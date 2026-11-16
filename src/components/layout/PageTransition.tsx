import { createContext, use, useCallback, useRef, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router';
import { gsap, motionOK, useIsoLayoutEffect } from '../../lib/motion';
import { LogoMark } from '../brand/Logo';
import { preloadRoute } from '../../routes';

interface TransitionApi {
  go: (to: string) => void;
}

const TransitionContext = createContext<TransitionApi>({ go: () => {} });

/**
 * Page transition "pelti" (sheet): a dark standing-seam sheet with a red drip
 * edge slides up from the eave, the route changes underneath, and the sheet
 * continues upward to uncover the new page. ~0.9 s, skipped for reduced motion.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navType = useNavigationType();
  const sheet = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const revealing = useRef(false);

  const go = useCallback(
    (to: string) => {
      if (busy.current) return;
      const el = sheet.current;
      // Fetch the target page's chunk while the sheet covers the screen
      const ready = preloadRoute(to.split(/[?#]/)[0]).catch(() => undefined);
      if (!el || !motionOK()) {
        ready.then(() => navigate(to));
        return;
      }
      busy.current = true;
      gsap
        .timeline()
        .set(el, { yPercent: 100, visibility: 'visible' })
        .to(el, { yPercent: 0, duration: 0.55, ease: 'expo.in' })
        .add(() => {
          ready.then(() => {
            revealing.current = true;
            navigate(to);
          });
        });
    },
    [navigate],
  );

  // After every location change: scroll handling, focus, and the reveal half of the sheet.
  useIsoLayoutEffect(() => {
    const hash = location.hash.slice(1);
    if (navType === 'PUSH' || navType === 'REPLACE') {
      const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    }
    if (navType !== 'POP' || revealing.current) {
      const main = document.getElementById('main');
      if (main && !hash) main.focus({ preventScroll: true });
    }
    const el = sheet.current;
    if (revealing.current && el) {
      revealing.current = false;
      gsap.to(el, {
        yPercent: -100,
        duration: 0.75,
        ease: 'expo.inOut',
        delay: 0.08,
        onComplete: () => {
          gsap.set(el, { visibility: 'hidden', yPercent: 100 });
          busy.current = false;
        },
      });
    } else {
      busy.current = false;
    }
  }, [location.key]);

  return (
    <TransitionContext value={{ go }}>
      {children}
      <div
        ref={sheet}
        aria-hidden="true"
        className="on-dark seams tex-granule pointer-events-none fixed inset-0 z-[80] grid place-items-center"
        style={{ visibility: 'hidden', transform: 'translateY(100%)' }}
      >
        <span className="absolute inset-x-0 top-0 h-[3px] bg-signal" />
        <LogoMark variant="reverse" className="w-16 opacity-90" />
      </div>
    </TransitionContext>
  );
}

export const usePageTransition = () => use(TransitionContext);

type TLinkProps = ComponentProps<typeof Link> & { to: string };

/** Internal link that plays the page transition. Modifier-clicks behave normally. */
export function TLink({ to, onClick, ...rest }: TLinkProps) {
  const { go } = usePageTransition();
  const location = useLocation();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const [path, hash] = to.split('#');
    const samePage = !path || path === location.pathname;
    if (samePage) {
      e.preventDefault();
      const smooth = motionOK() ? 'smooth' : 'auto';
      const target = hash ? document.getElementById(hash) : null;
      if (target) {
        target.scrollIntoView({ behavior: smooth });
        history.replaceState(history.state, '', `#${hash}`);
      } else window.scrollTo({ top: 0, behavior: smooth });
      return;
    }
    e.preventDefault();
    go(to);
  };

  const prefetch = () => void preloadRoute(to.split(/[?#]/)[0]).catch(() => undefined);
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

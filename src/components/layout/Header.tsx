import { Phone } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { company } from '../../content/company';
import { gsap, motionOK } from '../../lib/motion';
import { Logo } from '../brand/Logo';
import { AppLink } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { ArrowRight } from '../ui/Icons';

export const NAV = [
  { to: '/palvelut', label: 'Palvelut' },
  { to: '/referenssit', label: 'Referenssit' },
  { to: '/yritys', label: 'Yritys' },
  { to: '/yhteystiedot', label: 'Yhteystiedot' },
] as const;

export function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The menu remembers the route it was opened on, so navigating closes it without an effect
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const setMenuOpen = (open: boolean | ((o: boolean) => boolean)) =>
    setMenuPath(() => ((typeof open === 'function' ? open(menuOpen) : open) ? pathname : null));
  const lastY = useRef(0);

  // Solid after the first few pixels; hides on scroll down, returns on scroll up.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        const delta = y - lastY.current;
        if (Math.abs(delta) > 6) setHidden(delta > 0 && y > 320);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const closeMenu = useCallback(() => setMenuPath(null), []);
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <>
      <header
        data-site-header
        className={[
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-out-expo)]',
          scrolled || menuOpen ? 'bg-paper/96 shadow-[0_1px_0_rgb(22_21_20/0.12)]' : 'bg-transparent',
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0',
        ].join(' ')}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <AppLink
            to="/"
            aria-label="Karjalan Mestarit Oy – etusivulle"
            className="relative -my-2 block py-2"
            onClick={() => {
              if (motionOK()) gsap.fromTo('[data-header-logo] [data-logo="spiral"]', { rotate: -24 }, { rotate: 0, svgOrigin: '58 86', duration: 1.2, ease: 'elastic.out(1, 0.5)' });
            }}
          >
            <span data-header-logo className="block">
              <Logo title="" className="h-auto w-[6.75rem] sm:w-[8.25rem]" />
            </span>
          </AppLink>

          <nav aria-label="Päävalikko" data-header-fade className="hidden lg:block">
            <ul className="flex items-center gap-9 text-[0.95rem] font-[560]">
              {NAV.map((item) => (
                <li key={item.to}>
                  <AppLink
                    to={item.to}
                    aria-current={isActive(item.to) ? 'page' : undefined}
                    className={`link-draw py-1 transition-colors ${isActive(item.to) ? 'text-signal-ink' : 'hover:text-signal-ink'}`}
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <div data-header-fade className="flex items-center gap-5">
            <a href={`tel:${company.phoneHref}`} className="t-mono tabular hidden items-center gap-2 text-[0.85rem] xl:flex">
              <Phone aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              <span className="link-draw">{company.phone}</span>
            </a>
            <AppLink to="/yhteystiedot#tarjouspyynto" className="btn hidden !min-h-[2.75rem] text-[0.9rem] md:inline-flex">
              <span className="btn-label !px-4">Pyydä tarjous</span>
              <span className="btn-icon !w-[2.75rem]">
                <ArrowRight className="size-4" />
              </span>
            </AppLink>
            <button
              type="button"
              className="group -mr-2 flex h-11 items-center gap-3 px-2 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="t-label">{menuOpen ? 'Sulje' : 'Valikko'}</span>
              <span aria-hidden="true" className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 h-[2px] w-6 bg-ink transition-transform duration-500 ease-[var(--ease-out-expo)] ${menuOpen ? 'top-[5px] rotate-[-30deg]' : 'top-0'}`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-6 bg-ink transition-transform duration-500 ease-[var(--ease-out-expo)] ${menuOpen ? 'top-[5px] rotate-[30deg]' : 'top-[10px]'}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} isActive={isActive} />
    </>
  );
}

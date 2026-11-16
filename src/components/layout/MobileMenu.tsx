import { useEffect, useRef } from 'react';
import { company, regionalContacts } from '../../content/company';
import { gsap, motionOK } from '../../lib/motion';
import { AppLink } from './Navigation';
import { NAV } from './Header';
import { ArrowUpRight } from '../ui/Icons';

interface Props {
  open: boolean;
  onClose: () => void;
  isActive: (to: string) => boolean;
}

/**
 * Full-screen menu for < lg. The panel unrolls from the top like a sheet;
 * links rise course by course. The rest of the page is made `inert`
 * while open, so focus stays inside; Esc closes.
 */
export function MobileMenu({ open, onClose, isActive }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const others = document.querySelectorAll<HTMLElement>('#main, footer, [data-demo-notice]');
    others.forEach((n) => (n.inert = open));
    document.documentElement.style.overflow = open ? 'hidden' : '';

    const animate = motionOK() && !first.current;
    first.current = false;
    if (open) {
      el.style.visibility = 'visible';
      if (animate) {
        gsap
          .timeline()
          .fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.inOut' })
          .fromTo(el.querySelectorAll('[data-menu-item]'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.06, ease: 'power4.out' }, 0.25)
          .fromTo(el.querySelectorAll('[data-menu-fade]'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.5);
      } else gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' });
      el.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    } else if (animate) {
      gsap.to(el, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.55,
        ease: 'expo.inOut',
        onComplete: () => {
          el.style.visibility = 'hidden';
        },
      });
    } else {
      el.style.visibility = 'hidden';
    }

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      ref={panel}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Valikko"
      aria-hidden={!open}
      className="on-dark seams tex-granule fixed inset-0 z-40 flex flex-col overflow-y-auto pt-[calc(var(--header-h)+2rem)] lg:hidden"
      style={{ visibility: 'hidden', clipPath: 'inset(0% 0% 100% 0%)' }}
    >
      {/* The header stays on top (z-50) and keeps the close button reachable */}
      <nav aria-label="Mobiilivalikko" className="wrap flex-1">
        <ul className="border-t border-on-dark/15">
          {[{ to: '/', label: 'Etusivu' }, ...NAV].map((item, i) => (
            <li key={item.to} className="overflow-hidden border-b border-on-dark/15">
              <AppLink
                to={item.to}
                data-menu-item
                aria-current={isActive(item.to) && item.to !== '/' ? 'page' : undefined}
                className="group flex items-baseline justify-between py-4"
                onClick={onClose}
              >
                <span className="t-display text-[clamp(2.4rem,11vw,4rem)] group-aria-[current=page]:text-signal-bright">{item.label}</span>
                <span className="t-label text-on-dark-2">0{i + 1}</span>
              </AppLink>
            </li>
          ))}
        </ul>
      </nav>
      <div data-menu-fade className="wrap grid gap-6 py-10 sm:grid-cols-2">
        <AppLink to="/yhteystiedot#tarjouspyynto" className="btn w-full sm:col-span-2" onClick={onClose}>
          <span className="btn-label flex-1">Pyydä tarjous</span>
          <span className="btn-icon">
            <ArrowUpRight className="size-4" />
          </span>
        </AppLink>
        {Object.entries(regionalContacts).map(([region, p]) => (
          <div key={region}>
            <p className="t-label text-on-dark-2">{region === 'pohjois-karjala' ? 'Pohjois-Karjala' : 'Pohjois-Savo'}</p>
            <p className="mt-1 font-[600]">{p.name}</p>
            <a className="t-mono tabular link-line text-on-dark" href={`tel:${p.phoneHref}`}>
              {p.phone}
            </a>
          </div>
        ))}
        <p className="t-mono text-sm text-on-dark-2 sm:col-span-2">
          {company.name} · {company.address.street}, {company.address.postalCode} {company.address.city}
        </p>
      </div>
    </div>
  );
}

import { company, regionalContacts } from '../../content/company';
import { services } from '../../content/services';
import { Logo } from '../brand/Logo';
import { ArrowUp } from '../ui/Icons';
import { NAV } from './Header';
import { TLink } from './PageTransition';

const DEMO = import.meta.env.VITE_DEMO_MODE !== 'false';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark tex-granule relative overflow-hidden">
      {/* Roof silhouette in hairline across the top of the footer */}
      <svg aria-hidden="true" className="absolute inset-x-0 top-0 h-24 w-full text-on-dark/15" viewBox="0 0 1440 96" preserveAspectRatio="none">
        <polyline points="0,95 980,1 1440,58" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="wrap relative pt-28 pb-10">
        <div className="flex flex-col gap-10 border-b border-on-dark/15 pb-14 md:flex-row md:items-end md:justify-between">
          <TLink to="/" aria-label="Karjalan Mestarit Oy – etusivulle" className="block w-fit">
            <Logo variant="reverse" title="" className="h-auto w-56 md:w-72" />
          </TLink>
          <p className="t-display text-[clamp(2.6rem,7vw,6rem)] text-on-dark">
            {company.slogan.replace('!', '')}
            <span className="text-signal-bright">!</span>
          </p>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-label text-on-dark-2">Yhteystiedot</h2>
            <address className="mt-4 not-italic leading-relaxed">
              <strong className="font-[620]">{company.name}</strong>
              <br />
              {company.address.street}
              <br />
              {company.address.postalCode} {company.address.city}
            </address>
            <a href={`tel:${company.phoneHref}`} className="t-mono tabular link-line mt-4 inline-block text-lg">
              {company.phone}
            </a>
          </div>

          <div className="lg:col-span-3">
            <h2 className="t-label text-on-dark-2">Työpäälliköt</h2>
            <ul className="mt-4 space-y-4">
              {Object.entries(regionalContacts).map(([region, p]) => (
                <li key={region}>
                  <span className="block text-sm text-on-dark-2">{region === 'pohjois-karjala' ? 'Pohjois-Karjala' : 'Pohjois-Savo'}</span>
                  <span className="block font-[560]">{p.name}</span>
                  <a href={`tel:${p.phoneHref}`} className="t-mono tabular link-draw text-sm">
                    {p.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Palvelut" className="lg:col-span-3">
            <h2 className="t-label text-on-dark-2">Palvelut</h2>
            <ul className="mt-4 space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <TLink to={`/palvelut/${s.slug}`} className="link-draw">
                    {s.title}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Sivusto" className="lg:col-span-2">
            <h2 className="t-label text-on-dark-2">Sivusto</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <TLink to="/" className="link-draw">
                  Etusivu
                </TLink>
              </li>
              {NAV.map((n) => (
                <li key={n.to}>
                  <TLink to={n.to} className="link-draw">
                    {n.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="t-mono flex flex-col gap-4 border-t border-on-dark/15 pt-6 text-[0.8rem] text-on-dark-2 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {company.name} · Y-tunnus {company.businessId}
          </p>
          {DEMO && <p>Konseptidemo – ei yrityksen virallinen verkkosivusto.</p>}
          <button
            type="button"
            className="group inline-flex items-center gap-2 self-start text-on-dark md:self-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          >
            <span className="link-draw">Takaisin ylös</span>
            <ArrowUp className="size-4 transition-transform duration-500 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}

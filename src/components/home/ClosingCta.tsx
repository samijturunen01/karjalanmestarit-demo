import { Mail, Phone } from 'lucide-react';
import { company, regionalContacts } from '../../content/company';
import { AppLink } from '../layout/Navigation';
import { ArrowRight } from '../ui/Icons';

/** Closing call to action with the two regional site managers. */
export function ClosingCta({ index = '06' }: { index?: string }) {
  const regions = [
    { label: 'Pohjois-Karjala', person: regionalContacts['pohjois-karjala'] },
    { label: 'Pohjois-Savo', person: regionalContacts['pohjois-savo'] },
  ];
  return (
    <section aria-labelledby="cta-title" className="on-dark seams tex-granule relative isolate overflow-hidden py-[clamp(5rem,13vw,11rem)]">
      {/* Large gable outline drawn behind the headline */}
      <svg aria-hidden="true" data-reveal="draw" viewBox="0 0 600 420" className="absolute top-[8%] right-[-12%] -z-10 h-[90%] w-auto text-on-dark/12 lg:right-[-4%]">
        <path data-draw pathLength={1} d="M20 410V170L300 12L580 170V410" fill="none" stroke="currentColor" strokeWidth={0.8} />
        <path data-draw pathLength={1} d="M0 182L300 0L600 182" fill="none" stroke="var(--color-signal-bright)" strokeOpacity={0.45} strokeWidth={0.8} />
      </svg>

      <div className="wrap">
        <p data-reveal className="t-label flex gap-4">
          <span className="tabular text-signal-bright">{index}</span>
          <span>Yhteydenotto</span>
        </p>
        <h2 id="cta-title" data-reveal="split" className="t-display mt-8 max-w-[12ch] text-[clamp(3.2rem,9.6vw,9.5rem)]">
          Onko kattoprojekti suunnitteilla?
        </h2>
        <p data-reveal className="t-lead mt-8 max-w-[46ch] text-on-dark-2">
          Kerro kohteesta – soita oman alueesi työpäällikölle tai jätä tarjouspyyntö, niin palaamme asiaan.
        </p>

        <div className="mt-14 grid gap-px border border-on-dark/15 bg-on-dark/15 md:grid-cols-2 lg:w-[min(100%,56rem)]">
          {regions.map(({ label, person }) => (
            <div key={label} data-reveal className="bg-bitumen p-6 lg:p-8">
              <p className="t-label text-signal-bright">{label}</p>
              <p className="mt-6 text-[1.35rem] font-[650]">{person.name}</p>
              <p className="text-on-dark-2">{person.role}</p>
              <ul className="mt-6 space-y-2">
                <li>
                  <a href={`tel:${person.phoneHref}`} className="group inline-flex items-center gap-3">
                    <Phone aria-hidden="true" className="size-4 text-on-dark-2" strokeWidth={1.6} />
                    <span className="t-mono tabular link-draw text-[1.05rem]">{person.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${person.email}`} className="inline-flex items-center gap-3 break-all">
                    <Mail aria-hidden="true" className="size-4 shrink-0 text-on-dark-2" strokeWidth={1.6} />
                    <span className="link-draw text-[0.95rem]">{person.email}</span>
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <AppLink to="/yhteystiedot#tarjouspyynto" className="btn">
            <span className="btn-label">Pyydä tarjous</span>
            <span className="btn-icon">
              <ArrowRight className="size-4" />
            </span>
          </AppLink>
          <p className="text-on-dark-2">
            Toimitusjohtaja Petri Laitinen{' '}
            <a href={`tel:${company.phoneHref}`} className="t-mono tabular link-line ml-2 text-on-dark">
              {company.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

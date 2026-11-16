import { Mail, Phone } from 'lucide-react';
import { useParams } from 'react-router';
import { ServiceDrawing } from '../components/drawings/ServiceDrawing';
import { AppLink } from '../components/layout/Navigation';
import { ArrowRight } from '../components/ui/Icons';
import { PageHero } from '../components/ui/PageHero';
import { Picture } from '../components/ui/Picture';
import { SectionHead, TitleBlock } from '../components/ui/Section';
import { company, regionalContacts } from '../content/company';
import { serviceBySlug, services } from '../content/services';
import { NotFound } from './NotFound';

export function ServiceDetail() {
  const { slug } = useParams();
  const service = serviceBySlug(slug);
  if (!service) return <NotFound />;

  const i = services.indexOf(service);
  const prev = services[(i - 1 + services.length) % services.length];
  const next = services[(i + 1) % services.length];

  return (
    <article>
      <PageHero
        eyebrow={`Palvelu ${service.no}`}
        title={service.title}
        lead={<p>{service.lead}</p>}
        crumbs={[
          { to: '/palvelut', label: 'Palvelut' },
          { to: `/palvelut/${service.slug}`, label: service.title },
        ]}
      />

      <section aria-label="Palvelun kuvaus" className="pb-[clamp(4rem,9vw,8rem)]">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-x-10">
          <figure className="relative border border-ink/20 bg-paper-2/60 lg:col-span-7">
            <figcaption className="t-label absolute top-3 left-4 text-ink-3">Periaatekuva · ei mittakaavassa</figcaption>
            <div data-reveal="draw" className="p-6 pt-12 sm:p-12">
              <ServiceDrawing kind={service.drawing} className="h-auto w-full text-ink" title={`Periaatekuva: ${service.title}`} />
            </div>
          </figure>
          <div className="flex flex-col gap-8 lg:col-span-5">
            {service.body.map((p) => (
              <p key={p.slice(0, 24)} data-reveal className="text-[1.08rem] text-ink-2">
                {p}
              </p>
            ))}
            <TitleBlock
              label="Palvelun tiedot"
              className="text-ink"
              rows={[
                ['Palvelu', service.title],
                ['Alue', company.areas.join(' ja ')],
                ['Materiaalit', 'Katepal Oy:n tuotteet'],
                ['Asiakkaat', 'Yksityiset, taloyhtiöt, yritykset ja julkiset kohteet'],
              ]}
            />
            <AppLink data-reveal to="/yhteystiedot#tarjouspyynto" className="btn self-start">
              <span className="btn-label">Pyydä tarjous</span>
              <span className="btn-icon">
                <ArrowRight className="size-4" />
              </span>
            </AppLink>
          </div>
        </div>
      </section>

      {service.photo && (
        <div data-reveal="mask" className="relative h-[clamp(14rem,42vw,34rem)] overflow-hidden">
          <Picture photo={service.photo} sizes="100vw" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}

      <section aria-labelledby="knowledge-title" className="tex-paper bg-paper-2 py-[clamp(5rem,11vw,9rem)]">
        <div className="wrap">
          <SectionHead index="i" label="Yleistietoa" id="knowledge-title" title="Hyvä tietää" />
          <ul className="mt-12 grid gap-px border border-ink/20 bg-ink/20 md:grid-cols-3">
            {service.knowledge.map((k, n) => (
              <li key={k.title} data-reveal className="bg-paper-2 p-6 lg:p-8">
                <p className="t-label tabular text-signal-ink">0{n + 1}</p>
                <h3 className="t-h3 mt-6 text-[1.45rem]">{k.title}</h3>
                <p className="mt-3 text-ink-2">{k.text}</p>
              </li>
            ))}
          </ul>
          <p className="t-mono mt-6 text-[0.8rem] text-ink-3">
            Yleistä tietoa aiheesta – kohteen ratkaisut sovitaan aina tapauskohtaisesti.
          </p>
        </div>
      </section>

      <section aria-labelledby="ask-title" className="py-[clamp(5rem,11vw,9rem)]">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5">
            <h2 id="ask-title" data-reveal="split" className="t-h2 text-[clamp(2.2rem,4.4vw,4rem)]">
              Kysy kohteestasi.
            </h2>
            <p data-reveal className="mt-6 max-w-[40ch] text-ink-2">
              Työpäälliköt vastaavat omien alueidensa kohteista. Voit myös jättää tarjouspyynnön lomakkeella.
            </p>
          </div>
          <ul className="grid gap-px border border-ink/20 bg-ink/20 sm:grid-cols-2 lg:col-span-7">
            {(
              [
                ['Pohjois-Karjala', regionalContacts['pohjois-karjala']],
                ['Pohjois-Savo', regionalContacts['pohjois-savo']],
              ] as const
            ).map(([region, p]) => (
              <li key={region} data-reveal className="bg-paper p-6">
                <p className="t-label text-signal-ink">{region}</p>
                <p className="mt-5 text-[1.2rem] font-[650]">{p.name}</p>
                <p className="text-ink-3">{p.role}</p>
                <a href={`tel:${p.phoneHref}`} className="mt-5 flex items-center gap-3">
                  <Phone aria-hidden="true" className="size-4 text-ink-3" strokeWidth={1.6} />
                  <span className="t-mono tabular link-draw">{p.phone}</span>
                </a>
                <a href={`mailto:${p.email}`} className="mt-2 flex items-center gap-3 break-all">
                  <Mail aria-hidden="true" className="size-4 shrink-0 text-ink-3" strokeWidth={1.6} />
                  <span className="link-draw text-[0.92rem]">{p.email}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Prev / next */}
      <nav aria-label="Muut palvelut" className="on-dark seams tex-granule">
        <div className="wrap grid md:grid-cols-2">
          {[
            ['Edellinen palvelu', prev],
            ['Seuraava palvelu', next],
          ].map(([label, s], k) => {
            const svc = s as (typeof services)[number];
            return (
              <AppLink
                key={label as string}
                to={`/palvelut/${svc.slug}`}
                className={`group flex flex-col gap-6 py-12 md:py-16 ${k ? 'border-t border-on-dark/15 md:border-t-0 md:border-l md:pl-10 md:text-right' : 'md:pr-10'}`}
              >
                <span className="t-label text-on-dark-2">
                  {label as string} · {svc.no}
                </span>
                <span className="t-h2 text-[clamp(1.9rem,3.6vw,3.25rem)] transition-colors duration-300 group-hover:text-signal-bright">
                  {svc.title}
                </span>
              </AppLink>
            );
          })}
        </div>
      </nav>
    </article>
  );
}

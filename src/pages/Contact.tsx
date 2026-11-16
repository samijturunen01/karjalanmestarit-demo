import { Mail, MapPin, Phone } from 'lucide-react';
import { QuoteForm } from '../components/contact/QuoteForm';
import { ArrowUpRight } from '../components/ui/Icons';
import { PageHero } from '../components/ui/PageHero';
import { SectionHead, TitleBlock } from '../components/ui/Section';
import { company, contactGroups, invoicing } from '../content/company';
import { Fin } from '../components/ui/Fin';

export function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Yhteystiedot"
        title={
          <>
            Kerro <Fin>kohteesta</Fin>
          </>
        }
        lead={
          <p>
            Karjalan Mestarit palvelee Pohjois-Karjalassa ja Pohjois-Savossa. Lähetä tarjouspyyntö sähköpostilla tai lomakkeella – tai soita ja kysy
            lisää palveluistamme.
          </p>
        }
        crumbs={[{ to: '/yhteystiedot', label: 'Yhteystiedot' }]}
      />

      {/* People */}
      <section aria-labelledby="people-title" className="pb-[clamp(4rem,9vw,7rem)]">
        <div className="wrap">
          <h2 id="people-title" className="sr-only">
            Henkilöstö
          </h2>
          <div className="grid gap-px border border-ink/25 bg-ink/25 md:grid-cols-2">
            {contactGroups.flatMap((g) =>
              g.people.map((p) => (
                <div key={p.email} data-reveal className="flex flex-col bg-paper p-6 lg:p-7">
                  <p className="t-label text-signal-ink">{g.label}</p>
                  <p className="mt-8 text-[1.3rem] leading-tight font-[650]">{p.name}</p>
                  <p className="mt-1 text-ink-3">{p.role}</p>
                  <ul className="mt-auto space-y-2 pt-8">
                    <li>
                      <a href={`tel:${p.phoneHref}`} className="flex items-center gap-3" aria-label={`Soita: ${p.name}, ${p.phone}`}>
                        <Phone aria-hidden="true" className="size-4 text-ink-3" strokeWidth={1.6} />
                        <span className="t-mono tabular link-draw">{p.phone}</span>
                      </a>
                    </li>
                    <li>
                      <a href={`mailto:${p.email}`} className="flex items-center gap-3">
                        <Mail aria-hidden="true" className="size-4 shrink-0 text-ink-3" strokeWidth={1.6} />
                        <span className="link-draw text-[0.88rem] break-all">{p.email}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              )),
            )}
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section id="tarjouspyynto" aria-labelledby="form-title" className="scroll-mt-24 tex-paper bg-paper-2 py-[clamp(5rem,10vw,8rem)]">
        <div className="wrap">
          <SectionHead index="01" label="Tarjouspyyntö" id="form-title" title="Pyydä tarjous" />
          <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-8">
              <QuoteForm />
            </div>
            <aside aria-label="Osoite ja yritystiedot" className="flex flex-col gap-8 lg:col-span-4">
              <div data-reveal>
                <h3 className="t-label text-ink-3">Osoite</h3>
                <address className="mt-3 text-[1.1rem] leading-relaxed not-italic">
                  <strong className="font-[650]">{company.name}</strong>
                  <br />
                  {company.address.street}
                  <br />
                  {company.address.postalCode} {company.address.city}
                </address>
                <p className="t-mono mt-2 text-[0.78rem] text-ink-3">{company.address.note}.</p>
                <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="group mt-5 inline-flex items-center gap-2 font-[600]">
                  <MapPin aria-hidden="true" className="size-4" strokeWidth={1.6} />
                  <span className="link-line">Avaa kartalla</span>
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <span className="sr-only">(avautuu uuteen välilehteen)</span>
                </a>
              </div>
              <div data-reveal>
                <h3 className="t-label text-ink-3">Puhelin</h3>
                <a href={`tel:${company.phoneHref}`} className="t-mono tabular link-line mt-3 inline-block text-[1.3rem]">
                  {company.phone}
                </a>
              </div>
              <TitleBlock label="Yritystiedot" className="text-ink" rows={[['Y-tunnus', company.businessId], ['Kotipaikka', company.homeTown]]} />
            </aside>
          </div>
        </div>
      </section>

      {/* Invoicing – clearly separated from general contact details */}
      <section id="laskutus" aria-labelledby="billing-title" className="scroll-mt-24 py-[clamp(4rem,8vw,6rem)]">
        <div className="wrap">
          <div className="grid gap-10 border border-ink/25 p-6 sm:p-10 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-4">
              <p className="t-label text-signal-ink">Vain laskuille</p>
              <h2 id="billing-title" className="t-h3 mt-4 text-[clamp(1.6rem,2.6vw,2.2rem)]">
                Laskutustiedot
              </h2>
              <p className="mt-4 text-[0.95rem] text-ink-2">
                Nämä osoitteet on tarkoitettu ainoastaan laskuille. Tarjouspyynnöt ja muut yhteydenotot pyydämme osoittamaan yllä oleville henkilöille.
              </p>
            </div>
            <dl className="t-mono grid gap-x-10 gap-y-6 text-[0.88rem] sm:grid-cols-2 lg:col-span-8">
              <div>
                <dt className="t-label text-ink-3">Verkkolaskutusosoite</dt>
                <dd className="tabular mt-1">{invoicing.eInvoiceAddress}</dd>
              </div>
              <div>
                <dt className="t-label text-ink-3">Välittäjätunnus</dt>
                <dd className="tabular mt-1">{invoicing.intermediatorId}</dd>
              </div>
              <div>
                <dt className="t-label text-ink-3">Operaattori</dt>
                <dd className="mt-1">{invoicing.operator}</dd>
              </div>
              <div>
                <dt className="t-label text-ink-3">Sähköpostilaskut</dt>
                <dd className="mt-1 break-all">{invoicing.email}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="t-label text-ink-3">Laskutusosoite (paperilaskut)</dt>
                <dd className="mt-1">
                  {invoicing.postal.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}

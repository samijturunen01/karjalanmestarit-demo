import { ClosingCta } from '../components/home/ClosingCta';
import { TLink } from '../components/layout/PageTransition';
import { RefMap } from '../components/references/RefMap';
import { ArrowRight } from '../components/ui/Icons';
import { PageHero } from '../components/ui/PageHero';
import { Picture } from '../components/ui/Picture';
import { SectionHead, TitleBlock } from '../components/ui/Section';
import { company, contactGroups, copy } from '../content/company';
import { references } from '../content/references';
import { referenceStats } from '../lib/references';
import { GABLE } from '../components/home/Intro';
import { Fin } from '../components/ui/Fin';

const stats = referenceStats(references);

export function Company() {
  // On the original site everyone except the North Savo manager is listed under "Pohjois-Karjala"
  const people = contactGroups.flatMap((g) => g.people.map((p) => ({ ...p, area: g.id === 'pohjois-savo' ? 'Pohjois-Savo' : 'Pohjois-Karjala' })));
  return (
    <>
      <PageHero
        eyebrow="Yritys"
        title={
          <>
            Pohjois&shy;karjalaista vesikatto&shy;<Fin>urakointia</Fin>
          </>
        }
        lead={<p>{copy.intro}</p>}
        crumbs={[{ to: '/yritys', label: 'Yritys' }]}
      />

      <section aria-label="Perustiedot" className="pb-[clamp(5rem,10vw,8rem)]">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <p data-reveal className="t-h2 text-[clamp(2rem,4.2vw,3.75rem)]">
              ”{copy.approach}”
            </p>
            <p data-reveal className="mt-8 max-w-[60ch] text-[1.08rem] text-ink-2">
              {copy.customers} Referenssilistalla on {stats.count} kohdetta – kaupunkien, kuntien ja yritysten rakennuksia sekä asunto-osakeyhtiöitä.
            </p>
          </div>
          <div data-reveal className="lg:col-span-4 lg:col-start-9">
            <TitleBlock
              label="Yrityksen perustiedot"
              className="text-ink"
              rows={[
                ['Nimi', company.name],
                ['Y-tunnus', company.businessId],
                ['Kotipaikka', company.homeTown],
                ['Osoite', `${company.address.street}, ${company.address.postalCode} ${company.address.city}`],
                ['Toimiala', 'Vesikattotyöt'],
                ['Alue', company.areas.join(', ')],
                ['Omistaja', 'Katepal Oy (suurin omistaja)'],
                ['Rekisteröity', String(company.registered)],
              ]}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="katepal-title" className="on-dark seams tex-granule py-[clamp(5rem,11vw,9rem)]">
        <div className="wrap">
          <SectionHead index="01" label="Taustatuki" id="katepal-title" title={<>Valtakunnallista <Fin tone="bright">taustatukea</Fin></>} />
          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-5">
              <div data-reveal="mask" className="relative aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5]">
                <div className="absolute inset-0 overflow-hidden bg-bitumen-2" style={{ clipPath: GABLE }}>
                  <Picture photo="blackShingle" sizes="(min-width: 1024px) 38vw, 92vw" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-6 lg:col-span-6 lg:col-start-7">
              <p data-reveal className="t-lead">
                {copy.katepal}
              </p>
              <p data-reveal className="text-on-dark-2">
                {copy.katepalFinnish}
              </p>
              <p data-reveal className="text-on-dark-2">
                {copy.materials}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="people-title" className="py-[clamp(5rem,11vw,9rem)]">
        <div className="wrap">
          <SectionHead index="02" label="Henkilöstö" id="people-title" title="Ammattitaitoinen henkilökunta" />
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-5">
              <p data-reveal className="t-lead">
                {copy.staff}
              </p>
              <p data-reveal className="mt-6 text-ink-2">
                {copy.greyEconomy}
              </p>
            </div>
            <ul className="lg:col-span-6 lg:col-start-7">
              {people.map((p) => (
                <li key={p.email} data-reveal className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-t border-ink/20 py-5 last:border-b">
                  <span className="text-[1.25rem] font-[650]">{p.name}</span>
                  <span className="t-label text-right text-ink-3">{p.area}</span>
                  <span className="text-ink-2">{p.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <TLink data-reveal to="/yhteystiedot" className="group mt-12 inline-flex items-center gap-3 font-[620]">
            <span className="link-line">Henkilöstön yhteystiedot</span>
            <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </TLink>
        </div>
      </section>

      <section aria-labelledby="area-title" className="tex-paper bg-paper-2 py-[clamp(5rem,11vw,9rem)]">
        <div className="wrap">
          <SectionHead index="03" label="Toimialue" id="area-title" title={<>Pohjois-Karjala <span className="text-ink-3">ja</span> Pohjois-Savo.</>} />
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-4">
              <p data-reveal className="text-[1.08rem] text-ink-2">
                Kotipaikka on Joensuu. Pohjois-Karjalan kohteista vastaa työpäällikkö Petri Tarvainen ja Pohjois-Savon kohteista työpäällikkö Antero
                Liimatainen.
              </p>
              <p data-reveal className="mt-6 text-[1.08rem] text-ink-2">
                Kartalla näkyvät paikkakunnat, jotka mainitaan referenssilistan kohteiden nimissä.
              </p>
            </div>
            <figure data-reveal="draw" className="border border-ink/20 bg-paper/60 p-4 sm:p-8 lg:col-span-8">
              <RefMap data={stats.municipalities} className="h-auto w-full text-ink" />
            </figure>
          </div>
        </div>
      </section>

      <ClosingCta index="→" />
    </>
  );
}

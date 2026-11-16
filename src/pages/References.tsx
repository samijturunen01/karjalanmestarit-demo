import { ClosingCta } from '../components/home/ClosingCta';
import { Gallery } from '../components/references/Gallery';
import { RefMap } from '../components/references/RefMap';
import { ReferenceLedger } from '../components/references/ReferenceLedger';
import { PageHero } from '../components/ui/PageHero';
import { SectionHead } from '../components/ui/Section';
import { municipalityCoords, references } from '../content/references';
import { floorThousands, formatNumber, referenceStats } from '../lib/references';
import { Fin } from '../components/ui/Fin';

const stats = referenceStats(references);

export function References() {
  return (
    <>
      <PageHero
        eyebrow="Referenssit"
        title={
          <>
            Työn jälki näkyy <Fin>katoilla</Fin>
          </>
        }
        lead={
          <p>
            Referenssilistalla on {stats.count} kohdetta vuosilta {stats.firstYear}–{stats.lastYear}: kouluja, terveyskeskuksia, uimahalleja,
            teollisuuskiinteistöjä, vesitorneja ja asunto-osakeyhtiöitä.
          </p>
        }
        crumbs={[{ to: '/referenssit', label: 'Referenssit' }]}
      >
        <dl className="mt-14 grid grid-cols-2 border-t border-ink/25 md:grid-cols-4">
          {[
            [String(stats.byCategory.julkiset), 'kaupunkien, kuntien ja yritysten kohdetta'],
            [String(stats.byCategory.asunto), 'asunto-osakeyhtiötä'],
            [`${stats.byWork.saneeraus} / ${stats.byWork.uudis}`, 'saneerausta / uudiskohdetta'],
            [`${formatNumber(floorThousands(stats.knownArea))}+`, 'm² yhteensä'],
          ].map(([v, k], i) => (
            <div key={k} data-reveal className={`py-5 pr-4 ${i % 2 ? 'border-l border-ink/25 pl-4 md:pl-6' : ''} ${i === 2 ? 'md:border-l md:pl-6' : ''}`}>
              <dt className="sr-only">{k}</dt>
              <dd>
                <span className="t-display tabular block text-[clamp(2rem,4vw,3.4rem)]">{v}</span>
                <span className="mt-1 block text-[0.88rem] text-ink-2">{k}</span>
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section id="kuvat" aria-labelledby="photos-title" className="scroll-mt-24 pb-[clamp(5rem,10vw,8rem)]">
        <div className="wrap">
          <SectionHead index="01" label="Kuvat" id="photos-title" title="Kuvattuja kohteita" />
          <div className="mt-12">
            <Gallery />
          </div>
        </div>
      </section>

      <section id="lista" aria-labelledby="list-title" className="scroll-mt-24 tex-paper bg-paper-2 py-[clamp(5rem,10vw,8rem)]">
        <div className="wrap">
          <SectionHead
            index="02"
            label="Kohdeluettelo"
            id="list-title"
            title={
              <>
                {stats.count} kohdetta, <span className="text-ink-3">{stats.firstYear}–{stats.lastYear}.</span>
              </>
            }
          />
          <div className="mt-12">
            <ReferenceLedger />
          </div>
        </div>
      </section>

      <section aria-labelledby="map-title" className="py-[clamp(5rem,10vw,8rem)]">
        <div className="wrap">
          <SectionHead index="03" label="Paikkakunnat" id="map-title" title={<>Pohjois-Karjalasta Pohjois-Savoon<span className="text-ink-3"> – ja vähän kauempanakin.</span></>} />
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-x-10">
            <figure data-reveal="draw" className="border border-ink/20 bg-paper-2/50 p-4 sm:p-8 lg:col-span-8">
              <RefMap data={stats.municipalities} className="h-auto w-full text-ink" />
              <figcaption className="t-mono mt-4 text-[0.78rem] text-ink-3">
                Pisteet: paikkakunnat, jotka mainitaan referenssikohteen nimessä. Punainen = Pohjois-Karjala ja Pohjois-Savo. Sijainnit ovat
                kuntakeskuksia, eivät kohteiden osoitteita.
              </figcaption>
            </figure>
            <div className="lg:col-span-4">
              <h3 data-reveal className="t-label text-ink-3">
                Kohteita paikkakunnittain
              </h3>
              <ul className="mt-4">
                {stats.municipalities.map((m) => (
                  <li key={m.name} data-reveal className="flex items-baseline justify-between border-b border-ink/15 py-2.5">
                    <span className="font-[560]">{m.name}</span>
                    <span className="t-mono tabular text-sm text-ink-3">
                      {m.count} · {municipalityCoords[m.name].region}
                    </span>
                  </li>
                ))}
              </ul>
              <p data-reveal className="mt-6 text-sm text-ink-3">
                {references.length - stats.municipalities.reduce((s, m) => s + m.count, 0)} kohteen paikkakuntaa ei mainita listassa, joten niitä ei ole
                merkitty karttaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClosingCta index="→" />
    </>
  );
}

import { photographedProjects, references } from '../../content/references';
import { floorThousands, formatNumber, referenceStats } from '../../lib/references';
import { AppLink } from '../layout/Navigation';
import { ArrowRight } from '../ui/Icons';
import { Picture } from '../ui/Picture';
import { SectionHead } from '../ui/Section';

const stats = referenceStats(references);
const byName = (name: string) => references.find((r) => r.name === name);

/** Highlights chosen for scale and variety – all values straight from the reference list. */
const highlights = [
  {
    title: 'Stora Enso Wood Products, Kiteen saha',
    meta: '2015–2016 · Saneeraus · Vaiheet I ja II',
    area: (byName('Stora Enso Wood Products Oy Ltd, Kiteen saha, vaihe I')?.area ?? 0) + (byName('Stora Enso Wood Products Oy Ltd, Kiteen saha, vaihe II')?.area ?? 0),
  },
  { title: 'Juuan terveyskeskus', meta: '2013 · Saneeraus', area: byName('Juuan terveyskeskus')?.area ?? 0 },
  { title: 'Nepenmäen koulu', meta: '2017 · Uudisrakennus', area: byName('Nepenmäen koulu')?.area ?? 0 },
  { title: 'Joensuun oikeus- ja poliisitalo', meta: '2015 · Uudisrakennus', area: byName('Joensuun oikeus- ja poliisitalo')?.area ?? 0 },
  { title: 'Kolme vesitornia', meta: 'Viinijärvi 2014 · Kontiolahti ja Tuusniemi 2017 · Saneeraus', area: null },
];
const maxArea = Math.max(...highlights.map((h) => h.area ?? 0));

export function FeaturedReferences() {
  const [main, ...rest] = photographedProjects;
  return (
    <section aria-labelledby="refs-title" className="tex-paper relative bg-paper-2 py-[clamp(5rem,12vw,10rem)]">
      <div className="wrap">
        <SectionHead
          index="03"
          label="Referenssit"
          id="refs-title"
          title={
            <>
              Kouluista vesitorneihin. <span className="text-ink-3">Kerrostaloista sahoihin.</span>
            </>
          }
        />

        {/* Figures computed from the reference list */}
        <dl className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-2 border-t border-ink/20 lg:grid-cols-4">
          {[
            [String(stats.count), 'kohdetta referenssilistalla'],
            [`${stats.firstYear}–${String(stats.lastYear).slice(2)}`, 'listan kattamat vuodet'],
            [`yli ${formatNumber(floorThousands(stats.knownArea))}`, 'm² vesikattoja listan kohteissa'],
            [formatNumber(stats.largest.area ?? 0), `m² suurin yksittäinen kohde`],
          ].map(([v, k], i) => (
            <div
              key={k}
              data-reveal
              className={`border-b border-ink/20 py-6 pr-4 lg:border-b-0 lg:py-8 ${i % 2 ? 'border-l pl-4 sm:pl-6' : ''} ${i === 2 ? 'lg:border-l lg:pl-6' : ''}`}
            >
              <dt className="sr-only">{k}</dt>
              <dd>
                <span className="t-display tabular block text-[clamp(2.4rem,5.2vw,4.75rem)]">{v}</span>
                <span className="mt-2 block text-[0.9rem] text-ink-2">{k}</span>
              </dd>
            </div>
          ))}
        </dl>

        {/* Photographed projects */}
        <div className="mt-[clamp(3rem,7vw,6rem)] grid gap-6 md:grid-cols-12 md:gap-x-6">
          <figure className="group md:col-span-7">
            <AppLink to="/referenssit#kuvat" className="block" aria-label={`${main.name}, ${main.place} – katso kuvat`}>
              <div data-reveal="mask" className="relative aspect-[4/3] overflow-hidden bg-paper-3">
                <Picture
                  photo={main.photo}
                  sizes="(min-width: 768px) 56vw, 92vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
              </div>
            </AppLink>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink/25 pt-3">
              <span className="font-[620]">{main.name}</span>
              <span className="t-label text-ink-3">{main.place}</span>
            </figcaption>
          </figure>
          <div className="grid gap-6 md:col-span-5 md:grid-rows-2">
            {rest.map((p) => (
              <figure key={p.name} className="group flex flex-col">
                <AppLink to="/referenssit#kuvat" className="block flex-1" aria-label={`${p.name}${p.place ? `, ${p.place}` : ''} – katso kuvat`}>
                  <div data-reveal="mask" className="relative h-full min-h-56 overflow-hidden bg-paper-3">
                    <Picture
                      photo={p.photo}
                      sizes="(min-width: 768px) 40vw, 92vw"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    />
                  </div>
                </AppLink>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink/25 pt-3">
                  <span className="font-[620]">{p.name}</span>
                  {p.place && <span className="t-label text-ink-3">{p.place}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Scale – typographic rows */}
        <div className="mt-[clamp(4rem,8vw,7rem)] grid gap-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-3">
            <h3 data-reveal className="t-label">
              Mittakaavaa
            </h3>
            <p data-reveal className="mt-4 max-w-[30ch] text-ink-2">
              Poimintoja referenssilistalta: suuria julkisia ja teollisia kohteita sekä erikoiskohteita.
            </p>
          </div>
          <ul className="lg:col-span-9">
            {highlights.map((h) => (
              <li key={h.title} data-reveal className="group relative grid gap-x-6 gap-y-1 border-t border-ink/20 py-5 last:border-b sm:grid-cols-[1fr_auto] sm:items-baseline">
                <span className="t-h3 text-[clamp(1.3rem,2.4vw,2rem)]">{h.title}</span>
                <span className="t-mono tabular text-[clamp(1.05rem,1.6vw,1.35rem)] sm:text-right">{h.area ? `${formatNumber(h.area)} m²` : '3 kohdetta'}</span>
                <span className="text-[0.9rem] text-ink-3 sm:col-span-2">{h.meta}</span>
                {h.area ? (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-[-1px] left-0 h-[2px] origin-left bg-signal transition-transform duration-700 ease-[var(--ease-out-expo)] [transform:scaleX(0.04)] group-hover:[transform:scaleX(1)]"
                    style={{ width: `${(h.area / maxArea) * 100}%` }}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <AppLink data-reveal to="/referenssit" className="btn mt-14">
          <span className="btn-label">Kaikki {stats.count} referenssiä</span>
          <span className="btn-icon">
            <ArrowRight className="size-4" />
          </span>
        </AppLink>
      </div>
    </section>
  );
}

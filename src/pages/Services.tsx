import { ServiceDrawing } from '../components/drawings/ServiceDrawing';
import { ClosingCta } from '../components/home/ClosingCta';
import { AppLink } from '../components/layout/Navigation';
import { ArrowRight } from '../components/ui/Icons';
import { PageHero } from '../components/ui/PageHero';
import { Picture } from '../components/ui/Picture';
import { SectionHead } from '../components/ui/Section';
import { copy } from '../content/company';
import { services } from '../content/services';
import { Fin } from '../components/ui/Fin';

export function Services() {
  return (
    <>
      <PageHero
        eyebrow="Palvelut"
        title={
          <>
            Vedeneristeet ja bitumi&shy;<Fin>kermikatteet</Fin>
          </>
        }
        lead={<p>{copy.installs}</p>}
        crumbs={[{ to: '/palvelut', label: 'Palvelut' }]}
      />

      <section aria-label="Palvelut" className="pb-[clamp(5rem,12vw,10rem)]">
        <div className="wrap">
          <ol>
            {services.map((s, i) => (
              <li key={s.slug} className="border-t border-ink/20 py-[clamp(3rem,7vw,6rem)] last:border-b">
                <article className="grid gap-10 lg:grid-cols-12 lg:gap-x-10">
                  <div className={`lg:col-span-6 ${i % 2 ? 'lg:order-2 lg:col-start-7' : ''}`}>
                    <p data-reveal className="t-label tabular flex gap-4">
                      <span className="text-signal-ink">{s.no}</span>
                      <span className="text-ink-3">/ 0{services.length}</span>
                    </p>
                    <h2 data-reveal="split" className="t-h2 mt-6 text-[clamp(2.2rem,4.6vw,4.25rem)]">
                      {s.title}
                    </h2>
                    <p data-reveal className="t-lead mt-6 max-w-[44ch] text-ink-2">
                      {s.short}
                    </p>
                    <p data-reveal className="mt-5 max-w-[56ch] text-ink-2">
                      {s.lead}
                    </p>
                    <AppLink data-reveal to={`/palvelut/${s.slug}`} className="btn mt-9">
                      <span className="btn-label">Lue lisää</span>
                      <span className="btn-icon">
                        <ArrowRight className="size-4" />
                      </span>
                      <span className="sr-only">: {s.title}</span>
                    </AppLink>
                  </div>
                  <div className={`lg:col-span-6 ${i % 2 ? 'lg:order-1' : ''}`}>
                    <figure className="relative border border-ink/20 bg-paper-2/60">
                      <span aria-hidden="true" className="t-label absolute top-3 left-4 text-ink-3">
                        Periaatekuva
                      </span>
                      <div data-reveal="draw" className="p-6 pt-10 sm:p-10">
                        <ServiceDrawing kind={s.drawing} className="h-auto w-full text-ink" />
                      </div>
                      {s.photo && (
                        <div data-reveal="mask" className="relative aspect-[16/6] overflow-hidden border-t border-ink/20">
                          <Picture photo={s.photo} sizes="(min-width: 1024px) 46vw, 92vw" className="absolute inset-0 h-full w-full object-cover" />
                        </div>
                      )}
                    </figure>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="materials-title" className="tex-paper bg-paper-2 py-[clamp(5rem,11vw,9rem)]">
        <div className="wrap">
          <SectionHead
            index="—"
            label="Materiaalit"
            id="materials-title"
            title={
              <>
                Katepal <span className="text-ink-3">– kotimaiset kateaineet.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-x-10">
            <p data-reveal className="t-lead lg:col-span-6 lg:col-start-4">
              {copy.materials} {copy.katepal}
            </p>
            <p data-reveal className="text-ink-2 lg:col-span-3">
              {copy.katepalFinnish}
            </p>
          </div>
        </div>
      </section>

      <ClosingCta index="→" />
    </>
  );
}

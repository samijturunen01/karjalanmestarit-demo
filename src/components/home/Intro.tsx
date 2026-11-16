import { company, copy } from '../../content/company';
import { gsap, SplitText, useGsap } from '../../lib/motion';
import { TLink } from '../layout/PageTransition';
import { ArrowRight } from '../ui/Icons';
import { Picture } from '../ui/Picture';
import { SectionHead } from '../ui/Section';
import { Fin } from '../ui/Fin';

/** House-shaped frame (gable) used for editorial photos */
export const GABLE = 'polygon(50% 0%, 100% 26%, 100% 100%, 0% 100%, 0% 26%)';

export function Intro() {
  // The company's own principle fills in word by word as it scrolls past.
  const ref = useGsap<HTMLElement>(({ root, reduced }) => {
    if (reduced) return;
    const statement = root.querySelector<HTMLElement>('[data-statement]');
    if (!statement) return;
    const split = SplitText.create(statement, { type: 'words', wordsClass: 'inline-block' });
    gsap.fromTo(
      split.words,
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 },
      },
    );
    return () => split.revert();
  });

  return (
    <section ref={ref} aria-labelledby="intro-title" className="relative py-[clamp(5rem,12vw,10rem)]">
      <div className="wrap">
        <SectionHead index="01" label="Karjalan Mestarit" />
        <h2 id="intro-title" className="sr-only">
          Pohjoiskarjalaista vesikattourakointia
        </h2>
        <p data-statement className="t-h2 mt-10 max-w-[18ch] text-[clamp(2.4rem,6.4vw,6.4rem)] lg:mt-14 lg:ml-[25%]">
          Teemme katollesi sen, mitä tarvitset – ja vain sen, mitä <Fin>tarvitset</Fin>
        </p>

        <div className="mt-[clamp(4rem,9vw,8rem)] grid gap-14 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5">
            <div data-reveal="mask" className="relative aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5]">
              <div className="absolute inset-0 overflow-hidden bg-paper-3" style={{ clipPath: GABLE }}>
                <Picture photo="redShingleDormers" sizes="(min-width: 1024px) 40vw, 92vw" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end lg:col-span-6 lg:col-start-7">
            <h3 data-reveal className="t-label text-ink-3">
              Pohjoiskarjalaista vesikattourakointia
            </h3>
            <p data-reveal className="t-lead mt-6 max-w-[40ch]">
              {copy.intro}
            </p>
            <p data-reveal className="mt-6 max-w-[56ch] text-ink-2">
              {copy.customers} Työn laajuus määräytyy katon tarpeen mukaan – oli kyseessä kuntokartoitus, täydellinen kattoremontti tai vaativa
              uudiskohde.
            </p>

            <dl className="mt-12 grid border-t border-ink/20 sm:grid-cols-3">
              {[
                ['Asiakkaat', 'Yksityiset rakentajat, taloyhtiöt, rakennusliikkeet ja isännöitsijät'],
                ['Toimialue', company.areas.join(' ja ')],
                ['Materiaalit', 'Katepal Oy – suurin omistaja ja tavarantoimittaja'],
              ].map(([k, v]) => (
                <div key={k} data-reveal className="border-b border-ink/20 py-5 sm:border-b-0 sm:py-6 sm:pr-6 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-6">
                  <dt className="t-label text-signal-ink">{k}</dt>
                  <dd className="mt-3 text-[0.98rem] leading-snug font-[520]">{v}</dd>
                </div>
              ))}
            </dl>

            <TLink data-reveal to="/yritys" className="group mt-10 inline-flex items-center gap-3 self-start font-[620]">
              <span className="link-line">Lue lisää yrityksestä</span>
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </TLink>
          </div>
        </div>
      </div>
    </section>
  );
}

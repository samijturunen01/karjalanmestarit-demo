import { processSteps } from '../../content/services';
import { gsap, useGsap } from '../../lib/motion';
import { SectionHead } from '../ui/Section';

/**
 * How a roofing project usually proceeds, drawn as a roof pitch rising from
 * the eave (01) to the ridge (05). The pitch line draws with the scroll.
 * Explicitly a general description, not a documented company procedure.
 */
export function Process() {
  const ref = useGsap<HTMLElement>(({ root, reduced }) => {
    if (reduced) return;
    const line = root.querySelectorAll('[data-pitch-wrap]');
    const nodes = root.querySelectorAll('[data-node]');
    gsap.set(line, { clipPath: 'inset(0% 100% 0% 0%)' });
    gsap.set(nodes, { scale: 0, transformOrigin: '50% 50%' });
    // Plays once: the pitch rises from the eave (01) to the ridge (05), nodes pop as it passes
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector('[data-steps]'), start: 'top 75%', once: true } });
    tl.to(line, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1.8 }, 0);
    nodes.forEach((n, i) => tl.to(n, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, 0.1 + (i / (nodes.length - 1)) * 1.55));
  });

  return (
    <section ref={ref} aria-labelledby="process-title" className="tex-paper relative bg-paper-2 py-[clamp(5rem,12vw,10rem)]">
      <div className="wrap">
        <SectionHead
          index="05"
          label="Kattoprojektin kulku"
          id="process-title"
          title={
            <>
              Räystäältä harjalle <span className="text-ink-3">– näin kattoprojekti yleensä etenee.</span>
            </>
          }
        />

        <div data-steps className="relative mt-[clamp(3rem,7vw,6rem)]">
          {/* Desktop: rising pitch */}
          <svg aria-hidden="true" viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-x-0 top-0 hidden h-[12rem] w-full overflow-visible lg:block">
            <g data-pitch-wrap>
              <polyline points="0,200 1000,0" fill="none" stroke="var(--color-signal)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          <ol className="relative grid gap-0 lg:grid-cols-5 lg:gap-x-6">
            {processSteps.map((step, i) => (
              <li
                key={step.no}
                data-reveal
                className="relative border-l border-ink/20 pb-10 pl-8 last:pb-0 lg:border-l-0 lg:pt-[calc(var(--rise)+1.75rem)] lg:pb-0 lg:pl-0"
                style={{ ['--rise' as string]: `${(5 - i) * 2.4}rem` }}
              >
                <span
                  data-node
                  aria-hidden="true"
                  className="absolute top-1 -left-[7px] size-[13px] rotate-45 border-2 border-signal bg-paper-2 lg:top-[calc(var(--rise)-6.5px)] lg:-left-[6.5px]"
                />
                <p className="t-label tabular text-signal-ink">{step.no}</p>
                <h3 className="t-h3 mt-3 text-[1.55rem]">{step.title}</h3>
                <p className="mt-3 max-w-[32ch] text-[0.98rem] text-ink-2">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <p data-reveal className="t-mono mt-14 max-w-[70ch] text-[0.82rem] text-ink-3">
          Kuvaus on yleinen esimerkki kattoprojektin vaiheista. Jokaisen kohteen laajuus, aikataulu ja eteneminen sovitaan aina erikseen.
        </p>
      </div>
    </section>
  );
}

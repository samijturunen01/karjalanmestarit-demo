import { useCallback, useEffect, useRef, useState } from 'react';
import { company } from '../../content/company';
import { gsap, motionOK, SplitText, useIsoLayoutEffect } from '../../lib/motion';
import { AppLink } from '../layout/Navigation';
import { ArrowRight } from '../ui/Icons';
import { Picture } from '../ui/Picture';
import { IntroLogo } from './IntroLogo';

/** Roof silhouette of the photo band: eave left → ridge at 64 % → eave right */
const ROOF = 'polygon(0% 44%, 64% 0%, 100% 30%, 100% 100%, 0% 100%)';
const FLAT = 'polygon(0% 100%, 64% 100%, 100% 100%, 100% 100%, 0% 100%)';

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reveal = useRef<gsap.core.Timeline | null>(null);
  const [intro, setIntro] = useState(false);

  // Build the hero reveal (paused). Initial states are applied immediately by
  // fromTo, so the CSS pre-state classes can be dropped right after.
  useIsoLayoutEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el) return;
    if (!motionOK()) {
      html.classList.remove('hero-pending', 'intro-pending');
      return;
    }
    const q = gsap.utils.selector(el);
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      const title = q('[data-hero="title"]')[0];
      split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line', smartWrap: true });
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(q('[data-hero="roof"]'), { clipPath: FLAT }, { clipPath: ROOF, duration: 1.6, ease: 'expo.inOut' }, 0)
        .fromTo(q('[data-hero="roof"] img'), { scale: 1.28 }, { scale: 1, duration: 2.8, ease: 'power3.out' }, 0)
        .fromTo(q('[data-hero="ridge"]'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0.1)
        .fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.1)
        .fromTo(split.lines, { yPercent: 118 }, { yPercent: 0, duration: 1.25, ease: 'power4.out', stagger: 0.09 }, 0.12)
        .fromTo(q('[data-hero="fade"]'), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.5)
        .fromTo(q('[data-hero="annot"]'), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.1 }, 1.0)
        .fromTo(q('[data-hero="block"]'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 1.05);
      if (html.classList.contains('intro-pending')) {
        tl.fromTo(document.querySelectorAll('[data-header-fade]'), { opacity: 0 }, { opacity: 1, duration: 0.8, clearProps: 'opacity' }, 0.35);
      }
      reveal.current = tl;
    }, el);

    html.classList.remove('hero-pending');
    if (html.classList.contains('intro-pending')) setIntro(true);
    else reveal.current?.play();

    return () => {
      ctx.revert();
      split?.revert();
      reveal.current = null;
    };
  }, []);

  // Slow drift of the roof photo while the hero is on screen
  useEffect(() => {
    const el = root.current;
    if (!el || !motionOK()) return;
    const ctx = gsap.context(() => {
      gsap.to('[data-hero="roof"] picture', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const onFly = useCallback(() => reveal.current?.play(), []);
  const onDone = useCallback(() => {
    document.documentElement.classList.remove('intro-pending');
    try {
      sessionStorage.setItem('km-intro', '1');
    } catch {
      /* ignore */
    }
    setIntro(false);
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[var(--header-h)]">
      <div aria-hidden="true" className="drafting-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_20%,transparent_78%)]" />

      <div className="wrap relative flex flex-1 flex-col justify-center pt-6 pb-10 sm:pt-10 lg:pb-12">
        <p data-hero="fade" className="t-label flex items-center gap-3 text-signal-ink">
          <span aria-hidden="true" className="h-px w-10 bg-current" />
          {company.slogan}
        </p>

        <div className="mt-6 grid gap-y-8 lg:mt-8 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <h1 id="hero-title" data-hero="title" className="t-display text-[clamp(3.4rem,10vw,9.25rem)] lg:col-span-8">
            Vesikatot räystäältä harjalle.
          </h1>
          <div className="lg:col-span-4 lg:pb-[0.6vw]">
            <p data-hero="fade" className="t-lead max-w-[36ch] text-ink-2">
              Karjalan Mestarit tekee katollesi sen, mitä tarvitset – ja vain sen, mitä tarvitset. Kuntokartoituksista kattoremontteihin ja
              vaativiin uudiskohteisiin.
            </p>
            <div data-hero="fade" className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
              <AppLink to="/yhteystiedot#tarjouspyynto" className="btn">
                <span className="btn-label">Pyydä tarjous</span>
                <span className="btn-icon">
                  <ArrowRight className="size-4" />
                </span>
              </AppLink>
              <AppLink to="/referenssit" className="link-line font-[620]">
                Tutustu referensseihin
              </AppLink>
            </div>
          </div>
        </div>
      </div>

      {/* Roof band */}
      <div className="relative h-[clamp(14rem,36vh,26rem)]">
        <div data-hero="roof" className="roof-shape absolute inset-0 overflow-hidden bg-bitumen">
          <Picture
            photo="redShingleFlashing"
            sizes="100vw"
            priority
            className="absolute inset-0 h-[115%] w-full -translate-y-[8%] object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(19_18_17/0.25),transparent_45%,rgb(19_18_17/0.35))]" />
        </div>

        {/* Ridge annotation – drawn like a construction drawing */}
        <svg
          aria-hidden="true"
          data-hero="ridge"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <polyline points="0,44 64,0 100,30" fill="none" stroke="#161514" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </svg>
        <span data-hero="annot" aria-hidden="true" className="t-label absolute top-[44%] left-[var(--gutter)] hidden -translate-y-[calc(100%+0.6rem)] text-ink-3 lg:block">
          Räystäs
        </span>
        <span data-hero="annot" aria-hidden="true" className="t-label absolute top-0 left-[64%] -translate-x-1/2 -translate-y-[calc(100%+0.6rem)] text-ink-3">
          <span className="mx-auto mb-1 block h-2 w-px bg-current" />
          Harja
        </span>
        <span data-hero="annot" aria-hidden="true" className="t-label absolute top-[20%] left-[33%] hidden -translate-y-full rotate-[-10deg] text-ink-3 md:block">
          Lape
        </span>

        {/* Title block (nimiö) – bottom-right corner of the "drawing sheet" */}
        <dl
          data-hero="block"
          className="t-mono absolute right-[var(--gutter)] bottom-[var(--gutter)] hidden w-[22rem] grid-cols-[7rem_1fr] border border-ink/80 bg-paper text-[0.74rem] leading-snug lg:grid"
        >
          {[
            ['Toimiala', 'Vesikattourakointi'],
            ['Alue', company.areas.join(' · ')],
            ['Materiaalit', 'Katepal Oy'],
            ['Puhelin', company.phone],
          ].map(([k, v], i) => (
            <div key={k} className={`contents ${i ? '[&>*]:border-t [&>*]:border-ink/25' : ''}`}>
              <dt className="border-r border-ink/25 px-3 py-2 tracking-[0.1em] text-ink-3 uppercase">{k}</dt>
              <dd className="px-3 py-2 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {intro && <IntroLogo onFly={onFly} onDone={onDone} />}
    </section>
  );
}

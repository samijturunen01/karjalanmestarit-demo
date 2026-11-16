import { useEffect, useRef, useState } from 'react';
import { services } from '../../content/services';
import { gsap, motionOK } from '../../lib/motion';
import { ServiceDrawing } from '../drawings/ServiceDrawing';
import { AppLink } from '../layout/Navigation';
import { ArrowRight, ArrowUpRight } from '../ui/Icons';
import { SectionHead } from '../ui/Section';

export function ServicesIndex() {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Swap the technical drawing: old one lifts away, new one draws in.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('[data-panel-item]');
    items.forEach((item, i) => {
      const on = i === active;
      item.setAttribute('aria-hidden', String(!on));
      if (!motionOK() || first.current) {
        gsap.set(item, { autoAlpha: on ? 1 : 0 });
        return;
      }
      if (on) {
        gsap.set(item, { autoAlpha: 1 });
        gsap.fromTo(item.querySelectorAll('[data-draw]'), { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.025, overwrite: true });
        gsap.fromTo(item.querySelectorAll('[data-fill]'), { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.55, stagger: 0.03, overwrite: true });
        gsap.fromTo(item.querySelectorAll('[data-panel-text]'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
      } else {
        gsap.to(item, { autoAlpha: 0, duration: 0.25, overwrite: true });
      }
    });
    first.current = false;
  }, [active]);

  return (
    <section aria-labelledby="services-title" className="on-dark seams tex-granule relative overflow-hidden py-[clamp(5rem,12vw,10rem)]">
      <div className="wrap">
        <SectionHead
          index="02"
          label="Palvelut"
          id="services-title"
          title={
            <>
              Vedeneristeet, kermikatot <span className="text-on-dark-2">ja kaikki, mitä katolla tarvitaan.</span>
            </>
          }
        />

        <div className="mt-[clamp(3rem,7vw,6rem)] grid gap-12 lg:grid-cols-12 lg:gap-x-10">
          <ol className="lg:col-span-7">
            {services.map((s, i) => (
              <li key={s.slug} data-reveal className="border-t border-on-dark/15 last:border-b">
                <AppLink
                  to={`/palvelut/${s.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group grid grid-cols-[2.75rem_1fr_auto] items-baseline gap-x-3 py-6 sm:grid-cols-[4rem_1fr_auto] lg:py-7"
                >
                  <span
                    className={`t-mono tabular text-sm transition-colors duration-300 ${i === active ? 'text-signal-bright' : 'text-on-dark-2'} group-hover:text-signal-bright`}
                  >
                    {s.no}
                  </span>
                  <span className="t-h3 text-[clamp(1.55rem,3.3vw,2.9rem)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-focus-visible:translate-x-2">
                    {s.title}
                  </span>
                  <ArrowUpRight className="size-5 self-center text-on-dark-2 transition-all duration-500 group-hover:rotate-45 group-hover:text-signal-bright" />
                  <span className="col-start-2 mt-2 max-w-[48ch] text-[0.95rem] text-on-dark-2 lg:hidden">{s.short}</span>
                </AppLink>
              </li>
            ))}
          </ol>

          {/* Drawing panel (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div ref={panel} data-reveal="draw" className="sticky top-28 aspect-[480/470] border border-on-dark/15 bg-bitumen-2/60">
              <span aria-hidden="true" className="t-label absolute top-3 left-4 text-on-dark-2">
                Leikkaus · ei mittakaavassa
              </span>
              {services.map((s, i) => (
                <div key={s.slug} data-panel-item className="absolute inset-0 flex flex-col p-6 pt-10" style={{ opacity: i === 0 ? 1 : 0 }}>
                  <ServiceDrawing kind={s.drawing} accent="var(--color-signal-bright)" className="h-auto w-full flex-1 text-on-dark" />
                  <div data-panel-text className="mt-4 border-t border-on-dark/15 pt-4">
                    <p className="t-label text-signal-bright">{s.no}</p>
                    <p className="mt-2 text-[0.95rem] text-on-dark-2">{s.short}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AppLink data-reveal to="/palvelut" className="btn btn-on-dark mt-14">
          <span className="btn-label">Kaikki palvelut</span>
          <span className="btn-icon">
            <ArrowRight className="size-4" />
          </span>
        </AppLink>
      </div>
    </section>
  );
}

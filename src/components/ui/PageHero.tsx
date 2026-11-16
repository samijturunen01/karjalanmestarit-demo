import type { ReactNode } from 'react';
import { TLink } from '../layout/PageTransition';

interface Crumb {
  to: string;
  label: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  aside?: ReactNode;
  children?: ReactNode;
}

/** Hero for sub-pages: drawing-sheet grid, breadcrumb, oversized title, roof-pitch hairline. */
export function PageHero({ eyebrow, title, lead, crumbs = [], aside, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pt-[calc(var(--header-h)+clamp(2.5rem,7vw,6rem))] pb-[clamp(5rem,9vw,8rem)]">
      <div aria-hidden="true" className="drafting-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000,transparent_90%)]" />
      <svg
        aria-hidden="true"
        data-reveal="wipe"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 -z-10 h-[clamp(2.5rem,5vw,4.5rem)] w-full text-ink/25"
      >
        <polyline points="0,119 920,1 1440,80" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="wrap">
        <nav aria-label="Murupolku" data-reveal className="t-label flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-3">
          <TLink to="/" className="link-draw">
            Etusivu
          </TLink>
          {crumbs.map((c) => (
            <span key={c.to} className="flex items-center gap-3">
              <span aria-hidden="true">/</span>
              <TLink to={c.to} className="link-draw">
                {c.label}
              </TLink>
            </span>
          ))}
        </nav>
        <div className="mt-10 grid gap-y-10 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <div className="lg:col-span-8">
            <p data-reveal className="t-label flex items-center gap-3 text-signal-ink">
              <span aria-hidden="true" className="h-px w-10 bg-current" />
              {eyebrow}
            </p>
            <h1 data-reveal="split" className="t-display mt-6 text-[clamp(3rem,9vw,8.5rem)]">
              {title}
            </h1>
          </div>
          {(lead || aside) && (
            <div className="lg:col-span-4">
              {lead && (
                <div data-reveal className="t-lead text-ink-2">
                  {lead}
                </div>
              )}
              {aside}
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

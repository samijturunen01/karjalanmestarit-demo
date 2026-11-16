import type { ReactNode } from 'react';

interface SectionHeadProps {
  index: string;
  label: string;
  title?: ReactNode;
  id?: string;
  /** Extra content to the right of / below the title (lead text, links) */
  aside?: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}

/** Section heading: hairline rule, index + mono label, oversized title. */
export function SectionHead({ index, label, title, id, aside, as: H = 'h2', className = '' }: SectionHeadProps) {
  return (
    <div className={className}>
      <div data-reveal="rule" className="rule" />
      <div className="mt-5 grid gap-y-6 lg:grid-cols-12 lg:gap-x-10">
        <p data-reveal className="t-label flex gap-4 lg:col-span-3">
          <span className="tabular text-signal-ink [.on-dark_&]:text-signal-bright">{index}</span>
          <span>{label}</span>
        </p>
        {title && (
          <H id={id} data-reveal="split" className="t-h2 text-[clamp(2.3rem,5.4vw,5.25rem)] lg:col-span-9">
            {title}
          </H>
        )}
        {aside && <div className="lg:col-span-9 lg:col-start-4">{aside}</div>}
      </div>
    </div>
  );
}

/** Title block ("nimiö") – the information box in the corner of a drawing sheet. */
export function TitleBlock({ rows, className = '', label }: { rows: [string, ReactNode][]; className?: string; label?: string }) {
  return (
    <dl aria-label={label} className={`t-mono grid grid-cols-[minmax(6.5rem,auto)_1fr] border border-current/60 text-[0.78rem] leading-snug ${className}`}>
      {rows.map(([k, v], i) => (
        <div key={k} className="contents">
          <dt className={`border-r border-current/20 px-3 py-2.5 tracking-[0.1em] uppercase opacity-70 ${i ? 'border-t' : ''}`}>{k}</dt>
          <dd className={`border-current/20 px-3 py-2.5 ${i ? 'border-t' : ''}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

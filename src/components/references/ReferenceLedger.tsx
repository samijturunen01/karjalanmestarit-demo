import { useEffect, useMemo, useRef, useState } from 'react';
import { categoryLabels, references, workLabels, type RefCategory, type RefWork } from '../../content/references';
import { defaultFilter, filterReferences, filterToParams, formatArea, parseFilter, sortReferences, type RefFilter, type SortKey } from '../../lib/references';
import { Flip } from 'gsap/Flip';
import { gsap, isBrowser, motionOK, useIsoLayoutEffect } from '../../lib/motion';

// Flip is only needed here, so it lives in this page's chunk
if (isBrowser) gsap.registerPlugin(Flip);

const YEARS = [...new Set(references.map((r) => r.year))].sort((a, b) => a - b);
const MAX_AREA = Math.max(...references.map((r) => r.area ?? 0));

type Option<T> = { value: T; label: string; count?: number };

function count(f: Partial<RefFilter>) {
  return filterReferences(references, { ...defaultFilter, ...f }).length;
}

/**
 * Filterable reference ledger. All rows stay in the DOM and filtered-out rows
 * are hidden, so GSAP Flip can animate rows in, out and into their new order.
 * Filter state is mirrored to the URL (?kategoria=…&tyo=…&vuosi=…&jarjestys=…).
 */
export function ReferenceLedger() {
  const [filter, setFilter] = useState<RefFilter>(defaultFilter);
  const list = useRef<HTMLOListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  // Read the URL after hydration (prerendered HTML always shows the full list)
  useEffect(() => {
    const parsed = parseFilter(new URLSearchParams(window.location.search), YEARS);
    // Deliberately after hydration: the prerendered HTML always shows the full list
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (JSON.stringify(parsed) !== JSON.stringify(defaultFilter)) setFilter(parsed);
  }, []);

  const visible = useMemo(() => new Set(filterReferences(references, filter).map((r) => r.id)), [filter]);
  const ordered = useMemo(() => sortReferences(references, filter.sort), [filter.sort]);

  const update = (patch: Partial<RefFilter>) => {
    if (list.current && motionOK()) flipState.current = Flip.getState(list.current.querySelectorAll('[data-ref-row]'));
    const next = { ...filter, ...patch };
    setFilter(next);
    const qs = filterToParams(next).toString();
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`);
  };

  useIsoLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !list.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: list.current.querySelectorAll('[data-ref-row]'),
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      stagger: 0.008,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2, stagger: 0.012 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.25 }),
    });
  }, [filter]);

  const categoryOpts: Option<RefCategory | 'kaikki'>[] = [
    { value: 'kaikki', label: 'Kaikki', count: references.length },
    ...(Object.keys(categoryLabels) as RefCategory[]).map((c) => ({ value: c, label: categoryLabels[c], count: count({ category: c }) })),
  ];
  const workOpts: Option<RefWork | 'kaikki'>[] = [
    { value: 'kaikki', label: 'Kaikki' },
    ...(Object.keys(workLabels) as RefWork[]).map((w) => ({ value: w, label: workLabels[w], count: count({ work: w }) })),
  ];
  const yearOpts: Option<number | 'kaikki'>[] = [{ value: 'kaikki', label: 'Kaikki' }, ...YEARS.map((y) => ({ value: y, label: String(y), count: count({ year: y }) }))];
  const sortOpts: Option<SortKey>[] = [
    { value: 'uusimmat', label: 'Uusimmat' },
    { value: 'suurimmat', label: 'Suurimmat' },
    { value: 'aakkoset', label: 'A–Ö' },
  ];

  const hasFootnote = references.some((r) => r.areaLabel);

  return (
    <div>
      <div className="grid gap-x-10 gap-y-6 border-y border-ink/20 py-6 lg:grid-cols-[1.4fr_1fr]">
        <Chips legend="Kohdetyyppi" name="kategoria" options={categoryOpts} value={filter.category} onChange={(v) => update({ category: v })} />
        <Chips legend="Työ" name="tyo" options={workOpts} value={filter.work} onChange={(v) => update({ work: v })} />
        <Chips legend="Vuosi" name="vuosi" options={yearOpts} value={filter.year} onChange={(v) => update({ year: v })} />
        <Chips legend="Järjestys" name="jarjestys" options={sortOpts} value={filter.sort} onChange={(v) => update({ sort: v })} />
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
        <p className="t-mono text-sm" aria-live="polite" aria-atomic="true">
          Näytetään <strong className="tabular font-[600]">{visible.size}</strong> / {references.length} kohdetta
        </p>
        {visible.size !== references.length && (
          <button type="button" className="t-label link-line" onClick={() => update({ category: 'kaikki', work: 'kaikki', year: 'kaikki' })}>
            Tyhjennä rajaukset
          </button>
        )}
      </div>

      <div className="t-label mt-6 hidden grid-cols-[4.5rem_1fr_9rem_7.5rem] gap-x-6 border-b border-ink pb-3 text-ink-3 md:grid" aria-hidden="true">
        <span>Vuosi</span>
        <span>Kohde</span>
        <span>Työ</span>
        <span className="text-right">Ala</span>
      </div>
      <ol ref={list} className="relative">
        {ordered.map((r) => (
          <li
            key={r.id}
            data-ref-row
            data-flip-id={r.id}
            hidden={!visible.has(r.id)}
            className="group relative grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-ink/15 py-4 md:grid-cols-[4.5rem_1fr_9rem_7.5rem] md:items-baseline md:py-5"
          >
            <span className="t-mono tabular text-sm text-ink-3 md:text-base md:text-ink">
              {r.year}
              <span className="md:hidden"> · {workLabels[r.work]}</span>
            </span>
            <span className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto">
              <span className="block text-[1.06rem] leading-snug font-[600]">{r.name}</span>
              <span className="mt-0.5 block text-[0.85rem] text-ink-3">
                {categoryLabels[r.category]}
                {r.municipality ? ` · ${r.municipality}` : ''}
              </span>
            </span>
            <span className="hidden text-[0.95rem] text-ink-2 md:block">{workLabels[r.work]}</span>
            <span className="t-mono tabular row-start-1 text-right md:row-start-auto">{formatArea(r)}</span>
            {r.area ? (
              <span
                aria-hidden="true"
                className="absolute bottom-[-1px] left-0 h-[2px] origin-left bg-signal/80 transition-transform duration-700 ease-[var(--ease-out-expo)] [transform:scaleX(0.35)] group-hover:[transform:scaleX(1)]"
                style={{ width: `${(r.area / MAX_AREA) * 100}%` }}
              />
            ) : null}
          </li>
        ))}
      </ol>
      {visible.size === 0 && <p className="py-10 text-ink-2">Valinnoilla ei löytynyt kohteita. Kokeile väljempää rajausta.</p>}

      {hasFootnote && (
        <p className="t-mono mt-6 max-w-[80ch] text-[0.8rem] text-ink-3">
          * Alkuperäisen listan merkintä ”Hoitokoti Helmi 2 300 m2” on tulkittu alaksi 2 300 m². Tieto tarkistetaan yritykseltä; kohde ei ole mukana
          yhteenlasketussa alassa.
        </p>
      )}
    </div>
  );
}

function Chips<T extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="t-label mb-3 text-ink-3">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          const checked = o.value === value;
          return (
            <label
              key={id}
              htmlFor={id}
              className={`relative inline-flex min-h-10 cursor-pointer items-center gap-2 border px-3.5 text-[0.9rem] font-[540] transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal ${
                checked ? 'border-ink bg-ink text-paper' : 'border-ink/25 hover:border-ink'
              }`}
            >
              <input id={id} type="radio" name={name} className="sr-only" checked={checked} onChange={() => onChange(o.value)} />
              {o.label}
              {o.count !== undefined && <span className={`t-mono tabular text-[0.75rem] ${checked ? 'text-paper/70' : 'text-ink-3'}`}>{o.count}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

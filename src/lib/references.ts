import type { Municipality, RefCategory, RefWork, Reference } from '../content/references';

export type SortKey = 'uusimmat' | 'suurimmat' | 'aakkoset';

export interface RefFilter {
  category: RefCategory | 'kaikki';
  work: RefWork | 'kaikki';
  year: number | 'kaikki';
  sort: SortKey;
}

export const defaultFilter: RefFilter = { category: 'kaikki', work: 'kaikki', year: 'kaikki', sort: 'uusimmat' };

const collator = new Intl.Collator('fi');

export function filterReferences(list: Reference[], f: RefFilter): Reference[] {
  const out = list.filter(
    (r) =>
      (f.category === 'kaikki' || r.category === f.category) &&
      (f.work === 'kaikki' || r.work === f.work) &&
      (f.year === 'kaikki' || r.year === f.year),
  );
  return sortReferences(out, f.sort);
}

export function sortReferences(list: Reference[], sort: SortKey): Reference[] {
  const copy = [...list];
  if (sort === 'suurimmat') copy.sort((a, b) => (b.area ?? -1) - (a.area ?? -1) || collator.compare(a.name, b.name));
  else if (sort === 'aakkoset') copy.sort((a, b) => collator.compare(a.name, b.name));
  else copy.sort((a, b) => b.year - a.year || collator.compare(a.name, b.name));
  return copy;
}

/** Parse URL search params (?kategoria=asunto&tyo=uudis&vuosi=2016&jarjestys=suurimmat) safely. */
export function parseFilter(params: URLSearchParams, years: number[]): RefFilter {
  const c = params.get('kategoria');
  const w = params.get('tyo');
  const y = Number(params.get('vuosi'));
  const s = params.get('jarjestys');
  return {
    category: c === 'julkiset' || c === 'asunto' ? c : 'kaikki',
    work: w === 'saneeraus' || w === 'uudis' ? w : 'kaikki',
    year: years.includes(y) ? y : 'kaikki',
    sort: s === 'suurimmat' || s === 'aakkoset' ? s : 'uusimmat',
  };
}

export function filterToParams(f: RefFilter): URLSearchParams {
  const p = new URLSearchParams();
  if (f.category !== 'kaikki') p.set('kategoria', f.category);
  if (f.work !== 'kaikki') p.set('tyo', f.work);
  if (f.year !== 'kaikki') p.set('vuosi', String(f.year));
  if (f.sort !== 'uusimmat') p.set('jarjestys', f.sort);
  return p;
}

export interface RefStats {
  count: number;
  firstYear: number;
  lastYear: number;
  years: number[];
  /** Sum of unambiguous areas only */
  knownArea: number;
  byCategory: Record<RefCategory, number>;
  byWork: Record<RefWork, number>;
  largest: Reference;
  municipalities: { name: Municipality; count: number }[];
}

export function referenceStats(list: Reference[]): RefStats {
  const years = [...new Set(list.map((r) => r.year))].sort((a, b) => a - b);
  const byMunicipality = new Map<Municipality, number>();
  for (const r of list) if (r.municipality) byMunicipality.set(r.municipality, (byMunicipality.get(r.municipality) ?? 0) + 1);
  return {
    count: list.length,
    firstYear: years[0],
    lastYear: years[years.length - 1],
    years,
    knownArea: list.reduce((sum, r) => sum + (r.area ?? 0), 0),
    byCategory: {
      julkiset: list.filter((r) => r.category === 'julkiset').length,
      asunto: list.filter((r) => r.category === 'asunto').length,
    },
    byWork: {
      saneeraus: list.filter((r) => r.work === 'saneeraus').length,
      uudis: list.filter((r) => r.work === 'uudis').length,
    },
    largest: list.reduce((a, b) => ((b.area ?? 0) > (a.area ?? 0) ? b : a)),
    municipalities: [...byMunicipality.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || collator.compare(a.name, b.name)),
  };
}

/** "yli 120 000" style floor to the nearest thousand – never overstates. */
export function floorThousands(n: number): number {
  return Math.floor(n / 1000) * 1000;
}

const nf = new Intl.NumberFormat('fi-FI');
/** Finnish number formatting with a regular (breaking-safe) narrow no-break space. */
export function formatNumber(n: number): string {
  return nf.format(n).replace(/\s/g, ' ');
}

export function formatArea(r: Pick<Reference, 'area' | 'areaLabel'>): string {
  if (r.areaLabel) return r.areaLabel;
  return r.area === null ? '–' : `${formatNumber(r.area)} m²`;
}

import { describe, expect, it } from 'vitest';
import { references } from '../content/references';
import { defaultFilter, filterReferences, filterToParams, floorThousands, formatArea, parseFilter, referenceStats } from './references';

const YEARS = [2013, 2014, 2015, 2016, 2017];

describe('reference list (transcribed from karjalanmestarit.fi/referenssit-2/)', () => {
  it('has every project from the source: 31 + 15', () => {
    const stats = referenceStats(references);
    expect(stats.count).toBe(46);
    expect(stats.byCategory).toEqual({ julkiset: 31, asunto: 15 });
    expect(stats.firstYear).toBe(2013);
    expect(stats.lastYear).toBe(2017);
  });

  it('keeps ids unique and the verbatim source line on every row', () => {
    expect(new Set(references.map((r) => r.id)).size).toBe(references.length);
    for (const r of references) {
      expect(r.source).toMatch(new RegExp(`^${r.year}, `));
      // area in the source line matches the parsed area (when unambiguous)
      if (r.area !== null) expect(r.source.replace(/\s/g, '')).toContain(`${r.area}m2`);
    }
  });

  it('sums only unambiguous areas and never overstates', () => {
    const stats = referenceStats(references);
    expect(stats.knownArea).toBe(109_900);
    expect(floorThousands(stats.knownArea)).toBe(109_000);
    expect(stats.largest.area).toBe(13_500);
  });

  it('flags the ambiguous "Hoitokoti Helmi 2 300 m2" entry instead of guessing silently', () => {
    const helmi = references.find((r) => r.name === 'Hoitokoti Helmi');
    expect(helmi?.area).toBeNull();
    expect(helmi?.note).toMatch(/tarkistettava/);
    expect(formatArea(helmi!)).toBe('2 300 m²*');
  });

  it('only places projects on the map when the name states the place', () => {
    for (const r of references.filter((x) => x.municipality)) {
      const stem = r.municipality!.slice(0, 4).toLowerCase();
      const districts = ['noljak', 'rantakylä', 'siilai', 'nepenmä', 'marjala', 'hammaslah', 'uimaharju', 'lehmo', 'viinijär', 'juua', 'kitee', 'kontiolah', 'tuusniem', 'kuopio'];
      const text = r.source.toLowerCase();
      expect(text.includes(stem) || districts.some((d) => text.includes(d)), r.name).toBe(true);
    }
  });
});

describe('filtering and sorting', () => {
  it('filters by category, work and year', () => {
    expect(filterReferences(references, { ...defaultFilter, category: 'asunto' })).toHaveLength(15);
    const uudis2017 = filterReferences(references, { ...defaultFilter, work: 'uudis', year: 2017 });
    expect(uudis2017.map((r) => r.name).sort()).toEqual(['Nepenmäen koulu', 'S-Market Lehmo', 'Savonlinnan kuitulaboratorio']);
  });

  it('sorts newest first by default, largest first on request', () => {
    const newest = filterReferences(references, defaultFilter);
    expect(newest[0].year).toBe(2017);
    expect(newest[newest.length - 1].year).toBe(2013);
    const largest = filterReferences(references, { ...defaultFilter, sort: 'suurimmat' });
    expect(largest[0].area).toBe(13_500);
    expect(largest[largest.length - 1].area).toBeNull();
  });

  it('round-trips filters through URL params and ignores junk', () => {
    const f = { category: 'julkiset', work: 'saneeraus', year: 2015, sort: 'aakkoset' } as const;
    expect(parseFilter(filterToParams(f), YEARS)).toEqual(f);
    expect(parseFilter(new URLSearchParams('kategoria=x&tyo=<script>&vuosi=1999&jarjestys=0'), YEARS)).toEqual(defaultFilter);
    expect(filterToParams(defaultFilter).toString()).toBe('');
  });
});

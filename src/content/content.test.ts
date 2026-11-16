import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { company, contactGroups, copy, invoicing } from './company';
import { photos } from './photos';
import { pageMeta } from './seo';
import { services } from './services';

describe('company content', () => {
  it('never uses the invoicing e-mail as a contact address', () => {
    for (const g of contactGroups) for (const p of g.people) expect(p.email).not.toBe(invoicing.email);
    expect(JSON.stringify(copy)).not.toContain(invoicing.email);
  });

  it('keeps tel: links in sync with the visible numbers', () => {
    const toE164 = (s: string) => `+358${s.replace(/\s/g, '').slice(1)}`;
    expect(toE164(company.phone)).toBe(company.phoneHref);
    for (const g of contactGroups) for (const p of g.people) expect(toE164(p.phone), p.name).toBe(p.phoneHref);
  });

  it('lists the five services named on the original site', () => {
    expect(services.map((s) => s.title)).toEqual([
      'Bitumikermi- ja tiilikatteet',
      'Rakennuspellitykset',
      'Vesikattojen puutyöt',
      'Vesikaton tarkastus ja huolto',
      'Maanalaisten rakenteiden bitumityöt',
    ]);
    expect(new Set(services.map((s) => s.slug)).size).toBe(services.length);
  });
});

describe('SEO metadata', () => {
  it('has a unique title and description for every route', () => {
    expect(new Set(pageMeta.map((m) => m.title)).size).toBe(pageMeta.length);
    expect(new Set(pageMeta.map((m) => m.description)).size).toBe(pageMeta.length);
    for (const m of pageMeta) {
      expect(m.title.length, m.path).toBeLessThanOrEqual(70);
      expect(m.description.length, m.path).toBeGreaterThan(70);
      expect(m.description.length, m.path).toBeLessThanOrEqual(200);
    }
  });

  it('covers every service page', () => {
    for (const s of services) expect(pageMeta.some((m) => m.path === `/palvelut/${s.slug}`)).toBe(true);
  });
});

describe('images', () => {
  it('has every generated size on disk (run `npm run images` after changing photos.ts)', () => {
    for (const p of Object.values(photos)) {
      expect(p.widths[p.widths.length - 1]).toBeLessThanOrEqual(p.width);
      for (const w of p.widths)
        for (const ext of ['avif', 'webp', 'jpg']) expect(existsSync(join('public/images', `${p.slug}-${w}.${ext}`)), `${p.slug}-${w}.${ext}`).toBe(true);
    }
  });

  it('only attaches project names to photos captioned with that project on the original site', () => {
    for (const p of Object.values(photos)) {
      if (p.kind === 'material') expect('project' in p).toBe(false);
      else expect(p.project).toBeTruthy();
    }
  });
});

import { services } from './services';

/**
 * Per-route metadata. Used by the client (document.title on navigation) and
 * by scripts/prerender.mjs (static <head> for every route).
 */
export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** Breadcrumb trail for structured data (excluding the home page) */
  crumbs?: { name: string; path: string }[];
}

const SUFFIX = ' | Karjalan Mestarit';

export const pageMeta: PageMeta[] = [
  {
    path: '/',
    title: 'Vesikattourakointi Joensuu – Karjalan Mestarit Oy',
    description:
      'Karjalan Mestarit Oy on joensuulainen vesikattourakoitsija: bitumikermi- ja tiilikatteet, pellitykset, vesikattojen puutyöt sekä katon tarkastus ja huolto Pohjois-Karjalassa ja Pohjois-Savossa.',
  },
  {
    path: '/palvelut',
    title: `Palvelut – vedeneristeet ja bitumikermikatteet${SUFFIX}`,
    description:
      'Bitumikermi- ja tiilikatteet, rakennuspellitykset, vesikattojen puutyöt, vesikaton tarkastus ja huolto sekä maanalaisten rakenteiden bitumityöt Pohjois-Karjalassa ja Pohjois-Savossa.',
    crumbs: [{ name: 'Palvelut', path: '/palvelut' }],
  },
  ...services.map((s) => ({
    path: `/palvelut/${s.slug}`,
    title: s.seoTitle,
    description: s.seoDescription,
    crumbs: [
      { name: 'Palvelut', path: '/palvelut' },
      { name: s.title, path: `/palvelut/${s.slug}` },
    ],
  })),
  {
    path: '/referenssit',
    title: `Referenssit – vesikattokohteita Itä-Suomesta${SUFFIX}`,
    description:
      'Karjalan Mestarien referenssikohteita: kouluja, terveyskeskuksia, uimahalleja, teollisuuskiinteistöjä, vesitorneja ja asunto-osakeyhtiöitä Pohjois-Karjalassa ja Pohjois-Savossa.',
    crumbs: [{ name: 'Referenssit', path: '/referenssit' }],
  },
  {
    path: '/yritys',
    title: `Yritys – pohjoiskarjalaista vesikattourakointia${SUFFIX}`,
    description:
      'Karjalan Mestarit Oy on joensuulainen vesikattotöihin erikoistunut yritys. Suurin omistaja ja tavarantoimittaja on Katepal Oy.',
    crumbs: [{ name: 'Yritys', path: '/yritys' }],
  },
  {
    path: '/yhteystiedot',
    title: `Yhteystiedot ja tarjouspyyntö${SUFFIX}`,
    description:
      'Ota yhteyttä Karjalan Mestareihin: työpäälliköt Pohjois-Karjalassa ja Pohjois-Savossa, Raivaajantie 18, 80100 Joensuu. Puh. 040 166 3644.',
    crumbs: [{ name: 'Yhteystiedot', path: '/yhteystiedot' }],
  },
];

export const notFoundMeta: PageMeta = {
  path: '/404',
  title: `Sivua ei löytynyt${SUFFIX}`,
  description: 'Hakemaasi sivua ei löytynyt. Palaa etusivulle tai tutustu palveluihin ja referensseihin.',
};

export function metaFor(pathname: string): PageMeta {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return pageMeta.find((m) => m.path === clean) ?? notFoundMeta;
}

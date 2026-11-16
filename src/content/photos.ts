/**
 * Photographs reused from the company's current website (karjalanmestarit.fi).
 * Single source of truth for both the image pipeline (scripts/prepare-images.mjs)
 * and the <Picture> component. Provenance + rights status: docs/ASSET_PROVENANCE.md
 *
 * RIGHTS: publication permission has NOT been confirmed. Keep the demo local /
 * private until the company confirms the right to reuse these files.
 */

export type PhotoKind = 'project' | 'material';

export interface Photo {
  /** Output basename in public/images/ */
  slug: string;
  /** Source filename in source-assets/karjalanmestarit-fi/ */
  source: string;
  sourceUrl: string;
  width: number;
  height: number;
  /** Output widths (px) – the largest never exceeds the source width */
  widths: number[];
  alt: string;
  /** 'project' = a named reference photo; 'material' = generic roofing/material photo, not tied to any project */
  kind: PhotoKind;
  /** Only for kind 'project': the project the photo is captioned with on the original site */
  project?: string;
  /** Focal point for object-position, e.g. '30% 50%' */
  focus?: string;
}

const UPLOADS = 'https://karjalanmestarit.fi/wp-content/uploads/2019/06/';

export const photos = {
  astoria: {
    slug: 'ref-ravintola-astoria-joensuu',
    source: 'Ravintola-Astoria-Joensuu.jpg',
    sourceUrl: `${UPLOADS}Ravintola-Astoria-Joensuu.jpg`,
    width: 1024,
    height: 682,
    widths: [640, 1024],
    alt: 'Ravintola Astoria Joensuussa: punatiilinen porrastettu päätyrakennus, jossa punainen vesikatto, taustalla vaalea kivitalo.',
    kind: 'project',
    project: 'Ravintola Astoria, Joensuu',
    focus: '45% 55%',
  },
  pohjoiskulma: {
    slug: 'ref-as-oy-pohjoiskulma',
    source: 'Asunto-Oy-Pohjoiskulma.jpg',
    sourceUrl: `${UPLOADS}Asunto-Oy-Pohjoiskulma.jpg`,
    width: 1024,
    height: 768,
    widths: [640, 1024],
    alt: 'As. Oy Pohjoiskulma: kolmikerroksinen kerrostalo, jonka harjakatto on punainen ja piiput pellitetty katon värisiksi.',
    kind: 'project',
    project: 'As. Oy Pohjoiskulma',
    focus: '50% 45%',
  },
  linnanranta: {
    slug: 'ref-as-oy-linnanranta-savonlinna',
    source: 'As.-Oy-Linnanranta-Savonlinna.jpg',
    sourceUrl: `${UPLOADS}As.-Oy-Linnanranta-Savonlinna.jpg`,
    width: 1024,
    height: 682,
    widths: [640, 1024],
    alt: 'As. Oy Linnanranta Savonlinnassa: ruskea puurakennus, jossa musta mansardikatto ja kattoikkunat.',
    kind: 'project',
    project: 'As. Oy Linnanranta, Savonlinna',
    focus: '60% 50%',
  },
  redShingleFlashing: {
    slug: 'material-red-shingle-flashing',
    source: 'etusivu.jpg',
    sourceUrl: `${UPLOADS}etusivu.jpg`,
    width: 1950,
    height: 600,
    widths: [800, 1280, 1950],
    alt: 'Punainen bitumikermikate läheltä: lappeen saumat ja punaiseksi pellitetty läpivienti.',
    kind: 'material',
    focus: '22% 55%',
  },
  blackShingle: {
    slug: 'material-black-shingle',
    source: 'palvelut.jpg',
    sourceUrl: `${UPLOADS}palvelut.jpg`,
    width: 1950,
    height: 600,
    widths: [800, 1280, 1950],
    alt: 'Musta bitumikermikate, jonka laatat muodostavat säännöllisen kuvion lappeelle.',
    kind: 'material',
    focus: '55% 50%',
  },
  redShingleDormers: {
    slug: 'material-red-shingle-dormers',
    source: 'referenssit.jpg',
    sourceUrl: `${UPLOADS}referenssit.jpg`,
    width: 1950,
    height: 600,
    widths: [800, 1280, 1950],
    alt: 'Punaisella kuviokermillä katettu talo, jossa vaaleat kattolyhdyt ja erkkeri.',
    kind: 'material',
    focus: '50% 40%',
  },
  shingleDetail: {
    slug: 'material-shingle-detail',
    source: 'banner1_Karjalan-Mestarit-Oy.jpg',
    sourceUrl: `${UPLOADS}banner1_Karjalan-Mestarit-Oy.jpg`,
    width: 1950,
    height: 600,
    widths: [800, 1280, 1950],
    alt: 'Lähikuva pyöreäkulmaisista bitumikattolaatoista ja niiden limityksestä.',
    kind: 'material',
    focus: '50% 50%',
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

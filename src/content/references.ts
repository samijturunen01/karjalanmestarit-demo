/**
 * Reference projects – transcribed from https://karjalanmestarit.fi/referenssit-2/
 * (page last modified 4.7.2019, retrieved 16.11.2026).
 *
 * `source` keeps the original line verbatim. Obvious typos have been corrected
 * in `name` and listed in `note`. `municipality` is filled in ONLY when the
 * project name itself names the place (or a well-known district of it); it
 * is used for the reference map and is otherwise left empty.
 */

export type RefCategory = 'julkiset' | 'asunto';
export type RefWork = 'saneeraus' | 'uudis';

export interface Reference {
  id: string;
  year: number;
  name: string;
  /** Roof area in m² as listed; null when the source is ambiguous */
  area: number | null;
  /** Display string when the area needs a qualifier */
  areaLabel?: string;
  work: RefWork;
  category: RefCategory;
  municipality?: Municipality;
  source: string;
  note?: string;
}

export type Municipality =
  | 'Joensuu'
  | 'Juuka'
  | 'Kitee'
  | 'Kontiolahti'
  | 'Kuopio'
  | 'Lieksa'
  | 'Liperi'
  | 'Outokumpu'
  | 'Pieksämäki'
  | 'Rääkkylä'
  | 'Savonlinna'
  | 'Tuusniemi';

export const categoryLabels: Record<RefCategory, string> = {
  julkiset: 'Kaupungit, kunnat ja yritykset',
  asunto: 'Asunto-osakeyhtiöt',
};

export const workLabels: Record<RefWork, string> = {
  saneeraus: 'Saneeraus',
  uudis: 'Uudisrakennus',
};

type Row = [
  year: number,
  name: string,
  area: number | null,
  work: RefWork,
  municipality: Municipality | null,
  source: string,
  note?: string,
  areaLabel?: string,
];

const julkiset: Row[] = [
  [2013, 'Hoitokoti Helmi', null, 'uudis', null, '2013, Hoitokoti Helmi 2 300 m2, uudisrakennus', 'Lähteessä "Helmi 2 300 m2" ilman pilkkua – tarkistettava, onko ala 2 300 m² vai kohde "Helmi 2" (300 m²).', '2 300 m²*'],
  [2013, 'Juuan terveyskeskus', 8550, 'saneeraus', 'Juuka', '2013, Juuan Terveyskeskus, 8 550 m2, saneeraus'],
  [2014, 'Joensuun Ravirata', 1200, 'saneeraus', 'Joensuu', '2014, Joensuun Ravirata, 1 200 m2, saneeraus'],
  [2014, 'Katsastus Kovalainen Oy', 2500, 'saneeraus', null, '2014, Katsastus Kovalainen Oy, 2 500 m2, saneeraus'],
  [2014, 'Kiinteistö Oy Kurssipesä', 6000, 'saneeraus', null, '2014, Kiinteistö Oy Kurssipesä, 6 000 m2, saneeraus'],
  [2014, 'Kiinteistö Oy Rääkkylän Yrittäjätalo', 950, 'saneeraus', 'Rääkkylä', '2014, Kiinteistö Oy Rääkkylän Yrittäjätalo, 950 m2, saneeraus'],
  [2014, 'Kiinteistö Oy Uimaharjun Haka', 1300, 'saneeraus', 'Joensuu', '2014, Kiinteistö Oy Uimaharjun Haka, 1 300 m2, saneeraus'],
  [2014, 'K-Rauta Naumanen, Pieksämäki', 1200, 'saneeraus', 'Pieksämäki', '2014, K-Rauta Naumanen Pieksämäki, 1 200 m2, saneeraus'],
  [2014, 'Lieksan kirjasto', 1000, 'saneeraus', 'Lieksa', '2014, Lieksan Kirjasto, 1 000 m2, saneeraus'],
  [2014, 'Lomaranta Niittykartano', 940, 'saneeraus', null, '2014, Lomaranta Niittykartano, 940 m2, saneeraus'],
  [2014, 'Noljakan koulu, vaihe I', 1500, 'saneeraus', 'Joensuu', '2014, Noljakan Koulu vaihe I, 1 500 m2, saneeraus'],
  [2014, 'Pohjois-Karjalan Aikuisopisto, Joensuu', 5500, 'saneeraus', 'Joensuu', '2014, Pohjois-Karjalan Aikuisopisto Joensuu, 5 500 m2, saneeraus'],
  [2014, 'Stora Enso Building and Living, Auditalo', 1500, 'uudis', null, '2014, Stora Enso Building and Living Auditalo, 1 500 m2, uudisrakennus'],
  [2014, 'Viinijärven vesitorni', 380, 'saneeraus', 'Liperi', '2014, Viinijärven Vesitorni, Viinijärvi, 380 m2, saneeraus'],
  [2015, 'Joensuun Metsätalo Oy', 1700, 'saneeraus', 'Joensuu', '2015, Joensuun Metsätalo Oy, 1 700 m2, saneeraus'],
  [2015, 'Noljakan koulu, vaihe II', 1700, 'saneeraus', 'Joensuu', '2015, Noljakan Koulu vaihe II, 1 700 m2, saneeraus'],
  [2015, 'Pohjois-Karjalan Kirjapaino Oyj, vaihe I', 4000, 'saneeraus', null, '2015, Pohjois-Karjalan Kirjapaino Oyj vaihe I, 4 000 m2, saneeraus'],
  [2015, 'Rantakylän uimahalli', 1500, 'saneeraus', 'Joensuu', '2015, Rantakylän Uimahalli, 1 500 m2, saneeraus'],
  [2015, 'Stora Enso Wood Products Oy Ltd, Kiteen saha, vaihe I', 13500, 'saneeraus', 'Kitee', '2015, Stora Enso Wood Productus Oy Ltd Kiteen Saha vaihe I, 13 500 m2, saneeraus', 'Korjattu lähteen kirjoitusasu "Productus" → "Products" (vrt. vaihe II).'],
  [2015, 'Joensuun oikeus- ja poliisitalo', 6800, 'uudis', 'Joensuu', '2015, Joensuun oikeus- ja poliisitalo, 6 800 m2, uudisrakennus'],
  [2016, 'Lieksan uimahalli', 1000, 'saneeraus', 'Lieksa', '2016, Lieksan Uimahalli, Lieksa 1 000 m2, saneeraus'],
  [2016, 'Pohjois-Karjalan Kirjapaino Oyj, vaihe II', 3300, 'saneeraus', null, '2016, Pohjois-Karjalan Kirjapaino Oyj vaihe II, 3 300 m2, saneeraus'],
  [2016, 'Siilaisen terveyskeskus, vaihe IV', 3900, 'uudis', 'Joensuu', '2016, Siilaisen terveyskeskus vaihe IV, 3 900 m2, uudisrakennus'],
  [2016, 'Stora Enso Wood Products Oy Ltd, Kiteen saha, vaihe II', 7500, 'saneeraus', 'Kitee', '2016, Stora Enso Wood Products Oy Ltd Kiteen Saha vaihe II, 7 500 m2, saneeraus'],
  [2017, 'Kontiolahden vesitorni', 200, 'saneeraus', 'Kontiolahti', '2017, Kontiolahden vesitorni, 200 m2, saneeraus'],
  [2017, 'Nepenmäen koulu', 7300, 'uudis', 'Joensuu', '2017, Nepenmäen koulu, 7 300 m2, uudisrakennus'],
  [2017, 'Pielisen Betoni Oy, Outokumpu', 4200, 'saneeraus', 'Outokumpu', '2017, Pielisen Betoni Oy Outokumpu, 4 200 m2, saneeraus'],
  [2017, 'Savonlinnan kuitulaboratorio', 710, 'uudis', 'Savonlinna', '2017, Savonlinnan kuitulaboratorio, 710 m2, uudisrakennus'],
  [2017, 'S-Market Lehmo', 1800, 'uudis', 'Kontiolahti', '2017, S-Market Lehmo, 1 800 m2, uudisrakennus'],
  [2017, 'Tuusniemen vesitorni', 190, 'saneeraus', 'Tuusniemi', '2017, Tuusniemen vesitorni, 190 m2, saneeraus'],
  [2017, 'Valukumpu, Joensuu', 5850, 'saneeraus', 'Joensuu', '2017, Valukumpu Joensuu, 5 850 m2, saneeraus'],
];

const asunto: Row[] = [
  [2013, 'As Oy Joensuun Reimari', 300, 'uudis', 'Joensuu', '2013, As Oy Joensuun Reimari, 300 m2, uudisrakennus'],
  [2014, 'As Oy Joensuun Merimiehenkatu 9', 1100, 'saneeraus', 'Joensuu', '2014, As Oy Joensuun Merimiehenkatu 9, 1 100 m2, saneeraus'],
  [2014, 'As Oy Kokkopuistikko, Juuka', 410, 'saneeraus', 'Juuka', '2014, As Oy Kokkopuistikko, Juuka, 410 m2, saneeraus'],
  [2014, 'As Oy Kuopion Pursupolku 14', 660, 'uudis', 'Kuopio', '2014, As Oy Kuopion Pursupolku 14, Kuopio, 660 m2, uudisrakennus'],
  [2014, 'As Oy Marjalan Trendi', 1900, 'uudis', 'Joensuu', '2014, As Oy Marjalan Trendi, 1 900 m2, uudisrakennus'],
  [2014, 'As Oy Nikolaoksenpuisto', 300, 'saneeraus', null, '2014, As Oy Nikolaoksenouisto, 300 m2, saneeraus', 'Korjattu lähteen kirjoitusasu "Nikolaoksenouisto" → "Nikolaoksenpuisto" – tarkistettava.'],
  [2015, 'As Oy Joensuun Poiju', 400, 'uudis', 'Joensuu', '2015, As Oy Joensuun Poiju, 400 m2, uudisrakennus'],
  [2015, 'As Oy Kaasilanaho, Kuilukatu 3', 720, 'saneeraus', null, '2015, As Oy Kaasilanaho Kuilukatu 3, 720 m2, saneeraus'],
  [2015, 'As Oy Kukonpolku 2–6', 2200, 'saneeraus', null, '2015, As Oy Kukonpolku 2 – 6, 2 200 m2, saneeraus'],
  [2016, 'As Oy Joensuun Suvantokatu 27', 470, 'saneeraus', 'Joensuu', '2016, As Oy Joensuun Suvantokato 27, 470 m2, saneeraus', 'Korjattu lähteen kirjoitusasu "Suvantokato" → "Suvantokatu".'],
  [2017, 'As Oy Hammaslahden Lintula', 660, 'saneeraus', 'Joensuu', '2017, As Oy Hammaslahden Lintula, 660 m2, saneeraus'],
  [2017, 'As Oy Tikkamäenpuisto', 600, 'saneeraus', null, '2017, As Oy Tikkamäenpuisto, 600 m2, saneeraus'],
  [2017, 'Asunto Oy Joensuun Kalevalankatu 17', 770, 'saneeraus', 'Joensuu', '2017, Asunto Oy Joensuun Kalvevalankatu 17, 770 m2, saneeraus', 'Korjattu lähteen kirjoitusasu "Kalvevalankatu" → "Kalevalankatu".'],
  [2017, 'Asunto Oy Joensuun Sepänkatu 18 b', 440, 'saneeraus', 'Joensuu', '2017, Asunto Oy Joensuun Sepänkatu 18b, 440 m2, saneeraus'],
  [2017, 'Asunto Oy Rantaristeys', 1300, 'saneeraus', null, '2017, Asunto Oy Rantaristeys, 1 300 m2, saneeraus'],
];

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[äå]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const build = (rows: Row[], category: RefCategory): Reference[] =>
  rows.map(([year, name, area, work, municipality, source, note, areaLabel]) => ({
    id: `${year}-${slug(name)}`,
    year,
    name,
    area,
    areaLabel,
    work,
    category,
    municipality: municipality ?? undefined,
    source,
    note,
  }));

export const references: Reference[] = [...build(julkiset, 'julkiset'), ...build(asunto, 'asunto')];

/** Projects photographed on the original site's "Kuvat" gallery (no year/area given there). */
export const photographedProjects = [
  { name: 'Ravintola Astoria', place: 'Joensuu', photo: 'astoria' },
  { name: 'As. Oy Pohjoiskulma', place: null, photo: 'pohjoiskulma' },
  { name: 'As. Oy Linnanranta', place: 'Savonlinna', photo: 'linnanranta' },
] as const;

/** Approximate municipal centres (WGS84) for the reference map. */
export const municipalityCoords: Record<Municipality, { lat: number; lon: number; region: 'Pohjois-Karjala' | 'Pohjois-Savo' | 'Etelä-Savo' }> = {
  Joensuu: { lat: 62.601, lon: 29.763, region: 'Pohjois-Karjala' },
  Juuka: { lat: 63.243, lon: 29.253, region: 'Pohjois-Karjala' },
  Kitee: { lat: 62.098, lon: 30.137, region: 'Pohjois-Karjala' },
  Kontiolahti: { lat: 62.766, lon: 29.849, region: 'Pohjois-Karjala' },
  Lieksa: { lat: 63.317, lon: 30.027, region: 'Pohjois-Karjala' },
  Liperi: { lat: 62.533, lon: 29.383, region: 'Pohjois-Karjala' },
  Outokumpu: { lat: 62.726, lon: 29.016, region: 'Pohjois-Karjala' },
  Rääkkylä: { lat: 62.313, lon: 29.625, region: 'Pohjois-Karjala' },
  Kuopio: { lat: 62.892, lon: 27.678, region: 'Pohjois-Savo' },
  Tuusniemi: { lat: 62.811, lon: 28.493, region: 'Pohjois-Savo' },
  Pieksämäki: { lat: 62.3, lon: 27.157, region: 'Etelä-Savo' },
  Savonlinna: { lat: 61.869, lon: 28.879, region: 'Etelä-Savo' },
};

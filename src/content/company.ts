/**
 * Company facts. Source: karjalanmestarit.fi (Etusivu, Palvelut, Yhteystiedot –
 * pages last modified 25.5.2021, retrieved 16.11.2026) unless noted otherwise.
 * Verification status of every item: docs/CONTENT_SOURCES.md
 */

export interface Person {
  name: string;
  role: string;
  phone: string;
  /** E.164 for tel: links */
  phoneHref: string;
  email: string;
}

export interface ContactGroup {
  id: string;
  label: string;
  note?: string;
  people: Person[];
}

export const company = {
  name: 'Karjalan Mestarit Oy',
  shortName: 'Karjalan Mestarit',
  slogan: 'Katsos kattoa!',
  businessId: '2412276-6',
  /** Trade register (via public company-data services mirroring PRH/YTJ) */
  registered: 2011,
  homeTown: 'Joensuu',
  address: {
    street: 'Raivaajantie 18',
    postalCode: '80100',
    city: 'Joensuu',
    /** On the original site: "Osoite (ei laskuja tähän osoitteeseen)" */
    note: 'Ei laskuja tähän osoitteeseen',
  },
  /** Main number shown in the original site header and footer */
  phone: '040 166 3644',
  phoneHref: '+358401663644',
  areas: ['Pohjois-Karjala', 'Pohjois-Savo'],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Raivaajantie%2018%2C%2080100%20Joensuu',
} as const;

/** Invoicing details – shown separately and never used as general contact details. */
export const invoicing = {
  eInvoiceAddress: '003724122766',
  intermediatorId: '003708599126',
  /** As written on the original site. Verify: the operator may have been renamed since 2021. */
  operator: 'Liaison Technologies Oy',
  postal: ['Karjalan Mestarit Oy', 'c/o Katepal Oy', 'PL 33', '37501 LEMPÄÄLÄ'],
  email: 'karjalanmestarit@katepal.fi',
} as const;

export const contactGroups: ContactGroup[] = [
  {
    id: 'pohjois-karjala',
    label: 'Pohjois-Karjala',
    people: [
      {
        name: 'Petri Tarvainen',
        role: 'Työpäällikkö',
        phone: '040 551 5880',
        phoneHref: '+358405515880',
        email: 'petri.tarvainen@karjalanmestarit.fi',
      },
    ],
  },
  {
    id: 'pohjois-savo',
    label: 'Pohjois-Savo',
    people: [
      {
        name: 'Antero Liimatainen',
        role: 'Työpäällikkö',
        phone: '040 828 9462',
        phoneHref: '+358408289462',
        email: 'antero.liimatainen@karjalanmestarit.fi',
      },
    ],
  },
  {
    id: 'hallinto',
    label: 'Johto ja laskutus',
    people: [
      {
        name: 'Petri Laitinen',
        role: 'Toimitusjohtaja',
        phone: '040 166 3644',
        phoneHref: '+358401663644',
        email: 'petri.laitinen@karjalanmestarit.fi',
      },
      {
        name: 'Ville-Aleksi Korhonen',
        role: 'Laskutus, laskenta',
        phone: '050 467 4443',
        phoneHref: '+358504674443',
        email: 'ville.korhonen@karjalanmestarit.fi',
      },
    ],
  },
];

export const regionalContacts = {
  'pohjois-karjala': contactGroups[0].people[0],
  'pohjois-savo': contactGroups[1].people[0],
} as const;

/** Verbatim / lightly edited passages from the original site */
export const copy = {
  approach:
    'Karjalan Mestarit Oy tekee katollesi sen, mitä tarvitset – ja vain sen, mitä tarvitset. Oli sitten kyseessä kuntokartoitus, täydellinen kattoremontti tai vaativa uudiskohde.',
  customers:
    'Asiakaskuntamme koostuu niin yksittäisistä rakentajista kuin valtakunnallisista rakennusliikkeistä ja isännöintitoimistoista.',
  intro:
    'Karjalan Mestarit Oy on luotettava suomalainen yritys, jonka erikoisalaa ovat vesikattotyöt. Palvelemme yrityksiä ja yksityisiä asiakkaita Pohjois-Karjalan ja Pohjois-Savon seuduilla.',
  katepal:
    'Katepal Oy on Suomen johtava bitumisten kateaineiden ja bitumituotteiden valmistaja. Katepal on myös Karjalan Mestarien suurin omistaja ja tavarantoimittaja.',
  katepalFinnish:
    'Valitsemalla Katepalin tuotteet voit olla varma, että valintasi on turvallinen ja samalla tuet suomalaista työtä. Katepal on suomalainen yritys, jonka tuotteet ovat Avainlippu-tuotteita.',
  staff:
    'Meillä henkilökunta on asiakasta ja hänen tarpeitaan varten. Vuosien kokemus alalta niin työnjohdossa kuin ammattiasentajissa takaa sen, että asiakas saa sellaisen lopputuloksen kuin on tilannutkin.',
  greyEconomy: 'Olemme mukana torjumassa harmaata taloutta kuulumalla muun muassa Tilaajavastuu-palveluun.',
  installs:
    'Karjalan Mestarit Oy asentaa vedeneristeet, bitumikermikatteet sekä muut kattotuotteet Pohjois-Karjalan ja Pohjois-Savon seudun asiakkaille. Teemme myös monia muita kattoalan töitä.',
  materials: 'Käytämme Katepal Oy:n laadukkaita tuotteita.',
  contactLead:
    'Lähetä meille tarjouspyyntö sähköpostilla tai alla olevalla lomakkeella. Voit myös soittaa ja kysyä lisää palveluistamme.',
} as const;

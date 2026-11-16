import type { PhotoKey } from './photos';

/**
 * Services. The five service names are verbatim from karjalanmestarit.fi/palvelut-2/.
 *
 * Content rules:
 *  - `lead` / `body` contain only what the company itself says (or a neutral
 *    restatement of it) – no promised sub-services, guarantees or procedures;
 *  - `knowledge` is GENERAL roofing information, rendered under the heading
 *    "Yleistietoa" so it is not read as a company-specific promise.
 */

export type DrawingKind = 'layers' | 'flashing' | 'truss' | 'inspection' | 'foundation';

export interface Service {
  slug: string;
  no: string;
  title: string;
  /** One-line summary for listings */
  short: string;
  lead: string;
  body: string[];
  knowledge: { title: string; text: string }[];
  drawing: DrawingKind;
  photo?: PhotoKey;
  seoTitle: string;
  seoDescription: string;
}

export const services: Service[] = [
  {
    slug: 'bitumikermi-ja-tiilikatteet',
    no: '01',
    title: 'Bitumikermi- ja tiilikatteet',
    short: 'Vedeneristeet ja bitumikermikatteet uudiskohteisiin ja kattoremontteihin – sekä tiilikatteet.',
    lead: 'Asennamme vedeneristeet, bitumikermikatteet ja tiilikatteet Pohjois-Karjalan ja Pohjois-Savon seudun asiakkaille – yksittäisistä rakentajista valtakunnallisiin rakennusliikkeisiin.',
    body: [
      'Bitumikermi on joustava ja vedenpitävä katemateriaali, jota käytetään sekä loivilla että jyrkemmillä katoilla. Vedeneristeet ja bitumikermikatteet ovat Karjalan Mestarien ydinosaamista.',
      'Käytämme Katepal Oy:n laadukkaita tuotteita. Katepal on Suomen johtava bitumisten kateaineiden ja bitumituotteiden valmistaja.',
    ],
    knowledge: [
      {
        title: 'Loivat katot',
        text: 'Loivalla katolla vesi viipyy pinnalla pidempään, joten katteen on oltava yhtenäinen ja saumoiltaan tiivis. Hitsattu tai liimattu bitumikermi muodostaa yhtenäisen vedeneristyksen.',
      },
      {
        title: 'Jyrkemmät katot',
        text: 'Jyrkemmille katoille on saatavilla bitumikattolaattoja eri muodoissa ja sävyissä. Ne taipuvat myös monimuotoisille katoille, kuten kattolyhtyjen ja jiirien ympärille.',
      },
      {
        title: 'Yksityiskohdat ratkaisevat',
        text: 'Katteen pitävyys ratkeaa usein liitoksissa: läpivienneissä, jiireissä, räystäillä ja seinäliittymissä. Niihin kannattaa kiinnittää huomiota jo tarjousvaiheessa.',
      },
    ],
    drawing: 'layers',
    photo: 'redShingleDormers',
    seoTitle: 'Bitumikermikatot ja tiilikatteet Joensuu | Karjalan Mestarit',
    seoDescription:
      'Bitumikermi- ja tiilikatteet sekä vedeneristeet uudiskohteisiin ja kattoremontteihin Pohjois-Karjalassa ja Pohjois-Savossa. Katepalin tuotteet. Pyydä tarjous.',
  },
  {
    slug: 'rakennuspellitykset',
    no: '02',
    title: 'Rakennuspellitykset',
    short: 'Pellitykset suojaavat rakennuksen alttiimpia kohtia ja viimeistelevät katon.',
    lead: 'Pellitykset suojaavat rakennuksen alttiimpia kohtia vedeltä ja viimeistelevät katon ilmeen. Rakennuspellitykset kuuluvat Karjalan Mestarien palveluihin.',
    body: [
      'Hyvin tehty pellitys ohjaa veden pois rakenteista ja sitoo katon yhtenäiseksi kokonaisuudeksi. Kerro kohteestasi, niin kartoitamme, mitä pellityksiä se tarvitsee.',
    ],
    knowledge: [
      {
        title: 'Missä pellitystä tarvitaan',
        text: 'Tyypillisiä pellityskohteita ovat esimerkiksi räystäät, päätyräystäät, piiput, läpiviennit, ikkunoiden vesipellit ja katon liittymät seiniin.',
      },
      {
        title: 'Sävy katon mukaan',
        text: 'Kun pellitykset tehdään katteen sävyyn, katosta tulee rauhallinen ja yhtenäinen kokonaisuus.',
      },
      {
        title: 'Samassa urakassa',
        text: 'Kun kate ja pellitykset tehdään samalla kertaa, niiden liitokset voidaan sovittaa toisiinsa alusta asti.',
      },
    ],
    drawing: 'flashing',
    photo: 'redShingleFlashing',
    seoTitle: 'Rakennuspellitykset Joensuu ja Pohjois-Savo | Karjalan Mestarit',
    seoDescription:
      'Rakennuspellitykset osana vesikattourakointia Pohjois-Karjalassa ja Pohjois-Savossa. Karjalan Mestarit Oy, Joensuu. Pyydä tarjous.',
  },
  {
    slug: 'vesikattojen-puutyot',
    no: '03',
    title: 'Vesikattojen puutyöt',
    short: 'Katteen alla oleva puurakenne ratkaisee, kuinka hyvin kate toimii.',
    lead: 'Vesikaton puurakenteet ovat katteen alusta – ja kate on vain niin hyvä kuin sen alusta. Vesikattojen puutyöt kuuluvat Karjalan Mestarien palveluihin.',
    body: [
      'Kattoremontissa alusrakenteiden kunto selviää usein vasta, kun vanha kate avataan. Kun puutyöt ja katetyöt ovat saman tekijän käsissä, ne voidaan sovittaa yhteen sujuvasti.',
    ],
    knowledge: [
      {
        title: 'Alusta ensin',
        text: 'Tasainen ja tukeva laudoitus- tai levyalusta on edellytys siistille ja pitävälle katteelle. Epätasaisuudet näkyvät ja kuluttavat katetta ajan myötä.',
      },
      {
        title: 'Tuuletus kuntoon',
        text: 'Toimiva yläpohjan tuuletus pitää rakenteet kuivina. Tuuletusreittejä ei pidä tukkia kattoremontin yhteydessä.',
      },
      {
        title: 'Remontti on hyvä hetki',
        text: 'Kattoremontin yhteydessä kannattaa tarkistaa myös räystäiden, ruoteiden ja laudoitusten kunto – korjaukset on helpointa tehdä katteen ollessa auki.',
      },
    ],
    drawing: 'truss',
    seoTitle: 'Vesikattojen puutyöt Joensuu | Karjalan Mestarit',
    seoDescription:
      'Vesikattojen puutyöt kattoremontteihin ja uudiskohteisiin Pohjois-Karjalassa ja Pohjois-Savossa. Karjalan Mestarit Oy, Joensuu.',
  },
  {
    slug: 'vesikaton-tarkastus-ja-huolto',
    no: '04',
    title: 'Vesikaton tarkastus ja huolto',
    short: 'Kuntokartoituksesta huoltoon – tiedät, missä kunnossa katto on.',
    lead: 'Teemme katollesi sen, mitä tarvitset – ja vain sen, mitä tarvitset. Usein ensimmäinen askel on selvittää, missä kunnossa katto on.',
    body: [
      'Vesikaton tarkastukset, huollot ja kuntokartoitukset kuuluvat Karjalan Mestarien palveluihin. Niiden pohjalta voidaan päättää, riittääkö huolto vai onko katon uusiminen ajankohtaista.',
    ],
    knowledge: [
      {
        title: 'Mitä tarkastuksessa katsotaan',
        text: 'Tyypillisesti katteen yleiskunto, saumat, läpiviennit, pellitykset, räystäät ja vedenpoisto – eli kohdat, joista vuodot useimmiten alkavat.',
      },
      {
        title: 'Ajoitus',
        text: 'Moni tarkastuttaa katon säännöllisesti, esimerkiksi talven jälkeen, jolloin lumen ja jään jättämät jäljet ovat näkyvissä.',
      },
      {
        title: 'Tieto päätösten pohjaksi',
        text: 'Kuntokartoitus kertoo, mitä katolle kannattaa tehdä ja milloin. Se on hyödyllistä tietoa esimerkiksi taloyhtiön kunnossapidon suunnitteluun.',
      },
    ],
    drawing: 'inspection',
    photo: 'shingleDetail',
    seoTitle: 'Vesikaton tarkastus, huolto ja kuntokartoitus | Karjalan Mestarit',
    seoDescription:
      'Vesikaton tarkastus ja huolto sekä kuntokartoitukset Pohjois-Karjalassa ja Pohjois-Savossa. Karjalan Mestarit Oy, Joensuu. Pyydä tarjous.',
  },
  {
    slug: 'maanalaisten-rakenteiden-bitumityot',
    no: '05',
    title: 'Maanalaisten rakenteiden bitumityöt',
    short: 'Bitumiset vedeneristykset myös maan alle jääviin rakenteisiin.',
    lead: 'Bitumista ei tehdä vain kattoja. Maanalaisten rakenteiden bitumityöt kuuluvat Karjalan Mestarien palveluihin.',
    body: [
      'Maan alle jäävä vedeneristys tehdään kerralla kuntoon, sillä sen korjaaminen jälkikäteen on työlästä. Kerro kohteesta, niin arvioimme sopivan ratkaisun.',
    ],
    knowledge: [
      {
        title: 'Missä tarvitaan',
        text: 'Esimerkiksi perustusten, sokkelien ja muiden maanvastaisten rakenteiden vedeneristyksissä.',
      },
      {
        title: 'Huolellisuus maksaa itsensä takaisin',
        text: 'Maan alle jäävää eristystä on vaikea tarkastaa ja korjata. Siksi alustan esikäsittely, saumat ja liitokset tehdään huolella jo asennusvaiheessa.',
      },
      {
        title: 'Rakenteen mukaan',
        text: 'Vedeneristys valitaan aina rakenteen, kosteusrasituksen ja käyttötarkoituksen mukaan.',
      },
    ],
    drawing: 'foundation',
    seoTitle: 'Maanalaisten rakenteiden bitumityöt | Karjalan Mestarit',
    seoDescription:
      'Maanalaisten rakenteiden bitumityöt ja vedeneristykset Pohjois-Karjalassa ja Pohjois-Savossa. Karjalan Mestarit Oy, Joensuu.',
  },
];

export const serviceBySlug = (slug: string | undefined) => services.find((s) => s.slug === slug);

/** General description of how a roofing project usually proceeds – NOT a documented company procedure. */
export const processSteps = [
  { no: '01', title: 'Yhteydenotto', text: 'Kerro kohteesta: sijainti, katon tyyppi ja mitä olet suunnitellut. Soita alueesi työpäällikölle tai jätä tarjouspyyntö.' },
  { no: '02', title: 'Kohteen arviointi', text: 'Katon nykytila ja tarpeet selvitetään – tarvittaessa kuntokartoituksella.' },
  { no: '03', title: 'Tarjous', text: 'Tarjous perustuu siihen, mitä katto oikeasti tarvitsee. Ei enempää eikä vähempää.' },
  { no: '04', title: 'Toteutus', text: 'Kokenut työnjohto ja ammattiasentajat vievät työn läpi sovitusti.' },
  { no: '05', title: 'Luovutus ja huolto', text: 'Valmis katto luovutetaan. Jatkossa sen kuntoa voidaan pitää yllä tarkastuksin ja huolloin.' },
] as const;

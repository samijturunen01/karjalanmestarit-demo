# Content sources and verification status

Primary source: **karjalanmestarit.fi** (WordPress; pages Etusivu, Palvelut,
Referenssit, Yhteystiedot – last modified 25.5.2021 / references 4.7.2019),
retrieved 16.11.2026. Secondary: public company-data services that mirror the
Finnish Trade Register (PRH/YTJ).

## Verified and used

| Fact | Source | Where used |
|---|---|---|
| Company name **Karjalan Mestarit Oy**, Y-tunnus **2412276-6** | Original site (Yhteystiedot) + registry mirror | Footer, Company, Contact, JSON-LD |
| Address **Raivaajantie 18, 80100 Joensuu** ("ei laskuja tähän osoitteeseen") | Original site + registry mirror | Footer, Contact, JSON-LD |
| Phone **040 166 3644** (header/footer number; listed for the CEO) | Original site | Header, footer, CTA |
| Service area **Pohjois-Karjala and Pohjois-Savo** | Original site | Throughout |
| Five services (names verbatim) | Original site – Palvelut | Services pages |
| "Vedeneristeet ja bitumikermikatteet", installs waterproofing, membranes "sekä muut kattotuotteet" | Original site – Palvelut | Services page |
| Katepal Oy is the company's **largest owner and supplier**; Katepal products are Avainlippu products | Original site – Etusivu. Consistent with the invoicing address "c/o Katepal Oy" | Home, Company, Services |
| Member of **Tilaajavastuu** service ("mm.") | Original site – Etusivu | Home, Company |
| Customers: individual builders, national construction companies, property-management firms | Original site – Etusivu | Home, Company |
| "Teemme katollesi sen, mitä tarvitset ja vain sen, mitä tarvitset" – condition surveys, full renovations, demanding new builds | Original site – Etusivu | Home, Company, Service 04 |
| Slogan **"Katsos kattoa!"** | Original site header | Hero, footer |
| Staff, roles, phones, e-mails (Liimatainen, Tarvainen, Laitinen, Korhonen) | Original site – Yhteystiedot | Contact, CTA, footer |
| Invoicing details (e-invoice address, intermediator ID, operator, postal address c/o Katepal, invoice e-mail) | Original site – Yhteystiedot | Contact page, **invoicing section only** |
| 46 reference projects with year, area and type | Original site – Referenssit | References, home highlights, map |
| Three photographed projects (Ravintola Astoria Joensuu, As. Oy Pohjoiskulma, As. Oy Linnanranta Savonlinna) | Original site – references gallery captions | Home, References |
| Registered 2011 | Registry mirrors (registration date 15.6.2011) | Company title block |

## Needs confirmation before production

- **Currency of all contact data.** The contact page was last edited in May 2021. Confirm staff, roles, numbers and e-mails are still current.
- **Katepal ownership** – stated on the company's own site (2021); confirm it is still accurate.
- **E-invoicing operator** – the site says "Liaison Technologies Oy"; operator names have changed since (verify the current operator for intermediator ID 003708599126).
- **Reference list ends in 2017.** Newer projects would strengthen the site considerably.
- **"Hoitokoti Helmi 2 300 m2"** – missing comma in the source; shown as 2 300 m² with an asterisk and excluded from the area total.
- **Corrected typos** (shown corrected, flagged in `src/content/references.ts`):
  "Wood Productus" → "Wood Products"; "Suvantokato" → "Suvantokatu"; "Kalvevalankatu" → "Kalevalankatu"; "Nikolaoksenouisto" → "Nikolaoksenpuisto" (the last one is an educated guess – please confirm).
- **Map locations** are municipal centres for places named in project titles (e.g. Uimaharju, Hammaslahti, Noljakka → Joensuu; Lehmo → Kontiolahti; Viinijärvi → Liperi), not project addresses. 12 projects have no stated place and are not mapped.
- **Trade name "Itä-Suomen Laatukatto"** appears in registry data but not on the company's site – not used.

## Written for the demo (not company claims)

- Service pages: the "Yleistietoa / Hyvä tietää" boxes contain **general roofing information**, labelled as such, and the drawings are generic principle illustrations ("Periaatekuva – ei mittakaavassa").
- Home "Kattoprojektin kulku": a **general** description, explicitly labelled as not a documented company procedure.
- Headlines and connective copy ("Vesikatot räystäältä harjalle." etc.) – marketing copy built only on the verified facts above.
- Figures on the site (46 projects, 2013–2017, "yli 109 000 m²", 13 500 m² largest) are **computed from the reference list** at build time; the area total is floored to the thousand and excludes the ambiguous entry.

No testimonials, certifications, guarantees, years-in-business claims or
numerical achievements beyond the reference list have been added.

# Asset provenance

Retrieved 16.11.2026 from the company's current website, karjalanmestarit.fi
(WordPress media library, `/wp-content/uploads/2019/06/`). Originals are kept
unmodified in `source-assets/karjalanmestarit-fi/`; web versions are generated
into `public/images/` by `npm run images`.

> **Publication permission: NOT confirmed for any item below.**
> A file being publicly reachable on karjalanmestarit.fi does not grant the
> right to republish it. Keep the repository private and do not deploy publicly
> until Karjalan Mestarit Oy (and, for the material photos, the original
> photographer / rights holder) has confirmed in writing that the files may be used.

> **Update 16.11.2026 – demo publication:** the repository owner confirmed
> having permission to use and publicly publish the company's existing logo
> and photographs **for this concept demo**, and authorised the public GitHub
> Pages demo (`samijturunen01/karjalanmestarit-demo`). This covers the demo
> only. The per-item "Rights status" column below is kept as recorded; written
> confirmation for every item is still required before any production use.

## Used in the demo

| Local file(s) | Original URL | Description | Associated project | Rights status |
|---|---|---|---|---|
| `src/components/brand/logoPaths.ts` (SVG recreation), `public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png`, logo in `public/og-image.jpg` | …/2019/06/Karjalan-Mestarit-Oy_logo.png (350×138) | Company logo, traced to SVG with unchanged shapes, proportions and colours (black, #FF0000, white house). Method: `scripts/tools/trace-logo.mjs` | – | Company trademark – **permission needed** |
| `public/images/ref-ravintola-astoria-joensuu-{640,1024}.{avif,webp,jpg}` | …/2019/06/Ravintola-Astoria-Joensuu.jpg (1024×682) | Brick building with stepped gables and red roof | "Ravintola Astoria Joensuu" – caption in the original references gallery | **Permission needed** (photographer unknown) |
| `public/images/ref-as-oy-pohjoiskulma-{640,1024}.*` | …/2019/06/Asunto-Oy-Pohjoiskulma.jpg (1024×768) | Three-storey apartment block, red roof, roof-coloured chimney flashings | "As. Oy Pohjoiskulma" – caption in the original gallery | **Permission needed** |
| `public/images/ref-as-oy-linnanranta-savonlinna-{640,1024}.*` | …/2019/06/As.-Oy-Linnanranta-Savonlinna.jpg (1024×682) | Brown wooden building with black mansard roof | "As. Oy Linnanranta Savonlinna" – caption in the original gallery | **Permission needed** |
| `public/images/material-red-shingle-flashing-{800,1280,1950}.*`, photo band in `public/og-image.jpg` | …/2019/06/etusivu.jpg (1950×600) | Red bitumen shingle roof close-up with a red sheet-metal flashing (former home-page banner) | None – used as generic material imagery, never captioned as a project | **Permission needed; origin unknown** – looks like manufacturer (Katepal) marketing photography |
| `public/images/material-black-shingle-{800,1280,1950}.*` | …/2019/06/palvelut.jpg (1950×600) | Black bitumen shingles (former services banner) | None | Same as above |
| `public/images/material-red-shingle-dormers-{800,1280,1950}.*` | …/2019/06/referenssit.jpg (1950×600) | House with red patterned shingle roof and white dormers (former references banner) | None | Same as above |
| `public/images/material-shingle-detail-{800,1280,1950}.*` | …/2019/06/banner1_Karjalan-Mestarit-Oy.jpg (1950×600) | Close-up of round-edged shingles | None | Same as above |

The four "material" banners are not presented as Karjalan Mestarit's own
projects anywhere in the demo: they carry no project captions and their alt
texts describe only what is visible.

## Inspected but not used

| Original URL | Reason |
|---|---|
| …/2019/06/katepal.gif | Katepal Oy's logo – a third-party trademark. The relationship is described in text instead. |
| …/2019/06/banner4_yhteystiedot.jpg | Clay-tile roof against a blue sky; appears to be generic stock imagery, not Finnish project work. |
| …/2019/06/favicon.ico, up-arrow.png, responsive-lightbox-thumbnail.png | Theme/plugin files, not company imagery. |

No AI-generated, stock or competitor imagery is used. All other visuals
(technical drawings, roof silhouettes, map, textures) are original SVG/CSS made for this demo.

## Fonts (open licences – fine to publish)

- **Mona Sans** (variable, wdth 75–125) – SIL Open Font License 1.1, via `@fontsource-variable/mona-sans`
- **IBM Plex Mono** – SIL Open Font License 1.1, via `@fontsource/ibm-plex-mono`

Fonts are self-hosted; no requests go to Google Fonts or other third parties.

## Photographs that would lift the site

The demo carries itself with typography and drawings, but these would make it
markedly stronger (landscape, ≥ 2400 px wide, recent work, with project name,
year and the photographer's permission):

1. **Hero:** a wide, low-sun shot of a finished bitumen-membrane or shingle roof on a recognisable North Karelian building (e.g. a school or apartment block from the reference list).
2. **Work in progress:** installers welding membrane / fitting flashings (with safety gear) – shows craftsmanship.
3. **Details:** a ridge, a valley (jiiri), a penetration flashing and an eave flashing, close up – one for each service page.
4. **Larger references:** Joensuun oikeus- ja poliisitalo, Nepenmäen koulu, Kiteen saha, a water tower – ideally aerial/drone photos.
5. **People:** a natural team photo and portraits of the site managers for the contact page.
6. **Underground waterproofing** and **roof timber work** – currently illustrated with drawings only.

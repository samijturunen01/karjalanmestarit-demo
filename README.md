# Karjalan Mestarit Oy – website redesign (concept demo)

A speculative, fully built redesign of **karjalanmestarit.fi** for Karjalan
Mestarit Oy, a roofing and waterproofing contractor from Joensuu serving North
Karelia and North Savo. Customer-facing content is in Finnish.

> **Not the company's official website and not approved by the company.**
> The logo and photographs come from the current site and **may not be
> published** until the company grants permission – see
> [`docs/ASSET_PROVENANCE.md`](docs/ASSET_PROVENANCE.md) and
> [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Concept – "Räystäältä harjalle" (from eave to ridge)

The site is art-directed like an architect's drawing sheet that turns into a built roof.

- **Palette:** warm limestone paper, graphite lines, bitumen black and the logo's signal red.
- **Type:** Mona Sans in its condensed heavy cut for headlines (echoing the logo's lettering), Mona Sans for text, IBM Plex Mono for technical labels.
- **Logo intro "Talosta kotiin":** construction lines draw a house outline and guide circle, the authentic spiral (traced from the original logo) winds in along its own centre line, the little house settles in, the words rise from their baselines, and the logo flies into the header while the hero photo is "roofed" by a rising roof silhouette. Runs once per session, skips on any scroll/key, and is off for reduced motion.
- **Motion language "limitys" (overlap):** content is laid like roofing courses; images uncover from the eave upwards; section rules draw like eave lines; page navigation is immediate, with no transition overlay.
- **Technical drawings** (one per service) replace missing photography and draw themselves on scroll. Other recurring details: drawing-sheet title blocks ("nimiö"), roof-pitch hairlines, a survey-grid map of reference locations.

## Pages

| Route | Content |
|---|---|
| `/` | Hero + logo intro, company principle, services index with live drawings, references (computed figures, photos, highlights), Katepal / Tilaajavastuu, project flow, regional contact CTA |
| `/palvelut` | All services with drawings and material photography |
| `/palvelut/<palvelu>` | 5 service pages: description, drawing, general info ("Yleistietoa"), regional contacts, prev/next |
| `/referenssit` | Photo gallery with lightbox, filterable/sortable ledger of all 46 references (Flip animations, URL-synced filters), map of named locations |
| `/yritys` | Company, Katepal relationship, staff, service area |
| `/yhteystiedot` | People by region, quote-request form (demo handler), address, invoicing details kept separate |
| `*` | 404 |

## Run locally

Requires Node ≥ 22.18 (Node 24 recommended).

```bash
npm install
npm run dev            # development server
npm run build          # production build + prerender → dist/
npm run serve:pages    # serve dist/ like GitHub Pages → http://localhost:4173/
```

| Script | |
|---|---|
| `npm run check` | typecheck + lint + tests + build + dist verification |
| `npm run typecheck` / `lint` / `test` | TypeScript, ESLint, Vitest |
| `npm run verify` | checks the built HTML: one h1, unique titles, descriptions, noindex, JSON-LD, internal links/images resolve, invoicing e-mail isolated |
| `npm run images` | regenerates `public/images` (AVIF/WebP/JPEG), favicon and OG image from `source-assets/` |

Build-time options are documented in [`.env.example`](.env.example)
(`BASE_PATH`, `SITE_URL`, `ALLOW_INDEXING`, `VITE_DEMO_MODE`, `VITE_QUOTE_ENDPOINT`).

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · React Router 8 · GSAP 3
(ScrollTrigger, SplitText, Flip) · Lucide · self-hosted fonts. Static
prerendering with React SSR (`scripts/prerender.mjs`) and hydration; routes
other than the home page are code-split and prefetched on link hover/focus and loaded before navigating.

## Structure

```
src/
  pages/            route components
  components/
    brand/          logo (traced SVG paths), spiral centre line
    home/           hero, logo intro and home sections
    layout/         header, mobile menu, footer, navigation links, reveal system
    references/     ledger, gallery, map
    contact/        quote form
    drawings/       technical service drawings
    ui/             shared pieces (picture, section heads, page hero …)
  content/          all company facts, services, references, photos, SEO – edit text here
  services/         form submission (mock / endpoint)
  lib/              motion helpers, validation, reference logic
  styles/           design tokens + global CSS
scripts/            prerender, image pipeline, dist checks, local Pages server, logo tracing
source-assets/      original files from karjalanmestarit.fi (rights pending)
docs/               provenance, content sources, deployment, form backend template
```

## Contact form

The form validates in the browser (accessible errors, error summary, honeypot)
but **sends nothing**: the default handler is a clearly labelled mock and the
UI says so after submitting. Setting `VITE_QUOTE_ENDPOINT` (https) switches to a
real endpoint; `docs/apps-script/Code.gs` is a ready template with server-side
validation, bot checks, rate limiting and optional Turnstile verification.

## Content accuracy

All company facts come from the current website (and the trade register for
the registration year). Unverifiable or ambiguous items are flagged rather than
invented – see [`docs/CONTENT_SOURCES.md`](docs/CONTENT_SOURCES.md).

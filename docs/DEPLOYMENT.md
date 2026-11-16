# Deployment

## Status

**Not published.** The repository exists only locally. Publication is blocked
until the company has approved the redesign and granted written permission to
reuse its logo and photographs (see `ASSET_PROVENANCE.md`). The live site
karjalanmestarit.fi, its domain, DNS, hosting and e-mail are untouched and must
stay that way.

## How the build works on GitHub Pages

- `npm run build` = client build → SSR build → `scripts/prerender.mjs`.
- Every route is written as `dist/<route>/index.html` with real, fully rendered
  content and its own title, description, Open Graph tags and JSON-LD. Direct
  visits and refreshes on nested routes return status 200 (Pages redirects
  `/palvelut` → `/palvelut/`). Unknown paths get `dist/404.html` (status 404),
  which renders the app's 404 view.
- `BASE_PATH` sets the sub-path (`/` for a custom domain, `/<repo>/` for a
  project site). The workflow derives it automatically.
- `SITE_URL` enables canonical URLs, `og:url`, absolute `og:image` and
  `sitemap.xml`. Leave it empty until the final domain is approved.
- Indexing is off by default (`<meta name="robots" content="noindex">` +
  `robots.txt Disallow`). Set `ALLOW_INDEXING=true` only for an approved
  production site.
- `.nojekyll` is written so Pages serves files as-is.

Local check of a production build, GitHub Pages style:

```bash
npm run build && npm run verify && npm run serve:pages   # http://localhost:4173/
```

## Steps to publish a private preview later (once rights are confirmed)

1. Create a **new, separate** repository, e.g. `karjalanmestarit-demo` – do not reuse an existing one.
   ```bash
   gh repo create karjalanmestarit-demo --private --source . --remote origin
   git push -u origin main
   ```
   (Pages on a private repo requires a paid GitHub plan; otherwise the site will be public.)
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Settings → Secrets and variables → Actions → **Variables**:
   - `ASSET_RIGHTS_CONFIRMED` = `true` – only after written permission for every asset.
   - optional `ALLOW_INDEXING` = `false` (default), `VITE_DEMO_MODE` = `true` (default).
4. Actions → **Deploy demo to GitHub Pages** → Run workflow → type `PUBLISH`.
5. Result: `https://<user>.github.io/karjalanmestarit-demo/` (noindex, demo label visible).

The CI workflow (`ci.yml`) runs typecheck, lint, tests, build and dist
verification on every push but never deploys.

## Before a real production launch

- Written approval of the redesign and copy by Karjalan Mestarit Oy.
- Rights for logo and every photo; preferably new, higher-resolution project photos.
- Re-verify contact data, staff and invoicing details (`CONTENT_SOURCES.md`).
- Connect a real form backend (e.g. `docs/apps-script/Code.gs`) + privacy notice (tietosuojaseloste); set `VITE_QUOTE_ENDPOINT`.
- Build with `VITE_DEMO_MODE=false`, `ALLOW_INDEXING=true`, `SITE_URL=https://karjalanmestarit.fi`, `BASE_PATH=/`.
- Connecting the real domain (DNS/hosting) requires separate, explicit authorisation from the company.
- Note: HTTPS on a GitHub Pages demo does not change anything about the current site's own HTTPS or server configuration.

/**
 * Static prerendering for GitHub Pages (or any static host).
 *
 * For every route in src/content/seo.ts this writes dist/<route>/index.html
 * containing the fully rendered page (React SSR) plus route-specific <title>,
 * description, Open Graph tags and JSON-LD. Direct visits and refreshes on
 * nested routes therefore return real HTML with status 200. Unknown paths get
 * dist/404.html (GitHub Pages serves it), which the SPA hydrates as its 404 view.
 *
 * Env:
 *   BASE_PATH       same value as for `vite build` (default "/")
 *   SITE_URL        absolute URL without trailing slash → canonical, og:url, sitemap
 *   ALLOW_INDEXING  "true" removes noindex and allows robots (keep off for the demo)
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');
const base = process.env.BASE_PATH ?? '/';
const siteUrl = process.env.SITE_URL?.replace(/\/$/, '') || '';
const allowIndexing = process.env.ALLOW_INDEXING === 'true';

const ssrEntry = readdirSync(ssrDir).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!ssrEntry) throw new Error('prerender: dist-ssr/entry-server.js not found – run the SSR build first');
const { render, preloadAll, pageMeta, notFoundMeta, company, contactGroups, services } = await import(pathToFileURL(join(ssrDir, ssrEntry)).href);
await preloadAll();

const template = readFileSync(join(dist, 'index.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const routeUrl = (path) => (path === '/' ? `${base}` : `${base}${path.slice(1)}/`);
const absUrl = (path) => (siteUrl ? siteUrl + (path === '/' ? '/' : `${path}/`) : '');

// Preload the Latin subset of the display font (hero headline renders with it)
const assets = readdirSync(join(dist, 'assets'));
const fontFile = assets.find((f) => /^mona-sans-latin-wdth-normal.*\.woff2$/.test(f));
const preload = fontFile ? `<link rel="preload" href="${base}assets/${fontFile}" as="font" type="font/woff2" crossorigin />` : '';

function jsonLd(meta) {
  const graph = [
    {
      '@type': 'RoofingContractor',
      '@id': siteUrl ? `${siteUrl}/#company` : '#company',
      name: company.name,
      ...(siteUrl ? { url: `${siteUrl}/`, logo: `${siteUrl}/favicon.svg`, image: `${siteUrl}/og-image.jpg` } : {}),
      telephone: `+358 ${company.phone.slice(1)}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.address.street,
        postalCode: company.address.postalCode,
        addressLocality: company.address.city,
        addressCountry: 'FI',
      },
      areaServed: company.areas.map((name) => ({ '@type': 'AdministrativeArea', name })),
      identifier: { '@type': 'PropertyValue', propertyID: 'Y-tunnus', value: company.businessId },
      employee: contactGroups.flatMap((g) => g.people.map((p) => ({ '@type': 'Person', name: p.name, jobTitle: p.role }))),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Palvelut',
        itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title } })),
      },
    },
  ];
  if (meta.crumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Etusivu', path: '/' }, ...meta.crumbs].map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        ...(siteUrl ? { item: absUrl(c.path) } : {}),
      })),
    });
  }
  const service = services.find((s) => meta.path === `/palvelut/${s.slug}`);
  if (service) {
    graph.push({
      '@type': 'Service',
      name: service.title,
      description: service.seoDescription,
      provider: { '@id': siteUrl ? `${siteUrl}/#company` : '#company' },
      areaServed: company.areas,
    });
  }
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
}

function page(meta, appHtml) {
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(meta.description)}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${esc(meta.title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(meta.description)}$2`)
    .replace('<!--app-html-->', appHtml)
    // main.tsx hydrates only when this matches the visited path (see there)
    .replace('<div id="root">', `<div id="root" data-path="${meta.path}">`);
  const head = [preload, jsonLd(meta)];
  if (siteUrl && meta.path !== '/404') {
    head.push(`<link rel="canonical" href="${absUrl(meta.path)}" />`, `<meta property="og:url" content="${absUrl(meta.path)}" />`);
    html = html.replace(/(<meta\s+property="og:image"\s+content=")([^"]*)(")/, (_, a, img, b) => a + siteUrl + img.slice(base.length - 1) + b);
  }
  html = html.replace('<!--head-extra-->', head.filter(Boolean).join('\n    '));
  if (allowIndexing) html = html.replace(/\s*<meta name="robots"[^>]*data-demo-robots[^>]*>/, '');
  return html;
}

if (!base.startsWith('/') || !base.endsWith('/') || /\s|%20|:/.test(base)) {
  throw new Error(`prerender: BASE_PATH must look like "/" or "/repo/", got "${base}" (Git Bash may rewrite it – set MSYS_NO_PATHCONV=1)`);
}
for (const meta of pageMeta) {
  const appHtml = render(routeUrl(meta.path));
  // A basename/route mismatch renders an empty shell – fail loudly instead of shipping it
  if (!appHtml.includes('<h1')) throw new Error(`prerender: ${meta.path} rendered without an <h1> (check BASE_PATH)`);
  const html = page(meta, appHtml);
  const out = meta.path === '/' ? join(dist, 'index.html') : join(dist, meta.path.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}
writeFileSync(join(dist, '404.html'), page(notFoundMeta, render(`${base}404-sivua-ei-loydy`)));

writeFileSync(
  join(dist, 'robots.txt'),
  allowIndexing ? `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}` : 'User-agent: *\nDisallow: /\n',
);
if (siteUrl) {
  const urls = pageMeta.map((m) => `  <url><loc>${absUrl(m.path)}</loc></url>`).join('\n');
  writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
writeFileSync(join(dist, '.nojekyll'), '');
if (existsSync(ssrDir)) rmSync(ssrDir, { recursive: true, force: true });

console.log(`prerender: ${pageMeta.length} routes + 404.html · indexing ${allowIndexing ? 'ON' : 'OFF'} · canonical ${siteUrl || '(none – SITE_URL not set)'}`);

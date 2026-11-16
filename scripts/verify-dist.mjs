/**
 * Post-build checks on the prerendered HTML in dist/:
 *   - exactly one <h1>, a unique <title> and a meta description per page
 *   - noindex present (unless ALLOW_INDEXING=true)
 *   - JSON-LD parses
 *   - every internal link resolves to a prerendered route or a file
 *   - every image/srcset/asset reference exists
 *   - external target=_blank links carry rel="noopener"
 *   - the invoicing e-mail only appears in the invoicing section
 *   - no "undefined" / "NaN" leaked into the markup
 * Usage: npm run verify   (after npm run build)
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const allowIndexing = process.env.ALLOW_INDEXING === 'true';
const INVOICE_EMAIL = 'karjalanmestarit@katepal.fi';

const pages = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) pages.push(p);
  }
})(dist);

const errors = [];
const titles = new Map();
const fail = (page, msg) => errors.push(`${relative(dist, page)}: ${msg}`);

function resolveLocal(url) {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  // React Router renders the home link as the bare basename ("/repo"); Pages redirects it to "/repo/"
  if (clean === base.slice(0, -1)) return true;
  if (!clean.startsWith(base)) return false;
  const rel = clean.slice(base.length);
  const target = join(dist, rel);
  if (existsSync(target) && statSync(target).isFile()) return true;
  return existsSync(join(target, 'index.html'));
}

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const body = html.slice(html.indexOf('<body'));
  const h1 = (body.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(page, `expected 1 <h1>, found ${h1}`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  if (!title) fail(page, 'missing <title>');
  else if (titles.has(title)) fail(page, `duplicate title (also ${titles.get(title)})`);
  else titles.set(title, relative(dist, page));

  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) fail(page, 'missing/short meta description');
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (!allowIndexing && !noindex) fail(page, 'missing noindex (demo must stay out of search engines)');
  if (allowIndexing && noindex) fail(page, 'noindex present although ALLOW_INDEXING=true');

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      fail(page, 'invalid JSON-LD');
    }
  }

  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|#|data:)/.test(url)) continue;
    if (!resolveLocal(url)) fail(page, `broken reference ${url}`);
  }
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/gi)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (!resolveLocal(url)) fail(page, `broken srcset entry ${url}`);
    }
  }
  for (const m of html.matchAll(/<a\s[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(m[0])) fail(page, `target=_blank without noopener: ${m[0].slice(0, 80)}`);
  }

  const invoiceHits = body.split(INVOICE_EMAIL).length - 1;
  if (invoiceHits) {
    const section = body.match(/<section id="laskutus"[\s\S]*?<\/section>/)?.[0] ?? '';
    if (section.split(INVOICE_EMAIL).length - 1 !== invoiceHits) fail(page, 'invoicing e-mail used outside the invoicing section');
  }

  const text = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  if (/\b(undefined|NaN)\b/.test(text)) fail(page, '"undefined" or "NaN" in visible text');
}

if (!existsSync(join(dist, 'robots.txt'))) errors.push('robots.txt missing');
if (!existsSync(join(dist, '.nojekyll'))) errors.push('.nojekyll missing');

if (errors.length) {
  console.error(`verify-dist: ${errors.length} problem(s)\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`verify-dist: ${pages.length} pages OK (titles unique, 1×h1, links/images resolve, noindex ${allowIndexing ? 'off' : 'on'})`);

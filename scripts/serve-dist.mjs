/**
 * Minimal static server that behaves like GitHub Pages, for local testing of
 * the production build:
 *   - /path/       → dist/path/index.html
 *   - /path        → 301 to /path/ when dist/path/ is a directory
 *   - unknown path → dist/404.html with status 404
 * The BASE_PATH prefix (if the build used one) is stripped.
 *
 * Usage: npm run serve:pages   (PORT=4173 BASE_PATH=/repo/ optional)
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const port = Number(process.env.PORT ?? 4173);
const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
};

const send = (res, file, status = 200) => {
  res.writeHead(status, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
  createReadStream(file).pipe(res);
};

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let path = decodeURIComponent(url.pathname);
  if (!path.startsWith(base)) return send(res, join(dist, '404.html'), 404);
  path = '/' + path.slice(base.length);
  const file = normalize(join(dist, path));
  if (!file.startsWith(dist)) return send(res, join(dist, '404.html'), 404);
  if (existsSync(file) && statSync(file).isFile()) return send(res, file);
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!url.pathname.endsWith('/')) {
      res.writeHead(301, { Location: `${url.pathname}/${url.search}` });
      return res.end();
    }
    if (existsSync(join(file, 'index.html'))) return send(res, join(file, 'index.html'));
  }
  send(res, join(dist, '404.html'), 404);
}).listen(port, () => console.log(`GitHub Pages-like server: http://localhost:${port}${base}`));

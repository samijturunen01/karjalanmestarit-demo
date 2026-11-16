/**
 * Image pipeline: source-assets/ → public/images/ (+ favicon, OG image).
 *
 *  - photos listed in src/content/photos.ts are resized to their `widths`
 *    and written as AVIF, WebP and JPEG (metadata stripped);
 *  - favicon.svg / apple-touch-icon.png / favicon-32.png are drawn from the
 *    traced logo paths (src/components/brand/logoPaths.ts);
 *  - og-image.jpg (1200×630) combines the logo with a roof photo.
 *
 * Run: npm run images   (Node ≥ 22.18 – imports .ts modules directly)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { photos } from '../src/content/photos.ts';
import { logoPaths } from '../src/components/brand/logoPaths.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'source-assets/karjalanmestarit-fi');
const OUT = join(root, 'public/images');
const PUBLIC = join(root, 'public');
mkdirSync(OUT, { recursive: true });

let count = 0;
for (const photo of Object.values(photos)) {
  for (const w of photo.widths) {
    const base = sharp(join(SRC, photo.source)).rotate().resize({ width: w, withoutEnlargement: true });
    const name = `${photo.slug}-${w}`;
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(join(OUT, `${name}.avif`));
    await base.clone().webp({ quality: 74, effort: 5 }).toFile(join(OUT, `${name}.webp`));
    await base.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(join(OUT, `${name}.jpg`));
    count += 3;
  }
}
console.log(`images: ${count} files → public/images`);

// ── Brand assets ────────────────────────────────────────────────────────────
const RED = '#FF0000';
const PAPER = '#EEEAE2';
const markSvg = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="5 36 108 102">${
  bg ? `<rect x="5" y="36" width="108" height="102" fill="${bg}"/>` : ''
}<path d="${logoPaths.spiral}" fill="#000" stroke="${RED}" stroke-width="0.7" paint-order="stroke"/><path d="${logoPaths.houseLine}" fill="${RED}"/><path d="${logoPaths.houseFill}" fill="#fff"/></svg>`;

writeFileSync(join(PUBLIC, 'favicon.svg'), markSvg(null));
await sharp(Buffer.from(markSvg(PAPER))).resize(180, 180, { fit: 'contain', background: PAPER }).png().toFile(join(PUBLIC, 'apple-touch-icon.png'));
await sharp(Buffer.from(markSvg(null)), { density: 300 }).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(join(PUBLIC, 'favicon-32.png'));

// OG image: paper sheet, logo, and a roof-silhouette photo band
const W = 1200;
const H = 630;
const band = await sharp(join(SRC, photos.redShingleFlashing.source))
  .resize(W, 300, { fit: 'cover', position: 'left' })
  .toBuffer();
const roofMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="300"><polygon points="0,150 ${W * 0.68},20 ${W},96 ${W},300 0,300" fill="#fff"/></svg>`,
);
const bandMasked = await sharp(band).composite([{ input: roofMask, blend: 'dest-in' }]).png().toBuffer();
const logoSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="221" viewBox="0 0 350 138"><path d="${logoPaths.spiral}" fill="#000" stroke="${RED}" stroke-width="0.7" paint-order="stroke"/><path d="${logoPaths.houseLine}" fill="${RED}"/><path d="${logoPaths.houseFill}" fill="#fff"/><path d="${logoPaths.karjalan}" fill="#000"/><path d="${logoPaths.mestarit}" fill="${RED}"/></svg>`,
);
const grid = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#161514" stroke-opacity="0.06"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#g)"/><line x1="0" y1="${H - 1}" x2="${W}" y2="${H - 1}" stroke="#161514" stroke-opacity="0.2"/></svg>`,
);
await sharp({ create: { width: W, height: H, channels: 3, background: PAPER } })
  .composite([
    { input: grid, top: 0, left: 0 },
    { input: logoSvg, top: 70, left: 80 },
    { input: bandMasked, top: H - 300, left: 0 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(join(PUBLIC, 'og-image.jpg'));
console.log('brand: favicon.svg, favicon-32.png, apple-touch-icon.png, og-image.jpg');

/**
 * How src/components/brand/logoPaths.ts was made (kept for reproducibility).
 *
 * Source: the official logo on karjalanmestarit.fi
 *   https://karjalanmestarit.fi/wp-content/uploads/2019/06/Karjalan-Mestarit-Oy_logo.png
 *   (350×138 px RGBA: black #000000, red #FF0000, a white house; edges were
 *   anti-aliased against white before the background was removed)
 *   saved to source-assets/karjalanmestarit-fi/Karjalan-Mestarit-Oy_logo.png
 *
 * Steps
 *  1. Coverage per colour class at native resolution. The logo only mixes
 *     black (0,0,0), red (255,0,0) and white (255,255,255), so a pixel's
 *     unpremultiplied colour decomposes as wW = g/255, wR = (r−g)/255,
 *     wB = 1 − r/255; coverage = alpha × weight.
 *  2. Each coverage map is upscaled 8× (Lanczos) on its own, lightly blurred
 *     and thresholded at 50 % → potrace.
 *  3. Contours are grouped by bounding box: spiral, house, "Karjalan",
 *     "Mestarit". The red hairline around the spiral in the source is
 *     reproduced as a thin red stroke on the spiral (see Logo.tsx), so it is
 *     not traced separately; the white anti-aliasing fringe is discarded.
 *  4. Coordinates are written in the original 350×138 unit space.
 *
 * Not a project dependency (potrace pulls in an old jimp). To re-run:
 *   npm i --no-save potrace && node scripts/tools/trace-logo.mjs [node_modules dir]
 */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const req = createRequire(process.argv[2] ? join(process.argv[2], '/') : join(root, 'package.json'));
const sharp = req('sharp');
const potrace = req('potrace');

const SRC = join(root, 'source-assets/karjalanmestarit-fi/Karjalan-Mestarit-Oy_logo.png');
const OUT = join(root, 'src/components/brand/logoPaths.ts');
const S = 8;
const W0 = 350;
const H0 = 138;
const W = W0 * S;
const H = H0 * S;

// 1 — coverage maps (potrace traces dark pixels → store 255 − coverage)
const { data } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const cov = { black: Buffer.alloc(W0 * H0), red: Buffer.alloc(W0 * H0), white: Buffer.alloc(W0 * H0) };
for (let i = 0, j = 0; j < W0 * H0; i += 4, j++) {
  const [r, g, a] = [data[i], data[i + 1], data[i + 3] / 255];
  cov.black[j] = 255 - Math.round(255 * a * Math.max(0, 1 - r / 255));
  cov.red[j] = 255 - Math.round(255 * a * Math.max(0, (r - g) / 255));
  cov.white[j] = 255 - Math.round(255 * a * (g / 255));
}

// 2 — upscale, smooth, threshold
async function prepare(buf, blur, cut = 128) {
  const up = await sharp(buf, { raw: { width: W0, height: H0, channels: 1 } })
    .resize(W, H, { kernel: 'lanczos3' })
    .blur(blur)
    .extractChannel(0)
    .raw()
    .toBuffer();
  for (let j = 0; j < up.length; j++) up[j] = up[j] < cut ? 0 : 255;
  return sharp(up, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
}

function trace(png, turdSize, alphaMax = 1) {
  const t = new potrace.Potrace({ turdSize, optTolerance: 0.3, alphaMax, threshold: 128 });
  return new Promise((res, rej) =>
    t.loadImage(png, (e) => (e ? rej(e) : res(t.getPathTag().match(/ d="([^"]+)"/)[1]))),
  );
}

function contours(d) {
  return d
    .trim()
    .split(/(?=M)/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const nums = s.match(/-?\d+(\.\d+)?/g).map(Number);
      const xs = nums.filter((_, i) => i % 2 === 0);
      const ys = nums.filter((_, i) => i % 2 === 1);
      return { d: s, x0: Math.min(...xs) / S, x1: Math.max(...xs) / S, y0: Math.min(...ys) / S, y1: Math.max(...ys) / S };
    });
}

// Curves (spiral, house) get a softer pass; letters a crisper one that keeps
// the corners of the heavy condensed type.
const blackSoft = contours(await trace(await prepare(cov.black, 2.2), 400));
const blackCrisp = contours(await trace(await prepare(cov.black, 1.1), 400, 0.85));
const redSoft = contours(await trace(await prepare(cov.red, 1.6), 260));
const redCrisp = contours(await trace(await prepare(cov.red, 1.1), 260, 0.85));
// The house fill: strict threshold so only solid white survives
const white = contours(await trace(await prepare(cov.white, 1.2, 70), 260));

// 3 — grouping
const HOUSE = { x0: 43, x1: 78, y0: 65, y1: 92 };
const inHouse = (c) => c.x0 >= HOUSE.x0 && c.x1 <= HOUSE.x1 && c.y0 >= HOUSE.y0 && c.y1 <= HOUSE.y1;
const isSpiral = (c) => c.x1 < 112 && c.y0 > 38;

const groups = {
  spiral: blackSoft.filter(isSpiral),
  karjalan: blackCrisp.filter((c) => !isSpiral(c)),
  mestarit: redCrisp.filter((c) => c.x0 > 110),
  houseLine: redSoft.filter(inHouse),
  houseFill: white.filter(inHouse),
};
for (const [k, v] of Object.entries(groups)) {
  console.log(k.padEnd(10), v.length, v.map((c) => `[${c.x0.toFixed(0)}-${c.x1.toFixed(0)}×${c.y0.toFixed(0)}-${c.y1.toFixed(0)}]`).join(' '));
}

// 4 — output: rescale to unit space and write compact relative commands with
// one decimal (0.1 unit ≈ 0.2 px even at a 640 px wide logo).
function compact(d) {
  const tokens = d.match(/[MLCZ]|-?\d+(?:\.\d+)?/gi);
  const r1 = (n) => Math.round(n * 10) / 10;
  const fmt = (nums) =>
    nums
      .map((n, i) => {
        const s = String(r1(n)).replace(/^(-?)0\./, '$1.');
        return i === 0 || s.startsWith('-') ? s : ` ${s}`;
      })
      .join('');
  let out = '';
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i++].toUpperCase();
    const take = (k) => tokens.slice(i, (i += k)).map((v) => Number(v) / S);
    if (cmd === 'M') {
      const [x, y] = take(2);
      out += `M${fmt([x, y])}`;
      // keep absolute start, but track the rounded position to avoid drift
      cx = sx = r1(x);
      cy = sy = r1(y);
    } else if (cmd === 'L') {
      while (i < tokens.length && !/[A-Z]/i.test(tokens[i])) {
        const [x, y] = take(2);
        out += `l${fmt([x - cx, y - cy])}`;
        cx = r1(cx + r1(x - cx));
        cy = r1(cy + r1(y - cy));
      }
    } else if (cmd === 'C') {
      while (i < tokens.length && !/[A-Z]/i.test(tokens[i])) {
        const [x1, y1, x2, y2, x, y] = take(6);
        out += `c${fmt([x1 - cx, y1 - cy, x2 - cx, y2 - cy, x - cx, y - cy])}`;
        cx = r1(cx + r1(x - cx));
        cy = r1(cy + r1(y - cy));
      }
    } else if (cmd === 'Z') {
      out += 'z';
      cx = sx;
      cy = sy;
    }
  }
  return out;
}
const joined = (list) => list.map((c) => compact(c.d)).join('');
const ts = `/**
 * Karjalan Mestarit Oy – logo recreated as SVG paths.
 * Traced from the official 350×138 logo on karjalanmestarit.fi
 * (see scripts/tools/trace-logo.mjs). Unit space: 350 × 138.
 * Source colours: black #000000, red #FF0000, white house.
 * GENERATED FILE – do not edit by hand.
 */
export const LOGO_W = ${W0};
export const LOGO_H = ${H0};

export const logoPaths = {
${Object.entries(groups)
  .map(([k, v]) => `  ${k}: '${joined(v)}',`)
  .join('\n')}
} as const;
`;
writeFileSync(OUT, ts);
console.log('wrote', OUT, (ts.length / 1024).toFixed(1), 'KB');

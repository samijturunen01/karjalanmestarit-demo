/**
 * Centre line of the logo's spiral, measured from the original logo by casting
 * rays from the spiral centre every 15° and taking the middle of each black
 * band (see scripts/tools/trace-logo.mjs for the source file).
 *
 * The spiral is one continuous band: it starts as a thin tip on the right
 * (θ ≈ 15°), winds clockwise (screen coordinates, y down) about 2½ turns and
 * ends as a thin tail under the house. The intro animation reveals the traced
 * spiral through a mask stroked along this line, so the band "winds in"
 * exactly the way it is drawn in the logo.
 */
export const SPIRAL_CENTER = { x: 58, y: 86 } as const;

/** [angle in degrees, centre-line radius] in the 350 × 138 logo unit space */
const SAMPLES: ReadonlyArray<readonly [number, number]> = [
  [10, 49], [15, 48], [30, 45.7], [45, 43.5], [60, 41.8], [75, 40.4], [90, 39.6], [105, 39.2],
  [120, 39.4], [135, 40], [150, 40.7], [165, 41.4], [180, 42], [195, 42.1], [210, 41.6],
  [225, 40.6], [240, 39.5], [255, 38.6], [270, 38], [285, 37.6], [300, 36.6], [315, 35.6],
  [330, 35.3], [345, 33.9], [360, 31.9], [375, 29.2], [390, 26.3], [405, 23.9], [420, 22.1],
  [435, 21], [450, 20.1], [465, 19.9], [480, 20.2], [495, 20.4], [510, 20.6], [525, 21.8],
  [540, 22.4], [555, 22.7], [570, 22.8], [585, 22.6], [600, 22.2], [615, 22.4], [630, 22.8],
  [645, 23.6], [660, 23.2], [675, 22.8], [690, 23], [705, 19.6], [720, 18.5], [735, 15.6],
  [750, 13], [765, 10.9], [780, 9.7], [795, 9.1], [810, 8.6], [825, 8.6], [840, 8.9],
  [855, 9.6], [870, 11], [885, 11.6], [900, 11.9], [915, 12.2], [930, 11.9], [940, 12],
];

function radiusAt(deg: number): number {
  for (let i = 1; i < SAMPLES.length; i++) {
    const [a1, r1] = SAMPLES[i];
    if (deg <= a1) {
      const [a0, r0] = SAMPLES[i - 1];
      return r0 + ((r1 - r0) * (deg - a0)) / (a1 - a0);
    }
  }
  return SAMPLES[SAMPLES.length - 1][1];
}

/** SVG path data for the spiral centre line, sampled every `step` degrees. */
export function spiralCenterline(step = 5): string {
  const first = SAMPLES[0][0];
  const last = SAMPLES[SAMPLES.length - 1][0];
  const pts: string[] = [];
  for (let deg = first; deg <= last; deg += step) {
    const r = radiusAt(deg);
    const t = (deg * Math.PI) / 180;
    const x = SPIRAL_CENTER.x + r * Math.cos(t);
    const y = SPIRAL_CENTER.y + r * Math.sin(t);
    pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join(' ');
}

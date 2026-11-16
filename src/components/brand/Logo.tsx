import type { SVGProps } from 'react';
import { LOGO_H, LOGO_W, logoPaths } from './logoPaths';

export type LogoVariant = 'color' | 'reverse';

/** Authentic logo colours (measured from the original PNG). */
export const LOGO_RED = '#FF0000';
const INK = { color: '#000000', reverse: '#EEEAE2' } as const;

interface LogoProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  variant?: LogoVariant;
  /** Accessible name; pass '' to hide from assistive tech (e.g. when a parent link is labelled) */
  title?: string;
}

/** The Karjalan Mestarit Oy logo, recreated as SVG from the original artwork. */
export function Logo({ variant = 'color', title = 'Karjalan Mestarit Oy', ...rest }: LogoProps) {
  const ink = INK[variant];
  return (
    <svg
      viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      <LogoArt ink={ink} />
    </svg>
  );
}

/** The logo's layers, shared by the static logo and the intro animation. */
export function LogoArt({ ink = '#000000' }: { ink?: string }) {
  return (
    <>
      <path data-logo="spiral" d={logoPaths.spiral} fill={ink} stroke={LOGO_RED} strokeWidth={0.7} paintOrder="stroke" />
      <g data-logo="house">
        <path d={logoPaths.houseLine} fill={LOGO_RED} />
        <path d={logoPaths.houseFill} fill="#FFFFFF" />
      </g>
      <path data-logo="karjalan" d={logoPaths.karjalan} fill={ink} />
      <path data-logo="mestarit" d={logoPaths.mestarit} fill={LOGO_RED} />
    </>
  );
}

/** Spiral + house only (favicon-style mark). */
export function LogoMark({ variant = 'color', ...rest }: Omit<LogoProps, 'title'>) {
  return (
    <svg viewBox="7 38 104 98" aria-hidden="true" focusable="false" {...rest}>
      <path d={logoPaths.spiral} fill={INK[variant]} stroke={LOGO_RED} strokeWidth={0.7} paintOrder="stroke" />
      <path d={logoPaths.houseLine} fill={LOGO_RED} />
      <path d={logoPaths.houseFill} fill="#FFFFFF" />
    </svg>
  );
}

import {
  ArrowDown as LArrowDown,
  ArrowRight as LArrowRight,
  ArrowUp as LArrowUp,
  ArrowUpRight as LArrowUpRight,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';

/** Lucide icons with the site's hairline stroke and decorative defaults. */
const withDefaults = (Icon: ComponentType<LucideProps>) =>
  function SiteIcon(props: LucideProps) {
    return <Icon aria-hidden="true" strokeWidth={1.6} absoluteStrokeWidth={false} {...props} />;
  };

export const ArrowRight = withDefaults(LArrowRight);
export const ArrowUpRight = withDefaults(LArrowUpRight);
export const ArrowDown = withDefaults(LArrowDown);
export const ArrowUp = withDefaults(LArrowUp);

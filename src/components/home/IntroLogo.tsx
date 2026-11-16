import { useId, useRef } from 'react';
import { gsap, useIsoLayoutEffect } from '../../lib/motion';
import { LOGO_RED } from '../brand/Logo';
import { LOGO_H, LOGO_W, logoPaths } from '../brand/logoPaths';
import { SPIRAL_CENTER, spiralCenterline } from '../brand/spiral';

interface Props {
  /** The logo starts flying to the header – start the hero reveal now */
  onFly: () => void;
  /** Logo has landed; the overlay can be removed */
  onDone: () => void;
}

const CENTERLINE = spiralCenterline(4);
const GRAPHITE = '#161514';

/**
 * Signature intro, "Talosta kotiin" (from a house to a home):
 *  1. graphite construction lines draw a house outline and the spiral's guide circle
 *  2. the spiral winds in along its own centre line (mask), outer tip → centre
 *  3. the little house settles into the centre
 *  4. "Karjalan" and "Mestarit" rise from their baselines
 *  5. guides fade; the logo flies into the header slot (FLIP)
 * Runs once per session; any scroll / key / tap fast-forwards it.
 */
export function IntroLogo({ onFly, onDone }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');
  const maskId = `km-spiral-${id}`;
  const clipK = `km-k-${id}`;
  const clipM = `km-m-${id}`;

  useIsoLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    let flew = false;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

      tl.to(q('[data-guide]'), { strokeDashoffset: 0, duration: 0.95, stagger: 0.05 }, 0)
        .to(q('[data-silhouette]'), { strokeDashoffset: 0, duration: 1.1, ease: 'power3.inOut' }, 0.1)
        .to(q('[data-label]'), { opacity: 1, duration: 0.5, stagger: 0.08 }, 0.35)
        .to(q('[data-spiral-mask]'), { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.4)
        .fromTo(
          q('[data-house]'),
          { scale: 0.25, opacity: 0, svgOrigin: '60 80' },
          { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2.2)' },
          1.45,
        )
        .fromTo(q('[data-word="k"]'), { y: 66 }, { y: 0, duration: 1.05, ease: 'power4.out' }, 1.2)
        .fromTo(q('[data-word="m"]'), { y: 60 }, { y: 0, duration: 1.05, ease: 'power4.out' }, 1.34)
        .to(q('[data-guide], [data-silhouette], [data-label]'), { opacity: 0, duration: 0.6, ease: 'power1.out' }, 2.05)
        .add(() => {
          // FLIP into the header logo slot
          const target = document.querySelector<HTMLElement>('[data-header-logo] svg');
          const bounds = el.querySelector<SVGRectElement>('[data-bounds]');
          if (!target || !bounds) return;
          const t = target.getBoundingClientRect();
          const b = bounds.getBoundingClientRect();
          const box0 = el.getBoundingClientRect();
          const s = t.width / b.width;
          const lx = b.left - box0.left;
          const ly = b.top - box0.top;
          flew = true;
          onFly();
          gsap.to(el, {
            x: t.left - box0.left - s * lx,
            y: t.top - box0.top - s * ly,
            scale: s,
            transformOrigin: '0 0',
            duration: 1.05,
            ease: 'expo.inOut',
            onComplete: onDone,
          });
        }, 2.3);

      // Fast-forward on any user intent; never hold the visitor back.
      const hurry = () => tl.timeScale(3.2);
      const opts = { passive: true, once: true } as const;
      window.addEventListener('wheel', hurry, opts);
      window.addEventListener('touchstart', hurry, opts);
      window.addEventListener('keydown', hurry, { once: true });
      return () => {
        window.removeEventListener('wheel', hurry);
        window.removeEventListener('touchstart', hurry);
        window.removeEventListener('keydown', hurry);
      };
    }, el);

    return () => {
      ctx.revert();
      if (!flew) onFly();
    };
  }, []);

  // Construction drawing: house outline enclosing the spiral (in logo units)
  const silhouette = 'M3 132 L3 80 L58 28 L113 80 L113 132 Z';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] grid place-items-center px-4">
      <div ref={box} className="w-[min(84vw,40rem)] will-change-transform">
        <svg viewBox={`-34 -22 ${LOGO_W + 68} ${LOGO_H + 44}`} className="h-auto w-full overflow-visible">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="-10" y="20" width="140" height="130">
              <path
                data-spiral-mask
                d={CENTERLINE}
                fill="none"
                stroke="#fff"
                strokeWidth={15.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1}
              />
            </mask>
            <clipPath id={clipK}>
              <rect x="66" y="-4" width="250" height="73.6" />
            </clipPath>
            <clipPath id={clipM}>
              <rect x="104" y="68.6" width="246" height="60" />
            </clipPath>
          </defs>

          {/* logo bounds – used to measure the FLIP to the header */}
          <rect data-bounds x="0" y="0" width={LOGO_W} height={LOGO_H} fill="none" />

          <g fill="none" stroke={GRAPHITE} strokeOpacity={0.45} strokeWidth={0.6}>
            {/* baselines and cap line */}
            <line data-guide x1="-30" y1="6.5" x2="376" y2="6.5" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} />
            <line data-guide x1="-30" y1="62.5" x2="376" y2="62.5" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} />
            <line data-guide x1="-30" y1="124.6" x2="376" y2="124.6" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} />
            {/* spiral axes */}
            <line data-guide x1={SPIRAL_CENTER.x} y1="16" x2={SPIRAL_CENTER.x} y2="150" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} />
            <line data-guide x1="-14" y1={SPIRAL_CENTER.y} x2="130" y2={SPIRAL_CENTER.y} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} />
            <circle data-guide cx={SPIRAL_CENTER.x} cy={SPIRAL_CENTER.y} r="49.5" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} />
          </g>
          <path
            data-silhouette
            d={silhouette}
            fill="none"
            stroke={LOGO_RED}
            strokeOpacity={0.75}
            strokeWidth={0.8}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1}
          />
          <g className="t-mono hidden sm:block" fill={GRAPHITE} fillOpacity={0.6} fontSize="4.6" letterSpacing="0.4">
            <text data-label x="-30" y="-8" opacity="0">
              KM — 01 / LOGO
            </text>
            <text data-label x="115" y="34" opacity="0">
              R 49,5
            </text>
            <text data-label x="376" y="140" textAnchor="end" opacity="0">
              62°36′ N · 29°46′ E — JOENSUU
            </text>
          </g>

          <g mask={`url(#${maskId})`}>
            <path d={logoPaths.spiral} fill="#000" stroke={LOGO_RED} strokeWidth={0.7} paintOrder="stroke" />
          </g>
          <g data-house opacity="0">
            <path d={logoPaths.houseLine} fill={LOGO_RED} />
            <path d={logoPaths.houseFill} fill="#fff" />
          </g>
          <g clipPath={`url(#${clipK})`}>
            <path data-word="k" d={logoPaths.karjalan} fill="#000" transform="translate(0 66)" />
          </g>
          <g clipPath={`url(#${clipM})`}>
            <path data-word="m" d={logoPaths.mestarit} fill={LOGO_RED} transform="translate(0 60)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

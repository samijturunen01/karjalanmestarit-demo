import type { ReactNode, SVGProps } from 'react';
import type { DrawingKind } from '../../content/services';

/**
 * Technical line drawings, one per service – generic illustrations of the
 * type of work (not drawings of any specific project). Strokes marked
 * [data-draw] are drawn in by the reveal system; [data-fill] fades in after.
 */

interface Props extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  kind: DrawingKind;
  /** Accent colour for the "work" element (membrane, flashing, …) */
  accent?: string;
  title?: string;
}

const D = { 'data-draw': true, pathLength: 1 } as const;

function Label({ x, y, children, anchor = 'start' }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'end' | 'middle' }) {
  return (
    <text data-fill x={x} y={y} textAnchor={anchor} className="t-mono" fontSize="10.5" letterSpacing="1" fill="currentColor" stroke="none" opacity={0.85}>
      {children}
    </text>
  );
}

function Leader({ d }: { d: string }) {
  return <path {...D} d={d} strokeOpacity={0.55} />;
}

function hatch(x0: number, y0: number, x1: number, y1: number, step = 14) {
  const out: string[] = [];
  for (let x = x0 - (y1 - y0); x < x1; x += step) {
    const ax = Math.max(x, x0);
    const ay = y1 - (ax - x);
    const bx = Math.min(x + (y1 - y0), x1);
    const by = y1 - (bx - x);
    if (bx > ax) out.push(`M${ax} ${ay}L${bx} ${by}`);
  }
  return out.join('');
}

const drawings: Record<DrawingKind, (accent: string) => ReactNode> = {
  layers: (a) => (
    <>
      <path {...D} d="M30 236H450M30 290H450M30 236V290M450 236V290" />
      <path {...D} d={hatch(30, 236, 450, 290, 16)} strokeOpacity={0.35} />
      <path {...D} d="M30 226H230L238 222H450" />
      <path {...D} d="M30 214H160L168 208H450" stroke={a} strokeWidth={3} />
      <g data-fill fill="currentColor" stroke="none" opacity={0.6}>
        {Array.from({ length: 34 }, (_, i) => {
          const cx = 36 + i * 12.4;
          // the top sheet steps up at its lap (x ≈ 164)
          return <circle key={i} cx={cx} cy={cx > 166 ? 204 : 210} r={1.3} />;
        })}
      </g>
      <circle {...D} cx="164" cy="211" r="22" stroke={a} strokeOpacity={0.9} />
      <Leader d="M182 196L230 132H262" />
      <Label x={268} y={128}>LIMITYS JA SAUMA</Label>
      <Leader d="M380 208V96H400" />
      <Label x={406} y={92}>PINTAKERMI</Label>
      <Leader d="M330 222V156H350" />
      <Label x={356} y={152}>ALUSKERMI</Label>
      <Leader d="M110 290V318H130" />
      <Label x={136} y={322}>ALUSTA</Label>
      <path {...D} d="M70 120C70 132 62 140 62 148A8 8 0 0 0 78 148C78 140 70 132 70 120Z" stroke={a} />
      <path {...D} d="M70 166V188M64 182L70 188L76 182" />
    </>
  ),
  flashing: (a) => (
    <>
      <path {...D} d="M40 96L330 222" strokeWidth={1.5} />
      <path {...D} d="M40 112L322 234" />
      <path {...D} d="M322 234V312H352V236" />
      <path {...D} d={hatch(322, 236, 352, 312, 10)} strokeOpacity={0.35} />
      <path {...D} d="M262 196L338 229L360 238V266L370 276" stroke={a} strokeWidth={3} strokeLinejoin="round" />
      <path {...D} d="M378 276A26 26 0 0 0 430 276" />
      <path {...D} d="M378 276H372M430 276H436" />
      <path {...D} d="M404 302V330" strokeOpacity={0.6} />
      <path {...D} d="M140 150L180 167M156 142L196 159" strokeOpacity={0.45} />
      <path {...D} d="M380 252C380 262 375 266 375 270A5 5 0 0 0 385 270C385 266 380 262 380 252Z" stroke={a} />
      <Leader d="M300 210L270 120H250" />
      <Label x={244} y={116} anchor="end">
        RÄYSTÄSPELTI
      </Label>
      <Leader d="M322 292H262" />
      <Label x={256} y={296} anchor="end">
        OTSALAUTA
      </Label>
      <Leader d="M430 260L452 230" />
      <Label x={452} y={222} anchor="end">
        KOURU
      </Label>
      <Leader d="M110 132L92 70H72" />
      <Label x={66} y={66} anchor="end">
        KATE
      </Label>
    </>
  ),
  truss: (a) => (
    <>
      <path {...D} d="M30 286H450" strokeWidth={1.5} />
      <path {...D} d="M30 286L240 112L450 286" strokeWidth={1.5} />
      <path {...D} d="M30 272L240 98L450 272" stroke={a} strokeWidth={2.5} />
      <path {...D} d="M100 286L135 199M135 199L170 286M170 286L240 112M240 112L310 286M310 286L345 199M345 199L380 286" strokeOpacity={0.7} />
      <path {...D} d="M240 112V286" strokeOpacity={0.4} />
      <g data-fill stroke="none" fill="currentColor" opacity={0.75}>
        {Array.from({ length: 9 }, (_, i) => {
          const t = (i + 0.6) / 9.4;
          const lx = 30 + 210 * t;
          const ly = 272 - 174 * t;
          const rx = 450 - 210 * t;
          return (
            <g key={i}>
              <rect x={lx - 4} y={ly - 9} width={8} height={6} transform={`rotate(-39.6 ${lx} ${ly - 6})`} />
              <rect x={rx - 4} y={ly - 9} width={8} height={6} transform={`rotate(39.6 ${rx} ${ly - 6})`} />
            </g>
          );
        })}
      </g>
      <Leader d="M240 92V52H262" />
      <Label x={268} y={56}>HARJA</Label>
      <Leader d="M112 200L82 150H64" />
      <Label x={58} y={146} anchor="end">
        RUOTEET
      </Label>
      <Leader d="M380 230L410 170H424" />
      <Label x={430} y={166}>LAUDOITUS</Label>
      <Leader d="M200 286V318H222" />
      <Label x={228} y={322}>KATTOTUOLI</Label>
    </>
  ),
  inspection: (a) => (
    <>
      <path {...D} d="M40 300V170L240 64L440 170V300Z" strokeWidth={1.5} />
      <path {...D} d="M20 180L240 54L460 180" strokeWidth={1.5} />
      <path {...D} d="M318 104V60H346V120" />
      <path {...D} d="M314 60H350" />
      <path {...D} d="M20 180L14 186M460 180L466 186" />
      <path {...D} d="M466 186V300" strokeOpacity={0.6} />
      <path {...D} d="M150 300V236H200V300M290 214H340V254H290Z" strokeOpacity={0.45} />
      {(
        [
          [240, 54, '1'],
          [332, 108, '2'],
          [330, 60, '3'],
          [30, 182, '4'],
          [466, 236, '5'],
        ] as const
      ).map(([cx, cy, n]) => (
        <g key={n} data-fill>
          <circle cx={cx} cy={cy} r={11} fill={a} stroke="none" />
          <text x={cx} y={cy + 3.8} textAnchor="middle" fontSize="11" className="t-mono" fill="#fff" stroke="none" fontWeight={600}>
            {n}
          </text>
        </g>
      ))}
      <g data-fill className="t-mono" fontSize="10.5" letterSpacing="1" fill="currentColor" stroke="none" opacity={0.85}>
        <text x="60" y="330">1 HARJA · 2 LÄPIVIENNIT · 3 PELLITYKSET · 4 RÄYSTÄS · 5 VEDENPOISTO</text>
      </g>
    </>
  ),
  foundation: (a) => (
    <>
      <path {...D} d="M20 110H220" strokeWidth={1.5} />
      <path {...D} d="M320 110H460" strokeWidth={1.5} />
      <path {...D} d={hatch(20, 112, 220, 300, 18)} strokeOpacity={0.25} />
      <path {...D} d="M220 40V270H200V310H340V270H320V40" strokeWidth={1.5} />
      <path {...D} d={hatch(222, 42, 318, 268, 14)} strokeOpacity={0.4} />
      <path {...D} d="M214 120V268H196" stroke={a} strokeWidth={3.5} strokeLinejoin="round" />
      <path {...D} d="M214 120V96" stroke={a} strokeWidth={3.5} strokeOpacity={0.5} />
      <circle {...D} cx="160" cy="292" r="14" />
      <g data-fill fill="currentColor" stroke="none" opacity={0.5}>
        {Array.from({ length: 28 }, (_, i) => (
          <circle key={i} cx={120 + (i % 7) * 13 + (Math.floor(i / 7) % 2) * 6} cy={262 + Math.floor(i / 7) * 13} r={2.2} />
        ))}
      </g>
      <Leader d="M60 110V76H40" />
      <Label x={34} y={72} anchor="end">
        MAANPINTA
      </Label>
      <Leader d="M214 180H120V160H100" />
      <Label x={94} y={156} anchor="end">
        VEDENERISTYS
      </Label>
      <Leader d="M340 290H392" />
      <Label x={398} y={294}>PERUSTUS</Label>
      <Leader d="M150 304L130 334H112" />
      <Label x={106} y={338} anchor="end">
        SALAOJA
      </Label>
    </>
  ),
};

export function ServiceDrawing({ kind, accent = 'var(--color-signal)', title, className, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 480 350"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="butt"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`overflow-visible ${className ?? ''}`}
      {...rest}
    >
      {drawings[kind](accent)}
    </svg>
  );
}

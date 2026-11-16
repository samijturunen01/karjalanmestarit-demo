import { municipalityCoords, type Municipality } from '../../content/references';

interface Props {
  data: { name: Municipality; count: number }[];
  className?: string;
}

// Equirectangular projection scaled by cos(latitude) – fine at this scale.
const LON0 = 26.95;
const LON1 = 30.55;
const LAT0 = 61.72;
const LAT1 = 63.48;
const K = 400;
const COS = Math.cos((62.6 * Math.PI) / 180);
const W = (LON1 - LON0) * COS * K;
const H = (LAT1 - LAT0) * K;
const px = (lon: number) => (lon - LON0) * COS * K;
const py = (lat: number) => (LAT1 - lat) * K;

/** Survey-grid plot of the municipalities named in the reference list. No borders are drawn. */
export function RefMap({ data, className }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const lons = [27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5];
  const lats = [61.75, 62, 62.25, 62.5, 62.75, 63, 63.25];
  return (
    <svg
      viewBox={`-28 -18 ${W + 56} ${H + 46}`}
      role="img"
      aria-label={`Kartta: referenssikohteiden paikkakunnat. ${data.map((d) => `${d.name} ${d.count}`).join(', ')}.`}
      className={className}
    >
      <g stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} vectorEffect="non-scaling-stroke">
        {lons.map((l) => (
          <line key={`x${l}`} x1={px(l)} x2={px(l)} y1={0} y2={H} />
        ))}
        {lats.map((l) => (
          <line key={`y${l}`} y1={py(l)} y2={py(l)} x1={0} x2={W} />
        ))}
      </g>
      <rect x={0} y={0} width={W} height={H} fill="none" stroke="currentColor" strokeOpacity={0.4} />
      <g className="t-mono" fontSize={9} fill="currentColor" fillOpacity={0.5}>
        {lons.map((l) => (
          <text key={`tx${l}`} x={px(l)} y={H + 14} textAnchor="middle">
            {String(l).replace('.', ',')}°E
          </text>
        ))}
        {lats
          .filter((_, i) => i % 2 === 0)
          .map((l) => (
            <text key={`ty${l}`} x={-6} y={py(l) + 3} textAnchor="end">
              {String(l).replace('.', ',')}°
            </text>
          ))}
      </g>

      <g className="t-mono" fontSize={11} letterSpacing={3} fill="currentColor" fillOpacity={0.28} fontWeight={500}>
        <text x={px(29.15)} y={py(63.36)}>POHJOIS-KARJALA</text>
        <text x={px(27.15)} y={py(63.2)}>POHJOIS-SAVO</text>
        <text x={px(27.15)} y={py(61.8)}>ETELÄ-SAVO</text>
      </g>

      {data.map(({ name, count }) => {
        const c = municipalityCoords[name];
        const x = px(c.lon);
        const y = py(c.lat);
        const r = 4 + Math.sqrt(count) * 3.4;
        const inArea = c.region !== 'Etelä-Savo';
        const right = c.lon < 29.9;
        return (
          <g key={name} data-fill>
            <circle cx={x} cy={y} r={r} fill={inArea ? 'var(--color-signal)' : 'currentColor'} fillOpacity={inArea ? 0.9 : 0.45} />
            {name === 'Joensuu' && <circle cx={x} cy={y} r={r + 7} fill="none" stroke="var(--color-signal)" strokeOpacity={0.6} />}
            <text x={right ? x + r + 6 : x - r - 6} y={y + 4} textAnchor={right ? 'start' : 'end'} fontSize={12.5} fontWeight={600} fill="currentColor">
              {name}
              <tspan className="t-mono" fontWeight={400} fillOpacity={0.6} fontSize={10.5}>
                {' '}
                {count}
              </tspan>
            </text>
          </g>
        );
      })}
      <text className="t-mono" x={W} y={-6} textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.5}>
        {total} paikannettua kohdetta
      </text>
    </svg>
  );
}

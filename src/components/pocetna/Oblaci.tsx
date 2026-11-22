/**
 * Pojas oblaka od šuma (feTurbulence) umjesto zamućenih elipsa: nepravilni, razvučeni vodoravno,
 * gušći u sredini pojasa. Crta se jednom, a CSS ga polako pomiče lijevo-desno.
 * `boja` su tri broja 0–1; `sjena` je boja donje strane oblaka (svjetlo dolazi odozdo ili odozgo).
 */
export default function Oblaci({
  id,
  boja,
  sjena,
  sjeme = 3,
  gustoca = 3.2,
  frek = "0.0032 0.011",
  className,
}: {
  id: string;
  boja: [number, number, number];
  sjena?: [number, number, number];
  sjeme?: number;
  gustoca?: number;
  frek?: string;
  className?: string;
}) {
  const [r, g, b] = boja;
  const prag = (-gustoca * 0.52).toFixed(2);
  return (
    <svg className={className ? `oblaci ${className}` : "oblaci"} viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id={`${id}-f`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={frek} numOctaves={5} seed={sjeme} />
          <feColorMatrix type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  ${gustoca} 0 0 0 ${prag}`} />
        </filter>
        {sjena && (
          <filter id={`${id}-s`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={frek} numOctaves={5} seed={sjeme} />
            <feColorMatrix type="matrix" values={`0 0 0 0 ${sjena[0]}  0 0 0 0 ${sjena[1]}  0 0 0 0 ${sjena[2]}  ${gustoca} 0 0 0 ${prag}`} />
            <feOffset dy="9" />
            <feGaussianBlur stdDeviation="5" />
          </filter>
        )}
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-h`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".12" stopColor="#fff" />
          <stop offset=".88" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="400">
          <rect width="1600" height="400" fill={`url(#${id}-g)`} />
        </mask>
        <mask id={`${id}-n`} maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="400">
          <rect width="1600" height="400" fill={`url(#${id}-h)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-n)`}>
        <g mask={`url(#${id}-m)`}>
          {sjena && <rect width="1600" height="400" filter={`url(#${id}-s)`} opacity=".55" />}
          <rect width="1600" height="400" filter={`url(#${id}-f)`} />
        </g>
      </g>
    </svg>
  );
}

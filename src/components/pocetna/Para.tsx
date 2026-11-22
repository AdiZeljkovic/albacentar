/**
 * Magla za prijelaze između prizora, kao dio SVG crteža. Umjesto ravnog gradijenta, sloj je
 * šum (feTurbulence) razvučen vodoravno u pramenove koji se prema dnu zgušnjavaju dok ne postanu
 * puna boja sljedeće sekcije. Crta se jednom i miruje, pa ne opterećuje stranicu.
 *
 * `boja` su tri broja 0–1 (crvena, zelena, plava). `od` i `puno` su y-koordinate u mjerama
 * crteža: gdje magla počinje i gdje postaje neprozirna.
 */
type Sloj = { frek: string; sjeme: number; od: number; do: number; jacina?: number; boja?: [number, number, number] };

export default function Para({
  id,
  boja,
  sirina = 1440,
  visina,
  slojevi,
  puno,
}: {
  id: string;
  boja: [number, number, number];
  sirina?: number;
  visina: number;
  slojevi: Sloj[];
  /** [početak, kraj] završnog prelaska u punu boju */
  puno: [number, number];
}) {
  const hex = `rgb(${boja.map((b) => Math.round(b * 255)).join(" ")})`;
  return (
    <g>
      <defs>
        {slojevi.map((s, i) => {
          const [r, g, b] = s.boja ?? boja;
          const k = s.jacina ?? 2.4;
          return (
            <filter key={i} id={`${id}-f${i}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={s.frek} numOctaves={3} seed={s.sjeme} />
              {/* boja je stalna, a prozirnost dolazi iz šuma: tako nastaju pramenovi */}
              <feColorMatrix type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  ${k} 0 0 0 ${(-k * 0.34).toFixed(2)}`} />
            </filter>
          );
        })}
        {slojevi.map((s, i) => (
          <linearGradient key={i} id={`${id}-g${i}`} gradientUnits="userSpaceOnUse" x1="0" y1={s.od} x2="0" y2={s.do}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
        ))}
        {slojevi.map((_, i) => (
          <mask key={i} id={`${id}-m${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={sirina} height={visina}>
            <rect width={sirina} height={visina} fill={`url(#${id}-g${i})`} />
          </mask>
        ))}
        <linearGradient id={`${id}-puno`} gradientUnits="userSpaceOnUse" x1="0" y1={puno[0]} x2="0" y2={puno[1]}>
          <stop offset="0" stopColor={hex} stopOpacity="0" />
          <stop offset=".5" stopColor={hex} stopOpacity=".62" />
          <stop offset="1" stopColor={hex} />
        </linearGradient>
      </defs>
      {slojevi.map((_, i) => (
        <g key={i} mask={`url(#${id}-m${i})`}>
          <rect width={sirina} height={visina} filter={`url(#${id}-f${i})`} />
        </g>
      ))}
      <rect y={puno[0]} width={sirina} height={visina - puno[0]} fill={`url(#${id}-puno)`} />
    </g>
  );
}

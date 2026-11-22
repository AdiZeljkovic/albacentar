import { ISKRA } from "@/lib/zvijezda";
import { vars } from "@/lib/util";

/**
 * „Zašto nisu sve konstelacije iste": iste zvijezde, a tri škole povuku među njima tri različita
 * zviježđa. Gravura zlatnom tintom; linije se izmjenjuju same, u krugu od 15 sekundi.
 * Uz „manje pokreta" ostaje prvo zviježđe.
 */
const TINTA = "#84601d";
const ZLATO = "#b88a3e";

const ZVIJEZDE: Array<[x: number, y: number, v: number]> = [
  [54, 152, 1],
  [100, 72, 1.2],
  [156, 124, 1.5],
  [126, 202, 0.86],
  [216, 54, 0.95],
  [242, 150, 1.28],
  [298, 98, 0.9],
  [282, 212, 1.08],
];
const SKOLE: Array<Array<[number, number]>> = [
  [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 5],
    [5, 6],
    [5, 7],
    [1, 4],
  ],
  [
    [0, 3],
    [3, 7],
    [7, 5],
    [5, 6],
    [6, 4],
    [4, 1],
    [1, 0],
  ],
  [
    [4, 2],
    [2, 0],
    [2, 7],
    [6, 2],
    [3, 5],
    [1, 2],
  ],
];
const z = (n: number) => +n.toFixed(1);

export default function Skole() {
  return (
    <svg className="ks-skole" viewBox="0 0 350 290" aria-hidden="true">
      {/* okvir karte: dvije kružnice i skala */}
      <g fill="none" stroke={ZLATO}>
        <g className="ks-g-vrti" style={{ transformOrigin: "175px 134px" }}>
          <circle cx="175" cy="134" r="166" pathLength={360} strokeWidth="4.5" strokeDasharray="0.36 3.64" opacity=".6" />
          <circle cx="175" cy="134" r="164.5" pathLength={360} strokeWidth="9" strokeDasharray="0.5 29.5" opacity=".85" />
        </g>
        <circle cx="175" cy="134" r="159" strokeWidth=".9" opacity=".85" />
        <circle cx="175" cy="134" r="112" strokeWidth=".6" strokeDasharray="0.6 5" strokeLinecap="round" opacity=".5" />
        <circle cx="175" cy="134" r="58" strokeWidth=".6" strokeDasharray="0.6 4.4" strokeLinecap="round" opacity=".4" />
      </g>

      {SKOLE.map((veze, s) => (
        <g key={s} className={`ks-sk ks-sk-${s + 1}`} fill="none" stroke={TINTA} strokeWidth="1.25" strokeLinecap="round">
          {veze.map(([a, b], i) => {
            const A = ZVIJEZDE[a];
            const B = ZVIJEZDE[b];
            const d = Math.hypot(B[0] - A[0], B[1] - A[1]);
            const oa = (6 + A[2] * 7) / d;
            const ob = (6 + B[2] * 7) / d;
            return (
              <path
                key={`${a}-${b}`}
                pathLength={1}
                d={`M${z(A[0] + (B[0] - A[0]) * oa)} ${z(A[1] + (B[1] - A[1]) * oa)} L${z(B[0] - (B[0] - A[0]) * ob)} ${z(B[1] - (B[1] - A[1]) * ob)}`}
                style={vars({ "--i": i })}
              />
            );
          })}
        </g>
      ))}

      {ZVIJEZDE.map(([x, y, v], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r={z(v * 8)} fill="none" stroke={ZLATO} strokeWidth=".7" opacity=".7" />
          <g transform={`scale(${v})`}>
            <path className="ks-g-iskra mirna" d={ISKRA} fill={TINTA} style={vars({ "--d": `${z(i * -0.9)}s` })} />
          </g>
        </g>
      ))}

      {/* koja je škola upravo na karti */}
      <g className="ks-sk-znak" fill={ZLATO} stroke={TINTA} strokeWidth=".8">
        {[0, 1, 2].map((s) => (
          <path key={s} className={`ks-sk-z${s + 1}`} d="M0 -4.6 L4.6 0 L0 4.6 L-4.6 0Z" transform={`translate(${159 + s * 16} 276)`} />
        ))}
      </g>
    </svg>
  );
}

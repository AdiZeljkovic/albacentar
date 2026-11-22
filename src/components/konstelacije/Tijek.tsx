import type { ReactNode } from "react";
import { ISKRA } from "@/lib/zvijezda";
import { kas, vars } from "@/lib/util";

/**
 * Tijek konstelacijskog rada kao tri gravure na papiru, crtane zlatnom tintom:
 *   1 Tema:        jedna figura i pitanje koje se od nje širi
 *   2 Postav:      figure predstavnika dolaze na svoja mjesta u polju
 *   3 Promatranje: ista polja i iste figure, a među njima se iscrtavaju odnosi
 * Figura je znak sa stranice: krug i vrh koji pokazuje kamo je predstavnik okrenut.
 * Crteži se odvijaju sami, u krugu od 12 sekundi; uz „manje pokreta" stoje dovršeni.
 */
const TINTA = "#84601d";
const ZLATO = "#b88a3e";
const S: [number, number] = [150, 105];
const z = (n: number) => +n.toFixed(1);

type Figura = { x: number; y: number; kut: number; puna?: boolean; sx: number; sy: number };

/** Iste figure na istim mjestima u drugoj i trećoj gravuri: postav ostaje, mijenja se pogled na njega. */
const FIGURE: Figura[] = [
  { x: 150, y: 152, kut: 0, puna: true, sx: 0, sy: 46 },
  { x: 103, y: 94, kut: 112, sx: -58, sy: -8 },
  { x: 197, y: 82, kut: 214, sx: 52, sy: -30 },
  { x: 141, y: 56, kut: 176, sx: -10, sy: -50 },
  { x: 213, y: 133, kut: 292, sx: 60, sy: 22 },
];
const ODNOSI: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [3, 2],
  [0, 4],
  [2, 4],
];

function Fig({ f, v = 1 }: { f: Pick<Figura, "kut" | "puna">; v?: number }) {
  return (
    <g transform={`rotate(${f.kut}) scale(${v})`}>
      <circle r="9.6" fill={f.puna ? ZLATO : "#fffaf3"} stroke={TINTA} strokeWidth="1.4" />
      <path d="M-3.8 -13 L0 -18.6 L3.8 -13Z" fill={TINTA} />
    </g>
  );
}

/** Rub polja: tanka kružnica i skala od crtica koja se polako okreće, kao na astrolabu. */
function Polje({ r = 86 }: { r?: number }) {
  return (
    <g fill="none" stroke={ZLATO}>
      <g className="ks-g-vrti" style={{ transformOrigin: `${S[0]}px ${S[1]}px` }}>
        <circle cx={S[0]} cy={S[1]} r={r + 7} pathLength={360} strokeWidth="4.5" strokeDasharray="0.36 3.64" opacity=".7" />
        <circle cx={S[0]} cy={S[1]} r={r + 6} pathLength={360} strokeWidth="9" strokeDasharray="0.5 29.5" opacity=".95" />
      </g>
      <circle cx={S[0]} cy={S[1]} r={r + 1.5} strokeWidth=".9" />
      <circle cx={S[0]} cy={S[1]} r={r - 3} strokeWidth=".9" strokeDasharray="0.7 4.3" strokeLinecap="round" opacity=".85" />
    </g>
  );
}

function Tema() {
  // četiri moguća polazišta oko osobe: odnos, odluka, situacija koja se ponavlja, osjećaj
  const oko: Array<[number, number, number]> = [
    [92, 66, 0.92],
    [214, 58, 0.74],
    [224, 138, 1],
    [84, 146, 0.7],
  ];
  return (
    <svg className="ks-gravura" viewBox="0 0 300 210" aria-hidden="true">
      <Polje />
      <g fill="none" stroke={ZLATO} strokeLinecap="round">
        <circle cx={S[0]} cy={S[1]} r="26" strokeWidth=".9" strokeDasharray="0.7 3.5" />
        <circle cx={S[0]} cy={S[1]} r="48" strokeWidth=".9" strokeDasharray="0.7 4.9" opacity=".85" />
        {/* pitanje koje se širi od osobe */}
        <circle className="ks-g-val" cx={S[0]} cy={S[1]} r="66" strokeWidth="1.2" style={{ transformOrigin: `${S[0]}px ${S[1]}px` }} />
        <circle className="ks-g-val" cx={S[0]} cy={S[1]} r="66" strokeWidth="1.2" style={{ transformOrigin: `${S[0]}px ${S[1]}px`, animationDelay: "-2.6s" }} />
      </g>
      <g stroke={TINTA} strokeWidth=".8" strokeDasharray="1.5 3.5" strokeLinecap="round" opacity=".8">
        {oko.map(([x, y]) => {
          const d = Math.hypot(x - S[0], y - S[1]);
          const k = 17 / d;
          const j = 1 - 13 / d;
          return <line key={`${x}-${y}`} x1={z(S[0] + (x - S[0]) * k)} y1={z(S[1] + (y - S[1]) * k)} x2={z(S[0] + (x - S[0]) * j)} y2={z(S[1] + (y - S[1]) * j)} />;
        })}
      </g>
      {oko.map(([x, y, v], i) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${v})`}>
          <path className="ks-g-iskra" d={ISKRA} fill={TINTA} style={vars({ "--d": `${z(i * -1.3)}s` })} />
        </g>
      ))}
      <g transform={`translate(${S[0]} ${S[1] + 2})`}>
        <Fig f={{ kut: 0, puna: true }} v={1.15} />
      </g>
    </svg>
  );
}

function Postav() {
  return (
    <svg className="ks-gravura" viewBox="0 0 300 210" aria-hidden="true">
      <Polje />
      {/* križ strana svijeta u polju */}
      <g stroke={ZLATO} strokeWidth=".8" strokeDasharray="1 4" strokeLinecap="round" opacity=".8">
        <line x1={S[0]} y1={S[1] - 78} x2={S[0]} y2={S[1] + 78} />
        <line x1={S[0] - 78} y1={S[1]} x2={S[0] + 78} y2={S[1]} />
      </g>
      {/* mjesta na koja će figure stati */}
      <g fill="none" stroke={TINTA} strokeWidth=".8" strokeDasharray="1.4 2.4" opacity=".75">
        {FIGURE.map((f) => (
          <circle key={f.x} cx={f.x} cy={f.y} r="14.5" />
        ))}
      </g>
      {FIGURE.map((f, i) => (
        <g key={f.x} transform={`translate(${f.x} ${f.y})`}>
          <g className="ks-g-stane" style={vars({ "--sx": `${f.sx}px`, "--sy": `${f.sy}px`, "--d": `${z(i * 0.85)}s` })}>
            <Fig f={f} />
          </g>
        </g>
      ))}
    </svg>
  );
}

function Promatranje() {
  return (
    <svg className="ks-gravura" viewBox="0 0 300 210" aria-hidden="true">
      <Polje />
      <circle cx={FIGURE[0].x} cy={FIGURE[0].y} r="21" fill="none" stroke={ZLATO} strokeWidth=".9" strokeDasharray="0.7 3.3" strokeLinecap="round" />
      {/* odnosi među figurama: iscrtavaju se jedan za drugim */}
      <g fill="none" stroke={TINTA} strokeWidth="1.15" strokeLinecap="round">
        {ODNOSI.map(([a, b], i) => {
          const A = FIGURE[a];
          const B = FIGURE[b];
          const d = Math.hypot(B.x - A.x, B.y - A.y);
          const o = 15 / d;
          return (
            <path
              key={`${a}-${b}`}
              className="ks-g-odnos"
              pathLength={1}
              d={`M${z(A.x + (B.x - A.x) * o)} ${z(A.y + (B.y - A.y) * o)} L${z(B.x - (B.x - A.x) * o)} ${z(B.y - (B.y - A.y) * o)}`}
              style={vars({ "--d": `${z(i * 0.75)}s` })}
            />
          );
        })}
      </g>
      {/* svjetlo pogleda koje obilazi odnose */}
      <path
        className="ks-g-pogled"
        pathLength={1}
        fill="none"
        strokeLinecap="round"
        d={`M${FIGURE[0].x} ${FIGURE[0].y} L${FIGURE[1].x} ${FIGURE[1].y} L${FIGURE[3].x} ${FIGURE[3].y} L${FIGURE[2].x} ${FIGURE[2].y} L${FIGURE[4].x} ${FIGURE[4].y} L${FIGURE[0].x} ${FIGURE[0].y}`}
      />
      {FIGURE.map((f, i) => (
        <g key={f.x} transform={`translate(${f.x} ${f.y})`}>
          {/* jedna se figura okrene prema drugoj */}
          <g className={i === 4 ? "ks-g-okret" : undefined}>
            <Fig f={f} />
          </g>
        </g>
      ))}
    </svg>
  );
}

const GRAVURE: ReactNode[] = [<Tema key="t" />, <Postav key="p" />, <Promatranje key="o" />];

export default function Tijek({ koraci }: { koraci: ReadonlyArray<{ naslov: string; tekst: string }> }) {
  return (
    <div className="ks-tijek">
      {/* nit koja prolazi kroz sve tri ploče; po njoj putuje svjetlo */}
      <div className="ks-nit" aria-hidden="true">
        <i />
      </div>
      <ol className="tijek">
        {koraci.map((k, i) => (
          <li key={k.naslov} data-reveal style={kas(i * 0.12)}>
            <div className="ks-ploha">{GRAVURE[i]}</div>
            <span className="tijek-br">{i + 1}</span>
            <h3>{k.naslov}</h3>
            <p className="mut">{k.tekst}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

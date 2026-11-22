import type { CSSProperties } from "react";
import { ISKRA } from "@/lib/zvijezda";
import { vars } from "@/lib/util";

/**
 * Ukras noćne glave: astrolab u kojem je obitelj ucrtana kao zviježđe. Gore su preci (četiri
 * naraštaja unatrag), u sredini osoba, ispod nje djeca; niti među zvijezdama su loze. Rub s
 * podjelom polako se okreće, a niz dvije loze putuje svjetlo, kao u polju na naslovnici.
 */
type Tocka = [number, number];
const S = 280;
const z = (n: number) => +n.toFixed(1);
const naKrugu = (r: number, kut: number): Tocka => {
  const a = (kut * Math.PI) / 180;
  return [z(S + r * Math.cos(a)), z(S + r * Math.sin(a))];
};

/** Naraštaji: prabake i pradjedovi, bake i djedovi, roditelji, osoba, djeca. */
const PRA: Tocka[] = [[108, 158], [166, 120], [226, 108], [262, 84], [318, 92], [362, 112], [420, 118], [462, 166]];
const STARI: Tocka[] = [[150, 214], [240, 178], [330, 186], [418, 222]];
const RODITELJI: Tocka[] = [[204, 292], [362, 282]];
const JA: Tocka = [286, 372];
const DJECA: Tocka[] = [[232, 446], [338, 452]];

const crta = (a: Tocka, b: Tocka) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
const LOZE_DALEKE = PRA.map((p, i) => crta(p, STARI[Math.floor(i / 2)]));
const LOZE = [...STARI.map((s, i) => crta(s, RODITELJI[Math.floor(i / 2)])), ...RODITELJI.map((r) => crta(r, JA)), ...DJECA.map((d) => crta(JA, d))];
const PAROVI = [crta(STARI[0], STARI[1]), crta(STARI[2], STARI[3]), crta(RODITELJI[0], RODITELJI[1])];
/** dvije loze kojima silazi svjetlo */
const PUT_A = `M${PRA[1].join(" ")} L${STARI[0].join(" ")} L${RODITELJI[0].join(" ")} L${JA.join(" ")}`;
const PUT_B = `M${PRA[6].join(" ")} L${STARI[3].join(" ")} L${RODITELJI[1].join(" ")} L${JA.join(" ")} L${DJECA[1].join(" ")}`;

/** Podjela na rubu: crtica svaka 2,5°, dulja na 10°, najdulja na 30°. */
const PODJELA = Array.from({ length: 144 }, (_, k) => {
  const kut = k * 2.5 - 90;
  const vrsta = k % 12 === 0 ? 2 : k % 4 === 0 ? 1 : 0;
  const [x1, y1] = naKrugu([247.5, 243, 237][vrsta], kut);
  const [x2, y2] = naKrugu(254, kut);
  return { x1, y1, x2, y2, vrsta };
});

function Zvijezda({ t, v, i, slabo, id }: { t: Tocka; v: number; i: number; slabo?: boolean; id: string }) {
  return (
    <g transform={`translate(${t[0]} ${t[1]})`} opacity={slabo ? 0.72 : 1}>
      <circle r={z(v * 4.2)} fill={`url(#${id}-halo)`} />
      <circle r={z(v * 1.7)} fill={`url(#${id}-zar)`} />
      <g className="polje-treptaj" style={vars({ "--t": `${z((i * 0.83) % 5)}s` })}>
        <path d={ISKRA} transform={`scale(${z(v / 4.4)})`} fill="#fff3d0" />
      </g>
      <circle r={z(v * 0.36)} fill="#fffdf4" />
    </g>
  );
}

function Svjetlo({ d, kasni }: { d: string; kasni: number }) {
  const stil = { "--d": `${kasni}s`, animationDuration: "7.5s" } as CSSProperties;
  return (
    <g fill="none" strokeLinecap="round">
      <g opacity=".28">
        <path className="polje-kometa sjaj" pathLength={1} d={d} style={stil} />
      </g>
      <path className="polje-kometa rep" pathLength={1} d={d} style={stil} />
      <path className="polje-kometa glava" pathLength={1} d={d} style={stil} />
    </g>
  );
}

/** id je prefiks za id-jeve u crtežu; različit mora biti za svaki Prsten na istoj stranici. */
export default function Prsten({ className, id = "pr" }: { className?: string; id?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 560 560" fill="none">
        <defs>
          <linearGradient id={`${id}-metal`} x1=".1" y1="0" x2=".9" y2="1">
            <stop offset="0" stopColor="#fff3cf" />
            <stop offset=".3" stopColor="#dcb970" />
            <stop offset=".62" stopColor="#8f6d2f" />
            <stop offset="1" stopColor="#d9b56f" />
          </linearGradient>
          <radialGradient id={`${id}-ploca`} cx=".5" cy=".44" r=".56">
            <stop offset="0" stopColor="#2c3a7a" stopOpacity=".5" />
            <stop offset=".6" stopColor="#1a2250" stopOpacity=".3" />
            <stop offset="1" stopColor="#0d1228" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-halo`}>
            <stop offset="0" stopColor="#f6dc9f" stopOpacity=".34" />
            <stop offset=".45" stopColor="#e2c487" stopOpacity=".1" />
            <stop offset="1" stopColor="#e2c487" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-zar`}>
            <stop offset="0" stopColor="#fffaea" stopOpacity=".9" />
            <stop offset=".5" stopColor="#f3d391" stopOpacity=".3" />
            <stop offset="1" stopColor="#f3d391" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${id}-unutra`}>
            <circle cx={S} cy={S} r="235" />
          </clipPath>
        </defs>

        {/* ploča: tamnije nebo unutar ruba */}
        <circle cx={S} cy={S} r="262" fill={`url(#${id}-ploca)`} />

        {/* mreža astrolaba: krugovi visine sa središtima pomaknutim prema dolje, podnevnik i obzor */}
        <g clipPath={`url(#${id}-unutra)`} stroke="#d9b56f" strokeWidth=".6">
          <circle cx={S} cy="578" r="330" opacity=".2" />
          <circle cx={S} cy="512" r="252" opacity=".18" />
          <circle cx={S} cy="462" r="186" opacity=".16" />
          <circle cx={S} cy="424" r="128" opacity=".14" />
          <circle cx={S} cy="214" r="150" opacity=".26" strokeDasharray="1 6" strokeLinecap="round" />
          <path d={`M${S} 44 V516`} opacity=".14" />
          <path d="M44 280 H516" opacity=".1" />
        </g>

        {/* rub: dvostruka kovinska crta i podjela koja se polako okreće */}
        <circle className="prsten-crta" pathLength={1} cx={S} cy={S} r="262" stroke={`url(#${id}-metal)`} strokeWidth="1.5" />
        <circle cx={S} cy={S} r="257" stroke="#d9b56f" strokeWidth=".5" opacity=".42" />
        <circle cx={S} cy={S} r="235" stroke="#d9b56f" strokeWidth=".5" opacity=".3" />
        <g className="prsten-vrti" stroke="#e2c487" strokeLinecap="round">
          {PODJELA.map((c, k) => (
            <line key={k} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} strokeWidth={c.vrsta === 2 ? 1.1 : 0.7} opacity={[0.36, 0.6, 0.9][c.vrsta]} />
          ))}
          {/* kazalo na rubu */}
          <path d="M280 20 L283.4 27 L280 34 L276.6 27Z" fill="#f3d391" stroke="none" />
        </g>

        {/* loze: prvo daleki preci, pa bliži naraštaji */}
        <g stroke="#e9cd92" strokeLinecap="round">
          {LOZE_DALEKE.map((d, k) => (
            <path key={d} className="pr-loza" pathLength={1} d={d} strokeWidth=".6" opacity=".34" style={vars({ "--k": `${z(0.5 + k * 0.07)}s` })} />
          ))}
          {LOZE.map((d, k) => (
            <path key={d} className="pr-loza" pathLength={1} d={d} strokeWidth=".9" opacity=".62" style={vars({ "--k": `${z(1 + k * 0.11)}s` })} />
          ))}
          {PAROVI.map((d) => (
            <path key={d} d={d} strokeWidth=".7" opacity=".3" strokeDasharray="1 5" />
          ))}
        </g>

        <Svjetlo d={PUT_A} kasni={2.6} />
        <Svjetlo d={PUT_B} kasni={6.4} />

        {PRA.map((t, i) => (
          <Zvijezda id={id} key={`p${i}`} t={t} v={[2.2, 2.8, 2.3, 3, 2.4, 2.9, 2.2, 2.6][i]} i={i} slabo />
        ))}
        {STARI.map((t, i) => (
          <Zvijezda id={id} key={`s${i}`} t={t} v={[3.8, 4.4, 4, 3.6][i]} i={i + 8} />
        ))}
        {RODITELJI.map((t, i) => (
          <Zvijezda id={id} key={`r${i}`} t={t} v={[5.4, 5.8][i]} i={i + 12} />
        ))}
        {DJECA.map((t, i) => (
          <Zvijezda id={id} key={`d${i}`} t={t} v={[3.6, 3.1][i]} i={i + 14} />
        ))}
        <Zvijezda id={id} t={JA} v={8} i={3} />
      </svg>
    </div>
  );
}

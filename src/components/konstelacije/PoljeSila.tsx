import { vars } from "@/lib/util";
import { Kometa, Zv } from "./Zvijezdja";

/**
 * „Polje" iza velikog citata: strujnice koje teku preko noćne ploče i same obilaze mjesto na
 * kojem stoji tekst. Oblik im daje strujanje oko zapreke (funkcija toka ψ = Y·(1 − 1/(X² + Y²))),
 * a šum ih čini nejednakima, kao rukom vučene linije na karti. Crtaju se jednom i miruju;
 * po nekoliko njih putuje svjetlo. Sve je određeno sjemenom, isto na poslužitelju i u pregledniku.
 */
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
function sum(x: number, sjeme: number) {
  const i = Math.floor(x);
  const f = x - i;
  const k = f * f * (3 - 2 * f);
  return hash(i + sjeme * 57.3) * (1 - k) + hash(i + 1 + sjeme * 57.3) * k;
}
const z = (n: number) => +n.toFixed(1);
const z3 = (n: number) => +n.toFixed(3);

type Tocka = [number, number];

/** Točke jedne strujnice, s lijeva na desno. `psi` je visina linije daleko od zapreke (u polumjerima zapreke). */
function strujnica(psi: number, W: number, H: number, a: number, b: number, sjeme: number): Tocka[] {
  const tocke: Tocka[] = [];
  const N = 110;
  const p = Math.abs(psi);
  const amp = (H / 700) * (2.5 + 5 * hash(sjeme * 3.3));
  for (let i = 0; i <= N; i++) {
    const x = -W * 0.03 + W * 1.06 * (i / N);
    const X = (x - W / 2) / a;
    let lo = Math.abs(X) < 1 ? Math.sqrt(1 - X * X) : 0;
    let hi = p + 3;
    for (let k = 0; k < 30; k++) {
      const m = (lo + hi) / 2;
      if (m * (1 - 1 / (X * X + m * m)) - p < 0) lo = m;
      else hi = m;
    }
    const Y = ((lo + hi) / 2) * Math.sign(psi);
    const val = (sum((x / W) * 4.2 + sjeme * 1.7, sjeme) * 2 - 1) * amp + (sum((x / W) * 11 + sjeme * 5.1, sjeme + 9) * 2 - 1) * amp * 0.3;
    tocke.push([z(x), z(H / 2 + Y * b + val)]);
  }
  return tocke;
}

/** Glatka krivulja kroz točke: kvadratni lukovi kroz polovišta. */
function put(t: Tocka[]) {
  let d = `M${t[0][0]} ${t[0][1]}`;
  for (let i = 1; i < t.length - 1; i++) {
    d += ` Q${t[i][0]} ${t[i][1]} ${z((t[i][0] + t[i + 1][0]) / 2)} ${z((t[i][1] + t[i + 1][1]) / 2)}`;
  }
  const kraj = t[t.length - 1];
  return `${d} L${kraj[0]} ${kraj[1]}`;
}

export default function PoljeSila({ sirina, visina, a, b, linija = 24, className }: { sirina: number; visina: number; a: number; b: number; linija?: number; className?: string }) {
  const strujnice: Array<{ d: string; tocke: Tocka[]; i: number; blizu: number }> = [];
  for (const strana of [-1, 1]) {
    for (let k = 0; k < linija; k++) {
      const sjeme = k * 2 + (strana > 0 ? 1 : 0) + 3;
      const udio = k / (linija - 1);
      const psi = strana * (0.03 + 2.1 * Math.pow(udio, 1.55) * (0.9 + 0.2 * hash(sjeme * 7.7)));
      const tocke = strujnica(psi, sirina, visina, a, b, sjeme);
      strujnice.push({ d: put(tocke), tocke, i: sjeme, blizu: 1 - udio });
    }
  }
  // svjetlo putuje po svakoj osmoj liniji, a na nekoliko linija stoje zvijezde, kao predstavnici u polju
  const svjetla = strujnice.filter((s) => s.i % 8 === 3);
  const zvijezde = strujnice.filter((s) => s.i % 6 === 1 && s.blizu > 0.25);

  return (
    <svg className={className} viewBox={`0 0 ${sirina} ${visina}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        {strujnice.map((s) => {
          const h = hash(s.i * 2.9);
          const tockasta = hash(s.i * 4.3) > 0.74;
          // linija je mjestimice prekinuta, svaka drugdje
          const isprekidana = `${z3(0.12 + hash(s.i * 1.3) * 0.5)} ${z3(0.01 + hash(s.i * 6.1) * 0.05)} ${z3(0.1 + hash(s.i * 8.3) * 0.4)} ${z3(0.01 + hash(s.i * 9.7) * 0.04)} 1`;
          return (
            <path
              key={s.i}
              d={s.d}
              pathLength={tockasta ? undefined : 1}
              stroke={hash(s.i * 5.9) > 0.8 ? "#a9b4ee" : "#e2c487"}
              strokeWidth={z(0.5 + h * 0.7)}
              strokeDasharray={tockasta ? "0.7 6.5" : isprekidana}
              opacity={z3(0.1 + 0.34 * s.blizu * (0.5 + 0.5 * h) + 0.08 * h)}
            />
          );
        })}
      </g>
      <g className="ks-komete" fill="none" strokeLinecap="round">
        {svjetla.map((s, k) => (
          <Kometa key={s.i} d={s.d} kasni={z((k * 3.7) % 13)} traje={z(11 + hash(s.i) * 7)} />
        ))}
      </g>
      {zvijezde.map((s, k) => {
        const t = s.tocke[Math.round((0.12 + hash(s.i * 3.1) * 0.76) * (s.tocke.length - 1))];
        return (
          <g key={s.i} style={vars({ "--t": `${k}s` })}>
            <Zv x={t[0]} y={t[1]} v={z(3 + hash(s.i * 2.3) * 2.6)} i={k} />
          </g>
        );
      })}
    </svg>
  );
}

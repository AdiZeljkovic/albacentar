import type { CSSProperties } from "react";
import { ISKRA } from "@/lib/zvijezda";

/**
 * Prizor stranice 404: zvjezdana karta na kojoj jedno mjesto stoji prazno, a zvijezda koja mu
 * pripada odlutala je izvan ruba karte. Od nje se do praznog mjesta vraća svjetlo po točkastom tragu.
 */

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const S = 300;
const RIM = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** Zviježđa na karti: zvijezde [x, y, veličina] i spojnice među njima. */
const ZVIJEZDJA: Array<{ t: Array<[number, number, number]>; s: Array<[number, number]> }> = [
  { t: [[150, 236, 1], [186, 222, 0.8], [218, 228, 0.8], [250, 246, 0.9], [262, 282, 0.7], [304, 290, 0.8], [300, 252, 0.9]], s: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
  { t: [[330, 128, 0.8], [352, 160, 0.7], [380, 136, 0.9], [404, 166, 0.7], [432, 140, 0.8]], s: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { t: [[232, 380, 1], [262, 404, 0.7], [292, 428, 0.8], [326, 456, 0.6], [250, 446, 0.6], [334, 402, 0.6]], s: [[0, 1], [1, 2], [2, 3], [4, 2], [2, 5]] },
  { t: [[420, 300, 1.1], [440, 330, 0.5], [462, 322, 0.5], [452, 354, 0.5], [474, 346, 0.5]], s: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]] },
  { t: [[150, 330, 0.6], [176, 352, 0.5], [140, 366, 0.5]], s: [[0, 1], [1, 2], [2, 0]] },
];

/** Sitne zvijezde polja, nasumično ali uvijek iste. */
const POLJE = Array.from({ length: 90 }, (_, i) => {
  const r = Math.sqrt(hash(i * 2.3 + 1)) * 220;
  const kut = hash(i * 5.9 + 4) * Math.PI * 2;
  return { x: S + Math.cos(kut) * r, y: S + Math.sin(kut) * r, r: 0.4 + hash(i * 8.1) * 0.9, a: 0.25 + hash(i * 3.7) * 0.6 };
});

/** Prazno mjesto na karti i zvijezda koja je odlutala. */
const MJESTO: [number, number] = [384, 236];
const ZALUTALA: [number, number] = [540, 88];
const TRAG = `M${ZALUTALA.join(" ")} C514 106 494 112 470 130 C438 154 424 212 ${MJESTO.join(" ")}`;

export default function Karta404() {
  const kometa = { animationDuration: "6s" } as CSSProperties;
  return (
    <svg className="am-karta" viewBox="20 20 590 550" aria-hidden="true">
      <defs>
        <radialGradient id="am-k-ploca">
          <stop offset="0" stopColor="#2a3676" stopOpacity=".62" />
          <stop offset=".7" stopColor="#1a2250" stopOpacity=".4" />
          <stop offset="1" stopColor="#121838" stopOpacity=".2" />
        </radialGradient>
        <radialGradient id="am-k-sjaj">
          <stop offset="0" stopColor="#fff6d8" stopOpacity=".8" />
          <stop offset=".3" stopColor="#f0d28c" stopOpacity=".24" />
          <stop offset="1" stopColor="#f0d28c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="am-k-zlato" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0c8" />
          <stop offset=".5" stopColor="#d9b56f" />
          <stop offset="1" stopColor="#a67c32" />
        </linearGradient>
      </defs>

      {/* ploča karte i mreža */}
      <circle cx={S} cy={S} r="228" fill="url(#am-k-ploca)" />
      <g fill="none" stroke="#d9b56f">
        <circle cx={S} cy={S} r="160" strokeWidth=".6" opacity=".26" />
        <circle cx={S} cy={S} r="92" strokeWidth=".6" opacity=".26" />
        <circle cx="318" cy="284" r="150" strokeWidth=".7" strokeDasharray="2 6" opacity=".42" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${S} ${S - 26} L${S} ${S - 228}`} transform={`rotate(${i * 30} ${S} ${S})`} strokeWidth=".5" opacity=".16" />
        ))}
        <path d={`M${S - 7} ${S} L${S + 7} ${S} M${S} ${S - 7} L${S} ${S + 7}`} strokeWidth=".8" opacity=".6" />
        <circle cx={S} cy={S} r="3" strokeWidth=".8" opacity=".6" />
      </g>

      {/* obruč s podjelom; polako se okreće */}
      <g className="am-karta-obruc" fill="none" stroke="url(#am-k-zlato)">
        <circle cx={S} cy={S} r="250" strokeWidth="1.3" />
        <circle cx={S} cy={S} r="228" strokeWidth=".8" />
        {Array.from({ length: 72 }, (_, i) => (
          <path key={i} d={`M${S} ${S - 250} L${S} ${S - (i % 6 === 0 ? 228 : i % 3 === 0 ? 242 : 246)}`} transform={`rotate(${i * 5} ${S} ${S})`} strokeWidth={i % 6 === 0 ? 0.9 : 0.6} opacity={i % 6 === 0 ? 0.9 : 0.6} />
        ))}
        {RIM.map((broj, i) => (
          <text key={broj} x={S} y={S - 234} transform={`rotate(${i * 30 + 15} ${S} ${S})`} textAnchor="middle" fontSize="10.5" letterSpacing="1" stroke="none" fill="#e2c487" opacity=".85" style={{ fontFamily: "var(--serif)" }}>
            {broj}
          </text>
        ))}
      </g>

      {/* zvijezde polja i zviježđa */}
      <g fill="#e9e4ff">
        {POLJE.map((z, i) => (
          <circle key={i} cx={z.x.toFixed(1)} cy={z.y.toFixed(1)} r={z.r.toFixed(2)} opacity={z.a.toFixed(2)} />
        ))}
      </g>
      {ZVIJEZDJA.map((z, zi) => (
        <g key={zi}>
          <g fill="none" stroke="#e2c487" strokeWidth=".7" opacity=".5">
            {z.s.map(([a, b]) => (
              <path key={`${a}-${b}`} d={`M${z.t[a][0]} ${z.t[a][1]} L${z.t[b][0]} ${z.t[b][1]}`} />
            ))}
          </g>
          {z.t.map(([x, y, v], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${v})`}>
              <path className="am-tr" style={{ "--d": `${-(zi * 1.3 + i * 0.7).toFixed(1)}s` } as CSSProperties} d={ISKRA} fill="#fff6d8" />
            </g>
          ))}
        </g>
      ))}

      {/* prazno mjesto na karti */}
      <g transform={`translate(${MJESTO.join(" ")})`} fill="none" stroke="#f0d28c">
        <circle className="am-karta-val" r="13" strokeWidth="1" />
        <circle r="13" strokeWidth="1" strokeDasharray="2.6 3.2" />
        <path d="M-23 0 L-17 0 M17 0 L23 0 M0 -23 L0 -17 M0 17 L0 23" strokeWidth="1" />
        <text x="-21" y="33" textAnchor="end" fontSize="11" letterSpacing="2.4" stroke="none" fill="#f0d28c" style={{ fontFamily: "var(--sans)", fontWeight: 600 }}>
          404
        </text>
      </g>

      {/* trag kojim se zvijezda vraća na svoje mjesto */}
      <path d={TRAG} fill="none" stroke="#f0d28c" strokeWidth="1" strokeDasharray="1 5.5" strokeLinecap="round" opacity=".75" />
      <g className="polje-komete am-karta-svjetlo" fill="none" strokeLinecap="round">
        <g opacity=".3">
          <path className="polje-kometa sjaj" pathLength={1} d={TRAG} style={kometa} />
        </g>
        <path className="polje-kometa rep" pathLength={1} d={TRAG} style={kometa} />
        <path className="polje-kometa glava" pathLength={1} d={TRAG} style={kometa} />
      </g>

      {/* zvijezda koje nema na karti */}
      <g transform={`translate(${ZALUTALA.join(" ")})`}>
        <g className="am-zalutala">
          <circle r="52" fill="url(#am-k-sjaj)" />
          <g transform="scale(2.9)">
            <path className="am-tr" d={ISKRA} fill="#fffaea" />
          </g>
        </g>
      </g>
    </svg>
  );
}

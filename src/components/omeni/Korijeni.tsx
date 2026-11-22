import type { CSSProperties } from "react";
import Image from "next/image";
import { greben } from "@/lib/krajolik";
import { vars } from "@/lib/util";
import { ISKRA } from "@/lib/zvijezda";

/**
 * Prizor na dnu noćne ploče „Zašto AlBa Centar?": korijeni i vlastiti put. Na brijegu stoji stablo
 * života čije korijenje svijetli pod zemljom, a od njega preko grebena vodi put prema zvijezdi nad
 * obzorom. Krajolik se rasteže na širinu ploče; stablo, korijenje i zvijezda su zasebni slojevi
 * pa zadržavaju svoj oblik.
 */

/** Sredina puta od stabla do obzora (mjere crteža 1440 × 420). */
const PUT = "M318 306 C450 338 560 268 700 254 C820 242 860 216 950 205 C1020 196 1050 186 1104 180";
type T = [number, number];
const DIONICE: Array<[T, T, T, T]> = [
  [[318, 306], [450, 338], [560, 268], [700, 254]],
  [[700, 254], [820, 242], [860, 216], [950, 205]],
  [[950, 205], [1020, 196], [1050, 186], [1104, 180]],
];
/** Ploha puta: uz stablo široka, prema obzoru se sužava u crtu. */
const PLOHA = (() => {
  const gore: string[] = [];
  const dolje: string[] = [];
  const koraka = 16;
  DIONICE.forEach((d, di) => {
    for (let k = di ? 1 : 0; k <= koraka; k++) {
      const t = k / koraka;
      const u = 1 - t;
      const [x, y] = [0, 1].map((i) => u * u * u * d[0][i] + 3 * u * u * t * d[1][i] + 3 * u * t * t * d[2][i] + t * t * t * d[3][i]);
      const udio = (di + t) / DIONICE.length;
      const pola = 0.6 + 10 * Math.pow(1 - udio, 1.9);
      gore.push(`${x.toFixed(1)} ${(y - pola).toFixed(1)}`);
      dolje.unshift(`${x.toFixed(1)} ${(y + pola * 0.9).toFixed(1)}`);
    }
  });
  return `M${gore.join(" L")} L${dolje.join(" L")}Z`;
})();

/** Korijenje pod stablom (mjere crteža 300 × 170, deblo je na x = 150). */
const KORIJENJE = [
  "M150 0 C150 34 146 66 150 104 C153 128 148 150 151 168",
  "M146 4 C132 26 118 40 100 52 C82 64 70 84 58 110 C52 124 44 134 34 142",
  "M154 4 C168 26 184 38 202 50 C222 62 232 86 244 110 C250 122 258 132 268 138",
  "M148 20 C138 48 126 70 118 96 C112 116 104 134 92 152",
  "M152 20 C162 50 176 70 184 96 C190 116 200 134 212 150",
  "M100 52 C84 54 66 52 48 58 C34 62 22 70 8 74",
  "M202 50 C220 52 238 50 254 56 C268 60 280 68 294 70",
  "M118 96 C108 104 100 116 96 128",
  "M184 96 C194 106 200 118 204 130",
];

function Kometa({ d, kasni, traje }: { d: string; kasni: number; traje: number }) {
  const stil = { "--d": `${kasni}s`, animationDuration: `${traje}s` } as CSSProperties;
  return (
    <g>
      <g opacity=".3">
        <path className="polje-kometa sjaj" pathLength={1} d={d} style={stil} />
      </g>
      <path className="polje-kometa rep" pathLength={1} d={d} style={stil} />
      <path className="polje-kometa glava" pathLength={1} d={d} style={stil} />
    </g>
  );
}

export default function Korijeni() {
  return (
    <div className="am-kor" aria-hidden="true">
      {/* zvijezda nad obzorom, kamo vodi put */}
      <svg className="am-kor-zvijezda" viewBox="-60 -60 120 120">
        <defs>
          <radialGradient id="am-kor-sjaj">
            <stop offset="0" stopColor="#fff6d8" stopOpacity=".7" />
            <stop offset=".3" stopColor="#f0d28c" stopOpacity=".22" />
            <stop offset="1" stopColor="#f0d28c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="58" fill="url(#am-kor-sjaj)" />
        <g transform="scale(3.4)">
          <path className="am-tr" d={ISKRA} fill="#fff8e2" />
        </g>
      </svg>

      <svg className="am-kor-krajolik" viewBox="0 0 1440 420" preserveAspectRatio="none">
        <defs>
          <linearGradient id="am-kor-daleko" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f3a78" />
            <stop offset="1" stopColor="#1c2350" />
          </linearGradient>
          <linearGradient id="am-kor-srednje" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a2148" />
            <stop offset="1" stopColor="#11162f" />
          </linearGradient>
          <linearGradient id="am-kor-blizu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0e1228" />
            <stop offset="1" stopColor="#090c1c" />
          </linearGradient>
          <linearGradient id="am-kor-put" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e9c98a" stopOpacity="0" />
            <stop offset=".16" stopColor="#e9c98a" stopOpacity=".5" />
            <stop offset=".78" stopColor="#fff3cf" stopOpacity=".9" />
          </linearGradient>
          <radialGradient id="am-kor-obzor" cx="1104" cy="176" r="330" gradientUnits="userSpaceOnUse" gradientTransform="translate(1104 176) scale(1 .42) translate(-1104 -176)">
            <stop offset="0" stopColor="#f0d28c" stopOpacity=".34" />
            <stop offset="1" stopColor="#f0d28c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="420" fill="url(#am-kor-obzor)" />
        <path d={greben({ sjeme: 71, y: 164, amp: 30, valova: 2.3, dno: 420 })} fill="url(#am-kor-daleko)" opacity=".8" />
        <path d={greben({ sjeme: 83, y: 198, amp: 24, valova: 3.1, suma: 8, dno: 420 })} fill="url(#am-kor-srednje)" />
        <path d={greben({ sjeme: 97, y: 276, amp: 20, valova: 1.5, oktave: 3, nagib: 60, dno: 420 })} fill="url(#am-kor-blizu)" />
        <path d={PLOHA} fill="url(#am-kor-put)" />
        <g className="polje-komete am-kor-svjetlo" fill="none" strokeLinecap="round">
          <Kometa d={PUT} kasni={0} traje={8} />
          <Kometa d={PUT} kasni={4} traje={8} />
        </g>
      </svg>

      {/* stablo života; korijenje sa slike nastavlja se pod zemljom */}
      <div className="am-kor-stablo">
        <i className="am-kor-zar" />
        <Image className="am-kor-drvo" src="/img/drvo-zlatno.png" alt="" width={520} height={500} sizes="(max-width: 900px) 190px, 300px" />
        <svg className="am-kor-korijenje" viewBox="0 0 300 170">
          <defs>
            <linearGradient id="am-kor-zila" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="170">
              <stop offset="0" stopColor="#e9c98a" stopOpacity=".9" />
              <stop offset=".55" stopColor="#c9973f" stopOpacity=".5" />
              <stop offset="1" stopColor="#c9973f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g fill="none" stroke="url(#am-kor-zila)" strokeLinecap="round">
            {KORIJENJE.map((d, i) => (
              <path key={i} d={d} strokeWidth={i < 3 ? 1.5 : i < 5 ? 1.1 : 0.8} />
            ))}
          </g>
          <g className="polje-komete am-kor-zile" fill="none" strokeLinecap="round">
            <Kometa d={KORIJENJE[1]} kasni={0.6} traje={6} />
            <Kometa d={KORIJENJE[2]} kasni={2.8} traje={6.6} />
            <Kometa d={KORIJENJE[0]} kasni={4.4} traje={5.4} />
          </g>
        </svg>
        {[
          [12, 46, 3, 9, 4.2, 0],
          [84, 38, 2.4, 11, 5, -3],
          [28, 16, 2, 13, 3.6, -6],
          [72, 64, 2.6, 10, 4.6, -2],
          [50, 4, 2, 12, 5.4, -8],
        ].map(([x, y, v, t, s, d]) => (
          <i key={x} className="am-kor-krijesnica" style={vars({ "--x": `${x}%`, "--y": `${y}%`, "--v": `${v}px`, "--t": `${t}s`, "--s": `${s}s`, "--d": `${d}s` })} />
        ))}
      </div>
    </div>
  );
}

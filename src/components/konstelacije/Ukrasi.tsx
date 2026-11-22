import { ISKRA } from "@/lib/zvijezda";
import { vars } from "@/lib/util";
import Korona from "./Korona";

/** Sitni crteži stranice Konstelacije: gravure zlatnom tintom na papiru i pomrčina na noćnoj ploči. */
const TINTA = "#84601d";
const ZLATO = "#b88a3e";
const z = (n: number) => +n.toFixed(1);
const polarno = (kut: number, r: number, s = 300): [number, number] => {
  const a = ((kut - 90) * Math.PI) / 180;
  return [z(s + r * Math.cos(a)), z(s + r * Math.sin(a))];
};

/** Zviježđe predaka nad lukom: [kut od vrha u stupnjevima, polumjer, veličina zvijezde]. */
const NAD_LUKOM: Array<[number, number, number]> = [
  [-74, 252, 0.7],
  [-47, 288, 0.95],
  [-19, 247, 0.62],
  [11, 283, 1.15],
  [40, 250, 0.74],
  [69, 287, 0.86],
];

/**
 * Kružnice astrolaba iza luka sa slikom: vire oko luka kao aureola, sa skalom koja se polako okreće
 * i malim zviježđem predaka iznad tjemena. Središte crteža je središte polukruga luka.
 */
export function LukKrug() {
  const tocke = NAD_LUKOM.map(([kut, r]) => polarno(kut, r));
  return (
    <svg className="ks-luk-krug" viewBox="0 0 600 600" aria-hidden="true">
      <g fill="none" stroke={ZLATO}>
        <circle cx="300" cy="300" r="216" strokeWidth=".8" opacity=".7" />
        <circle cx="300" cy="300" r="231" strokeWidth=".8" strokeDasharray="0.8 5.2" strokeLinecap="round" opacity=".8" />
        <g className="ks-g-vrti spor" style={{ transformOrigin: "300px 300px" }}>
          <circle cx="300" cy="300" r="268" pathLength={360} strokeWidth="6" strokeDasharray="0.25 1.75" opacity=".42" />
          <circle cx="300" cy="300" r="266" pathLength={360} strokeWidth="11" strokeDasharray="0.3 14.7" opacity=".7" />
        </g>
        <circle cx="300" cy="300" r="260" strokeWidth=".6" opacity=".6" />
        <circle cx="300" cy="300" r="297" strokeWidth=".6" strokeDasharray="0.8 7" strokeLinecap="round" opacity=".6" />
      </g>
      <g fill="none" stroke={TINTA} strokeWidth=".9" strokeLinecap="round" opacity=".8">
        {tocke.slice(1).map((b, i) => {
          const a = tocke[i];
          const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
          const o = 12 / d;
          return <line key={i} x1={z(a[0] + (b[0] - a[0]) * o)} y1={z(a[1] + (b[1] - a[1]) * o)} x2={z(b[0] - (b[0] - a[0]) * o)} y2={z(b[1] - (b[1] - a[1]) * o)} />;
        })}
      </g>
      {tocke.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${NAD_LUKOM[i][2]})`}>
          <path className="ks-g-iskra mirna" d={ISKRA} fill={TINTA} style={vars({ "--d": `${z(i * -1.1)}s` })} />
        </g>
      ))}
    </svg>
  );
}

/** Životni luk nad godinama rođenja i smrti: putanja sunca od izlaska do zalaska, po kojoj putuje svjetlo. */
export function ZivotniLuk() {
  const luk = "M48 128 A152 100 0 0 1 352 128";
  const skala = "M30 128 A170 118 0 0 1 370 128";
  return (
    <svg className="ks-zivot-luk" viewBox="0 0 400 140" aria-hidden="true">
      <g fill="none" stroke={ZLATO}>
        <path d="M4 128 H396" strokeWidth=".9" />
        <path d="M4 134 H396" strokeWidth=".7" strokeDasharray="0.6 5" strokeLinecap="round" opacity=".8" />
        <path d={luk} strokeWidth="1" strokeDasharray="0.8 5.2" strokeLinecap="round" />
        {/* skala nad lukom: sitne crtice i duža svaka deseta, kao na sunčaniku */}
        <path d={skala} pathLength={94} strokeWidth="5" strokeDasharray="0.14 0.86" strokeDashoffset="0.07" opacity=".55" />
        <path d={skala} pathLength={94} strokeWidth="10" strokeDasharray="0.18 9.82" strokeDashoffset="0.09" opacity=".8" />
        <path d="M22 128 A178 126 0 0 1 378 128" strokeWidth=".6" opacity=".6" />
      </g>
      <path className="ks-zivot-trag" d={luk} pathLength={1} fill="none" stroke={ZLATO} strokeWidth="1.8" strokeLinecap="round" />
      <path className="ks-zivot-sunce" d={luk} pathLength={1} fill="none" stroke={TINTA} strokeWidth="8" strokeLinecap="round" />
      <g fill="#fffaf3" stroke={TINTA} strokeWidth="1.2">
        <circle cx="48" cy="128" r="4.2" />
        <circle cx="352" cy="128" r="4.2" />
      </g>
      <g transform="translate(200 52) scale(.9)">
        <path className="ks-g-iskra mirna" d={ISKRA} fill={TINTA} />
      </g>
    </svg>
  );
}

/**
 * Ruža vjetrova pod kazalom životnih tema: četiri strane svijeta su četiri područja (01–04).
 * Kazaljka na obodu sama se okrene prema odabranom području; okreće je CSS preko :has() na kartici.
 */
export function Ruza() {
  const S = 130;
  // krak ruže: vrh na udaljenosti `d`, baza na susjednim osima na udaljenosti `b`; polovice su različito osjenčane
  const krak = (kut: number, d: number, b: number, kljuc: string) => {
    const [vx, vy] = polarno(kut, d, S);
    const [lx, ly] = polarno(kut - 45, b, S);
    const [dx, dy] = polarno(kut + 45, b, S);
    return (
      <g key={kljuc}>
        <path d={`M${S} ${S} L${vx} ${vy} L${lx} ${ly}Z`} fill={ZLATO} fillOpacity=".8" stroke={TINTA} strokeWidth=".6" strokeLinejoin="round" />
        <path d={`M${S} ${S} L${vx} ${vy} L${dx} ${dy}Z`} fill="#fffaf3" stroke={TINTA} strokeWidth=".6" strokeLinejoin="round" />
      </g>
    );
  };
  const oznake: Array<[string, number, number]> = [
    ["01", 130, 39],
    ["02", 224, 134.5],
    ["03", 130, 230],
    ["04", 36, 134.5],
  ];
  return (
    <svg className="ks-ruza" viewBox="0 0 260 260" aria-hidden="true">
      <g fill="none" stroke={ZLATO}>
        <g className="ks-g-vrti" style={{ transformOrigin: "130px 130px" }}>
          <circle cx={S} cy={S} r="125" pathLength={360} strokeWidth="5" strokeDasharray="0.3 2.7" opacity=".5" />
          <circle cx={S} cy={S} r="123.5" pathLength={360} strokeWidth="8" strokeDasharray="0.4 29.6" opacity=".8" />
        </g>
        <circle cx={S} cy={S} r="116" strokeWidth=".8" />
        <circle cx={S} cy={S} r="78" strokeWidth=".8" strokeDasharray="0.7 4.3" strokeLinecap="round" />
        <circle cx={S} cy={S} r="40" strokeWidth=".6" opacity=".8" />
      </g>
      {[45, 135, 225, 315].map((k) => krak(k, 50, 11, `m${k}`))}
      {[0, 90, 180, 270].map((k) => krak(k, 76, 16, `v${k}`))}
      <circle cx={S} cy={S} r="4.6" fill="#fffaf3" stroke={TINTA} strokeWidth="1.1" />
      <g className="ks-ruza-oznake">
        {oznake.map(([t, x, y], i) => (
          <text key={t} className={`ks-ruza-o${i + 1}`} x={x} y={y} textAnchor="middle">
            {t}
          </text>
        ))}
      </g>
      {/* kazaljka: mali znak na obodu koji dođe do odabrane strane */}
      <g className="ks-ruza-kaz">
        <circle cx={S} cy="14" r="8.5" fill="#fffaf3" stroke={TINTA} strokeWidth="1.1" />
        <g transform={`translate(${S} 14) scale(.62)`}>
          <path d={ISKRA} fill={TINTA} />
        </g>
      </g>
    </svg>
  );
}

/**
 * Pomrčina za „Što konstelacije nisu": dok ploča ne uđe u ekran Mjesec stoji pred Suncem i vidi se
 * samo korona; tada se sjena odmakne. Mjere kao na naslovnici: Sunce je u (104, 104) crteža 240 × 240.
 */
export function Pomrcina() {
  return (
    <div className="ks-pom" aria-hidden="true">
      <div className="ks-pom-znak">
        <Korona sjeme={5} className="ks-pom-sunce" />
        <svg className="ks-pom-nebo" viewBox="0 0 240 240">
          <defs>
            <radialGradient id="ks-pom-mjesec" cx=".3" cy=".28" r=".9">
              <stop offset="0" stopColor="#2c3766" />
              <stop offset=".55" stopColor="#151c38" />
              <stop offset="1" stopColor="#0a0e20" />
            </radialGradient>
            <linearGradient id="ks-pom-rub" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffe9b8" />
              <stop offset=".34" stopColor="#e2c487" stopOpacity=".5" />
              <stop offset=".6" stopColor="#e2c487" stopOpacity="0" />
            </linearGradient>
            <clipPath id="ks-pom-krug">
              <circle cx="104" cy="104" r="46" />
            </clipPath>
            <filter id="ks-pom-mek" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <path className="ks-pom-put" d="M150 110 Q180 118 184 156" fill="none" stroke="#e2c487" strokeWidth=".7" strokeDasharray="2 5" strokeLinecap="round" />
          <g className="ks-pom-mjesec">
            <circle cx="104" cy="104" r="46" fill="url(#ks-pom-mjesec)" />
            {/* mora: tamnije mrlje na Mjesečevu licu */}
            <g clipPath="url(#ks-pom-krug)" fill="#070a18" filter="url(#ks-pom-mek)">
              <ellipse cx="88" cy="94" rx="15" ry="11" opacity=".55" />
              <ellipse cx="120" cy="112" rx="13" ry="9" opacity=".5" />
              <ellipse cx="100" cy="128" rx="10" ry="6" opacity=".45" />
              <circle cx="124" cy="86" r="6" opacity=".4" />
            </g>
            {/* rub koji hvata svjetlo sunca */}
            <circle cx="104" cy="104" r="46" fill="none" stroke="url(#ks-pom-rub)" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

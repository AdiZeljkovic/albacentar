import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Naslov from "@/components/Naslov";
import Oblaci from "@/components/pocetna/Oblaci";
import { greben, zrake } from "@/lib/krajolik";
import { cx, kas, vars } from "@/lib/util";
import { ISKRA } from "@/lib/zvijezda";

/**
 * „Put koji me oblikovao" kao stvarno putovanje. Put koji u svitanju iznad nestaje u magli ovdje
 * izlazi iz nje i vijuga niz stranicu; svaka postaja je mala niša uz put (kao poklonac uz cestu)
 * s prizorom toga mjesta. Put se sam iscrta kad uđe u ekran, njime stalno putuje svjetlo, a niša
 * zasvijetli kad svjetlo stigne do nje. Sve je CSS i SVG, bez JavaScripta.
 */

export type Postaja = { mjesto: string; opis: string };

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------- cesta (računalo): visina reda, točke postaja i krivulja kroz njih ---------- */
type T = [number, number];
const RED = 330;
/** Postaje: sredine redova, naizmjence desno i lijevo od sredine crteža (širok je 1000). */
const TOCKE: T[] = [
  [710, 165],
  [290, 495],
  [710, 825],
  [290, 1155],
  [710, 1485],
];
/** Dionice između postaja (kubne krivulje); namjerno nisu zrcalne. */
const DIONICE: Array<[T, T, T, T]> = [
  [TOCKE[0], [724, 365], [264, 272], TOCKE[1]],
  [TOCKE[1], [316, 710], [672, 612], TOCKE[2]],
  [TOCKE[2], [742, 1022], [274, 952], TOCKE[3]],
  [TOCKE[3], [306, 1360], [696, 1284], TOCKE[4]],
];
const CESTA = `M710 0 L710 165 ${DIONICE.map(([, b, c, d]) => `C${b.join(" ")} ${c.join(" ")} ${d.join(" ")}`).join(" ")}`;
/** Na kojem je dijelu duljine ceste koja postaja (za usklađivanje svjetla i niša). */
const UDIO = [0.066, 0.304, 0.533, 0.769, 1];
const HOD = 16;

const naKrivulji = ([a, b, c, d]: [T, T, T, T], t: number): T => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]) as T;
};

/** Je li mjesto zauzeto nišom ili tekstom postaje (tamo se uz cestu ništa ne crta). */
function zauzeto(x: number, y: number) {
  return TOCKE.some(([px, py], i) => {
    if (Math.abs(x - px) < 120 && Math.abs(y - py) < 176) return true;
    const desno = i % 2 === 0;
    const [od, doo] = desno ? [130, 600] : [400, 870];
    return x > od && x < doo && Math.abs(y - py) < 112;
  });
}

/** Sitni znakovi uz cestu, kao na starim kartama: stabla, čempresi, busenje. Raspored je određen sjemenom. */
const ZNAKOVI = (() => {
  const izlaz: Array<{ x: number; y: number; vrsta: number; v: number }> = [];
  let n = 0;
  for (const dionica of DIONICE) {
    for (let k = 1; k < 15; k++) {
      const t = k / 15;
      const [x, y] = naKrivulji(dionica, t);
      const [x2, y2] = naKrivulji(dionica, t + 0.01);
      const d = Math.hypot(x2 - x, y2 - y) || 1;
      for (const strana of [-1, 1]) {
        n++;
        if (hash(n * 3.1) < 0.24) continue;
        const od = 42 + hash(n * 7.7) * 60;
        const px = x - ((y2 - y) / d) * od * strana + (hash(n * 1.3) - 0.5) * 16;
        const py = y + ((x2 - x) / d) * od * strana + (hash(n * 2.9) - 0.5) * 16;
        if (zauzeto(px, py)) continue;
        izlaz.push({ x: Math.round(px), y: Math.round(py), vrsta: Math.floor(hash(n * 5.3) * 4), v: +(1.05 + hash(n * 9.9) * 0.75).toFixed(2) });
      }
    }
  }
  return izlaz.sort((a, b) => a.y - b.y);
})();

const ZNAK = [
  // bjelogorica
  "M0 0 L0 -5 M-5 -6 C-7.5 -11 -3 -15.5 1 -13.5 C5.5 -15 8.5 -10 5.5 -6.4 C3 -4.2 -3 -4 -5 -6Z",
  // čempres ili jela
  "M0 0 L0 -3 M-4.2 -3 L0 -15 L4.2 -3Z M-2 -6.5 L2 -6.5",
  // busen trave
  "M-3.4 0 L-4.6 -5 M0 0 L0 -7.4 M3.4 0 L5 -5.2 M-7 0.6 L7 0.6",
  // dva stabla
  "M-4 0 L-4 -4 M-8 -5 C-9.6 -9 -6 -12.4 -3.4 -11 C-0.6 -12.2 2 -8.6 0 -5.4 C-2 -3.6 -6.4 -3.4 -8 -5Z M5 0 L5 -3 M1.6 -3 L5 -12 L8.4 -3Z",
];

/** Ruža vjetrova u praznom kutu karte. */
function Ruza() {
  const kraci = Array.from({ length: 16 }, (_, k) => ({
    kut: k * 22.5,
    d: k % 4 === 0 ? 96 : k % 2 === 0 ? 64 : 38,
    s: k % 4 === 0 ? 10 : k % 2 === 0 ? 7.5 : 4.6,
  })).sort((a, b) => a.d - b.d);
  return (
    <svg className="am-ruza" viewBox="-130 -130 260 260" aria-hidden="true">
      <g fill="none" stroke="#a47b3f">
        <circle r="112" strokeWidth=".8" />
        <circle r="106" strokeWidth="3" strokeDasharray="0.6 6.34" opacity=".8" />
        <circle r="100" strokeWidth=".5" />
        <circle r="46" strokeWidth=".5" strokeDasharray="2 4" />
      </g>
      <g className="am-ruza-igla" stroke="#a47b3f" strokeWidth=".7" strokeLinejoin="round">
        {kraci.map(({ kut, d, s }) => (
          <g key={kut} transform={`rotate(${kut})`}>
            <path d={`M0 0 L${-s} ${-s * 1.5} L0 ${-d}Z`} fill="#c9a35c" fillOpacity=".55" />
            <path d={`M0 0 L${s} ${-s * 1.5} L0 ${-d}Z`} fill="#fdf6e8" />
          </g>
        ))}
        <circle r="3" fill="#fdf6e8" />
      </g>
      <text y="-118" textAnchor="middle" fontSize="13" letterSpacing="1" fill="#84601d" style={{ fontFamily: "var(--serif)" }}>
        S
      </text>
    </svg>
  );
}

/** Svjetlo koje putuje cestom. */
function Hod({ kasni }: { kasni: number }) {
  const stil = { "--d": `${kasni}s`, animationDuration: `${HOD}s` } as CSSProperties;
  return (
    <g>
      <g opacity=".34">
        <path className="polje-kometa sjaj" pathLength={1} d={CESTA} style={stil} />
      </g>
      <path className="polje-kometa rep" pathLength={1} d={CESTA} style={stil} />
      <path className="polje-kometa glava am-hod-rub" pathLength={1} d={CESTA} style={stil} />
      <path className="polje-kometa glava" pathLength={1} d={CESTA} style={stil} />
    </g>
  );
}

/* ---------- niša: luk sa zlatnim okvirom, u njemu prizor ---------- */
const LUK = "M9 200 L9 76 A66 66 0 0 1 141 76 L141 200Z";

function Nisa({ id, children, preko, cilj }: { id: string; children: ReactNode; preko?: ReactNode; cilj?: boolean }) {
  return (
    <div className="am-nisa" data-reveal="zum" aria-hidden="true">
      {cilj && <i className="am-nisa-zrake" style={{ background: zrake(31, "206 150 52", 0.42) }} />}
      <i className="am-nisa-sjaj" />
      <svg viewBox="-6 -8 162 218">
        <defs>
          <clipPath id={`${id}-luk`}>
            <path d={LUK} />
          </clipPath>
          <linearGradient id={`${id}-sjena`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a0f24" stopOpacity=".4" />
            <stop offset=".3" stopColor="#1a0f24" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${id}-luk)`}>
          {children}
          {/* sjena svoda */}
          <rect width="150" height="200" fill={`url(#${id}-sjena)`} />
        </g>
        <g fill="none" stroke="#a87a30">
          <path d="M3.4 200 L3.4 76 A71.6 71.6 0 0 1 146.6 76 L146.6 200" strokeWidth="1.3" />
          <path d={LUK.slice(0, -1)} strokeWidth=".7" stroke="#e6c98e" />
          <path d="M6.2 76 A68.8 68.8 0 0 1 143.8 76" pathLength={96} strokeWidth="3.4" strokeDasharray="0.4 3.6" strokeDashoffset="0.2" opacity=".75" />
          <path d="M-1 76 L7 76 M143 76 L151 76" strokeWidth="1" />
          <path d="M-3 200.6 L153 200.6" strokeWidth="1.4" />
          <path d="M-6 205.4 L156 205.4" strokeWidth=".7" opacity=".7" />
        </g>
        <path d="M75 -6 L79.6 1 L75 8 L70.4 1Z" fill="#fbeecb" stroke="#a87a30" strokeWidth=".8" />
        <path className="am-nisa-dragulj" d="M75 -6 L79.6 1 L75 8 L70.4 1Z" fill="#f0a93a" />
      </svg>
      {preko}
    </div>
  );
}

const Iskra = ({ x, y, v, boja = "#fff6d8", tr }: { x: number; y: number; v: number; boja?: string; tr?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${v})`}>
    <path className={tr === undefined ? undefined : "am-tr"} style={tr === undefined ? undefined : vars({ "--d": `${tr}s` })} d={ISKRA} fill={boja} />
  </g>
);

/** Sitne zvijezde u niši. */
function Sitne({ broj, sjeme, doY }: { broj: number; sjeme: number; doY: number }) {
  return (
    <g fill="#e9e4ff">
      {Array.from({ length: broj }, (_, i) => (
        <circle
          key={i}
          cx={(9 + hash(i * 1.7 + sjeme) * 132).toFixed(1)}
          cy={(8 + hash(i * 4.3 + sjeme * 2) * (doY - 8)).toFixed(1)}
          r={(0.25 + hash(i * 9.1 + sjeme) * 0.55).toFixed(2)}
          opacity={(0.3 + hash(i * 3.3 + sjeme) * 0.6).toFixed(2)}
        />
      ))}
    </g>
  );
}

/** Zagreb u zoru: tornjevi katedrale pred Medvednicom. */
function Zagreb() {
  return (
    <>
      <defs>
        <linearGradient id="am-z-nebo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#56427f" />
          <stop offset=".42" stopColor="#b86d88" />
          <stop offset=".68" stopColor="#f2a777" />
          <stop offset=".88" stopColor="#ffdc9c" />
        </linearGradient>
        <radialGradient id="am-z-sunce" cx="75" cy="152" r="78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset=".3" stopColor="#ffe6a8" stopOpacity=".75" />
          <stop offset="1" stopColor="#ffd690" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="150" height="200" fill="url(#am-z-nebo)" />
      <Sitne broj={9} sjeme={5} doY={60} />
      <rect width="150" height="200" fill="url(#am-z-sunce)" />
      <path d={greben({ sjeme: 4, y: 134, amp: 10, valova: 1.3, sirina: 150, dno: 200 })} fill="#9a5c84" opacity=".7" />
      <g fill="#2a1836">
        <path d="M54 180 L54 120 L55.6 120 L56.4 108 L57.2 120 L58.6 120 L63 54 L67.4 120 L68.8 120 L69.6 108 L70.4 120 L72 120 L72 134 L75 127 L78 134 L78 120 L79.6 120 L80.4 108 L81.2 120 L82.6 120 L87 54 L91.4 120 L92.8 120 L93.6 108 L94.4 120 L96 120 L96 140 L121 140 L125 148 L125 180Z" />
        <path d="M63 55 L63 47 M61.4 49.8 L64.6 49.8 M87 55 L87 47 M85.4 49.8 L88.6 49.8" fill="none" stroke="#2a1836" strokeWidth=".8" />
      </g>
      <g fill="#ffd9a0" opacity=".6">
        <rect x="61.6" y="128" width="2.8" height="14" rx="1.4" />
        <rect x="85.6" y="128" width="2.8" height="14" rx="1.4" />
        <circle cx="75" cy="146" r="2.8" />
        <rect x="101" y="150" width="2.2" height="10" rx="1.1" />
        <rect x="108" y="150" width="2.2" height="10" rx="1.1" />
        <rect x="115" y="150" width="2.2" height="10" rx="1.1" />
      </g>
      <path d={greben({ sjeme: 9, y: 174, amp: 4, valova: 2, suma: 8, sirina: 150, dno: 200 })} fill="#1d1127" />
    </>
  );
}

/** Melbourne: južno nebo s Južnim križem nad morem. */
function Melbourne() {
  return (
    <>
      <defs>
        <linearGradient id="am-m-nebo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060a1c" />
          <stop offset=".55" stopColor="#151d48" />
          <stop offset=".84" stopColor="#2b3a78" />
          <stop offset="1" stopColor="#4d5a9a" />
        </linearGradient>
        <radialGradient id="am-m-put">
          <stop offset="0" stopColor="#b9c4ff" stopOpacity=".17" />
          <stop offset="1" stopColor="#b9c4ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="am-m-more" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2656" />
          <stop offset="1" stopColor="#0a1028" />
        </linearGradient>
      </defs>
      <rect width="150" height="200" fill="url(#am-m-nebo)" />
      <ellipse cx="72" cy="84" rx="44" ry="128" transform="rotate(30 72 84)" fill="url(#am-m-put)" />
      <Sitne broj={54} sjeme={3} doY={160} />
      <path d="M82 44 L77 112 M54 85 L101 73" fill="none" stroke="#e2c487" strokeWidth=".5" strokeDasharray="1.5 2.5" opacity=".55" />
      <Iskra x={82} y={44} v={0.62} tr={0} />
      <Iskra x={77} y={112} v={0.84} tr={1.3} />
      <Iskra x={54} y={85} v={0.7} tr={2.4} />
      <Iskra x={101} y={73} v={0.5} tr={0.7} />
      <circle cx="89" cy="93" r="1" fill="#fff6d8" opacity=".85" />
      <Iskra x={21} y={110} v={0.56} boja="#ffe9b8" tr={1.9} />
      <Iskra x={37} y={101} v={0.46} boja="#cfdcff" tr={3.1} />
      <rect y="166" width="150" height="34" fill="url(#am-m-more)" />
      <rect y="165.6" width="150" height=".7" fill="#9fb0e8" opacity=".5" />
      <path d="M72 171 h10 M75 176 h5 M70 182 h9 M76 188 h4" fill="none" stroke="#e2c487" strokeWidth=".6" strokeLinecap="round" opacity=".4" />
      <path d={greben({ sjeme: 14, y: 180, amp: 5, valova: 1.2, suma: 5, nagib: 18, sirina: 150, dno: 200 })} fill="#04060f" />
    </>
  );
}

/** Prag u sumrak: most s tornjem, iznad njega Hradčani. */
function Prag() {
  return (
    <>
      <defs>
        <linearGradient id="am-p-nebo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33285c" />
          <stop offset=".36" stopColor="#82476f" />
          <stop offset=".62" stopColor="#dd8560" />
          <stop offset=".8" stopColor="#ffc98a" />
        </linearGradient>
        <radialGradient id="am-p-sunce" cx="112" cy="150" r="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff6d0" stopOpacity=".95" />
          <stop offset="1" stopColor="#ffd08a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="am-p-voda" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6b07c" />
          <stop offset="1" stopColor="#9a5478" />
        </linearGradient>
      </defs>
      <rect width="150" height="200" fill="url(#am-p-nebo)" />
      <Sitne broj={7} sjeme={11} doY={48} />
      <rect width="150" height="200" fill="url(#am-p-sunce)" />
      {/* Hradčani s katedralom */}
      <g fill="#6b3d6a">
        <path d={greben({ sjeme: 6, y: 136, amp: 6, valova: 1.1, sirina: 150, dno: 200 })} />
        <path d="M18 138 L18 124 L58 124 L58 118 L98 118 L98 124 L132 124 L132 138Z" />
        <path d="M60 118 L62 108 L84 108 L84 118Z" />
        <path d="M69 118 L69 97 L70.6 97 L71.6 90 L73.5 82 L75.4 90 L76.4 97 L78 97 L78 118Z" />
        <path d="M84 118 L84 101 L86 86 L88 101 L88 118Z M90 118 L90 101 L92 86 L94 101 L94 118Z" />
        <path d="M64 108 L65 100 L66 108Z" />
      </g>
      <rect y="162" width="150" height="38" fill="url(#am-p-voda)" />
      <path d="M96 170 h22 M104 176 h12 M92 183 h18 M108 190 h9 M30 174 h8 M60 180 h6" fill="none" stroke="#fff1cc" strokeWidth=".7" strokeLinecap="round" opacity=".6" />
      {/* most i mostni toranj */}
      <g fill="#23132d">
        <path d="M0 158 L150 158 L150 200 L147 200 L147 186 A17 15 0 0 0 113 186 L113 200 L101 200 L101 186 A17 15 0 0 0 67 186 L67 200 L55 200 L55 186 A17 15 0 0 0 21 186 L21 200 L0 200Z" />
        <rect y="156.2" width="150" height="2" />
        <path d="M60 157 L60 150.6 L61 148.6 L62 150.6 L62 157Z M106 157 L106 150.6 L107 148.6 L108 150.6 L108 157Z M129 157 L129 151.6 L130 150 L131 151.6 L131 157Z" />
        <path d="M22 158 L22 123 L20.6 123 L20.6 120 L23 120 L23.7 112 L24.4 120 L26.4 120 L29.4 98 L36.6 98 L39.6 120 L41.6 120 L42.3 112 L43 120 L45.4 120 L45.4 123 L44 123 L44 158Z" />
        <path d="M29.6 98 L29.6 90 M36.4 98 L36.4 90 M84 157 L84 147" fill="none" stroke="#23132d" strokeWidth=".8" />
        <circle cx="84" cy="146.4" r="1.1" />
      </g>
      <path d="M28.8 158 L28.8 148 A4.2 5 0 0 1 37.2 148 L37.2 158Z" fill="#e79a6a" opacity=".85" />
      <circle cx="84" cy="146.4" r=".7" fill="#fff1cc" />
    </>
  );
}

const cempres = (x: number, dno: number, v: number, s: number) =>
  `M${x} ${dno} C${x - s} ${dno - v * 0.3} ${x - s * 0.7} ${dno - v * 0.74} ${x} ${dno - v} C${x + s * 0.7} ${dno - v * 0.74} ${x + s} ${dno - v * 0.3} ${x} ${dno}Z`;

/** Lago di Garda: jezero među planinama u jutarnjoj izmaglici, čempresi na obali. */
function Garda() {
  return (
    <>
      <defs>
        <linearGradient id="am-g-nebo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a69a8" />
          <stop offset=".4" stopColor="#9fb8da" />
          <stop offset=".68" stopColor="#f3dcc2" />
        </linearGradient>
        <linearGradient id="am-g-voda" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d5dfe9" />
          <stop offset=".45" stopColor="#a3b9d6" />
          <stop offset="1" stopColor="#7b98c2" />
        </linearGradient>
        <radialGradient id="am-g-sunce" cx="58" cy="92" r="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff8e0" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff0cc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="150" height="200" fill="url(#am-g-nebo)" />
      <rect width="150" height="200" fill="url(#am-g-sunce)" />
      <path d={greben({ sjeme: 2, y: 102, amp: 20, valova: 1.3, sirina: 150, dno: 200 })} fill="#8a9ccc" opacity=".7" />
      <path d={greben({ sjeme: 12, y: 118, amp: 15, valova: 1.7, nagib: -24, sirina: 150, dno: 200 })} fill="#6076ae" />
      <path d={greben({ sjeme: 30, y: 132, amp: 10, valova: 1.2, nagib: -64, sirina: 150, dno: 200 })} fill="#3c4f86" />
      <rect y="143" width="150" height="57" fill="url(#am-g-voda)" />
      <rect y="141" width="150" height="5" fill="#fff" opacity=".4" />
      <path d="M44 150 h30 M52 155 h16 M40 161 h22 M56 167 h10 M48 174 h14 M96 152 h10 M118 158 h8" fill="none" stroke="#fffaf0" strokeWidth=".8" strokeLinecap="round" opacity=".75" />
      {/* jedrilica */}
      <path d="M104 162 L104 148 L111.4 162Z" fill="#fffaf0" />
      <path d="M103 162 L103 150.4 L98.6 162Z" fill="#f4e6cf" />
      <path d="M97.6 163 L113 163 L111 165.6 L99.6 165.6Z" fill="#33264a" />
      <path d="M100 168 h10" fill="none" stroke="#33264a" strokeWidth=".6" opacity=".4" />
      {/* obala s čempresima */}
      <g fill="#1c2a30">
        <path d="M0 200 L0 178 C20 172 44 178 68 190 C80 196 92 199 104 200Z" />
        <path d={cempres(15, 180, 56, 5.4)} />
        <path d={cempres(27, 179, 40, 4.6)} />
        <path d={cempres(41, 181, 30, 4)} />
      </g>
    </>
  );
}

/** 2026.: stablo života pod zviježđem obitelji. Stablo je slika postavljena preko niše. */
function Cilj() {
  const z: Array<[number, number, number]> = [
    [37, 70, 0.5],
    [56, 48, 0.62],
    [79, 58, 0.86],
    [101, 38, 0.56],
    [115, 64, 0.5],
    [73, 84, 0.42],
  ];
  return (
    <>
      <defs>
        <linearGradient id="am-c-nebo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#080c22" />
          <stop offset=".55" stopColor="#18204c" />
          <stop offset="1" stopColor="#3a3670" />
        </linearGradient>
        <radialGradient id="am-c-sjaj" cx="75" cy="150" r="74" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f6d488" stopOpacity=".6" />
          <stop offset=".5" stopColor="#e2a85c" stopOpacity=".16" />
          <stop offset="1" stopColor="#e2a85c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="150" height="200" fill="url(#am-c-nebo)" />
      <Sitne broj={34} sjeme={8} doY={150} />
      <rect width="150" height="200" fill="url(#am-c-sjaj)" />
      <path d="M37 70 L56 48 L79 58 L101 38 L115 64 M79 58 L73 84" fill="none" stroke="#e2c487" strokeWidth=".55" opacity=".7" />
      {z.map(([x, y, v], i) => (
        <Iskra key={i} x={x} y={y} v={v} tr={i * 0.8} />
      ))}
      <path d={greben({ sjeme: 7, y: 190, amp: 2.5, valova: 1.2, sirina: 150, dno: 200 })} fill="#080b1c" />
    </>
  );
}

const PRIZORI = [Zagreb, Melbourne, Prag, Garda, Cilj];

export default function Putovanje({ oznaka, naslov, postaje }: { oznaka: string; naslov: string; postaje: readonly Postaja[] }) {
  return (
    <section className="am-put zrno">
      {/* vedro jutro nakon svitanja: sunce je više, nebom plove oblaci i ptice */}
      <div className="am-put-nebo" aria-hidden="true">
        <i className="am-put-sunce">
          <i className="am-put-zrake" style={{ background: zrake(14, "236 180 96", 0.2) }} />
          <i className="am-put-kolut" />
        </i>
        <Oblaci id="am-po1" className="am-put-oblaci a" boja={[1, 1, 1]} sjena={[0.78, 0.62, 0.42]} sjeme={7} gustoca={3.4} />
        <Oblaci id="am-po2" className="am-put-oblaci b" boja={[1, 1, 1]} sjena={[0.78, 0.62, 0.42]} sjeme={19} gustoca={3} frek="0.0026 0.013" />
        {[
          { "--y": "5%", "--t": "46s", "--d": "-11s", "--v": 0.9 },
          { "--y": "9%", "--t": "54s", "--d": "-33s", "--v": 0.65 },
          { "--y": "3%", "--t": "50s", "--d": "-24s", "--v": 0.75 },
        ].map((stil) => (
          <svg key={stil["--d"]} className="mj-ptica vd-ptica" viewBox="-13 -9 26 18" style={vars(stil)}>
            <g className="knj-krila" fill="none" stroke="#6b5544" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0 1 Q-5 -7 -12 -3" />
              <path d="M0 1 Q5 -7 12 -3" />
            </g>
          </svg>
        ))}
      </div>

      <div className="w">
        <div className="am-put-vrh">
          {/* put izlazi iz magle svitanja: krivulja od vrha sekcije do prve postaje */}
          <svg className="am-put-spoj" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              {[
                ["am-sp-rub", "#c9a35c", 0.7],
                ["am-sp-tijelo", "#fdf6e8", 1],
                ["am-sp-zlato", "#c9973f", 1],
              ].map(([id, boja, a]) => (
                <linearGradient key={id} id={String(id)} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
                  <stop offset=".04" stopColor={String(boja)} stopOpacity="0" />
                  <stop offset=".5" stopColor={String(boja)} stopOpacity={a} />
                </linearGradient>
              ))}
            </defs>
            <g fill="none">
              <path d="M100 0 C100 58 0 42 0 100" stroke="url(#am-sp-rub)" strokeWidth="25" vectorEffect="non-scaling-stroke" />
              <path d="M100 0 C100 58 0 42 0 100" stroke="url(#am-sp-tijelo)" strokeWidth="22" vectorEffect="non-scaling-stroke" />
              <path d="M100 0 C100 58 0 42 0 100" stroke="url(#am-sp-zlato)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          <header className="am-put-glava">
            <p className="oz" data-reveal>
              {oznaka}
            </p>
            <Naslov>{naslov}</Naslov>
          </header>
        </div>

        <div className="am-put-tok" data-reveal="crta" style={vars({ "--red": `${RED}px`, "--hod": `${HOD}s` })}>
          {/* cesta na širokim ekranima */}
          <Ruza />
          <svg className="am-cesta" viewBox={`0 0 1000 ${RED * postaje.length}`} aria-hidden="true">
            <g fill="none">
              <path d={CESTA} stroke="#c9a35c" strokeOpacity=".7" strokeWidth="25" />
              <path d={CESTA} stroke="#fdf6e8" strokeWidth="22" />
              <path d={CESTA} stroke="#b88a3e" strokeOpacity=".55" strokeWidth="1.3" strokeDasharray="3 9" />
              <path className="am-cesta-zlato" d={CESTA} pathLength={1} stroke="#c9973f" strokeWidth="2.2" />
            </g>
            <g className="am-znakovi" fill="#f6ead4" stroke="#a47b3f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              {ZNAKOVI.map((z, i) => (
                <path key={i} d={ZNAK[z.vrsta]} transform={`translate(${z.x} ${z.y}) scale(${z.v})`} />
              ))}
            </g>
            <g className="am-cesta-svjetlo" fill="none" strokeLinecap="round">
              <Hod kasni={0} />
            </g>
          </svg>
          {/* staza na uskim ekranima */}
          <i className="am-staza" aria-hidden="true" />

          <ol className="am-postaje">
            {postaje.map((p, i) => {
              const Prizor = PRIZORI[i % PRIZORI.length];
              const zadnja = i === postaje.length - 1;
              return (
                <li
                  key={p.mjesto}
                  className={cx("am-postaja", i % 2 ? "lijevo" : "desno", zadnja && "cilj")}
                  style={vars({ "--t": `${(UDIO[i] ?? 1) * HOD}s`, "--tm": `${((i + 0.5) / postaje.length) * HOD}s` })}
                >
                  <Nisa
                    id={`am-n${i}`}
                    cilj={zadnja}
                    preko={zadnja ? <Image className="am-nisa-drvo" src="/img/drvo-zlatno.png" alt="" width={520} height={500} sizes="110px" /> : undefined}
                  >
                    <Prizor />
                  </Nisa>
                  <div className="am-postaja-tekst" data-reveal style={kas(0.12)}>
                    <span className="am-postaja-br">
                      {String(i + 1).padStart(2, "0")} <i>/ {String(postaje.length).padStart(2, "0")}</i>
                    </span>
                    <h3>{p.mjesto}</h3>
                    <p className="mut">{p.opis}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

import type { CSSProperties } from "react";
import { ISKRA } from "@/lib/zvijezda";
import { vars } from "@/lib/util";

/**
 * Tri zviježđa triju načela, preuzeta s naslovnice (pocetna/Nacela.tsx) i prilagođena ovoj stranici:
 * ovdje svako stoji uz svoj tekst, pa mu je krug kraći (14 s umjesto 24 s) i priča se češće ponavlja.
 *   I   Krug:   netko je izvan kruga → doleti na svoje mjesto i krug se zatvori
 *   II  Red:    dijete stoji među roditeljima → vrati se na svoje mjesto i svjetlo poteče
 *   III Vaga:   vaga prevagne na jednu stranu → smiri se u ravnoteži
 * Sve je CSS i SMIL, bez skripte. Uz „manje pokreta" zviježđa miruju u skladu.
 */
export const KRUG_TRAJE = 14;
/** sekunde → udio kruga, za SMIL keyTimes */
const u = (s: number) => +(s / KRUG_TRAJE).toFixed(4);
const z = (n: number) => +n.toFixed(1);

type Tocka = [x: number, y: number];

/** Linija zviježđa: staje malo prije zvijezde, kao na zvjezdanim kartama. */
function skrati(a: Tocka, b: Tocka, odA = 13, odB = 13): [Tocka, Tocka] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.hypot(dx, dy) || 1;
  return [
    [z(a[0] + (dx / d) * odA), z(a[1] + (dy / d) * odA)],
    [z(b[0] - (dx / d) * odB), z(b[1] - (dy / d) * odB)],
  ];
}
function Duz({ a, b, odA, odB, className }: { a: Tocka; b: Tocka; odA?: number; odB?: number; className?: string }) {
  const [p, q] = skrati(a, b, odA, odB);
  return <path className={className} pathLength={1} d={`M${p[0]} ${p[1]} L${q[0]} ${q[1]}`} />;
}

/** Zvijezda: sjaj, žar, četiri zrake i jezgra. */
export function Zv({ x = 0, y = 0, v, i = 0 }: { x?: number; y?: number; v: number; i?: number }) {
  const s = v * 0.13;
  return (
    <g transform={`translate(${z(x)} ${z(y)})`}>
      <circle r={z(v * 3.9)} fill="url(#ks-halo)" />
      <circle r={z(v * 1.75)} fill="url(#ks-zar)" />
      <g className="ks-treptaj" style={vars({ "--t": `${z((i * 0.83) % 5)}s` })}>
        <path d={`M${z(-s)} 0 L0 ${z(-v * 5)} L${z(s)} 0 Z`} fill="url(#ks-krak-g)" />
        <path d={`M${z(-s)} 0 L0 ${z(v * 3.4)} L${z(s)} 0 Z`} fill="url(#ks-krak-d)" />
        <path d={`M0 ${z(-s)} L${z(-v * 2.9)} 0 L0 ${z(s)} Z`} fill="url(#ks-krak-l)" />
        <path d={`M0 ${z(-s)} L${z(v * 2.9)} 0 L0 ${z(s)} Z`} fill="url(#ks-krak-r)" />
        <g opacity=".5" transform="rotate(45)" fill="#fff3d0">
          <path d={`M${z(-s * 0.7)} 0 L0 ${z(-v * 1.3)} L${z(s * 0.7)} 0 L0 ${z(v * 1.3)} Z`} />
          <path d={`M0 ${z(-s * 0.7)} L${z(-v * 1.3)} 0 L0 ${z(s * 0.7)} L${z(v * 1.3)} 0 Z`} />
        </g>
      </g>
      <circle r={z(v * 0.42)} fill="url(#ks-jezgra)" />
    </g>
  );
}

/** Svjetlo koje putuje po liniji: tri sloja iste kretnje (sjaj, rep, glava). */
export function Kometa({ d, kasni, traje }: { d: string; kasni: number; traje: number }) {
  const stil = { "--d": `${kasni}s`, animationDuration: `${traje}s` } as CSSProperties;
  return (
    <g>
      <g opacity=".3">
        <path className="ks-kometa sjaj" pathLength={1} d={d} style={stil} />
      </g>
      <path className="ks-kometa rep" pathLength={1} d={d} style={stil} />
      <path className="ks-kometa glava" pathLength={1} d={d} style={stil} />
    </g>
  );
}

const KRACI: Array<[string, number, number, number, number]> = [
  ["g", 0, 1, 0, 0],
  ["d", 0, 0, 0, 1],
  ["l", 1, 0, 0, 0],
  ["r", 0, 0, 1, 0],
];

/** Zajednički prijelazi boja za sve zvijezde na stranici; stavlja se jednom. */
export function ZvjezdaniTonovi() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <radialGradient id="ks-halo">
          <stop offset="0" stopColor="#f0d79f" stopOpacity=".34" />
          <stop offset=".45" stopColor="#e2c487" stopOpacity=".1" />
          <stop offset="1" stopColor="#e2c487" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ks-zar">
          <stop offset="0" stopColor="#fff6dc" stopOpacity=".92" />
          <stop offset=".4" stopColor="#f3d391" stopOpacity=".4" />
          <stop offset="1" stopColor="#e2c487" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ks-jezgra">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".6" stopColor="#fff3d0" />
          <stop offset="1" stopColor="#f0d79f" />
        </radialGradient>
        {KRACI.map(([ime, x1, y1, x2, y2]) => (
          <linearGradient key={ime} id={`ks-krak-${ime}`} x1={x1} y1={y1} x2={x2} y2={y2}>
            <stop offset="0" stopColor="#fffaea" />
            <stop offset=".35" stopColor="#f6dba0" stopOpacity=".7" />
            <stop offset="1" stopColor="#f6dba0" stopOpacity="0" />
          </linearGradient>
        ))}
        <radialGradient id="ks-mjesec" cx=".3" cy=".3" r=".9">
          <stop offset="0" stopColor="#fffdf3" />
          <stop offset=".5" stopColor="#f6e7c0" />
          <stop offset="1" stopColor="#d9bd84" />
        </radialGradient>
        <radialGradient id="ks-mjesec-sjaj">
          <stop offset="0" stopColor="#f6e7c0" stopOpacity=".42" />
          <stop offset=".34" stopColor="#c9c4e6" stopOpacity=".14" />
          <stop offset="1" stopColor="#8f9be0" stopOpacity="0" />
        </radialGradient>
        <mask id="ks-srp">
          <rect x="-40" y="-40" width="280" height="280" fill="#000" />
          <circle cx="100" cy="100" r="46" fill="#fff" />
          <circle cx="82" cy="88" r="40" fill="#000" />
        </mask>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ I  Krug */
const KRUG_S: Tocka = [200, 186];
const KRUG_R = 120;
const KRUG: Tocka[] = Array.from({ length: 8 }, (_, k) => {
  const kut = ((-90 + 45 * k) * Math.PI) / 180;
  return [z(KRUG_S[0] + KRUG_R * Math.cos(kut)), z(KRUG_S[1] + KRUG_R * Math.sin(kut))];
});
const KRUG_V = [8.2, 6.6, 6.8, 5.6, 7.6, 5.4, 7, 6];
/** mjesto onoga koji je bio izvan kruga */
const NEMA = 1;
const IZVAN: Tocka = [366, 30];
const LET = `M${IZVAN[0]} ${IZVAN[1]} Q300 26 ${KRUG[NEMA][0]} ${KRUG[NEMA][1]}`;
/** let traje od 2,4. do 4,6. sekunde; rep ga prati istim ritmom */
const LET_RITAM = "0.5 0 0.2 1";

export function Krug() {
  const rep = (
    <animate
      attributeName="stroke-dashoffset"
      dur={`${KRUG_TRAJE}s`}
      repeatCount="indefinite"
      calcMode="spline"
      keyTimes={`0; ${u(2.4)}; ${u(4.6)}; ${u(5.3)}; 1`}
      values="0.26; 0.26; -0.74; -1; -1"
      keySplines={`0 0 1 1; ${LET_RITAM}; 0 0 1 1; 0 0 1 1`}
    />
  );
  return (
    <svg className="ks-slika" viewBox="0 0 400 360" aria-hidden="true">
      {/* skala zvjezdane karte koja se polako okreće */}
      <g fill="none" stroke="#d9b56f">
        <g className="ks-vrti" style={{ transformOrigin: `${KRUG_S[0]}px ${KRUG_S[1]}px` }}>
          <circle cx={KRUG_S[0]} cy={KRUG_S[1]} r="160" pathLength={360} strokeWidth="5" strokeDasharray="0.3 4.7" opacity=".3" />
          <circle cx={KRUG_S[0]} cy={KRUG_S[1]} r="158" pathLength={360} strokeWidth="9" strokeDasharray="0.4 44.6" opacity=".55" />
        </g>
        <circle cx={KRUG_S[0]} cy={KRUG_S[1]} r="151" strokeWidth=".5" opacity=".28" />
        <circle cx={KRUG_S[0]} cy={KRUG_S[1]} r={KRUG_R} strokeWidth=".7" strokeDasharray="0.6 6" strokeLinecap="round" opacity=".34" />
        <circle cx={KRUG_S[0]} cy={KRUG_S[1]} r="52" strokeWidth=".6" strokeDasharray="0.6 5" strokeLinecap="round" opacity=".26" />
      </g>

      {/* srce kruga */}
      <circle className="ks-kr-srce" cx={KRUG_S[0]} cy={KRUG_S[1]} r="74" fill="url(#ks-halo)" />
      <g transform={`translate(${KRUG_S[0]} ${KRUG_S[1]})`}>
        <path className="ks-iskra" d={ISKRA} fill="#f6dba0" />
      </g>

      {/* stranice kruga; dvije uz prazno mjesto iscrtaju se tek kad se krug zatvori */}
      <g className="ks-veze">
        {KRUG.map((a, k) => {
          const sljedeci = (k + 1) % 8;
          const uzPrazno = k === NEMA || sljedeci === NEMA;
          return <Duz key={k} a={uzPrazno && k === NEMA ? KRUG[sljedeci] : a} b={uzPrazno && k === NEMA ? a : KRUG[sljedeci]} className={uzPrazno ? "ks-kr-veza" : undefined} />;
        })}
      </g>

      {/* prazno mjesto, put dolaska i bljesak */}
      <g className="ks-kr-prazno">
        <circle className="ks-puls" cx={KRUG[NEMA][0]} cy={KRUG[NEMA][1]} r="15" style={{ transformOrigin: `${KRUG[NEMA][0]}px ${KRUG[NEMA][1]}px` }} />
      </g>
      <g className="ks-smil" fill="none" strokeLinecap="round">
        <path d={LET} pathLength={1} stroke="#e9cd92" strokeWidth="7" strokeDasharray="0.26 3" strokeDashoffset="0.26" opacity=".28">
          {rep}
        </path>
        <path d={LET} pathLength={1} stroke="#fff3d0" strokeWidth="1.6" strokeDasharray="0.26 3" strokeDashoffset="0.26">
          {rep}
        </path>
      </g>
      <circle className="ks-bljesak ks-kr-bljesak" cx={KRUG[NEMA][0]} cy={KRUG[NEMA][1]} r="14" style={{ transformOrigin: `${KRUG[NEMA][0]}px ${KRUG[NEMA][1]}px` }} />

      {KRUG.map((t, k) => (k === NEMA ? null : <Zv key={k} x={t[0]} y={t[1]} v={KRUG_V[k]} i={k} />))}

      {/* onaj koji je bio izvan: doleti po luku (SMIL), a uz „manje pokreta" jednostavno stoji na svom mjestu */}
      <g className="ks-smil">
        <g className="ks-kr-x">
          <g>
            <animateMotion
              path={LET}
              dur={`${KRUG_TRAJE}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes={`0; ${u(0.9)}; ${u(0.95)}; ${u(2.4)}; ${u(4.6)}; 1`}
              keyPoints="1; 1; 0; 0; 1; 1"
              keySplines={`0 0 1 1; 0 0 1 1; 0 0 1 1; ${LET_RITAM}; 0 0 1 1`}
            />
            <Zv v={KRUG_V[NEMA]} i={NEMA} />
          </g>
        </g>
      </g>
      <g className="ks-mirno">
        <Zv x={KRUG[NEMA][0]} y={KRUG[NEMA][1]} v={KRUG_V[NEMA]} i={NEMA} />
      </g>

      <text className="ks-natpis ks-kr-izvan" x={IZVAN[0]} y={IZVAN[1] + 34} textAnchor="middle">
        IZVAN
      </text>
      <text className="ks-natpis zlatni ks-kr-pripada" x={KRUG[NEMA][0] + 24} y={KRUG[NEMA][1] - 16}>
        PRIPADA
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ II  Red */
const RED = { djeca: 70, roditelji: 190, preci: 304 };
const DIJETE: Tocka = [200, RED.djeca];
const OTAC: Tocka = [124, RED.roditelji];
const MAJKA: Tocka = [276, RED.roditelji];
const PRECI: Tocka[] = [86, 162, 238, 314].map((x) => [x, RED.preci]);
const TOKOVI = [
  `M${PRECI[0][0]} ${PRECI[0][1]} L${OTAC[0]} ${OTAC[1]} L${DIJETE[0]} ${DIJETE[1]}`,
  `M${PRECI[3][0]} ${PRECI[3][1]} L${MAJKA[0]} ${MAJKA[1]} L${DIJETE[0]} ${DIJETE[1]}`,
  `M${PRECI[1][0]} ${PRECI[1][1]} L${OTAC[0]} ${OTAC[1]} L${DIJETE[0]} ${DIJETE[1]}`,
  `M${PRECI[2][0]} ${PRECI[2][1]} L${MAJKA[0]} ${MAJKA[1]} L${DIJETE[0]} ${DIJETE[1]}`,
];

export function Red() {
  return (
    <svg className="ks-slika" viewBox="0 0 400 360" aria-hidden="true">
      {/* tri naraštaja, tri reda */}
      <g stroke="#d9b56f" strokeWidth=".8" strokeDasharray="0.6 6" strokeLinecap="round" opacity=".42">
        <line x1="22" y1={RED.djeca} x2="378" y2={RED.djeca} />
        <line x1="22" y1={RED.roditelji} x2="378" y2={RED.roditelji} />
        <line x1="22" y1={RED.preci} x2="378" y2={RED.preci} />
      </g>
      <g className="ks-natpis">
        <text x="22" y={RED.djeca + 17} className="zlatni">
          DJECA
        </text>
        <text x="22" y={RED.roditelji + 17}>RODITELJI</text>
        <text x="22" y={RED.preci + 17}>PRECI</text>
      </g>
      <circle cx={DIJETE[0]} cy={DIJETE[1]} r="60" fill="url(#ks-halo)" opacity=".6" />

      <g className="ks-veze">
        <Duz a={PRECI[0]} b={OTAC} odA={11} />
        <Duz a={PRECI[1]} b={OTAC} odA={11} />
        <Duz a={PRECI[2]} b={MAJKA} odA={11} />
        <Duz a={PRECI[3]} b={MAJKA} odA={11} />
        <Duz a={OTAC} b={MAJKA} odA={26} odB={26} className="ks-rd-par" />
        <Duz a={OTAC} b={DIJETE} odB={24} className="ks-rd-veza" />
        <Duz a={MAJKA} b={DIJETE} odB={24} className="ks-rd-veza" />
      </g>

      {/* svjetlo teče od predaka prema djetetu */}
      <g className="ks-komete ks-rd-svjetlo" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {TOKOVI.map((d, i) => (
          <Kometa key={d} d={d} kasni={i * 1.15} traje={4.6} />
        ))}
      </g>

      <g className="ks-rd-prazno">
        <circle className="ks-puls" cx={DIJETE[0]} cy={DIJETE[1]} r="20" style={{ transformOrigin: `${DIJETE[0]}px ${DIJETE[1]}px` }} />
      </g>
      <circle className="ks-bljesak ks-rd-bljesak" cx={DIJETE[0]} cy={DIJETE[1]} r="18" style={{ transformOrigin: `${DIJETE[0]}px ${DIJETE[1]}px` }} />

      {PRECI.map((t, i) => (
        <Zv key={t[0]} x={t[0]} y={t[1]} v={5.2} i={i + 3} />
      ))}
      <Zv x={OTAC[0]} y={OTAC[1]} v={7.6} i={1} />
      <Zv x={MAJKA[0]} y={MAJKA[1]} v={7.6} i={2} />

      {/* dijete: siđe među roditelje pa se vrati na svoje mjesto */}
      <g className="ks-rd-dijete">
        <g transform={`translate(${DIJETE[0]} ${DIJETE[1]})`}>
          <g className="ks-zrake" fill="none" stroke="#f0d79f">
            <circle r="21" pathLength={360} strokeWidth="6" strokeDasharray="0.6 14.4" opacity=".6" />
          </g>
          <circle r="16" fill="none" stroke="#f0d79f" strokeWidth=".7" opacity=".55" />
        </g>
        <Zv x={DIJETE[0]} y={DIJETE[1]} v={10} />
      </g>

      <text className="ks-natpis zlatni ks-rd-tudje" x={DIJETE[0]} y={RED.roditelji - 54} textAnchor="middle">
        NA TUĐEM MJESTU
      </text>
      <text className="ks-natpis zlatni ks-rd-svoje" x={DIJETE[0] + 34} y={DIJETE[1] - 14}>
        NA SVOM MJESTU
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ III  Vaga */
const OS: Tocka = [200, 112];
const KRAK_L: Tocka = [84, 112];
const KRAK_D: Tocka = [316, 112];
const ZDJELA_Y = 234;

function Zdjela({ kraj, strana, natpis, i }: { kraj: Tocka; strana: "l" | "d"; natpis: string; i: number }) {
  const [x, y] = kraj;
  const lijevo: Tocka = [x - 38, ZDJELA_Y];
  const desno: Tocka = [x + 38, ZDJELA_Y];
  return (
    <g className={`ks-vg-zdjela ${strana}`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <g className="ks-veze">
        <Duz a={kraj} b={lijevo} odA={12} odB={8} />
        <Duz a={kraj} b={desno} odA={12} odB={8} />
        <path d={`M${lijevo[0] + 6} ${ZDJELA_Y + 5} Q${x} ${ZDJELA_Y + 34} ${desno[0] - 6} ${ZDJELA_Y + 5}`} />
      </g>
      <g className={`ks-vg-teret ${strana}`}>
        {[-13, 0, 13].map((dx, k) => (
          <g key={dx} transform={`translate(${x + dx} ${ZDJELA_Y - (k === 1 ? 7 : 0)}) scale(${k === 1 ? 0.62 : 0.46})`}>
            <path className="ks-iskra" style={vars({ "--d": `${z(k * 0.9 + i)}s` })} d={ISKRA} fill="#fbe6b4" />
          </g>
        ))}
      </g>
      <Zv x={lijevo[0]} y={lijevo[1]} v={4.4} i={i + 1} />
      <Zv x={desno[0]} y={desno[1]} v={4.4} i={i + 2} />
      <text className="ks-natpis zlatni" x={x} y={ZDJELA_Y + 58} textAnchor="middle">
        {natpis}
      </text>
    </g>
  );
}

export function Vaga() {
  const tamo = `M${KRAK_L[0] + 30} ${ZDJELA_Y - 22} Q200 ${ZDJELA_Y - 92} ${KRAK_D[0] - 30} ${ZDJELA_Y - 22}`;
  const natrag = `M${KRAK_D[0] - 30} ${ZDJELA_Y + 34} Q200 ${ZDJELA_Y + 96} ${KRAK_L[0] + 30} ${ZDJELA_Y + 34}`;
  return (
    <svg className="ks-slika" viewBox="0 0 400 360" aria-hidden="true">
      {/* skala nad osi: kazaljka pokazuje je li vaga u ravnoteži */}
      <g fill="none" stroke="#d9b56f">
        <path d="M150.5 41.3 A86 86 0 0 1 249.5 41.3" strokeWidth=".7" opacity=".5" />
        <path d="M147.6 37.2 A91 91 0 0 1 252.4 37.2" pathLength={70} strokeWidth="7" strokeDasharray="0.35 4.65" strokeDashoffset="0.17" opacity=".5" />
        <path d="M200 16 L200 28" strokeWidth="1.2" opacity=".8" />
      </g>

      {/* stup i postolje */}
      <g className="ks-veze">
        <Duz a={OS} b={[200, 322]} odA={20} odB={9} className="ks-vg-stup" />
        <Duz a={[164, 322]} b={[200, 322]} odA={8} odB={8} />
        <Duz a={[200, 322]} b={[236, 322]} odA={8} odB={8} />
      </g>
      <Zv x={164} y={322} v={3.8} i={4} />
      <Zv x={236} y={322} v={3.8} i={5} />
      <Zv x={200} y={322} v={4.6} i={6} />

      {/* davanje i primanje teku u krug kad je vaga mirna */}
      <g className="ks-vg-tok">
        <g fill="none" stroke="#e9cd92" strokeWidth=".8" strokeDasharray="0.6 5.4" strokeLinecap="round" opacity=".5">
          <path d={tamo} />
          <path d={natrag} />
        </g>
        <g className="ks-komete" fill="none" strokeLinecap="round">
          <Kometa d={tamo} kasni={0} traje={3.4} />
          <Kometa d={natrag} kasni={1.7} traje={3.4} />
        </g>
      </g>

      {/* greda s kazaljkom i dvjema zdjelama; zdjele uvijek vise okomito */}
      <g className="ks-vg-greda" style={{ transformOrigin: `${OS[0]}px ${OS[1]}px` }}>
        <g className="ks-veze">
          <Duz a={KRAK_L} b={OS} odA={12} odB={20} />
          <Duz a={OS} b={KRAK_D} odA={20} odB={12} />
          <path d={`M${OS[0]} ${OS[1] - 20} L${OS[0]} 40`} />
        </g>
        <g transform="translate(200 36) scale(0.6)">
          <path d={ISKRA} fill="#fbe6b4" />
        </g>
        <Zdjela kraj={KRAK_L} strana="l" natpis="DAVANJE" i={0} />
        <Zdjela kraj={KRAK_D} strana="d" natpis="PRIMANJE" i={2} />
        <Zv x={KRAK_L[0]} y={KRAK_L[1]} v={6.4} i={1} />
        <Zv x={KRAK_D[0]} y={KRAK_D[1]} v={6.4} i={3} />
      </g>

      <circle className="ks-bljesak ks-vg-bljesak" cx={OS[0]} cy={OS[1]} r="18" style={{ transformOrigin: `${OS[0]}px ${OS[1]}px` }} />
      <circle cx={OS[0]} cy={OS[1]} r="58" fill="url(#ks-halo)" opacity=".55" />
      <Zv x={OS[0]} y={OS[1]} v={9.4} />
    </svg>
  );
}

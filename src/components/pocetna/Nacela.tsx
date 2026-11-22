import { ISKRA } from "@/lib/zvijezda";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Naslov from "@/components/Naslov";
import { nacela } from "@/content/konstelacije";
import { greben } from "@/lib/krajolik";
import { kas, vars } from "@/lib/util";

/**
 * Tri temeljna načela kao tri zviježđa na noćnom nebu, iznad brda sa stablom života
 * (isto brdo i isto stablo kao u svitanju, sada noću i obasjano zlatom).
 *
 * Prizor se odvija sam, u krugu od 24 sekunde, i nije vezan uz skrol. Svjetlo putuje
 * lukom preko neba i redom budi zviježđa; svako tada odigra svoju priču (8 s), a ostatak
 * vremena miruje u skladu:
 *   I   Krug:   netko je izvan kruga → doleti na svoje mjesto i krug se zatvori
 *   II  Red:    dijete stoji među roditeljima → vrati se na svoje mjesto i svjetlo poteče
 *   III Vaga:   vaga prevagne na jednu stranu → smiri se u ravnoteži
 * Sve je CSS i SMIL, bez skripte. Uz „manje pokreta" zviježđa miruju u skladu.
 */
const KRUG_TRAJE = 24;
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

/** Zvijezda kao u herou: sjaj, žar, četiri zrake i jezgra. */
function Zv({ x = 0, y = 0, v, i = 0 }: { x?: number; y?: number; v: number; i?: number }) {
  const s = v * 0.13;
  return (
    <g transform={`translate(${z(x)} ${z(y)})`}>
      <circle r={z(v * 3.9)} fill="url(#nz-halo)" />
      <circle r={z(v * 1.75)} fill="url(#nz-zar)" />
      <g className="polje-treptaj" style={vars({ "--t": `${z((i * 0.83) % 5)}s` })}>
        <path d={`M${z(-s)} 0 L0 ${z(-v * 5)} L${z(s)} 0 Z`} fill="url(#nz-krak-g)" />
        <path d={`M${z(-s)} 0 L0 ${z(v * 3.4)} L${z(s)} 0 Z`} fill="url(#nz-krak-d)" />
        <path d={`M0 ${z(-s)} L${z(-v * 2.9)} 0 L0 ${z(s)} Z`} fill="url(#nz-krak-l)" />
        <path d={`M0 ${z(-s)} L${z(v * 2.9)} 0 L0 ${z(s)} Z`} fill="url(#nz-krak-r)" />
        <g opacity=".5" transform="rotate(45)" fill="#fff3d0">
          <path d={`M${z(-s * 0.7)} 0 L0 ${z(-v * 1.3)} L${z(s * 0.7)} 0 L0 ${z(v * 1.3)} Z`} />
          <path d={`M0 ${z(-s * 0.7)} L${z(-v * 1.3)} 0 L0 ${z(s * 0.7)} L${z(v * 1.3)} 0 Z`} />
        </g>
      </g>
      <circle r={z(v * 0.42)} fill="url(#nz-jezgra)" />
    </g>
  );
}

/** Svjetlo koje putuje po liniji (klase iz heroa). */
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

function Krug() {
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
    <svg className="zvj-slika" viewBox="0 0 400 360" aria-hidden="true">
      {/* skala zvjezdane karte koja se polako okreće */}
      <g fill="none" stroke="#d9b56f">
        <g className="zvj-vrti" style={{ transformOrigin: `${KRUG_S[0]}px ${KRUG_S[1]}px` }}>
          <circle cx={KRUG_S[0]} cy={KRUG_S[1]} r="160" pathLength={360} strokeWidth="5" strokeDasharray="0.3 4.7" opacity=".3" />
          <circle cx={KRUG_S[0]} cy={KRUG_S[1]} r="158" pathLength={360} strokeWidth="9" strokeDasharray="0.4 44.6" opacity=".55" />
        </g>
        <circle cx={KRUG_S[0]} cy={KRUG_S[1]} r="151" strokeWidth=".5" opacity=".28" />
        <circle cx={KRUG_S[0]} cy={KRUG_S[1]} r={KRUG_R} strokeWidth=".7" strokeDasharray="0.6 6" strokeLinecap="round" opacity=".34" />
        <circle cx={KRUG_S[0]} cy={KRUG_S[1]} r="52" strokeWidth=".6" strokeDasharray="0.6 5" strokeLinecap="round" opacity=".26" />
      </g>

      {/* srce kruga */}
      <circle className="kr-srce" cx={KRUG_S[0]} cy={KRUG_S[1]} r="74" fill="url(#nz-halo)" />
      <g transform={`translate(${KRUG_S[0]} ${KRUG_S[1]})`}>
        <path className="polje-iskra" d={ISKRA} fill="#f6dba0" />
      </g>

      {/* stranice kruga; dvije uz prazno mjesto iscrtaju se tek kad se krug zatvori */}
      <g className="zvj-veze">
        {KRUG.map((a, k) => {
          const sljedeci = (k + 1) % 8;
          const uzPrazno = k === NEMA || sljedeci === NEMA;
          return <Duz key={k} a={uzPrazno && k === NEMA ? KRUG[sljedeci] : a} b={uzPrazno && k === NEMA ? a : KRUG[sljedeci]} className={uzPrazno ? "kr-veza" : undefined} />;
        })}
      </g>

      {/* prazno mjesto, put dolaska i bljesak */}
      <g className="kr-prazno">
        <circle className="zvj-puls" cx={KRUG[NEMA][0]} cy={KRUG[NEMA][1]} r="15" style={{ transformOrigin: `${KRUG[NEMA][0]}px ${KRUG[NEMA][1]}px` }} />
      </g>
      <g className="zvj-smil" fill="none" strokeLinecap="round">
        <path d={LET} pathLength={1} stroke="#e9cd92" strokeWidth="7" strokeDasharray="0.26 3" strokeDashoffset="0.26" opacity=".28">
          {rep}
        </path>
        <path d={LET} pathLength={1} stroke="#fff3d0" strokeWidth="1.6" strokeDasharray="0.26 3" strokeDashoffset="0.26">
          {rep}
        </path>
      </g>
      <circle className="zvj-bljesak kr-bljesak" cx={KRUG[NEMA][0]} cy={KRUG[NEMA][1]} r="14" style={{ transformOrigin: `${KRUG[NEMA][0]}px ${KRUG[NEMA][1]}px` }} />

      {KRUG.map((t, k) => (k === NEMA ? null : <Zv key={k} x={t[0]} y={t[1]} v={KRUG_V[k]} i={k} />))}

      {/* onaj koji je bio izvan: doleti po luku (SMIL), a uz „manje pokreta" jednostavno stoji na svom mjestu */}
      <g className="zvj-smil">
        <g className="kr-x">
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
      <g className="zvj-mirno">
        <Zv x={KRUG[NEMA][0]} y={KRUG[NEMA][1]} v={KRUG_V[NEMA]} i={NEMA} />
      </g>

      <text className="zvj-natpis kr-izvan" x={IZVAN[0]} y={IZVAN[1] + 34} textAnchor="middle">
        IZVAN
      </text>
      <text className="zvj-natpis zlatni kr-pripada" x={KRUG[NEMA][0] + 24} y={KRUG[NEMA][1] - 16}>
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

function Red() {
  return (
    <svg className="zvj-slika" viewBox="0 0 400 360" aria-hidden="true">
      {/* tri naraštaja, tri reda */}
      <g stroke="#d9b56f" strokeWidth=".8" strokeDasharray="0.6 6" strokeLinecap="round" opacity=".42">
        <line x1="22" y1={RED.djeca} x2="378" y2={RED.djeca} />
        <line x1="22" y1={RED.roditelji} x2="378" y2={RED.roditelji} />
        <line x1="22" y1={RED.preci} x2="378" y2={RED.preci} />
      </g>
      <g className="zvj-natpis">
        <text x="22" y={RED.djeca + 17} className="zlatni">
          DJECA
        </text>
        <text x="22" y={RED.roditelji + 17}>RODITELJI</text>
        <text x="22" y={RED.preci + 17}>PRECI</text>
      </g>
      <circle cx={DIJETE[0]} cy={DIJETE[1]} r="60" fill="url(#nz-halo)" opacity=".6" />

      <g className="zvj-veze">
        <Duz a={PRECI[0]} b={OTAC} odA={11} />
        <Duz a={PRECI[1]} b={OTAC} odA={11} />
        <Duz a={PRECI[2]} b={MAJKA} odA={11} />
        <Duz a={PRECI[3]} b={MAJKA} odA={11} />
        <Duz a={OTAC} b={MAJKA} odA={26} odB={26} className="rd-par" />
        <Duz a={OTAC} b={DIJETE} odB={24} className="rd-veza" />
        <Duz a={MAJKA} b={DIJETE} odB={24} className="rd-veza" />
      </g>

      {/* svjetlo teče od predaka prema djetetu */}
      <g className="polje-komete rd-svjetlo" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {TOKOVI.map((d, i) => (
          <Kometa key={d} d={d} kasni={i * 1.15} traje={4.6} />
        ))}
      </g>

      <g className="rd-prazno">
        <circle className="zvj-puls" cx={DIJETE[0]} cy={DIJETE[1]} r="20" style={{ transformOrigin: `${DIJETE[0]}px ${DIJETE[1]}px` }} />
      </g>
      <circle className="zvj-bljesak rd-bljesak" cx={DIJETE[0]} cy={DIJETE[1]} r="18" style={{ transformOrigin: `${DIJETE[0]}px ${DIJETE[1]}px` }} />

      {PRECI.map((t, i) => (
        <Zv key={t[0]} x={t[0]} y={t[1]} v={5.2} i={i + 3} />
      ))}
      <Zv x={OTAC[0]} y={OTAC[1]} v={7.6} i={1} />
      <Zv x={MAJKA[0]} y={MAJKA[1]} v={7.6} i={2} />

      {/* dijete: siđe među roditelje pa se vrati na svoje mjesto */}
      <g className="rd-dijete">
        <g transform={`translate(${DIJETE[0]} ${DIJETE[1]})`}>
          <g className="zvj-zrake" fill="none" stroke="#f0d79f">
            <circle r="21" pathLength={360} strokeWidth="6" strokeDasharray="0.6 14.4" opacity=".6" />
          </g>
          <circle r="16" fill="none" stroke="#f0d79f" strokeWidth=".7" opacity=".55" />
        </g>
        <Zv x={DIJETE[0]} y={DIJETE[1]} v={10} />
      </g>

      <text className="zvj-natpis zlatni rd-tudje" x={DIJETE[0]} y={RED.roditelji - 54} textAnchor="middle">
        NA TUĐEM MJESTU
      </text>
      <text className="zvj-natpis zlatni rd-svoje" x={DIJETE[0] + 34} y={DIJETE[1] - 14}>
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
    <g className={`vg-zdjela ${strana}`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <g className="zvj-veze">
        <Duz a={kraj} b={lijevo} odA={12} odB={8} />
        <Duz a={kraj} b={desno} odA={12} odB={8} />
        <path d={`M${lijevo[0] + 6} ${ZDJELA_Y + 5} Q${x} ${ZDJELA_Y + 34} ${desno[0] - 6} ${ZDJELA_Y + 5}`} />
      </g>
      <g className={`vg-teret ${strana}`}>
        {[-13, 0, 13].map((dx, k) => (
          <g key={dx} transform={`translate(${x + dx} ${ZDJELA_Y - (k === 1 ? 7 : 0)}) scale(${k === 1 ? 0.62 : 0.46})`}>
            <path className="polje-iskra" style={vars({ "--d": `${z(k * 0.9 + i)}s` })} d={ISKRA} fill="#fbe6b4" />
          </g>
        ))}
      </g>
      <Zv x={lijevo[0]} y={lijevo[1]} v={4.4} i={i + 1} />
      <Zv x={desno[0]} y={desno[1]} v={4.4} i={i + 2} />
      <text className="zvj-natpis zlatni" x={x} y={ZDJELA_Y + 58} textAnchor="middle">
        {natpis}
      </text>
    </g>
  );
}

function Vaga() {
  const tamo = `M${KRAK_L[0] + 30} ${ZDJELA_Y - 22} Q200 ${ZDJELA_Y - 92} ${KRAK_D[0] - 30} ${ZDJELA_Y - 22}`;
  const natrag = `M${KRAK_D[0] - 30} ${ZDJELA_Y + 34} Q200 ${ZDJELA_Y + 96} ${KRAK_L[0] + 30} ${ZDJELA_Y + 34}`;
  return (
    <svg className="zvj-slika" viewBox="0 0 400 360" aria-hidden="true">
      {/* skala nad osi: kazaljka pokazuje je li vaga u ravnoteži */}
      <g fill="none" stroke="#d9b56f">
        <path d="M150.5 41.3 A86 86 0 0 1 249.5 41.3" strokeWidth=".7" opacity=".5" />
        <path d="M147.6 37.2 A91 91 0 0 1 252.4 37.2" pathLength={70} strokeWidth="7" strokeDasharray="0.35 4.65" strokeDashoffset="0.17" opacity=".5" />
        <path d="M200 16 L200 28" strokeWidth="1.2" opacity=".8" />
      </g>

      {/* stup i postolje */}
      <g className="zvj-veze">
        <Duz a={OS} b={[200, 322]} odA={20} odB={9} className="vg-stup" />
        <Duz a={[164, 322]} b={[200, 322]} odA={8} odB={8} />
        <Duz a={[200, 322]} b={[236, 322]} odA={8} odB={8} />
      </g>
      <Zv x={164} y={322} v={3.8} i={4} />
      <Zv x={236} y={322} v={3.8} i={5} />
      <Zv x={200} y={322} v={4.6} i={6} />

      {/* davanje i primanje teku u krug kad je vaga mirna */}
      <g className="vg-tok">
        <g fill="none" stroke="#e9cd92" strokeWidth=".8" strokeDasharray="0.6 5.4" strokeLinecap="round" opacity=".5">
          <path d={tamo} />
          <path d={natrag} />
        </g>
        <g className="polje-komete" fill="none" strokeLinecap="round">
          <Kometa d={tamo} kasni={0} traje={3.4} />
          <Kometa d={natrag} kasni={1.7} traje={3.4} />
        </g>
      </g>

      {/* greda s kazaljkom i dvjema zdjelama; zdjele uvijek vise okomito */}
      <g className="vg-greda" style={{ transformOrigin: `${OS[0]}px ${OS[1]}px` }}>
        <g className="zvj-veze">
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

      <circle className="zvj-bljesak vg-bljesak" cx={OS[0]} cy={OS[1]} r="18" style={{ transformOrigin: `${OS[0]}px ${OS[1]}px` }} />
      <circle cx={OS[0]} cy={OS[1]} r="58" fill="url(#nz-halo)" opacity=".55" />
      <Zv x={OS[0]} y={OS[1]} v={9.4} />
    </svg>
  );
}

/* ------------------------------------------------------------------ krajolik */
/** Stalni „slučajni" brojevi, isti na poslužitelju i u pregledniku. */
function nasumicno(sjeme: number) {
  let s = sjeme;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const kocka = nasumicno(20261120);
const izmedju = (a: number, b: number) => +(a + (b - a) * kocka()).toFixed(2);

/** Krijesnice oko stabla i po brdu. Položaj je u širinama stabla, od podnožja debla. */
const KRIJESNICE = Array.from({ length: 26 }, (_, i) => {
  const blizu = i < 16;
  return {
    "--fx": blizu ? izmedju(-0.78, 0.78) : izmedju(-1.9, 1.9),
    "--fy": blizu ? izmedju(0.02, 0.62) : izmedju(-0.12, 0.3),
    "--ax": `${izmedju(-46, 46)}px`,
    "--ay": `${izmedju(-40, 14)}px`,
    "--bx": `${izmedju(-60, 60)}px`,
    "--by": `${izmedju(-64, 10)}px`,
    "--cx": `${izmedju(-36, 36)}px`,
    "--cy": `${izmedju(-30, 24)}px`,
    "--t": `${izmedju(9, 17)}s`,
    "--s": `${izmedju(2.6, 5.4)}s`,
    "--d": `${izmedju(-12, 0)}s`,
    "--v": `${izmedju(3, 5.5)}px`,
  };
});
/** Iskre koje se iz krošnje dižu prema zvijezdama. */
const ISKRE = Array.from({ length: 12 }, () => ({
  "--fx": izmedju(-0.36, 0.36),
  "--fy": izmedju(0.36, 0.7),
  "--dx": `${izmedju(-70, 70)}px`,
  "--t": `${izmedju(8, 14)}s`,
  "--d": `${izmedju(-14, 0)}s`,
  "--v": `${izmedju(2.4, 4)}px`,
}));

/** Korijenje pod brdom, crtano od vrha korijena prema deblu (600, 0), da svjetlo teče prema stablu. Prvih sedam su glavne žile. */
const KORIJENJE = [
  "M60 170 C120 150 150 178 210 158 C270 138 290 150 340 122 C390 96 420 104 460 76 C510 44 560 40 600 0",
  "M1140 170 C1080 150 1050 178 990 158 C930 138 910 150 860 122 C810 96 780 104 740 76 C690 44 640 40 600 0",
  "M210 246 C250 214 300 226 340 190 C380 156 430 164 470 124 C510 86 560 60 600 0",
  "M990 246 C950 214 900 226 860 190 C820 156 770 164 730 124 C690 86 640 60 600 0",
  "M440 250 C450 210 500 200 510 160 C520 122 560 110 570 76 C580 44 592 30 600 0",
  "M760 250 C750 210 700 200 690 160 C680 122 640 110 630 76 C620 44 608 30 600 0",
  "M610 250 C590 206 618 170 600 130 C584 92 612 60 600 0",
  "M150 226 C200 214 220 180 270 170 C300 164 320 140 340 122",
  "M1050 226 C1000 214 980 180 930 170 C900 164 880 140 860 122",
  "M330 66 C370 92 420 70 460 76",
  "M870 66 C830 92 780 70 740 76",
  "M360 250 C390 222 400 180 440 160 C456 150 462 136 470 124",
  "M840 250 C810 222 800 180 760 160 C744 150 738 136 730 124",
  "M540 250 C548 222 520 196 510 160",
  "M660 250 C652 222 680 196 690 160",
  "M96 118 C130 132 170 138 210 158",
  "M1104 118 C1070 132 1030 138 990 158",
];

const KRACI: Array<[string, number, number, number, number]> = [
  ["g", 0, 1, 0, 0],
  ["d", 0, 0, 0, 1],
  ["l", 1, 0, 0, 0],
  ["r", 0, 0, 1, 0],
];

const ZVIJEZDJA: Array<{ ime: string; slika: ReactNode }> = [
  { ime: "Krug", slika: <Krug /> },
  { ime: "Red", slika: <Red /> },
  { ime: "Vaga", slika: <Vaga /> },
];

export default function Nacela() {
  return (
    <>
      {/* zajednički prijelazi boja za sve zvijezde u sekciji */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <radialGradient id="nz-halo">
            <stop offset="0" stopColor="#f0d79f" stopOpacity=".34" />
            <stop offset=".45" stopColor="#e2c487" stopOpacity=".1" />
            <stop offset="1" stopColor="#e2c487" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nz-zar">
            <stop offset="0" stopColor="#fff6dc" stopOpacity=".92" />
            <stop offset=".4" stopColor="#f3d391" stopOpacity=".4" />
            <stop offset="1" stopColor="#e2c487" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nz-jezgra">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".6" stopColor="#fff3d0" />
            <stop offset="1" stopColor="#f0d79f" />
          </radialGradient>
          {KRACI.map(([ime, x1, y1, x2, y2]) => (
            <linearGradient key={ime} id={`nz-krak-${ime}`} x1={x1} y1={y1} x2={x2} y2={y2}>
              <stop offset="0" stopColor="#fffaea" />
              <stop offset=".35" stopColor="#f6dba0" stopOpacity=".7" />
              <stop offset="1" stopColor="#f6dba0" stopOpacity="0" />
            </linearGradient>
          ))}
          <radialGradient id="nz-mjesec" cx=".3" cy=".3" r=".9">
            <stop offset="0" stopColor="#fffdf3" />
            <stop offset=".5" stopColor="#f6e7c0" />
            <stop offset="1" stopColor="#d9bd84" />
          </radialGradient>
          <radialGradient id="nz-mjesec-sjaj">
            <stop offset="0" stopColor="#f6e7c0" stopOpacity=".42" />
            <stop offset=".34" stopColor="#c9c4e6" stopOpacity=".14" />
            <stop offset="1" stopColor="#8f9be0" stopOpacity="0" />
          </radialGradient>
          <mask id="nz-srp">
            <rect x="-40" y="-40" width="280" height="280" fill="#000" />
            <circle cx="100" cy="100" r="46" fill="#fff" />
            <circle cx="82" cy="88" r="40" fill="#000" />
          </mask>
        </defs>
      </svg>

      {/* mreža zvjezdane karte oko nebeskog pola */}
      <svg className="nac-mreza" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <g fill="none" stroke="#d9b56f" strokeWidth=".7">
          {[180, 330, 480, 630, 780, 930].map((r) => (
            <circle key={r} cx="800" cy="40" r={r} strokeDasharray={r % 300 === 180 ? undefined : "1 7"} opacity={r % 300 === 180 ? 0.5 : 0.8} />
          ))}
          {Array.from({ length: 13 }, (_, k) => {
            const kut = ((15 * k) * Math.PI) / 180;
            return <line key={k} x1={z(800 + 180 * Math.cos(kut))} y1={z(40 + 180 * Math.sin(kut))} x2={z(800 + 1000 * Math.cos(kut))} y2={z(40 + 1000 * Math.sin(kut))} strokeDasharray="1 9" />;
          })}
          <circle cx="800" cy="40" r="938" pathLength={360} strokeWidth="9" strokeDasharray="0.12 0.88" opacity=".7" />
        </g>
      </svg>

      <div className="w nac-in">
        {/* mjesec */}
        <svg className="nac-mjesec" viewBox="0 0 200 200" aria-hidden="true">
          <circle className="nac-mjesec-sjaj" cx="100" cy="100" r="100" fill="url(#nz-mjesec-sjaj)" />
          <circle cx="100" cy="100" r="46" fill="#aab4e8" opacity=".1" />
          <circle cx="100" cy="100" r="46" fill="none" stroke="#e9dcc4" strokeWidth=".5" opacity=".3" />
          <g mask="url(#nz-srp)">
            <circle cx="100" cy="100" r="46" fill="url(#nz-mjesec)" />
            <g fill="#b89a5c" opacity=".28">
              <circle cx="128" cy="94" r="5" />
              <circle cx="120" cy="120" r="7" />
              <circle cx="136" cy="112" r="3" />
              <circle cx="110" cy="136" r="4" />
            </g>
          </g>
        </svg>

        <header className="nac-glava">
          <p className="oz" data-reveal>
            Hellingerov pristup
          </p>
          <Naslov>{"Tri temeljna *načela.*"}</Naslov>
          <p className="nac-uvod" data-reveal style={kas(0.3)}>
            Tri zviježđa pod kojima Hellingerov pristup promatra obitelj.
          </p>
        </header>

        <div className="zvjezdja">
          {/* luk preko neba i svjetlo koje njime putuje od zviježđa do zviježđa */}
          <div className="zvj-luk" aria-hidden="true">
            <i />
          </div>

          {nacela.map((n, i) => (
            <div className="zvj-polje" key={n.naslov} data-reveal style={kas(0.15 + i * 0.18)}>
              <article className="zvj" style={vars({ "--k": `${i * 8 - (i ? KRUG_TRAJE : 0)}s` })}>
                <p className="zvj-cvor" aria-hidden="true">
                  <i />
                  <span>{n.broj}</span>
                </p>
                {ZVIJEZDJA[i].slika}
                <p className="zvj-ime">
                  <span className="sr">{n.broj}. načelo, </span>zviježđe {ZVIJEZDJA[i].ime}
                </p>
                <h3>{n.naslov}</h3>
                <i className="zvj-tijek" aria-hidden="true" />
                <p className="zvj-opis">{n.kratko}</p>
              </article>
            </div>
          ))}
        </div>

        <div className="nac-dno">
          <p data-reveal>
            Ova načela predstavljaju okvir Hellingerova pristupa, a ne univerzalne znanstveno potvrđene zakone koji automatski
            objašnjavaju sve ljudske odnose.
          </p>
          <p className="red" data-reveal style={kas(0.15)}>
            <Link className="link" href="/konstelacije#nacela">
              Više o konstelacijama{" "}
              <span className="str" aria-hidden="true">
                →
              </span>
            </Link>
          </p>
        </div>
      </div>

      {/* krajolik: isto brdo i isto stablo kao u svitanju, sada noću */}
      <div className="nac-tlo" aria-hidden="true">
        <svg className="nac-brda" viewBox="0 0 1440 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="nz-daleko" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#232b58" />
              <stop offset="1" stopColor="#141a3a" />
            </linearGradient>
            <linearGradient id="nz-magla" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6f7fd0" stopOpacity="0" />
              <stop offset=".55" stopColor="#6f7fd0" stopOpacity=".2" />
              <stop offset="1" stopColor="#6f7fd0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={greben({ sjeme: 61, y: 66, amp: 30, valova: 2.2 })} fill="#283064" opacity=".7" />
          <path d={greben({ sjeme: 67, y: 92, amp: 24, valova: 3.4, suma: 8 })} fill="url(#nz-daleko)" />
          <rect x="0" y="40" width="1440" height="120" fill="url(#nz-magla)" />
        </svg>
        <div className="nac-aura" />
        <svg className="nac-brda" viewBox="0 0 1440 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="nz-brdo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0c1024" />
              <stop offset="1" stopColor="#05070f" />
            </linearGradient>
            <radialGradient id="nz-tlo-sjaj" cx=".5" cy=".14" r=".5" gradientTransform="translate(.5 .14) scale(.56 1) translate(-.5 -.14)">
              <stop offset="0" stopColor="#f3c877" stopOpacity=".5" />
              <stop offset=".4" stopColor="#d9a04e" stopOpacity=".16" />
              <stop offset="1" stopColor="#d9a04e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="nz-rub" x1="0" y1="0" x2="1" y2="0">
              <stop offset=".3" stopColor="#ffd9a0" stopOpacity="0" />
              <stop offset=".5" stopColor="#ffe2b0" />
              <stop offset=".7" stopColor="#ffd9a0" stopOpacity="0" />
              <stop offset=".8" stopColor="#c6cfff" stopOpacity=".5" />
              <stop offset="1" stopColor="#c6cfff" stopOpacity=".15" />
            </linearGradient>
          </defs>
          <path d="M0 132 C240 70 520 30 720 30 C930 30 1200 74 1440 122 L1440 220 L0 220Z" fill="url(#nz-brdo)" />
          <path d="M0 132 C240 70 520 30 720 30 C930 30 1200 74 1440 122 L1440 220 L0 220Z" fill="url(#nz-tlo-sjaj)" />
          <path d="M0 132 C240 70 520 30 720 30 C930 30 1200 74 1440 122" fill="none" stroke="url(#nz-rub)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* korijenje duboko u zemlji: svjetlo se njime penje prema stablu */}
        <svg className="nac-korijenje" viewBox="0 0 1200 250" preserveAspectRatio="none">
          <g fill="none" stroke="#d9b56f" strokeLinecap="round">
            {KORIJENJE.map((d, i) => (
              <path key={d} d={d} strokeWidth={i < 7 ? 1.3 : 0.9} opacity={i < 7 ? 0.6 : 0.42} />
            ))}
          </g>
          <g className="polje-komete" fill="none" strokeLinecap="round">
            {KORIJENJE.slice(0, 7).map((d, i) => (
              <Kometa key={d} d={d} kasni={z((i * 1.37) % 7.5)} traje={7.5} />
            ))}
          </g>
        </svg>
        {/* izvorni PNG, bez sažimanja: sažeta prozirnost pod sjajem ostavlja vidljiv pravokutnik */}
        <Image className="nac-drvo" src="/img/drvo-zlatno.webp" alt="" width={520} height={500} unoptimized />
        <div className="nac-iskre">
          {ISKRE.map((stil, i) => (
            <i key={i} style={vars(stil)} />
          ))}
        </div>
        <div className="nac-krijesnice">
          {KRIJESNICE.map((stil, i) => (
            <i key={i} style={vars(stil)} />
          ))}
        </div>
      </div>
    </>
  );
}

import { ISKRA } from "@/lib/zvijezda";
import type { ReactNode } from "react";
import { vars } from "@/lib/util";

/**
 * Polje konstelacije u herou: obiteljsko zviježđe unutar zlatnog astrolaba koji lebdi u svemiru.
 *
 * U središtu ste vi, kao sunce. Iza vas su tri naraštaja, svaki na svom prstenu: roditelji,
 * bake i djedovi te prabake i pradjedovi. Svaki član obitelji je zvijezda, a veze među njima
 * tanke su linije zviježđa. Iznad vas je ono što tek dolazi i put kojim krećete.
 * Svjetlo putuje od predaka kroz loze do vas, pa dalje naprijed.
 * Zvijezde na početku stoje razbacano, pa svaka dođe na svoje mjesto.
 *
 * Crtež je složen od pet slojeva na različitim dubinama (pravi 3D), pa se pod pokazivačem
 * naginje kao predmet. Raspored se računa iz kutova i polumjera ispod.
 */
const S = 400; // središte crteža
const R1 = 118; // roditelji, braća i sestre
const R2 = 212; // bake i djedovi
const R3 = 300; // prabake i pradjedovi
const OS = 14; // kut mjerne osi s oznakama naraštaja
const OKVIR = "-40 -40 880 880";
/** Sloj s dalekim putanjama treba veće platno: sve mora stati unutar njega, inače ga preglednik odreže. */
const OKVIR_SIROKI = "-190 -190 1180 1180";
/** Veličine zvijezda po naraštaju. */
const V = { roditelj: 9.2, bakaDjed: 7, predak: 5.2, bratSestra: 7.6 };

type Tocka = [number, number];
const z = (n: number) => Number(n.toFixed(1));
/** Točka na polumjeru r pod kutom u stupnjevima (0° je desno, 90° dolje). */
const pol = (r: number, kut: number): Tocka => {
  const a = (kut * Math.PI) / 180;
  return [z(S + r * Math.cos(a)), z(S + r * Math.sin(a))];
};
/** Postojan „slučajan" broj između -1 i 1, isti na poslužitelju i u pregledniku. */
const sum = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};
const luk = (r: number, od: number, doKuta: number) => {
  const [x1, y1] = pol(r, od);
  const [x2, y2] = pol(r, doKuta);
  return `M${x1} ${y1} A${r} ${r} 0 0 ${doKuta > od ? 1 : 0} ${x2} ${y2}`;
};
/** Valoviti prsten; dva pomaknuta daju pleteni, gravirani uzorak (guilloche). */
const val = (r0: number, amp: number, valova: number, faza: number) => {
  let d = "";
  for (let k = 0; k < 360; k += 1.5) {
    const [x, y] = pol(r0 + amp * Math.sin(((k * valova + faza) * Math.PI) / 180), k);
    d += `${k === 0 ? "M" : "L"}${x} ${y}`;
  }
  return `${d}Z`;
};
/** Šiljak kompasa: dvije plohe, svijetla i tamna. */
const siljak = (kut: number, r0: number, r1: number, sirina: number) => {
  const a = (kut * Math.PI) / 180;
  const [bx, by] = pol(r0, kut);
  const [tx, ty] = pol(r1, kut);
  const [ix, iy] = pol(r0 - 9, kut);
  const ox = z((-Math.sin(a) * sirina) / 2);
  const oy = z((Math.cos(a) * sirina) / 2);
  return {
    svijetla: `M${z(bx - ox)} ${z(by - oy)} L${tx} ${ty} L${ix} ${iy} Z`,
    tamna: `M${z(bx + ox)} ${z(by + oy)} L${tx} ${ty} L${ix} ${iy} Z`,
  };
};
/** Koliko linija staje prije zvijezde, da je ne dodirne (kao na zvjezdanim kartama). */
const razmak = (v: number) => v * 1.75 + 3.5;
/** Ravna linija zviježđa između dvije točke, skraćena na oba kraja. */
const duz = (a: Tocka, b: Tocka, odA: number, odB: number) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy);
  return `M${z(a[0] + (dx / l) * odA)} ${z(a[1] + (dy / l) * odA)} L${z(b[0] - (dx / l) * odB)} ${z(b[1] - (dy / l) * odB)}`;
};

const roditelji = [
  { id: "otac", kut: 132 },
  { id: "majka", kut: 48 },
];
const bakeDjedovi = [
  { kut: 148, roditelj: 0 },
  { kut: 110, roditelj: 0 },
  { kut: 70, roditelj: 1 },
  { kut: 32, roditelj: 1 },
];
const preci = [157, 139, 119, 101, 79, 61, 41, 23].map((kut, i) => ({ kut, potomak: Math.floor(i / 2) }));
const bracaSestre = [
  { kut: 188, natpis: "SESTRA", prema: 132 },
  { kut: -8, natpis: "BRAT", prema: 48 },
];

/** Linije zviježđa. smjer 1 = preci (iza vas), -1 = ono što dolazi (ispred vas). */
const linije = (smjer: 1 | -1) => {
  const m = smjer === 1 ? 1 : 0.55; // zvijezde ispred vas su sitnije, pa je i razmak manji
  return {
    prva: roditelji.map((r) => duz([S, S], pol(R1, smjer * r.kut), 28, razmak(V.roditelj * m))),
    druga: bakeDjedovi.map((b) => duz(pol(R1, smjer * roditelji[b.roditelj].kut), pol(R2, smjer * b.kut), razmak(V.roditelj * m), razmak(V.bakaDjed * m))),
    treca: preci.map((p) => duz(pol(R2, smjer * bakeDjedovi[p.potomak].kut), pol(R3 - (smjer === 1 ? 0 : 8), smjer * p.kut), razmak(V.bakaDjed * m), razmak(V.predak * m))),
  };
};
const IZA = linije(1);
const ISPRED = linije(-1);

/** Cijela loza od pretka do vas, u smjeru kojim putuje svjetlo. */
const loza = (i: number) => {
  const p = preci[i];
  const bd = bakeDjedovi[p.potomak];
  const rod = roditelji[bd.roditelj];
  return `M${pol(R3, p.kut).join(" ")} L${pol(R2, bd.kut).join(" ")} L${pol(R1, rod.kut).join(" ")} L${S} ${S}`;
};

const RIMSKI = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
const NARASTAJI = [
  { broj: "I", r: R1, naziv: "Roditelji" },
  { broj: "II", r: R2, naziv: "Bake i djedovi" },
  { broj: "III", r: R3, naziv: "Prabake i pradjedovi" },
];
/** Zviježđa ucrtana u staklo, u pozadini. */
const ZVIJEZDJA = [
  [[190, 240], [224, 214], [262, 226], [286, 198], [262, 168]],
  [[536, 172], [568, 204], [606, 194], [630, 228], [612, 264]],
  [[122, 372], [150, 338], [190, 352]],
  [[652, 340], [686, 318], [700, 354]],
];

function Sloj({ n, children, defs, okvir = OKVIR }: { n: number; children: ReactNode; defs?: ReactNode; okvir?: string }) {
  return (
    <svg className={`polje-l polje-l${n}`} viewBox={okvir} aria-hidden="true" focusable="false">
      {defs}
      {children}
    </svg>
  );
}

type ZvijezdaProps = { v: number; kut: number; polumjer: number; d: number; i: number; razmah: number; velika?: boolean; okret?: number };

/**
 * Član obitelji kao zvijezda: meki sjaj, svijetla jezgra i četiri zrake.
 * Zraka u smjeru u kojem je osoba okrenuta dulja je od ostalih, pa se vidi kamo gleda.
 */
function Zvijezda({ v, kut, polumjer, d, i, razmah, velika, okret: zadaniOkret }: ZvijezdaProps) {
  const [x, y] = pol(polumjer, kut);
  // Preci su blago okrenuti prema vama; braća i sestre gledaju naprijed, kao i vi.
  const okret = zadaniOkret ?? z((kut - 90) * 0.5);
  const s = z(v * 0.2); // poluširina zrake pri jezgri
  const naprijed = z(v * 4.4);
  const straga = z(v * 2.5);
  const bocno = z(v * 2.9);
  const stil = vars({
    "--sx": `${z(sum(i, 1) * razmah)}px`,
    "--sy": `${z(sum(i, 2) * razmah)}px`,
    "--sr": `${Math.round(sum(i, 3) * 160)}deg`,
    "--d": `${d}s`,
  });
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="polje-fig" style={stil}>
        <circle r={z(v * 3.9)} fill="url(#p-halo)" opacity={velika ? 1 : 0.8} />
        <circle r={z(v * 1.75)} fill="url(#p-zar-zvijezde)" />
        <g transform={`rotate(${okret})`}>
          <g className="polje-treptaj" style={vars({ "--t": `${z(Math.abs(sum(i, 4)) * 5)}s` })}>
            <path d={`M${-s} 0 L0 ${-naprijed} L${s} 0 Z`} fill="url(#p-krak-g)" />
            <path d={`M${-s} 0 L0 ${straga} L${s} 0 Z`} fill="url(#p-krak-d)" />
            <path d={`M0 ${-s} L${-bocno} 0 L0 ${s} Z`} fill="url(#p-krak-l)" />
            <path d={`M0 ${-s} L${bocno} 0 L0 ${s} Z`} fill="url(#p-krak-r)" />
            {velika && (
              <g opacity=".55" transform="rotate(45)">
                <path d={`M${-s * 0.8} 0 L0 ${z(-v * 1.5)} L${s * 0.8} 0 L0 ${z(v * 1.5)} Z`} fill="#fff3d0" />
                <path d={`M0 ${-s * 0.8} L${z(-v * 1.5)} 0 L0 ${s * 0.8} L${z(v * 1.5)} 0 Z`} fill="#fff3d0" />
              </g>
            )}
          </g>
          <circle r={z(v * 0.5)} fill="url(#p-jezgra)" />
        </g>
      </g>
    </g>
  );
}

const DEFS = (
  <defs>
    <radialGradient id="p-aura">
      <stop offset=".72" stopColor="#d9b56f" stopOpacity="0" />
      <stop offset=".88" stopColor="#e6c98a" stopOpacity=".16" />
      <stop offset="1" stopColor="#d9b56f" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="p-staklo">
      <stop offset="0" stopColor="#4a5a9c" stopOpacity=".3" />
      <stop offset=".5" stopColor="#273262" stopOpacity=".3" />
      <stop offset=".9" stopColor="#0e1430" stopOpacity=".52" />
      <stop offset="1" stopColor="#080c1e" stopOpacity=".72" />
    </radialGradient>
    <linearGradient id="p-sjaj-stakla" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
      <stop offset=".5" stopColor="#ffffff" stopOpacity=".075" />
      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="p-sjaj">
      <stop offset="0" stopColor="#fbe6b4" stopOpacity=".95" />
      <stop offset=".36" stopColor="#d9b56f" stopOpacity=".26" />
      <stop offset="1" stopColor="#d9b56f" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="p-bljesak">
      <stop offset="0" stopColor="#fffaea" stopOpacity=".95" />
      <stop offset=".3" stopColor="#f6dba0" stopOpacity=".5" />
      <stop offset="1" stopColor="#f6dba0" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="p-halo">
      <stop offset="0" stopColor="#f0d79f" stopOpacity=".34" />
      <stop offset=".45" stopColor="#e2c487" stopOpacity=".1" />
      <stop offset="1" stopColor="#e2c487" stopOpacity="0" />
    </radialGradient>
    {/* zvijezde: žar oko jezgre, jezgra i četiri zrake koje blijede prema vrhu */}
    <radialGradient id="p-zar-zvijezde">
      <stop offset="0" stopColor="#fff6dc" stopOpacity=".9" />
      <stop offset=".4" stopColor="#f3d391" stopOpacity=".38" />
      <stop offset="1" stopColor="#e2c487" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="p-jezgra">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset=".6" stopColor="#fff3d0" />
      <stop offset="1" stopColor="#f0d79f" />
    </radialGradient>
    <linearGradient id="p-krak-g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#fffaea" />
      <stop offset=".35" stopColor="#f6dba0" stopOpacity=".7" />
      <stop offset="1" stopColor="#f6dba0" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="p-krak-d" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fffaea" />
      <stop offset=".35" stopColor="#f6dba0" stopOpacity=".7" />
      <stop offset="1" stopColor="#f6dba0" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="p-krak-l" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stopColor="#fffaea" />
      <stop offset=".35" stopColor="#f6dba0" stopOpacity=".7" />
      <stop offset="1" stopColor="#f6dba0" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="p-krak-r" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fffaea" />
      <stop offset=".35" stopColor="#f6dba0" stopOpacity=".7" />
      <stop offset="1" stopColor="#f6dba0" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="p-zlato" cx=".38" cy=".32" r=".78">
      <stop offset="0" stopColor="#fffdf2" />
      <stop offset=".4" stopColor="#f3dca6" />
      <stop offset=".85" stopColor="#c9a156" />
      <stop offset="1" stopColor="#a17a35" />
    </radialGradient>
    <linearGradient id="p-metal" x1=".1" y1="0" x2=".9" y2="1">
      <stop offset="0" stopColor="#fff3cf" />
      <stop offset=".3" stopColor="#dcb970" />
      <stop offset=".62" stopColor="#8f6d2f" />
      <stop offset="1" stopColor="#d9b56f" />
    </linearGradient>
    <linearGradient id="p-metal-ploha" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#3a3320" />
      <stop offset=".5" stopColor="#1c1a1c" />
      <stop offset="1" stopColor="#2e2818" />
    </linearGradient>
    <radialGradient id="p-nit" gradientUnits="userSpaceOnUse" cx={S} cy={S} r={R3 + 10}>
      <stop offset="0" stopColor="#fbe6b4" stopOpacity=".95" />
      <stop offset=".45" stopColor="#e6c98a" stopOpacity=".7" />
      <stop offset="1" stopColor="#d9b56f" stopOpacity=".42" />
    </radialGradient>
    <radialGradient id="p-krosnja" gradientUnits="userSpaceOnUse" cx={S} cy={S} r={R3}>
      <stop offset="0" stopColor="#f6dba0" stopOpacity=".6" />
      <stop offset=".5" stopColor="#d9b56f" stopOpacity=".3" />
      <stop offset="1" stopColor="#d9b56f" stopOpacity=".14" />
    </radialGradient>
    <linearGradient id="p-stozac" gradientUnits="userSpaceOnUse" x1="0" y1="392" x2="0" y2="100">
      <stop offset="0" stopColor="#f6dba0" stopOpacity=".4" />
      <stop offset="1" stopColor="#f3d391" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="p-odsjaj" gradientUnits="userSpaceOnUse" x1="60" y1="330" x2="250" y2="70">
      <stop offset="0" stopColor="#fff7df" stopOpacity="0" />
      <stop offset=".5" stopColor="#fff7df" stopOpacity=".95" />
      <stop offset="1" stopColor="#fff7df" stopOpacity="0" />
    </linearGradient>
    <clipPath id="p-isjecak">
      <circle cx={S} cy={S} r="336" />
    </clipPath>
    <path id="p-iskra" d={ISKRA} transform="scale(0.72)" />
    <path id="p-luk-gore" d={luk(315, -128, -52)} />
    <path id="p-luk-dolje" d={luk(328, 128, 52)} />
  </defs>
);

export default function Polje() {
  return (
    <figure className="polje">
      <div
        className="polje-scena"
        id="polje"
        role="img"
        aria-label="Polje konstelacije kao obiteljsko zviježđe: vi u središtu, iza vas roditelji, bake i djedovi te prabake i pradjedovi, a ispred vas vlastiti put"
      >
        <div className="polje-lelujanje">
          <div className="polje-nagib">
            {/* ============ sloj 0: daleke putanje iza astrolaba ============ */}
            <Sloj n={0} defs={DEFS} okvir={OKVIR_SIROKI}>
              <circle cx={S} cy={S} r="470" fill="url(#p-aura)" />
              <g fill="none" stroke="#d9b56f">
                <g className="polje-vrti putanja-a">
                  <circle cx={S} cy={S} r="478" strokeWidth=".8" strokeDasharray="2 11" opacity=".34" />
                  <circle cx={S + 478} cy={S} r="11" fill="url(#p-halo)" stroke="none" />
                  <circle cx={S + 478} cy={S} r="3.6" fill="#f0d79f" stroke="none" />
                  <circle cx={S - 478} cy={S} r="2" fill="#e2c487" stroke="none" opacity=".7" />
                </g>
                <g className="polje-vrti putanja-b">
                  <circle cx={S} cy={S} r="560" strokeWidth=".6" opacity=".2" />
                  <circle cx={S} cy={S - 560} r="9" fill="url(#p-halo)" stroke="none" />
                  <circle cx={S} cy={S - 560} r="2.8" fill="#cfd8ff" stroke="none" />
                </g>
              </g>
            </Sloj>

            {/* ============ sloj 1: kompas-obruč ============ */}
            <Sloj n={1}>
              <g fill="none" stroke="#d9b56f">
                {/* tamna metalna ploha obruča, da se gravura čita i preko galaksije */}
                <circle cx={S} cy={S} r="366.5" stroke="url(#p-metal-ploha)" strokeWidth="61" opacity=".82" />

                {[0, 90, 180, 270].map((k) => {
                  const s = siljak(k, 396, 436, 15);
                  return (
                    <g key={k} stroke="none">
                      <path d={s.svijetla} fill="#f0d79f" />
                      <path d={s.tamna} fill="#8f6d2f" />
                    </g>
                  );
                })}
                {[45, 135, 225, 315].map((k) => {
                  const s = siljak(k, 396, 420, 10);
                  return (
                    <g key={k} stroke="none" opacity=".9">
                      <path d={s.svijetla} fill="#dcb970" />
                      <path d={s.tamna} fill="#7a5c26" />
                    </g>
                  );
                })}

                <circle cx={S} cy={S} r="397" stroke="url(#p-metal)" strokeWidth="1.5" />
                <circle cx={S} cy={S} r="404.5" pathLength={360} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.001 5" opacity=".8" />
                <circle cx={S} cy={S} r="404.5" pathLength={360} strokeWidth="4.6" strokeLinecap="round" strokeDasharray="0.001 30" strokeDashoffset="-15" stroke="#f0d79f" />
                <g className="polje-prsten" style={vars({ "--d": "0.5s" })}>
                  <path d={val(388, 4.2, 30, 0)} strokeWidth=".65" opacity=".7" />
                  <path d={val(388, 4.2, 30, 180)} strokeWidth=".65" opacity=".7" />
                  <circle cx={S} cy={S} r="381" strokeWidth=".5" opacity=".5" />
                </g>
                <circle className="polje-krug" pathLength={1} cx={S} cy={S} r="377" stroke="url(#p-metal)" strokeWidth="1.6" />
                <path d={luk(397, 198, 250)} stroke="url(#p-odsjaj)" strokeWidth="2.6" strokeLinecap="round" />
                <path d={luk(377, 20, 52)} stroke="#fff7df" strokeWidth="1.6" strokeLinecap="round" opacity=".35" />

                <g className="polje-prsten" style={vars({ "--d": "0.4s" })}>
                  <circle cx={S} cy={S} r="371.5" strokeWidth=".5" opacity=".45" />
                  {/* gravirana skala: stupnjevi, desetice i rimski brojevi, polako se okreće */}
                  <g className="polje-vrti">
                    <circle cx={S} cy={S} r="363.5" pathLength={360} strokeWidth="4.5" strokeDasharray="0.14 1.86" opacity=".42" />
                    <circle cx={S} cy={S} r="362" pathLength={360} strokeWidth="8" strokeDasharray="0.22 9.78" opacity=".75" />
                    <g className="polje-brojevi" stroke="none" textAnchor="middle">
                      {RIMSKI.map((b, k) => (
                        <text key={b} x={S} y={S - 342.5} transform={`rotate(${k * 30} ${S} ${S})`}>
                          {b}
                        </text>
                      ))}
                    </g>
                    {Array.from({ length: 12 }, (_, k) => {
                      const [x, y] = pol(346, k * 30 - 75);
                      return <circle key={k} cx={x} cy={y} r="1.2" fill="#d9b56f" stroke="none" opacity=".7" />;
                    })}
                  </g>
                  <circle cx={S} cy={S} r="336" stroke="url(#p-metal)" strokeWidth="1.1" />
                </g>
              </g>
            </Sloj>

            {/* ============ sloj 2: staklo, karta neba, prstenovi naraštaja ============ */}
            <Sloj n={2}>
              <circle cx={S} cy={S} r="336" fill="url(#p-staklo)" />
              <g clipPath="url(#p-isjecak)">
                <rect x="-140" y="150" width="1080" height="130" fill="url(#p-sjaj-stakla)" transform={`rotate(-34 ${S} ${S})`} />
                <rect x="-140" y="318" width="1080" height="34" fill="url(#p-sjaj-stakla)" transform={`rotate(-34 ${S} ${S})`} opacity=".7" />
              </g>
              <g className="polje-prsten" fill="none" stroke="#d9b56f" style={vars({ "--d": "0.7s" })}>
                <circle cx={S} cy={S} r="331.5" strokeWidth=".5" strokeDasharray="1 4.5" opacity=".4" />
                <circle cx={S} cy={S} r="326" strokeWidth=".4" opacity=".22" />

                {/* zviježđa i zvijezde u staklu, u pozadini */}
                <g strokeWidth=".5" opacity=".26" strokeLinejoin="round">
                  {ZVIJEZDJA.map((t, k) => (
                    <polyline key={k} points={t.map((p) => p.join(",")).join(" ")} />
                  ))}
                </g>
                <g stroke="none" fill="#f6ead2">
                  {ZVIJEZDJA.flat().map(([x, y], k) => (
                    <circle key={k} cx={x} cy={y} r={k % 3 ? 0.9 : 1.4} opacity=".7" />
                  ))}
                  {Array.from({ length: 44 }, (_, k) => {
                    const [x, y] = pol(46 + Math.abs(sum(k, 7)) * 276, sum(k, 8) * 180);
                    return <circle key={k} cx={x} cy={y} r={z(0.5 + Math.abs(sum(k, 9)) * 0.9)} opacity={z(0.14 + Math.abs(sum(k, 10)) * 0.4)} />;
                  })}
                </g>

                {/* tri prstena naraštaja: tihe, točkaste putanje */}
                <circle cx={S} cy={S} r={R3} strokeWidth=".7" strokeDasharray="0.6 6" strokeLinecap="round" opacity=".34" />
                <circle cx={S} cy={S} r={R2} strokeWidth=".7" strokeDasharray="0.6 6" strokeLinecap="round" opacity=".34" />
                <circle cx={S} cy={S} r={R1} strokeWidth=".7" strokeDasharray="0.6 6" strokeLinecap="round" opacity=".36" />
              </g>
            </Sloj>

            {/* ============ sloj 3: obiteljsko zviježđe ============ */}
            <Sloj n={3}>
              <path className="polje-stozac" d={`M${S} ${S - 14} L${S - 52} 118 Q${S} 96 ${S + 52} 118 Z`} fill="url(#p-stozac)" />

              {/* ispred vas: ono što tek dolazi, tiše i sitnije */}
              <g className="polje-krosnja" fill="none" stroke="url(#p-krosnja)" strokeLinecap="round">
                {ISPRED.prva.map((d, i) => (
                  <path key={d} pathLength={1} d={d} strokeWidth=".9" style={vars({ "--d": `${3.3 + i * 0.1}s` })} />
                ))}
                {ISPRED.druga.map((d, i) => (
                  <path key={d} pathLength={1} d={d} strokeWidth=".75" style={vars({ "--d": `${3.55 + i * 0.06}s` })} />
                ))}
                {ISPRED.treca.map((d, i) => (
                  <path key={d} pathLength={1} d={d} strokeWidth=".6" style={vars({ "--d": `${3.8 + i * 0.05}s` })} />
                ))}
              </g>
              <g className="polje-pupovi" fill="#f6ead2" style={vars({ "--d": "4.3s" })}>
                {[
                  ...roditelji.map((r, i) => ({ t: pol(R1, -r.kut), v: 0.62, i })),
                  ...bakeDjedovi.map((b, i) => ({ t: pol(R2, -b.kut), v: 0.5, i: i + 2 })),
                  ...preci.map((p, i) => ({ t: pol(R3 - 8, -p.kut), v: i % 2 ? 0.4 : 0.56, i: i + 6 })),
                ].map((k) => (
                  <g key={k.i} transform={`translate(${k.t[0]} ${k.t[1]}) scale(${k.v})`}>
                    <circle r="9" fill="url(#p-halo)" />
                    <use className="polje-iskra" href="#p-iskra" style={vars({ "--d": `${z(k.i * 0.45)}s` })} />
                  </g>
                ))}
              </g>

              {/* iza vas: linije zviježđa, s mekim sjajem ispod */}
              <g className="polje-sjaj-niti" fill="none" stroke="#f0d79f" strokeLinecap="round" strokeWidth="5">
                {[...IZA.prva, ...IZA.druga, ...IZA.treca].map((d) => (
                  <path key={d} d={d} />
                ))}
              </g>
              <g className="polje-niti" fill="none" stroke="url(#p-nit)" strokeLinecap="round">
                {IZA.prva.map((d, i) => (
                  <path key={d} pathLength={1} d={d} strokeWidth="1.25" style={vars({ "--d": `${2.5 + i * 0.1}s` })} />
                ))}
                {IZA.druga.map((d, i) => (
                  <path key={d} pathLength={1} d={d} strokeWidth="1" style={vars({ "--d": `${2.85 + i * 0.07}s` })} />
                ))}
                {IZA.treca.map((d, i) => (
                  <path key={d} pathLength={1} d={d} strokeWidth=".8" style={vars({ "--d": `${3.2 + i * 0.05}s` })} />
                ))}
                {bracaSestre.map((b, i) => (
                  <path
                    key={b.natpis}
                    pathLength={1}
                    d={duz(pol(R1, b.kut), pol(R1, b.prema), razmak(V.bratSestra), razmak(V.roditelj))}
                    strokeWidth=".8"
                    opacity=".7"
                    style={vars({ "--d": `${2.7 + i * 0.1}s` })}
                  />
                ))}
              </g>

              {/* put naprijed i iskre koje se dižu u svjetlu */}
              <g className="polje-put" fill="none" stroke="#f0d79f" strokeWidth="1.5">
                <line x1={S} y1={S - 52} x2={S} y2="130" strokeDasharray="3 6" />
                <path d={`M${S - 8.5} 129 L${S} 114 L${S + 8.5} 129`} strokeLinejoin="round" strokeLinecap="round" />
              </g>
              <g className="polje-zari" fill="#fff3d0">
                {Array.from({ length: 11 }, (_, k) => (
                  <circle
                    key={k}
                    className="polje-zar"
                    cx={z(S + sum(k, 21) * 16)}
                    cy={S - 50}
                    r={z(0.9 + Math.abs(sum(k, 22)) * 1.3)}
                    style={vars({ "--d": `${z(4.2 + k * 0.57)}s`, "--dx": `${z(sum(k, 23) * 34)}px` })}
                  />
                ))}
              </g>

              {/* svjetlo koje putuje od predaka do vas: sjaj, rep i glava */}
              <g className="polje-komete" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {preci.map((_, i) => {
                  const stil = vars({ "--d": `${z(4.6 + ((i * 3) % 8) * 0.72)}s` });
                  return (
                    <g key={i}>
                      <g opacity=".3">
                        <path className="polje-kometa sjaj" pathLength={1} d={loza(i)} style={stil} />
                      </g>
                      <path className="polje-kometa rep" pathLength={1} d={loza(i)} style={stil} />
                      <path className="polje-kometa glava" pathLength={1} d={loza(i)} style={stil} />
                    </g>
                  );
                })}
                <g opacity=".34">
                  <path className="polje-kometa sjaj naprijed" pathLength={1} d={`M${S} ${S - 30} L${S} 122`} />
                </g>
                <path className="polje-kometa rep naprijed" pathLength={1} d={`M${S} ${S - 30} L${S} 122`} />
                <path className="polje-kometa glava naprijed" pathLength={1} d={`M${S} ${S - 30} L${S} 122`} />
              </g>

              {/* članovi obitelji: zvijezde */}
              {preci.map((p, i) => (
                <Zvijezda key={p.kut} v={V.predak} polumjer={R3} kut={p.kut} d={z(1.75 + i * 0.05)} i={i + 20} razmah={56} />
              ))}
              {bakeDjedovi.map((b, i) => (
                <Zvijezda key={b.kut} v={V.bakaDjed} polumjer={R2} kut={b.kut} d={z(1.35 + i * 0.07)} i={i + 10} razmah={72} />
              ))}
              {bracaSestre.map((b, i) => (
                <Zvijezda key={b.natpis} v={V.bratSestra} polumjer={R1} kut={b.kut} okret={b.kut > 90 ? -6 : 6} d={z(1.1 + i * 0.1)} i={i + 5} razmah={84} />
              ))}
              {roditelji.map((r, i) => (
                <Zvijezda key={r.id} v={V.roditelj} polumjer={R1} kut={r.kut} d={z(0.9 + i * 0.12)} i={i + 1} razmah={92} velika />
              ))}

              {/* oznake naraštaja na prstenovima */}
              <g className="polje-oznake" style={vars({ "--d": "3.7s" })}>
                {NARASTAJI.map((n) => {
                  const [x, y] = pol(n.r, OS);
                  return (
                    <g key={n.broj} transform={`translate(${x} ${y})`}>
                      <rect x="-2.6" y="-2.6" width="5.2" height="5.2" transform="rotate(45)" fill="#e2c487" />
                      <text x="9" y="-5">{n.broj}</text>
                    </g>
                  );
                })}
              </g>

              {/* vi: sunce u središtu */}
              <circle className="polje-val" cx={S} cy={S} r="34" fill="none" stroke="#e9cd92" strokeWidth="1" />
              <circle className="polje-val drugi" cx={S} cy={S} r="34" fill="none" stroke="#e9cd92" strokeWidth="1" />
              <circle className="polje-dah" cx={S} cy={S} r="126" fill="url(#p-sjaj)" />
              <g className="polje-ja">
                <g className="polje-bljesak">
                  <ellipse cx={S} cy={S} rx="188" ry="1.7" fill="url(#p-bljesak)" />
                  <ellipse cx={S} cy={S} rx="1.5" ry="104" fill="url(#p-bljesak)" opacity=".8" />
                  <ellipse cx={S} cy={S} rx="64" ry="1.1" fill="url(#p-bljesak)" opacity=".6" transform={`rotate(45 ${S} ${S})`} />
                  <ellipse cx={S} cy={S} rx="64" ry="1.1" fill="url(#p-bljesak)" opacity=".6" transform={`rotate(-45 ${S} ${S})`} />
                </g>
                <g className="polje-vrti zrake" fill="none" stroke="#f0d79f">
                  <circle cx={S} cy={S} r="41" pathLength={360} strokeWidth="13" strokeDasharray="0.55 14.45" opacity=".65" />
                  <circle cx={S} cy={S} r="37.5" pathLength={360} strokeWidth="6" strokeDasharray="0.45 14.55" strokeDashoffset="-7.5" opacity=".5" />
                </g>
                <circle cx={S} cy={S} r="31" fill="none" stroke="#f0d79f" strokeWidth=".7" opacity=".6" />
                <circle cx={S} cy={S} r="25" fill="url(#p-zlato)" />
                <ellipse cx={S - 8} cy={S - 10} rx="9" ry="5" fill="#fffdf4" opacity=".6" transform={`rotate(-28 ${S - 8} ${S - 10})`} />
              </g>

              {/* natpisi */}
              <g className="polje-natpisi">
                <text className="polje-natpis glavni" x={S + 54} y={S + 18} textAnchor="start" style={vars({ "--d": "1.4s" })}>
                  JA
                </text>
                <text className="polje-natpis" x={pol(R1, 132)[0] + 24} y={pol(R1, 132)[1] + 19} textAnchor="start" style={vars({ "--d": "2.6s" })}>
                  OTAC
                </text>
                <text className="polje-natpis" x={pol(R1, 48)[0] - 24} y={pol(R1, 48)[1] + 19} textAnchor="end" style={vars({ "--d": "2.7s" })}>
                  MAJKA
                </text>
                <text className="polje-natpis" x={pol(R1, 188)[0] - 24} y={pol(R1, 188)[1] + 4} textAnchor="end" style={vars({ "--d": "2.8s" })}>
                  SESTRA
                </text>
                <text className="polje-natpis" x={pol(R1, -8)[0] + 24} y={pol(R1, -8)[1] + 4} textAnchor="start" style={vars({ "--d": "2.9s" })}>
                  BRAT
                </text>
                <text className="polje-natpis luk gore" textAnchor="middle" style={vars({ "--d": "4.2s" })}>
                  <textPath href="#p-luk-gore" startOffset="50%">
                    KRILA · VLASTITI PUT
                  </textPath>
                </text>
                <text className="polje-natpis luk" textAnchor="middle" style={vars({ "--d": "3.9s" })}>
                  <textPath href="#p-luk-dolje" startOffset="50%">
                    KORIJENI · PRIPADNOST
                  </textPath>
                </text>
              </g>
            </Sloj>

            {/* ============ sloj 4: iskre, najbliže oku ============ */}
            <Sloj n={4}>
              <g fill="#f6ead2">
                {[
                  { x: 232, y: 196, v: 1.15, d: 0.4 },
                  { x: 604, y: 236, v: 1.3, d: 2.4 },
                  { x: 150, y: 330, v: 0.75, d: 1.2 },
                  { x: 668, y: 372, v: 0.75, d: 3.3 },
                  { x: 540, y: 716, v: 0.65, d: 2.0 },
                  { x: 214, y: 668, v: 0.75, d: 0.9 },
                  { x: 760, y: 150, v: 0.9, d: 1.7 },
                  { x: 44, y: 596, v: 0.8, d: 2.9 },
                ].map((k, i) => (
                  <g key={i} transform={`translate(${k.x} ${k.y}) scale(${k.v})`}>
                    <use className="polje-iskra" href="#p-iskra" style={vars({ "--d": `${k.d}s` })} />
                  </g>
                ))}
              </g>
            </Sloj>
          </div>
        </div>
      </div>
      <figcaption className="sr">Svatko na svom mjestu. Preci iza vas, a vi okrenuti naprijed.</figcaption>
    </figure>
  );
}

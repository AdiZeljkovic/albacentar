import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Ornament from "@/components/Ornament";
import Zvijezde from "@/components/Zvijezde";
import Oblaci from "@/components/pocetna/Oblaci";
import { greben, zrake } from "@/lib/krajolik";
import { site } from "@/lib/site";
import { kas, vars } from "@/lib/util";

/**
 * Završna poruka: dan završava na istom brdu na kojem je svanuo. Sunce zalazi iza stabla života,
 * iz krošnje polijeću ptice i pada lišće, a pod zemljom se korijenje spušta sve dublje dok mu se
 * vrhovi ne upale kao zvijezde: zemlja prelazi u noćno nebo podnožja i krug dana se zatvara.
 */

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

/** Stalni „slučajni" brojevi, isti na poslužitelju i u pregledniku. */
function nasumicno(sjeme: number) {
  let s = sjeme;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const kocka = nasumicno(52817);
const izmedju = (a: number, b: number) => +(a + (b - a) * kocka()).toFixed(2);

/** Korijenje od debla (600, 0) prema dubini; svaki korijen završava zvijezdom. Mjere crteža: 1200 × 400. */
const KORIJENJE: Array<{ d: string; vrh: [number, number] }> = [
  { d: "M600 0 C560 40 510 44 460 76 C420 104 390 96 340 122 C290 150 270 138 210 158 C150 178 120 150 60 196", vrh: [60, 196] },
  { d: "M600 0 C640 40 690 44 740 76 C780 104 810 96 860 122 C910 150 930 138 990 158 C1050 178 1080 150 1140 196", vrh: [1140, 196] },
  { d: "M600 0 C560 60 510 86 470 124 C430 164 380 156 340 190 C300 226 250 214 190 300", vrh: [190, 300] },
  { d: "M600 0 C640 60 690 86 730 124 C770 164 820 156 860 190 C900 226 950 214 1010 300", vrh: [1010, 300] },
  { d: "M600 0 C592 30 580 44 570 76 C560 110 520 122 510 160 C500 200 450 230 400 356", vrh: [400, 356] },
  { d: "M600 0 C608 30 620 44 630 76 C640 110 680 122 690 160 C700 200 750 230 800 356", vrh: [800, 356] },
  { d: "M600 0 C612 60 584 92 600 130 C618 170 590 220 600 372", vrh: [600, 372] },
];
/** Tanje žile koje se odvajaju od glavnih. */
const ZILICE = [
  "M340 122 C320 140 300 164 270 170 C220 180 200 214 150 240",
  "M860 122 C880 140 900 164 930 170 C980 180 1000 214 1050 240",
  "M470 124 C462 136 456 150 440 160 C400 180 390 222 300 340",
  "M730 124 C738 136 744 150 760 160 C800 180 810 222 900 340",
  "M510 160 C520 196 548 222 520 330",
  "M690 160 C680 196 652 222 680 330",
];
/** Zviježđe koje čine vrhovi korijenja. */
const ZVIJEZDJE = [0, 2, 4, 6, 5, 3, 1].map((i) => KORIJENJE[i].vrh);

/** Lišće koje pada iz krošnje (položaj u širinama stabla od podnožja debla). */
const LISCE = Array.from({ length: 12 }, () => ({
  "--fx": izmedju(-0.4, 0.4),
  "--fy": izmedju(0.34, 0.7),
  "--dx": izmedju(-0.22, 0.22),
  "--t": `${izmedju(8, 15)}s`,
  "--d": `${izmedju(-15, 0)}s`,
  "--v": `${izmedju(6, 11)}px`,
  "--r": `${izmedju(-200, 200)}deg`,
}));
/** Ptice koje polijeću iz krošnje: međutočka i kraj leta u širinama stabla. */
const PTICE = [
  { "--mx": 0.3, "--my": -0.3, "--ex": 0.95, "--ey": -0.62, "--t": "12s", "--d": "0s", "--v": 1 },
  { "--mx": -0.26, "--my": -0.36, "--ex": -0.86, "--ey": -0.74, "--t": "14s", "--d": "-4s", "--v": 0.8 },
  { "--mx": 0.14, "--my": -0.44, "--ex": 0.5, "--ey": -0.98, "--t": "13s", "--d": "-8s", "--v": 0.7 },
  { "--mx": -0.4, "--my": -0.22, "--ex": -1.16, "--ey": -0.46, "--t": "15s", "--d": "-11s", "--v": 0.9 },
];

export default function Zalaz() {
  return (
    <>
      <div className="zl-nebo">
        {/* oblaci koje sunce obasjava odozdo */}
        <Oblaci id="zo1" className="zl-oblaci a" boja={[1, 0.9, 0.78]} sjena={[0.86, 0.38, 0.32]} sjeme={8} gustoca={3.3} />
        <Oblaci id="zo2" className="zl-oblaci b" boja={[1, 0.86, 0.72]} sjena={[0.8, 0.34, 0.36]} sjeme={21} gustoca={3} frek="0.0026 0.014" />

        <div className="w zl-tekst">
          <Ornament />
          <h2 className="zl-stihovi" aria-label="Korijeni nas povezuju. Vlastiti put nas poziva. Osvijesti svoju snagu. Promijeni svoju priču. Stvori svoj put.">
            {["Korijeni nas povezuju.", "Vlastiti put nas poziva."].map((s, i) => (
              <span key={s} data-reveal style={kas(i * 0.22)} aria-hidden="true">
                {s}
              </span>
            ))}
            {["Osvijesti svoju snagu.", "Promijeni svoju priču.", "Stvori svoj put."].map((s, i) => (
              <span key={s} className="em" data-reveal style={kas(0.5 + i * 0.22)} aria-hidden="true">
                {s}
              </span>
            ))}
          </h2>
          <div className="gumbi" data-reveal style={kas(0.3)}>
            <Link className="btn" href="/kontakt">
              Pošaljite upit
            </Link>
            <Link className="btn btn-obrub" href="/radionice#prijava">
              Prijava na radionicu
            </Link>
          </div>
          <p className="zl-potpis" data-reveal style={kas(0.4)}>
            {site.name} · {site.tagline}
          </p>
        </div>

        {/* isto brdo i isto stablo kao u svitanju, sada u zalasku */}
        <div className="zl-tlo" aria-hidden="true">
          <div className="zl-sunce">
            <i className="zl-zrake" style={{ background: zrake(9, "255 222 150", 0.3) }} />
            <i className="zl-zar" />
            <i className="zl-kolut" />
          </div>
          <svg className="zl-brda" viewBox="0 0 1440 220" preserveAspectRatio="none">
            <path d={greben({ sjeme: 41, y: 70, amp: 30, valova: 2.3 })} fill="#a5586f" opacity=".6" />
            <path d={greben({ sjeme: 47, y: 96, amp: 24, valova: 3.3, suma: 8 })} fill="#6a3562" opacity=".95" />
          </svg>
          <Image className="zl-drvo" src="/img/drvo-zlatno.png" alt="" width={520} height={500} sizes="(max-width: 900px) 70vw, 520px" />
          <svg className="zl-brda" viewBox="0 0 1440 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="zl-brdo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2c1832" />
                <stop offset="1" stopColor="#23142c" />
              </linearGradient>
              <linearGradient id="zl-rub" x1="0" y1="0" x2="1" y2="0">
                <stop offset=".2" stopColor="#ffb878" stopOpacity="0" />
                <stop offset=".5" stopColor="#ffd9a0" />
                <stop offset=".8" stopColor="#ffb878" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 132 C240 70 520 30 720 30 C930 30 1200 74 1440 122 L1440 220 L0 220Z" fill="url(#zl-brdo)" />
            <path d="M0 132 C240 70 520 30 720 30 C930 30 1200 74 1440 122" fill="none" stroke="url(#zl-rub)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="zl-lisce">
            {LISCE.map((stil, i) => (
              <i key={i} style={vars(stil)} />
            ))}
          </div>
          <div className="zl-ptice">
            {PTICE.map((stil, i) => (
              <svg key={i} className="zl-ptica" viewBox="-13 -9 26 18" style={vars(stil)}>
                <g className="knj-krila" fill="none" stroke="#2c1832" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0 1 Q-5 -7 -12 -3" />
                  <path d="M0 1 Q5 -7 12 -3" />
                </g>
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* pod zemljom: korijenje se spušta i na vrhovima pali zvijezde; zemlja prelazi u noć podnožja */}
      <div className="zl-zemlja" data-reveal="mirno" aria-hidden="true">
        <div className="zl-zvijezde">
          <Zvijezde gustoca={1} padalice={false} />
        </div>
        <div className="zl-korijeni">
        <svg className="zl-korijenje" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <g fill="none" stroke="#d9b56f" strokeWidth=".8" strokeDasharray="1.5 6" strokeLinecap="round" opacity=".5">
            <path className="zl-zvijezdje" d={`M${ZVIJEZDJE.map(([x, y]) => `${x} ${y}`).join(" L")}`} />
          </g>
          <g fill="none" stroke="#e2c487" strokeLinecap="round">
            {KORIJENJE.map((k, i) => (
              <path key={k.d} className="zl-korijen" pathLength={1} d={k.d} strokeWidth="1.5" style={vars({ "--k": `${0.3 + i * 0.14}s` })} />
            ))}
            {ZILICE.map((d, i) => (
              <path key={d} className="zl-korijen tanak" pathLength={1} d={d} strokeWidth=".9" style={vars({ "--k": `${1.2 + i * 0.12}s` })} />
            ))}
          </g>
          <g className="polje-komete" fill="none" strokeLinecap="round">
            {KORIJENJE.map((k, i) => (
              <Kometa key={k.d} d={k.d} kasni={+(3 + ((i * 1.3) % 7)).toFixed(1)} traje={7} />
            ))}
          </g>
        </svg>
        {KORIJENJE.map((k, i) => (
          <i key={k.d} className="zl-zvijezda" style={vars({ "--x": `${(k.vrh[0] / 12).toFixed(2)}%`, "--y": `${(k.vrh[1] / 4).toFixed(2)}%`, "--i": i })} />
        ))}
        </div>
      </div>
    </>
  );
}

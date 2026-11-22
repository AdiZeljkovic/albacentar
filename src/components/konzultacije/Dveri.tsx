import Image from "next/image";
import Link from "next/link";
import Zvijezde from "@/components/Zvijezde";
import { naciniRada } from "@/content/rad";
import { greben } from "@/lib/krajolik";
import { cx, kas, vars } from "@/lib/util";
import Vrata, { DJELA, Kometa } from "./Vrata";

/**
 * Načini rada na stranici Konzultacije: isti prizor kao na naslovnici, ali se njime silazi.
 * Na brijegu pod noćnim nebom glave stoji stablo života; njegovo se korijenje pod zemljom splete
 * u jednu žilu koja se spušta niz stranicu i na svakom zavoju pušta granu do jednih vrata.
 * Vrata se otvore kad uđu u ekran, a iza svakih je jedan način rada s punim opisom.
 */

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const sum = (x: number, sjeme: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i + sjeme * 57.3) * (1 - u) + hash(i + 1 + sjeme * 57.3) * u;
};

/** Brijeg sa stablom: padina s tjemenom u sredini crteža i sitnim neravninama (crtež 1440 × 260). */
function brijeg(zatvoren: boolean) {
  let d = "";
  for (let x = 0; x <= 1440; x += 8) {
    const t = (x - 720) / 480;
    const mirno = 1 - 0.85 * Math.exp(-t * t * 9);
    const y = 152 - 114 * Math.exp(-t * t) + mirno * ((sum(x / 96, 4) - 0.5) * 11 + (sum(x / 30, 9) - 0.5) * 4);
    d += `${x === 0 ? "M" : " L"}${x} ${y.toFixed(1)}`;
  }
  return zatvoren ? `${d} L1440 260 L0 260Z` : d;
}

/** Korijenje pod stablom (crtež 600 × 300): bočne žile gasnu u dubini, tri srednje spliću se u čvor. */
const ZILE = [
  "M300 0 C292 60 314 120 302 190 C298 240 300 270 300 300",
  "M296 2 C270 50 296 110 286 170 C282 230 298 262 300 300",
  "M304 2 C330 50 304 110 314 170 C318 230 302 262 300 300",
];
const KORIJENJE = [
  "M292 4 C250 30 214 44 168 96 C140 128 120 170 96 214",
  "M308 4 C350 30 386 44 432 96 C460 128 480 170 504 214",
  "M288 6 C262 52 232 86 214 150 C204 190 196 226 176 262",
  "M312 6 C338 52 368 86 386 150 C396 190 404 226 424 262",
  "M284 2 C226 12 170 16 112 50 C76 72 50 100 22 124",
  "M316 2 C374 12 430 16 488 50 C524 72 550 100 578 124",
  "M214 150 C196 160 172 164 150 184",
  "M386 150 C404 160 428 164 450 184",
  "M168 96 C150 96 128 104 110 122",
  "M432 96 C450 96 472 104 490 122",
  "M252 70 C244 100 250 130 240 168",
  "M348 70 C356 100 350 130 360 168",
];

/** Žila koja se spušta kroz sva četiri reda (crtež 120 × 2000; grane se odvajaju na y = 0, 500, 1000, 1500). */
const DEBLO = "M60 0 C60 120 42 200 49 320 C54 420 60 440 60 500 C60 620 78 700 71 820 C66 920 60 940 60 1000 C60 1120 42 1200 49 1320 C54 1420 60 1440 60 1500 C60 1580 68 1640 62 1716";
const DEBLO_NIT = "M60 0 C74 110 74 250 63 370 C57 450 60 470 60 500 C46 610 46 750 57 870 C63 950 60 970 60 1000 C74 1110 74 1250 63 1370 C57 1450 60 1470 60 1500 C54 1570 58 1640 62 1716";
const DEBLO_KRAJ = ["M62 1716 C58 1756 40 1776 28 1822", "M62 1716 C64 1766 72 1806 66 1862", "M62 1716 C70 1746 88 1766 98 1808"];

/** Grana od žile do svjetiljke nad vratima (crtež 225 × 94: žila je desno gore, svjetiljka lijevo dolje). */
const GRANA = "M225 0 C225 42 150 22 86 42 C34 58 0 66 0 94";
const GRANA_ZILICE = ["M150 27 C128 44 122 60 126 82", "M86 42 C64 40 46 30 34 14"];
const ZILICA = "M20 0 C12 18 28 34 20 52 C18 60 20 64 20 70";

const RIMSKI = ["I", "II", "III", "IV", "V", "VI"];

const KRIJESNICE = [
  { "--fx": -0.92, "--fy": 0.1, "--v": "3px", "--t": "17s", "--s": "5.5s", "--d": "-2s", "--ax": "18px", "--ay": "-14px", "--bx": "-10px", "--by": "-26px", "--cx": "12px", "--cy": "-8px" },
  { "--fx": 0.84, "--fy": 0.16, "--v": "2.5px", "--t": "21s", "--s": "6.5s", "--d": "-7s", "--ax": "-16px", "--ay": "-10px", "--bx": "8px", "--by": "-22px", "--cx": "-12px", "--cy": "-30px" },
  { "--fx": -0.58, "--fy": 0.34, "--v": "2px", "--t": "15s", "--s": "4.6s", "--d": "-4s", "--ax": "10px", "--ay": "-18px", "--bx": "22px", "--by": "-6px", "--cx": "6px", "--cy": "-24px" },
  { "--fx": 0.62, "--fy": 0.46, "--v": "3px", "--t": "19s", "--s": "7s", "--d": "-11s", "--ax": "-8px", "--ay": "-16px", "--bx": "-22px", "--by": "-4px", "--cx": "-4px", "--cy": "-22px" },
  { "--fx": -1.18, "--fy": -0.04, "--v": "2px", "--t": "23s", "--s": "6s", "--d": "-9s", "--ax": "14px", "--ay": "-8px", "--bx": "26px", "--by": "-20px", "--cx": "8px", "--cy": "-28px" },
  { "--fx": 1.14, "--fy": 0.0, "--v": "2.5px", "--t": "18s", "--s": "5s", "--d": "-13s", "--ax": "-12px", "--ay": "-12px", "--bx": "-24px", "--by": "-24px", "--cx": "-6px", "--cy": "-10px" },
];

export default function Dveri() {
  return (
    <>
      {/* brijeg sa stablom pod nebom glave; pod njim počinje zemlja u koju silazi korijenje */}
      <div className="kz-brijeg" aria-hidden="true">
        <div className="kz-brijeg-nebo">
          <Zvijezde gustoca={0.9} bogato padalice={false} />
        </div>
        <svg className="kz-brijeg-daleko" viewBox="0 0 1440 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="kz-daleko-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset=".12" stopColor="#141a3a" />
              <stop offset=".6" stopColor="#0b0f22" />
            </linearGradient>
            <linearGradient id="kz-daleko-b" x1="0" y1="0" x2="0" y2="1">
              <stop offset=".3" stopColor="#0d1128" />
              <stop offset=".8" stopColor="#070914" />
            </linearGradient>
          </defs>
          <path d={greben({ sjeme: 43, y: 74, amp: 34, valova: 2.3 })} fill="url(#kz-daleko-a)" />
          <path d={greben({ sjeme: 51, y: 104, amp: 26, valova: 3.5, suma: 8 })} fill="url(#kz-daleko-b)" />
        </svg>
        <i className="kz-aura" />
        <svg className="kz-brijeg-tlo" viewBox="0 0 1440 260" preserveAspectRatio="none">
          <defs>
            <linearGradient id="kz-brdo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0d1229" />
              <stop offset=".5" stopColor="#070a17" />
              <stop offset=".64" stopColor="#05070f" />
              <stop offset="1" stopColor="#05070f" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="kz-tlo-sjaj" cx=".5" cy=".14" r=".5" gradientTransform="translate(.5 .14) scale(.5 1) translate(-.5 -.14)">
              <stop offset="0" stopColor="#f3c877" stopOpacity=".5" />
              <stop offset=".4" stopColor="#d9a04e" stopOpacity=".15" />
              <stop offset="1" stopColor="#d9a04e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="kz-brdo-rub" x1="0" y1="0" x2="1" y2="0">
              <stop offset=".28" stopColor="#ffd9a0" stopOpacity="0" />
              <stop offset=".5" stopColor="#ffe2b0" />
              <stop offset=".72" stopColor="#ffd9a0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={brijeg(true)} fill="url(#kz-brdo)" />
          <path d={brijeg(true)} fill="url(#kz-tlo-sjaj)" />
          <path d={brijeg(false)} fill="none" stroke="url(#kz-brdo-rub)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* korijenje: svjetlo iz stabla silazi njime prema vratima */}
        <svg className="kz-korijenje" viewBox="0 0 600 300" preserveAspectRatio="none">
          <g fill="none" stroke="#d9b56f" strokeLinecap="round">
            {KORIJENJE.map((d, i) => (
              <path key={d} d={d} strokeWidth={i < 6 ? 1.3 : 0.9} opacity={i < 6 ? 0.55 : 0.4} />
            ))}
            {ZILE.map((d, i) => (
              <path key={d} d={d} strokeWidth="1.3" opacity={i === 0 ? 0.85 : 0.6} />
            ))}
          </g>
          <g className="polje-komete" fill="none" strokeLinecap="round">
            {ZILE.map((d, i) => (
              <Kometa key={d} d={d} kasni={i * 1.2} traje={3.6} />
            ))}
            {KORIJENJE.slice(0, 4).map((d, i) => (
              <Kometa key={d} d={d} kasni={0.7 + i * 1.6} traje={6.4} />
            ))}
          </g>
        </svg>
        {/* izvorni PNG, bez sažimanja, kao na naslovnici */}
        <Image className="kz-drvo" src="/img/drvo-zlatno.webp" alt="" width={520} height={500} loading="eager" unoptimized />
        <div className="kz-krijesnice">
          {KRIJESNICE.map((stil, i) => (
            <i key={i} style={vars(stil)} />
          ))}
        </div>
      </div>

      <div className="w kz-dveri-in">
        <div className="kz-redovi" id="kz-pojas">
          <i className="kz-cvor" aria-hidden="true" />
          {/* žila koja silazi kroz sve redove; na užim ekranima svaka vrata imaju svoju žilicu */}
          <svg className="kz-deblo" viewBox="0 0 120 2000" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="kz-deblo-kraj" gradientUnits="userSpaceOnUse" x1="0" y1="1700" x2="0" y2="1862">
                <stop offset="0" stopColor="#d9b56f" stopOpacity=".7" />
                <stop offset="1" stopColor="#d9b56f" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g fill="none" strokeLinecap="round">
              <path d={DEBLO} stroke="#dcb970" strokeWidth="1.5" opacity=".8" />
              <path d={DEBLO_NIT} stroke="#d9b56f" strokeWidth="1" opacity=".42" />
              {DEBLO_KRAJ.map((d) => (
                <path key={d} d={d} stroke="url(#kz-deblo-kraj)" strokeWidth="1.1" />
              ))}
            </g>
            <g className="polje-komete" fill="none" strokeLinecap="round">
              {[0, 1, 2, 3].map((k) => (
                <Kometa key={k} d={DEBLO} kasni={k * 2.6} traje={10.4} />
              ))}
            </g>
          </svg>

          {naciniRada.map((n, i) => (
            <article className={cx("kz-red", i % 2 === 1 && "kz-red-d")} key={n.id}>
              <div className="kz-stup">
                <i className="kz-cvor kz-cvor-red" aria-hidden="true" />
                <svg className="kz-grana" viewBox="0 0 225 94" aria-hidden="true">
                  <g fill="none" stroke="#d9b56f" strokeLinecap="round">
                    <path d={GRANA} strokeWidth="1.3" opacity=".75" />
                    {GRANA_ZILICE.map((d) => (
                      <path key={d} d={d} strokeWidth=".9" opacity=".36" />
                    ))}
                  </g>
                  <g className="polje-komete" fill="none" strokeLinecap="round">
                    <Kometa d={GRANA} kasni={0.8 + i * 2.6} traje={5.2} />
                  </g>
                </svg>
                <svg className="kz-zilica" viewBox="0 0 40 70" aria-hidden="true">
                  <path d={ZILICA} fill="none" stroke="url(#kz-nit)" strokeWidth="1.2" strokeLinecap="round" />
                  <g className="polje-komete" fill="none" strokeLinecap="round">
                    <Kometa d={ZILICA} kasni={i * 0.7} traje={2.8} />
                  </g>
                </svg>
                <div className="kz-vrata">
                  <Vrata slika={n.prizor} i={i} href={n.href} naziv={n.naziv} sizes="(max-width: 640px) 70vw, (max-width: 1040px) 36vw, 320px" />
                </div>
                {DJELA[n.prizor] && <p className="kz-djelo">{DJELA[n.prizor]}</p>}
              </div>

              <div className="kz-opis">
                <span className="kz-pod" aria-hidden="true" />
                <p className="kz-broj" aria-hidden="true" data-reveal style={kas(0.5)}>
                  {RIMSKI[i]}
                </p>
                <p className="vrata-oz" data-reveal style={kas(0.58)}>
                  {n.oznaka}
                </p>
                <h2 data-reveal style={kas(0.66)}>
                  {n.naziv}
                </h2>
                <p className="mut" data-reveal style={kas(0.76)}>
                  {n.opis}
                </p>
                <p className="red" data-reveal style={kas(0.88)}>
                  <Link className="link" href={n.href}>
                    {n.poziv}{" "}
                    <span className="str" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <i className="kz-dveri-dno" aria-hidden="true" />
    </>
  );
}

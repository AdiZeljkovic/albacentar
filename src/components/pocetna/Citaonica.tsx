import type { CSSProperties } from "react";
import Link from "next/link";
import Knjiga3D from "@/components/Knjiga3D";
import Nagib from "@/components/Nagib";
import Naslov from "@/components/Naslov";
import { knjige } from "@/content/knjige";
import { kas, vars } from "@/lib/util";
import { ISKRA } from "@/lib/zvijezda";

/**
 * Knjige: čitaonica iza vrata, noću. Kroz prozor se vidi brdo sa stablom života iz prizora iznad,
 * na stolu uz svijeću stoje dvije knjige. Iz „Korijena i krila" korijenje raste u stol, a ptice
 * polijeću prema prozoru; od „Nevidljivih niti" tanke niti vode do zvijezda na nebu.
 * Sve se odvija samo. Mjere prizora su u jedinici --u (1/560 širine prizora), pa se cijeli
 * prizor smanjuje kao jedna slika.
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
const kocka = nasumicno(7411);
const izmedju = (a: number, b: number) => +(a + (b - a) * kocka()).toFixed(1);

/** Zvijezde na nebu u prozoru (koordinate crteža prozora, 300 × 440). */
const NEBO = Array.from({ length: 34 }, () => ({ x: izmedju(30, 270), y: izmedju(34, 300), r: izmedju(0.5, 1.5), t: izmedju(0, 5) }));
/** Tri zvijezde do kojih vode niti. */
const ZVIJEZDE_NITI: Array<[number, number]> = [
  [70, 96],
  [140, 60],
  [232, 170],
];
/** Niti od knjige „Nevidljive niti" do tih zvijezda, u mjerama prizora (560 × 640); prozor je crtež umanjen na 250/300. */
const NITI = ["M452 262 C410 130 210 64 58 80", "M466 258 C430 96 260 30 117 50", "M446 266 C390 196 290 156 193 142"];

/** Korijenje u čelu stola, od knjige prema dolje; i isti putovi obrnuto, za svjetlo koje se penje u knjigu. */
const KORIJENJE = [
  "M150 0 C148 20 120 30 96 44 C70 58 40 60 14 72",
  "M150 0 C152 22 180 30 206 46 C232 60 262 62 288 72",
  "M150 0 C146 26 132 44 118 74",
  "M150 0 C154 26 170 46 186 74",
  "M150 0 C150 30 154 52 150 76",
  "M96 44 C84 52 80 64 70 74",
  "M206 46 C218 54 222 66 232 76",
];
const UZ_KORIJEN = ["M14 72 C40 60 70 58 96 44 C120 30 148 20 150 0", "M288 72 C262 62 232 60 206 46 C180 30 152 22 150 0", "M150 76 C154 52 150 30 150 0"];

/** Ptice koje polijeću iz knjige prema prozoru: međutočka i kraj leta (u jedinicama prizora), trajanje i kašnjenje. */
const PTICE = [
  { "--mx": -70, "--my": -70, "--ex": -196, "--ey": -118, "--t": "9s", "--d": "0s", "--v": 1 },
  { "--mx": -40, "--my": -96, "--ex": -150, "--ey": -150, "--t": "11s", "--d": "-3.5s", "--v": 0.8 },
  { "--mx": -96, "--my": -46, "--ex": -226, "--ey": -76, "--t": "10s", "--d": "-6s", "--v": 0.9 },
  { "--mx": -20, "--my": -84, "--ex": -116, "--ey": -134, "--t": "12s", "--d": "-8.5s", "--v": 0.7 },
  { "--mx": -82, "--my": -92, "--ex": -176, "--ey": -166, "--t": "13s", "--d": "-1.8s", "--v": 0.75 },
];

function Prozor() {
  return (
    <svg className="knj-prozor" id="knj-prozor" viewBox="0 0 300 440" aria-hidden="true">
      <defs>
        <clipPath id="kn-okno">
          <path d="M24 408 L24 150 A126 126 0 0 1 276 150 L276 408Z" />
        </clipPath>
        <linearGradient id="kn-nebo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1030" />
          <stop offset=".55" stopColor="#1a2764" />
          <stop offset=".86" stopColor="#3a4290" />
          <stop offset="1" stopColor="#4a4c96" />
        </linearGradient>
        <radialGradient id="kn-mjesec" cx=".3" cy=".3" r=".9">
          <stop offset="0" stopColor="#fffdf3" />
          <stop offset=".6" stopColor="#f6e7c0" />
          <stop offset="1" stopColor="#d9bd84" />
        </radialGradient>
        <radialGradient id="kn-sjaj">
          <stop offset="0" stopColor="#ffe2a8" stopOpacity=".75" />
          <stop offset=".4" stopColor="#f0b860" stopOpacity=".22" />
          <stop offset="1" stopColor="#f0b860" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="kn-mjesec-sjaj">
          <stop offset="0" stopColor="#f6e7c0" stopOpacity=".4" />
          <stop offset="1" stopColor="#8f9be0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="kn-okvir" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3cf" />
          <stop offset=".4" stopColor="#d9b56f" />
          <stop offset="1" stopColor="#8f6d2f" />
        </linearGradient>
        <linearGradient id="kn-staklo" x1="0" y1="0" x2="1" y2="1">
          <stop offset=".3" stopColor="#ffffff" stopOpacity="0" />
          <stop offset=".46" stopColor="#ffffff" stopOpacity=".1" />
          <stop offset=".56" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <mask id="kn-srp">
          <rect x="150" y="60" width="120" height="100" fill="#000" />
          <circle cx="212" cy="106" r="19" fill="#fff" />
          <circle cx="204" cy="100" r="16.5" fill="#000" />
        </mask>
      </defs>

      {/* pogled: noćno nebo, mjesec i brdo sa stablom života */}
      <g clipPath="url(#kn-okno)">
        <rect x="24" y="24" width="252" height="384" fill="url(#kn-nebo)" />
        <ellipse cx="130" cy="150" rx="210" ry="40" fill="#8f9be0" opacity=".13" transform="rotate(-32 130 150)" />
        {NEBO.map((z, i) => (
          <circle key={i} className="knj-zv" cx={z.x} cy={z.y} r={z.r} fill={i % 5 === 0 ? "#ffe9b8" : "#e8ecff"} style={vars({ "--t": `${z.t}s` })} />
        ))}
        {ZVIJEZDE_NITI.map(([x, y], i) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            <circle r="9" fill="url(#kn-sjaj)" />
            <path className="polje-iskra" style={vars({ "--d": `${i * 1.3}s` })} d={ISKRA} transform="scale(0.6)" fill="#fff3d0" />
          </g>
        ))}
        <circle cx="212" cy="106" r="46" fill="url(#kn-mjesec-sjaj)" />
        <circle cx="212" cy="106" r="19" fill="url(#kn-mjesec)" mask="url(#kn-srp)" />
        <path d="M24 356 C70 336 110 348 150 338 C200 326 240 344 276 330 L276 408 L24 408Z" fill="#1c2452" />
        <circle className="knj-drvo-sjaj" cx="150" cy="318" r="70" fill="url(#kn-sjaj)" />
        <path d="M24 392 C80 344 220 344 276 392 L276 408 L24 408Z" fill="#090d1f" />
        <image href="/img/drvo-zlatno.webp" x="108" y="282" width="84" height="80.8" />
        <rect x="24" y="24" width="252" height="384" fill="url(#kn-staklo)" />
      </g>

      {/* prečke i okvir */}
      <g fill="none" stroke="#0b0f22" strokeWidth="5" strokeLinecap="round">
        <path d="M150 26 L150 408 M24 150 L276 150 M24 282 L276 282 M150 150 L61 61 M150 150 L239 61" />
      </g>
      <g fill="none" stroke="#d9b56f" strokeWidth=".7" opacity=".7">
        <path d="M150 26 L150 408 M24 150 L276 150 M24 282 L276 282 M150 150 L61 61 M150 150 L239 61" />
      </g>
      <g fill="none" stroke="url(#kn-okvir)">
        <path d="M24 408 L24 150 A126 126 0 0 1 276 150 L276 408" strokeWidth="3" />
        <path d="M14 408 L14 150 A136 136 0 0 1 286 150 L286 408" strokeWidth=".8" opacity=".65" />
        <path d="M19 150 A131 131 0 0 1 281 150" pathLength={180} strokeWidth="5" strokeDasharray="0.5 5.5" strokeDashoffset="0.25" opacity=".55" />
      </g>
      <path d="M4 408 L296 408 L290 424 L10 424Z" fill="#2a1c18" stroke="url(#kn-okvir)" strokeWidth="1" />
    </svg>
  );
}

function Ptica({ stil }: { stil: Record<string, string | number> }) {
  return (
    <svg className="knj-ptica" viewBox="-13 -9 26 18" style={vars(stil)} aria-hidden="true">
      <g className="knj-krila" fill="none" stroke="#fff1c8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 1 Q-5 -7 -12 -3" />
        <path d="M0 1 Q5 -7 12 -3" />
      </g>
    </svg>
  );
}

export default function Citaonica() {
  return (
    <div className="w knj-mreza">
      <div className="citaonica-okvir" data-reveal>
        <Nagib className="citaonica">
          <Prozor />

          {/* niti do zvijezda */}
          <svg className="knj-niti" viewBox="0 0 560 640" aria-hidden="true">
            <g fill="none" stroke="#e9cd92" strokeWidth=".8" strokeDasharray="1 5" strokeLinecap="round" opacity=".55">
              {NITI.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
            <g className="polje-komete" fill="none" strokeLinecap="round">
              {NITI.map((d, i) => (
                <Kometa key={d} d={d} kasni={i * 2.1} traje={6.3} />
              ))}
            </g>
          </svg>

          {/* stol */}
          <div className="knj-stol">
            <i className="knj-stol-ploha" />
            <i className="knj-stol-celo" />
            <svg className="knj-korijenje" viewBox="0 0 300 76" preserveAspectRatio="none" aria-hidden="true">
              <g fill="none" stroke="#e2c487" strokeLinecap="round">
                {KORIJENJE.map((d, i) => (
                  <path key={d} className="knj-korijen" pathLength={1} d={d} strokeWidth={i < 5 ? 1.3 : 0.9} style={vars({ "--k": `${0.9 + i * 0.16}s` })} />
                ))}
              </g>
              <g className="polje-komete" fill="none" strokeLinecap="round">
                {UZ_KORIJEN.map((d, i) => (
                  <Kometa key={d} d={d} kasni={3 + i * 1.4} traje={4.2} />
                ))}
              </g>
            </svg>
          </div>

          {/* svijeća */}
          <div className="knj-svijeca">
            <i className="knj-zar" />
            <i className="knj-plamen" id="knj-plamen">
              <i />
            </i>
            <i className="knj-stijenj" />
            <i className="knj-vosak" />
            <i className="knj-tanjur" />
          </div>

          <Link href="/knjige#nevidljive-niti" className="knj-knjiga knj-druga" aria-label="Nevidljive niti">
            <Knjiga3D naslov={knjige[1].naslov} podnaslov={knjige[1].podnaslov} korica="nocna" />
          </Link>
          <Link href="/knjige#korijeni-i-krila" className="knj-knjiga knj-prva" aria-label="Korijeni i krila">
            <Knjiga3D naslov={knjige[0].naslov} podnaslov={knjige[0].podnaslov} korica="svijetla" />
          </Link>

          {/* krila: ptice polijeću iz knjige prema prozoru */}
          <div className="knj-ptice" aria-hidden="true">
            {PTICE.map((p, i) => (
              <Ptica key={i} stil={p} />
            ))}
          </div>
        </Nagib>
      </div>

      <div className="knj-tekst">
        <p className="oz" data-reveal>
          Knjige i publikacije <span className="primjer">u pripremi</span>
        </p>
        <Naslov>{"Priče koje vrijedi *sačuvati.*"}</Naslov>
        <div className="proza" data-reveal style={kas(0.25)}>
          <p className="mut uvod">
            Obiteljska povijest mnogo je više od imena i datuma. Ona je zbirka životnih priča, uspomena, odluka,
            vrijednosti i iskustava koja oblikuju identitet jedne obitelji.
          </p>
        </div>
        <blockquote className="knjige-citat" data-reveal style={kas(0.32)}>
          Korijeni nam daju pripadnost. Krila nam daju slobodu da krenemo svojim putem.
        </blockquote>
        <div className="knj-popis" data-reveal style={kas(0.4)}>
          {knjige.map((k, i) => (
            <Link key={k.id} href={`/knjige#${k.id}`}>
              <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {i === 0 ? (
                  <>
                    <path d="M20 22 Q14 12 5 16 M20 22 Q26 12 35 16" />
                    <path d="M20 22 L20 28 M20 28 C18 32 14 33 10 36 M20 28 C22 32 26 33 30 36 M20 28 L20 37" />
                  </>
                ) : (
                  <>
                    <path d="M8 10 C16 16 16 24 20 30 M32 10 C24 16 24 24 20 30 M20 6 L20 30" strokeDasharray="1.5 3" />
                    <circle cx="8" cy="10" r="2.4" />
                    <circle cx="32" cy="10" r="2.4" />
                    <circle cx="20" cy="6" r="2.4" />
                    <circle cx="20" cy="31" r="3.4" fill="currentColor" stroke="none" />
                  </>
                )}
              </svg>
              <b>{k.naslov}</b>
              <span>{k.vrsta}</span>
            </Link>
          ))}
        </div>
        <p className="red" data-reveal style={kas(0.48)}>
          <Link className="btn btn-zlato" href="/knjige">
            Pogledajte knjige
          </Link>
        </p>
      </div>
    </div>
  );
}

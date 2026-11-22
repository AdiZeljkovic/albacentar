import Image from "next/image";
import Link from "next/link";
import Naslov from "@/components/Naslov";
import type { Clanak } from "@/lib/blog";
import { cx, kas, vars } from "@/lib/util";

/**
Iz„Iz obiteljskog polja": plavi sat pred zoru. Iz polja na dnu dižu se lampioni, a svaki
 * tekst je jedan lampion koji lebdi; slika teksta svijetli kroz njegov papir, a o njemu visi
 * cedulja s naslovom. Sve se njiše i lebdi samo.
 */

/** Stalni „slučajni" brojevi, isti na poslužitelju i u pregledniku. */
function nasumicno(sjeme: number) {
  let s = sjeme;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const kocka = nasumicno(90317);
const izmedju = (a: number, b: number) => +(a + (b - a) * kocka()).toFixed(1);

/** Daleki lampioni koji se s polja polako dižu u nebo. */
const DALEKI = Array.from({ length: 18 }, () => ({
  "--x": `${izmedju(2, 98)}%`,
  "--v": izmedju(0.45, 1.2),
  "--t": `${izmedju(38, 84)}s`,
  "--d": `${izmedju(-84, 0)}s`,
  "--nj": `${izmedju(-60, 60)}px`,
}));

/** Obris papirnatog tijela lampiona (crtež 200 × 270; tijelo zauzima gornjih 240). */
const TIJELO = "M30 78 C30 34 60 12 100 12 C140 12 170 34 170 78 C170 128 158 186 146 228 L54 228 C42 186 30 128 30 78Z";

/**
 * Lampion: papirnato tijelo kroz koje svijetli slika teksta. Volumen daju sjene uz rubove i svjetlo
 * koje se od plamena penje odozdo; papir ima nabore i dva šava, dolje je obruč od bambusa s gorionikom.
 */
function Lampion({ slika, velik, sizes, i = 0 }: { slika: string; velik?: boolean; sizes: string; i?: number }) {
  return (
    <span className={cx("lampion", velik && "velik")} style={vars({ "--t": `${6.5 + (i % 3) * 1.3}s`, "--d": `${-i * 1.7}s` })}>
      <span className="lampion-sjaj" />
      <span className="lampion-tijelo">
        {slika && <Image src={slika} alt="" fill sizes={sizes} />}
        <span className="lampion-papir" />
      </span>
      <svg className="lampion-okvir" viewBox="0 0 200 270" aria-hidden="true">
        {/* volumen: tamnije uz bokove i pri vrhu, a odozdo svjetlo plamena */}
        <path d={TIJELO} fill="url(#lp-bokovi)" />
        <path d={TIJELO} fill="url(#lp-odozdo)" />
        <g fill="none" strokeLinecap="round">
          {/* nabori papira: naizmjence svijetli i tamni */}
          <path d="M100 12 C97 80 97 160 100 228" stroke="#fff6d2" strokeWidth=".8" opacity=".3" />
          <path d="M72 17 C56 78 62 168 80 228" stroke="#4a2008" strokeWidth=".9" opacity=".26" />
          <path d="M128 17 C144 78 138 168 120 228" stroke="#4a2008" strokeWidth=".9" opacity=".26" />
          <path d="M50 30 C36 84 46 172 66 228" stroke="#fff6d2" strokeWidth=".7" opacity=".2" />
          <path d="M150 30 C164 84 154 172 134 228" stroke="#fff6d2" strokeWidth=".7" opacity=".2" />
          {/* šavovi lijepljenog papira */}
          <path d="M31 92 Q100 108 169 92" stroke="#4a2008" strokeWidth=".8" opacity=".24" />
          <path d="M37 158 Q100 172 163 158" stroke="#4a2008" strokeWidth=".8" opacity=".2" />
          <path d={TIJELO} stroke="url(#lp-rub)" strokeWidth="1.3" />
        </g>
        {/* vrh */}
        <ellipse cx="100" cy="13.5" rx="24" ry="3.4" fill="#7a4a1c" opacity=".85" />
        <ellipse cx="100" cy="12.6" rx="15" ry="1.8" fill="#f6dba0" opacity=".5" />
        {/* otvor: obasjana unutrašnjost, obruč, žice i gorionik */}
        <ellipse cx="100" cy="228" rx="46" ry="6.5" fill="url(#lp-otvor)" />
        <ellipse cx="100" cy="228" rx="46" ry="6.5" fill="none" stroke="#b9853c" strokeWidth="2.2" />
        <path d="M55 229 Q100 222 145 229" fill="none" stroke="#fff0c0" strokeWidth=".8" opacity=".7" />
        <path d="M56 230 L100 241 L144 230 M100 234.4 L100 241" fill="none" stroke="#8a6a36" strokeWidth=".8" />
        <rect x="95.5" y="239" width="9" height="5" rx="1.4" fill="#4a3018" />
        <circle className="lampion-zar" cx="100" cy="240" r="30" fill="url(#lp-zar)" />
        <g className="lampion-plamen">
          <path d="M100 222 C109 232 108 243 100 246 C92 243 91 232 100 222Z" fill="url(#lp-plamen)" />
          <path d="M100 231 C104 236 103.6 242 100 244 C96.4 242 96 236 100 231Z" fill="#fffdf0" />
        </g>
      </svg>
    </span>
  );
}
export default function Lampioni({ glavni, ostali }: { glavni: Clanak; ostali: Clanak[] }) {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          {/* oblik lampiona u mjerama okvira (0–1), da ga CSS može primijeniti na bilo koju veličinu */}
          <clipPath id="lp-oblik" clipPathUnits="objectBoundingBox">
            <path d="M.15 .325 C.15 .1417 .30 .05 .50 .05 C.70 .05 .85 .1417 .85 .325 C.85 .5333 .79 .775 .73 .95 L.27 .95 C.21 .775 .15 .5333 .15 .325Z" />
          </clipPath>
          <linearGradient id="lp-rub" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a8652a" />
            <stop offset="1" stopColor="#ffe9b8" />
          </linearGradient>
          <linearGradient id="lp-bokovi" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a1606" stopOpacity=".62" />
            <stop offset=".26" stopColor="#3a1606" stopOpacity="0" />
            <stop offset=".74" stopColor="#3a1606" stopOpacity="0" />
            <stop offset="1" stopColor="#3a1606" stopOpacity=".62" />
          </linearGradient>
          <linearGradient id="lp-odozdo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c1004" stopOpacity=".5" />
            <stop offset=".4" stopColor="#2c1004" stopOpacity="0" />
            <stop offset=".62" stopColor="#ffe6a6" stopOpacity="0" />
            <stop offset="1" stopColor="#fff2c2" stopOpacity=".78" />
          </linearGradient>
          <radialGradient id="lp-otvor" cx=".5" cy=".6" r=".6">
            <stop offset="0" stopColor="#fffbe6" />
            <stop offset=".6" stopColor="#ffd684" />
            <stop offset="1" stopColor="#d9912e" />
          </radialGradient>
          <radialGradient id="lp-zar">
            <stop offset="0" stopColor="#fff6dc" stopOpacity=".9" />
            <stop offset=".35" stopColor="#ffc24a" stopOpacity=".4" />
            <stop offset="1" stopColor="#ff8a1e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lp-plamen" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".5" stopColor="#ffd56a" />
            <stop offset="1" stopColor="#ff8f24" />
          </linearGradient>
        </defs>
      </svg>

      {/* daleki lampioni koji se dižu iz polja */}
      <div className="lp-daleki" aria-hidden="true">
        {DALEKI.map((stil, i) => (
          <i key={i} style={vars(stil)} />
        ))}
      </div>

      <div className="w lp-in">
        <header className="lp-glava sredina">
          <p className="oz" data-reveal>
            Blog
          </p>
          <Naslov>{"Iz obiteljskog *polja*"}</Naslov>
        </header>

        <Link className="lp-glavni" href={`/blog/${glavni.slug}`} data-reveal>
          <span className="lp-lebdi">
            <Lampion slika={glavni.slika} velik sizes="(max-width: 900px) 70vw, 340px" />
          </span>
          <span className="lp-glavni-tekst">
            <span className="lp-kat">
              {glavni.kategorija} · {glavni.datumTekst}
            </span>
            <h3>{glavni.naslov}</h3>
            <span className="lp-sazetak">{glavni.sazetak}</span>
            {glavni.citat && <span className="lp-citat">„{glavni.citat}”</span>}
            <span className="link">
              Čitajte dalje{" "}
              <span className="str" aria-hidden="true">
                →
              </span>
            </span>
          </span>
        </Link>

        <div className="lp-red">
          {ostali.map((c, i) => (
            <Link className="lp-clanak" key={c.slug} href={`/blog/${c.slug}`} data-reveal style={kas(i * 0.12)}>
              <span className="lp-lebdi">
                <Lampion slika={c.slika} sizes="200px" i={i + 1} />
              </span>
              <span className="lp-nit" aria-hidden="true" />
              <span className="lp-njih" style={vars({ "--t": `${4.6 + (i % 3) * 0.9}s`, "--d": `${-i * 1.3}s` })}>
                <span className="lp-cedulja">
                  <span className="lp-kat">{c.kategorija}</span>
                  <h3>{c.naslov}</h3>
                  <span className="lp-dat">{c.datumTekst}</span>
                </span>
              </span>
            </Link>
          ))}
        </div>

        <p className="red lp-svi" data-reveal>
          <Link className="link" href="/blog">
            Svi tekstovi{" "}
            <span className="str" aria-hidden="true">
              →
            </span>
          </Link>
        </p>
      </div>

    </>
  );
}

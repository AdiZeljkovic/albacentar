import type { ReactNode } from "react";
import Image from "next/image";
import { cx, vars } from "@/lib/util";

/**
 * Lampion s bloga: isti papirnati lampion kao na naslovnici (pocetna/Lampioni.tsx), ovdje kao
 * zaseban dio da ga mogu koristiti i popis tekstova i članak. Slika teksta svijetli kroz papir,
 * volumen daju sjene uz bokove i svjetlo plamena odozdo, a papir ima nabore, šavove i zrno.
 * Svi id-ovi u crtežu počinju s „bl-". `LampionCrtezi` mora biti jednom na stranici.
 */

/** Obris papirnatog tijela (crtež 200 × 270; tijelo zauzima gornjih 240). */
const TIJELO = "M30 78 C30 34 60 12 100 12 C140 12 170 34 170 78 C170 128 158 186 146 228 L54 228 C42 186 30 128 30 78Z";
/** Isti obris za male lampione u daljini (crtež 40 × 56). */
const MALO = "M6 15.6 C6 6.8 12 2.4 20 2.4 C28 2.4 34 6.8 34 15.6 C34 25.6 31.6 37.2 29.2 45.6 L10.8 45.6 C8.4 37.2 6 25.6 6 15.6Z";

/** Zajednički prijelazi boja, oblik za izrezivanje i mali lampion (`<use href="#bl-mali">`). */
export function LampionCrtezi() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        {/* oblik lampiona u mjerama okvira (0–1), da ga CSS može primijeniti na bilo koju veličinu */}
        <clipPath id="bl-oblik" clipPathUnits="objectBoundingBox">
          <path d="M.15 .325 C.15 .1417 .30 .05 .50 .05 C.70 .05 .85 .1417 .85 .325 C.85 .5333 .79 .775 .73 .95 L.27 .95 C.21 .775 .15 .5333 .15 .325Z" />
        </clipPath>
        <linearGradient id="bl-rub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8652a" />
          <stop offset="1" stopColor="#ffe9b8" />
        </linearGradient>
        <linearGradient id="bl-bokovi" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a1606" stopOpacity=".62" />
          <stop offset=".26" stopColor="#3a1606" stopOpacity="0" />
          <stop offset=".74" stopColor="#3a1606" stopOpacity="0" />
          <stop offset="1" stopColor="#3a1606" stopOpacity=".62" />
        </linearGradient>
        <linearGradient id="bl-odozdo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c1004" stopOpacity=".5" />
          <stop offset=".4" stopColor="#2c1004" stopOpacity="0" />
          <stop offset=".62" stopColor="#ffe6a6" stopOpacity="0" />
          <stop offset="1" stopColor="#fff2c2" stopOpacity=".78" />
        </linearGradient>
        {/* svjetlo plamena koje se odozdo širi po papiru i lagano diše */}
        <radialGradient id="bl-dah" gradientUnits="userSpaceOnUse" cx="100" cy="236" r="118" gradientTransform="translate(0 236) scale(1 1.25) translate(0 -236)">
          <stop offset="0" stopColor="#fff6cc" stopOpacity=".62" />
          <stop offset=".5" stopColor="#ffe2a0" stopOpacity=".2" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bl-otvor" cx=".5" cy=".6" r=".6">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset=".6" stopColor="#ffd684" />
          <stop offset="1" stopColor="#d9912e" />
        </radialGradient>
        <radialGradient id="bl-zar">
          <stop offset="0" stopColor="#fff6dc" stopOpacity=".9" />
          <stop offset=".35" stopColor="#ffc24a" stopOpacity=".4" />
          <stop offset="1" stopColor="#ff8a1e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bl-plamen" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".5" stopColor="#ffd56a" />
          <stop offset="1" stopColor="#ff8f24" />
        </linearGradient>
        {/* mali lampion: papir taman pri vrhu, a dolje obasjan plamenom */}
        <linearGradient id="bl-mali-papir" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a64d17" />
          <stop offset=".45" stopColor="#e88f34" />
          <stop offset=".82" stopColor="#ffd27c" />
          <stop offset="1" stopColor="#fff0bc" />
        </linearGradient>
        <linearGradient id="bl-mali-bokovi" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a1c06" stopOpacity=".6" />
          <stop offset=".3" stopColor="#4a1c06" stopOpacity="0" />
          <stop offset=".72" stopColor="#4a1c06" stopOpacity="0" />
          <stop offset="1" stopColor="#4a1c06" stopOpacity=".6" />
        </linearGradient>
        <symbol id="bl-mali" viewBox="0 0 40 56">
          <path d={MALO} fill="url(#bl-mali-papir)" />
          <path d={MALO} fill="url(#bl-mali-bokovi)" />
          <path d="M20 2.4 C19.2 16 19.2 32 20 45.6 M13.6 4 C10.6 16 12 34 15.8 45.6 M26.4 4 C29.4 16 28 34 24.2 45.6" fill="none" stroke="#5a2408" strokeWidth=".5" opacity=".4" />
          <ellipse cx="20" cy="45.6" rx="9.2" ry="1.5" fill="#fff3c8" />
          <path d="M20 43 C22.2 46 22 49.4 20 50.4 C18 49.4 17.8 46 20 43Z" fill="#fffbe8" />
        </symbol>
      </defs>
    </svg>
  );
}

type Props = {
  slika: string;
  alt?: string;
  velik?: boolean;
  sizes: string;
  /** Redni broj: pomiče ritam lebdenja da se lampioni ne njišu zajedno. */
  i?: number;
  /** Dodatna klasa na papirnatom tijelu (postojeće klase stranice: objava-slika, blog-sl...). */
  klasaTijela?: string;
  /** Što stoji u tijelu kad tekst nema sliku. */
  children?: ReactNode;
};

export default function Lampion({ slika, alt = "", velik, sizes, i = 0, klasaTijela, children }: Props) {
  return (
    <span className={cx("bl-lampion", velik && "velik")} style={vars({ "--t": `${6.5 + (i % 3) * 1.3}s`, "--d": `${-i * 1.7}s` })}>
      <span className="bl-l-sjaj" />
      <span className="bl-l-sjaj jaci" />
      <span className={cx("bl-l-tijelo", klasaTijela)}>
        {slika ? <Image src={slika} alt={alt} fill sizes={sizes} /> : children}
        <span className="bl-l-papir" />
      </span>
      <svg className="bl-l-okvir" viewBox="0 0 200 270" aria-hidden="true">
        {/* volumen: tamnije uz bokove i pri vrhu, a odozdo svjetlo plamena */}
        <path d={TIJELO} fill="url(#bl-bokovi)" />
        <path d={TIJELO} fill="url(#bl-odozdo)" />
        <path className="bl-l-dah" d={TIJELO} fill="url(#bl-dah)" />
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
          <path d={TIJELO} stroke="url(#bl-rub)" strokeWidth="1.3" />
        </g>
        {/* vrh */}
        <ellipse cx="100" cy="13.5" rx="24" ry="3.4" fill="#7a4a1c" opacity=".85" />
        <ellipse cx="100" cy="12.6" rx="15" ry="1.8" fill="#f6dba0" opacity=".5" />
        {/* otvor: obasjana unutrašnjost, obruč, žice i gorionik */}
        <ellipse cx="100" cy="228" rx="46" ry="6.5" fill="url(#bl-otvor)" />
        <ellipse cx="100" cy="228" rx="46" ry="6.5" fill="none" stroke="#b9853c" strokeWidth="2.2" />
        <path d="M55 229 Q100 222 145 229" fill="none" stroke="#fff0c0" strokeWidth=".8" opacity=".7" />
        <path d="M56 230 L100 241 L144 230 M100 234.4 L100 241" fill="none" stroke="#8a6a36" strokeWidth=".8" />
        <rect x="95.5" y="239" width="9" height="5" rx="1.4" fill="#4a3018" />
        <circle className="bl-l-zar" cx="100" cy="240" r="30" fill="url(#bl-zar)" />
        <g className="bl-l-plamen">
          <path d="M100 222 C109 232 108 243 100 246 C92 243 91 232 100 222Z" fill="url(#bl-plamen)" />
          <path d="M100 231 C104 236 103.6 242 100 244 C96.4 242 96 236 100 231Z" fill="#fffdf0" />
        </g>
      </svg>
    </span>
  );
}

/** Mali lampion u daljini: samo obris, papir i plamen. */
export function MaliLampion({ className, stil }: { className?: string; stil?: Record<string, string | number> }) {
  return (
    <i className={className} style={stil ? vars(stil) : undefined}>
      <svg viewBox="0 0 40 56">
        <use href="#bl-mali" />
      </svg>
    </i>
  );
}

import { ISKRA } from "@/lib/zvijezda";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Naslov from "@/components/Naslov";
import Ornament from "@/components/Ornament";
import { naciniRada } from "@/content/rad";
import { kas, vars } from "@/lib/util";

/**
 * Načini rada: podnožje brda, noću. Korijenje stabla života iz sekcije iznad spušta se kroz zemlju,
 * skuplja u jednu žilu i grana prema četvorim vratima. Svjetlo iz stabla teče niz korijenje i pali
 * svjetiljku nad svakim vratima; iza svakih vrata je jedan prostor za rad, obasjan iznutra.
 * Vrata se otvore kad uđu u ekran (ne prate skrol), a svjetlo, iskre i magla žive sami.
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


/** Žila srčanica: tri niti koje se s vrha sekcije spuštaju i spliću u jedan čvor. */
const ZILA = [
  "M69 0 C54 28 70 56 60 84 C56 96 60 104 60 112",
  "M34 0 C46 26 30 50 46 72 C56 86 60 98 60 112",
  "M86 0 C74 26 90 50 74 72 C64 86 60 98 60 112",
];

/** Četiri grane od čvora ispod naslova do svjetiljki nad vratima (sredine stupaca mreže). */
const GRANE = [
  "M620 0 C616 46 300 14 214 62 C172 86 155 108 155 132",
  "M620 0 C618 40 520 34 488 70 C472 90 465 112 465 132",
  "M620 0 C622 40 720 34 752 70 C768 90 775 112 775 132",
  "M620 0 C624 46 940 14 1026 62 C1068 86 1085 108 1085 132",
];
/** Sitno korijenje koje se odvaja od grana. */
const ZILICE = [
  "M330 36 C300 52 286 74 290 100",
  "M250 50 C226 50 196 40 176 22",
  "M540 46 C528 66 532 88 522 106",
  "M910 36 C940 52 954 74 950 100",
  "M990 50 C1014 50 1044 40 1064 22",
  "M700 46 C712 66 708 88 718 106",
  "M620 0 C614 30 628 52 620 78",
];


export default function NaciniRada() {
  return (
    <div className="w dv-in">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="dv-zlato" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3cf" />
            <stop offset=".3" stopColor="#e2c487" />
            <stop offset="1" stopColor="#8f6d2f" />
          </linearGradient>
          <radialGradient id="dv-lampa">
            <stop offset="0" stopColor="#fff6dc" stopOpacity=".95" />
            <stop offset=".3" stopColor="#f6d38f" stopOpacity=".5" />
            <stop offset="1" stopColor="#e2a04e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dv-zila-nit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9b56f" stopOpacity="0" />
            <stop offset=".55" stopColor="#d9b56f" stopOpacity=".7" />
            <stop offset="1" stopColor="#f0d79f" />
          </linearGradient>
        </defs>
      </svg>

      {/* korijenje se s vrha skuplja u jednu žilu */}
      <div className="dv-zila" aria-hidden="true">
        <svg viewBox="0 0 120 112" preserveAspectRatio="xMidYMax meet">
          <g fill="none" stroke="url(#dv-zila-nit)" strokeWidth="1.2" strokeLinecap="round">
            {ZILA.map((d, i) => (
              <path key={d} d={d} stroke={i === 0 ? "#dcb970" : undefined} opacity={i === 0 ? 0.75 : undefined} />
            ))}
          </g>
          <g className="polje-komete" fill="none" strokeLinecap="round">
            {ZILA.map((d, i) => (
              <Kometa key={d} d={d} kasni={i * 1.1} traje={3.3} />
            ))}
          </g>
        </svg>
        <i className="dv-cvor" />
      </div>

      <header className="dv-glava sredina">
        <p className="oz" data-reveal>
          Načini rada
        </p>
        <Naslov>{"Svaka priča zaslužuje *svoj prostor.*"}</Naslov>
        <p className="mut uvod" data-reveal style={kas(0.25)}>
          Ne dolazimo svi s istim pitanjima i ne trebamo svi isti način rada. Zato AlBa Centar predviđa više oblika
          susreta, ovisno o temi, željama i mogućnostima sudionika.
        </p>
      </header>

      <div className="dveri" id="dveri">
        {/* čvor iz kojeg se korijenje grana prema četvorim vratima */}
        <i className="dv-cvor dv-cvor-donji" aria-hidden="true" />
        <svg className="dv-grane" viewBox="0 0 1240 132" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" stroke="#d9b56f" strokeLinecap="round">
            {GRANE.map((d) => (
              <path key={d} d={d} strokeWidth="1.3" opacity=".7" />
            ))}
            {ZILICE.map((d) => (
              <path key={d} d={d} strokeWidth=".9" opacity=".36" />
            ))}
          </g>
          <g className="polje-komete" fill="none" strokeLinecap="round">
            {GRANE.map((d, i) => (
              <Kometa key={d} d={d} kasni={[0.6, 0, 1.2, 1.8][i]} traje={4.2} />
            ))}
          </g>
        </svg>

        {naciniRada.map((n, i) => (
          <article className="dver" key={n.id} data-reveal style={kas(0.1 + i * 0.16)}>
            {/* na užim ekranima nema zajedničkih grana, pa svaka vrata imaju svoju žilicu */}
            <svg className="dver-zilica" viewBox="0 0 40 70" aria-hidden="true">
              <path d="M20 0 C12 18 28 34 20 52 C18 60 20 64 20 70" fill="none" stroke="url(#dv-zila-nit)" strokeWidth="1.2" strokeLinecap="round" />
              <g className="polje-komete" fill="none" strokeLinecap="round">
                <Kometa d="M20 0 C12 18 28 34 20 52 C18 60 20 64 20 70" kasni={i * 0.7} traje={2.8} />
              </g>
            </svg>

            <Link className="dver-okvir" href={n.href} aria-label={n.naziv}>
              <span className="dver-sjaj" />
              <span className="dver-prostor">
                <Image src={n.prizor} alt="" fill sizes="(max-width: 640px) 64vw, (max-width: 1040px) 36vw, 250px" />
                <span className="dver-zrake" />
                <span className="dver-prah">
                  {[0, 1, 2, 3, 4, 5].map((k) => (
                    <i key={k} style={vars({ "--x": `${12 + ((k * 37 + i * 13) % 76)}%`, "--t": `${7 + ((k * 3 + i) % 5)}s`, "--d": `${-((k * 1.9 + i * 0.7) % 9)}s`, "--dx": `${((k * 29) % 40) - 20}px` })} />
                  ))}
                </span>
                <span className="dver-krilo l">
                  <i />
                </span>
                <span className="dver-krilo d">
                  <i />
                </span>
              </span>
              <svg className="dver-luk" viewBox="0 0 300 440">
                <g fill="none" stroke="url(#dv-zlato)">
                  <path d="M22 424 L22 150 A128 128 0 0 1 278 150 L278 424" strokeWidth="1.6" />
                  <path d="M13 424 L13 150 A137 137 0 0 1 287 150 L287 424" strokeWidth=".6" opacity=".6" />
                  <path className="dver-dovratak" d="M30 420 L30 150 A120 120 0 0 1 270 150 L270 420" strokeWidth="1.1" />
                  <path d="M17.5 150 A132.5 132.5 0 0 1 282.5 150" pathLength={180} strokeWidth="6" strokeDasharray="0.5 5.5" strokeDashoffset="0.25" opacity=".6" />
                  <path d="M6 150 L26 150 M274 150 L294 150" strokeWidth="1.4" />
                  <path d="M4 424 L296 424" strokeWidth="1.4" />
                  <path d="M0 432 L300 432" strokeWidth=".6" opacity=".5" />
                </g>
                {/* svjetiljka u tjemenu luka: u nju se ulijeva svjetlo iz korijenja */}
                <g className="dver-lampa">
                  <circle cx="150" cy="18" r="34" fill="url(#dv-lampa)" />
                  <g transform="translate(150 18)">
                    <path className="polje-iskra" style={vars({ "--d": `${i * 0.8}s` })} d={ISKRA} fill="#fff3d0" />
                  </g>
                  <path d="M150 6 L158 18 L150 30 L142 18Z" fill="none" stroke="#f6dba0" strokeWidth=".9" />
                </g>
              </svg>
            </Link>

            <div className="dver-tekst">
              <span className="dver-pod" aria-hidden="true" />
              <p className="vrata-oz">{n.oznaka}</p>
              <h3>{n.naziv}</h3>
              <p className="mut">{n.opis}</p>
              <p className="red">
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

      <div className="povjerljivo" data-reveal>
        <Ornament />
        <p>
          Sve što se iznese ostaje u intimi konstelacije. Čuva se svaka riječ izrečena među predstavnicima, s punim
          poštovanjem i povjerljivošću.
        </p>
      </div>
    </div>
  );
}

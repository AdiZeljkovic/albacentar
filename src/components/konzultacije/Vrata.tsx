import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ISKRA } from "@/lib/zvijezda";
import { cx, vars } from "@/lib/util";

/**
 * Vrata svjetla s naslovnice, za unutarnje stranice: zlatni luk sa svjetiljkom u tjemenu, dva krila
 * koja se otvore prema unutra kad vrata uđu u ekran i slika obasjana iznutra, s prahom u svjetlu.
 * Veličinu određuje CSS varijabla --dv (širina vrata) na nekom od roditelja.
 *
 * Okidač je prazan element ispred vrata (data-reveal), a ne omot oko njih: prozirnost nad
 * prizorom s perspektivom trza pri prvom crtanju.
 */

/** Slikarska djela iza vrata (javno vlasništvo); potpis se ispisuje pod vratima. */
export const DJELA: Record<string, string> = {
  "/img/vrata-dvojica.jpg": "C. D. Friedrich, Dvojica muškaraca promatraju mjesec, oko 1820.",
  "/img/vrata-krug.jpg": "P. S. Krøyer, Ivanjski krijes na plaži u Skagenu, 1906.",
  "/img/vrata-pismo.jpg": "J. Vermeer, Djevojka čita pismo kraj otvorenog prozora, oko 1658.",
  "/img/vrata-nebo.jpg": "V. van Gogh, Zvjezdana noć, 1889.",
};

/** Zajednički gradijenti za vrata i korijenje. Na stranici smiju stajati samo jednom. */
export function VrataDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="kz-zlato" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3cf" />
          <stop offset=".3" stopColor="#e2c487" />
          <stop offset="1" stopColor="#8f6d2f" />
        </linearGradient>
        <linearGradient id="kz-zlato-dan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d2a85a" />
          <stop offset=".35" stopColor="#b88a3e" />
          <stop offset="1" stopColor="#7a5a1c" />
        </linearGradient>
        <radialGradient id="kz-lampa">
          <stop offset="0" stopColor="#fff6dc" stopOpacity=".95" />
          <stop offset=".3" stopColor="#f6d38f" stopOpacity=".5" />
          <stop offset="1" stopColor="#e2a04e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="kz-nit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9b56f" stopOpacity="0" />
          <stop offset=".55" stopColor="#d9b56f" stopOpacity=".7" />
          <stop offset="1" stopColor="#f0d79f" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Svjetlo koje putuje po liniji (iste klase kao u herou naslovnice). */
export function Kometa({ d, kasni, traje }: { d: string; kasni: number; traje: number }) {
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

type Props = {
  slika: string;
  /** Redni broj vrata: pomiče kašnjenja, pa se vrata ne otvaraju i ne trepere u isti mah. */
  i?: number;
  sizes: string;
  /** Danja inačica: vrata stoje na svijetloj podlozi, pa je zlato tamnije, a sjaj tiši. */
  dan?: boolean;
  href?: string;
  naziv?: string;
  className?: string;
};

export default function Vrata({ slika, i = 0, sizes, dan = false, href, naziv, className }: Props) {
  const zlato = `url(#${dan ? "kz-zlato-dan" : "kz-zlato"})`;
  const sadrzaj = (
    <>
      <span className="kzv-sjaj" />
      <span className="kzv-prostor">
        <Image src={slika} alt="" fill sizes={sizes} />
        <span className="kzv-svjetlo" />
        <span className="kzv-prah">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
            <i
              key={k}
              style={vars({
                "--x": `${10 + ((k * 37 + i * 13) % 80)}%`,
                "--t": `${7 + ((k * 3 + i) % 6)}s`,
                "--kd": `${-((k * 1.9 + i * 0.7) % 9)}s`,
                "--dx": `${((k * 29 + i * 7) % 44) - 22}px`,
                "--v": `${2 + ((k * 5 + i) % 3) * 0.7}px`,
              })}
            />
          ))}
        </span>
        <span className="kzv-krilo l">
          <b />
          <i />
        </span>
        <span className="kzv-krilo d">
          <b />
          <i />
        </span>
      </span>
      <svg className="kzv-luk" viewBox="0 0 300 440">
        <g fill="none" stroke={zlato}>
          <path d="M22 424 L22 150 A128 128 0 0 1 278 150 L278 424" strokeWidth="1.6" />
          <path d="M13 424 L13 150 A137 137 0 0 1 287 150 L287 424" strokeWidth=".6" opacity=".6" />
          <path d="M30 420 L30 150 A120 120 0 0 1 270 150 L270 420" strokeWidth="1.1" />
          {/* vijenac od sitnih crtica između dva luka */}
          <path d="M17.5 150 A132.5 132.5 0 0 1 282.5 150" pathLength={180} strokeWidth="6" strokeDasharray="0.5 5.5" strokeDashoffset="0.25" opacity=".6" />
          {/* kapiteli na peti luka i pragovi */}
          <path d="M5 150 L27 150 M273 150 L295 150" strokeWidth="1.5" />
          <path d="M8 156 L24 156 M276 156 L292 156" strokeWidth=".7" opacity=".7" />
          <path d="M4 424 L296 424" strokeWidth="1.4" />
          <path d="M-4 432 L304 432" strokeWidth=".7" opacity=".55" />
          <path d="M-12 439.5 L312 439.5" strokeWidth=".5" opacity=".3" />
        </g>
        {/* svjetiljka u tjemenu luka: u nju se ulijeva svjetlo iz korijenja */}
        <g className="kzv-lampa">
          <circle cx="150" cy="18" r="34" fill="url(#kz-lampa)" />
          <g transform="translate(150 18)">
            <path className="polje-iskra" style={vars({ "--d": `${i * 0.8}s` })} d={ISKRA} fill={dan ? "#b88a3e" : "#fff3d0"} />
          </g>
          <path d="M150 6 L158 18 L150 30 L142 18Z" fill="none" stroke={dan ? "#b88a3e" : "#f6dba0"} strokeWidth=".9" />
        </g>
      </svg>
    </>
  );

  const klase = cx("kzv", dan && "kzv-dan", className);
  const stil = vars({ "--k": `${(i % 2) * 0.12}s` });
  return (
    <>
      <i className="kzv-okidac" data-reveal="blijedi" aria-hidden="true" />
      {href ? (
        <Link className={klase} href={href} aria-label={naziv} style={stil}>
          {sadrzaj}
        </Link>
      ) : (
        <span className={klase} style={stil} aria-hidden="true">
          {sadrzaj}
        </span>
      )}
    </>
  );
}

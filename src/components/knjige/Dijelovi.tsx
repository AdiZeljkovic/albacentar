import type { CSSProperties } from "react";
import { vars } from "@/lib/util";

/** Sitni dijelovi koje dijele prizori stranica Knjige i Pratnja. */

/** Svjetlo koje putuje po liniji: tri sloja iste kretnje (klase iz heroa naslovnice). */
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

/** Ptica u letu: dva krila koja mašu. Let zadaje klasa i CSS varijable u `stil`. */
export function Ptica({ klasa, stil, boja = "#fff1c8" }: { klasa: string; stil: Record<string, string | number>; boja?: string }) {
  return (
    <svg className={klasa} viewBox="-13 -9 26 18" style={vars(stil)} aria-hidden="true">
      <g className="knj-krila" fill="none" stroke={boja} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 1 Q-5 -7 -12 -3" />
        <path d="M0 1 Q5 -7 12 -3" />
      </g>
    </svg>
  );
}

/**
 * Svijeća na tanjuriću, s plamenom koji treperi. Mjere su u jedinici --u prizora u kojem stoji.
 * `id` dobiva plamen, da pozadina (Odaja) zna odakle dolazi svjetlo.
 */
export function Svijeca({ id, className }: { id?: string; className?: string }) {
  return (
    <div className={className ? `kg-svijeca ${className}` : "kg-svijeca"} aria-hidden="true">
      <i className="kg-zar" />
      <i className="kg-plamen" id={id}>
        <i />
      </i>
      <i className="kg-stijenj" />
      <i className="kg-vosak" />
      <i className="kg-tanjur" />
    </div>
  );
}

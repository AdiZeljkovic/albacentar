"use client";

import { useState, type CSSProperties } from "react";

type Props = {
  misli: string[];
  /** Redni broj današnje misli na popisu. */
  danasnja: number;
  dan: number;
  mjesec: string;
  /** Mjesec kao broj, 1–12. */
  mjesecBroj: number;
  godina: number;
};

/**
 * Misao dana kao list iz almanaha: brojčanik mjeseca s današnjim danom, velika rečenica koja se otkriva
 * riječ po riječ i strelice kojima se mogu prelistati i ostale misli.
 */
const DANI = ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"];
const z = (n: number) => +n.toFixed(1);
/** Točka na polumjeru r pod kutom u stupnjevima, oko središta brojčanika (110, 110). */
const tocka = (r: number, kut: number): [number, number] => {
  const a = (kut * Math.PI) / 180;
  return [z(110 + r * Math.cos(a)), z(110 + r * Math.sin(a))];
};
/** Kut crtice za dan d u mjesecu s n dana; prvi dan je odmah desno od vrha. */
const kutDana = (d: number, n: number) => -90 + ((d - 0.5) * 360) / n;
const luk = (r: number, od: number, doKuta: number) => {
  const [x1, y1] = tocka(r, od);
  const [x2, y2] = tocka(r, doKuta);
  return `M${x1} ${y1} A${r} ${r} 0 ${doKuta - od > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};

export default function MisaoDana({ misli, danasnja, dan, mjesec, mjesecBroj, godina }: Props) {
  const danaUMjesecu = new Date(Date.UTC(godina, mjesecBroj, 0)).getUTCDate();
  const danUTjednu = DANI[new Date(Date.UTC(godina, mjesecBroj - 1, dan)).getUTCDay()];
  const [i, setI] = useState(danasnja);
  const ukupno = misli.length;
  const korak = (d: number) => setI((x) => (x + d + ukupno) % ukupno);
  const jeDanasnja = i === danasnja;

  return (
    <>
      {/* brojčanik mjeseca: po jedna crtica za svaki dan, prošli dani su zlatni, a današnji nosi svjetlo */}
      <div className="misao-brojcanik" data-reveal>
        <svg viewBox="0 0 220 220" aria-hidden="true">
          <defs>
            <radialGradient id="md-podloga" cx=".5" cy=".42" r=".62">
              <stop offset="0" stopColor="#27315f" stopOpacity=".78" />
              <stop offset="1" stopColor="#0d1228" stopOpacity=".86" />
            </radialGradient>
            <linearGradient id="md-metal" x1=".1" y1="0" x2=".9" y2="1">
              <stop offset="0" stopColor="#fff3cf" />
              <stop offset=".3" stopColor="#dcb970" />
              <stop offset=".62" stopColor="#8f6d2f" />
              <stop offset="1" stopColor="#d9b56f" />
            </linearGradient>
            <radialGradient id="md-svjetlo">
              <stop offset="0" stopColor="#fffaea" />
              <stop offset=".3" stopColor="#ffe2a8" stopOpacity=".7" />
              <stop offset="1" stopColor="#ffe2a8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="110" cy="110" r="104" fill="url(#md-podloga)" stroke="url(#md-metal)" strokeWidth="1.3" />
          <circle cx="110" cy="110" r="98.5" fill="none" stroke="#d9b56f" strokeWidth=".5" opacity=".45" />
          <circle cx="110" cy="110" r="64" fill="none" stroke="#d9b56f" strokeWidth=".5" strokeDasharray="0.6 4" strokeLinecap="round" opacity=".5" />
          {/* prijeđeni dio mjeseca */}
          <path className="md-luk" pathLength={1} d={luk(95, -90, kutDana(dan, danaUMjesecu))} fill="none" stroke="#e9cd92" strokeWidth="1.5" strokeLinecap="round" />
          {Array.from({ length: danaUMjesecu }, (_, k) => {
            const d = k + 1;
            const kut = kutDana(d, danaUMjesecu);
            const danas = d === dan;
            const [x1, y1] = tocka(danas ? 76 : d < dan ? 82 : 85, kut);
            const [x2, y2] = tocka(danas ? 91 : d < dan ? 90 : 89, kut);
            return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke={danas ? "#fff6dc" : "#d9b56f"} strokeWidth={danas ? 1.8 : 1} strokeLinecap="round" opacity={danas ? 1 : d < dan ? 0.8 : 0.28} />;
          })}
          {[5, 10, 15, 20, 25, 30]
            .filter((d) => d <= danaUMjesecu)
            .map((d) => {
              const [x, y] = tocka(71, kutDana(d, danaUMjesecu));
              return (
                <text key={d} className="md-broj" x={x} y={y + 2.4} textAnchor="middle" opacity={d <= dan ? 0.9 : 0.4}>
                  {d}
                </text>
              );
            })}
          {/* današnji dan */}
          <g transform={`translate(${tocka(95, kutDana(dan, danaUMjesecu)).join(" ")})`}>
            <circle className="md-sjaj" r="13" fill="url(#md-svjetlo)" />
            <circle r="3.1" fill="#fffaea" />
          </g>
          <text className="md-tjedan" x="110" y="83" textAnchor="middle">
            {danUTjednu.toUpperCase()}
          </text>
          <path d="M94 91 H126" stroke="#d9b56f" strokeWidth=".6" opacity=".7" />
          <text className="md-dan" x="110" y="134" textAnchor="middle">
            {dan}
          </text>
          <text className="md-mjesec" x="110" y="151" textAnchor="middle">
            {mjesec.toUpperCase()}
          </text>
          <text className="md-godina" x="110" y="163" textAnchor="middle">
            {godina}
          </text>
        </svg>
      </div>

      <p className="misao-oznaka" data-reveal>
        <i aria-hidden="true" />
        {jeDanasnja ? "Misao dana" : "Iz naših tekstova"}
        <i aria-hidden="true" />
      </p>

      <blockquote className="misao-citat" key={i} data-reveal="rijeci" aria-live="polite">
        <span className="misao-navodnik" aria-hidden="true">
          „
        </span>
        {misli[i].split(" ").map((rijec, k) => (
          <span key={k} className="misao-rijec" style={{ "--i": k } as CSSProperties}>
            {rijec}{" "}
          </span>
        ))}
      </blockquote>

      <div className="misao-kontrole" data-reveal>
        <button type="button" onClick={() => korak(-1)} aria-label="Prethodna misao">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
        <span className="misao-brojac">
          {String(i + 1).padStart(2, "0")} <i>/</i> {String(ukupno).padStart(2, "0")}
        </span>
        <button type="button" onClick={() => korak(1)} aria-label="Sljedeća misao">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <p className="misao-pod" data-reveal>
        {jeDanasnja ? (
          "Nova misao svakog jutra."
        ) : (
          <button type="button" onClick={() => setI(danasnja)}>
            Natrag na današnju misao
          </button>
        )}
      </p>
    </>
  );
}

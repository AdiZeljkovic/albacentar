import Knjiga3D from "@/components/Knjiga3D";
import Nagib from "@/components/Nagib";
import Naslov from "@/components/Naslov";
import Zvijezde from "@/components/Zvijezde";
import { knjige } from "@/content/knjige";
import { kas, vars } from "@/lib/util";
import { ISKRA } from "@/lib/zvijezda";
import { Kometa } from "./Dijelovi";
import type { Tocka } from "./korijen";

/**
 * „Nevidljive niti": crtež s korica knjige (niti koje se skupljaju u jednu točku) raste u cijelo nebo.
 * Šest zvijezda su teme koje knjižica obrađuje, a od svake do knjige vodi nit koja se gotovo ne vidi
 * dok je svjetlo ne dotakne. Niti se pale i gase same; nit zvijezde iznad koje je pokazivač ostaje upaljena.
 */

/** Teme iz opisa knjižice, kao natpisi uz zvijezde. */
const TEME = ["pripadnost", "isključeni članovi", "obiteljske tajne", "gubici", "ponavljajući obrasci", "roditelji i djeca"];

type Raspored = {
  id: string;
  sirina: number;
  visina: number;
  /** Točka u kojoj se niti skupljaju, tik iznad knjige. */
  cvor: Tocka;
  /** Šest velikih zvijezda, redom kao TEME. */
  zvijezde: Tocka[];
  /** Male zvijezde bez natpisa (preci) i veze među zvijezdama: [od, do] kao indeksi; 0–5 velike, 6+ male. */
  male: Tocka[];
  veze: Array<[number, number]>;
  /** Koliko nit „visi": pomak upravljačkih točaka. */
  pad: number;
  slova: number;
};

const SIROKO: Raspored = {
  id: "kg-ns",
  sirina: 1240,
  visina: 400,
  cvor: [955, 352],
  zvijezde: [[120, 162], [318, 62], [566, 238], [712, 58], [1005, 118], [1140, 250]],
  male: [[48, 70], [215, 240], [428, 128], [618, 118], [838, 190], [872, 30], [1108, 26], [1218, 128]],
  veze: [[0, 6], [0, 7], [0, 1], [1, 8], [8, 2], [2, 9], [9, 3], [3, 11], [3, 10], [10, 4], [4, 12], [4, 5], [5, 13]],
  pad: 110,
  slova: 12.5,
};
const USKO: Raspored = {
  id: "kg-nu",
  sirina: 340,
  visina: 372,
  cvor: [170, 352],
  zvijezde: [[64, 150], [86, 52], [72, 250], [250, 44], [262, 146], [264, 246]],
  male: [[22, 98], [320, 94], [24, 206], [318, 196], [170, 22], [22, 304], [320, 300]],
  veze: [[0, 1], [1, 6], [0, 8], [8, 2], [3, 7], [7, 4], [4, 9], [9, 5], [1, 10], [10, 3], [2, 11], [5, 12]],
  pad: 0,
  slova: 9.6,
};

/**
 * Nit od zvijezde do čvora: spušta se iz zvijezde, visi i u čvor ulazi odozgo.
 * Na uskom crtežu (pad 0) nit prvo krene prema sredini pa se spušta, da natpisi sa strane ostanu čisti.
 */
function nit([x, y]: Tocka, [cx, cy]: Tocka, pad: number) {
  const dx = cx - x;
  if (!pad) return `M${x} ${y} C${(x + dx * 0.94).toFixed(0)} ${y + 4} ${cx} ${cy - 130} ${cx} ${cy}`;
  return `M${x} ${y} C${(x + dx * 0.25).toFixed(0)} ${y + pad} ${(cx - dx * 0.22).toFixed(0)} ${cy - pad * 1.1} ${cx} ${cy}`;
}

function Zvijezdje({ r }: { r: Raspored }) {
  const sve = [...r.zvijezde, ...r.male];
  // na uskom crtežu zvijezde su nešto manje
  const m = r === USKO ? 0.8 : 1;
  return (
    <svg className={`kg-zvijezdje ${r === SIROKO ? "siroko" : "usko"}`} viewBox={`0 0 ${r.sirina} ${r.visina}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${r.id}-sjaj`}>
          <stop offset="0" stopColor="#ffe9b8" stopOpacity=".8" />
          <stop offset=".34" stopColor="#f0b860" stopOpacity=".22" />
          <stop offset="1" stopColor="#8f9be0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${r.id}-cvor`}>
          <stop offset="0" stopColor="#fff6d8" stopOpacity=".95" />
          <stop offset=".22" stopColor="#f6cf86" stopOpacity=".5" />
          <stop offset="1" stopColor="#f0b860" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* veze među zvijezdama: obitelj kao zviježđe */}
      <g fill="none" stroke="#b9c2f0" strokeWidth={0.7 * m} strokeDasharray="1 6" strokeLinecap="round" opacity=".5">
        {r.veze.map(([a, b]) => (
          <path key={`${a}-${b}`} d={`M${sve[a][0]} ${sve[a][1]} L${sve[b][0]} ${sve[b][1]}`} />
        ))}
      </g>
      {r.male.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r={7 * m} fill={`url(#${r.id}-sjaj)`} />
          <path className="polje-iskra" style={vars({ "--d": `${(i * 1.9) % 4.6}s` })} d={ISKRA} transform="scale(0.5)" fill="#e8ecff" />
        </g>
      ))}

      {/* šest tema: zvijezda, natpis i nit do čvora */}
      {r.zvijezde.map((z, i) => {
        const d = nit(z, r.cvor, r.pad);
        return (
          <g key={i} className="kg-clan" style={vars({ "--d": `${i * 1.5}s` })}>
            <path className="kg-nit" d={d} />
            <path className="kg-nit jaka" d={d} />
            <g className="polje-komete" fill="none" strokeLinecap="round">
              <Kometa d={d} kasni={1.2 + i * 1.5} traje={9} />
            </g>
            <g transform={`translate(${z[0]} ${z[1]})`}>
              <circle r={30 * m} fill="transparent" />
              <circle r={22 * m} fill={`url(#${r.id}-sjaj)`} />
              <path className="polje-iskra" style={vars({ "--d": `${i * 0.8}s` })} d={ISKRA} transform="scale(1.2)" fill="#fff3d0" />
              <circle className="kg-jezgra" r={2.4 * m} fill="#fffaea" />
              <text y={-24 * m} textAnchor="middle" style={{ fontSize: r.slova, letterSpacing: r.slova * 0.19 }}>
                {TEME[i]}
              </text>
            </g>
          </g>
        );
      })}

      {/* čvor: mjesto gdje sve niti ulaze u knjigu */}
      <g transform={`translate(${r.cvor[0]} ${r.cvor[1]})`}>
        <circle className="kg-cvor-sjaj" r={46 * m} fill={`url(#${r.id}-cvor)`} />
        <path d={ISKRA} transform={`scale(${1.7 * m})`} fill="#fff6d8" />
        <path className="kg-nit" d={`M0 0 L0 ${r.visina - r.cvor[1] + 30}`} style={{ opacity: 0.6 }} />
      </g>
    </svg>
  );
}

export default function Niti() {
  const k = knjige[1];
  return (
    <section className="kg-niti-sek noc" id={k.id}>
      <div className="kg-niti-nebo" aria-hidden="true">
        <Zvijezde gustoca={1.1} bogato />
      </div>
      <div className="w">
        <div className="kg-niti">
          <Zvijezdje r={SIROKO} />
          <div className="kg-niti-knjiga">
            <Zvijezdje r={USKO} />
            <Nagib className="kg-niti-okvir">
              <Knjiga3D naslov={k.naslov} podnaslov={k.podnaslov} korica={k.korica} />
            </Nagib>
          </div>
          <div className="kg-tekst">
            <p className="oz" data-reveal>
              {k.vrsta}
            </p>
            <Naslov>{k.naslov}</Naslov>
            <p className="kg-pod" data-reveal style={kas(0.15)}>
              {k.podnaslov}
            </p>
            <div className="proza" data-reveal style={kas(0.22)}>
              {k.uvod.map((u, j) => (
                <p key={u} className={j === 0 ? "uvod" : "mut"}>
                  {u}
                </p>
              ))}
            </div>
            <p className="kg-niti-kraj" data-reveal>
              {k.zakljucak}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

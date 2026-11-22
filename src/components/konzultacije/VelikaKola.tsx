import { ISKRA } from "@/lib/zvijezda";
import { kas, vars } from "@/lib/util";
import { Kometa } from "./Vrata";

/**
 * Teme razgovora kao Velika kola: sedam tema, sedam zvijezda. Dvije zadnje zvijezde kola na nebu
 * pokazuju Sjevernjaču, zvijezdu po kojoj se nalazi smjer; tako i razgovor služi snalaženju.
 * Zviježđe se iscrta kad uđe u ekran. Na uskim ekranima kola stoje uspravno, kako ih se vidi u proljeće.
 */

type Zvijezda = { x: number; y: number; p: string; v?: number };

/** Široki crtež 640 × 460: rudo lijevo, kola desno. `p` je položaj natpisa uz zvijezdu. */
const SIROKO: Zvijezda[] = [
  { x: 40, y: 296, p: "dolje-l" },
  { x: 152, y: 204, p: "gore" },
  { x: 250, y: 196, p: "dolje" },
  { x: 344, y: 222, p: "gore", v: 0.86 },
  { x: 366, y: 336, p: "dolje" },
  { x: 524, y: 362, p: "dolje" },
  { x: 552, y: 230, p: "unutra-d" },
];
const SJEVERNJACA_S = { x: 592, y: 40 };

/** Uspravni crtež 340 × 600: rudo gore, kola dolje. */
const USKO: Zvijezda[] = [
  { x: 54, y: 46, p: "desno" },
  { x: 116, y: 138, p: "desno" },
  { x: 128, y: 226, p: "desno" },
  { x: 142, y: 312, p: "lijevo", v: 0.86 },
  { x: 118, y: 462, p: "dolje-l" },
  { x: 250, y: 482, p: "dolje" },
  { x: 264, y: 330, p: "unutra-m" },
];
const SJEVERNJACA_U = { x: 286, y: 122 };

/** Redoslijed spajanja: rudo, pa kola ukrug. */
const SPOJ = [0, 1, 2, 3, 4, 5, 6, 3];

function Crtez({ zvijezde, sjevernjaca, sirina, visina, klasa, id }: { zvijezde: Zvijezda[]; sjevernjaca: { x: number; y: number }; sirina: number; visina: number; klasa: string; id: string }) {
  const tocke = SPOJ.map((k) => zvijezde[k]);
  const put = tocke.map((t, i) => `${i ? "L" : "M"}${t.x} ${t.y}`).join(" ");
  const merak = zvijezde[5];
  const dubhe = zvijezde[6];
  return (
    <svg className={`kz-kola-crtez ${klasa}`} viewBox={`0 0 ${sirina} ${visina}`} data-reveal="crta" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-sjaj`}>
          <stop offset="0" stopColor="#fff6dc" stopOpacity=".9" />
          <stop offset=".22" stopColor="#f6d79a" stopOpacity=".42" />
          <stop offset=".6" stopColor="#8fa0ff" stopOpacity=".1" />
          <stop offset="1" stopColor="#8fa0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* spojnice se iscrtaju jedna za drugom */}
      <g fill="none" stroke="#e2c487" strokeWidth="1" strokeLinecap="round" opacity=".62">
        {tocke.slice(1).map((t, i) => (
          <path key={i} className="kz-kola-crta" pathLength={1} d={`M${tocke[i].x} ${tocke[i].y} L${t.x} ${t.y}`} style={kas(0.3 + i * 0.32)} />
        ))}
      </g>
      {/* pokazivač: od zadnje dvije zvijezde kola prema Sjevernjači */}
      <path className="kz-kola-smjer" d={`M${dubhe.x + (dubhe.x - merak.x) * 0.14} ${dubhe.y + (dubhe.y - merak.y) * 0.14} L${sjevernjaca.x - (sjevernjaca.x - dubhe.x) * 0.1} ${sjevernjaca.y - (sjevernjaca.y - dubhe.y) * 0.1}`} fill="none" stroke="#e2c487" strokeWidth=".9" strokeDasharray="1.5 6" strokeLinecap="round" />
      <g className="polje-komete" fill="none" strokeLinecap="round">
        <Kometa d={put} kasni={3.4} traje={11} />
      </g>
      {zvijezde.map((z, i) => (
        <g key={i} transform={`translate(${z.x} ${z.y})`}>
          <circle className="kz-kola-dah" r={30 * (z.v ?? 1)} fill={`url(#${id}-sjaj)`} style={vars({ "--d": `${-i * 1.3}s` })} />
          <g transform={`scale(${1.75 * (z.v ?? 1)}) rotate(${((i * 23) % 30) - 15})`}>
            <path className="kz-kola-iskra" d={ISKRA} fill="#fff3d0" style={vars({ "--d": `${-i * 0.9}s` })} />
          </g>
        </g>
      ))}
      <g className="kz-kola-sjevernjaca" transform={`translate(${sjevernjaca.x} ${sjevernjaca.y})`}>
        <circle className="kz-kola-dah" r="46" fill={`url(#${id}-sjaj)`} />
        <g transform="scale(2.5)">
          <path className="kz-kola-iskra" d={ISKRA} fill="#fffaea" />
        </g>
      </g>
    </svg>
  );
}

export default function VelikaKola({ teme }: { teme: readonly string[] }) {
  return (
    <div className="kz-kola">
      <Crtez zvijezde={SIROKO} sjevernjaca={SJEVERNJACA_S} sirina={640} visina={460} klasa="siroko" id="kz-ks" />
      <Crtez zvijezde={USKO} sjevernjaca={SJEVERNJACA_U} sirina={340} visina={600} klasa="usko" id="kz-ku" />
      <ul className="kz-kola-teme" aria-label="Teme razgovora">
        {teme.slice(0, SIROKO.length).map((t, i) => (
          <li
            key={t}
            data-reveal="blijedi"
            data-p={SIROKO[i].p}
            data-m={USKO[i].p}
            style={vars({
              "--d": `${0.5 + i * 0.32}s`,
              "--x": `${(SIROKO[i].x / 640) * 100}%`,
              "--y": `${(SIROKO[i].y / 460) * 100}%`,
              "--mx": `${(USKO[i].x / 340) * 100}%`,
              "--my": `${(USKO[i].y / 600) * 100}%`,
            })}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

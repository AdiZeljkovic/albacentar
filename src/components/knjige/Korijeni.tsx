import type { ReactNode } from "react";
import Knjiga3D from "@/components/Knjiga3D";
import Nagib from "@/components/Nagib";
import Naslov from "@/components/Naslov";
import Ornament from "@/components/Ornament";
import Odaja from "@/components/pocetna/Odaja";
import { knjige } from "@/content/knjige";
import { kas, vars } from "@/lib/util";
import { ISKRA } from "@/lib/zvijezda";
import { Kometa, Ptica, Svijeca } from "./Dijelovi";
import { dlacice, doTocke, korijen, putanja, type Tocka } from "./korijen";

/**
 * „Korijeni i krila": čitaonica s naslovnice, ali izbliza. Knjiga stoji na stolu uz svijeću,
 * iz nje polijeću ptice (krila), a korijenje s naslovnice ovdje pratimo do kraja: raste kroz stol
 * u tamu ispod njega i na svakom vrhu nosi jednu od stvari koje će čitatelj u knjigu zapisati.
 * Svjetlo se tim korijenjem penje natrag u knjigu. Crtež korijenja je u mjerama 1240 × 650.
 */

/** Vrhovi korijenja, redom kojim se čita popis (slijeva nadesno, pa dublji red). */
const VRHOVI: Tocka[] = [
  [110, 215],
  [470, 235],
  [700, 190],
  [930, 240],
  [1130, 338],
  [250, 400],
  [520, 505],
  [760, 525],
  [990, 482],
];

/** Glavni korijeni: iz knjige ravno dolje, lijevo i dva duga nadesno. */
const SRCANI = korijen([[288, 0], [296, 70], [302, 150], [290, 235], [276, 310], [262, 362], VRHOVI[5]], 10, 1.3, 3);
const LIJEVI = korijen([[278, 0], [270, 44], [232, 92], [186, 140], [140, 186], VRHOVI[0]], 6, 1.1, 7);
const GORNJI = korijen(
  [[300, 0], [312, 40], [354, 74], [430, 92], [520, 104], [640, 112], [760, 122], [880, 140], [1000, 172], [1080, 228], [1120, 290], VRHOVI[4]],
  9,
  1.2,
  11,
);
const DONJI = korijen([[302, 150], [318, 250], [370, 340], [470, 400], [590, 424], [700, 440], [820, 452], [920, 462], VRHOVI[8]], 6.5, 1.1, 17);
/** Grane koje se spuštaju do preostalih vrhova. */
const GRANE = [
  korijen([[430, 92], [452, 140], [464, 190], VRHOVI[1]], 3.6, 0.9, 21),
  korijen([[640, 112], [668, 140], [690, 166], VRHOVI[2]], 3.2, 0.9, 23),
  korijen([[880, 140], [908, 176], [924, 210], VRHOVI[3]], 3.2, 0.9, 27),
  korijen([[470, 400], [496, 440], [512, 474], VRHOVI[6]], 3.2, 0.9, 31),
  korijen([[700, 440], [732, 472], [750, 500], VRHOVI[7]], 3, 0.9, 37),
];
/** Tanki korijeni bez natpisa, da crtež ne bude shema. */
const SITNI = [
  korijen([[290, 235], [252, 262], [224, 292], [206, 328]], 2.6, 0.6, 41),
  korijen([[232, 92], [196, 96], [150, 88], [104, 104], [70, 96]], 2.4, 0.6, 43),
  korijen([[590, 424], [622, 396], [664, 384], [702, 362]], 2.2, 0.6, 47),
  korijen([[1000, 172], [1052, 150], [1110, 156], [1168, 132]], 2.4, 0.6, 53),
  korijen([[820, 452], [858, 484], [872, 530], [900, 580]], 2.2, 0.6, 59),
  korijen([[276, 310], [300, 380], [330, 440], [338, 520], [362, 590]], 3, 0.6, 61),
  korijen([[520, 104], [548, 70], [590, 52], [626, 30]], 2, 0.5, 67),
  korijen([[354, 74], [372, 130], [366, 182], [384, 226]], 2.2, 0.6, 71),
];
const SVI = [SRCANI, LIJEVI, GORNJI, DONJI, ...GRANE, ...SITNI];
const DLACICE = [
  dlacice(SRCANI.put, 1, 8, 22),
  dlacice(LIJEVI.put, 2, 5, 18),
  dlacice(GORNJI.put, 3, 14, 20),
  dlacice(DONJI.put, 4, 11, 20),
  ...GRANE.map((g, i) => dlacice(g.put, 5 + i, 3, 14)),
  ...SITNI.map((g, i) => dlacice(g.put, 12 + i, 3, 13)),
].join("");

/** Putovi kojima se svjetlo penje od vrha do knjige. */
const obrnuto = (...dijelovi: Tocka[][]) => putanja(dijelovi.flat().reverse());
const UZ_KORIJEN = [
  obrnuto(GORNJI.put),
  obrnuto(doTocke(SRCANI.put, [302, 150]), DONJI.put),
  obrnuto(LIJEVI.put),
  obrnuto(doTocke(GORNJI.put, [430, 92]), GRANE[0].put),
  obrnuto(doTocke(SRCANI.put, [302, 150]), doTocke(DONJI.put, [700, 440]), GRANE[4].put),
  obrnuto(doTocke(GORNJI.put, [880, 140]), GRANE[2].put),
  obrnuto(SRCANI.put),
];

/** Mali snop korijenja ispod knjige na užim ekranima (300 × 96), gdje popis ide u stupac. */
const SNOP = [
  korijen([[150, 0], [148, 20], [122, 32], [94, 46], [58, 58], [16, 74]], 4, 0.7, 81, 1.2),
  korijen([[150, 0], [153, 22], [182, 32], [208, 48], [244, 60], [286, 72]], 4, 0.7, 83, 1.2),
  korijen([[149, 0], [145, 28], [132, 50], [120, 78]], 3, 0.6, 87, 1),
  korijen([[151, 0], [156, 28], [170, 50], [184, 76]], 3, 0.6, 89, 1),
  korijen([[150, 0], [151, 30], [149, 62], [150, 96]], 4.4, 1.2, 91, 1),
  korijen([[94, 46], [84, 56], [78, 68], [68, 80]], 1.8, 0.5, 93, 0.8),
  korijen([[208, 48], [218, 58], [224, 70], [234, 82]], 1.8, 0.5, 97, 0.8),
];

/** Ptice koje polijeću iz knjige i šire se kao krošnja: međutočka i kraj leta u jedinicama prizora. */
const PTICE = [
  { "--mx": -92, "--my": -66, "--ex": -250, "--ey": -140, "--t": "11s", "--d": "0s", "--v": 1 },
  { "--mx": -52, "--my": -104, "--ex": -150, "--ey": -226, "--t": "13s", "--d": "-4s", "--v": 0.8 },
  { "--mx": -8, "--my": -118, "--ex": -36, "--ey": -236, "--t": "12s", "--d": "-7.5s", "--v": 0.9 },
  { "--mx": 40, "--my": -108, "--ex": 96, "--ey": -230, "--t": "14s", "--d": "-2s", "--v": 0.7 },
  { "--mx": 84, "--my": -78, "--ex": 214, "--ey": -196, "--t": "12.5s", "--d": "-9.5s", "--v": 0.85 },
  { "--mx": 112, "--my": -46, "--ex": 276, "--ey": -116, "--t": "15s", "--d": "-5.5s", "--v": 0.65 },
  { "--mx": -112, "--my": -34, "--ex": -280, "--ey": -64, "--t": "16s", "--d": "-11s", "--v": 0.6 },
];

export default function Korijeni({ uvod }: { uvod: ReactNode }) {
  const k = knjige[0];
  return (
    <section className="kg-soba-sek noc">
      {/* čitaonica: zid s policama, svijeća i knjiga na stolu */}
      <div className="kg-soba">
        <div className="kg-zid" aria-hidden="true">
          <Odaja svijeca="kg-plamen" prozor="kg-mjesecina" />
          <i id="kg-mjesecina" className="kg-mjesecina" />
        </div>
        <div className="w">
          <div className="kg-uvod">
            <Ornament />
            <p data-reveal>{uvod}</p>
          </div>

          <div className="kg-kik" id={k.id}>
            <Nagib className="kg-pozornica">
              <i className="kg-odsjaj" aria-hidden="true" />
              <Svijeca id="kg-plamen" />
              <div className="kg-knjiga">
                <Knjiga3D naslov={k.naslov} podnaslov={k.podnaslov} korica={k.korica} />
              </div>
              <div className="kg-ptice" aria-hidden="true">
                {PTICE.map((p, i) => (
                  <Ptica key={i} klasa="kg-ptica" stil={p} />
                ))}
              </div>
            </Nagib>

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
            </div>
          </div>
        </div>
        <i className="kg-stol-ploha" aria-hidden="true" />
      </div>

      {/* ispod stola: korijenje raste u tamu i na vrhovima nosi ono što se u knjigu zapisuje */}
      <div className="kg-podzemlje">
        <svg className="kg-tlo" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="kg-tlo-f1" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0014 0.1" numOctaves={3} seed={11} />
              <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.33  0 0 0 0 0.22  2.2 0 0 0 -0.96" />
            </filter>
            <filter id="kg-tlo-f2" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.004 0.2" numOctaves={2} seed={29} />
              <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.26  0 0 0 0 0.42  2.4 0 0 0 -1.1" />
            </filter>
            <linearGradient id="kg-tlo-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset=".08" stopColor="#fff" stopOpacity="0" />
              <stop offset=".36" stopColor="#fff" />
              <stop offset=".56" stopColor="#fff" />
              <stop offset=".72" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="kg-tlo-m" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="900">
              <rect width="1440" height="900" fill="url(#kg-tlo-g)" />
            </mask>
          </defs>
          <g mask="url(#kg-tlo-m)">
            <rect width="1440" height="900" filter="url(#kg-tlo-f1)" opacity=".34" />
            <rect width="1440" height="900" filter="url(#kg-tlo-f2)" opacity=".2" />
          </g>
        </svg>

        <div className="w">
          <div className="kg-korijenje" data-reveal="crta">
            <div className="kg-kor-crtez" aria-hidden="true">
              <svg viewBox="0 0 1240 650">
                <defs>
                  <radialGradient id="kg-kor-g" gradientUnits="userSpaceOnUse" cx="290" cy="0" r="900">
                    <stop offset="0" stopColor="#fff1c6" />
                    <stop offset=".16" stopColor="#ecd093" />
                    <stop offset=".6" stopColor="#c9a25b" />
                    <stop offset="1" stopColor="#a47a38" />
                  </radialGradient>
                  <radialGradient id="kg-kor-sjaj">
                    <stop offset="0" stopColor="#ffe2a8" stopOpacity=".7" />
                    <stop offset=".4" stopColor="#f0b860" stopOpacity=".2" />
                    <stop offset="1" stopColor="#f0b860" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="kg-kor-izvor">
                    <stop offset="0" stopColor="#ffbe6e" stopOpacity=".3" />
                    <stop offset="1" stopColor="#ffbe6e" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* svjetlo knjige koje se prelijeva pod stol */}
                <ellipse cx="290" cy="6" rx="300" ry="170" fill="url(#kg-kor-izvor)" />
                {/* meki sjaj oko glavnih korijena, bez filtara */}
                <g fill="none" stroke="#f0c878" strokeLinecap="round" strokeLinejoin="round">
                  {[SRCANI, LIJEVI, GORNJI, DONJI].map((r, i) => (
                    <path key={i} d={r.os} strokeWidth="16" opacity=".045" />
                  ))}
                  {[SRCANI, LIJEVI, GORNJI, DONJI].map((r, i) => (
                    <path key={i} d={r.os} strokeWidth="7" opacity=".06" />
                  ))}
                </g>
                <path d={DLACICE} fill="none" stroke="#d9b56f" strokeWidth=".7" strokeLinecap="round" opacity=".5" />
                <g fill="url(#kg-kor-g)">
                  {SVI.map((r, i) => (
                    <path key={i} d={r.lik} />
                  ))}
                </g>
                <g className="polje-komete" fill="none" strokeLinecap="round">
                  {UZ_KORIJEN.map((d, i) => (
                    <Kometa key={i} d={d} kasni={3.2 + i * 1.7} traje={i % 2 ? 6.4 : 7.6} />
                  ))}
                </g>
                {VRHOVI.map(([x, y], i) => (
                  <g key={i} transform={`translate(${x} ${y})`}>
                    <circle r="15" fill="url(#kg-kor-sjaj)" />
                    <path className="polje-iskra" style={vars({ "--d": `${(i * 1.37) % 4.6}s` })} d={ISKRA} transform="scale(0.9)" fill="#fff3d0" />
                    <circle r="1.6" fill="#fffaea" />
                  </g>
                ))}
              </svg>
            </div>

            <svg className="kg-kor-malo" viewBox="0 0 300 96" aria-hidden="true">
              <g fill="#e2c487">
                {SNOP.map((r, i) => (
                  <path key={i} d={r.lik} />
                ))}
              </g>
            </svg>

            <p className="kg-kor-naslov" data-reveal>
              {k.popisNaslov}
            </p>
            <ul className="kg-kor-popis">
              {k.popis.map((p, i) => {
                const [x, y] = VRHOVI[i];
                // što je vrh dalje od knjige, to se natpis kasnije pojavi: korijen prvo mora dorasti do njega
                const kasni = 0.35 + Math.hypot(x - 290, y) / 520;
                return (
                  <li key={p} data-reveal style={vars({ "--x": x, "--y": y, "--d": `${kasni.toFixed(2)}s` })}>
                    {p}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="kg-kraj">
            <p className="kg-zakljucak" data-reveal>
              {k.zakljucak}
            </p>
            {k.citat && (
              <blockquote className="kg-citat" data-reveal>
                <svg viewBox="-13 -13 26 26" aria-hidden="true">
                  <path d={ISKRA} fill="currentColor" />
                </svg>
                <p>{k.citat}</p>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

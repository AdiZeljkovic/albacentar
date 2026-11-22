import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Naslov from "@/components/Naslov";
import Para from "@/components/pocetna/Para";
import { greben, zrake } from "@/lib/krajolik";
import { site } from "@/lib/site";
import { kas, vars } from "@/lib/util";

/**
 * O meni: svitanje novog dana. Iza portreta u luku izlazi sunce (digne se samo kad prizor uđe
 * u ekran), preko brda prema njemu vodi put kojim putuje svjetlo, a jutarnja magla na dnu
 * prelazi u svijetlu sekciju ispod. Dok fotografija nije postavljena (site.owner.photo),
 * u luku je silueta stabla života pred izlazećim suncem, kao u prvom svitanju na vrhu stranice.
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

/** Put od prednjeg plana do obzora pod suncem: sredina puta, njegova dva ruba i postaje uz njega. */
const PUT = "M990 300 C850 252 900 216 790 200 C700 186 704 162 626 148 C560 136 566 120 470 110";
const PUT_PLOHA =
  "M1070 300 C900 250 1000 215 822 197 C706 185 762 161 640 146 C566 137 584 121 474 108 L466 112 C560 124 540 139 612 150 C722 167 650 190 760 203 C900 222 790 262 908 300Z";
const POSTAJE: Array<[number, number, number]> = [
  [906, 262, 1],
  [800, 203, 0.8],
  [668, 157, 0.62],
  [556, 127, 0.48],
];

function Ptica({ stil }: { stil: Record<string, string | number> }) {
  return (
    <svg className="om-ptica" viewBox="-13 -9 26 18" style={vars(stil)}>
      <g className="knj-krila" fill="none" stroke="#3a2450" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 1 Q-5 -7 -12 -3" />
        <path d="M0 1 Q5 -7 12 -3" />
      </g>
    </svg>
  );
}

export default function Jutro() {
  const foto = site.owner.photo;
  const [ime, ...prezime] = site.owner.name.split(" ");

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="om-zlato" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6d8" />
            <stop offset=".35" stopColor="#f0d28c" />
            <stop offset="1" stopColor="#a67c32" />
          </linearGradient>
        </defs>
      </svg>

      {/* zadnji lampioni s polja, visoko na nebu koje svijetli */}
      <div className="om-lampioni" aria-hidden="true">
        {[
          [12, 9, 0.9, 0],
          [31, 5, 0.6, -7],
          [58, 12, 0.75, -3],
          [77, 6, 0.55, -11],
          [91, 14, 0.8, -5],
        ].map(([x, y, v, d]) => (
          <i key={x} style={vars({ "--x": `${x}%`, "--y": `${y}%`, "--v": v, "--d": `${d}s` })} />
        ))}
      </div>

      <div className="w om-mreza">
        <div className="om-lijevo">
          <div className="om-portret" data-reveal>
            <div className="om-prostor">
              {foto ? (
                <Image className="om-foto" src={foto} alt={site.owner.name} fill sizes="(max-width: 900px) 280px, 360px" />
              ) : (
                <>
                  <i className="om-zora" />
                  <svg className="om-prsten" viewBox="0 0 400 400" fill="none" stroke="#7a4a2a" aria-hidden="true">
                    <circle cx="200" cy="200" r="168" strokeWidth=".9" opacity=".45" />
                    <g className="prsten-vrti" style={{ transformOrigin: "200px 200px" }}>
                      <circle cx="200" cy="200" r="150" strokeWidth=".8" opacity=".4" strokeDasharray="2 7" />
                      <circle cx="200" cy="50" r="3.5" fill="#7a4a2a" stroke="none" opacity=".7" />
                    </g>
                  </svg>
                  <Image className="om-drvo" src="/img/drvo-zlatno.png" alt="Drvo života, znak AlBa Centra" width={520} height={500} sizes="260px" />
                </>
              )}
              <i className="om-sjena" />
            </div>
            <svg className="om-luk" viewBox="0 0 300 440" aria-hidden="true">
              <g fill="none" stroke="url(#om-zlato)">
                <path d="M22 424 L22 150 A128 128 0 0 1 278 150 L278 424" strokeWidth="1.8" />
                <path d="M13 424 L13 150 A137 137 0 0 1 287 150 L287 424" strokeWidth=".7" opacity=".7" />
                <path d="M30 420 L30 150 A120 120 0 0 1 270 150 L270 420" strokeWidth="1.1" />
                <path d="M17.5 150 A132.5 132.5 0 0 1 282.5 150" pathLength={180} strokeWidth="6" strokeDasharray="0.5 5.5" strokeDashoffset="0.25" opacity=".7" />
                <path d="M6 150 L26 150 M274 150 L294 150" strokeWidth="1.4" />
                <path d="M4 424 L296 424" strokeWidth="1.5" />
                <path d="M0 432 L300 432" strokeWidth=".7" opacity=".6" />
              </g>
              <path d="M150 5 L158 17 L150 29 L142 17Z" fill="#fff3cf" stroke="#f0d28c" strokeWidth=".8" />
            </svg>
          </div>
          {/* sunce koje izlazi iza portreta; brda ga dolje zaklanjaju */}
          <div className="om-sunce" aria-hidden="true">
            <i className="om-zrake" style={{ background: zrake(5, "255 228 170", 0.26) }} />
            <i className="om-zar" />
            <i className="om-kolut" />
          </div>
          <div className="om-ptice" aria-hidden="true">
            <Ptica stil={{ "--y": "18%", "--t": "34s", "--d": "-4s", "--v": 1 }} />
            <Ptica stil={{ "--y": "30%", "--t": "41s", "--d": "-19s", "--v": 0.7 }} />
            <Ptica stil={{ "--y": "9%", "--t": "38s", "--d": "-27s", "--v": 0.8 }} />
          </div>
        </div>

        <div className="om-tekst">
          <p className="oz" data-reveal>
            O meni
          </p>
          <Naslov>{`${ime}\n*${prezime.join(" ")}*`}</Naslov>
          <p className="om-uloge" data-reveal style={kas(0.2)}>
            {site.owner.roles.join(" · ")}
          </p>
          <div className="proza" data-reveal style={kas(0.28)}>
            <p className="uvod">
              Moj profesionalni i životni put oblikovali su različiti gradovi, kulture, obrazovanja i iskustva. Kroz
              godine rada i života u međunarodnom okruženju razvijala sam interes za ljude, njihove životne priče,
              odnose i načine na koje oblikuju vlastiti put.
            </p>
            <p className="mut">
              AlBa Centar nastao je kao prostor u kojem želim povezati svoja profesionalna iskustva, interes za ljudske
              odnose, obiteljske korijene i osobni razvoj.
            </p>
          </div>
          <p className="om-potpis rukopis" data-reveal style={kas(0.36)}>
            <span>Svatko ima svoje korijene. Ali svatko ima i pravo na vlastiti put.</span>
          </p>
          <p className="red" data-reveal style={kas(0.42)}>
            <Link className="link" href="/o-meni">
              Moj put prema konstelacijama{" "}
              <span className="str" aria-hidden="true">
                →
              </span>
            </Link>
          </p>
        </div>
      </div>

      {/* krajolik: brda u jutarnjem svjetlu, put prema suncu i magla koja prelazi u dan */}
      <svg className="om-krajolik" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="om-daleko" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b9718a" />
            <stop offset="1" stopColor="#8a5a86" />
          </linearGradient>
          <linearGradient id="om-srednje" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#70456f" />
            <stop offset="1" stopColor="#4a3058" />
          </linearGradient>
          <linearGradient id="om-blizu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2548" />
            <stop offset="1" stopColor="#24172f" />
          </linearGradient>
          <linearGradient id="om-put" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#f6d79a" stopOpacity=".5" />
            <stop offset="1" stopColor="#fff3cf" stopOpacity=".95" />
          </linearGradient>
          <radialGradient id="om-postaja">
            <stop offset="0" stopColor="#fffaea" />
            <stop offset=".3" stopColor="#ffe2a8" stopOpacity=".6" />
            <stop offset="1" stopColor="#ffe2a8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={greben({ sjeme: 21, y: 104, amp: 30, valova: 2.6, dno: 300 })} fill="url(#om-daleko)" />
        <path d={greben({ sjeme: 34, y: 142, amp: 22, valova: 3.2, suma: 8, dno: 300 })} fill="url(#om-srednje)" />
        <path d="M0 210 C300 160 600 190 800 180 C1050 168 1250 200 1440 176 L1440 300 L0 300Z" fill="url(#om-blizu)" />

        {/* put */}
        <path d={PUT_PLOHA} fill="url(#om-put)" />
        <g className="polje-komete om-put-svjetlo" fill="none" strokeLinecap="round">
          <Kometa d={PUT} kasni={0} traje={7} />
          <Kometa d={PUT} kasni={3.5} traje={7} />
        </g>
        {POSTAJE.map(([x, y, v], i) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${v})`}>
            <circle className="om-postaja" r="16" fill="url(#om-postaja)" style={vars({ "--i": i })} />
            <path d="M0 -5 L4 0 L0 5 L-4 0Z" fill="#fff6d8" />
          </g>
        ))}

        {/* jutarnja magla: pramenovi koji se zgušnjavaju u svjetlo dana */}
        <Para
          id="op"
          boja={[0.98, 0.949, 0.906]}
          visina={300}
          slojevi={[
            { frek: "0.003 0.018", sjeme: 6, od: 120, do: 230, jacina: 2, boja: [1, 0.86, 0.74] },
            { frek: "0.005 0.024", sjeme: 15, od: 160, do: 262, jacina: 2.8 },
            { frek: "0.009 0.034", sjeme: 29, od: 204, do: 284, jacina: 3.4 },
          ]}
          puno={[226, 292]}
        />
      </svg>
    </>
  );
}

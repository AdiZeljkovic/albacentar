import type { CSSProperties, ReactNode } from "react";
import Portret from "@/components/Portret";
import Zvijezde from "@/components/Zvijezde";
import Oblaci from "@/components/pocetna/Oblaci";
import Para from "@/components/pocetna/Para";
import { greben, zrake } from "@/lib/krajolik";
import { vars } from "@/lib/util";
import { ISKRA } from "@/lib/zvijezda";

/**
 * Prvi prizor stranice O meni: noć iz glave stranice prelazi u svitanje. Iza portreta u luku
 * izlazi sunce (digne se samo kad portret uđe u ekran), preko grebena prema njemu vodi put kojim
 * putuje svjetlo, a jutarnja magla na dnu prelazi u svijetli dio stranice. Isti put se u sljedećoj
 * sekciji nastavlja kao cesta s postajama (Putovanje.tsx).
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

/** Put od prednjeg plana do obzora pod suncem: sredina puta, njegova ploha i postaje uz njega. */
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
    <svg className="am-ptica" viewBox="-13 -9 26 18" style={vars(stil)}>
      <g className="knj-krila" fill="none" stroke="#3a2450" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 1 Q-5 -7 -12 -3" />
        <path d="M0 1 Q5 -7 12 -3" />
      </g>
    </svg>
  );
}

export default function Svitanje({ children }: { children: ReactNode }) {
  return (
    <section className="am-svitanje">
      {/* zadnje zvijezde noći; prema obzoru blijede */}
      <div className="am-sv-zvijezde" aria-hidden="true">
        <Zvijezde gustoca={0.9} bogato padalice={false} />
      </div>
      {/* Danica: zvijezda koja ostane na nebu i kad svane */}
      <svg className="am-danica" viewBox="-30 -30 60 60" aria-hidden="true">
        <defs>
          <radialGradient id="am-danica-sjaj">
            <stop offset="0" stopColor="#fff6d8" stopOpacity=".55" />
            <stop offset=".4" stopColor="#f0d28c" stopOpacity=".14" />
            <stop offset="1" stopColor="#f0d28c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="28" fill="url(#am-danica-sjaj)" />
        <path d={ISKRA} fill="#fff6d8" transform="scale(1.9)" />
      </svg>
      {/* oblaci nad obzorom, odozdo obasjani suncem */}
      <Oblaci id="am-sv-ob" className="am-sv-oblaci" boja={[0.6, 0.42, 0.66]} sjena={[1, 0.74, 0.56]} sjeme={21} gustoca={3} frek="0.003 0.014" />

      <div className="w am-sv-mreza">
        <div className="am-sv-lijevo">
          <Portret />
          {/* sunce koje izlazi iza portreta; grebeni ga dolje zaklanjaju */}
          <div className="am-sunce" aria-hidden="true">
            <i className="am-zrake" style={{ background: zrake(9, "255 228 170", 0.3) }} />
            <i className="am-zar" />
            <i className="am-kolut" />
          </div>
          <div className="am-ptice" aria-hidden="true">
            <Ptica stil={{ "--y": "16%", "--t": "36s", "--d": "-6s", "--v": 1 }} />
            <Ptica stil={{ "--y": "29%", "--t": "43s", "--d": "-21s", "--v": 0.7 }} />
            <Ptica stil={{ "--y": "8%", "--t": "40s", "--d": "-30s", "--v": 0.8 }} />
          </div>
        </div>

        <div className="am-sv-tekst">{children}</div>
      </div>

      {/* krajolik: grebeni u jutarnjem svjetlu, put prema suncu i magla koja prelazi u dan */}
      <svg className="am-krajolik" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="am-daleko" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b9718a" />
            <stop offset="1" stopColor="#8a5a86" />
          </linearGradient>
          <linearGradient id="am-srednje" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#70456f" />
            <stop offset="1" stopColor="#4a3058" />
          </linearGradient>
          <linearGradient id="am-blizu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2548" />
            <stop offset="1" stopColor="#24172f" />
          </linearGradient>
          <linearGradient id="am-put-ploha" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#f6d79a" stopOpacity=".5" />
            <stop offset="1" stopColor="#fff3cf" stopOpacity=".95" />
          </linearGradient>
          <radialGradient id="am-put-postaja">
            <stop offset="0" stopColor="#fffaea" />
            <stop offset=".3" stopColor="#ffe2a8" stopOpacity=".6" />
            <stop offset="1" stopColor="#ffe2a8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={greben({ sjeme: 43, y: 98, amp: 32, valova: 2.2, dno: 300 })} fill="url(#am-daleko)" opacity=".8" />
        <path d={greben({ sjeme: 27, y: 122, amp: 26, valova: 2.9, dno: 300 })} fill="url(#am-daleko)" />
        <path d={greben({ sjeme: 52, y: 146, amp: 22, valova: 3.4, suma: 8, dno: 300 })} fill="url(#am-srednje)" />
        <path d={greben({ sjeme: 61, y: 190, amp: 16, valova: 2.1, oktave: 3, nagib: -18, dno: 300 })} fill="url(#am-blizu)" />

        {/* put */}
        <path d={PUT_PLOHA} fill="url(#am-put-ploha)" />
        <g className="polje-komete am-put-svjetlo" fill="none" strokeLinecap="round">
          <Kometa d={PUT} kasni={0} traje={7} />
          <Kometa d={PUT} kasni={3.5} traje={7} />
        </g>
        {POSTAJE.map(([x, y, v], i) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${v})`}>
            <circle className="am-put-postaja" r="16" fill="url(#am-put-postaja)" style={vars({ "--i": i })} />
            <path d="M0 -5 L4 0 L0 5 L-4 0Z" fill="#fff6d8" />
          </g>
        ))}

        {/* jutarnja magla: pramenovi koji se zgušnjavaju u svjetlo dana */}
        <Para
          id="am-sv-p"
          boja={[0.98, 0.949, 0.906]}
          visina={300}
          slojevi={[
            { frek: "0.003 0.018", sjeme: 8, od: 120, do: 230, jacina: 2, boja: [1, 0.86, 0.74] },
            { frek: "0.005 0.024", sjeme: 18, od: 160, do: 262, jacina: 2.8 },
            { frek: "0.009 0.034", sjeme: 31, od: 204, do: 284, jacina: 3.4 },
          ]}
          puno={[226, 292]}
        />
      </svg>
    </section>
  );
}

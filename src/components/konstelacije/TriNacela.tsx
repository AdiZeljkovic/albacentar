import type { ReactNode } from "react";
import Naslov from "@/components/Naslov";
import Zvijezde from "@/components/Zvijezde";
import Oblaci from "@/components/pocetna/Oblaci";
import Para from "@/components/pocetna/Para";
import { nacela } from "@/content/konstelacije";
import { greben } from "@/lib/krajolik";
import { kas, vars } from "@/lib/util";
import { Krug, KRUG_TRAJE, Red, Vaga } from "./Zvijezdja";

const z = (n: number) => +n.toFixed(1);

const ZVIJEZDJA: Array<{ ime: string; slika: ReactNode }> = [
  { ime: "Krug", slika: <Krug /> },
  { ime: "Red", slika: <Red /> },
  { ime: "Vaga", slika: <Vaga /> },
];

/**
 * Tri temeljna načela kao noćni prizor: dan stranice prelazi u sumrak pa u noć, na nebu su tri
 * zviježđa s naslovnice (svako uz cijeli tekst svog načela), a na dnu sviće nad grebenima i
 * jutarnja se magla zgušnjava u boju stranice. Zviježđa se odvijaju sama; ništa nije vezano uz skrol.
 */
export default function TriNacela() {
  return (
    <>
      {/* oblaci u sumraku na vrhu prizora */}
      <Oblaci id="ks-ob" className="ks-oblaci" boja={[1, 0.91, 0.9]} sjena={[0.62, 0.42, 0.68]} sjeme={21} gustoca={3} />
      {/* nebo je u tri platna, jedno ispod drugog: crta se samo ono koje je na ekranu */}
      <div className="ks-nebo-zvijezde" aria-hidden="true">
        <div>
          <Zvijezde gustoca={1.25} bogato />
        </div>
        <div>
          <Zvijezde gustoca={1.1} bogato padalice={false} />
        </div>
        <div>
          <Zvijezde gustoca={1.1} bogato />
        </div>
      </div>

      {/* mreža zvjezdane karte oko nebeskog pola */}
      <svg className="ks-mreza" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <g fill="none" stroke="#d9b56f" strokeWidth=".7">
          {[180, 330, 480, 630, 780, 930].map((r) => (
            <circle key={r} cx="800" cy="40" r={r} strokeDasharray={r % 300 === 180 ? undefined : "1 7"} opacity={r % 300 === 180 ? 0.5 : 0.8} />
          ))}
          {Array.from({ length: 13 }, (_, k) => {
            const kut = (15 * k * Math.PI) / 180;
            return <line key={k} x1={z(800 + 180 * Math.cos(kut))} y1={z(40 + 180 * Math.sin(kut))} x2={z(800 + 1000 * Math.cos(kut))} y2={z(40 + 1000 * Math.sin(kut))} strokeDasharray="1 9" />;
          })}
          <circle cx="800" cy="40" r="938" pathLength={360} strokeWidth="9" strokeDasharray="0.12 0.88" opacity=".7" />
        </g>
      </svg>

      <div className="w ks-nebo-in">
        {/* mjesec */}
        <svg className="ks-mjesec" viewBox="0 0 200 200" aria-hidden="true">
          <circle className="ks-mjesec-sjaj" cx="100" cy="100" r="100" fill="url(#ks-mjesec-sjaj)" />
          <circle cx="100" cy="100" r="46" fill="#aab4e8" opacity=".1" />
          <circle cx="100" cy="100" r="46" fill="none" stroke="#e9dcc4" strokeWidth=".5" opacity=".3" />
          <g mask="url(#ks-srp)">
            <circle cx="100" cy="100" r="46" fill="url(#ks-mjesec)" />
            <g fill="#b89a5c" opacity=".28">
              <circle cx="128" cy="94" r="5" />
              <circle cx="120" cy="120" r="7" />
              <circle cx="136" cy="112" r="3" />
              <circle cx="110" cy="136" r="4" />
            </g>
          </g>
        </svg>

        <header className="ks-nebo-glava">
          <p className="oz" data-reveal>
            Hellingerov pristup
          </p>
          <Naslov>{"Tri temeljna *načela.*"}</Naslov>
          <p className="mut" data-reveal style={kas(0.25)}>
            U Hellingerovu pristupu posebno se ističu tri načela koja se često nazivaju temeljnim ili sistemskim
            načelima.
          </p>
        </header>

        <div className="ks-nacela">
          {/* meridijan karte: os uz koju su nanizana tri zviježđa; njome silazi svjetlo */}
          <div className="ks-os" aria-hidden="true">
            <i />
          </div>

          {nacela.map((n, i) => (
            <article className="ks-nacelo" key={n.naslov} style={vars({ "--k": `${z(i * 4.6 - (i ? KRUG_TRAJE : 0))}s` })}>
              <div className="ks-n-slika" data-reveal>
                {ZVIJEZDJA[i].slika}
              </div>
              <span className="ks-n-cvor" aria-hidden="true">
                <i />
              </span>
              <div className="ks-n-tekst">
                <p className="ks-n-broj" aria-hidden="true" data-reveal>
                  {n.broj}
                </p>
                <p className="ks-n-ime" data-reveal>
                  <span className="sr">{n.broj}. načelo, </span>zviježđe {ZVIJEZDJA[i].ime}
                </p>
                <h3 data-reveal style={kas(0.06)}>
                  {n.naslov}
                </h3>
                {n.tekst.map((t, j) => (
                  <p key={t} className={j === 0 ? "ks-n-prvi" : undefined} data-reveal style={kas(0.12 + j * 0.07)}>
                    {t}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="nacela-ograda ks-ograda" data-reveal>
          Ova načela predstavljaju dio Hellingerova pristupa i nisu univerzalni znanstveni zakoni koji se mogu primijeniti
          jednako na svaku obitelj.
        </p>
      </div>

      {/* svitanje: grebeni pred prvim svjetlom i magla koja se zgušnjava u boju stranice */}
      <div className="ks-zora" aria-hidden="true">
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none">
          <path d={greben({ sjeme: 43, y: 74, amp: 28, valova: 2.1, oktave: 6, dno: 300 })} fill="#5b4c93" opacity=".55" />
          <path d={greben({ sjeme: 47, y: 100, amp: 30, valova: 2.8, oktave: 6, suma: 3.5, dno: 300 })} fill="#353a80" opacity=".8" />
          <path d={greben({ sjeme: 53, y: 132, amp: 24, valova: 3.5, suma: 8, dno: 300 })} fill="#141938" />
          <Para
            id="ks-zp"
            boja={[0.98, 0.949, 0.906]}
            visina={300}
            slojevi={[
              { frek: "0.003 0.018", sjeme: 12, od: 96, do: 220, jacina: 1.9, boja: [0.74, 0.68, 0.88] },
              { frek: "0.005 0.024", sjeme: 27, od: 150, do: 258, jacina: 2.4 },
              { frek: "0.009 0.034", sjeme: 38, od: 200, do: 284, jacina: 3 },
            ]}
            puno={[222, 292]}
          />
        </svg>
      </div>
    </>
  );
}

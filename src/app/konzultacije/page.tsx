import type { Metadata } from "next";
import Glava from "@/components/Glava";
import Naslov from "@/components/Naslov";
import Poziv from "@/components/Poziv";
import Zvijezde from "@/components/Zvijezde";
import UpitTermin from "@/components/forme/UpitTermin";
import Dveri from "@/components/konzultacije/Dveri";
import VelikaKola from "@/components/konzultacije/VelikaKola";
import { VrataDefs } from "@/components/konzultacije/Vrata";
import Magla from "@/components/pocetna/Magla";
import Oblaci from "@/components/pocetna/Oblaci";
import Para from "@/components/pocetna/Para";
import { greben, zrake } from "@/lib/krajolik";
import { kas } from "@/lib/util";

export const metadata: Metadata = {
  title: "Načini rada i konzultacije",
  description:
    "Individualne konstelacije, grupne konstelacije uživo, individualni online rad, grupni online susreti i individualne konzultacije. Pošaljite upit za termin koji vam odgovara.",
  alternates: { canonical: "/konzultacije" },
};

const temeRazgovora = ["Obiteljski odnosi", "Partnerstvo", "Roditeljstvo", "Posao", "Životne promjene", "Osobne granice", "Odnos prema vlastitoj prošlosti"];

export default function Konzultacije() {
  return (
    <>
      <Glava
        oznaka="Načini rada i konzultacije"
        naslov="Svaka priča zaslužuje *svoj prostor.*"
        uvod="Ne dolazimo svi s istim pitanjima i ne trebamo svi isti način rada. Zato AlBa Centar predviđa više oblika susreta, ovisno o temi, željama i mogućnostima sudionika."
        dno="noc"
      />

      {/* ---------- načini rada: brijeg sa stablom, a pod njim žila koja silazi do četvorih vrata svjetla ---------- */}
      <section className="kz-dveri noc" id="nacini-rada" aria-label="Načini rada">
        <Magla pojas="kz-pojas" />
        <VrataDefs />
        <Dveri />
      </section>

      {/* ---------- individualne konzultacije: predzorje. Teme razgovora su Velika kola, a na dnu sviće ---------- */}
      <section className="kz-razgovor noc" id="konzultacije">
        <div className="kz-rz-zvijezde" aria-hidden="true">
          <Zvijezde gustoca={1.1} bogato />
        </div>
        <div className="w kz-rz">
          <div className="kz-rz-glava">
            <p className="oz" data-reveal>
              Individualne konzultacije
            </p>
            <Naslov>{"Ponekad nam je najprije potreban *razgovor.*"}</Naslov>
            <p className="uvod" data-reveal style={kas(0.2)}>
              Individualne konzultacije namijenjene su osobama koje žele jasnije sagledati određenu životnu situaciju,
              postaviti pitanja i istražiti moguće sljedeće korake.
            </p>
          </div>
          <VelikaKola teme={temeRazgovora} />
          <div className="kz-rz-dno">
            <p className="mut" data-reveal style={kas(0.1)}>
              Konzultacije nisu prostor u kojem netko drugi odlučuje umjesto vas. Njihova je svrha pomoći vam da bolje
              razumijete situaciju i jasnije prepoznate vlastite mogućnosti.
            </p>
            <p className="istaknuto" data-reveal style={kas(0.2)}>
              Svaki susret započinje vašom temom.
            </p>
          </div>
        </div>
        {/* svitanje: rumen na obzoru, grebeni i magla koja se zgušnjava u boju stranice */}
        <svg className="kz-osvit" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <radialGradient id="kz-osvit-rumen" cx=".36" cy=".34" r=".5" gradientTransform="translate(.36 .34) scale(1.1 .62) translate(-.36 -.34)">
              <stop offset="0" stopColor="#ffd0a0" stopOpacity=".92" />
              <stop offset=".3" stopColor="#f09a86" stopOpacity=".52" />
              <stop offset=".66" stopColor="#b06ea0" stopOpacity=".18" />
              <stop offset="1" stopColor="#a86aa0" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1440" height="300" fill="url(#kz-osvit-rumen)" />
          <path d={greben({ sjeme: 71, y: 96, amp: 30, valova: 2.6, dno: 300 })} fill="#4b4588" opacity=".72" />
          <path d={greben({ sjeme: 83, y: 128, amp: 24, valova: 3.3, suma: 8, dno: 300 })} fill="#1a1c42" />
          <Para
            id="kzp"
            boja={[0.98, 0.949, 0.906]}
            visina={300}
            slojevi={[
              { frek: "0.003 0.018", sjeme: 13, od: 96, do: 220, jacina: 1.9, boja: [0.86, 0.7, 0.82] },
              { frek: "0.005 0.024", sjeme: 27, od: 150, do: 258, jacina: 2.4 },
              { frek: "0.009 0.034", sjeme: 41, od: 200, do: 284, jacina: 3 },
            ]}
            puno={[222, 292]}
          />
        </svg>
      </section>

      {/* ---------- upit za termin: jutro. Obrazac je list papira na jutarnjem svjetlu ---------- */}
      <section className="sek kz-upit" id="upit">
        <div className="kz-jutro" aria-hidden="true">
          <i className="kz-sunce">
            <i className="kz-zrake" style={{ background: zrake(27, "232 176 92", 0.2) }} />
          </i>
          <Oblaci id="kzo" className="kz-oblaci" boja={[1, 1, 1]} sjena={[0.78, 0.62, 0.42]} sjeme={9} gustoca={3.1} />
        </div>
        <div className="w">
          <div className="zaglavlje">
            <div>
              <p className="oz" data-reveal>
                Dogovor termina na upit
              </p>
              <Naslov>{"Odaberite *željeni termin.*"}</Naslov>
            </div>
            <p className="mut zaglavlje-tekst" data-reveal>
              Nakon upita dobit ćete informacije o dostupnim terminima, načinu rada i uvjetima sudjelovanja.
            </p>
          </div>
          <div className="kz-obrazac">
            <UpitTermin />
          </div>
        </div>
      </section>

      <Poziv bezRazmaka naslov="Niste sigurni koji oblik rada *vam odgovara?*" tekst="Javite nam se i zajedno ćemo razmotriti koji bi oblik rada odgovarao vašoj temi." />
    </>
  );
}

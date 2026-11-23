import type { Metadata } from "next";
import Glava from "@/components/Glava";
import Naslov from "@/components/Naslov";
import Ornament from "@/components/Ornament";
import Poziv from "@/components/Poziv";
import Iskrica from "@/components/omeni/Iskrica";
import Korijeni from "@/components/omeni/Korijeni";
import Putovanje from "@/components/omeni/Putovanje";
import Svitanje from "@/components/omeni/Svitanje";
import Zvijezde from "@/components/Zvijezde";
import { site } from "@/lib/site";
import { kas } from "@/lib/util";

export const metadata: Metadata = {
  title: `O meni: ${site.owner.name}`,
  description:
    "Aleksandra Baljak Biško, konstelator. Obiteljske i sistemske konstelacije prema pristupu Berta Hellingera, uz edukaciju pod vodstvom Alemke Dauskardt.",
  alternates: { canonical: "/o-meni" },
};

const postaje = [
  { mjesto: "Zagreb", opis: "Studij ekonomije na Sveučilištu u Zagrebu.", prizor: "zagreb" },
  { mjesto: "U svijetu", opis: "Godine života i rada u inozemstvu, među različitim ljudima i kulturama.", prizor: "daleko" },
  { mjesto: "2026.", opis: "Završena edukacija Konstelacije prema Hellingeru.", prizor: "cilj" },
] as const;
export default function OMeni() {
  const [ime, ...prezime] = site.owner.name.split(" ");

  return (
    <>
      <Glava oznaka="O meni" naslov={`${ime}\n*${prezime.join(" ")}*`} uvod="Obiteljske i sistemske konstelacije prema pristupu Berta Hellingera." dno="noc" />

      {/* ---------- svitanje: noć iz glave prelazi u zoru, sunce izlazi iza portreta ---------- */}
      <Svitanje>
        <div className="proza">
          <p className="uvod" data-reveal>
            Dugi niz godina radila sam u ekonomiji, u različitim zemljama i kulturama. Kroz sve to vrijeme najviše su me
            zanimali ljudi: njihove priče, odnosi i način na koji pronalaze svoj put.
          </p>
          <p className="mut" data-reveal style={kas(0.08)}>
            Taj me interes s vremenom doveo do obiteljskih konstelacija, kojima se danas posvećujem.
          </p>
        </div>        {/* potpis se ispiše sam, kao rukom */}
        <p className="am-potpis rukopis" data-reveal style={kas(0.26)} aria-hidden="true">
          <span>{ime}</span>
        </p>
      </Svitanje>

      {/* ---------- put: cesta iz svitanja s pet postaja ---------- */}
      <Putovanje oznaka="Ukratko" naslov="Odakle *dolazim.*" postaje={postaje} />

      {/* ---------- put prema konstelacijama: proza, uvjerenje na kartici i list s onim što je ispunjava ---------- */}
      <section className="sek am-pristup zrno">
        <div className="w">
          <div className="am-pr-mreza">
            <div className="am-pr-glava">
              <p className="oz" data-reveal>
                Konstelacije
              </p>
              <Naslov>{"Moj put prema *konstelacijama.*"}</Naslov>
            </div>
            <div className="proza am-pr-proza">
              <p className="uvod" data-reveal>
                S vremenom me sve više zanimalo ono što nosimo iz obitelji: odnosi, obiteljska povijest i nasljeđe. Posebno me
                dotaknuo pristup Berta Hellingera i njegova promišljanja o pripadnosti i mjestu pojedinca u obitelji.
              </p>
              <p className="mut" data-reveal style={kas(0.08)}>
                Znanje sam razvijala kroz edukacije uz Miru Hajduka i Alemku Dauskardt, a 2026. godine završila sam edukaciju
                Konstelacije prema Hellingeru pod vodstvom Alemke Dauskardt.
              </p>
            </div>            <div className="am-vjerujem" data-reveal style={kas(0.2)}>
              <div className="am-papir">
                <Iskrica className="am-papir-znak" />
                <p className="istaknuto">
                  Vjerujem da je u ovom radu, uz znanje, najvažnije slušati, poštovati granice i imati na umu da svatko dolazi
                  sa svojom životnom pričom.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ---------- zašto AlBa Centar: noćna ploča; korijeni pod stablom i put prema zvijezdi ---------- */}
      <section className="ploca noc citat-ploca am-zasto" id="zasto">
        <Zvijezde gustoca={0.7} />
        <Korijeni />
        <div className="w sredina">
          <p className="oz" data-reveal>
            Zašto AlBa Centar?
          </p>
          <Naslov as="h2" className="citat-velik">
            {"Svatko ima svoje korijene.\nAli svatko ima i pravo na *vlastiti put.*"}
          </Naslov>
          <div className="citat-tekst">
            <p data-reveal style={kas(0.4)}>
              AlBa Centar zamišljen je kao mirno mjesto na kojem možete zastati i u svom ritmu istražiti pitanja i odnose
              koji su vam važni.
            </p>
            <p data-reveal style={kas(0.5)}>
              Ne vjerujem u gotove recepte za tuđi život. Vjerujem u osobnu odgovornost, slobodu izbora i mogućnost da čovjek,
              uz bolje razumijevanje svoje prošlosti, svjesnije oblikuje svoju budućnost.
            </p>
          </div>
          <Ornament />
        </div>
      </section>

      <Poziv />
    </>
  );
}

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
    "Aleksandra Baljak Biško: magistar ekonomskih znanosti, porezna specijalist i konstelator. Put od Zagreba, Melbournea, Praga i jezera Garda do konstelacijskog rada prema Bertu Hellingeru.",
  alternates: { canonical: "/o-meni" },
};

const postaje = [
  { mjesto: "Zagreb", opis: "Ekonomski fakultet Sveučilišta u Zagrebu i zvanje magistre ekonomskih znanosti." },
  { mjesto: "Melbourne", opis: "Dio mladosti proveden u Australiji i prvi život u drugoj kulturi." },
  { mjesto: "Prag", opis: "Priznavanje obrazovanja i dodatna stručna kvalifikacija u području poreza." },
  { mjesto: "Lago di Garda", opis: "Život uz jezero: priroda, upoznavanje sebe i vrijednost jednostavnijeg načina života." },
  { mjesto: "2026.", opis: "Završena edukacija Konstelacije prema Hellingeru, pod vodstvom Alemke Dauskardt." },
];

const zanimanja = ["Obiteljski korijeni i priče predaka", "Sakralni prostori", "Kulturna baština", "Priroda i planinarenje", "Jesen", "Aromaterapija", "Upoznavanje biljaka", "Prepoznavanje gljiva"];

export default function OMeni() {
  const [ime, ...prezime] = site.owner.name.split(" ");

  return (
    <>
      <Glava oznaka="O meni" naslov={`${ime}\n*${prezime.join(" ")}*`} uvod={`${site.owner.prefix} · ${site.owner.roles.join(" · ")}`} dno="noc" />

      {/* ---------- svitanje: noć iz glave prelazi u zoru, sunce izlazi iza portreta ---------- */}
      <Svitanje>
        <div className="proza">
          <p className="uvod" data-reveal>
            Moj profesionalni i životni put oblikovali su različiti gradovi, kulture, obrazovanja i iskustva. Kroz godine
            rada i života u međunarodnom okruženju razvijala sam interes za ljude, njihove životne priče, odnose i načine
            na koje oblikuju vlastiti put.
          </p>
          <p className="mut" data-reveal style={kas(0.08)}>
            Završila sam Ekonomski fakultet Sveučilišta u Zagrebu i stekla zvanje magistre ekonomskih znanosti.
            Profesionalno sam se razvijala u područjima računovodstva, poreza, poslovanja i trgovine.
          </p>
          <p className="mut" data-reveal style={kas(0.14)}>
            Dio svoje mladosti provela sam u Melbourneu u Australiji, a moj profesionalni i osobni put nastavio se kroz
            međunarodno iskustvo i život u različitim sredinama. Kvalifikacije sam dodatno razvijala u Pragu, gdje sam
            prošla postupak priznavanja obrazovanja te stekla dodatnu stručnu kvalifikaciju u području poreza.
          </p>
          <p className="mut" data-reveal style={kas(0.2)}>
            Više od dvadeset godina međunarodnog iskustva donijelo mi je susrete s različitim kulturama, ljudima i
            životnim okolnostima. Život uz Lago di Garda u Italiji također je dio mog osobnog puta i razdoblja u kojem sam
            dodatno upoznavala sebe, prirodu i vrijednost jednostavnijeg načina života.
          </p>
        </div>
        {/* potpis se ispiše sam, kao rukom */}
        <p className="am-potpis rukopis" data-reveal style={kas(0.26)} aria-hidden="true">
          <span>{ime}</span>
        </p>
      </Svitanje>

      {/* ---------- put: cesta iz svitanja s pet postaja ---------- */}
      <Putovanje oznaka="Gradovi i iskustva" naslov="Put koji me *oblikovao.*" postaje={postaje} />

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
                Uz profesionalno obrazovanje, s vremenom se razvijao i moj interes za obiteljske odnose, obiteljsku povijest,
                nasljeđe i osobni razvoj. Taj me interes postupno doveo do konstelacijskog rada.
              </p>
              <p className="mut" data-reveal style={kas(0.08)}>
                U tom području posebno me zainteresirao pristup Berta Hellingera, njegova promišljanja o pripadnosti,
                obiteljskom sustavu, generacijskim odnosima i mjestu pojedinca unutar obitelji.
              </p>
              <p className="mut" data-reveal style={kas(0.14)}>
                Svoje znanje razvijala sam kroz edukacije i učenje uz Miru Hajduka i Alemku Dauskardt. Godine 2026. završila
                sam edukaciju Konstelacije prema Hellingeru, pod vodstvom Alemke Dauskardt, te se profesionalno usmjerila
                prema konstelacijskom radu.
              </p>
            </div>
            <div className="am-vjerujem" data-reveal style={kas(0.2)}>
              <div className="am-papir">
                <Iskrica className="am-papir-znak" />
                <p className="istaknuto">
                  Vjerujem da je za ovaj posao, uz znanje i edukaciju, važna sposobnost slušanja, poštovanja granica i
                  razumijevanja činjenice da svatko dolazi sa svojom jedinstvenom životnom pričom.
                </p>
              </div>
            </div>
          </div>

          <div className="am-list" data-reveal>
            <div className="am-papir">
              <Iskrica className="am-papir-znak" />
              <div className="am-list-popis">
                <p className="oznaka zanimanja-naslov">Što me još ispunjava</p>
                <ul className="am-zanimanja">
                  {zanimanja.map((z) => (
                    <li key={z}>
                      <Iskrica />
                      {z}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mut am-list-tekst">
                Posebno me privlači istraživanje obiteljskih korijena, priča predaka, sakralnih prostora i kulturne baštine.
                Zanimaju me priroda i planinarenje, osobito jesen, kada priroda na poseban način podsjeća na cikluse života,
                promjene i obnovu. Veliko zadovoljstvo pronalazim i u aromaterapiji te upoznavanju biljaka i prepoznavanju
                gljiva.
              </p>
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
              AlBa Centar nastao je kao prostor u kojem želim povezati svoja profesionalna iskustva, interes za ljudske
              odnose, obiteljske korijene i osobni razvoj. Želim stvoriti mjesto na kojem ljudi mogu zastati, postaviti
              pitanja koja možda dugo nose u sebi i istražiti odnose koji su im važni.
            </p>
            <p data-reveal style={kas(0.5)}>
              Ne vjerujem u gotove recepte za tuđi život. Vjerujem u važnost osobne odgovornosti, slobode izbora i
              mogućnosti da čovjek, uz bolje razumijevanje svoje prošlosti, svjesnije oblikuje svoju budućnost.
            </p>
          </div>
          <Ornament />
        </div>
      </section>

      <Poziv />
    </>
  );
}

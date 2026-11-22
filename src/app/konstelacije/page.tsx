import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Glava from "@/components/Glava";
import Naslov from "@/components/Naslov";
import Ornament from "@/components/Ornament";
import Poziv from "@/components/Poziv";
import Teme from "@/components/Teme";
import Zvijezde from "@/components/Zvijezde";
import PoljeSila from "@/components/konstelacije/PoljeSila";
import Skole from "@/components/konstelacije/Skole";
import Tijek from "@/components/konstelacije/Tijek";
import TriNacela from "@/components/konstelacije/TriNacela";
import { LukKrug, Pomrcina, Ruza, ZivotniLuk } from "@/components/konstelacije/Ukrasi";
import { ZvjezdaniTonovi } from "@/components/konstelacije/Zvijezdja";
import { nasRad, zaKoga } from "@/content/konstelacije";
import { kas } from "@/lib/util";

export const metadata: Metadata = {
  title: "Obiteljske i sistemske konstelacije",
  description:
    "Što su obiteljske i sistemske konstelacije, kako funkcionira konstelacijski rad, tri temeljna načela Hellingerova pristupa te za koga konstelacije jesu, a za koga nisu.",
  alternates: { canonical: "/konstelacije" },
};

const koraci = [
  {
    naslov: "Tema",
    tekst:
      "Konstelacijski rad počinje temom koju osoba želi istražiti. To može biti određeni odnos, životna odluka, ponavljajuća situacija ili osjećaj koji se teško objašnjava.",
  },
  {
    naslov: "Postav",
    tekst:
      "U grupnom radu sudionici mogu preuzeti uloge predstavnika članova obitelji ili elemenata sustava. U individualnom radu koriste se figure, simboli ili prostorni raspored.",
  },
  {
    naslov: "Promatranje",
    tekst:
      "Tijekom rada promatraju se odnosi, položaji, osjećaji i doživljaji sudionika. Oni mogu otvoriti novu perspektivu na temu koja se istražuje.",
  },
];

export default function Konstelacije() {
  return (
    <>
      <Glava
        oznaka="Obiteljske i sistemske konstelacije"
        naslov="Što su obiteljske *konstelacije?*"
        uvod="Iskustveni pristup kojim se istražuju odnosi unutar obiteljskih i drugih životnih sustava. Omogućuju da određenu situaciju pogledamo iz šire perspektive."
      />

      {/* zajednički prijelazi boja za zvijezde u noćnim prizorima stranice */}
      <ZvjezdaniTonovi />

      {/* ---------- što su: jutro nakon noći iz glave; luk sa slikom stoji u kružnicama astrolaba ---------- */}
      <section className="sek zrno ks-uvodna">
        <div className="w dvostupac">
          <div className="proza ks-proza">
            <p className="uvod" data-reveal>
              Svatko od nas pripada određenim sustavima. Prvi i najvažniji sustav u kojem se razvijamo jest obitelj.
            </p>
            <p className="mut" data-reveal style={kas(0.08)}>
              U njoj učimo prve odnose, upoznajemo ljubav i pripadnost, razvijamo osjećaj sigurnosti, usvajamo vrijednosti
              i oblikujemo sliku o sebi i svijetu. Obitelj nije samo skup pojedinaca. Ona je mreža međusobnih odnosa,
              događaja, iskustava i veza koje se razvijaju kroz generacije.
            </p>
            <p className="mut" data-reveal style={kas(0.14)}>
              U svakoj obiteljskoj povijesti postoje različite sudbine. Ljudi koji su voljeli i bili voljeni, oni koji su
              gradili obitelj, oni koji su otišli, izgubili nekoga, doživjeli nepravdu, bili zaboravljeni ili ostali izvan
              obiteljskih razgovora.
            </p>
            <p className="istaknuto ks-ist" data-reveal style={kas(0.2)}>
              Neke priče poznajemo. O drugima znamo vrlo malo. Neke su se prenosile generacijama, dok su druge ostale
              skrivene u šutnji.
            </p>
            <p className="mut" data-reveal style={kas(0.26)}>
              Konstelacijski rad povezuje se s radom njemačkog terapeuta i autora Berta Hellingera, koji je razvio vlastiti
              pristup obiteljskim konstelacijama i značajno utjecao na njihovo širenje. U konstelacijskom radu ne polazi se
              od pretpostavke da unaprijed znamo odgovor. Polazi se od pitanja, životne situacije i spremnosti osobe da
              istraži ono što joj je važno.
            </p>
          </div>
          <div className="ks-luk">
            <LukKrug />
            <div className="luk luk-visok" data-reveal="luk" data-parallax>
              <Image src="/img/luk-dobi.jpg" alt="Caspar David Friedrich, Životne dobi (oko 1834.): starac, odrasli i djeca na obali gledaju brodove u sutonu" fill sizes="(max-width: 900px) 80vw, 480px" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- životne teme: kazalo i list papira s temama ---------- */}
      <section className="sek pijesak zrno ks-teme" id="teme">
        <div className="w">
          <div className="zaglavlje">
            <div>
              <p className="oz" data-reveal>
                Obrasci koji se ponavljaju
              </p>
              <Naslov>{"Koje životne teme\nmožemo *istraživati?*"}</Naslov>
            </div>
          </div>
          <div className="ks-teme-tijelo">
            <Teme />
            <Ruza />
          </div>
          <p className="napomena" data-reveal style={{ marginTop: 34, maxWidth: 760 }}>
            Ovi primjeri nisu dijagnoze niti dokaz da je uzrok teškoća u obiteljskom nasljeđu. Oni su moguća polazišta za
            osobno istraživanje.
          </p>
        </div>
      </section>

      {/* ---------- kako funkcionira: tri gravure (tema, postav, promatranje) na jednoj niti ---------- */}
      <section className="sek zrno ks-kako" id="kako">
        <div className="w">
          <div className="sredina uska-glava">
            <p className="oz" data-reveal>
              Tijek rada
            </p>
            <Naslov>{"Kako funkcionira *konstelacijski rad?*"}</Naslov>
          </div>
          <Tijek koraci={koraci} />
          <div className="dvije-napomene">
            <p className="napomena" data-reveal>
              Važno je razumjeti da iskustva predstavnika nisu dokaz stvarnih događaja iz prošlosti niti zamjena za
              provjerljive obiteljske činjenice.
            </p>
            <p className="napomena" data-reveal style={kas(0.1)}>
              Konstelacija ne daje unaprijed određene odgovore i ne jamči određeni ishod. Ona može biti poticaj za
              razmišljanje, razumijevanje i donošenje vlastitih odluka.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- tri načela: sumrak pa noć, tri zviježđa s naslovnice uz cijeli tekst, na dnu svitanje ---------- */}
      <section className="ks-nebo noc" id="nacela" aria-label="Tri temeljna načela Hellingerova pristupa">
        <TriNacela />
      </section>

      {/* ---------- Bert Hellinger: životni luk nad godinama ---------- */}
      <section className="sek zrno ks-hellinger" id="hellinger">
        <div className="w hellinger">
          <div className="hellinger-lijevo">
            <p className="oz" data-reveal>
              Utemeljitelj pristupa
            </p>
            <Naslov>{"Tko je bio\n*Bert Hellinger?*"}</Naslov>
            <div className="ks-zivot" data-reveal style={kas(0.2)}>
              <ZivotniLuk />
              <p className="hellinger-godine" aria-label="1925. do 2019.">
                <span>1925</span>
                <i />
                <span>2019</span>
              </p>
            </div>
          </div>
          <div className="proza ks-proza">
            <p className="uvod" data-reveal>
              Bert Hellinger bio je njemački autor i utemeljitelj pristupa obiteljskim konstelacijama.
            </p>
            <p className="mut" data-reveal style={kas(0.08)}>
              Njegov životni put bio je obilježen različitim iskustvima i profesionalnim ulogama. Bio je katolički svećenik,
              član redovničke zajednice i misionar u Južnoj Africi, gdje je proveo dio života radeći s lokalnom zajednicom.
            </p>
            <p className="mut" data-reveal style={kas(0.14)}>
              Nakon povratka u Europu posvetio se psihoterapijskom i savjetodavnom radu te istraživanju obiteljskih odnosa,
              grupne dinamike i načina na koje pojedinac doživljava pripadnost. Razvio je pristup koji je nazvao obiteljskim
              konstelacijama, a kasnije je govorio i o pokretima duše i pokretima duha.
            </p>
            <p className="mut" data-reveal style={kas(0.2)}>
              Njegov rad ostavio je snažan utjecaj na područje konstelacijskog rada, ali su neke njegove postavke i
              tumačenja predmet stručnih rasprava i kritika. Za razumijevanje njegova pristupa važno je razlikovati
              iskustvenu i filozofsku dimenziju konstelacija od znanstveno potvrđenih psiholoških objašnjenja.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- zašto nisu sve iste: iste zvijezde, tri različita zviježđa ---------- */}
      <section className="sek pijesak zrno ks-razlike" id="razlike">
        <div className="w dvostupac dvostupac-obrnuto">
          <div className="sticky-stupac">
            <p className="oz" data-reveal>
              Pristup
            </p>
            <Naslov>{"Zašto nisu sve konstelacije *iste?*"}</Naslov>
            <div className="ks-skole-okvir" data-reveal style={kas(0.2)}>
              <Skole />
            </div>
          </div>
          <div className="proza ks-proza">
            <p className="uvod" data-reveal>
              Danas postoji više pravaca i škola konstelacijskog rada. Iako se koriste sličnim tehnikama, ne polaze svi od
              istih filozofskih pretpostavki i načina rada.
            </p>
            <p className="mut" data-reveal style={kas(0.08)}>
              Razlika nije samo u tome kako se konstelacija postavlja, nego i u tome kako konstelator razumije ulogu
              pojedinca, obitelji, pripadnosti, odgovornosti i odnosa prema prošlosti.
            </p>
            <p className="mut" data-reveal style={kas(0.14)}>
              Hellingerov pristup posebno naglašava promatranje obiteljskog sustava, pripadnost, red i ravnotežu davanja i
              primanja. Važno mjesto zauzima fenomenološki pristup: nastojanje da se situacija promatra bez unaprijed
              donesenih zaključaka i nametanja vlastitih objašnjenja.
            </p>
            <p className="mut" data-reveal style={kas(0.2)}>
              Konstelator ne bi trebao unaprijed određivati što se dogodilo, tko je kriv ili što osoba mora učiniti. Njegova
              je uloga voditi proces, promatrati i stvarati prostor za istraživanje.
            </p>
            <p className="red" data-reveal style={kas(0.26)}>
              <Link className="link" href="/blog/konstelacije-prema-bertu-hellingeru">
                Pročitajte cijeli tekst o Hellingerovu pristupu <span className="str" aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- veliki citat: polje čije strujnice same obilaze tekst ---------- */}
      <section className="ploca noc citat-ploca ks-citat">
        <Zvijezde gustoca={0.7} />
        <PoljeSila className="ks-ps ks-ps-sir" sirina={1600} visina={720} a={590} b={236} />
        <PoljeSila className="ks-ps ks-ps-uzak" sirina={520} visina={900} a={330} b={292} linija={18} />
        <div className="w sredina">
          <Ornament />
          <Naslov as="p" className="citat-velik">
            {"Ne upravljamo poljem, nego dopuštamo\nda *polje vodi nas.*"}
          </Naslov>
          <p className="mut" data-reveal style={kas(0.5)}>
            To je srž fenomenološkog pristupa. Konstelator ulazi u rad bez svoje teorije o tome što je uzrok problema, bez
            pretpostavki i bez pokušaja postizanja određenog ishoda.
          </p>
        </div>
      </section>

      {/* ---------- za koga jesu (dan), što nisu (noćna ploča s pomrčinom: sjena se odmakne sa Sunca) ---------- */}
      <section className="sek zrno ks-zakoga" id="za-koga">
        <div className="w za-koga">
          <div>
            <p className="oz" data-reveal>
              Za koga jesu
            </p>
            <Naslov as="h2">{"Konstelacijski rad može biti zanimljiv osobama *koje:*"}</Naslov>
            <ul className="popis-fig za-koga-popis">
              {zaKoga.map((z, i) => (
                <li key={z} data-reveal style={kas(i * 0.05)}>
                  <span className="fig" />
                  {z}
                </li>
              ))}
            </ul>
          </div>
          <aside className="kartica nisu ks-nisu" data-reveal>
            <div className="ks-nisu-nebo" aria-hidden="true">
              <Zvijezde gustoca={0.7} padalice={false} />
            </div>
            <Pomrcina />
            <p className="oz">Što konstelacije nisu</p>
            <h3>Nisu čarobno rješenje.</h3>
            <p>
              Konstelacije nisu čarobno rješenje za životne probleme. Nisu proricanje, dijagnostika, čitanje misli niti način
              utvrđivanja povijesnih činjenica.
            </p>
            <p>
              One ne mogu zamijeniti medicinsku pomoć, psihoterapiju ili druge stručne oblike podrške kada su oni potrebni.
            </p>
            <p>
              Konstelator ne bi smio nametati odluke, obećavati iscjeljenje, stvarati osjećaj krivnje ili osobu uvjeravati
              da zna što se dogodilo u njezinoj obitelji.
            </p>
            <p className="nisu-kraj">
              Konstelacije nisu prikladne kao zamjena za hitnu psihološku ili psihijatrijsku pomoć, niti za liječenje
              bolesti. Osobama koje prolaze kroz akutnu psihičku krizu potreban je odgovarajući stručni oblik podrške.
            </p>
          </aside>
        </div>
      </section>

      {/* ---------- naš rad: šest stavki kao list iz bilježnice ---------- */}
      <section className="sek pijesak zrno ks-nasrad" id="nas-rad">
        <div className="w">
          <div className="sredina uska-glava">
            <p className="oz" data-reveal>
              AlBa Centar
            </p>
            <Naslov>{"Što to znači za *naš rad?*"}</Naslov>
            <p className="mut uvod" data-reveal style={kas(0.25)}>
              Konstelacijski rad promatramo kao prostor istraživanja obiteljskih i sistemskih odnosa, vlastitih životnih
              obrazaca i povezanosti koje mogu utjecati na našu svakodnevicu. Inspirirani Hellingerovim pristupom, posebnu
              pozornost posvećujemo:
            </p>
          </div>
          <ol className="nas-rad">
            {nasRad.map((n, i) => (
              <li key={n} data-reveal style={kas((i % 3) * 0.1)}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {n.charAt(0).toUpperCase() + n.slice(1)}.
              </li>
            ))}
          </ol>
          <div className="nas-rad-kraj proza" data-reveal>
            <p>
              Ne obećavamo unaprijed određene rezultate niti tvrdimo da konstelacije mogu riješiti sve životne teškoće.
              Smatramo ih jednim od mogućih načina osobnog istraživanja koji može otvoriti nova pitanja, perspektive i
              potaknuti osobu na promišljanje vlastitih izbora.
            </p>
            <p className="istaknuto ks-ist-sred">
              Jer nije uvijek potrebno promijeniti sve oko sebe. Ponekad je prvi korak promjene u tome da jasnije vidimo
              svoje mjesto, svoje odnose i ono što zaista pripada našem životu.
            </p>
          </div>
        </div>
      </section>

      <Poziv naPijesku naslov="Imate temu koju želite *istražiti?*" tekst="Sudjelovanje je uvijek dobrovoljno. Sami odlučujete koliko želite podijeliti i što ćete nakon susreta prihvatiti kao korisno za sebe." />
    </>
  );
}

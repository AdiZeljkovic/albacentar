import type { Metadata } from "next";
import Link from "next/link";
import Glava from "@/components/Glava";
import Naslov from "@/components/Naslov";
import Ornament from "@/components/Ornament";
import Zvijezde from "@/components/Zvijezde";
import VecernjiProzor from "@/components/knjige/VecernjiProzor";
import Oblaci from "@/components/pocetna/Oblaci";
import { kas } from "@/lib/util";

export const metadata: Metadata = {
  title: "Pratnja u završnom životnom razdoblju",
  description:
    "Prostor za osobno promišljanje i obiteljsku komunikaciju o važnim životnim pitanjima: razgovori s bliskima, osobne želje, obiteljske priče i poruke budućim generacijama.",
  alternates: { canonical: "/pratnja" },
};

const ukljucuje = [
  "Razgovore s bliskim osobama.",
  "Zapisivanje osobnih želja i važnih odluka.",
  "Uređivanje dokumentacije i obiteljskih obveza.",
  "Prijenos važnih obiteljskih priča i uspomena.",
  "Izražavanje zahvalnosti i izgovaranje neizgovorenih riječi.",
  "Promišljanje o željama vezanim uz oproštaj i posljednji ispraćaj.",
  "Ostavljanje poruka, pisama i vrijednosti budućim generacijama.",
];

export default function Pratnja() {
  return (
    <>
      <Glava
        oznaka="Pratnja u završnom životnom razdoblju"
        naslov="Dostojanstvo, mir i *važne životne odluke.*"
        uvod="Životni ciklus obuhvaća početke, promjene, rastanke i završetke."
      />

      {/* dan: miran tekst na papiru stranice, kasno svjetlo dolazi zdesna */}
      <section className="sek kg-pr-uvod">
        <div className="w kg-pr-mreza">
          <div className="kg-pr-naslov">
            <p className="oz" data-reveal>
              O čemu je riječ
            </p>
            <Naslov>{"Razgovor koji često *odgađamo.*"}</Naslov>
          </div>
          <div className="kg-pr-proza">
            <p className="kg-pr-prvi" data-reveal>
              Razgovor o završnom životnom razdoblju često odgađamo jer nas podsjeća na prolaznost, gubitak i neizvjesnost.
              Ipak, upravo pravovremeno promišljanje o važnim životnim pitanjima može donijeti više jasnoće i mira.
            </p>
            <p className="mut" data-reveal style={kas(0.08)}>
              U kontekstu osobne i obiteljske odgovornosti važno je razmisliti o stvarima koje želimo urediti, izgovoriti
              ili ostaviti iza sebe.
            </p>
            <p className="kg-pr-hellinger" data-reveal style={kas(0.14)}>
              U ovom području nadahnjuje me promišljanje o životu, smrti i obiteljskim odnosima kakvo se pojavljuje u
              Hellingerovu radu.
            </p>
          </div>
        </div>
      </section>

      {/* predvečerje: prozor u sumrak sa svijećom na dasci; uz njega ono što pratnja može uključivati */}
      <section className="sek kg-pr-vecer">
        <div className="w kg-pr-dva">
          <div className="kg-vecer-stupac">
            <VecernjiProzor />
          </div>
          <div className="kg-pr-sadrzaj">
            <p className="oz" data-reveal>
              To može uključivati
            </p>
            <Naslov>{"Ono što želimo urediti, izgovoriti ili *ostaviti iza sebe.*"}</Naslov>
            <ol className="kg-pr-popis">
              {ukljucuje.map((u, i) => (
                <li key={u} data-reveal style={kas((i % 4) * 0.07)}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {u}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="w">
          <p className="napomena kg-pr-napomena" data-reveal>
            Važno je naglasiti da ovakav sadržaj nije medicinska, palijativna, psihološka ili pravna usluga. Riječ je o
            prostoru za osobno promišljanje i obiteljsku komunikaciju.
          </p>
        </div>
      </section>

      {/* sumrak iz prozora ovdje postaje nebo stranice i prelazi u noć podnožja */}
      <section className="poziv bez-razmaka">
        <Oblaci id="kg-pzo" className="poziv-oblaci" boja={[1, 0.9, 0.78]} sjena={[0.86, 0.38, 0.32]} sjeme={23} gustoca={3.2} />
        <div className="poziv-zvijezde" aria-hidden="true">
          <Zvijezde gustoca={0.7} padalice={false} />
        </div>
        <div className="w">
          <Ornament />
          <Naslov>{"Neke razgovore vrijedi započeti\n*dok još imamo vremena.*"}</Naslov>
          <div className="gumbi" data-reveal style={kas(0.4)}>
            <Link className="btn btn-zlato" href="/kontakt">
              Pošaljite upit
            </Link>
            <Link className="btn btn-svijetlo" href="/konzultacije">
              Individualne konzultacije
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

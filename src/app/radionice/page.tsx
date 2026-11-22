import type { Metadata } from "next";
import Glava from "@/components/Glava";
import Naslov from "@/components/Naslov";
import Poziv from "@/components/Poziv";
import PrijelazUDan from "@/components/PrijelazUDan";
import MjesecevKalendar from "@/components/pocetna/Radionice";
import Zvijezde from "@/components/Zvijezde";
import PrijavaRadionica from "@/components/forme/PrijavaRadionica";
import { nadolazeciTermini, temeEdukacija, terminiSuPrimjer } from "@/content/rad";
import { kas } from "@/lib/util";

export const metadata: Metadata = {
  title: "Radionice i edukacije",
  description:
    "Grupne radionice obiteljskih konstelacija prema pristupu Berta Hellingera i edukacije o obiteljskim sustavima. Pogledajte termine i prijavite se s vlastitom temom ili kao predstavnik.",
  alternates: { canonical: "/radionice" },
};

// Prošli termini sami nestaju s popisa.
export const revalidate = 3600;

export default function Radionice() {
  const termini = nadolazeciTermini();

  return (
    <>
      <Glava
        oznaka="Radionice i edukacije"
        naslov="Učenje koje otvara *nova pitanja.*"
        uvod="Kada bolje razumijemo odnose, obiteljske sustave i vlastite obrasce, dobivamo priliku promatrati svakodnevne situacije iz drukčije perspektive."
        dno="noc"
      />

      {/* noć iz glave nastavlja se u mjesečev kalendar termina, pa preko grebena i magle prelazi u dan */}
      <section className="mjesecina noc" id="termini">
        <div className="mj-zvijezde" aria-hidden="true">
          <Zvijezde gustoca={1.2} bogato />
        </div>
        <MjesecevKalendar
          termini={termini}
          primjer={terminiSuPrimjer}
          oznaka="Grupne konstelacije"
          naslov="Nadolazeći *termini*"
          uvod="Sudjelovati možete s vlastitom temom ili kao predstavnik u tuđoj konstelaciji."
          sveTermine={false}
        />
      </section>
      <PrijelazUDan id="rp" />

      <section className="sek" id="prijava">
        <div className="w">
          <div className="zaglavlje">
            <div>
              <p className="oz" data-reveal>
                Prijava
              </p>
              <Naslov>{"Prijavite se u *četiri koraka.*"}</Naslov>
            </div>
            <p className="mut zaglavlje-tekst" data-reveal>
              Bez dopisivanja u inboxu. Nakon prijave stižu vam potvrda, lokacija i uvjeti sudjelovanja.
            </p>
          </div>
          <PrijavaRadionica termini={termini} />
        </div>
      </section>

      <section className="sek pijesak" id="edukacije">
        <div className="w edukacije">
          <div className="sticky-stupac">
            <p className="oz" data-reveal>
              Edukacije
            </p>
            <Naslov>{"Teme koje *obrađujemo.*"}</Naslov>
            <div className="proza" data-reveal style={kas(0.25)}>
              <p className="mut">
                AlBa Centar razvija edukativne sadržaje i radionice povezane s obiteljskim i sistemskim konstelacijama,
                međuljudskim odnosima i osobnim razvojem.
              </p>
              <p className="mut">
                Radionice mogu biti edukativne, razgovorne i iskustvene, ovisno o temi i načinu organizacije.
              </p>
              <p className="istaknuto">
                Naš cilj nije ponuditi gotove odgovore, nego potaknuti razumijevanje, osvještavanje i odgovornije donošenje
                vlastitih odluka.
              </p>
            </div>
          </div>
          <ol className="edukacije-popis">
            {temeEdukacija.map((t, i) => (
              <li key={t} data-reveal style={kas(Math.min(i, 5) * 0.05)}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Poziv naPijesku />
    </>
  );
}

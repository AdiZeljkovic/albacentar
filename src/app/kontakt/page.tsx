import type { Metadata } from "next";
import Glava from "@/components/Glava";
import KopirajUpit from "@/components/KopirajUpit";
import Naslov from "@/components/Naslov";
import Ornament from "@/components/Ornament";
import Zvijezde from "@/components/Zvijezde";
import KontaktForma from "@/components/forme/KontaktForma";
import ZaglavljePisma, { Omotnica } from "@/components/konzultacije/Pismo";
import Vrata, { DJELA, VrataDefs } from "@/components/konzultacije/Vrata";
import Oblaci from "@/components/pocetna/Oblaci";
import { zrake } from "@/lib/krajolik";
import { site } from "@/lib/site";
import { kas } from "@/lib/util";

export const metadata: Metadata = {
  title: "Kontakt i naručivanje",
  description:
    "Pošaljite upit za individualni rad, grupne konstelacije, online susrete, konzultacije i edukacije. Odgovaramo na svaku poruku.",
  alternates: { canonical: "/kontakt" },
};

const PISMO = "/img/vrata-pismo.jpg";

export default function Kontakt() {
  return (
    <>
      <Glava
        oznaka="Kontakt i naručivanje"
        naslov="Vaša priča zaslužuje *biti saslušana.*"
        uvod="Možda imate pitanje koje dugo nosite u sebi. Možda primjećujete obrazac koji se ponavlja u vašim odnosima. Možda želite bolje razumjeti svoju obiteljsku povijest ili jednostavno istražiti vlastiti životni put."
      />

      {/* ---------- pismo: jutro kraj otvorenog prozora. Lijevo vrata s Vermeerovom čitačicom, desno list papira ---------- */}
      <section className="sek kt-pismo" id="obrazac">
        <div className="kt-nebo" aria-hidden="true">
          <i className="kz-sunce">
            <i className="kz-zrake" style={{ background: zrake(19, "232 176 92", 0.2) }} />
          </i>
          <Oblaci id="kto" className="kz-oblaci" boja={[1, 1, 1]} sjena={[0.78, 0.62, 0.42]} sjeme={21} gustoca={3.1} />
        </div>
        <VrataDefs />

        <div className="w kontakt">
          <div className="kt-lijevo">
            <p className="oz" data-reveal>
              Naručivanje i informacije
            </p>
            <Naslov>{"Prvi korak ne mora\nbiti *velik.*"}</Naslov>
            <div className="proza" data-reveal style={kas(0.25)}>
              <p className="uvod">Može započeti jednim pitanjem, razgovorom ili odlukom da odvojite vrijeme za sebe.</p>
              <p className="mut">
                Za individualni rad, grupne konstelacije, online susrete, konzultacije i edukacije pošaljite upit. Javite
                nam se i zajedno ćemo razmotriti koji bi oblik rada odgovarao vašoj temi.
              </p>
            </div>

            <div className="kt-uz-vrata">
              <div className="kt-vrata">
                <div className="kt-vrata-okvir">
                  <Vrata slika={PISMO} dan sizes="(max-width: 640px) 62vw, 250px" />
                </div>
                <p className="kz-djelo">{DJELA[PISMO]}</p>
              </div>

              <dl className="kontakt-podaci">
                {site.company && (
                  <div data-reveal>
                    <dt>Naziv tvrtke</dt>
                    <dd>{site.company}</dd>
                  </div>
                )}
                <div data-reveal>
                  <dt>E-mail</dt>
                  <dd>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
                {site.phone && (
                  <div data-reveal>
                    <dt>Telefon</dt>
                    <dd>
                      <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>
                    </dd>
                  </div>
                )}
                <div data-reveal>
                  <dt>Facebook</dt>
                  <dd>
                    <a href={site.facebook} target="_blank" rel="noopener noreferrer">
                      {site.facebookName}
                    </a>
                  </dd>
                </div>
                {site.location && (
                  <div data-reveal>
                    <dt>Mjesto</dt>
                    <dd>{site.location}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="kt-list-drzac" data-reveal style={kas(0.15)}>
            <Omotnica />
            <div className="kt-list">
              <ZaglavljePisma />
              <KontaktForma />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- suton: dan stranice prelazi u noć podnožja; tko radije piše sam, ovdje uzima predložak ---------- */}
      <section className="kt-suton noc" aria-label="Predložak upita">
        <Oblaci id="kts" className="kt-suton-oblaci" boja={[1, 0.9, 0.78]} sjena={[0.86, 0.38, 0.32]} sjeme={14} gustoca={3.2} />
        <div className="kt-suton-zvijezde" aria-hidden="true">
          <Zvijezde gustoca={0.9} bogato padalice={false} />
        </div>
        <div className="w">
          <Ornament />
          <div className="kontakt-kopiraj" data-reveal>
            <p className="sitno">Radije pišete iz svog e-maila ili Messengera? Kopirajte gotov predložak upita.</p>
            <KopirajUpit />
          </div>
        </div>
      </section>
    </>
  );
}

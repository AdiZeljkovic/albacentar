import type { Metadata } from "next";
import Image from "next/image";
import Glava from "@/components/Glava";
import Ornament from "@/components/Ornament";
import KrajDana from "@/components/knjige/KrajDana";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Zaštita privatnosti",
  description: "Koje podatke AlBa Centar prikuplja putem ove stranice, zašto i koliko ih dugo čuva.",
  alternates: { canonical: "/privatnost" },
};

export default function Privatnost() {
  return (
    <>
      <Glava oznaka="Zaštita privatnosti" naslov="Vaši podaci ostaju *vaši.*" uvod="Kratko i jasno: što prikupljamo, zašto i koja su vaša prava." prsten={false} />

      {/* dokument: list papira sa zaglavljem, točke su numerirane u margini */}
      <section className="sek kg-pravni-sek">
        <div className="uska">
          <article className="kg-arak">
            <Image className="kg-arak-znak" src="/img/logo-tamni.png" alt="" width={805} height={372} sizes="160px" loading="eager" />
            <div className="kg-pravni">
              <section>
                <h2>Tko upravlja podacima</h2>
                <p>
                  Voditelj obrade osobnih podataka je {site.company || site.name}. Za sva pitanja o privatnosti pišite na{" "}
                  <a href={`mailto:${site.email}`}>{site.email}</a>.
                </p>
              </section>

              <section>
                <h2>Koje podatke prikupljamo</h2>
                <p>Prikupljamo samo ono što sami upišete u obrasce na stranici:</p>
                <ul>
                  <li>ime i prezime, e-mail adresu i, ako ga navedete, broj telefona;</li>
                  <li>odabranu radionicu, vrstu susreta ili željeni termin;</li>
                  <li>sadržaj poruke ili napomene koju nam pošaljete.</li>
                </ul>
              </section>

              <section>
                <h2>Zašto ih prikupljamo</h2>
                <p>
                  Podatke koristimo isključivo kako bismo odgovorili na vaš upit, potvrdili prijavu na radionicu, dogovorili
                  termin ili vas, na vaš zahtjev, obavijestili o izlasku knjiga. Ne koristimo ih za oglašavanje i ne
                  prosljeđujemo ih trećim stranama, osim pružatelju usluge slanja e-pošte koji poruku tehnički dostavlja.
                </p>
              </section>

              <section>
                <h2>Povjerljivost</h2>
                <p>
                  Sve što napišete o svojoj temi vidi samo voditeljica. Sve što se iznese na susretu ostaje u intimi
                  konstelacije, s punim poštovanjem i povjerljivošću.
                </p>
              </section>

              <section>
                <h2>Koliko dugo čuvamo podatke</h2>
                <p>
                  Upite i prijave čuvamo onoliko koliko je potrebno za dogovor i održavanje susreta te ispunjenje zakonskih
                  obveza. Nakon toga ih brišemo.
                </p>
              </section>

              <section>
                <h2>Vaša prava</h2>
                <p>
                  U svakom trenutku možete zatražiti uvid u svoje podatke, njihov ispravak ili brisanje te povući privolu.
                  Dovoljno je poslati poruku na <a href={`mailto:${site.email}`}>{site.email}</a>. Imate pravo podnijeti i
                  prigovor Agenciji za zaštitu osobnih podataka (AZOP).
                </p>
              </section>

              <section>
                <h2>Kolačići</h2>
                <p>Stranica ne koristi kolačiće za praćenje ni oglašavanje.</p>
              </section>
            </div>
            <Ornament />
          </article>
        </div>
      </section>

      {/* stranica nema završni poziv, pa je ovdje kratak sumrak koji papir prevodi u noć podnožja */}
      <KrajDana />
    </>
  );
}

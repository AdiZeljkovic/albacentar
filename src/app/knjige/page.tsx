import type { Metadata } from "next";
import Glava from "@/components/Glava";
import Ornament from "@/components/Ornament";
import Poziv from "@/components/Poziv";
import PrijelazUDan from "@/components/PrijelazUDan";
import ObavijestKnjige from "@/components/forme/ObavijestKnjige";
import { Ptica } from "@/components/knjige/Dijelovi";
import Korijeni from "@/components/knjige/Korijeni";
import Niti from "@/components/knjige/Niti";
import { knjige, knjigeDostupnost } from "@/content/knjige";

export const metadata: Metadata = {
  title: "Knjige i publikacije",
  description:
    "„Korijeni i krila”, obiteljska knjiga uspomena i nasljeđa, i „Nevidljive niti”, edukativna knjižica o obiteljskim konstelacijama i transgeneracijskom nasljeđu.",
  alternates: { canonical: "/knjige" },
};

/** Ptice iz čitaonice u jutru nad obrascem: visina leta, trajanje, kašnjenje i veličina. */
const JUTARNJE_PTICE = [
  { "--y": "22%", "--t": "46s", "--d": "-12s", "--v": 0.9 },
  { "--y": "38%", "--t": "56s", "--d": "-34s", "--v": 0.65 },
  { "--y": "14%", "--t": "50s", "--d": "-25s", "--v": 0.75 },
];

export default function Knjige() {
  return (
    <>
      <Glava
        oznaka={
          <>
            Knjige i publikacije <span className="primjer">u pripremi</span>
          </>
        }
        naslov="Priče koje vrijedi *sačuvati.*"
        uvod="Obiteljska povijest mnogo je više od imena i datuma. Ona je zbirka životnih priča, uspomena, odluka, vrijednosti i iskustava koja oblikuju identitet jedne obitelji."
        dno="noc"
      />

      {/* noć iz glave ulazi u čitaonicu: „Korijeni i krila" na stolu uz svijeću, korijenje raste pod stol */}
      <Korijeni
        uvod={
          <>
            Kroz knjige i publikacije AlBa Centra želimo potaknuti ljude da istraže svoje korijene, zabilježe priče svojih
            predaka i sačuvaju uspomene za buduće generacije.
          </>
        }
      />

      {/* iz tame pod stolom izlazi se pod noćno nebo: „Nevidljive niti" kao zviježđe; zatim sviće */}
      <Niti />
      <PrijelazUDan id="kg-pd" />

      {/* jutro: list papira s obrascem, nad njim ptice iz čitaonice */}
      <section className="sek kg-obavijest" id="obavijest">
        <div className="kg-jutro" aria-hidden="true">
          {JUTARNJE_PTICE.map((p) => (
            <Ptica key={p["--d"]} klasa="mj-ptica vd-ptica" stil={p} boja="#6b5544" />
          ))}
        </div>
        <div className="uska">
          <div className="kartica obavijest-kartica kg-list" data-reveal>
            <i className="kg-vrpca" aria-hidden="true" />
            <Ornament />
            <h2>Javit ćemo vam kad izađu.</h2>
            <p className="mut">{knjigeDostupnost} Ostavite e-mail i javit ćemo vam se čim knjige budu dostupne.</p>
            <ObavijestKnjige naslovi={knjige.map((k) => k.naslov)} />
          </div>
        </div>
      </section>

      <Poziv bezRazmaka />
    </>
  );
}

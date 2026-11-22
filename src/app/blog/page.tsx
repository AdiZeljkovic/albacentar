import type { Metadata } from "next";
import BlogMreza from "@/components/BlogMreza";
import Glava from "@/components/Glava";
import Poziv from "@/components/Poziv";
import { LampionCrtezi } from "@/components/blog/Lampion";
import { Nebo, Polje } from "@/components/blog/Nebo";
import { kategorije, sviClanci } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog: iz obiteljskog polja",
  description:
    "Tekstovi o obiteljskim odnosima, pripadnosti, Hellingerovu pristupu i obrascima koji se ponavljaju kroz generacije.",
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  const clanci = sviClanci().map(({ html: _html, ...ostalo }) => ostalo);

  return (
    <>
      <Glava
        oznaka="Blog"
        naslov="Iz obiteljskog *polja*"
        uvod="Tekstovi o obiteljskim odnosima, pripadnosti i obrascima koji se ponavljaju kroz generacije."
        dno="noc"
      />
      {/* noć iz glave prelazi u plavi sat pred zoru: tekstovi su lampioni nad poljem, a magla na dnu vodi u dan */}
      <section className="sek blog-stranica bl-nebo noc">
        <LampionCrtezi />
        <Nebo />
        <div className="w bl-in">
          <BlogMreza clanci={clanci} kategorije={kategorije()} />
        </div>
        <Polje />
      </section>
      <Poziv bezRazmaka />
    </>
  );
}

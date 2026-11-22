import type { Metadata } from "next";
import Glava from "@/components/Glava";
import Vedro from "@/components/pocetna/Vedro";
import Poziv from "@/components/Poziv";
import { pitanja } from "@/content/pitanja";

export const metadata: Metadata = {
  title: "Česta pitanja",
  description:
    "Odgovori na najčešća pitanja o obiteljskim konstelacijama: priprema, privatnost, trajanje, online sudjelovanje i rezervacija termina.",
  alternates: { canonical: "/cesta-pitanja" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pitanja.map((p) => ({
    "@type": "Question",
    name: p.p,
    acceptedAnswer: { "@type": "Answer", text: p.o },
  })),
};

export default function CestaPitanja() {
  return (
    <>
      <Glava
        oznaka="Česta pitanja"
        naslov="Prije nego što *dođete.*"
        uvod="Sudjelovanje je uvijek dobrovoljno. Sami odlučujete koliko želite podijeliti i što ćete nakon susreta prihvatiti kao korisno za sebe."
      />
      {/* isti prizor kao na naslovnici: vedro jutro i staza na kojoj je svako pitanje postaja */}
      <section className="vedro zrno vedro-sve">
        <Vedro sve />
      </section>
      <Poziv bezRazmaka naslov="Niste pronašli *svoje pitanje?*" tekst="Pišite nam. Odgovaramo na svaku poruku." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

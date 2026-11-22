import Link from "next/link";
import Naslov from "../Naslov";
import Pokazivac from "../Pokazivac";
import Zvijezde from "../Zvijezde";
import Polje from "./Polje";
import Svemir from "./Svemir";
import { kas } from "@/lib/util";

export default function Hero() {
  return (
    <section className="hero" id="hero" data-parallax>
      <Svemir okvir="hero" srediste="polje" />
      <Zvijezde gustoca={1.5} bogato />
      <Pokazivac cilj="hero" />

      <div className="w hero-in">
        <div className="hero-tekst">
          <p className="oz dolazi" style={kas(0.1)}>
            <span>AlBa Centar</span>
            <i aria-hidden="true">·</i>
            <span>Konstelacije</span>
            <i aria-hidden="true">·</i>
            <span>Edukacije</span>
            <i aria-hidden="true">·</i>
            <span>Konzultacije</span>
          </p>
          <Naslov as="h1" delay={0.2}>
            {"Vratiti svakome\n*njegovo mjesto.*"}
          </Naslov>
          <p className="hero-pod rukopis">
            <span>Uzeti svoj život. I krenuti naprijed.</span>
          </p>
          <p className="hero-uvod dolazi" style={kas(1.15)}>
            Obiteljske i sistemske konstelacije prema pristupu Berta Hellingera, individualno i u grupi. Za sve koji žele
            bolje razumjeti svoje obiteljske odnose i obrasce koji se ponavljaju kroz generacije.
          </p>
          <div className="gumbi dolazi" style={kas(1.3)}>
            <Link className="btn btn-zlato" href="/radionice#prijava">
              Prijava na radionicu
            </Link>
            <Link className="btn btn-svijetlo" href="/konzultacije">
              Individualni susret
            </Link>
          </div>
        </div>
        <Polje />
      </div>

      <a className="hero-dalje" href="#misao">
        Dalje
        <i aria-hidden="true" />
      </a>
    </section>
  );
}

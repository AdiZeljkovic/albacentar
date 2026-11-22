import Link from "next/link";
import Naslov from "./Naslov";
import Ornament from "./Ornament";
import Zvijezde from "./Zvijezde";
import Oblaci from "@/components/pocetna/Oblaci";
import { kas } from "@/lib/util";

type Props = {
  naslov?: string;
  tekst?: string;
  /** Zadržano radi starih poziva; razmak i podloga više ne ovise o njima. */
  bezRazmaka?: boolean;
  naPijesku?: boolean;
};

/**
 * Završni poziv na dnu unutarnjih stranica: dan stranice prelazi u sumrak pa u noć,
 * a noć se bez reza nastavlja u podnožje.
 */
export default function Poziv({
  naslov = "Vaša priča zaslužuje *biti saslušana.*",
  tekst = "Prvi korak ne mora biti velik. Može započeti jednim pitanjem, razgovorom ili odlukom da odvojite vrijeme za sebe.",
}: Props) {
  return (
    <section className="poziv">
      <Oblaci id="pzo" className="poziv-oblaci" boja={[1, 0.9, 0.78]} sjena={[0.86, 0.38, 0.32]} sjeme={8} gustoca={3.2} />
      <div className="poziv-zvijezde" aria-hidden="true">
        <Zvijezde gustoca={0.9} bogato padalice={false} />
      </div>
      <div className="w">
        <Ornament />
        <Naslov>{naslov}</Naslov>
        <p data-reveal style={kas(0.3)}>
          {tekst}
        </p>
        <div className="gumbi" data-reveal style={kas(0.42)}>
          <Link className="btn btn-zlato" href="/kontakt">
            Pošaljite upit
          </Link>
          <Link className="btn btn-svijetlo" href="/radionice">
            Radionice i termini
          </Link>
        </div>
      </div>
    </section>
  );
}
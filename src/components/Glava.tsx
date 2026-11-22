import type { ReactNode } from "react";
import Naslov from "./Naslov";
import Prsten from "./Prsten";
import Zvijezde from "./Zvijezde";
import Para from "@/components/pocetna/Para";
import { greben } from "@/lib/krajolik";
import { cx, kas } from "@/lib/util";

type Props = {
  oznaka: ReactNode;
  /** *Zvjezdice* označavaju zlatni kurziv. */
  naslov: string;
  uvod?: ReactNode;
  prsten?: boolean;
  /**
   * Što slijedi ispod glave. "dan" (zadano): svijetla sekcija, pa se noć preko grebena i magle
   * pretapa u nju. "noc": tamna sekcija, pa glava ostaje noć do kraja.
   */
  dno?: "dan" | "noc";
  children?: ReactNode;
};

/**
 * Glava unutarnjih stranica: isto noćno nebo kao na naslovnici. Na dnu su daleki grebeni
 * i jutarnja magla koja se zgušnjava u boju stranice, pa između glave i sadržaja nema reza.
 */
export default function Glava({ oznaka, naslov, uvod, prsten = true, dno = "dan", children }: Props) {
  return (
    <div className={cx("glava", dno === "noc" && "glava-noc")}>
      <div className="glava-zvijezde" aria-hidden="true">
        <Zvijezde gustoca={1} bogato />
      </div>
      {prsten && <Prsten className="glava-prsten" />}
      <div className="w">
        <div className="glava-in">
          <p className="oz" data-reveal>
            {oznaka}
          </p>
          <Naslov as="h1" delay={0.08}>
            {naslov}
          </Naslov>
          {uvod && (
            <p className="glava-uvod" data-reveal style={kas(0.38)}>
              {uvod}
            </p>
          )}
          {children}
        </div>
      </div>
      {dno === "dan" && (
        <svg className="glava-kraj" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
          <path d={greben({ sjeme: 11, y: 92, amp: 30, valova: 2.4, dno: 300 })} fill="#27305f" opacity=".75" />
          <path d={greben({ sjeme: 17, y: 124, amp: 24, valova: 3.3, suma: 8, dno: 300 })} fill="#11162e" />
          <Para
            id="gp"
            boja={[0.98, 0.949, 0.906]}
            visina={300}
            slojevi={[
              { frek: "0.003 0.018", sjeme: 6, od: 96, do: 220, jacina: 1.9, boja: [0.66, 0.66, 0.86] },
              { frek: "0.005 0.024", sjeme: 15, od: 150, do: 258, jacina: 2.4 },
              { frek: "0.009 0.034", sjeme: 29, od: 200, do: 284, jacina: 3 },
            ]}
            puno={[222, 292]}
          />
        </svg>
      )}
    </div>
  );
}
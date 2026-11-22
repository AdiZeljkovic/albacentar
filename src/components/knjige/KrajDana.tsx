import Oblaci from "@/components/pocetna/Oblaci";
import { greben } from "@/lib/krajolik";

/**
 * Kraj stranice bez završnog poziva (Zaštita privatnosti): papir stranice kroz kratak sumrak
 * prelazi u noć podnožja, da između svijetlog sadržaja i podnožja nema reza. Boje su iste
 * kao u završnom pozivu ostalih stranica; grebeni na dnu već su boje vrha podnožja.
 */
export default function KrajDana() {
  return (
    <section className="kg-kraj-dana" aria-hidden="true">
      <Oblaci id="kg-kd" className="kg-kd-oblaci" boja={[1, 0.9, 0.78]} sjena={[0.86, 0.38, 0.32]} sjeme={14} gustoca={3.1} />
      <svg className="kg-kd-brda" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <path d={greben({ sjeme: 61, y: 96, amp: 30, valova: 2.2, dno: 220 })} fill="#232a5c" />
        <path d={greben({ sjeme: 67, y: 132, amp: 26, valova: 3.1, suma: 8, dno: 220 })} fill="#10162b" />
      </svg>
    </section>
  );
}

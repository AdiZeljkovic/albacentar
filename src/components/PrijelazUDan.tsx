import Para from "@/components/pocetna/Para";
import { greben } from "@/lib/krajolik";

/**
 * Prijelaz iz noćnog prizora u svijetli sadržaj stranice: daleki grebeni i magla koja se
 * zgušnjava u boju stranice. `id` mora biti jedinstven na stranici.
 */
export default function PrijelazUDan({ id }: { id: string }) {
  return (
    <div className="prijelaz" aria-hidden="true">
      <svg viewBox="0 0 1440 300" preserveAspectRatio="none">
        <path d={greben({ sjeme: 23, y: 96, amp: 30, valova: 2.5, dno: 300 })} fill="#343a80" opacity=".7" />
        <path d={greben({ sjeme: 31, y: 128, amp: 24, valova: 3.4, suma: 8, dno: 300 })} fill="#151a3a" />
        <Para
          id={id}
          boja={[0.98, 0.949, 0.906]}
          visina={300}
          slojevi={[
            { frek: "0.003 0.018", sjeme: 9, od: 96, do: 220, jacina: 1.9, boja: [0.7, 0.68, 0.88] },
            { frek: "0.005 0.024", sjeme: 19, od: 150, do: 258, jacina: 2.4 },
            { frek: "0.009 0.034", sjeme: 33, od: 200, do: 284, jacina: 3 },
          ]}
          puno={[222, 292]}
        />
      </svg>
    </div>
  );
}
import Naslov from "@/components/Naslov";
import Oblaci from "@/components/pocetna/Oblaci";
import Putokazi from "@/components/pocetna/Putokazi";
import { pitanja } from "@/content/pitanja";
import { zrake } from "@/lib/krajolik";
import { kas, vars } from "@/lib/util";

/**
 * Česta pitanja: vedro jutro nakon svitanja. Sunce je već visoko, nebom plove oblaci i ptice,
 * a put iz sekcije „O meni" nastavlja se kao staza na kojoj je svako pitanje jedna postaja.
 */
/** `sve`: na stranici Česta pitanja, gdje naslov već stoji u glavi: sva pitanja, bez zaglavlja i završne poveznice. */
export default function Vedro({ sve = false }: { sve?: boolean }) {
  return (
    <>
      <div className="vd-nebo" aria-hidden="true">
        <i className="vd-sunce">
          <i className="vd-zrake" style={{ background: zrake(12, "236 180 96", 0.2) }} />
          <i className="vd-kolut" />
        </i>
        <Oblaci id="vo1" className="vd-oblaci a" boja={[1, 1, 1]} sjena={[0.78, 0.62, 0.42]} sjeme={5} gustoca={3.4} />
        <Oblaci id="vo2" className="vd-oblaci b" boja={[1, 1, 1]} sjena={[0.78, 0.62, 0.42]} sjeme={17} gustoca={3} frek="0.0026 0.013" />
        {[
          { "--y": "11%", "--t": "44s", "--d": "-9s", "--v": 0.9 },
          { "--y": "17%", "--t": "52s", "--d": "-30s", "--v": 0.65 },
          { "--y": "8%", "--t": "48s", "--d": "-21s", "--v": 0.75 },
        ].map((stil) => (
          <svg key={stil["--d"]} className="mj-ptica vd-ptica" viewBox="-13 -9 26 18" style={vars(stil)}>
            <g className="knj-krila" fill="none" stroke="#6b5544" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0 1 Q-5 -7 -12 -3" />
              <path d="M0 1 Q5 -7 12 -3" />
            </g>
          </svg>
        ))}
      </div>

      <div className="w">
        {!sve && (
        <header className="vd-glava sredina">
          <p className="oz" data-reveal>
            Česta pitanja
          </p>
          <Naslov>{"Prije nego što *dođete.*"}</Naslov>
          <p className="mut" data-reveal style={kas(0.25)}>
            Sudjelovanje je uvijek dobrovoljno. Sami odlučujete koliko želite podijeliti i što ćete nakon susreta
            prihvatiti kao korisno za sebe.
          </p>
        </header>
        )}
        <Putokazi stavke={sve ? pitanja : pitanja.slice(0, 5)} kraj={!sve} razina={sve ? "h2" : "h3"} />
      </div>
    </>
  );
}

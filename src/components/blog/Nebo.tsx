import Zvijezde from "@/components/Zvijezde";
import Oblaci from "@/components/pocetna/Oblaci";
import Para from "@/components/pocetna/Para";
import { greben } from "@/lib/krajolik";
import { MaliLampion } from "./Lampion";

/**
 * Nebo i polje bloga: plavi sat pred zoru, isti prizor kao blog na naslovnici, ovdje u punoj visini.
 * `Nebo` su zvijezde, dva pojasa oblaka i lampioni koji se u daljini dižu s polja; `Polje` je obzor
 * na dnu: ruž zore iza grebena, polje s lampionima koji još čekaju na tlu i jutarnja magla koja se
 * zgušnjava u boju stranice ispod.
 */

/** Stalni „slučajni" brojevi, isti na poslužitelju i u pregledniku. */
function nasumicno(sjeme: number) {
  let s = sjeme;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function daleki(sjeme: number, broj: number) {
  const kocka = nasumicno(sjeme);
  const izmedju = (a: number, b: number) => +(a + (b - a) * kocka()).toFixed(1);
  return Array.from({ length: broj }, () => ({
    "--x": `${izmedju(2, 98)}%`,
    "--v": izmedju(0.42, 1.25),
    "--t": `${izmedju(46, 96)}s`,
    "--d": `${izmedju(-96, 0)}s`,
    "--nj": `${izmedju(-80, 80)}px`,
  }));
}

/**
 * Lampioni na srednjoj udaljenosti: [pomak od sredine u px, visina od vrha u px, širina u px].
 * Stoje izvan stupca sadržaja, pa se vide na širokim ekranima, a na uskima ne smetaju tekstu.
 */
const SREDNJI: Array<[number, number, number]> = [
  [-712, 330, 44],
  [668, 236, 36],
  [-846, 770, 58],
  [742, 910, 50],
  [-1040, 520, 32],
  [1010, 566, 40],
  [-690, 1268, 38],
  [892, 1330, 32],
  [1196, 300, 28],
  [-1212, 990, 42],
];

export function Nebo({ lampiona = 20, sjeme = 51733 }: { lampiona?: number; sjeme?: number }) {
  return (
    <>
      <div className="bl-zvijezde" aria-hidden="true">
        <Zvijezde gustoca={0.9} bogato />
      </div>
      <Oblaci id="bl-ob1" className="bl-oblak a" boja={[0.42, 0.43, 0.8]} sjeme={5} gustoca={2.5} />
      <Oblaci id="bl-ob2" className="bl-oblak b" boja={[0.95, 0.62, 0.62]} sjena={[0.4, 0.27, 0.56]} sjeme={12} gustoca={2.9} />
      <div className="bl-srednji" aria-hidden="true">
        {SREDNJI.map(([x, y, s], i) => (
          <MaliLampion
            key={i}
            stil={{ "--x": `${x}px`, "--y": `${y}px`, "--s": `${s}px`, "--o": (0.5 + s / 120).toFixed(2), "--t": `${9 + (i % 4) * 2.2}s`, "--d": `${-i * 2.7}s` }}
          />
        ))}
      </div>
      <div className="bl-daleki" aria-hidden="true">
        {daleki(sjeme, lampiona).map((stil, i) => (
          <MaliLampion key={i} stil={stil} />
        ))}
      </div>
    </>
  );
}

/* grebeni obzora (crtež 1440 × 420); bliži je polje s kojeg se lampioni dižu */
const DALEKI_GREBEN = greben({ sjeme: 41, y: 70, amp: 46, valova: 2.3, dno: 420 });
const SREDNJI_GREBEN = greben({ sjeme: 53, y: 112, amp: 22, valova: 3.2, suma: 7, dno: 420 });
const POLJE = greben({ sjeme: 67, y: 156, amp: 13, valova: 1.7, suma: 3, dno: 420 });

/** Visina grebena na zadanom x, pročitana iz njegove putanje. */
function visina(d: string, x: number) {
  let najblizi = 0;
  let y = 0;
  for (const m of d.matchAll(/L(\d+) (-?[\d.]+)/g)) {
    const mx = +m[1];
    if (!najblizi || Math.abs(mx - x) < Math.abs(najblizi - x)) {
      najblizi = mx;
      y = +m[2];
    }
  }
  return y;
}

/** Lampioni koji još stoje u travi: [x u crtežu, veličina, na srednjem grebenu]. Skupine, ne pravilan red. */
const NA_TLU: Array<[number, number, boolean?]> = [
  [96, 0.9],
  [142, 0.62],
  [318, 0.74],
  [352, 1.05],
  [384, 0.58],
  [612, 0.5, true],
  [660, 0.66],
  [884, 0.98],
  [926, 0.6],
  [1010, 0.44, true],
  [1168, 0.8],
  [1206, 1.1],
  [1248, 0.56],
  [1372, 0.7],
];

export function Polje() {
  return (
    <div className="bl-polje" aria-hidden="true">
      <svg className="bl-polje-crtez" viewBox="0 0 1440 420" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bl-greben-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a5a96" />
            <stop offset=".5" stopColor="#5a4a8c" />
          </linearGradient>
          <linearGradient id="bl-greben-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset=".16" stopColor="#3a3273" />
            <stop offset=".6" stopColor="#2a2a62" />
          </linearGradient>
          {/* polje je tamno samo uz rub; dalje ga već prekriva magla obojena zorom, pa pramenovi šuma nemaju oštar kontrast */}
          <linearGradient id="bl-greben-c" gradientUnits="userSpaceOnUse" x1="0" y1="140" x2="0" y2="420">
            <stop offset="0" stopColor="#171a42" />
            <stop offset=".14" stopColor="#23245a" />
            <stop offset=".34" stopColor="#544684" />
            <stop offset=".54" stopColor="#a8809f" />
            <stop offset=".74" stopColor="#e9cbc6" />
            <stop offset=".92" stopColor="#faf2e7" />
          </linearGradient>
        </defs>
        <path d={DALEKI_GREBEN} fill="url(#bl-greben-a)" opacity=".85" />
        <path d={SREDNJI_GREBEN} fill="url(#bl-greben-b)" />
        <path d={POLJE} fill="url(#bl-greben-c)" />
        <Para
          id="bl-pm"
          boja={[0.98, 0.949, 0.906]}
          visina={420}
          slojevi={[
            { frek: "0.003 0.016", sjeme: 14, od: 110, do: 250, jacina: 1.6, boja: [0.66, 0.52, 0.8] },
            { frek: "0.004 0.02", sjeme: 21, od: 170, do: 310, jacina: 2, boja: [0.95, 0.78, 0.8] },
            { frek: "0.006 0.026", sjeme: 37, od: 230, do: 360, jacina: 2.5 },
            { frek: "0.009 0.034", sjeme: 44, od: 290, do: 396, jacina: 3 },
          ]}
          puno={[320, 404]}
        />
      </svg>
      {NA_TLU.map(([x, v, dalje], i) => (
        <MaliLampion
          key={x}
          className="bl-tlo"
          stil={{
            "--x": `${(x / 14.4).toFixed(2)}%`,
            "--y": `${((visina(dalje ? SREDNJI_GREBEN : POLJE, x) + (dalje ? 4 : 5)) / 4.2).toFixed(2)}%`,
            "--v": v,
            "--d": `${(-i * 0.83).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Nekoliko lampiona visoko na nebu, za prizor na dnu članka. */
export function Lampioncici({ broj = 9, sjeme = 7411 }: { broj?: number; sjeme?: number }) {
  return (
    <div className="bl-daleki" aria-hidden="true">
      {daleki(sjeme, broj).map((stil, i) => (
        <MaliLampion key={i} stil={stil} />
      ))}
    </div>
  );
}

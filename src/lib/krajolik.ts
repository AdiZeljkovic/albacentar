/**
 * Krajolik za prizore na početnoj: grebeni koji nisu glatke vektorske krivulje nego imaju
 * sitne neravnine i, po želji, liniju šume. Sve je određeno sjemenom, pa je crtež isti na
 * poslužitelju i u pregledniku.
 */

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** Glatki šum u jednoj dimenziji, 0 do 1. */
function sum(x: number, sjeme: number) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i + sjeme * 57.3) * (1 - u) + hash(i + 1 + sjeme * 57.3) * u;
}
/** Zbroj nekoliko oktava šuma, otprilike −1 do 1. */
function fbm(x: number, sjeme: number, oktave: number) {
  let v = 0;
  let a = 0.5;
  let zbroj = 0;
  for (let o = 0; o < oktave; o++) {
    v += a * (sum(x, sjeme + o * 13) * 2 - 1);
    zbroj += a;
    x *= 2.07;
    a *= 0.5;
  }
  return v / zbroj;
}

type Greben = {
  sjeme: number;
  /** Srednja visina grebena (y u mjerama crteža) i koliko odstupa gore-dolje. */
  y: number;
  amp: number;
  /** Koliko se velikih valova stane u širinu crteža. */
  valova?: number;
  oktave?: number;
  /** Visina stabala u liniji šume; 0 = goli greben. */
  suma?: number;
  /** Nagib cijelog grebena: koliko je desni kraj niži (+) ili viši (−) od lijevog. */
  nagib?: number;
  sirina?: number;
  dno?: number;
};

/** Zatvoren lik grebena (od lijevog do desnog ruba, pa dolje do dna crteža). */
export function greben({ sjeme, y, amp, valova = 3, oktave = 5, suma = 0, nagib = 0, sirina = 1440, dno = 220 }: Greben) {
  const korak = suma ? 2 : 6;
  let d = `M0 ${dno}`;
  for (let x = 0; x <= sirina; x += korak) {
    const t = x / sirina;
    let v = y + amp * fbm(t * valova, sjeme, oktave) + nagib * (t - 0.5);
    if (suma) {
      // linija šume: stabla različite visine, svako nekoliko jedinica široko
      const k = x / 6;
      const i = Math.floor(k);
      const uStablu = 1 - Math.abs((k - i) * 2 - 1);
      const visina = suma * (0.35 + 0.65 * hash(i * 3.7 + sjeme)) * (hash(i * 9.1 + sjeme * 2) > 0.16 ? 1 : 0.25);
      v -= uStablu * visina;
    }
    d += ` L${x} ${v.toFixed(1)}`;
  }
  return `${d} L${sirina} ${dno}Z`;
}

/** Nepravilne zrake svjetla kao CSS conic-gradient: klinovi različite širine i jačine, bez pravilnog ritma. */
export function zrake(sjeme: number, boja: string, jacina = 0.2, klinova = 46) {
  const dijelovi: string[] = [];
  let kut = 0;
  let i = 0;
  while (kut < 360 && i < klinova * 3) {
    const sirina = 1.2 + hash(i * 2.3 + sjeme) * 5.5;
    const razmak = 2 + hash(i * 5.1 + sjeme * 3) * 9;
    const a = +(jacina * (0.25 + 0.75 * hash(i * 7.7 + sjeme * 5))).toFixed(3);
    const od = kut;
    const sredina = kut + sirina / 2;
    const doo = Math.min(360, kut + sirina);
    dijelovi.push(`transparent ${od.toFixed(1)}deg`, `rgb(${boja} / ${a}) ${sredina.toFixed(1)}deg`, `transparent ${doo.toFixed(1)}deg`);
    kut = doo + razmak;
    i++;
  }
  return `conic-gradient(from 0deg, ${dijelovi.join(", ")}, transparent 360deg)`;
}

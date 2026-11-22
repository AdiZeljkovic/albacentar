/**
 * Crtanje korijenja za stranicu Knjige: korijen nije crta jednake debljine nego lik koji se
 * stanjuje prema vrhu i usput sitno krivuda, kao pravi. Sve je određeno sjemenom, pa je crtež
 * isti na poslužitelju i u pregledniku.
 */
export type Tocka = [number, number];

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

/** Stalni „slučajni" brojevi (0 do 1), isti na poslužitelju i u pregledniku. */
export function nasumicno(sjeme: number) {
  let s = sjeme;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Glatka krivulja kroz zadane točke (Catmull-Rom), s `poOdsjecku` uzoraka između svake dvije. */
export function krivulja(tocke: Tocka[], poOdsjecku = 10): Tocka[] {
  const p = [tocke[0], ...tocke, tocke[tocke.length - 1]];
  const van: Tocka[] = [];
  for (let i = 1; i < p.length - 2; i++) {
    const [a, b, c, d] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    for (let k = 0; k < poOdsjecku; k++) {
      const t = k / poOdsjecku;
      const t2 = t * t;
      const t3 = t2 * t;
      const os = (j: 0 | 1) =>
        0.5 * (2 * b[j] + (-a[j] + c[j]) * t + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * t2 + (-a[j] + 3 * b[j] - 3 * c[j] + d[j]) * t3);
      van.push([os(0), os(1)]);
    }
  }
  van.push(tocke[tocke.length - 1]);
  return van;
}

const zapis = (t: Tocka) => `${t[0].toFixed(1)} ${t[1].toFixed(1)}`;

/** Put kroz točke kao SVG zapis. */
export const putanja = (put: Tocka[]) => put.map((t, i) => `${i ? "L" : "M"}${zapis(t)}`).join(" ");

/** Okomica na put u točki `i`, jedinične duljine. */
function okomica(put: Tocka[], i: number): Tocka {
  const a = put[Math.max(0, i - 1)];
  const b = put[Math.min(put.length - 1, i + 1)];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.hypot(dx, dy) || 1;
  return [-dy / d, dx / d];
}

/**
 * Korijen kroz zadane točke: debljina ide od `od` do `doo`, a os sitno krivuda (`hrapavost`).
 * Vraća zatvoren lik za ispunu, os kao crtu (za svjetlo koje putuje) i točke osi.
 */
export function korijen(tocke: Tocka[], od: number, doo: number, sjeme: number, hrapavost = 2.2) {
  const glatko = krivulja(tocke, 14);
  const n = glatko.length;
  const put: Tocka[] = glatko.map((t, i) => {
    const k = i / (n - 1);
    const rub = Math.min(1, k * 5, (1 - k) * 5);
    const [nx, ny] = okomica(glatko, i);
    const pomak = hrapavost * rub * ((sum(i * 0.17, sjeme) * 2 - 1) + 0.3 * (sum(i * 0.55, sjeme + 4) * 2 - 1));
    return [t[0] + nx * pomak, t[1] + ny * pomak];
  });
  const lijevo: Tocka[] = [];
  const desno: Tocka[] = [];
  put.forEach((t, i) => {
    const k = i / (n - 1);
    const s = ((od + (doo - od) * Math.pow(k, 0.72)) * (0.86 + 0.28 * sum(i * 0.33, sjeme + 9))) / 2;
    const [nx, ny] = okomica(put, i);
    lijevo.push([t[0] + nx * s, t[1] + ny * s]);
    desno.push([t[0] - nx * s, t[1] - ny * s]);
  });
  const lik = `M${lijevo.map(zapis).join(" L")} L${desno.reverse().map(zapis).join(" L")}Z`;
  return { lik, os: putanja(put), put };
}

/** Sitne dlačice uz korijen: kratke, blago savijene crte koje se odvajaju na nepravilnim mjestima. */
export function dlacice(put: Tocka[], sjeme: number, broj: number, duljina = 26) {
  const kocka = nasumicno(sjeme * 97 + 13);
  let d = "";
  for (let j = 0; j < broj; j++) {
    const i = 2 + Math.floor(kocka() * (put.length - 4));
    const [x, y] = put[i];
    const [nx, ny] = okomica(put, i);
    const strana = kocka() > 0.5 ? 1 : -1;
    const naprijed: Tocka = [ny, -nx];
    const l = duljina * (0.4 + 0.6 * kocka());
    // smjer: napola u stranu, napola niz korijen, i uvijek pomalo prema dolje
    const sx = nx * strana * 0.7 + naprijed[0] * 0.5;
    const sy = ny * strana * 0.7 + naprijed[1] * 0.5 + 0.35;
    const ex = x + sx * l;
    const ey = y + sy * l;
    const cx = x + sx * l * 0.55 + nx * strana * l * 0.35;
    const cy = y + sy * l * 0.55 + ny * strana * l * 0.35 - kocka() * l * 0.15;
    d += `M${x.toFixed(1)} ${y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  }
  return d;
}

/** Dio puta od početka do točke najbliže zadanoj (mjesto gdje se grana odvaja). */
export function doTocke(put: Tocka[], t: Tocka): Tocka[] {
  let naj = 0;
  let udaljenost = Infinity;
  put.forEach((p, i) => {
    const d = Math.hypot(p[0] - t[0], p[1] - t[1]);
    if (d < udaljenost) {
      udaljenost = d;
      naj = i;
    }
  });
  return put.slice(0, naj + 1);
}

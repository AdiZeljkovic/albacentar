/**
 * Mjesečeve mijene, za crteže: koliko je Mjesec obasjan na neki dan i obris obasjanog dijela.
 * Točnost je oko pola dana, što je za crtež više nego dovoljno.
 */
const SINODICKI = 29.530588853;
/** Mlađak 6. 1. 2000. u 18:14 UTC; od njega se broje mijene. */
const MLADJAK = Date.UTC(2000, 0, 6, 18, 14);

/** Mijena u trenutku ms: 0 = mlađak, 0.25 = prva četvrt, 0.5 = uštap, 0.75 = zadnja četvrt. */
export function mijena(ms: number) {
  const m = ((ms - MLADJAK) / 86400000 / SINODICKI) % 1;
  return m < 0 ? m + 1 : m;
}

export function nazivMijene(m: number) {
  if (m < 0.03 || m > 0.97) return "mlađak";
  if (m < 0.22) return "rastući srp";
  if (m < 0.28) return "prva četvrt";
  if (m < 0.47) return "rastući Mjesec";
  if (m < 0.53) return "uštap";
  if (m < 0.72) return "padajući Mjesec";
  if (m < 0.78) return "zadnja četvrt";
  return "padajući srp";
}

/** Obasjani dio Mjesečeva lica: luk ruba i elipsa terminatora, kao SVG putanja. */
export function lice(m: number, cx: number, cy: number, r: number) {
  const kut = 2 * Math.PI * m;
  const rx = Math.abs(Math.cos(kut)) * r;
  const raste = m < 0.5;
  const viseOdPola = (1 - Math.cos(kut)) / 2 > 0.5;
  return `M${cx} ${cy - r} A${r} ${r} 0 0 ${raste ? 1 : 0} ${cx} ${cy + r} A${rx.toFixed(2)} ${r} 0 0 ${viseOdPola === raste ? 1 : 0} ${cx} ${cy - r}Z`;
}

/** Udio obasjanog lica, 0–1. */
export const obasjanost = (m: number) => (1 - Math.cos(2 * Math.PI * m)) / 2;

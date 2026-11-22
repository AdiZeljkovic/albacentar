// Skraćuje izvorne fontove na znakove koji se na stranici stvarno koriste: osnovna latinica,
// Latin-1 (zapadnoeuropska slova), hrvatska slova, interpunkcija, strelice. Zadržava OpenType
// značajke koje stranica koristi i promjenjivu debljinu u rasponu koji CSS koristi (400–600).
//
// Pokreće se samo kad zatreba novi znak ili debljina (rezultat je već u src/fonts):
//   1. u scripts/izvor/ staviti izvorne TTF datoteke s Google Fontsa (licenca OFL):
//      EBGaramond.ttf i EBGaramond-Italic.ttf (promjenjivi, [wght]), Figtree.ttf ([wght]), GreatVibes.ttf
//      https://github.com/google/fonts/tree/main/ofl  (mape ebgaramond, figtree, greatvibes)
//   2. npm install --no-save subset-font
//   3. node scripts/skrati-fontove.mjs src/fonts
// Novi znak dodaje se u ZNAKOVI, nova značajka u ZNACAJKE.
import subsetFont from "subset-font";
import { readFile, writeFile, mkdir } from "node:fs/promises";

const raspon = (od, doo) => Array.from({ length: doo - od + 1 }, (_, i) => String.fromCodePoint(od + i)).join("");
const ZNAKOVI =
  raspon(0x20, 0x7e) + raspon(0xa0, 0xff) +
  "ĆćČčĐđŠšŽž" + "ıŒœ" + "ˆ˚˜" +
  raspon(0x2010, 0x2027) + raspon(0x2030, 0x203a) + "⁄€™←↑→↓−∕" + "ψ";

// samo značajke koje stranica koristi: razmaci među slovima, ligature, hrvatski oblici, starinske i obične brojke, kapitalke
const ZNACAJKE = ["kern", "liga", "clig", "calt", "ccmp", "locl", "mark", "mkmk", "rlig", "onum", "lnum", "pnum", "tnum", "smcp"];
const izlaz = process.argv[2];
await mkdir(izlaz, { recursive: true });
const poslovi = [
  ["izvor/EBGaramond.ttf", "eb-garamond.woff2", { wght: { min: 400, max: 600, default: 400 } }],
  ["izvor/EBGaramond-Italic.ttf", "eb-garamond-italic.woff2", { wght: { min: 400, max: 600, default: 400 } }],
  ["izvor/Figtree.ttf", "figtree.woff2", { wght: { min: 400, max: 600, default: 400 } }],
  ["izvor/GreatVibes.ttf", "great-vibes.woff2", undefined],
];
for (const [ulaz, ime, osi] of poslovi) {
  const izvor = await readFile(new URL(ulaz, import.meta.url));
  const font = await subsetFont(izvor, ZNAKOVI, { targetFormat: "woff2", keepFeatures: ZNACAJKE, ...(osi ? { variationAxes: osi } : {}) });
  await writeFile(`${izlaz}/${ime}`, font);
  console.log(`${ime}: ${(izvor.length / 1024).toFixed(0)} KB -> ${(font.length / 1024).toFixed(1)} KB`);
}
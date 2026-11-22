import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Blog čita Markdown datoteke iz mape /content/blog.
 * Novi tekst = nova .md datoteka sa zaglavljem (naslov, datum, kategorija...).
 */
const MAPA = path.join(process.cwd(), "content", "blog");

export type Clanak = {
  slug: string;
  naslov: string;
  podnaslov: string;
  /** ISO datum, npr. "2026-11-19" */
  datum: string;
  datumTekst: string;
  kategorija: string;
  sazetak: string;
  slika: string;
  slikaAlt: string;
  /** Rečenica za karticu bez slike. */
  citat: string;
  oznake: string[];
  minuta: number;
  html: string;
};

const MJESECI = [
  "siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja",
  "srpnja", "kolovoza", "rujna", "listopada", "studenoga", "prosinca",
];

function datumTekst(iso: string) {
  const [g, m, d] = iso.split("-").map(Number);
  return `${d}. ${MJESECI[m - 1]} ${g}.`;
}

function ucitaj(datoteka: string): Clanak {
  const sirovo = fs.readFileSync(path.join(MAPA, datoteka), "utf8");
  const { data, content } = matter(sirovo);
  const datum =
    data.datum instanceof Date ? data.datum.toISOString().slice(0, 10) : String(data.datum ?? "").slice(0, 10);
  const rijeci = content.trim().split(/\s+/).length;
  return {
    slug: datoteka.replace(/\.md$/, ""),
    naslov: String(data.naslov ?? ""),
    podnaslov: String(data.podnaslov ?? ""),
    datum,
    datumTekst: datumTekst(datum),
    kategorija: String(data.kategorija ?? "Obiteljske konstelacije"),
    sazetak: String(data.sazetak ?? ""),
    slika: String(data.slika ?? ""),
    slikaAlt: String(data.slikaAlt ?? ""),
    citat: String(data.citat ?? ""),
    oznake: Array.isArray(data.oznake) ? data.oznake.map(String) : [],
    minuta: Math.max(1, Math.round(rijeci / 200)),
    html: marked.parse(content, { async: false }) as string,
  };
}

let predmemorija: Clanak[] | null = null;

/** Svi članci, najnoviji prvi. */
export function sviClanci(): Clanak[] {
  if (predmemorija && process.env.NODE_ENV === "production") return predmemorija;
  const clanci = fs
    .readdirSync(MAPA)
    .filter((d) => d.endsWith(".md"))
    .map(ucitaj)
    .sort((a, b) => b.datum.localeCompare(a.datum) || a.naslov.localeCompare(b.naslov, "hr"));
  predmemorija = clanci;
  return clanci;
}

export function clanak(slug: string) {
  return sviClanci().find((c) => c.slug === slug) ?? null;
}

export function kategorije() {
  return [...new Set(sviClanci().map((c) => c.kategorija))];
}

/** Načini rada (konzultacije) i termini radionica. */

export const naciniRada = [
  {
    id: "individualne",
    naziv: "Individualne konstelacije",
    oznaka: "Uživo · jedan na jedan",
    opis:
      "Susret namijenjen osobama koje žele svoju temu istraživati individualno, u sigurnom i mirnom prostoru. U radu se mogu koristiti figure, simboli i prostorni raspored.",
    /** C. D. Friedrich, Dvojica muškaraca promatraju mjesec (oko 1820.); javno vlasništvo. */
    slika: "/img/vrata-dvojica.jpg",
    prizor: "/img/vrata-dvojica.jpg",
    href: "/konzultacije#upit",
    poziv: "Dogovorite termin",
  },
  {
    id: "grupne",
    naziv: "Grupne konstelacije uživo",
    oznaka: "Uživo · u grupi",
    opis:
      "Grupni susreti u kojima sudionici mogu postavljati vlastite teme ili sudjelovati kao predstavnici. Termini i lokacija objavljuju se prema organizaciji susreta.",
    /** P. S. Krøyer, Ivanjski krijes na plaži u Skagenu (1906.); javno vlasništvo. */
    slika: "/img/vrata-krug.jpg",
    prizor: "/img/vrata-krug.jpg",
    href: "/radionice",
    poziv: "Pogledajte termine",
  },
  {
    id: "online",
    naziv: "Individualni online rad",
    oznaka: "Online · jedan na jedan",
    opis:
      "Razgovor i individualni rad na odabranoj temi putem online susreta, uz prethodni dogovor.",
    /** J. Vermeer, Djevojka čita pismo kraj otvorenog prozora (oko 1658.); javno vlasništvo. */
    slika: "/img/vrata-pismo.jpg",
    prizor: "/img/vrata-pismo.jpg",
    href: "/konzultacije#upit",
    poziv: "Dogovorite termin",
  },
  {
    id: "grupni-online",
    naziv: "Grupni online susreti",
    oznaka: "Online · u grupi",
    opis:
      "Online edukativni i iskustveni susreti namijenjeni upoznavanju konstelacijskog pristupa i istraživanju odabranih tema.",
    /** V. van Gogh, Zvjezdana noć (1889.); javno vlasništvo. */
    slika: "/img/vrata-nebo.jpg",
    prizor: "/img/vrata-nebo.jpg",
    href: "/radionice",
    poziv: "Pogledajte termine",
  },
] as const;

export type Termin = {
  id: string;
  /** ISO datum, npr. "2026-12-05" */
  datum: string;
  naslov: string;
  opis: string;
  /** Ukupan broj mjesta s vlastitom temom i koliko ih je zauzeto. */
  mjesta: number;
  zauzeto: number;
  napomena: string;
  nacin: "Uživo" | "Online";
};

/**
 * TERMINI RADIONICA
 * Ovo su primjeri termina iz koncepta stranice. Prije objave zamijenite ih stvarnima
 * i postavite `terminiSuPrimjer` na false. Prošli termini sami nestaju s popisa.
 */
export const terminiSuPrimjer = true;

export const termini: Termin[] = [
  {
    id: "obiteljske-konstelacije-2026-12-05",
    datum: "2026-12-05",
    naslov: "Radionica obiteljskih konstelacija",
    opis: "Grupni rad prema pristupu Berta Hellingera. Roditelji, preci, partnerski odnosi.",
    mjesta: 8,
    zauzeto: 3,
    napomena: "5 od 8 mjesta s vlastitom temom slobodno",
    nacin: "Uživo",
  },
  {
    id: "naslijede-predaka-2026-12-19",
    datum: "2026-12-19",
    naslov: "Naslijeđe predaka",
    opis: "Transgeneracijski obrasci i nevidljive niti koje povezuju generacije.",
    mjesta: 8,
    zauzeto: 6,
    napomena: "Ostala 2 mjesta s temom, predstavnici dobrodošli",
    nacin: "Uživo",
  },
  {
    id: "majka-izvor-zivota-2027-01-09",
    datum: "2027-01-09",
    naslov: "Majka, izvor života",
    opis: "Odnos s majkom i ženskom linijom obitelji.",
    mjesta: 8,
    zauzeto: 0,
    napomena: "Prijave tek otvorene",
    nacin: "Uživo",
  },
];

const MJESECI_G = [
  "siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja",
  "srpnja", "kolovoza", "rujna", "listopada", "studenoga", "prosinca",
];
const DANI = ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"];

export function opisDatuma(iso: string) {
  const [g, m, d] = iso.split("-").map(Number);
  const dan = new Date(Date.UTC(g, m - 1, d)).getUTCDay();
  return {
    dan: d,
    mjesec: MJESECI_G[m - 1],
    danUTjednu: DANI[dan],
    puni: `${d}. ${MJESECI_G[m - 1]} ${g}.`,
  };
}

/** Termini koji još nisu prošli, najbliži prvi. */
export function nadolazeciTermini(now = new Date()) {
  const danas = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zagreb" }).format(now);
  return termini.filter((t) => t.datum >= danas).sort((a, b) => a.datum.localeCompare(b.datum));
}

export const temeEdukacija = [
  "Uvod u obiteljske i sistemske konstelacije",
  "Obitelj kao sustav",
  "Tri temeljna načela Hellingerova pristupa",
  "Pripadnost i isključeni članovi obitelji",
  "Obiteljske tajne i neizgovorene priče",
  "Transgeneracijski obrasci i obiteljsko nasljeđe",
  "Odnos roditelja i djece",
  "Partnerski odnosi",
  "Obiteljski obrasci u poslovnom životu",
  "Odnos prema novcu i uspjehu",
  "Istraživanje vlastitih obiteljskih korijena",
] as const;

/**
 * Misao dana. Svaki dan prikazuje se sljedeća s popisa, redom.
 * Sve rečenice su iz tekstova AlBa Centra. Nove se dodaju na kraj popisa.
 */
export const misli: string[] = [
  "Danas otpuštam ono što više ne pripada mom životu. Ne moram imati sve odgovore. Vjerujem životu i vlastitoj snazi.",
  "Korijeni nam daju pripadnost. Krila nam daju slobodu da krenemo svojim putem.",
  "Priznati da se nešto dogodilo nije isto što i odobriti da se dogodilo.",
  "Svatko ima svoje korijene. Ali svatko ima i pravo na vlastiti put.",
  "Poštovati obitelj ne znači živjeti prema svim njezinim očekivanjima.",
  "Ne moramo sve razumjeti da bismo nekoga poštovali.",
  "Voljeti druge ne znači zaboraviti sebe.",
  "Ne možemo promijeniti početak svoje priče, ali možemo postati svjesniji načina na koji ćemo je nastaviti.",
  "Pripadati ne znači odreći se vlastitog puta.",
  "Poštujem svoje korijene. Ne nosim tuđu sudbinu. Biram vlastiti put.",
  "Ne moramo imati odgovor da bismo nekome pružili prostor.",
  "Prihvatiti prošlost ne znači opravdati sve što se dogodilo.",
  "Prvi korak ne mora biti velik. Može započeti jednim pitanjem.",
  "Ne moramo preuzeti tuđu sudbinu da bismo pokazali suosjećanje.",
  "Kada roditelj zauzme svoje mjesto, dijete se može vratiti svome.",
  "Neke razgovore vrijedi započeti dok još imamo vremena.",
  "Ponekad je prvi korak promjene u tome da jasnije vidimo svoje mjesto.",
  "Poštovanje se ne može iznuditi. Ono se gradi kroz ljubav, povjerenje i mjesto svakoga u obitelji.",
];

const MJESECI = [
  "siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja",
  "srpnja", "kolovoza", "rujna", "listopada", "studenoga", "prosinca",
];

/** Današnji datum u Zagrebu, neovisno o tome gdje se poslužitelj nalazi. */
function danasUZagrebu(now = new Date()) {
  const dijelovi = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zagreb", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const uzmi = (t: string) => Number(dijelovi.find((d) => d.type === t)?.value);
  return { g: uzmi("year"), m: uzmi("month"), d: uzmi("day") };
}

export function misaoDana(now = new Date()) {
  const { g, m, d } = danasUZagrebu(now);
  const redniDan = Math.floor(Date.UTC(g, m - 1, d) / 86_400_000);
  return {
    indeks: redniDan % misli.length,
    tekst: misli[redniDan % misli.length],
    datum: `${d}. ${MJESECI[m - 1]} ${g}.`,
    dan: d,
    mjesec: MJESECI[m - 1],
    mjesecBroj: m,
    godina: g,
  };
}

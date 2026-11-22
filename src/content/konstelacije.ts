export const nacela = [
  {
    broj: "I",
    naslov: "Pripadnost",
    kratko:
      "Svatko tko pripada obiteljskom sustavu ima pravo na svoje mjesto. I oni o kojima se ne govori, koji su bili zaboravljeni ili isključeni.",
    tekst: [
      "Svaki član obitelji ima svoje mjesto u obiteljskoj povijesti.",
      "U konstelacijskom pristupu naglašava se važnost priznavanja postojanja svih članova sustava, uključujući one o kojima se malo govori, koji su bili zaboravljeni ili isključeni.",
      "To se može odnositi na rano preminule članove obitelji, djecu koja nisu dočekala rođenje, bivše partnere roditelja, članove obitelji koji su otišli ili ljude čije su sudbine bile obilježene teškim okolnostima.",
      "Priznati da je netko postojao ne znači opravdavati njegove postupke. Posebno je važno jasno razlikovati pripadnost obiteljskoj povijesti od opravdavanja nasilja, zlostavljanja ili nepravde.",
    ],
  },
  {
    broj: "II",
    naslov: "Red i mjesto",
    kratko:
      "Roditelji su roditelji, djeca su djeca. Dijete ne mora preuzimati odgovornost za život svojih roditelja niti nositi njihove neriješene sukobe.",
    tekst: [
      "U obiteljskom sustavu svaki član ima svoje mjesto i svoju životnu ulogu.",
      "U Hellingerovu pristupu naglašava se razlika između uloga roditelja i djece te važnost poštovanja generacijskih odnosa.",
      "Dijete ne bi trebalo morati postati roditelj vlastitom roditelju, preuzimati njegove emocionalne terete ili se osjećati odgovornim za njegov život.",
      "Kada se odnosi i odgovornosti pomiješaju, osoba može doživljavati pritisak koji joj otežava izgradnju vlastitog života.",
    ],
  },
  {
    broj: "III",
    naslov: "Ravnoteža davanja i primanja",
    kratko:
      "U odnosima odraslih važna je uzajamnost. Kada jedna strana stalno daje, a druga samo prima, odnos može izgubiti ravnotežu.",
    tekst: [
      "U odnosima je važno postojanje uzajamnosti.",
      "U partnerskim odnosima, prijateljstvima i poslovnim suradnjama ljudi daju i primaju na različite načine. Kada jedna strana stalno daje, a druga samo prima, može nastati osjećaj iscrpljenosti, nezadovoljstva i neravnoteže.",
      "U odnosu roditelja i djece ovo načelo ima drukčiju dimenziju: roditelji daju život i brinu se o djeci, a djeca taj život primaju i kasnije ga nastavljaju svojim putem.",
    ],
  },
] as const;

export const teme = [
  {
    id: "obitelj",
    naziv: "U obitelji",
    stavke: [
      "Ponavljanje sukoba između roditelja i djece.",
      "Osjećaj da uvijek moramo biti odgovorni za sve članove obitelji.",
      "Teškoće u odnosu s majkom ili ocem.",
      "Osjećaj nepripadanja vlastitoj obitelji.",
      "Isključivanje pojedinih članova obiteljske povijesti.",
      "Ponavljanje razvoda, rastanaka ili prekida odnosa.",
      "Teret obiteljskih očekivanja i osjećaj krivnje kada odaberemo vlastiti put.",
    ],
  },
  {
    id: "partnerstvo",
    naziv: "U partnerskim odnosima",
    stavke: [
      "Ponavljanje odnosa s emocionalno nedostupnim partnerima.",
      "Strah od napuštanja ili bliskosti.",
      "Teškoće s povjerenjem.",
      "Stalno preuzimanje odgovornosti za partnera.",
      "Ostajanje u odnosima koji nam ne donose sigurnost i zadovoljstvo.",
      "Poteškoće u stvaranju stabilnog partnerstva.",
    ],
  },
  {
    id: "posao",
    naziv: "U poslovnom životu",
    stavke: [
      "Osjećaj da naš trud nikada nije dovoljno prepoznat.",
      "Strah od uspjeha ili preuzimanja odgovornosti.",
      "Teškoće u odnosu s autoritetima.",
      "Ponavljanje sukoba s nadređenima ili kolegama.",
      "Nemogućnost postavljanja granica na radnom mjestu.",
      "Osjećaj da uvijek moramo raditi više od drugih kako bismo dokazali svoju vrijednost.",
    ],
  },
  {
    id: "novac",
    naziv: "Novac i uspjeh",
    stavke: [
      "Osjećaj krivnje kada zarađujemo više od članova obitelji.",
      "Uvjerenje da se novac može steći samo teškim radom i odricanjem.",
      "Strah od financijske sigurnosti ili gubitka.",
      "Teškoće u naplati vlastitog rada.",
      "Ponavljanje financijskih problema.",
      "Nelagoda kada sebi dopuštamo više od onoga što su imali naši roditelji.",
    ],
  },
] as const;

export const zaKoga = [
  "Žele bolje razumjeti svoje obiteljske odnose.",
  "Primjećuju da se određene situacije ponavljaju.",
  "Žele istražiti svoj odnos s roditeljima ili partnerom.",
  "Razmišljaju o vlastitom mjestu u obitelji.",
  "Žele razumjeti naslijeđena uvjerenja i obiteljske vrijednosti.",
  "Nalaze se pred važnom životnom odlukom.",
  "Žele istražiti svoj odnos prema novcu, poslu i uspjehu.",
  "Žele osobno rasti i upoznati vlastite obrasce ponašanja.",
] as const;

export const nasRad = [
  "poštovanju obiteljske povijesti i svih njezinih članova",
  "razumijevanju vlastitog mjesta u obiteljskom sustavu",
  "prepoznavanju granica između vlastite i tuđe odgovornosti",
  "istraživanju ponavljajućih obrazaca u obitelji, partnerstvu i poslovnom životu",
  "pažljivom promatranju bez unaprijed nametnutih zaključaka",
  "očuvanju osobnog dostojanstva, slobode i odgovornosti svakog sudionika",
] as const;

/**
 * Područja rada AlBa Centra. Svako ima kratak opis (iz tekstova AlBa Centra)
 * i vodi na stranicu na kojoj se o njemu može saznati više.
 */
export const podrucjaRada = [
  {
    naziv: "Obiteljske i sistemske konstelacije",
    opis: "Iskustveni pristup kojim se istražuju odnosi unutar obiteljskih i drugih životnih sustava i situacija sagledava iz šire perspektive.",
    href: "/konstelacije",
  },
  {
    naziv: "Individualni konstelacijski rad",
    opis: "Susret za osobe koje žele svoju temu istraživati individualno, u sigurnom i mirnom prostoru, uz figure, simbole i prostorni raspored.",
    href: "/konzultacije",
  },
  {
    naziv: "Grupni konstelacijski susreti",
    opis: "Grupni susreti u kojima sudionici mogu postavljati vlastite teme ili sudjelovati kao predstavnici.",
    href: "/radionice",
  },
  {
    naziv: "Individualne konzultacije",
    opis: "Za osobe koje žele jasnije sagledati određenu životnu situaciju, postaviti pitanja i istražiti moguće sljedeće korake.",
    href: "/konzultacije#konzultacije",
  },
  {
    naziv: "Edukacije i radionice",
    opis: "Edukativni sadržaji i radionice povezani s obiteljskim i sistemskim konstelacijama, međuljudskim odnosima i osobnim razvojem.",
    href: "/radionice#edukacije",
  },
  {
    naziv: "Osobni razvoj i istraživanje obiteljskog nasljeđa",
    opis: "Istražujemo kako je obiteljska povijest utjecala na nas i kakav odnos danas želimo imati prema njoj.",
    href: "/konstelacije#teme",
  },
  {
    naziv: "Knjige i publikacije",
    opis: "Knjige o obiteljskim odnosima i transgeneracijskim obrascima koje potiču da istražimo korijene i sačuvamo priče predaka za buduće generacije.",
    href: "/knjige",
  },
] as const;
export const filozofija = [
  "Poštovati obitelj ne znači živjeti prema svim njezinim očekivanjima.",
  "Voljeti druge ne znači zaboraviti sebe.",
  "Pripadati ne znači odreći se vlastitog puta.",
  "Prihvatiti prošlost ne znači opravdati sve što se dogodilo.",
] as const;

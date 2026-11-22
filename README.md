# AlBa Centar — web stranica

Next.js 16 (App Router, TypeScript), bez UI biblioteka. Animacije su CSS + mali vlastiti klijentski dijelovi, glatki skrol je Lenis.

## Pokretanje

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # produkcijski build
npm run start
```

Postavke su u `.env.local` (predložak: `.env.example`).

## Gdje se što mijenja

| Što | Gdje |
| --- | --- |
| Kontakt, naziv tvrtke, telefon, mjesto, fotografija vlasnice | `src/lib/site.ts` (prazno polje se ne prikazuje) |
| Termini radionica | `src/content/rad.ts` → `termini` |
| Načini rada, teme edukacija | `src/content/rad.ts` |
| Načela, životne teme, „za koga" | `src/content/konstelacije.ts` |
| Knjige | `src/content/knjige.ts` |
| Česta pitanja | `src/content/pitanja.ts` |
| Misao dana (popis rečenica) | `src/content/misli.ts` |
| Blog | `content/blog/*.md` (jedna datoteka = jedan tekst) |
| Boje, fontovi, razmaci | `src/styles/base.css` (varijable na vrhu) |

Novi tekst na blogu: kopirati postojeću `.md` datoteku, promijeniti zaglavlje (`naslov`, `datum`, `kategorija`, `sazetak`, `slika`) i tekst. `> citat` postaje istaknuti citat, `## Naslov` međunaslov.

## Prije objave

1. **Termini su primjeri.** U `src/content/rad.ts` upisati stvarne termine i postaviti `terminiSuPrimjer = false` (tada nestaje oznaka „primjer termina"). Prošli termini sami nestaju s popisa.
2. **Kontakt podaci** u `src/lib/site.ts`: e-mail, telefon, naziv tvrtke, mjesto.
3. **Fotografija**: datoteku staviti u `public/img/` i upisati putanju u `site.owner.photo`. Dok je prazno, prikazuje se zlatno drvo.
4. **Slanje upita**: postaviti `RESEND_API_KEY`, `UPITI_EMAIL_TO`, `UPITI_EMAIL_FROM`. Bez toga obrasci u produkciji javljaju grešku i upućuju na e-mail (namjerno, da se upit ne izgubi).
5. **Indeksiranje**: `SITE_INDEXABLE=true` i `NEXT_PUBLIC_SITE_URL` tek na pravoj domeni. Do tada stranica šalje `noindex`.
6. **Zaštita privatnosti** (`/privatnost`) je radni tekst i treba ga pregledati klijent ili pravnik.

## Obrasci

Svi obrasci šalju na `POST /api/upit` (`src/app/api/upit/route.ts`), koji upit prosljeđuje e-mailom. Termini i prijave rade kao upiti koje voditeljica potvrđuje. Plaćanje karticom, admin panel i uređivanje bloga iz preglednika nisu dio ove verzije.

## Fontovi

EB Garamond, Figtree i Great Vibes (licenca OFL) poslužuju se s vlastite domene iz `src/fonts`. Datoteke su skraćene na znakove koje stranica koristi (latinica, hrvatska slova, interpunkcija) i na debljine 400–600: četiri datoteke, ukupno oko 170 KB, umjesto osam od oko 390 KB. Ako zatreba znak kojeg nema (prikazao bi se u fontu sustava), postupak je opisan na vrhu `scripts/skrati-fontove.mjs`.

Zamjenski fontovi sustava podešeni su u `src/styles/base.css` („AlBa serif zamjena", „AlBa sans zamjena") tako da tekst zauzme istu širinu prije i poslije učitavanja pravog fonta, pa stranica pri tome ne poskoči.

## Brzina učitavanja

Što je namjerno tako postavljeno, da se pri kasnijim izmjenama ne pokvari:

- **Pozadine na grafičkoj kartici** (`src/lib/sjencar.ts`) ne pripremaju se pri učitavanju stranice. Sjenčar se prevodi u pozadini tek kad se sekcija približi ekranu i kad je grafički proces spreman (`src/lib/gpu.ts`); do tada se vidi CSS podloga sekcije. Isto vrijedi za zvjezdana neba (`Zvijezde.tsx`) i pomrčine (`Pomrcina.tsx`).
- **Sekcije naslovnice ispod heroja** u `src/app/page.tsx` nose `data-van=""`: njihove animacije miruju od prvog kadra, a `Stanka.tsx` ih pokreće kad se približe ekranu. Nova sekcija naslovnice treba isti atribut.
- **Tekst na vrhu stranice** (hero i noćna glava) ulazi CSS animacijom i ne čeka JavaScript. Ostali sadržaj otkriva se pri skrolu; prvo otkrivanje pokreće mala skripta u `layout.tsx` prije nego što se učita ostatak JavaScripta (samo u produkciji).
- **Slike**: zlatno stablo koje se učitava izravno (bez `next/image`) je `drvo-zlatno.webp`. Logotip i naslovne slike namjerno nemaju `preload`: mjerenje na sporoj mreži pokazalo je da to usporava prvi prikaz.

## Izvori ilustracija

Slike iza vrata u „Načinima rada" i naslovne slike tekstova na blogu stara su slikarska djela u javnom vlasništvu (ili CC0), preuzeta s Wikimedia Commons. Nisu generirane.

| Datoteka | Djelo | Gdje se koristi | Izvor |
| --- | --- | --- | --- |
| `vrata-dvojica.jpg` | C. D. Friedrich, Dvojica muškaraca promatraju mjesec (oko 1820.) | Individualne konstelacije | https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Two_Men_Contemplating_the_Moon_-_Google_Art_Project.jpg |
| `vrata-krug.jpg` | P. S. Krøyer, Ivanjski krijes na plaži u Skagenu (1906.) | Grupne konstelacije uživo | https://commons.wikimedia.org/wiki/File:Midsummer_Eve_bonfire_on_Skagen%27s_beach_-_P.S._Kr%C3%B8yer_-_Google_Cultural_Institute.jpg |
| `vrata-pismo.jpg` | J. Vermeer, Djevojka čita pismo kraj otvorenog prozora (oko 1658.) | Individualni online rad | https://commons.wikimedia.org/wiki/File:Johannes_Vermeer_-_Girl_Reading_a_Letter_by_an_Open_Window_-_Google_Art_Project.jpg |
| `vrata-nebo.jpg` | V. van Gogh, Zvjezdana noć (1889.) | Grupni online susreti | https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg |
| `objava-stablo.jpg` | G. Klimt, Drvo života (1909.) | tekst o konstelacijama prema Hellingeru | https://commons.wikimedia.org/wiki/File:Klimt_Tree_of_Life_1909.jpg |
| `objava-koraci.jpg` | V. van Gogh, Prvi koraci, prema Milletu (1890.), CC0 | „Ne traži od djeteta…" | https://commons.wikimedia.org/wiki/File:First_Steps,_after_Millet_MET_DP124808.jpg |
| `objava-put.jpg` | C. D. Friedrich, Lutalica nad morem magle (oko 1818.) | „Poštuj svoje pretke…" | https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg |
| `objava-povratak.jpg` | Rembrandt, Povratak izgubljenog sina (oko 1668.) | „Gubitak poštovanja prema roditeljima" | https://commons.wikimedia.org/wiki/File:Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg |
| `objava-korijenje.jpg` | V. van Gogh, Korijenje stabala (1890.) | „Naslijeđe predaka" | https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Tree-roots_-_Google_Art_Project.jpg |
| `luk-dobi.jpg` | C. D. Friedrich, Životne dobi (oko 1834.), izrez | uvod stranice Konstelacije | https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Die_Lebensstufen_(um_1834).jpg |

Koja slika ide u koja vrata određuju polja `slika` i `prizor` u `src/content/rad.ts`; naslovnu sliku teksta određuje polje `slika` u zaglavlju njegove datoteke u `content/blog/`.
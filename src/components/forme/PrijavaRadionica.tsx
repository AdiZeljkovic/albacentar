"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { opisDatuma, type Termin } from "@/content/rad";
import { EMAIL, GreskaSlanja, Kvacica, Med, Privola, useUpit } from "./useUpit";

const BEZ_TERMINA = "sljedeci";

const ULOGE = [
  { id: "S vlastitom temom", opis: "Postavljate svoju konstelaciju. Prije radionice javit ćemo se s nekoliko pitanja o temi." },
  { id: "Kao predstavnik", opis: "Sudjelujete u konstelacijama drugih. Mnogi tako prvi put upoznaju rad u Polju." },
  { id: "Još ne znam", opis: "Niste sigurni što vam odgovara? Napišite nam i zajedno ćemo razmotriti." },
];

const KORACI = ["Termin", "Uloga", "Podaci", "Potvrda"];

export default function PrijavaRadionica({ termini }: { termini: Termin[] }) {
  const [korak, setKorak] = useState(1);
  const [termin, setTermin] = useState(termini[0]?.id ?? BEZ_TERMINA);
  const [uloga, setUloga] = useState(ULOGE[0].id);
  const [ime, setIme] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [napomena, setNapomena] = useState("");
  const [med, setMed] = useState("");
  const [pokusaj, setPokusaj] = useState(false);
  const okvir = useRef<HTMLDivElement>(null);
  const { stanje, greska, posalji } = useUpit("radionica");

  // Link s početne (?termin=...) odmah odabire tu radionicu.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("termin");
    if (t && termini.some((x) => x.id === t)) setTermin(t);
  }, [termini]);

  const odabrani = termini.find((t) => t.id === termin);
  const nazivTermina = odabrani ? `${odabrani.naslov} · ${opisDatuma(odabrani.datum).puni}` : "Javite mi za sljedeći termin";

  const imeOk = ime.trim().length >= 2;
  const emailOk = EMAIL.test(email.trim());

  const idi = (n: number) => {
    setKorak(n);
    const el = okvir.current;
    if (!el) return;
    const vrh = el.getBoundingClientRect().top + window.scrollY - 110;
    if (Math.abs(window.scrollY - vrh) > 140) {
      if (window.__lenis) window.__lenis.scrollTo(vrh, { duration: 0.9 });
      else window.scrollTo({ top: vrh, behavior: "smooth" });
    }
  };

  const dalje = () => {
    if (korak === 3) {
      setPokusaj(true);
      if (!imeOk || !emailOk) return;
    }
    idi(Math.min(4, korak + 1));
  };

  const potvrdi = async () => {
    await posalji({
      email: email.trim(),
      ime: ime.trim(),
      med,
      polja: [
        ["Radionica", nazivTermina],
        ["Uloga", uloga],
        ["Mobitel", tel],
        ["Napomena", napomena],
      ],
    });
  };

  return (
    <div className="raspored-forme" ref={okvir}>
      <form className="kartica forma-kartica" onSubmit={(e) => e.preventDefault()} noValidate>
        {stanje === "poslano" ? (
          <div className="hvala" role="status">
            <Kvacica />
            <h3>Hvala, prijava je zaprimljena.</h3>
            <p>
              Javit ćemo vam se e-mailom s potvrdom mjesta, lokacijom i svim uvjetima sudjelovanja. Ako poruka ne stigne za
              dan ili dva, provjerite neželjenu poštu.
            </p>
            <Link className="btn btn-obrub" href="/">
              Natrag na početnu
            </Link>
          </div>
        ) : (
          <>
            <ol className="koraci" aria-label="Koraci prijave">
              {KORACI.map((k, i) => (
                <li key={k} data-stanje={i + 1 === korak ? "akt" : i + 1 < korak ? "gotov" : undefined} aria-current={i + 1 === korak ? "step" : undefined}>
                  <span>{i + 1}</span>
                  {k}
                </li>
              ))}
            </ol>

            {korak === 1 && (
              <fieldset className="korak">
                <legend>
                  <h3>Odaberite termin</h3>
                </legend>
                <div className="lista">
                  {termini.map((t) => {
                    const d = opisDatuma(t.datum);
                    return (
                      <label className="izbor" key={t.id}>
                        <input type="radio" name="termin" value={t.id} checked={termin === t.id} onChange={() => setTermin(t.id)} />
                        <span className="tocka" />
                        <span className="izbor-kad">
                          {d.dan}.<small>{d.mjesec.slice(0, 3)} · {d.danUTjednu.slice(0, 3)}</small>
                        </span>
                        <span>
                          <b>{t.naslov}</b>
                          <span className="op">
                            {t.opis} {t.napomena}.
                          </span>
                        </span>
                      </label>
                    );
                  })}
                  <label className="izbor">
                    <input type="radio" name="termin" value={BEZ_TERMINA} checked={termin === BEZ_TERMINA} onChange={() => setTermin(BEZ_TERMINA)} />
                    <span className="tocka" />
                    <span>
                      <b>{termini.length ? "Nijedan termin mi ne odgovara" : "Javite mi za sljedeći termin"}</b>
                      <span className="op">Javit ćemo vam se čim sljedeća radionica bude otvorena za prijave.</span>
                    </span>
                  </label>
                </div>
              </fieldset>
            )}

            {korak === 2 && (
              <fieldset className="korak">
                <legend>
                  <h3>Kako želite sudjelovati?</h3>
                </legend>
                <div className="lista">
                  {ULOGE.map((u) => (
                    <label className="izbor" key={u.id}>
                      <input type="radio" name="uloga" value={u.id} checked={uloga === u.id} onChange={() => setUloga(u.id)} />
                      <span className="tocka" />
                      <span>
                        <b>{u.id}</b>
                        <span className="op">{u.opis}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {korak === 3 && (
              <fieldset className="korak">
                <legend>
                  <h3>Vaši podaci</h3>
                </legend>
                <div className="polja">
                  <div className="polje">
                    <label htmlFor="pr-ime">Ime i prezime</label>
                    <input id="pr-ime" type="text" autoComplete="name" value={ime} onChange={(e) => setIme(e.target.value)} aria-invalid={pokusaj && !imeOk} />
                    {pokusaj && !imeOk && <p className="greska">Upišite ime i prezime.</p>}
                  </div>
                  <div className="polje">
                    <label htmlFor="pr-tel">
                      Mobitel <span className="neob">(nije obavezno)</span>
                    </label>
                    <input id="pr-tel" type="tel" autoComplete="tel" value={tel} onChange={(e) => setTel(e.target.value)} />
                  </div>
                  <div className="polje cijelo">
                    <label htmlFor="pr-mail">E-mail</label>
                    <input id="pr-mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={pokusaj && !emailOk} />
                    {pokusaj && !emailOk && <p className="greska">Upišite ispravnu e-mail adresu, na nju stiže potvrda.</p>}
                  </div>
                  <div className="polje cijelo">
                    <label htmlFor="pr-nap">
                      Napomena <span className="neob">(nije obavezno)</span>
                    </label>
                    <textarea id="pr-nap" rows={3} value={napomena} onChange={(e) => setNapomena(e.target.value)} />
                  </div>
                </div>
                <Med value={med} onChange={setMed} />
                <p className="sitno" style={{ marginTop: 14 }}>
                  Sve što napišete vidi samo voditeljica radionice.
                </p>
              </fieldset>
            )}

            {korak === 4 && (
              <div className="korak">
                <h3>Provjerite i pošaljite</h3>
                <dl className="pregled">
                  <div>
                    <dt>Radionica</dt>
                    <dd>{nazivTermina}</dd>
                  </div>
                  <div>
                    <dt>Uloga</dt>
                    <dd>{uloga}</dd>
                  </div>
                  <div>
                    <dt>Ime i prezime</dt>
                    <dd>{ime}</dd>
                  </div>
                  <div>
                    <dt>E-mail</dt>
                    <dd>{email}</dd>
                  </div>
                  {tel && (
                    <div>
                      <dt>Mobitel</dt>
                      <dd>{tel}</dd>
                    </div>
                  )}
                  {napomena && (
                    <div>
                      <dt>Napomena</dt>
                      <dd>{napomena}</dd>
                    </div>
                  )}
                </dl>
                <Privola />
                {stanje === "greska" && <GreskaSlanja poruka={greska} />}
              </div>
            )}

            <div className="nav-koraka">
              <button type="button" className="btn btn-obrub" onClick={() => idi(korak - 1)} style={{ visibility: korak > 1 ? "visible" : "hidden" }}>
                Natrag
              </button>
              {korak < 4 ? (
                <button type="button" className="btn" onClick={dalje}>
                  Dalje <span className="str" aria-hidden="true">→</span>
                </button>
              ) : (
                <button type="button" className="btn" onClick={potvrdi} disabled={stanje === "salje"}>
                  {stanje === "salje" ? "Šaljem…" : "Pošalji prijavu"}
                </button>
              )}
            </div>
          </>
        )}
      </form>

      <aside className="sazetak">
        <div className="kartica">
          <p className="oz">Vaša prijava</p>
          <dl className="sazetak-redovi">
            <div>
              <dt>Radionica</dt>
              <dd>{odabrani ? odabrani.naslov : "Sljedeći termin"}</dd>
            </div>
            <div>
              <dt>Datum</dt>
              <dd>{odabrani ? opisDatuma(odabrani.datum).puni : "po dogovoru"}</dd>
            </div>
            <div>
              <dt>Uloga</dt>
              <dd>{uloga}</dd>
            </div>
            <div>
              <dt>Način</dt>
              <dd>{odabrani ? odabrani.nacin : "po dogovoru"}</dd>
            </div>
          </dl>
          <p className="sitno">Lokaciju, cijenu i uvjete sudjelovanja šaljemo e-mailom nakon prijave. Prijava vas ne obvezuje na plaćanje.</p>
        </div>
        <p className="sazetak-nap">
          <span className="fig" />
          Sudjelovanje je uvijek dobrovoljno. Sami odlučujete koliko želite podijeliti.
        </p>
      </aside>
    </div>
  );
}

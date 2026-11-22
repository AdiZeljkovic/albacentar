"use client";

import { useEffect, useMemo, useState } from "react";
import { EMAIL, GreskaSlanja, Kvacica, Med, Privola, useUpit } from "./useUpit";

const VRSTE = [
  { id: "Individualna konstelacija", opis: "Vaša tema, jedan na jedan, u mirnom prostoru" },
  { id: "Individualne konzultacije", opis: "Razgovor o životnoj situaciji i mogućim koracima" },
];
const NACINI = ["Uživo", "Online"];
const DIJELOVI = ["Prijepodne", "Poslijepodne", "Navečer"];
const MJESECI = ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"];
const MJESECI_G = ["siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja", "srpnja", "kolovoza", "rujna", "listopada", "studenoga", "prosinca"];
const DANI = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
const NAJVISE_MJESECI = 3;

const kljuc = (g: number, m: number, d: number) => `${g}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/**
 * Upit za individualni termin. Termini se dogovaraju na upit, pa kalendar ne prikazuje
 * „slobodne" termine nego služi za odabir željenog dana. Termin se potvrđuje e-mailom.
 */
export default function UpitTermin() {
  const [vrsta, setVrsta] = useState(VRSTE[0].id);
  const [nacin, setNacin] = useState(NACINI[0]);
  const [danas, setDanas] = useState<Date | null>(null);
  const [pomak, setPomak] = useState(0);
  const [dan, setDan] = useState<string | null>(null);
  const [dio, setDio] = useState<string | null>(null);
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [tema, setTema] = useState("");
  const [med, setMed] = useState("");
  const [pokusaj, setPokusaj] = useState(false);
  const { stanje, greska, posalji } = useUpit("konzultacije");

  // „Danas" se određuje u pregledniku, da se kalendar ne razlikuje od onoga što je poslužitelj iscrtao.
  useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setDanas(d);
    // Ako je do kraja mjeseca ostalo samo nekoliko dana, kalendar se otvara na sljedećem mjesecu.
    const zadnji = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    if (zadnji - d.getDate() < 5) setPomak(1);
  }, []);

  const mjesec = useMemo(() => {
    if (!danas) return null;
    const prvi = new Date(danas.getFullYear(), danas.getMonth() + pomak, 1);
    const g = prvi.getFullYear();
    const m = prvi.getMonth();
    return { g, m, praznih: (prvi.getDay() + 6) % 7, dana: new Date(g, m + 1, 0).getDate() };
  }, [danas, pomak]);

  const opisDana = (k: string) => {
    const [g, m, d] = k.split("-").map(Number);
    return `${d}. ${MJESECI_G[m - 1]} ${g}.`;
  };
  const terminTekst = dan ? `${opisDana(dan)}${dio ? `, ${dio.toLowerCase()}` : ""}` : "";

  const imeOk = ime.trim().length >= 2;
  const emailOk = EMAIL.test(email.trim());

  const predaj = async (e: React.FormEvent) => {
    e.preventDefault();
    setPokusaj(true);
    if (!imeOk || !emailOk) return;
    await posalji({
      email: email.trim(),
      ime: ime.trim(),
      med,
      polja: [
        ["Vrsta susreta", vrsta],
        ["Način", nacin],
        ["Željeni termin", terminTekst || "po dogovoru"],
        ["Telefon", tel],
        ["Tema", tema],
      ],
    });
  };

  if (stanje === "poslano") {
    return (
      <div className="kartica forma-kartica">
        <div className="hvala" role="status">
          <Kvacica />
          <h3>Hvala, upit je poslan.</h3>
          <p>
            Javit ćemo vam se e-mailom s potvrdom termina ili prijedlogom najbližeg slobodnog, zajedno s informacijama o
            načinu rada i uvjetima sudjelovanja.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="raspored-forme" onSubmit={predaj} noValidate>
      <div className="kartica forma-kartica">
        <fieldset>
          <legend className="oznaka">Vrsta susreta</legend>
          <div className="vrste">
            {VRSTE.map((v) => (
              <label className="izbor" key={v.id}>
                <input type="radio" name="vrsta" value={v.id} checked={vrsta === v.id} onChange={() => setVrsta(v.id)} />
                <span className="tocka" />
                <span>
                  <b>{v.id}</b>
                  <span className="op">{v.opis}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="prekidac" role="radiogroup" aria-label="Način susreta">
          {NACINI.map((n) => (
            <label key={n}>
              <input type="radio" name="nacin" value={n} checked={nacin === n} onChange={() => setNacin(n)} />
              {n}
            </label>
          ))}
        </div>

        <div className="kal">
          <div className="kal-glava">
            <button type="button" aria-label="Prethodni mjesec" disabled={pomak === 0} onClick={() => setPomak((p) => Math.max(0, p - 1))}>
              ‹
            </button>
            <h3 aria-live="polite">{mjesec ? `${MJESECI[mjesec.m]} ${mjesec.g}.` : " "}</h3>
            <button type="button" aria-label="Sljedeći mjesec" disabled={pomak >= NAJVISE_MJESECI} onClick={() => setPomak((p) => Math.min(NAJVISE_MJESECI, p + 1))}>
              ›
            </button>
          </div>
          <div className="kal-dani" key={pomak}>
            {DANI.map((d) => (
              <span className="kal-ime" key={d}>
                {d}
              </span>
            ))}
            {mjesec &&
              Array.from({ length: mjesec.praznih }, (_, i) => <span key={`p${i}`} />)}
            {mjesec &&
              danas &&
              Array.from({ length: mjesec.dana }, (_, i) => {
                const d = i + 1;
                const k = kljuc(mjesec.g, mjesec.m, d);
                const datum = new Date(mjesec.g, mjesec.m, d);
                const moze = datum.getTime() > danas.getTime();
                return (
                  <button
                    type="button"
                    key={k}
                    className={dan === k ? "odab" : moze ? "slob" : undefined}
                    disabled={!moze}
                    aria-pressed={dan === k}
                    aria-label={opisDana(k)}
                    onClick={() => setDan(dan === k ? null : k)}
                  >
                    {d}
                  </button>
                );
              })}
            {!mjesec && Array.from({ length: 35 }, (_, i) => <span className="kal-kostur" key={i} />)}
          </div>
          <div className="kal-dio" role="radiogroup" aria-label="Dio dana">
            {DIJELOVI.map((x) => (
              <button type="button" key={x} role="radio" aria-checked={dio === x} className={dio === x ? "odab" : undefined} onClick={() => setDio(dio === x ? null : x)}>
                {x}
              </button>
            ))}
          </div>
          <p className="sitno" style={{ marginTop: 16 }}>
            Odaberite dan koji vam najviše odgovara. Termini se dogovaraju na upit, pa točno vrijeme potvrđujemo e-mailom.
          </p>
        </div>
      </div>

      <aside className="sazetak">
        <div className="kartica">
          <p className="oz">Vaš upit</p>
          <dl className="sazetak-redovi">
            <div>
              <dt>Vrsta</dt>
              <dd>{vrsta}</dd>
            </div>
            <div>
              <dt>Način</dt>
              <dd>{nacin}</dd>
            </div>
            <div>
              <dt>Željeni termin</dt>
              <dd>{terminTekst || "odaberite dan"}</dd>
            </div>
          </dl>
          <div className="sazetak-polja">
            <div className="polje">
              <label htmlFor="ut-ime">Ime i prezime</label>
              <input id="ut-ime" type="text" autoComplete="name" value={ime} onChange={(e) => setIme(e.target.value)} aria-invalid={pokusaj && !imeOk} />
              {pokusaj && !imeOk && <p className="greska">Upišite ime i prezime.</p>}
            </div>
            <div className="polje">
              <label htmlFor="ut-mail">E-mail</label>
              <input id="ut-mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={pokusaj && !emailOk} />
              {pokusaj && !emailOk && <p className="greska">Upišite ispravnu e-mail adresu.</p>}
            </div>
            <div className="polje">
              <label htmlFor="ut-tel">
                Telefon <span className="neob">(nije obavezno)</span>
              </label>
              <input id="ut-tel" type="tel" autoComplete="tel" value={tel} onChange={(e) => setTel(e.target.value)} />
            </div>
            <div className="polje">
              <label htmlFor="ut-tema">
                Tema, u nekoliko riječi <span className="neob">(nije obavezno)</span>
              </label>
              <textarea id="ut-tema" rows={3} value={tema} onChange={(e) => setTema(e.target.value)} />
            </div>
          </div>
          <Med value={med} onChange={setMed} />
          <button className="btn btn-siroko" type="submit" disabled={stanje === "salje"} style={{ marginTop: 20 }}>
            {stanje === "salje" ? "Šaljem…" : "Pošalji upit za termin"}
          </button>
          {stanje === "greska" && <GreskaSlanja poruka={greska} />}
          <div style={{ marginTop: 14 }}>
            <Privola />
          </div>
        </div>
      </aside>
    </form>
  );
}

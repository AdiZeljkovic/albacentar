"use client";

import { useState } from "react";
import { EMAIL, GreskaSlanja, Kvacica, Med, Privola, useUpit } from "./useUpit";

const TEME = [
  "Individualne konstelacije",
  "Grupne konstelacije i radionice",
  "Online susreti",
  "Individualne konzultacije",
  "Edukacije",
  "Knjige i publikacije",
  "Pratnja u završnom životnom razdoblju",
  "Nešto drugo",
];

export default function KontaktForma() {
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [tema, setTema] = useState(TEME[0]);
  const [poruka, setPoruka] = useState("");
  const [med, setMed] = useState("");
  const [pokusaj, setPokusaj] = useState(false);
  const { stanje, greska, posalji } = useUpit("kontakt");

  const imeOk = ime.trim().length >= 2;
  const emailOk = EMAIL.test(email.trim());
  const porukaOk = poruka.trim().length >= 5;

  const predaj = async (e: React.FormEvent) => {
    e.preventDefault();
    setPokusaj(true);
    if (!imeOk || !emailOk || !porukaOk) return;
    await posalji({
      email: email.trim(),
      ime: ime.trim(),
      med,
      polja: [
        ["Tema", tema],
        ["Telefon", tel],
        ["Poruka", poruka],
      ],
    });
  };

  if (stanje === "poslano") {
    return (
      <div className="kartica forma-kartica">
        <div className="hvala" role="status">
          <Kvacica />
          <h3>Hvala, poruka je stigla.</h3>
          <p>Odgovaram na svaku poruku. Javit ću vam se na e-mail koji ste ostavili.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="kartica forma-kartica" onSubmit={predaj} noValidate>
      <div className="polja">
        <div className="polje">
          <label htmlFor="k-ime">Ime i prezime</label>
          <input id="k-ime" type="text" autoComplete="name" value={ime} onChange={(e) => setIme(e.target.value)} aria-invalid={pokusaj && !imeOk} />
          {pokusaj && !imeOk && <p className="greska">Upišite ime i prezime.</p>}
        </div>
        <div className="polje">
          <label htmlFor="k-mail">E-mail</label>
          <input id="k-mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={pokusaj && !emailOk} />
          {pokusaj && !emailOk && <p className="greska">Upišite ispravnu e-mail adresu.</p>}
        </div>
        <div className="polje">
          <label htmlFor="k-tema">Tema</label>
          <select id="k-tema" value={tema} onChange={(e) => setTema(e.target.value)}>
            {TEME.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="polje">
          <label htmlFor="k-tel">
            Telefon <span className="neob">(nije obavezno)</span>
          </label>
          <input id="k-tel" type="tel" autoComplete="tel" value={tel} onChange={(e) => setTel(e.target.value)} />
        </div>
        <div className="polje cijelo">
          <label htmlFor="k-poruka">Poruka</label>
          <textarea id="k-poruka" rows={6} value={poruka} onChange={(e) => setPoruka(e.target.value)} aria-invalid={pokusaj && !porukaOk} />
          {pokusaj && !porukaOk && <p className="greska">Napišite nam barem nekoliko riječi.</p>}
        </div>
      </div>
      <Med value={med} onChange={setMed} />
      <div className="forma-dno">
        <button className="btn" type="submit" disabled={stanje === "salje"}>
          {stanje === "salje" ? "Šaljem…" : "Pošalji poruku"}
        </button>
        <Privola />
      </div>
      {stanje === "greska" && <GreskaSlanja poruka={greska} />}
    </form>
  );
}

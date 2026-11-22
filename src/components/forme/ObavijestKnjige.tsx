"use client";

import { useState } from "react";
import { EMAIL, GreskaSlanja, Kvacica, Med, Privola, useUpit } from "./useUpit";

export default function ObavijestKnjige({ naslovi }: { naslovi: string[] }) {
  const [email, setEmail] = useState("");
  const [odabrane, setOdabrane] = useState<string[]>(naslovi);
  const [med, setMed] = useState("");
  const [pokusaj, setPokusaj] = useState(false);
  const { stanje, greska, posalji } = useUpit("knjige");
  const emailOk = EMAIL.test(email.trim());

  const predaj = async (e: React.FormEvent) => {
    e.preventDefault();
    setPokusaj(true);
    if (!emailOk) return;
    await posalji({ email: email.trim(), med, polja: [["Knjige", odabrane.join(", ") || "sve"]] });
  };

  if (stanje === "poslano") {
    return (
      <div className="hvala" role="status">
        <Kvacica />
        <h3>Zabilježeno.</h3>
        <p>Javit ćemo vam se čim knjige budu dostupne.</p>
      </div>
    );
  }

  return (
    <form className="obavijest" onSubmit={predaj} noValidate>
      <div className="obavijest-knjige" role="group" aria-label="Knjige koje vas zanimaju">
        {naslovi.map((n) => (
          <label className="izbor" key={n}>
            <input
              type="checkbox"
              checked={odabrane.includes(n)}
              onChange={(e) => setOdabrane((o) => (e.target.checked ? [...o, n] : o.filter((x) => x !== n)))}
            />
            <span className="tocka" />
            <span>
              <b>{n}</b>
            </span>
          </label>
        ))}
      </div>
      <div className="obavijest-red">
        <div className="polje">
          <label htmlFor="ok-mail">E-mail na koji javljamo</label>
          <input id="ok-mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={pokusaj && !emailOk} />
        </div>
        <button className="btn" type="submit" disabled={stanje === "salje"}>
          {stanje === "salje" ? "Šaljem…" : "Javite mi kad izađe"}
        </button>
      </div>
      {pokusaj && !emailOk && <p className="greska">Upišite ispravnu e-mail adresu.</p>}
      <Med value={med} onChange={setMed} />
      {stanje === "greska" && <GreskaSlanja poruka={greska} />}
      <Privola />
    </form>
  );
}

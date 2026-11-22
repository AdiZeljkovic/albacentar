"use client";

import { useState } from "react";

const PREDLOZAK = `Poštovani,

zanima me (zaokružite ili obrišite): individualna konstelacija / grupna konstelacija / online susret / konzultacije / edukacija.

Tema koju želim istražiti:
Termini koji mi odgovaraju:
Način (uživo ili online):

Ime i prezime:
Telefon:

Hvala i lijep pozdrav`;

/** Kopira gotov predložak upita, za one koji radije pišu iz svog e-maila ili Messengera. */
export default function KopirajUpit() {
  const [kopirano, setKopirano] = useState(false);

  const kopiraj = async () => {
    try {
      await navigator.clipboard.writeText(PREDLOZAK);
      setKopirano(true);
      window.setTimeout(() => setKopirano(false), 2400);
    } catch {
      /* bez dopuštenja za međuspremnik gumb jednostavno ne radi ništa */
    }
  };

  return (
    <button type="button" className="btn btn-obrub" onClick={kopiraj} aria-live="polite">
      {kopirano ? "Predložak je kopiran" : "Kopiraj upit za naručivanje"}
    </button>
  );
}

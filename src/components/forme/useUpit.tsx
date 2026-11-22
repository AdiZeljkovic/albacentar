"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

export type StanjeUpita = "mirno" | "salje" | "poslano" | "greska";
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Upit = {
  email: string;
  ime?: string;
  /** Parovi [oznaka, vrijednost] koji će se naći u e-mailu, redom. */
  polja: Array<[string, string]>;
  med: string;
};

/** Slanje upita na /api/upit, sa stanjem za prikaz (šalje se, poslano, greška). */
export function useUpit(vrsta: "radionica" | "konzultacije" | "knjige" | "kontakt") {
  const [stanje, setStanje] = useState<StanjeUpita>("mirno");
  const [greska, setGreska] = useState("");
  const pocetak = useRef(0);

  useEffect(() => {
    pocetak.current = Date.now();
  }, []);

  const posalji = useCallback(
    async (upit: Upit) => {
      setStanje("salje");
      setGreska("");
      try {
        const odgovor = await fetch("/api/upit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vrsta, ...upit, trajanje: Date.now() - pocetak.current }),
        });
        if (odgovor.ok) {
          setStanje("poslano");
          return true;
        }
        const podaci = (await odgovor.json().catch(() => ({}))) as { greska?: string };
        setGreska(odgovor.status === 400 && podaci.greska ? podaci.greska : "");
        setStanje("greska");
      } catch {
        setGreska("");
        setStanje("greska");
      }
      return false;
    },
    [vrsta],
  );

  return { stanje, greska, posalji, vrati: () => setStanje("mirno") };
}

/** Poruka ispod obrasca kad slanje ne uspije. Uvijek nudi e-mail kao drugi put. */
export function GreskaSlanja({ poruka }: { poruka: string }) {
  return (
    <p className="poruka-forme" role="alert">
      {poruka || "Poruku trenutno nije bilo moguće poslati."} Pokušajte ponovno ili nam pišite izravno na{" "}
      <a href={`mailto:${site.email}`}>{site.email}</a>.
    </p>
  );
}

/** Skriveno polje, zamka za robote. Ljudi ga ne vide i ne mogu doći do njega tipkovnicom. */
export function Med({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="med" aria-hidden="true">
      <label>
        Ne ispunjavajte ovo polje
        <input type="text" name="web-stranica" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function Privola() {
  return (
    <p className="sitno">
      Slanjem pristajete da vaše podatke koristimo samo za odgovor na ovaj upit. Više u{" "}
      <Link href="/privatnost">zaštiti privatnosti</Link>.
    </p>
  );
}

export function Kvacica() {
  return (
    <div className="krug">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path pathLength={1} d="M20 6 9 17l-5-5" />
      </svg>
    </div>
  );
}

import Link from "next/link";
import { opisDatuma, type Termin } from "@/content/rad";
import { kas } from "@/lib/util";

/** Popis nadolazećih radionica na noćnoj podlozi. Mjesta su prikazana figurama. */
export default function Termini({ termini }: { termini: Termin[] }) {
  if (termini.length === 0) {
    return (
      <div className="termini-prazno" data-reveal>
        <span className="fig" />
        <p>
          Novi termini objavljuju se prema organizaciji susreta. Javite se i obavijestit ćemo vas čim sljedeća radionica
          bude otvorena za prijave.
        </p>
        <Link className="btn btn-zlato" href="/radionice#prijava">
          Javite mi za sljedeći termin
        </Link>
      </div>
    );
  }

  return (
    <div className="termini">
      {termini.map((t, i) => {
        const d = opisDatuma(t.datum);
        return (
          <article className="termin" key={t.id} data-reveal style={kas(i * 0.1)}>
            <p className="termin-kad">
              {d.dan}.
              <small>
                {d.mjesec} · {d.danUTjednu}
              </small>
            </p>
            <div>
              <h3>{t.naslov}</h3>
              <p className="termin-opis">{t.opis}</p>
              <div className="termin-mjesta">
                <span className="termin-sjedala" aria-hidden="true">
                  {Array.from({ length: t.mjesta }, (_, k) => (
                    <span key={k} className={k < t.zauzeto ? "fig puna" : "fig"} />
                  ))}
                </span>
                <span className="termin-nap">{t.napomena}</span>
              </div>
            </div>
            <Link className={i === 0 ? "btn btn-zlato" : "btn btn-svijetlo"} href={`/radionice?termin=${t.id}#prijava`}>
              Prijavi se
            </Link>
          </article>
        );
      })}
    </div>
  );
}

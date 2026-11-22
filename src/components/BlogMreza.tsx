"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Lampion from "@/components/blog/Lampion";
import { vars } from "@/lib/util";

type Kartica = { slug: string; naslov: string; kategorija: string; datumTekst: string; slika: string; slikaAlt: string; citat: string; sazetak: string; minuta: number };

/**
 * Popis tekstova kao nebo s lampionima: svaki tekst je lampion kroz čiji papir svijetli njegova
 * slika, a o njemu na niti visi cedulja s naslovom. Najnoviji tekst je velik lampion s opisom uz
 * sebe i rukom ispisanom rečenicom na cedulji. Kad se promijeni kategorija, lampioni se iznova
 * dignu na svoja mjesta.
 */
export default function BlogMreza({ clanci, kategorije }: { clanci: Kartica[]; kategorije: string[] }) {
  const [filter, setFilter] = useState("Sve");
  const vidljivi = filter === "Sve" ? clanci : clanci.filter((c) => c.kategorija === filter);
  const broj = (k: string) => (k === "Sve" ? clanci.length : clanci.filter((c) => c.kategorija === k).length);

  return (
    <>
      <div className="filteri" role="group" aria-label="Kategorije">
        {["Sve", ...kategorije].map((k) => (
          // broj tekstova ispisuje CSS iz data-broj, pa tekst gumba ostaje samo naziv kategorije
          <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} data-broj={broj(k)}>
            {k}
          </button>
        ))}
      </div>

      <div className="objave" key={filter}>
        {vidljivi.map((c, i) => {
          const glavna = i === 0 && filter === "Sve";
          // ritam njihanja cedulje, različit od lampiona do lampiona
          const njih = vars({ "--t": `${4.6 + (i % 3) * 0.9}s`, "--d": `${-i * 1.3}s` });
          const lampion = (
            <Lampion
              slika={c.slika}
              alt={c.slikaAlt}
              velik={glavna}
              i={i}
              sizes={glavna ? "(max-width: 900px) 70vw, 380px" : "(max-width: 560px) 40vw, 200px"}
              klasaTijela={c.slika ? "objava-slika" : "objava-tekstna"}
            >
              <Image className="bl-l-znak" src="/img/drvo-zlatno.png" alt="" width={520} height={500} sizes="200px" />
            </Lampion>
          );

          return (
            <Link className={glavna ? "objava objava-glavna" : "objava"} href={`/blog/${c.slug}`} key={c.slug} style={{ "--i": i } as CSSProperties} data-reveal>
              <div className="bl-lebdi">
                <div className="bl-leti" style={vars({ "--t": `${7 + (i % 4) * 1.1}s`, "--d": `${-i * 2.3}s` })}>
                  {lampion}
                  {glavna ? (
                    c.citat && (
                      <div className="bl-visak" style={njih}>
                        <span className="bl-nit" aria-hidden="true" />
                        <div className="bl-cedulja bl-zelja">
                          <q>{c.citat}</q>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="bl-visak" style={njih}>
                      <span className="bl-nit" aria-hidden="true" />
                      <div className="objava-tijelo bl-cedulja">
                        <p className="kat">{c.kategorija}</p>
                        <h2>{c.naslov}</h2>
                        {!c.slika && c.citat && <q className="bl-navod">{c.citat}</q>}
                        <p className="objava-min">
                          <span className="bl-nb">{c.datumTekst}</span>{" "}
                          <span className="bl-tocka" aria-hidden="true">
                            ·
                          </span>{" "}
                          <span className="bl-nb">{c.minuta} min čitanja</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {glavna && (
                <div className="objava-tijelo">
                  <p className="kat">
                    {c.kategorija} · {c.datumTekst}
                  </p>
                  <h2>{c.naslov}</h2>
                  <p className="mut">{c.sazetak}</p>
                  <p className="objava-min">{c.minuta} min čitanja</p>
                  <span className="link bl-dalje">
                    Čitajte dalje{" "}
                    <span className="str" aria-hidden="true">
                      →
                    </span>
                  </span>
                </div>
              )}
            </Link>
          );
        })}
        {vidljivi.length === 0 && <p className="mut">U ovoj kategoriji još nema tekstova.</p>}
      </div>
    </>
  );
}

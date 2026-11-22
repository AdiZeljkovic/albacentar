"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { kas } from "@/lib/util";

type Stavka = { p: string; o: string };

/** Na kojoj visini reda stoji postaja (sredina znaka), u pikselima od vrha reda. */
const ZNAK_Y = 43;
/** Sredina staze, u pikselima od desnog ruba popisa. */
const STAZA_X = 20;
/** Put u sekciji „O meni" završava na ovom udjelu širine stranice; odatle se staza nastavlja ovamo. */
const KRAJ_PUTA = 0.64;

/**
 * Česta pitanja kao postaje na putu. Put koji u sekciji iznad vodi prema suncu ovdje se nastavlja
 * kao zlatna staza uz desni rub popisa; svako pitanje je jedna postaja. Staza je „prijeđena" do
 * otvorenog pitanja, čija postaja svijetli kao sunce, i po njoj stalno putuje svjetlo.
 * Odgovori su u HTML-u i kad su zatvoreni, zbog tražilica.
 */
export default function Putokazi({ stavke, kraj = true, razina = "h3" }: { stavke: readonly Stavka[]; kraj?: boolean; /** Razina naslova pitanja: h3 ispod naslova sekcije, h2 kad su pitanja odmah ispod naslova stranice. */ razina?: "h2" | "h3" }) {
  const Pitanje = razina;
  const id = useId();
  const [otvoreno, setOtvoreno] = useState<number | null>(0);
  const okvir = useRef<HTMLDivElement>(null);
  const spoj = useRef<SVGSVGElement>(null);
  const stanice = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const el = okvir.current;
    if (!el) return;

    const mjeri = () => {
      // dokle je staza prijeđena
      const s = otvoreno === null ? null : stanice.current[otvoreno];
      el.style.setProperty("--do", `${s ? s.offsetTop + ZNAK_Y : 0}px`);

      // spoj s putem iz sekcije iznad: krivulja od vrha sekcije do početka staze
      const crta = spoj.current;
      const sekcija = el.closest("section");
      if (!crta || !sekcija) return;
      const o = el.getBoundingClientRect();
      const vrh = sekcija.getBoundingClientRect().top;
      const gore = document.documentElement.clientWidth * KRAJ_PUTA;
      const dolje = o.right - STAZA_X;
      const sirina = Math.abs(dolje - gore);
      crta.style.left = `${Math.min(gore, dolje) - o.left}px`;
      crta.style.width = `${Math.max(sirina, 2)}px`;
      crta.style.height = `${Math.max(0, o.top - vrh)}px`;
      crta.style.transform = dolje >= gore ? "" : "scaleX(-1)";
    };

    mjeri();
    const promjena = new ResizeObserver(mjeri);
    promjena.observe(el);
    window.addEventListener("resize", mjeri);
    return () => {
      promjena.disconnect();
      window.removeEventListener("resize", mjeri);
    };
  }, [otvoreno]);

  return (
    <div className="putokazi" ref={okvir} data-ima={otvoreno === null ? undefined : "1"}>
      {/* staza iz sekcije iznad */}
      <svg className="put-spoj" ref={spoj} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="put-spoj-boja" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
            <stop offset="0" stopColor="#c9973f" stopOpacity="0" />
            <stop offset=".3" stopColor="#c9973f" stopOpacity=".7" />
            <stop offset="1" stopColor="#c9973f" />
          </linearGradient>
        </defs>
        <path d="M0 0 C0 52 100 44 100 100" fill="none" stroke="url(#put-spoj-boja)" strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="put-staza" aria-hidden="true">
        <i className="put-prijedjen" />
        <i className="put-svjetlo" />
      </div>

      {stavke.map((s, i) => {
        const jest = otvoreno === i;
        return (
          <div
            key={s.p}
            className="put-stanica"
            ref={(cvor) => {
              stanice.current[i] = cvor;
            }}
            data-otvoreno={jest ? "1" : undefined}
            data-proslo={otvoreno !== null && i < otvoreno ? "1" : undefined}
            data-reveal
            style={kas(Math.min(i, 6) * 0.07)}
          >
            <span className="put-znak" aria-hidden="true">
              <i />
            </span>
            <div className="put-karta">
              <Pitanje>
                <button type="button" aria-expanded={jest} aria-controls={`${id}-${i}`} id={`${id}-g-${i}`} onClick={() => setOtvoreno(jest ? null : i)}>
                  <span className="put-br">{String(i + 1).padStart(2, "0")}</span>
                  <span className="put-p">{s.p}</span>
                </button>
              </Pitanje>
              <div className="put-odgovor" id={`${id}-${i}`} role="region" aria-labelledby={`${id}-g-${i}`} inert={!jest}>
                <div>
                  <p>{s.o}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {kraj && (
        <>
        {/* kraj staze: sva pitanja */}
        <div className="put-stanica put-kraj">
          <span className="put-znak" aria-hidden="true">
            <i />
          </span>
          <p className="red" data-reveal>
            <Link className="link" href="/cesta-pitanja">
              Sva pitanja i odgovori{" "}
              <span className="str" aria-hidden="true">
                →
              </span>
            </Link>
          </p>
        </div>
        </>
      )}
    </div>
  );
}

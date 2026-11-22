"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
import { lice, mijena } from "@/lib/mjesec";
import { ISKRA } from "@/lib/zvijezda";
import Prsten from "./Prsten";

/** Mjesec u mijeni u kojoj je večeras; dok se ne izračuna (u pregledniku), vidi se samo tamni kolut. */
function Mjesec({ m, id }: { m: number | null; id: string }) {
  return (
    <svg className="hdr-mjesec" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id={id}>
          <stop offset=".45" stopColor="#f3d391" stopOpacity=".45" />
          <stop offset="1" stopColor="#f3d391" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="hdr-mj-sjaj" cx="12" cy="12" r="12" fill={`url(#${id})`} />
      <circle cx="12" cy="12" r="7.6" fill="#18204a" stroke="#e2c487" strokeWidth=".7" strokeOpacity=".6" />
      {m !== null && <path className="hdr-mj-lice" d={lice(m, 12, 12, 7.6)} fill="#f6e6bd" />}
    </svg>
  );
}

/**
 * Gornja traka. Na vrhu stranice izbornik stoji izravno na noćnom nebu, bez podloge; čim se krene,
 * ispod njega se pojavi noćna traka. Donji rub je zlatna crta s podjelom kao rub astrolaba, a po njemu
 * klizi kazaljka: stoji pod stranicom na kojoj ste i prelazi na poveznicu nad kojom je pokazivač.
 * Dugme za prijavu nosi Mjesec u mijeni u kojoj je večeras (radionice su na stranici mjesečev kalendar).
 */
export default function Traka() {
  const pathname = usePathname();
  const [puna, setPuna] = useState(false);
  const [skrivena, setSkrivena] = useState(false);
  const [otvoren, setOtvoren] = useState(false);
  // mijena se računa tek u pregledniku, da se prikaz s poslužitelja i iz preglednika ne razlikuju
  const [mjesec, setMjesec] = useState<number | null>(null);
  const okvir = useRef<HTMLDivElement>(null);
  const izbornik = useRef<HTMLElement>(null);
  const kazaljka = useRef<HTMLSpanElement>(null);
  const vidljiva = useRef(false);

  useEffect(() => {
    setMjesec(mijena(Date.now()));
  }, []);

  /** Pomakne kazaljku pod danu poveznicu; bez poveznice je sakrije. */
  const pokazi = useCallback((el: HTMLElement | null) => {
    const k = kazaljka.current;
    const o = okvir.current;
    if (!k || !o) return;
    if (!el) {
      k.style.opacity = "0";
      vidljiva.current = false;
      return;
    }
    const a = el.getBoundingClientRect();
    const x = a.left + a.width / 2 - o.getBoundingClientRect().left;
    if (!vidljiva.current) {
      // iz skrivenog stanja se ne klizi preko cijele trake, nego se pojavi na mjestu
      k.style.transition = "none";
      k.style.transform = `translateX(${x}px)`;
      void k.offsetWidth;
      k.style.transition = "";
    } else {
      k.style.transform = `translateX(${x}px)`;
    }
    k.style.opacity = "1";
    vidljiva.current = true;
  }, []);

  const naAktivnu = useCallback(() => {
    pokazi(izbornik.current?.querySelector<HTMLElement>('a[aria-current="page"]') ?? null);
  }, [pokazi]);

  useEffect(() => {
    naAktivnu();
    // širina poveznica se promijeni kad stigne pravi font
    void document.fonts?.ready.then(naAktivnu);
    window.addEventListener("resize", naAktivnu);
    return () => window.removeEventListener("resize", naAktivnu);
  }, [pathname, naAktivnu]);

  // Traka je prozirna na vrhu, dobije podlogu čim se krene, a pri skrolu prema dolje se sklanja.
  useEffect(() => {
    let zadnji = window.scrollY;
    const naSkrol = () => {
      const y = window.scrollY;
      setPuna(y > 24);
      if (Math.abs(y - zadnji) > 6) {
        setSkrivena(y > zadnji && y > 420);
        zadnji = y;
      }
    };
    naSkrol();
    window.addEventListener("scroll", naSkrol, { passive: true });
    return () => window.removeEventListener("scroll", naSkrol);
  }, []);

  useEffect(() => {
    setOtvoren(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("bez-skrola", otvoren);
    if (otvoren) window.__lenis?.stop();
    else window.__lenis?.start();
    if (!otvoren) return;
    const naTipku = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtvoren(false);
    };
    window.addEventListener("keydown", naTipku);
    return () => window.removeEventListener("keydown", naTipku);
  }, [otvoren]);

  const aktivan = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className="hdr"
        data-puna={puna ? "1" : undefined}
        data-skrivena={skrivena && !otvoren ? "1" : undefined}
        data-otvoren={otvoren ? "1" : undefined}
      >
        {/* podloga: noćna traka koja se pojavi pri skrolu, i zlatni rub s podjelom */}
        <div className="hdr-traka" aria-hidden="true" />
        <div className="hdr-rub" aria-hidden="true" />
        <div className="hdr-in" ref={okvir}>
          <Link className="hdr-znak" href="/" aria-label="AlBa Centar, početna stranica">
            <Image src="/img/logo-svijetli.png" alt="AlBa Konstelacije" width={805} height={372} loading="eager" sizes="110px" />
          </Link>
          <nav className="hdr-nav" aria-label="Glavni izbornik" ref={izbornik} onMouseLeave={naAktivnu}>
            {nav.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                aria-current={aktivan(s.href) ? "page" : undefined}
                onMouseEnter={(e) => pokazi(e.currentTarget)}
                onFocus={(e) => pokazi(e.currentTarget)}
                onBlur={naAktivnu}
              >
                {s.label}
              </Link>
            ))}
          </nav>
          <Link className="hdr-cta" href="/radionice#prijava">
            <Mjesec m={mjesec} id="hmj" />
            <span>Prijava na radionicu</span>
          </Link>
          {/* kazaljka na rubu: tanka igla prema poveznici i zvijezda na crti */}
          <span className="hdr-kazaljka" ref={kazaljka} aria-hidden="true">
            <svg viewBox="0 0 30 40">
              <defs>
                <linearGradient id="hdr-igla" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#e2c487" stopOpacity="0" />
                  <stop offset="1" stopColor="#f3d391" stopOpacity=".9" />
                </linearGradient>
                <radialGradient id="hdr-kaz-sjaj">
                  <stop offset="0" stopColor="#fff1c9" stopOpacity=".8" />
                  <stop offset="1" stopColor="#f3d391" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path d="M15 6 V27" stroke="url(#hdr-igla)" strokeWidth="1" />
              <circle cx="15" cy="30" r="10" fill="url(#hdr-kaz-sjaj)" />
              <path d={ISKRA} transform="translate(15 30) scale(.62)" fill="#fff6dc" />
            </svg>
          </span>
          <button
            className="hdr-gumb"
            type="button"
            aria-label={otvoren ? "Zatvori izbornik" : "Otvori izbornik"}
            aria-expanded={otvoren}
            aria-controls="izbornik"
            onClick={() => setOtvoren((o) => !o)}
          >
            <span />
            <span />
            <i />
          </button>
        </div>
      </header>

      <div className="meni" id="izbornik" data-otvoren={otvoren ? "1" : undefined} aria-hidden={!otvoren} data-lenis-prevent>
        <Prsten className="meni-prsten" id="mpr" />
        <ul>
          {[{ href: "/", label: "Početna" }, ...nav, { href: "/kontakt", label: "Kontakt" }].map((s, i) => (
            <li key={s.href}>
              <Link
                href={s.href}
                tabIndex={otvoren ? 0 : -1}
                style={{ "--i": i } as CSSProperties}
                aria-current={(s.href === "/" ? pathname === "/" : aktivan(s.href)) ? "page" : undefined}
                onClick={() => setOtvoren(false)}
              >
                <small>{String(i + 1).padStart(2, "0")}</small>
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="meni-dno">
          <Link className="hdr-cta meni-cta" href="/radionice#prijava" tabIndex={otvoren ? 0 : -1} onClick={() => setOtvoren(false)}>
            <Mjesec m={mjesec} id="mmj" />
            <span>Prijava na radionicu</span>
          </Link>
          <p>
            <a href={`mailto:${site.email}`} tabIndex={otvoren ? 0 : -1}>
              {site.email}
            </a>
            {" · "}
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" tabIndex={otvoren ? 0 : -1}>
              Facebook
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

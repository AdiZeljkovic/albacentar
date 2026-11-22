"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { podrucjaRada } from "@/content/konstelacije";

const N = podrucjaRada.length;
const TRAJANJE = 5200; // koliko jedan luk stoji u sredini, u ms
const dva = (n: number) => String(n).padStart(2, "0");

/** Četverokraka zvijezda, isti oblik kao u herou. */
function Iskra({ x, y, v = 1, sjaj = false }: { x: number; y: number; v?: number; sjaj?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${v})`}>
      {sjaj && <circle r="20" fill="url(#portal-halo)" stroke="none" />}
      <path className="znak-iskra" d="M0 -9 Q1.2 -1.2 9 0 Q1.2 1.2 0 9 Q-1.2 1.2 -9 0 Q-1.2 -1.2 0 -9Z" />
    </g>
  );
}
/** Linija znaka; iscrtava se kad luk dođe u sredinu. */
function Crta({ d, tanka }: { d: string; tanka?: boolean }) {
  return <path className="znak-crta" pathLength={1} d={d} strokeWidth={tanka ? 0.8 : 1.2} opacity={tanka ? 0.6 : 1} />;
}
const Prsten = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => <circle cx={cx} cy={cy} r={r} strokeWidth=".6" strokeDasharray="1 5" opacity=".6" />;

/** Sedam znakova u zlatnoj liniji, po jedan za svako područje rada. */
const ZNAKOVI: ReactNode[] = [
  // 1. obiteljske i sistemske konstelacije: obiteljsko zviježđe
  <>
    <Prsten cx={100} cy={74} r={34} />
    <Crta d="M100 74 L62 118" />
    <Crta d="M100 74 L138 118" />
    <Crta d="M62 118 L36 160" tanka />
    <Crta d="M62 118 L78 166" tanka />
    <Crta d="M138 118 L122 166" tanka />
    <Crta d="M138 118 L164 160" tanka />
    <Iskra x={100} y={74} v={1.7} sjaj />
    <Iskra x={62} y={118} v={1.05} />
    <Iskra x={138} y={118} v={1.05} />
    <Iskra x={36} y={160} v={0.6} />
    <Iskra x={78} y={166} v={0.6} />
    <Iskra x={122} y={166} v={0.6} />
    <Iskra x={164} y={160} v={0.6} />
  </>,
  // 2. individualni rad: jedna zvijezda i figure oko nje
  <>
    <Prsten cx={100} cy={100} r={62} />
    <Crta d="M60 100 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" tanka />
    <Iskra x={100} y={100} v={1.9} sjaj />
    {[
      [100, 38, 180],
      [154, 131, -60],
      [46, 131, 60],
    ].map(([x, y, k]) => (
      <g key={k} transform={`translate(${x} ${y}) rotate(${k})`}>
        <circle r="9" strokeWidth="1.2" />
        <path d="M-3.4 -12 L0 -17 L3.4 -12 Z" className="znak-puno" stroke="none" />
      </g>
    ))}
  </>,
  // 3. grupni susreti: krug ljudi
  <>
    <Crta d="M36 100 a64 64 0 1 1 128 0 a64 64 0 1 1 -128 0" tanka />
    {Array.from({ length: 8 }, (_, k) => {
      const a = (k * 45 * Math.PI) / 180;
      return <Iskra key={k} x={Number((100 + 64 * Math.cos(a)).toFixed(1))} y={Number((100 + 64 * Math.sin(a)).toFixed(1))} v={0.78} />;
    })}
    <Prsten cx={100} cy={100} r={26} />
    <Iskra x={100} y={100} v={1.5} sjaj />
  </>,
  // 4. individualne konzultacije: razgovor udvoje
  <>
    <Crta d="M62 88 Q100 44 138 88" />
    <Crta d="M138 112 Q100 156 62 112" />
    <path d="M131 76 L139 89 L124 88" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M69 124 L61 111 L76 112" strokeWidth="1.2" strokeLinejoin="round" />
    <Prsten cx={48} cy={100} r={24} />
    <Prsten cx={152} cy={100} r={24} />
    <Iskra x={48} y={100} v={1.35} sjaj />
    <Iskra x={152} y={100} v={1.35} sjaj />
  </>,
  // 5. edukacije i radionice: otvorena knjiga iz koje izlazi svjetlo
  <>
    <Crta d="M28 150 Q64 130 100 146 Q136 130 172 150 L172 92 Q136 72 100 88 Q64 72 28 92 Z" />
    <Crta d="M100 88 L100 146" tanka />
    <Crta d="M42 104 Q66 94 88 102" tanka />
    <Crta d="M42 120 Q66 110 88 118" tanka />
    <Crta d="M112 102 Q134 94 158 104" tanka />
    <Crta d="M112 118 Q134 110 158 120" tanka />
    <Crta d="M100 80 L100 62" tanka />
    <Iskra x={100} y={44} v={1.6} sjaj />
    <Iskra x={66} y={54} v={0.6} />
    <Iskra x={134} y={54} v={0.6} />
  </>,
  // 6. osobni razvoj i obiteljsko nasljeđe: stablo s korijenjem
  <>
    <Crta d="M30 134 L170 134" tanka />
    <Crta d="M100 134 L100 92" />
    <Crta d="M100 96 Q84 76 62 62" />
    <Crta d="M100 92 Q100 70 100 46" />
    <Crta d="M100 96 Q116 76 138 62" />
    <Crta d="M100 134 Q88 152 64 172" tanka />
    <Crta d="M100 134 Q100 158 100 180" tanka />
    <Crta d="M100 134 Q112 152 136 172" tanka />
    <Iskra x={62} y={60} v={1.05} />
    <Iskra x={100} y={42} v={1.45} sjaj />
    <Iskra x={138} y={60} v={1.05} />
    <circle cx="64" cy="173" r="2.4" className="znak-puno" stroke="none" />
    <circle cx="100" cy="182" r="2.4" className="znak-puno" stroke="none" />
    <circle cx="136" cy="173" r="2.4" className="znak-puno" stroke="none" />
  </>,
  // 7. knjige i publikacije: knjiga sa znakom na korici
  <>
    <Crta d="M58 44 L140 36 L140 156 L58 164 Z" />
    <Crta d="M58 44 L44 52 L44 172 L58 164" />
    <Crta d="M44 172 L126 164 L140 156" tanka />
    <Crta d="M72 62 L126 57" tanka />
    <Crta d="M72 140 L126 135" tanka />
    <Prsten cx={99} cy={99} r={24} />
    <Iskra x={99} y={99} v={1.5} sjaj />
  </>,
];

/**
 * Sedam područja rada kao galerija noćnih lukova u 3D-u.
 * Luk u sredini je odabran i okrenut ravno; ostali su zakrenuti i odmaknuti u dubinu, poput vrtuljka.
 * Okreće se strelicama, klikom na bočni luk, povlačenjem ili tipkama lijevo i desno.
 * Dok se ništa ne dira, lukovi se sami izmjenjuju; pod mišem ili fokusom stanu.
 */
export default function Podrucja() {
  const [akt, setAkt] = useState(0);
  const [pauza, setPauza] = useState(false);
  const okvir = useRef<HTMLDivElement>(null);
  const vidljivo = useRef(false);
  const povlacenje = useRef<{ x: number; pomaknuto: boolean } | null>(null);

  const idi = useCallback((cilj: number) => setAkt(((cilj % N) + N) % N), []);

  useEffect(() => {
    const el = okvir.current;
    if (!el) return;
    const promatrac = new IntersectionObserver(([u]) => {
      vidljivo.current = u.isIntersecting;
    });
    promatrac.observe(el);
    return () => promatrac.disconnect();
  }, []);

  useEffect(() => {
    if (pauza) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // interval, a ne jednokratni sat: dok galerija nije na ekranu samo se preskače, pa se po povratku izmjenjivanje nastavlja
    const t = window.setInterval(() => {
      if (vidljivo.current) idi(akt + 1);
    }, TRAJANJE);
    return () => window.clearInterval(t);
  }, [akt, pauza, idi]);

  /** Koliko je luk i udaljen od odabranog, kraćim putem oko kruga (-3 … 3). */
  const odmak = (i: number) => {
    let d = i - akt;
    if (d > N / 2) d -= N;
    if (d < -N / 2) d += N;
    return d;
  };

  const stani = { onMouseEnter: () => setPauza(true), onMouseLeave: () => setPauza(false), onFocus: () => setPauza(true), onBlur: () => setPauza(false) };

  return (
    <div className="portali" ref={okvir} {...stani}>
      <div
        className="portali-pozornica"
        role="group"
        aria-roledescription="vrtuljak"
        aria-label="Sedam područja rada"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") idi(akt + 1);
          if (e.key === "ArrowLeft") idi(akt - 1);
        }}
        onPointerDown={(e) => {
          povlacenje.current = { x: e.clientX, pomaknuto: false };
        }}
        onPointerUp={(e) => {
          const p = povlacenje.current;
          if (!p) return;
          const dx = e.clientX - p.x;
          if (Math.abs(dx) > 46) {
            p.pomaknuto = true;
            idi(akt + (dx < 0 ? 1 : -1));
          }
          // klik na luk stiže odmah nakon ovoga; tek potom se povlačenje zaboravlja
          window.setTimeout(() => (povlacenje.current = null), 0);
        }}
        onPointerCancel={() => (povlacenje.current = null)}
      >
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <radialGradient id="portal-halo">
              <stop offset="0" stopColor="#f6dba0" stopOpacity=".7" />
              <stop offset=".45" stopColor="#e2c487" stopOpacity=".18" />
              <stop offset="1" stopColor="#e2c487" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {podrucjaRada.map((p, i) => {
          const d = odmak(i);
          const jest = d === 0;
          return (
            <article
              key={p.naziv}
              className="portal"
              data-akt={jest ? "1" : undefined}
              data-daleko={Math.abs(d) > 2 ? "1" : undefined}
              data-blizu={Math.abs(d) === 1 ? "1" : undefined}
              aria-hidden={!jest}
              style={{ "--o": d, "--ao": Math.abs(d) } as CSSProperties}
              onClick={() => {
                if (!jest && !povlacenje.current?.pomaknuto) idi(i);
              }}
            >
              <div className="portal-luk">
                <span className="portal-br">{dva(i + 1)}</span>
                <svg className="znak" viewBox="0 0 200 200" fill="none" stroke="#e9cd92" strokeLinecap="round" aria-hidden="true">
                  {ZNAKOVI[i]}
                </svg>
                <h3>{p.naziv}</h3>
                <p className="portal-opis">{p.opis}</p>
                <Link className="btn btn-zlato btn-malo" href={p.href} tabIndex={jest ? 0 : -1}>
                  Saznajte više <span className="str" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="portali-kontrole">
        <button type="button" className="portali-strelica" onClick={() => idi(akt - 1)} aria-label="Prethodno područje">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
        <ol className="portali-tocke" aria-label="Područja rada">
          {podrucjaRada.map((p, i) => (
            <li key={p.naziv}>
              <button type="button" data-akt={akt === i ? "1" : undefined} aria-current={akt === i ? "true" : undefined} aria-label={`${dva(i + 1)}: ${p.naziv}`} onClick={() => idi(i)}>
                {akt === i && !pauza && <i key={akt} style={{ animationDuration: `${TRAJANJE}ms` }} />}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="portali-strelica" onClick={() => idi(akt + 1)} aria-label="Sljedeće područje">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

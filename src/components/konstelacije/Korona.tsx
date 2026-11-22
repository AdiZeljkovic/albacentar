"use client";

import { useEffect, useRef } from "react";

/** Stalni „slučajni" brojevi iz sjemena: korona je uvijek ista. */
function nasumicno(sjeme: number) {
  let a = sjeme >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sunce s koronom za pomrčinu u „Što konstelacije nisu", po uzoru na pocetna/Pomrcina.tsx,
 * ali veće i bogatije jer ovdje stoji samo: više strujnica, duži snopovi duž osi korone.
 * Crta se na platnu jednom (ne animira se, pomiče ga CSS). Sunce je u sredini, polumjera 1/8 širine.
 */
export default function Korona({ sjeme, className }: { sjeme: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const platno = ref.current;
    const ctx = platno?.getContext("2d");
    if (!platno || !ctx) return;

    let posao = 0;
    let blizu = false;

    const crtaj = () => {
      cancelAnimationFrame(posao);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const s = Math.round(platno.offsetWidth * dpr);
      if (!s || s === platno.width) return;
      platno.width = s;
      platno.height = s;
      const kocka = nasumicno(sjeme * 7919 + 13);
      const cx = s / 2;
      const cy = s / 2;
      const R = s * 0.125;
      const krug = (r: number) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
      };

      // široki sjaj korone
      let g = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 3.95);
      g.addColorStop(0, "rgba(255,236,196,0.5)");
      g.addColorStop(0.18, "rgba(250,206,140,0.24)");
      g.addColorStop(0.5, "rgba(226,150,100,0.07)");
      g.addColorStop(1, "rgba(226,150,100,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);

      // strujnice: svjetlo se zbraja, pa se gusti snopovi sami istaknu
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      const os = 0.5 + kocka() * 0.5;
      // crtaju se u dijelovima, nekoliko milisekundi po sličici, da stranica pritom ne zastane
      let i = 0;
      const strujnice = () => {
        const rok = performance.now() + 5;
        for (; i < 820 && performance.now() < rok; i++) {
        const kut = kocka() * Math.PI * 2;
        const uzOs = Math.pow(Math.abs(Math.cos(kut - os)), 2.6);
        const duljina = R * (0.3 + kocka() * 0.8 + uzOs * (1.1 + kocka() * 1.75));
        const r0 = R * (0.98 + kocka() * 0.06);
        const zakret = (kocka() - 0.5) * 0.26;
        const x0 = cx + Math.cos(kut) * r0;
        const y0 = cy + Math.sin(kut) * r0;
        const x1 = cx + Math.cos(kut + zakret) * (r0 + duljina);
        const y1 = cy + Math.sin(kut + zakret) * (r0 + duljina);
        const mx = cx + Math.cos(kut + zakret * 0.25) * (r0 + duljina * 0.5);
        const my = cy + Math.sin(kut + zakret * 0.25) * (r0 + duljina * 0.5);
        const jacina = 0.04 + kocka() * 0.11;
        const boja = ctx.createLinearGradient(x0, y0, x1, y1);
        boja.addColorStop(0, `rgba(255,242,212,${jacina})`);
        boja.addColorStop(0.35, `rgba(255,224,172,${jacina * 0.55})`);
        boja.addColorStop(1, "rgba(255,210,150,0)");
        ctx.strokeStyle = boja;
        ctx.lineWidth = (0.5 + kocka() * 1.6) * dpr;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(mx, my, x1, y1);
        ctx.stroke();
        }
        if (i < 820) posao = requestAnimationFrame(strujnice);
        else zavrsi();
      };

      const zavrsi = () => {
      // unutarnja korona, najsjajnija tik uz rub
      g = ctx.createRadialGradient(cx, cy, R * 0.94, cx, cy, R * 1.6);
      g.addColorStop(0, "rgba(255,248,226,0.85)");
      g.addColorStop(0.3, "rgba(255,232,186,0.32)");
      g.addColorStop(1, "rgba(255,220,160,0)");
      ctx.fillStyle = g;
      krug(R * 1.6);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // kromosfera i prominencije
      ctx.strokeStyle = "rgba(255,150,122,0.6)";
      ctx.lineWidth = R * 0.04;
      krug(R * 1.012);
      ctx.stroke();
      for (let i = 0; i < 5; i++) {
        const kut = kocka() * Math.PI * 2;
        const r = R * (0.05 + kocka() * 0.07);
        ctx.strokeStyle = `rgba(255,128,112,${0.55 + kocka() * 0.3})`;
        ctx.lineWidth = (0.9 + kocka() * 0.8) * dpr;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(kut) * (R * 1.02), cy + Math.sin(kut) * (R * 1.02), r, kut - 1.9, kut + 1.9);
        ctx.stroke();
      }

      // kolut: svijetla sredina, tamniji rub
      g = ctx.createRadialGradient(cx - R * 0.22, cy - R * 0.26, R * 0.08, cx, cy, R);
      g.addColorStop(0, "#fffdf2");
      g.addColorStop(0.45, "#fff0c6");
      g.addColorStop(0.82, "#f6d38c");
      g.addColorStop(1, "#dca54c");
      ctx.fillStyle = g;
      krug(R);
      ctx.fill();

      // zrnatost i pjege
      ctx.save();
      krug(R);
      ctx.clip();
      for (let i = 0; i < 420; i++) {
        const kut = kocka() * Math.PI * 2;
        const r = Math.sqrt(kocka()) * R;
        ctx.fillStyle = `rgba(176,116,40,${0.03 + kocka() * 0.05})`;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(kut) * r, cy + Math.sin(kut) * r, R * (0.012 + kocka() * 0.03), 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < 3; i++) {
        const kut = kocka() * Math.PI * 2;
        const r = R * (0.25 + kocka() * 0.45);
        ctx.fillStyle = "rgba(150,92,30,0.2)";
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(kut) * r, cy + Math.sin(kut) * r, R * 0.07, R * 0.045, kut, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      };

      strujnice();
    };

    // crta se tek kad se približi ekranu, a ne pri učitavanju stranice
    const promjena = new ResizeObserver(() => {
      if (blizu) crtaj();
    });
    promjena.observe(platno);
    const naBlizu = new IntersectionObserver(
      ([unos]) => {
        if (!unos.isIntersecting) return;
        naBlizu.disconnect();
        blizu = true;
        crtaj();
      },
      { rootMargin: "100% 0px" },
    );
    naBlizu.observe(platno);
    return () => {
      cancelAnimationFrame(posao);
      promjena.disconnect();
      naBlizu.disconnect();
    };
  }, [sjeme]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

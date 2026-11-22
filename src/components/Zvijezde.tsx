"use client";

import { useEffect, useRef } from "react";
import { kadGpuSpreman } from "@/lib/gpu";

type Zvijezda = { x: number; y: number; r: number; a: number; s: number; f: number; boja: string; krak: number };
type Repatica = { x: number; y: number; vx: number; vy: number; zivot: number; trajanje: number };

/**
 * Noćno nebo: zvijezde koje tiho trepere i, vrlo rijetko, jedna zvijezda padalica.
 * Crta se samo dok je platno u ekranu. Uz „manje pokreta" nebo je mirno.
 */
/**
 * `bogato` je nebo za hero: više zvijezda, plavičaste uz krem i zlatne,
 * a najsjajnije dobiju križ od zraka svjetla, kao na fotografijama neba.
 */
export default function Zvijezde({ gustoca = 1, padalice = true, bogato = false }: { gustoca?: number; padalice?: boolean; bogato?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const platno = ref.current;
    const ctx = platno?.getContext("2d");
    if (!platno || !ctx) return;

    const mirno = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let sirina = 0;
    let visina = 0;
    let zvijezde: Zvijezda[] = [];
    let repatica: Repatica | null = null;
    let sljedecaRepatica = 5000 + Math.random() * 6000;
    let raf = 0;
    let vidljivo = false;
    let proslo = 0;

    const posij = () => {
      const okvir = platno.getBoundingClientRect();
      sirina = okvir.width;
      visina = okvir.height;
      platno.width = Math.max(1, Math.round(sirina * dpr));
      platno.height = Math.max(1, Math.round(visina * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const broj = Math.min(bogato ? 900 : 420, Math.round(((sirina * visina) / 5600) * gustoca));
      zvijezde = Array.from({ length: broj }, () => {
        const r = Math.pow(Math.random(), bogato ? 3 : 2.4) * (bogato ? 1.9 : 1.25) + 0.3;
        const kocka = Math.random();
        return {
          x: Math.random() * sirina,
          y: Math.random() * visina,
          r,
          a: Math.random() * 0.55 + 0.25,
          s: Math.random() * 0.0014 + 0.0004,
          f: Math.random() * Math.PI * 2,
          boja: kocka < 0.24 ? "226, 196, 135" : bogato && kocka < 0.46 ? "198, 214, 255" : "246, 234, 210",
          krak: bogato && r > 1.62 ? r * (4 + Math.random() * 7) : 0,
        };
      });
    };

    const crtaj = (t: number) => {
      // treperenje je sporo, pa je 30 sličica u sekundi dovoljno: pola posla za isti dojam
      if (proslo && t - proslo < 30) {
        raf = requestAnimationFrame(crtaj);
        return;
      }
      const dt = proslo ? Math.min(64, t - proslo) : 16;
      proslo = t;
      ctx.clearRect(0, 0, sirina, visina);

      for (const z of zvijezde) {
        const treptaj = mirno ? 0.85 : 0.55 + 0.45 * Math.sin(t * z.s + z.f);
        const alfa = z.a * treptaj;
        const boja = z.boja;
        if (z.r > 1.15) {
          ctx.fillStyle = `rgba(${boja}, ${alfa * 0.14})`;
          ctx.beginPath();
          ctx.arc(z.x, z.y, z.r * 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${boja}, ${alfa})`;
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
        ctx.fill();
        if (z.krak) {
          const k = z.krak * (0.7 + 0.3 * treptaj);
          const zraka = ctx.createRadialGradient(z.x, z.y, 0, z.x, z.y, k);
          zraka.addColorStop(0, `rgba(${boja}, ${alfa * 0.9})`);
          zraka.addColorStop(1, `rgba(${boja}, 0)`);
          ctx.strokeStyle = zraka;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(z.x - k, z.y);
          ctx.lineTo(z.x + k, z.y);
          ctx.moveTo(z.x, z.y - k);
          ctx.lineTo(z.x, z.y + k);
          ctx.stroke();
        }
      }

      if (!mirno && padalice) {
        sljedecaRepatica -= dt;
        if (!repatica && sljedecaRepatica <= 0) {
          const kut = Math.PI * (0.16 + Math.random() * 0.12);
          const brzina = 0.42 + Math.random() * 0.2;
          repatica = {
            x: sirina * (0.15 + Math.random() * 0.6),
            y: visina * (0.04 + Math.random() * 0.3),
            vx: Math.cos(kut) * brzina,
            vy: Math.sin(kut) * brzina,
            zivot: 0,
            trajanje: 900 + Math.random() * 500,
          };
          sljedecaRepatica = 9000 + Math.random() * 12000;
        }
        if (repatica) {
          repatica.zivot += dt;
          const p = repatica.zivot / repatica.trajanje;
          if (p >= 1) {
            repatica = null;
          } else {
            const x = repatica.x + repatica.vx * repatica.zivot;
            const y = repatica.y + repatica.vy * repatica.zivot;
            const rep = 90 * Math.sin(Math.PI * p);
            const preliv = ctx.createLinearGradient(x, y, x - repatica.vx * rep * 2, y - repatica.vy * rep * 2);
            preliv.addColorStop(0, `rgba(243, 211, 145, ${0.85 * Math.sin(Math.PI * p)})`);
            preliv.addColorStop(1, "rgba(243, 211, 145, 0)");
            ctx.strokeStyle = preliv;
            ctx.lineWidth = 1.2;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - repatica.vx * rep * 2, y - repatica.vy * rep * 2);
            ctx.stroke();
          }
        }
      }

      if (vidljivo && !mirno) raf = requestAnimationFrame(crtaj);
    };

    const kreni = () => {
      cancelAnimationFrame(raf);
      proslo = 0;
      raf = requestAnimationFrame(crtaj);
    };

    // nebo se sije tek kad se platno približi ekranu: velika platna se ne stvaraju pri učitavanju stranice
    let posijano = false;
    const pripremi = () => {
      if (posijano) return;
      posijano = true;
      posij();
    };
    const promatracVelicine = new ResizeObserver(() => {
      if (!posijano) return;
      const okvir = platno.getBoundingClientRect();
      if (Math.abs(okvir.width - sirina) < 2 && Math.abs(okvir.height - visina) < 80) return;
      posij();
      kreni();
    });
    promatracVelicine.observe(platno);

    // Ubrzano platno traži grafički proces; dok je on zauzet prvim iscrtavanjem stranice, to bi čekanje
    // zaustavilo glavnu nit. Zato promatrači (a s njima sijanje i crtanje) kreću tek kad je spreman.
    let ugaseno = false;
    let promatracEkrana: IntersectionObserver | null = null;
    let promatracBlizine: IntersectionObserver | null = null;
    void kadGpuSpreman().then(() => {
      if (ugaseno) return;
      promatracEkrana = new IntersectionObserver(([unos]) => {
        vidljivo = unos.isIntersecting;
        if (vidljivo) {
          pripremi();
          kreni();
        } else cancelAnimationFrame(raf);
      });
      promatracEkrana.observe(platno);

      // platno se stvara i prvi put crta malo prije ulaska u ekran, da taj posao ne padne usred skrola kroz sekciju
      const blizina = new IntersectionObserver(
        ([unos]) => {
          if (!unos.isIntersecting) return;
          blizina.disconnect();
          if (posijano) return;
          pripremi();
          if (!vidljivo) crtaj(performance.now());
        },
        { rootMargin: "90% 0px" },
      );
      promatracBlizine = blizina;
      blizina.observe(platno);
    });

    return () => {
      ugaseno = true;
      cancelAnimationFrame(raf);
      promatracVelicine.disconnect();
      promatracEkrana?.disconnect();
      promatracBlizine?.disconnect();
    };
  }, [gustoca, padalice, bogato]);

  return <canvas ref={ref} className="zvijezde" aria-hidden="true" />;
}

"use client";

import { useEffect } from "react";

/**
 * Prati pokazivač iznad elementa i upisuje mu CSS varijable --mx i --my (od -1 do 1),
 * s mekim kašnjenjem. Koristi se za blagu dubinu u herou. Samo za miš, ne za dodir.
 */
export default function Pokazivac({ cilj }: { cilj: string }) {
  useEffect(() => {
    const el = document.getElementById(cilj);
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ciljX = 0, ciljY = 0, x = 0, y = 0, raf = 0;

    const korak = () => {
      x += (ciljX - x) * 0.06;
      y += (ciljY - y) * 0.06;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      raf = Math.abs(ciljX - x) + Math.abs(ciljY - y) > 0.002 ? requestAnimationFrame(korak) : 0;
    };
    const naPomak = (e: PointerEvent) => {
      const o = el.getBoundingClientRect();
      ciljX = ((e.clientX - o.left) / o.width) * 2 - 1;
      ciljY = ((e.clientY - o.top) / o.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(korak);
    };
    const naIzlaz = () => {
      ciljX = 0;
      ciljY = 0;
      if (!raf) raf = requestAnimationFrame(korak);
    };

    el.addEventListener("pointermove", naPomak);
    el.addEventListener("pointerleave", naIzlaz);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", naPomak);
      el.removeEventListener("pointerleave", naIzlaz);
    };
  }, [cilj]);

  return null;
}

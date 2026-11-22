"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Omotač koji djeci daje CSS varijable --rx i --ry prema položaju pokazivača.
 * Knjige ih koriste za blagi 3D nagib.
 */
export default function Nagib({ children, className, jacina = 10 }: { children: ReactNode; className?: string; jacina?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cx = 0, cy = 0, x = 0, y = 0, raf = 0;
    const korak = () => {
      x += (cx - x) * 0.09;
      y += (cy - y) * 0.09;
      el.style.setProperty("--ry", `${(x * jacina).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-y * jacina * 0.6).toFixed(2)}deg`);
      raf = Math.abs(cx - x) + Math.abs(cy - y) > 0.003 ? requestAnimationFrame(korak) : 0;
    };
    const pomak = (e: PointerEvent) => {
      const o = el.getBoundingClientRect();
      cx = ((e.clientX - o.left) / o.width) * 2 - 1;
      cy = ((e.clientY - o.top) / o.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(korak);
    };
    const izlaz = () => {
      cx = 0;
      cy = 0;
      if (!raf) raf = requestAnimationFrame(korak);
    };
    el.addEventListener("pointermove", pomak);
    el.addEventListener("pointerleave", izlaz);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", pomak);
      el.removeEventListener("pointerleave", izlaz);
    };
  }, [jacina]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

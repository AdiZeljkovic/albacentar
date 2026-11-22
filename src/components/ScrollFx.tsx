"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Jedan promatrač za cijelu stranicu:
 *  - [data-reveal] dobije data-inview kad uđe u ekran (CSS radi animaciju),
 *  - [data-parallax] dobije CSS varijablu --p (0 → 1) dok prolazi kroz ekran.
 * Tako sekcije ostaju obične serverske komponente, bez JavaScripta po elementu.
 */
export default function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    // rano otkrivanje iz layouta (skripta prije hidracije) ovdje predaje posao
    const rano = (window as unknown as { __ranoOtkrivanje?: IntersectionObserver }).__ranoOtkrivanje;
    if (rano) {
      rano.disconnect();
      delete (window as unknown as { __ranoOtkrivanje?: IntersectionObserver }).__ranoOtkrivanje;
    }

    const videni = new WeakSet<Element>();
    const promatrac = new IntersectionObserver(
      (unosi) => {
        for (const unos of unosi) {
          if (!unos.isIntersecting) continue;
          (unos.target as HTMLElement).dataset.inview = "1";
          promatrac.unobserve(unos.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const pregledaj = (korijen: ParentNode) => {
      korijen.querySelectorAll("[data-reveal]:not([data-inview])").forEach((el) => {
        if (videni.has(el)) return;
        videni.add(el);
        promatrac.observe(el);
      });
    };
    pregledaj(document);

    const promjene = new MutationObserver((zapisi) => {
      for (const zapis of zapisi) {
        zapis.addedNodes.forEach((cvor) => {
          if (cvor.nodeType !== 1) return;
          const el = cvor as Element;
          if (el.matches("[data-reveal]:not([data-inview])") && !videni.has(el)) {
            videni.add(el);
            promatrac.observe(el);
          }
          pregledaj(el);
        });
      }
    });
    promjene.observe(document.body, { childList: true, subtree: true });

    let raf = 0;
    const osvjezi = () => {
      raf = 0;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const okvir = el.getBoundingClientRect();
        if (okvir.bottom < -300 || okvir.top > vh + 300) return;
        const p = (vh - okvir.top) / (vh + okvir.height);
        el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
        // --s: koliko je element već odskrolan preko gornjeg ruba (0 na vrhu, 1 kad sasvim izađe)
        el.style.setProperty("--s", Math.min(1, Math.max(0, -okvir.top / okvir.height)).toFixed(4));
      });
    };
    const zatrazi = () => {
      if (!raf) raf = requestAnimationFrame(osvjezi);
    };
    window.addEventListener("scroll", zatrazi, { passive: true });
    window.addEventListener("resize", zatrazi);
    osvjezi();

    return () => {
      promatrac.disconnect();
      promjene.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", zatrazi);
      window.removeEventListener("resize", zatrazi);
    };
  }, [pathname]);

  return null;
}

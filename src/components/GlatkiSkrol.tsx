"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Glatki skrol (Lenis). Isključen je za posjetitelje koji traže manje pokreta. */
export default function GlatkiSkrol() {
  const pathname = usePathname();
  const prvi = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.115, anchors: { offset: -92 }, autoRaf: true });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Nakon promjene stranice: na vrh ili, ako link ima sidro, do tog mjesta.
  useEffect(() => {
    if (prvi.current) {
      prvi.current = false;
      return;
    }
    const lenis = window.__lenis;
    if (!lenis) return;
    const sidro = window.location.hash;
    if (!sidro) {
      lenis.scrollTo(0, { immediate: true, force: true });
      return;
    }
    const t = window.setTimeout(() => {
      const cilj = document.getElementById(decodeURIComponent(sidro.slice(1)));
      if (cilj) lenis.scrollTo(cilj, { offset: -92, immediate: true, force: true });
    }, 60);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}

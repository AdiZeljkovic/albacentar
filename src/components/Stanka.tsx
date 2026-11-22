"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Zaustavlja animacije u sekcijama koje nisu na ekranu.
 *
 * Svaka sekcija početne ima desetke stalnih animacija (svjetlo koje teče linijama, treperenje,
 * lebdenje). Preglednik ih računa i kad se ne vide, pa je bez ovoga skrol cijele stranice
 * plaćao animacije svih sekcija odjednom. Sekcija izvan ekrana dobije atribut data-van:
 * CSS joj tada pauzira sve animacije, a ovdje se pauziraju i SMIL animacije u njezinim crtežima.
 * Kad se vrati na ekran, sve nastavlja točno gdje je stalo, pa prizori ostaju usklađeni.
 */
export default function Stanka() {
  const pathname = usePathname();

  useEffect(() => {
    const sekcije = document.querySelectorAll<HTMLElement>("main > section, main > div > section, main > .glava, footer.ftr");
    if (!sekcije.length) return;

    const smil = (sekcija: Element, stani: boolean) => {
      sekcija.querySelectorAll("svg").forEach((crtez) => {
        try {
          if (stani) crtez.pauseAnimations();
          else crtez.unpauseAnimations();
        } catch {
          /* preglednik bez SMIL-a */
        }
      });
    };

    const videne = new WeakSet<Element>();
    const promatrac = new IntersectionObserver(
      (unosi) => {
        for (const u of unosi) {
          const van = !u.isIntersecting;
          const prviPut = !videne.has(u.target);
          videne.add(u.target);
          if (van === u.target.hasAttribute("data-van")) {
            // sekcija je s poslužitelja stigla već označena: CSS animacije miruju, ali SMIL treba zaustaviti ovdje
            if (prviPut && van) smil(u.target, true);
            continue;
          }
          u.target.toggleAttribute("data-van", van);
          smil(u.target, van);
        }
      },
      // malo prije nego što sekcija uđe u ekran, da animacije već teku kad se pojavi
      { rootMargin: "320px 0px" },
    );
    sekcije.forEach((s) => promatrac.observe(s));

    return () => {
      promatrac.disconnect();
      sekcije.forEach((s) => {
        if (s.hasAttribute("data-van")) {
          s.removeAttribute("data-van");
          smil(s, false);
        }
      });
    };
  }, [pathname]);

  return null;
}

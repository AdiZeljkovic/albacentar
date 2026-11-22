"use client";

import { useEffect, useState } from "react";

/** Dijeljenje članka i tanka zlatna crta napretka čitanja na vrhu ekrana. */
export default function Dijeli({ naslov, url }: { naslov: string; url: string }) {
  const [kopirano, setKopirano] = useState(false);

  useEffect(() => {
    const crta = document.getElementById("napredak");
    const clanak = document.getElementById("clanak");
    if (!crta || !clanak) return;
    let raf = 0;
    const osvjezi = () => {
      raf = 0;
      const o = clanak.getBoundingClientRect();
      const put = o.height - window.innerHeight * 0.6;
      const p = put > 0 ? Math.min(1, Math.max(0, -o.top / put)) : 0;
      crta.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const zatrazi = () => {
      if (!raf) raf = requestAnimationFrame(osvjezi);
    };
    osvjezi();
    window.addEventListener("scroll", zatrazi, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", zatrazi);
    };
  }, []);

  const kopiraj = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setKopirano(true);
      window.setTimeout(() => setKopirano(false), 2200);
    } catch {
      /* preglednik ne dopušta kopiranje; link je ionako u adresnoj traci */
    }
  };

  const u = encodeURIComponent(url);
  return (
    <div className="dijeli">
      <span>Podijelite:</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer">
        Facebook
      </a>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${naslov} ${url}`)}`} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      <button type="button" onClick={kopiraj} aria-live="polite" data-kopirano={kopirano ? "" : undefined}>
        {kopirano ? "Link je kopiran" : "Kopiraj link"}
      </button>
    </div>
  );
}

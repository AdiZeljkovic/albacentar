"use client";

/** Gumb u podnožju koji vraća na vrh stranice (glatko, osim uz „manje pokreta"). */
export default function NaVrh() {
  const naVrh = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <button type="button" className="ftr-navrh" onClick={naVrh} aria-label="Natrag na vrh stranice">
      <i aria-hidden="true" />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19 L12 5 M6 11 L12 5 L18 11" />
      </svg>
    </button>
  );
}

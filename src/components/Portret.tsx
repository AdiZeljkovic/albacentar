import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Portret u zlatnom luku, kao na naslovnici. S fotografijom (site.owner.photo) luk je okvir slike;
 * dok fotografije nema, u luku je silueta stabla života pred svjetlom zore. Sunce koje izlazi iza
 * luka crta prizor oko njega (omeni/Svitanje.tsx), pa portret radi u oba slučaja.
 */
export default function Portret({ sizes = "(max-width: 900px) 300px, 400px" }: { sizes?: string }) {
  const foto = site.owner.photo;
  return (
    <div className="am-portret" data-reveal>
      <div className="am-prostor">
        {foto ? (
          <Image className="am-foto" src={foto} alt={site.owner.name} fill sizes={sizes} loading="eager" />
        ) : (
          <>
            <i className="am-zora" />
            <svg className="am-prsten" viewBox="0 0 400 400" fill="none" stroke="#7a4a2a" aria-hidden="true">
              <circle cx="200" cy="200" r="168" strokeWidth=".9" opacity=".45" />
              <g className="prsten-vrti" style={{ transformOrigin: "200px 200px" }}>
                <circle cx="200" cy="200" r="150" strokeWidth=".8" opacity=".4" strokeDasharray="2 7" />
                <circle cx="200" cy="50" r="3.5" fill="#7a4a2a" stroke="none" opacity=".7" />
              </g>
            </svg>
            {/* silueta je maska, a ne filter nad slikom */}
            <i className="am-drvo" role="img" aria-label="Drvo života, znak AlBa Centra" />
          </>
        )}
        <i className="am-sjena" />
      </div>
      <svg className="am-luk" viewBox="0 0 300 440" aria-hidden="true">
        <defs>
          <linearGradient id="am-zlato" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6d8" />
            <stop offset=".35" stopColor="#f0d28c" />
            <stop offset="1" stopColor="#a67c32" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#am-zlato)">
          <path d="M22 424 L22 150 A128 128 0 0 1 278 150 L278 424" strokeWidth="1.8" />
          <path d="M13 424 L13 150 A137 137 0 0 1 287 150 L287 424" strokeWidth=".7" opacity=".7" />
          <path d="M30 420 L30 150 A120 120 0 0 1 270 150 L270 420" strokeWidth="1.1" />
          <path d="M17.5 150 A132.5 132.5 0 0 1 282.5 150" pathLength={180} strokeWidth="6" strokeDasharray="0.5 5.5" strokeDashoffset="0.25" opacity=".7" />
          <path d="M6 150 L26 150 M274 150 L294 150" strokeWidth="1.4" />
          <path d="M4 424 L296 424" strokeWidth="1.5" />
          <path d="M0 432 L300 432" strokeWidth=".7" opacity=".6" />
        </g>
        <path d="M150 5 L158 17 L150 29 L142 17Z" fill="#fff3cf" stroke="#f0d28c" strokeWidth=".8" />
      </svg>
    </div>
  );
}

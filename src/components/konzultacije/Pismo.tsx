import Image from "next/image";
import { ISKRA } from "@/lib/zvijezda";

/**
 * Zaglavlje pisma na stranici Kontakt: znak centra, a u kutu marka sa stablom života i poštanski žig.
 * Žig je otisnut „istrošenom" tintom (šum mu nagriza rubove), pa ne izgleda kao vektorski znak.
 * Sve je ukras; čitači ekrana ga preskaču.
 */
const VALOVI = [26, 43, 60, 77, 94].map((y, i) => {
  const pomak = (i % 2) * 5;
  let d = `M${116 + pomak} ${y}`;
  for (let k = 0; k < 6; k++) d += ` q9 ${k % 2 ? 7 : -7} 18 0`;
  return d;
});

/** Zvjezdice na podstavi omotnice: [x, y, polumjer, prozirnost], unutar trokuta preklopa 600 × 150. */
const PODSTAVA: Array<[number, number, number, number]> = [
  [300, 34, 1.5, 0.9], [286, 52, 0.9, 0.6], [320, 56, 1.1, 0.8], [266, 72, 1.3, 0.75], [303, 84, 0.8, 0.5], [340, 86, 1.4, 0.85],
  [236, 98, 1, 0.6], [276, 104, 1.6, 0.9], [318, 110, 0.9, 0.55], [362, 104, 1.1, 0.7], [208, 120, 1.3, 0.8], [246, 128, 0.8, 0.5],
  [296, 132, 1.2, 0.7], [338, 134, 0.9, 0.6], [386, 126, 1.5, 0.85], [176, 136, 0.9, 0.55], [424, 138, 1, 0.6], [134, 144, 1.2, 0.7], [466, 144, 0.8, 0.5],
];

/**
 * Omotnica iza lista: otvoren preklop viri iznad pisma i pokazuje podstavu, komad noćnog neba sa zvijezdama.
 * Stoji iza obrasca i ništa ne prekriva.
 */
export function Omotnica() {
  return (
    <div className="kt-omotnica" aria-hidden="true">
      <svg className="kt-preklop" viewBox="0 0 600 150">
        <defs>
          <linearGradient id="kz-podstava" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b3566" />
            <stop offset="1" stopColor="#131935" />
          </linearGradient>
        </defs>
        <path d="M0 150 L300 0 L600 150Z" fill="#e2cda9" />
        {/* podstava je uža od preklopa, pa sa strana lista ostaje samo papir omotnice */}
        <path d="M56 150 L300 13 L544 150Z" fill="url(#kz-podstava)" />
        <path d="M74 150 L300 23 L526 150" fill="none" stroke="#d9b56f" strokeWidth=".8" opacity=".7" />
        {PODSTAVA.map(([x, y, r, a]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#f3dca6" opacity={a} />
        ))}
        <g transform="translate(300 60) scale(.9)">
          <path d={ISKRA} fill="#fff3d0" />
        </g>
        <g transform="translate(232 122) scale(.6)">
          <path d={ISKRA} fill="#fff3d0" opacity=".8" />
        </g>
        <g transform="translate(372 76) scale(.55)">
          <path d={ISKRA} fill="#fff3d0" opacity=".8" />
        </g>
      </svg>
      <div className="kt-omot" />
    </div>
  );
}

export default function ZaglavljePisma() {
  return (
    <div className="kt-zaglavlje" aria-hidden="true">
      <Image className="kt-znak" src="/img/logo-tamni.png" alt="" width={805} height={372} sizes="150px" />
      <div className="kt-posta">
        <svg className="kt-zig" viewBox="0 0 232 120">
          <defs>
            <filter id="kz-tinta" x="-4%" y="-4%" width="108%" height="108%">
              <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="2" seed="7" result="sum" />
              <feColorMatrix in="sum" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 1.86" result="rupe" />
              <feComposite in="SourceGraphic" in2="rupe" operator="in" />
            </filter>
            <path id="kz-zig-krug" d="M60 60 m-40.5 0 a40.5 40.5 0 1 1 81 0 a40.5 40.5 0 1 1 -81 0" />
          </defs>
          <g filter="url(#kz-tinta)" fill="none" stroke="#5b4332" strokeLinecap="round">
            <circle cx="60" cy="60" r="52" strokeWidth="1.7" />
            <circle cx="60" cy="60" r="48.6" strokeWidth=".6" />
            <circle cx="60" cy="60" r="31" strokeWidth="1" />
            <text fill="#5b4332" stroke="none" fontSize="9.2" letterSpacing="2.3" fontWeight="600">
              <textPath href="#kz-zig-krug" startOffset="1%">
                ALBA CENTAR · KONSTELACIJE · HRVATSKA ·
              </textPath>
            </text>
            <g transform="translate(60 60) scale(1.7)">
              <path d={ISKRA} fill="#5b4332" stroke="none" />
            </g>
            {VALOVI.map((d) => (
              <path key={d} d={d} strokeWidth="1.5" />
            ))}
          </g>
        </svg>
        <div className="kt-marka">
          <div className="kt-marka-slika">
            <Image src="/img/drvo-zlatno.png" alt="" width={520} height={500} sizes="80px" />
          </div>
        </div>
      </div>
    </div>
  );
}

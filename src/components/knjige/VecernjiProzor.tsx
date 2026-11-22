import { greben } from "@/lib/krajolik";
import { vars } from "@/lib/util";
import { ISKRA } from "@/lib/zvijezda";
import { Svijeca } from "./Dijelovi";
import { nasumicno } from "./korijen";

/**
 * Pratnja: jedan tihi prizor. Prozor na luk kroz koji se vidi sumrak nad brdom sa stablom života,
 * a na dasci prozora gori svijeća. Miče se samo plamen i, jedva, prve zvijezde.
 * Crtež je u mjerama 360 × 520; svijeća je u jedinici --u prizora.
 */

const kocka = nasumicno(2903);
/** Prve zvijezde na još svijetlom nebu: samo u gornjem, tamnijem dijelu. */
const ZVIJEZDE = Array.from({ length: 22 }, () => {
  const y = 44 + kocka() * 150;
  return { x: +(44 + kocka() * 272).toFixed(1), y: +y.toFixed(1), r: +(0.4 + kocka() * 0.8).toFixed(2), a: +((1 - (y - 44) / 190) * (0.35 + kocka() * 0.5)).toFixed(2) };
});

const OKNO = "M30 470 L30 180 A150 150 0 0 1 330 180 L330 470Z";
const PRECKE = "M180 32 L180 470 M31 180 L329 180 M31 328 L329 328 M180 180 L75.5 75.5 M180 180 L284.5 75.5";

export default function VecernjiProzor() {
  return (
    <div className="kg-vecer" aria-hidden="true">
      <svg viewBox="0 0 360 520">
        <defs>
          <clipPath id="kg-vp-okno">
            <path d={OKNO} />
          </clipPath>
          <linearGradient id="kg-vp-nebo" gradientUnits="userSpaceOnUse" x1="0" y1="30" x2="0" y2="400">
            <stop offset="0" stopColor="#1b2250" />
            <stop offset=".3" stopColor="#3a3878" />
            <stop offset=".52" stopColor="#6f4a86" />
            <stop offset=".7" stopColor="#c0667c" />
            <stop offset=".84" stopColor="#eea06c" />
            <stop offset=".96" stopColor="#f8d49c" />
          </linearGradient>
          <radialGradient id="kg-vp-zalaz" gradientUnits="userSpaceOnUse" cx="150" cy="392" r="190">
            <stop offset="0" stopColor="#fff6d6" stopOpacity=".95" />
            <stop offset=".16" stopColor="#ffdf9e" stopOpacity=".7" />
            <stop offset=".5" stopColor="#f6a868" stopOpacity=".24" />
            <stop offset="1" stopColor="#f6a868" stopOpacity="0" />
          </radialGradient>
          {/* oblaci od šuma, obasjani odozdo */}
          <filter id="kg-vp-oblak" x="30" y="150" width="300" height="230" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.05" numOctaves={4} seed={21} />
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.74  0 0 0 0 0.56  3.2 0 0 0 -1.74" />
          </filter>
          <filter id="kg-vp-oblak-s" x="30" y="150" width="300" height="230" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.05" numOctaves={4} seed={21} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.26  0 0 0 0 0.48  3.2 0 0 0 -1.74" />
            <feOffset dy="-3" />
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <linearGradient id="kg-vp-pojas" gradientUnits="userSpaceOnUse" x1="0" y1="150" x2="0" y2="380">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".55" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="kg-vp-maska" maskUnits="userSpaceOnUse" x="30" y="150" width="300" height="230">
            <rect x="30" y="150" width="300" height="230" fill="url(#kg-vp-pojas)" />
          </mask>
          {/* stablo kao tamna silueta pred zalaskom */}
          <filter id="kg-vp-sjena" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0.09  0 0 0 0 0.075  0 0 0 0 0.17  0 0 0 1 0" />
          </filter>
          <radialGradient id="kg-vp-zv">
            <stop offset="0" stopColor="#fff3d0" stopOpacity=".7" />
            <stop offset="1" stopColor="#fff3d0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="kg-vp-odraz">
            <stop offset="0" stopColor="#ffd28a" stopOpacity=".5" />
            <stop offset="1" stopColor="#ffb060" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="kg-vp-staklo" x1="0" y1="0" x2="1" y2="1">
            <stop offset=".28" stopColor="#fff" stopOpacity="0" />
            <stop offset=".44" stopColor="#fff" stopOpacity=".1" />
            <stop offset=".54" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="kg-vp-okvir" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff3cf" />
            <stop offset=".4" stopColor="#d9b56f" />
            <stop offset="1" stopColor="#8f6d2f" />
          </linearGradient>
          <linearGradient id="kg-vp-daska" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2a1c18" />
            <stop offset=".66" stopColor="#6a4428" />
            <stop offset=".8" stopColor="#3a2519" />
            <stop offset="1" stopColor="#241815" />
          </linearGradient>
        </defs>

        {/* pogled: sumrak, prve zvijezde, brda i stablo života */}
        <g clipPath="url(#kg-vp-okno)">
          <rect x="30" y="30" width="300" height="440" fill="url(#kg-vp-nebo)" />
          {ZVIJEZDE.map((z, i) => (
            <circle key={i} cx={z.x} cy={z.y} r={z.r} fill="#f4ecff" opacity={z.a} />
          ))}
          {[
            [96, 128, 0.62, 0],
            [262, 86, 0.42, 2.6],
          ].map(([x, y, m, d]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <circle r={m * 16} fill="url(#kg-vp-zv)" />
              <path className="kg-vp-iskra" style={vars({ "--d": `${d}s` })} d={ISKRA} transform={`scale(${m})`} fill="#fff6dc" />
            </g>
          ))}
          <rect x="30" y="200" width="300" height="270" fill="url(#kg-vp-zalaz)" />
          <g mask="url(#kg-vp-maska)">
            <rect x="30" y="150" width="300" height="230" filter="url(#kg-vp-oblak-s)" opacity=".6" />
            <rect x="30" y="150" width="300" height="230" filter="url(#kg-vp-oblak)" opacity=".85" />
          </g>
          {/* grebeni su crtani u širini 1440 i umanjeni, da linija šume ostane sitna */}
          <g transform="translate(0 352) scale(0.25)">
            <path d={greben({ sjeme: 41, y: 60, amp: 40, valova: 1.7, dno: 480 })} fill="#7a5a8c" opacity=".78" />
            <path d={greben({ sjeme: 47, y: 126, amp: 34, valova: 2.3, suma: 13, dno: 480 })} fill="#3a2f5e" />
          </g>
          <path d="M30 446 C80 404 140 396 196 404 C250 412 296 424 330 440 L330 470 L30 470Z" fill="#16132c" />
          <image href="/img/drvo-zlatno.webp" x="92" y="296" width="118" height="113.5" filter="url(#kg-vp-sjena)" />
          {/* odraz plamena u staklu i sjaj stakla */}
          <ellipse cx="258" cy="352" rx="34" ry="50" fill="url(#kg-vp-odraz)" />
          <rect x="30" y="30" width="300" height="440" fill="url(#kg-vp-staklo)" />
        </g>

        {/* prečke i okvir */}
        <path d={PRECKE} fill="none" stroke="#17111a" strokeWidth="5.5" />
        <path d={PRECKE} fill="none" stroke="#d9b56f" strokeWidth=".7" opacity=".7" />
        <g fill="none" stroke="url(#kg-vp-okvir)">
          <path d="M30 470 L30 180 A150 150 0 0 1 330 180 L330 470" strokeWidth="3.2" />
          <path d="M19 470 L19 180 A161 161 0 0 1 341 180 L341 470" strokeWidth=".8" opacity=".7" />
          <path d="M24.5 180 A155.5 155.5 0 0 1 335.5 180" pathLength={200} strokeWidth="5" strokeDasharray="0.5 5.5" strokeDashoffset="0.25" opacity=".5" />
        </g>
        {/* daska prozora, obasjana svijećom */}
        <path d="M6 470 L354 470 L346 492 L14 492Z" fill="url(#kg-vp-daska)" stroke="url(#kg-vp-okvir)" strokeWidth=".9" />
        <path d="M14 492 L346 492 L342 500 L18 500Z" fill="#150f10" />
      </svg>
      <Svijeca />
    </div>
  );
}

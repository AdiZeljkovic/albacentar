import { ISKRA } from "@/lib/zvijezda";
import Image from "next/image";
import Link from "next/link";
import NaVrh from "./NaVrh";
import Zvijezde from "./Zvijezde";
import { greben } from "@/lib/krajolik";
import { footerNav, site } from "@/lib/site";
import { vars } from "@/lib/util";

/**
 * Podnožje: noć u koju se dan vraća. Gore je znak centra u zlatnom astrolabu (odjek heroja),
 * stupci s poveznicama čitaju se kao mala zviježđa, a na dnu je brdo pod mjesecom s krijesnicama.
 * Dijele ga sve stranice, pa je bez teških efekata: zvijezde na platnu, ostalo je SVG i CSS.
 */

/** Stalni „slučajni" brojevi, isti na poslužitelju i u pregledniku. */
function nasumicno(sjeme: number) {
  let s = sjeme;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const kocka = nasumicno(31337);
const izmedju = (a: number, b: number) => +(a + (b - a) * kocka()).toFixed(1);

const KRIJESNICE = Array.from({ length: 14 }, () => ({
  "--x": `${izmedju(4, 96)}%`,
  "--y": `${izmedju(22, 78)}%`,
  "--ax": `${izmedju(-40, 40)}px`,
  "--ay": `${izmedju(-34, 12)}px`,
  "--bx": `${izmedju(-54, 54)}px`,
  "--by": `${izmedju(-50, 10)}px`,
  "--cx": `${izmedju(-30, 30)}px`,
  "--cy": `${izmedju(-26, 20)}px`,
  "--t": `${izmedju(9, 17)}s`,
  "--s": `${izmedju(2.6, 5.4)}s`,
  "--d": `${izmedju(-12, 0)}s`,
  "--v": `${izmedju(3, 5)}px`,
}));

/** Putanja po kojoj svjetlo kruži oko znaka. */
const KRUG = "M160 30 A130 130 0 1 1 159.9 30";

export default function Podnozje() {
  return (
    <footer className="ftr">
      <div className="ftr-nebo" aria-hidden="true">
        <Zvijezde gustoca={0.9} bogato />
      </div>

      <div className="ftr-vrh">
        {/* znak centra u astrolabu */}
        <div className="ftr-znak" data-reveal>
          <svg viewBox="0 0 320 320" fill="none" aria-hidden="true">
            <defs>
              <radialGradient id="ft-sjaj">
                <stop offset="0" stopColor="#f0d79f" stopOpacity=".3" />
                <stop offset=".5" stopColor="#8f9be0" stopOpacity=".1" />
                <stop offset="1" stopColor="#8f9be0" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ft-metal" x1=".1" y1="0" x2=".9" y2="1">
                <stop offset="0" stopColor="#fff3cf" />
                <stop offset=".3" stopColor="#dcb970" />
                <stop offset=".62" stopColor="#8f6d2f" />
                <stop offset="1" stopColor="#d9b56f" />
              </linearGradient>
            </defs>
            <circle className="ftr-dise" cx="160" cy="160" r="158" fill="url(#ft-sjaj)" />
            <g stroke="#d9b56f">
              <circle cx="160" cy="160" r="152" stroke="url(#ft-metal)" strokeWidth="1.3" />
              <circle cx="160" cy="160" r="145" strokeWidth=".5" opacity=".45" />
              <g className="ftr-vrti">
                <circle cx="160" cy="160" r="138" pathLength={360} strokeWidth="7" strokeDasharray="0.3 2.7" opacity=".4" />
                <circle cx="160" cy="160" r="136" pathLength={360} strokeWidth="12" strokeDasharray="0.5 29.5" opacity=".8" />
              </g>
              <circle cx="160" cy="160" r="130" strokeWidth=".6" strokeDasharray="0.6 5" strokeLinecap="round" opacity=".4" />
              <g className="ftr-vrti nazad">
                <circle cx="160" cy="160" r="112" strokeWidth=".6" strokeDasharray="2 7" opacity=".4" />
                {[20, 150, 265].map((kut, i) => {
                  const r = (kut * Math.PI) / 180;
                  return (
                    <g key={kut} transform={`translate(${(160 + 112 * Math.cos(r)).toFixed(1)} ${(160 + 112 * Math.sin(r)).toFixed(1)}) scale(${[0.5, 0.36, 0.42][i]})`} stroke="none">
                      <path className="polje-iskra" style={vars({ "--d": `${i * 1.4}s` })} d={ISKRA} fill="#fff3d0" />
                    </g>
                  );
                })}
              </g>
            </g>
            <g fill="#f0d79f">
              {[0, 90, 180, 270].map((kut) => (
                <path key={kut} d="M160 2 L164 8 L160 14 L156 8Z" transform={`rotate(${kut} 160 160)`} />
              ))}
            </g>
            <g className="polje-komete" fill="none" strokeLinecap="round">
              <g opacity=".3">
                <path className="polje-kometa sjaj" pathLength={1} d={KRUG} style={{ animationDuration: "9s" }} />
              </g>
              <path className="polje-kometa rep" pathLength={1} d={KRUG} style={{ animationDuration: "9s" }} />
              <path className="polje-kometa glava" pathLength={1} d={KRUG} style={{ animationDuration: "9s" }} />
            </g>
          </svg>
          <Image src="/img/drvo-svijetlo.png" alt="" width={520} height={500} sizes="170px" />
        </div>
        <p className="ftr-moto" data-reveal>
          <span>Vratiti svakome njegovo mjesto.</span>
        </p>
      </div>

      <div className="w">
        <div className="ftr-crta" aria-hidden="true">
          <i />
        </div>
        <div className="ftr-stupci">
          <div className="ftr-o">
            <p className="ftr-ime">{site.name}</p>
            <p>
              {site.tagline}. Obiteljske i sistemske konstelacije prema pristupu Berta Hellingera, edukacije, individualne
              konzultacije i knjige o obiteljskom nasljeđu.
            </p>
          </div>
          <nav aria-label="Rad">
            <h2>Rad</h2>
            <ul>
              {footerNav.rad.map((s) => (
                <li key={s.href}>
                  <Link href={s.href}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Centar">
            <h2>Centar</h2>
            <ul>
              {footerNav.centar.map((s) => (
                <li key={s.href}>
                  <Link href={s.href}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2>Kontakt</h2>
            <ul>
              {site.company && <li>{site.company}</li>}
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              {site.phone && (
                <li>
                  <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>
                </li>
              )}
              {site.location && <li>{site.location}</li>}
              <li>
                <Link href="/kontakt">Pošaljite poruku</Link>
              </li>
              <li>
                <a href={site.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* brdo pod mjesecom: kraj dana i povratak na vrh */}
      <div className="ftr-kraj">
        <svg className="ftr-mjesec" viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <radialGradient id="ft-mjesec" cx=".3" cy=".3" r=".9">
              <stop offset="0" stopColor="#fffdf3" />
              <stop offset=".5" stopColor="#f6e7c0" />
              <stop offset="1" stopColor="#d9bd84" />
            </radialGradient>
            <radialGradient id="ft-mjesec-sjaj">
              <stop offset="0" stopColor="#f6e7c0" stopOpacity=".4" />
              <stop offset=".34" stopColor="#c9c4e6" stopOpacity=".13" />
              <stop offset="1" stopColor="#8f9be0" stopOpacity="0" />
            </radialGradient>
            <mask id="ft-srp">
              <rect x="-40" y="-40" width="280" height="280" fill="#000" />
              <circle cx="100" cy="100" r="46" fill="#fff" />
              <circle cx="82" cy="88" r="40" fill="#000" />
            </mask>
          </defs>
          <circle className="ftr-dise" cx="100" cy="100" r="100" fill="url(#ft-mjesec-sjaj)" style={{ transformOrigin: "100px 100px" }} />
          <circle cx="100" cy="100" r="46" fill="#aab4e8" opacity=".1" />
          <circle cx="100" cy="100" r="46" fill="url(#ft-mjesec)" mask="url(#ft-srp)" />
        </svg>
        <svg className="ftr-brda" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ft-brdo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0a0e20" />
              <stop offset="1" stopColor="#05070f" />
            </linearGradient>
            <linearGradient id="ft-rub" x1="0" y1="0" x2="1" y2="0">
              <stop offset=".3" stopColor="#c6cfff" stopOpacity="0" />
              <stop offset=".7" stopColor="#c6cfff" stopOpacity=".55" />
              <stop offset="1" stopColor="#c6cfff" stopOpacity=".1" />
            </linearGradient>
          </defs>
          <path d={greben({ sjeme: 81, y: 70, amp: 28, valova: 2.3 })} fill="#1b2350" opacity=".7" />
          <path d={greben({ sjeme: 87, y: 96, amp: 22, valova: 3.3, suma: 8 })} fill="#131a3c" />
          <path d="M0 132 C240 70 520 30 720 30 C930 30 1200 74 1440 122 L1440 220 L0 220Z" fill="url(#ft-brdo)" />
          <path d="M0 132 C240 70 520 30 720 30 C930 30 1200 74 1440 122" fill="none" stroke="url(#ft-rub)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="ftr-krijesnice" aria-hidden="true">
          {KRIJESNICE.map((stil, i) => (
            <i key={i} style={vars(stil)} />
          ))}
        </div>
        <NaVrh />
        <div className="w">
          <p className="ftr-dno">
            <span>
              <span>© {new Date().getFullYear()}. {site.name}. Sva prava pridržana. Dijeljenje uz navođenje izvora.</span>
            </span>
            <span>
              <Link href="/privatnost">Zaštita privatnosti</Link>
              <a href="https://luminor.solutions" target="_blank" rel="noopener noreferrer">
                Izrada: Luminor Solutions
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

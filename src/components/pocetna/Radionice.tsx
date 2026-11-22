import { ISKRA } from "@/lib/zvijezda";
import Link from "next/link";
import Naslov from "@/components/Naslov";
import { opisDatuma, type Termin } from "@/content/rad";
import { kas, vars } from "@/lib/util";
import { lice, mijena, nazivMijene, obasjanost } from "@/lib/mjesec";

/**
 * Radionice: opet pod noćnim nebom, u koje su iz čitaonice odletjele ptice. Nebo je kalendar:
 * svaka radionica je Mjesec u mijeni u kojoj će stvarno biti toga dana, a oko njega je krug
 * zvijezda, po jedna za svako mjesto s vlastitom temom. Upaljene su zauzete, prazne čekaju.
 * Između radionica teče staza s mijenama za dane između.
 */

const podne = (iso: string) => {
  const [g, m, d] = iso.split("-").map(Number);
  return Date.UTC(g, m - 1, d, 12);
};

const KRATERI: Array<[number, number, number]> = [
  [140, 138, 10],
  [181, 150, 14],
  [150, 186, 8],
  [192, 188, 6],
  [126, 170, 5],
  [172, 118, 7],
  [205, 166, 4],
];

/** Mjesec u zadanoj mijeni i krug mjesta oko njega. */
function Mjesec({ id, m, mjesta, zauzeto }: { id: string; m: number; mjesta: number; zauzeto: number }) {
  const R = 68;
  const d = lice(m, 160, 160, R);
  const k = obasjanost(m);
  return (
    <svg className="mj-slika" viewBox="0 0 320 320" aria-hidden="true">
      <defs>
        <clipPath id={`mj-lice-${id}`}>
          <path d={d} />
        </clipPath>
      </defs>
      <circle className="mj-sjaj" cx="160" cy="160" r="158" fill="url(#mj-sjaj)" style={{ opacity: +(0.3 + 0.7 * k).toFixed(2) }} />
      <g fill="none" stroke="#d9b56f">
        <g className="mj-vrti">
          <circle cx="160" cy="160" r="150" pathLength={360} strokeWidth="5" strokeDasharray="0.3 5.7" opacity=".34" />
          <circle cx="160" cy="160" r="148" pathLength={360} strokeWidth="9" strokeDasharray="0.4 44.6" opacity=".6" />
        </g>
        <circle cx="160" cy="160" r="124" strokeWidth=".7" strokeDasharray="0.6 6" strokeLinecap="round" opacity=".4" />
        <circle cx="160" cy="160" r={R + 12} strokeWidth=".5" opacity=".22" />
      </g>

      <circle cx="160" cy="160" r={R} fill="url(#mj-tama)" />
      <circle cx="160" cy="160" r={R} fill="none" stroke="#e9dcc4" strokeWidth=".6" opacity=".34" />
      <path className="mj-lice" d={d} fill="url(#mj-lice)" />
      <g clipPath={`url(#mj-lice-${id})`} fill="#a98b52" opacity=".3">
        {KRATERI.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>

      {/* krug mjesta: upaljena zvijezda je zauzeto mjesto, prazan krug mjesto koje čeka */}
      {Array.from({ length: mjesta }, (_, i) => {
        const kut = ((-90 + (360 / mjesta) * i) * Math.PI) / 180;
        const x = +(160 + 124 * Math.cos(kut)).toFixed(1);
        const y = +(160 + 124 * Math.sin(kut)).toFixed(1);
        return (
          <g key={i} className="mj-mjesto" transform={`translate(${x} ${y})`} style={vars({ "--i": i })}>
            {i < zauzeto ? (
              <>
                <circle r="20" fill="url(#mj-zvijezda)" />
                <g className="polje-treptaj" style={vars({ "--t": `${(i * 0.83) % 5}s` })}>
                  <path d={ISKRA} fill="#fff3d0" transform="scale(1.25)" />
                </g>
                <circle r="2.6" fill="#fff" />
              </>
            ) : (
              <>
                <circle r="13" fill="#1a2248" opacity=".5" />
                <circle className="zvj-puls" r="9" style={{ animationDelay: `${i * 0.3}s` }} />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Mali Mjesec na stazi između radionica. */
function MaliMjesec({ m, i }: { m: number; i: number }) {
  return (
    <svg className="mj-mali" viewBox="0 0 24 24" style={vars({ "--i": i })}>
      <circle cx="12" cy="12" r="9" fill="#1c2550" />
      <path d={lice(m, 12, 12, 9)} fill="#f3e3ba" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="#e9dcc4" strokeWidth=".5" opacity=".4" />
    </svg>
  );
}

function Ptica({ stil }: { stil: Record<string, string | number> }) {
  return (
    <svg className="mj-ptica" viewBox="-13 -9 26 18" style={vars(stil)}>
      <g className="knj-krila" fill="none" stroke="#fff1c8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 1 Q-5 -7 -12 -3" />
        <path d="M0 1 Q5 -7 12 -3" />
      </g>
    </svg>
  );
}

const IZMEDJU = 3;

type Props = {
  termini: Termin[];
  primjer: boolean;
  oznaka?: string;
  naslov?: string;
  uvod?: string;
  /** Poveznica na sve termine; na samoj stranici Radionice nema smisla. */
  sveTermine?: boolean;
};

export default function Radionice({ termini, primjer, oznaka = "Radionice i edukacije", naslov = "Sljedeće *radionice*", uvod, sveTermine = true }: Props) {
  const n = termini.length;
  const faze = termini.map((t) => mijena(podne(t.datum)));
  const danas = mijena(Date.now());

  return (
    <div className="w mj-in">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <radialGradient id="mj-sjaj">
            <stop offset="0" stopColor="#f6e7c0" stopOpacity=".5" />
            <stop offset=".42" stopColor="#b9bdf0" stopOpacity=".16" />
            <stop offset="1" stopColor="#8f9be0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mj-tama" cx=".35" cy=".3" r=".9">
            <stop offset="0" stopColor="#27315f" />
            <stop offset=".6" stopColor="#151c3c" />
            <stop offset="1" stopColor="#0c1128" />
          </radialGradient>
          <radialGradient id="mj-lice" cx=".36" cy=".3" r=".95">
            <stop offset="0" stopColor="#fffdf3" />
            <stop offset=".5" stopColor="#f6e7c0" />
            <stop offset="1" stopColor="#d2b67c" />
          </radialGradient>
          <radialGradient id="mj-zvijezda">
            <stop offset="0" stopColor="#fff6dc" stopOpacity=".85" />
            <stop offset=".3" stopColor="#f3d391" stopOpacity=".34" />
            <stop offset="1" stopColor="#e2c487" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* ptice iz čitaonice lete nebom */}
      <div className="mj-ptice" aria-hidden="true">
        <Ptica stil={{ "--y": "8%", "--t": "46s", "--d": "-6s", "--v": 1 }} />
        <Ptica stil={{ "--y": "14%", "--t": "58s", "--d": "-31s", "--v": 0.7 }} />
        <Ptica stil={{ "--y": "4%", "--t": "52s", "--d": "-19s", "--v": 0.8 }} />
      </div>

      <header className="mj-glava sredina">
        <p className="oz" data-reveal>
          {oznaka} {primjer && <span className="primjer">primjer termina</span>}
        </p>
        <Naslov>{naslov}</Naslov>
        {uvod && (
          <p className="mj-uvod" data-reveal>
            {uvod}
          </p>
        )}
      </header>

      {n === 0 ? (
        <div className="mj-prazno" data-reveal>
          <Mjesec id="danas" m={danas} mjesta={8} zauzeto={0} />
          <p>
            Novi termini objavljuju se prema organizaciji susreta. Javite se i obavijestit ćemo vas čim sljedeća radionica
            bude otvorena za prijave.
          </p>
          <Link className="btn btn-zlato" href="/radionice#prijava">
            Javite mi za sljedeći termin
          </Link>
        </div>
      ) : (
        <>
          <div className="mj-staza" style={vars({ "--n": n })}>
            {/* mijene za dane između radionica */}
            {termini.slice(0, -1).map((t, g) => {
              const od = podne(t.datum);
              const doo = podne(termini[g + 1].datum);
              return (
                <div className="mj-medju" key={t.id} style={vars({ "--g": g })} aria-hidden="true">
                  {Array.from({ length: IZMEDJU }, (_, k) => (
                    <MaliMjesec key={k} m={mijena(od + ((doo - od) * (k + 1)) / (IZMEDJU + 1))} i={g * IZMEDJU + k} />
                  ))}
                </div>
              );
            })}

            {termini.map((t, i) => {
              const d = opisDatuma(t.datum);
              const slobodno = t.mjesta - t.zauzeto;
              return (
                <article className="mj-termin" key={t.id} data-reveal style={kas(0.1 + i * 0.16)}>
                  <Mjesec id={String(i)} m={faze[i]} mjesta={t.mjesta} zauzeto={t.zauzeto} />
                  <p className="mj-mijena">
                    <span className="sr">Mjesec toga dana: </span>
                    {nazivMijene(faze[i])}
                  </p>
                  <p className="mj-kad">
                    <b>{d.dan}.</b>
                    <span>
                      {d.mjesec} · {d.danUTjednu}
                      <br />
                      {t.nacin}
                    </span>
                  </p>
                  <h3>{t.naslov}</h3>
                  <p className="mj-opis">{t.opis}</p>
                  <p className="mj-nap">
                    <i aria-hidden="true" />
                    {t.napomena}
                    <span className="sr">
                      {" "}
                      ({slobodno} od {t.mjesta} mjesta slobodno)
                    </span>
                  </p>
                  <Link className={i === 0 ? "btn btn-zlato" : "btn btn-svijetlo"} href={`/radionice?termin=${t.id}#prijava`}>
                    Prijavi se
                  </Link>
                </article>
              );
            })}
          </div>

          <p className="mj-legenda" data-reveal>
            Mjesec je prikazan u mijeni u kojoj će biti na dan radionice. Zvijezde u krugu su mjesta s vlastitom temom:
            upaljene su zauzete, prazne još čekaju.
          </p>
        </>
      )}

      {sveTermine && (
        <p className="red mj-sve" data-reveal>
          <Link className="link" href="/radionice">
            Svi termini i teme{" "}
            <span className="str" aria-hidden="true">
              →
            </span>
          </Link>
        </p>
      )}
    </div>
  );
}

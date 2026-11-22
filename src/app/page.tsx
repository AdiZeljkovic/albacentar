import Image from "next/image";
import Link from "next/link";
import Naslov from "@/components/Naslov";
import Ornament from "@/components/Ornament";
import Zvijezde from "@/components/Zvijezde";
import Citaonica from "@/components/pocetna/Citaonica";
import Dan from "@/components/pocetna/Dan";
import Hero from "@/components/pocetna/Hero";
import MisaoDana from "@/components/pocetna/MisaoDana";
import Jutro from "@/components/pocetna/Jutro";
import Lampioni from "@/components/pocetna/Lampioni";
import Magla from "@/components/pocetna/Magla";
import Nacela from "@/components/pocetna/Nacela";
import NaciniRada from "@/components/pocetna/NaciniRada";
import Noc from "@/components/pocetna/Noc";
import Odaja from "@/components/pocetna/Odaja";
import Para from "@/components/pocetna/Para";
import Podrucja from "@/components/pocetna/Podrucja";
import Pomrcina from "@/components/pocetna/Pomrcina";
import Radionice from "@/components/pocetna/Radionice";
import Sumrak from "@/components/pocetna/Sumrak";
import Vedro from "@/components/pocetna/Vedro";
import Zalaz from "@/components/pocetna/Zalaz";
import Zora from "@/components/pocetna/Zora";
import { filozofija } from "@/content/konstelacije";
import { misaoDana, misli } from "@/content/misli";
import { nadolazeciTermini, terminiSuPrimjer } from "@/content/rad";
import { sviClanci } from "@/lib/blog";
import { greben } from "@/lib/krajolik";
import { kas, vars } from "@/lib/util";

// Misao dana i popis nadolazećih termina osvježavaju se svakih sat vremena.
export const revalidate = 3600;

const Str = () => (
  <span className="str" aria-hidden="true">
    →
  </span>
);

export default function Pocetna() {
  const misao = misaoDana();
  const termini = nadolazeciTermini().slice(0, 3);
  const [glavni, ...ostali] = sviClanci();

  return (
    <>
      <Hero />

      {/* ---------- misao dana: svitanje. Sunce izlazi iza stabla života dok se skrola ---------- */}
      <section data-van="" className="zora" id="misao" data-parallax aria-label="Misao dana">
        <Zora sekcija="misao" obzor="zora-obzor" />
        <div className="zora-zvijezde" aria-hidden="true">
          <Zvijezde gustoca={1.2} bogato padalice={false} />
        </div>
        <div className="w zora-in">
          <MisaoDana misli={misli} danasnja={misao.indeks} dan={misao.dan} mjesec={misao.mjesec} mjesecBroj={misao.mjesecBroj} godina={misao.godina} />
        </div>
        <div className="zora-scena" aria-hidden="true">
          {/* daleki grebeni u jutarnjoj izmaglici: dalji je svjetliji, bliži ima liniju šume */}
          <svg className="zora-brda zora-daleka" viewBox="0 0 1440 220" preserveAspectRatio="none">
            <path d={greben({ sjeme: 3, y: 88, amp: 30, valova: 2.4 })} fill="#6a3f5c" opacity=".46" />
            <path d={greben({ sjeme: 8, y: 112, amp: 24, valova: 3.4, suma: 9 })} fill="#241a3a" opacity=".9" />
          </svg>
          <Image className="zora-drvo" src="/img/drvo-zlatno.png" alt="" width={520} height={500} sizes="(max-width: 900px) 60vw, 400px" />
          <svg className="zora-brda" viewBox="0 0 1440 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="zora-brdo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#150f26" />
                <stop offset="1" stopColor="#0c0a18" />
              </linearGradient>
              <linearGradient id="zora-rub" x1="0" y1="0" x2="1" y2="0">
                <stop offset=".26" stopColor="#ffd9a0" stopOpacity="0" />
                <stop offset=".5" stopColor="#ffe2b0" />
                <stop offset=".74" stopColor="#ffd9a0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 132 C240 70 520 30 720 30 C930 30 1200 74 1440 122 L1440 220 L0 220Z" fill="url(#zora-brdo)" />
            <path className="zora-rub" d="M0 132 C240 70 520 30 720 30 C930 30 1200 74 1440 122" fill="none" stroke="url(#zora-rub)" strokeWidth="1.8" />
          </svg>
          <span className="zora-obzor" id="zora-obzor" />
        </div>
        {/* jutarnja magla: pramenovi se u dolini zgušnjavaju dok ne postanu svjetlo dana u sekciji ispod */}
        <svg className="zora-para" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="zp-sumaglica" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="250">
              <stop offset="0" stopColor="#9a7488" stopOpacity="0" />
              <stop offset=".6" stopColor="#b79a9c" stopOpacity=".62" />
              <stop offset="1" stopColor="#dccbb8" stopOpacity=".92" />
            </linearGradient>
          </defs>
          <rect y="200" width="1440" height="200" fill="#0c0a18" />
          {/* sumaglica pod pramenovima: kroz rupe u magli ne gleda crna zemlja nego dolina u izmaglici */}
          <rect width="1440" height="400" fill="url(#zp-sumaglica)" />
          <Para
            id="zp"
            boja={[0.945, 0.894, 0.82]}
            visina={400}
            slojevi={[
              { frek: "0.003 0.016", sjeme: 4, od: 0, do: 190, jacina: 1.7, boja: [1, 0.84, 0.68] },
              { frek: "0.0045 0.02", sjeme: 11, od: 60, do: 260, jacina: 2 },
              { frek: "0.008 0.03", sjeme: 23, od: 150, do: 320, jacina: 2.4 },
            ]}
            puno={[236, 372]}
          />
        </svg>
      </section>
      {/* ---------- o AlBa Centru: stranica zvjezdanog atlasa ---------- */}
      <section data-van="" className="sek atlas zrno" id="centar">
        <Dan />
        <div className="w">
          <div className="atlas-glava sredina">
            <p className="oz" data-reveal>
              O AlBa Centru
            </p>
            <Naslov>{"Prostor za razumijevanje,\npovezivanje i *osobni razvoj.*"}</Naslov>
            <p className="atlas-uvod-veliko" data-reveal style={kas(0.3)}>
              AlBa Centar nastao je iz interesa za čovjeka, njegove odnose, životne priče i obiteljske korijene.
            </p>
            <p className="mut atlas-uvod-tekst" data-reveal style={kas(0.38)}>
              U središtu našeg rada nalazi se uvjerenje da čovjeka ne možemo u potpunosti promatrati odvojeno od odnosa i
              okolnosti u kojima je odrastao i živio. To ne znači da je svaka teškoća naslijeđena. Znači da vrijedi
              istražiti širu sliku.
            </p>
            <p className="atlas-uvod-veza" data-reveal style={kas(0.44)}>
              <Link className="link" href="/o-meni">
                Tko stoji iza AlBa Centra <Str />
              </Link>
            </p>
          </div>
        </div>

        {/* bez data-reveal: prozirnost nad cijelim 3D prizorom tjera karticu da ga crta kao jednu veliku plohu, što je pri prvom dolasku trzalo */}
        <Podrucja />

      </section>

      {/* ---------- naša filozofija: sumrak i četiri pomrčine ---------- */}
      <section data-van="" className="sumrak noc" id="filozofija" aria-label="Naša filozofija">
        <Sumrak />
        <div className="sumrak-zvijezde" aria-hidden="true">
          <Zvijezde gustoca={1.1} bogato />
        </div>
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <radialGradient id="pom-korona">
              <stop offset="0" stopColor="#fbe6b4" stopOpacity=".95" />
              <stop offset=".4" stopColor="#e9b866" stopOpacity=".42" />
              <stop offset=".72" stopColor="#d98a5a" stopOpacity=".12" />
              <stop offset="1" stopColor="#d98a5a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pom-sunce" cx=".38" cy=".32" r=".78">
              <stop offset="0" stopColor="#fffdf2" />
              <stop offset=".42" stopColor="#f6dfa8" />
              <stop offset=".88" stopColor="#d2a85a" />
              <stop offset="1" stopColor="#b08a40" />
            </radialGradient>
            <linearGradient id="pom-rub" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffe9b8" />
              <stop offset=".34" stopColor="#e2c487" stopOpacity=".5" />
              <stop offset=".6" stopColor="#e2c487" stopOpacity="0" />
            </linearGradient>
            <clipPath id="pom-krug">
              <circle cx="104" cy="104" r="46" />
            </clipPath>
            <filter id="pom-mek" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <radialGradient id="pom-mjesec" cx=".3" cy=".28" r=".9">
              <stop offset="0" stopColor="#2c3766" />
              <stop offset=".55" stopColor="#151c38" />
              <stop offset="1" stopColor="#0a0e20" />
            </radialGradient>
          </defs>
        </svg>

        <div className="w">
          <div className="fil-glava sredina">
            <p className="oz" data-reveal>
              Naša filozofija
            </p>
            <Naslov as="p" className="fil-uvod">
              {"Razumijevanje vlastitih korijena može pomoći čovjeku da jasnije vidi *gdje se nalazi danas.*"}
            </Naslov>
          </div>

          <div className="pomrcine">
            {filozofija.map((f, i) => {
              const [prvi, drugi] = f.split(" ne znači ");
              return (
                <div key={f} data-reveal style={kas(i * 0.16)}>
                  <article className="pomrcina" style={vars({ "--k": `${0.5 + i * 0.28}s` })}>
                    <div className="pom-znak" aria-hidden="true">
                      <Pomrcina sjeme={i + 1} />
                      <svg className="pom-nebo" viewBox="0 0 240 240">
                        <path className="pom-put" d="M150 110 Q178 118 180 152" fill="none" stroke="#e2c487" strokeWidth=".9" strokeDasharray="2 5" strokeLinecap="round" />
                        <g className="pom-mjesec">
                          <circle cx="104" cy="104" r="46" fill="url(#pom-mjesec)" />
                          {/* mora: tamnije mrlje na Mjesečevu licu */}
                          <g clipPath="url(#pom-krug)" fill="#070a18" filter="url(#pom-mek)">
                            <ellipse cx="88" cy="94" rx="15" ry="11" opacity=".55" />
                            <ellipse cx="120" cy="112" rx="13" ry="9" opacity=".5" />
                            <ellipse cx="100" cy="128" rx="10" ry="6" opacity=".45" />
                            <circle cx="124" cy="86" r="6" opacity=".4" />
                          </g>
                          {/* rub koji hvata svjetlo sunca */}
                          <circle cx="104" cy="104" r="46" fill="none" stroke="url(#pom-rub)" strokeWidth="1.5" />
                        </g>
                      </svg>
                    </div>
                    <p className="pom-a">{prvi}</p>
                    <p className="pom-ne">
                      <i />
                      ne znači
                      <i />
                    </p>
                    <p className="pom-b">{drugi}</p>
                  </article>
                </div>
              );
            })}
          </div>

          <div className="fil-kraj" data-reveal>
            <Ornament />
            <p>
              Ne tražimo krivca za ono što se dogodilo. Ne određujemo kako bi netko trebao živjeti. Naš cilj nije vratiti
              čovjeka u prošlost, nego mu pomoći da jasnije sagleda sadašnjost i svjesnije oblikuje budućnost.
            </p>
          </div>
        </div>
      </section>
      {/* ---------- tri načela: noć nad krajolikom, tri zviježđa i stablo života ---------- */}
      <section data-van="" className="nocni noc" id="nacela" aria-label="Tri temeljna načela Hellingerova pristupa">
        <Noc />
        <div className="nac-zvijezde" aria-hidden="true">
          <Zvijezde gustoca={1.3} bogato />
        </div>
        <Nacela />
      </section>

      {/* ---------- načini rada: podnožje brda, korijenje vodi do četvorih vrata svjetla ---------- */}
      <section data-van="" className="dveri-sek noc" id="nacini-rada">
        <Magla pojas="dveri" />
        <NaciniRada />
      </section>

      {/* ---------- knjige: čitaonica iza vrata, uz svijeću; kroz prozor se vidi brdo sa stablom ---------- */}
      <section data-van="" className="citaonica-sek noc" id="knjige">
        <Odaja svijeca="knj-plamen" prozor="knj-prozor" />
        <Citaonica />
      </section>

      {/* ---------- radionice: noćno nebo kao kalendar, svaka radionica je Mjesec u svojoj mijeni ---------- */}
      <section data-van="" className="mjesecina noc" id="radionice">
        <div className="mj-zvijezde" aria-hidden="true">
          <Zvijezde gustoca={1.2} bogato />
        </div>
        <Radionice termini={termini} primjer={terminiSuPrimjer} />
      </section>

      {/* ---------- blog: plavi sat pred zoru, tekstovi su lampioni koji se dižu iz polja ---------- */}
      {glavni && (
        <section data-van="" className="lampioni noc" id="blog">
          <div className="lp-zvijezde" aria-hidden="true">
            <Zvijezde gustoca={0.8} bogato padalice={false} />
          </div>
          <Lampioni glavni={glavni} ostali={ostali.slice(0, 4)} />
        </section>
      )}

      {/* ---------- o meni: svitanje novog dana, sunce izlazi iza portreta ---------- */}
      <section data-van="" className="jutro noc" id="o-meni">
        <Jutro />
      </section>

      {/* ---------- česta pitanja: vedro jutro, pitanja su postaje na putu iz sekcije iznad ---------- */}
      <section data-van="" className="vedro zrno" id="pitanja">
        <Vedro />
      </section>

      {/* ---------- završna poruka: zalazak iza stabla života; korijenje prelazi u zvijezde podnožja ---------- */}
      <section data-van="" className="zalaz" id="zavrsna">
        <Zalaz />
      </section>
    </>
  );
}

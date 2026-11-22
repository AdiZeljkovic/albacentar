import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Dijeli from "@/components/Dijeli";
import Naslov from "@/components/Naslov";
import Ornament from "@/components/Ornament";
import Zvijezde from "@/components/Zvijezde";
import Lampion, { LampionCrtezi } from "@/components/blog/Lampion";
import { Lampioncici } from "@/components/blog/Nebo";
import { mjereSlike } from "@/components/blog/mjere";
import Oblaci from "@/components/pocetna/Oblaci";
import Para from "@/components/pocetna/Para";
import { clanak, sviClanci } from "@/lib/blog";
import { greben } from "@/lib/krajolik";
import { site } from "@/lib/site";
import { kas, vars } from "@/lib/util";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sviClanci().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = clanak(slug);
  if (!c) return {};
  return {
    title: c.naslov,
    description: c.sazetak,
    alternates: { canonical: `/blog/${c.slug}` },
    openGraph: {
      type: "article",
      title: c.naslov,
      description: c.sazetak,
      url: `/blog/${c.slug}`,
      publishedTime: c.datum,
      authors: [site.owner.name],
      images: c.slika ? [{ url: c.slika }] : undefined,
    },
  };
}

export default async function Clanak({ params }: Props) {
  const { slug } = await params;
  const c = clanak(slug);
  if (!c) notFound();

  const svi = sviClanci();
  const i = svi.findIndex((x) => x.slug === c.slug);
  const drugi = [svi[i + 1], svi[i - 1], ...svi].filter((x, k, niz) => x && x.slug !== c.slug && niz.indexOf(x) === k).slice(0, 2);

  // slika se prikazuje cijela, u svom omjeru; potpis „Autor: Djelo (godina)" dijeli se na dva retka
  const mjere = (c.slika && mjereSlike(c.slika)) || { w: 1200, h: 900 };
  const dvotocka = c.slikaAlt.indexOf(": ");
  const autor = dvotocka > 0 ? c.slikaAlt.slice(0, dvotocka) : "";
  const djelo = dvotocka > 0 ? c.slikaAlt.slice(dvotocka + 2) : c.slikaAlt;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: c.naslov,
    description: c.sazetak,
    datePublished: c.datum,
    inLanguage: "hr",
    author: { "@type": "Person", name: site.owner.name },
    publisher: { "@type": "Organization", name: site.name },
    image: c.slika ? `${site.url}${c.slika}` : undefined,
    mainEntityOfPage: `${site.url}/blog/${c.slug}`,
  };

  return (
    <>
      <article id="clanak" className="bl-clanak">
        <div className="napredak" id="napredak" aria-hidden="true" />

        {/* noćna glava kao na ostalim stranicama: na dnu grebeni i magla koja prelazi u boju stranice */}
        <header className="glava clanak-glava">
          <div className="glava-zvijezde" aria-hidden="true">
            <Zvijezde gustoca={0.9} bogato />
          </div>
          <div className="uska sredina">
            <p className="oz" data-reveal>
              <Link href="/blog">Blog</Link>
              <i aria-hidden="true">·</i>
              {c.kategorija}
            </p>
            <Naslov as="h1" delay={0.08}>
              {c.naslov}
            </Naslov>
            {c.podnaslov && (
              <p className="clanak-pod" data-reveal style={kas(0.35)}>
                {c.podnaslov}
              </p>
            )}
            <p className="clanak-meta" data-reveal style={kas(0.42)}>
              <time dateTime={c.datum}>{c.datumTekst}</time>
              <span>{c.minuta} min čitanja</span>
              <span>{site.owner.name}</span>
            </p>
          </div>
          <svg className="glava-kraj" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
            <path d={greben({ sjeme: 71, y: 92, amp: 30, valova: 2.6, dno: 300 })} fill="#27305f" opacity=".75" />
            <path d={greben({ sjeme: 83, y: 124, amp: 24, valova: 3.1, suma: 8, dno: 300 })} fill="#11162e" />
            <Para
              id="bl-cg"
              boja={[0.98, 0.949, 0.906]}
              visina={300}
              slojevi={[
                { frek: "0.003 0.018", sjeme: 8, od: 96, do: 220, jacina: 1.9, boja: [0.66, 0.66, 0.86] },
                { frek: "0.005 0.024", sjeme: 18, od: 150, do: 258, jacina: 2.4 },
                { frek: "0.009 0.034", sjeme: 27, od: 200, do: 284, jacina: 3 },
              ]}
              puno={[222, 292]}
            />
          </svg>
        </header>

        {c.slika && (
          <figure className="clanak-slika" data-reveal="zum" style={vars({ "--omjer": (mjere.w / mjere.h).toFixed(4) })}>
            <span className="bl-okvir">
              <span className="bl-paspartu">
                <Image src={c.slika} alt={c.slikaAlt} width={mjere.w} height={mjere.h} sizes="(max-width: 700px) 84vw, 760px" loading="eager" fetchPriority="high" />
              </span>
            </span>
            {c.slikaAlt && (
              <figcaption>
                {autor && <span className="bl-autor">{autor}</span>}
                {djelo}
              </figcaption>
            )}
          </figure>
        )}

        <div className="uska">
          <div className="clanak-tekst" dangerouslySetInnerHTML={{ __html: c.html }} />

          <Ornament className="bl-kraj-teksta" />
          <div className="bl-rep">
            {c.oznake.length > 0 && (
              <ul className="oznake clanak-oznake" aria-label="Oznake">
                {c.oznake.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            )}
            <Dijeli naslov={c.naslov} url={`${site.url}/blog/${c.slug}`} />
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </article>

      {/* dan članka prelazi u sumrak pa u noć podnožja: poziv pod prvim zvijezdama, ispod njega lampioni s daljnjim tekstovima */}
      <section className="bl-sumrak noc">
        <LampionCrtezi />
        <Oblaci id="bl-so" boja={[1, 0.9, 0.78]} sjena={[0.86, 0.38, 0.32]} sjeme={17} gustoca={3.2} />
        <div className="bl-sumrak-zvijezde" aria-hidden="true">
          <Zvijezde gustoca={0.9} bogato padalice={false} />
        </div>
        <Lampioncici />

        <div className="w">
          <aside className="clanak-poziv">
            <Ornament />
            <Naslov>{"Osjećate da je vrijeme pogledati *svoju priču?*"}</Naslov>
            <p data-reveal style={kas(0.3)}>
              Prijavite se na radionicu ili pošaljite upit za individualni susret.
            </p>
            <div className="gumbi" data-reveal style={kas(0.42)}>
              <Link className="btn btn-zlato" href="/radionice#prijava">
                Prijava na radionicu
              </Link>
              <Link className="btn btn-svijetlo" href="/konzultacije#upit">
                Individualni susret
              </Link>
            </div>
          </aside>
        </div>

        {drugi.length > 0 && (
          <div className="sek pijesak clanak-jos">
            <div className="w">
              <p className="oz" data-reveal>
                Čitajte dalje
              </p>
              <div className="clanak-jos-mreza">
                {drugi.map((d, k) => (
                  <Link key={d.slug} href={`/blog/${d.slug}`} data-reveal style={kas(k * 0.16)}>
                    <div className="bl-lebdi">
                      <div className="bl-leti" style={vars({ "--t": `${7 + k * 1.3}s`, "--d": `${-k * 2.6}s` })}>
                        <Lampion slika={d.slika} klasaTijela="blog-sl" sizes="190px" i={k + 1}>
                          <Image className="bl-l-znak" src="/img/drvo-zlatno.png" alt="" width={520} height={500} sizes="190px" />
                        </Lampion>
                        <div className="bl-visak" style={vars({ "--t": `${4.8 + k * 0.9}s`, "--d": `${-k * 1.4}s` })}>
                          <span className="bl-nit" aria-hidden="true" />
                          <div className="bl-cedulja">
                            <p className="kat">{d.kategorija}</p>
                            <h3>{d.naslov}</h3>
                            <p className="blog-dat">{d.datumTekst}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="red bl-svi" data-reveal>
                <Link className="link" href="/blog">
                  Svi tekstovi{" "}
                  <span className="str" aria-hidden="true">
                    →
                  </span>
                </Link>
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

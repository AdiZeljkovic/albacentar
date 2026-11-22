import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import GlatkiSkrol from "@/components/GlatkiSkrol";
import Podnozje from "@/components/Podnozje";
import ScrollFx from "@/components/ScrollFx";
import Stanka from "@/components/Stanka";
import Traka from "@/components/Traka";
import { site } from "@/lib/site";
import "@/styles/base.css";
import "@/styles/okvir.css";
import "@/styles/pocetna.css";
import "@/styles/stranice.css";
import "@/styles/str-konstelacije.css";
import "@/styles/str-konzultacije.css";
import "@/styles/str-knjige.css";
import "@/styles/str-blog.css";
import "@/styles/str-omeni.css";

/**
 * Fontovi su u src/fonts, skraćeni na znakove koje stranica koristi (latinica, hrvatska slova,
 * interpunkcija) i na debljine 400–600. Tako su četiri male datoteke umjesto osam velikih;
 * vidi README, „Fontovi", za postupak ako zatreba novi znak.
 */
const garamond = localFont({
  src: [
    { path: "../fonts/eb-garamond.woff2", weight: "400 600", style: "normal" },
    { path: "../fonts/eb-garamond-italic.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  // zamjenski fontovi s usklađenim širinama su u base.css ("AlBa serif zamjena", "AlBa sans zamjena")
  adjustFontFallback: false,
});
const figtree = localFont({
  src: [{ path: "../fonts/figtree.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: false,
});
// rukopis je ukras (potpis, moto), pa se ne učitava unaprijed
const rukopis = localFont({
  src: [{ path: "../fonts/great-vibes.woff2", weight: "400", style: "normal" }],
  variable: "--font-script",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Obiteljske konstelacije, radionice i konzultacije`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.owner.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "hr_HR",
    siteName: site.name,
    title: `${site.name} | Obiteljske konstelacije, radionice i konzultacije`,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#141b34",
  width: "device-width",
  initialScale: 1,
};

/**
 * Otkrivanje sadržaja pri ulasku u ekran ([data-reveal] → data-inview) počinje ovom malom skriptom čim se
 * HTML učita, a ne tek kad stigne i pokrene se sav JavaScript stranice. Na sporoj mreži to je razlika od
 * nekoliko sekundi do prvog teksta ispod zaglavlja. Kasnije posao preuzima ScrollFx. Samo u produkciji:
 * u razvoju bi React pri hidraciji prijavljivao atribute koje nije sam postavio.
 */
const RANO_OTKRIVANJE =
  "(function(){if(!('IntersectionObserver' in window))return;var p=new IntersectionObserver(function(u){for(var i=0;i<u.length;i++)if(u[i].isIntersecting){u[i].target.setAttribute('data-inview','1');p.unobserve(u[i].target)}},{rootMargin:'0px 0px -8% 0px'});var e=document.querySelectorAll('[data-reveal]');for(var i=0;i<e.length;i++)p.observe(e[i]);window.__ranoOtkrivanje=p})()";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: site.url,
  email: site.email,
  image: `${site.url}/opengraph-image`,
  sameAs: [site.facebook],
  founder: { "@type": "Person", name: site.owner.name },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr" className={`${garamond.variable} ${figtree.variable} ${rukopis.variable}`}>
      <body>
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}.rij>span{transform:none!important}.ornament path{stroke-dashoffset:0!important}.misao-rijec{opacity:1!important;transform:none!important;filter:none!important}[data-van] *,[data-van] *::before,[data-van] *::after{animation-play-state:running!important}[data-van] .portali-pozornica{content-visibility:visible!important;visibility:visible!important}",
            }}
          />
        </noscript>
        <a className="skok" href="#sadrzaj">
          Preskoči na sadržaj
        </a>
        <GlatkiSkrol />
        <ScrollFx />
        <Stanka />
        <Traka />
        <main id="sadrzaj">{children}</main>
        <Podnozje />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {process.env.NODE_ENV === "production" && <script dangerouslySetInnerHTML={{ __html: RANO_OTKRIVANJE }} />}
      </body>
    </html>
  );
}

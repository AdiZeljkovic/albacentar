import type { Metadata } from "next";
import Link from "next/link";
import Naslov from "@/components/Naslov";
import Zvijezde from "@/components/Zvijezde";
import Karta404 from "@/components/omeni/Karta404";
import { greben } from "@/lib/krajolik";
import { kas } from "@/lib/util";

export const metadata: Metadata = { title: "Stranica nije pronađena", robots: { index: false } };

/**
 * 404: noćno nebo kao u glavi ostalih stranica, uz njega zvjezdana karta s jednim praznim mjestom
 * i zvijezdom koja je odlutala s karte. Grebeni na dnu su boje podnožja, pa se noć u njega nastavlja bez reza.
 */
export default function NijePronadeno() {
  return (
    <section className="am-404">
      <div className="am-404-zvijezde" aria-hidden="true">
        <Zvijezde gustoca={1} bogato />
      </div>
      <div className="w am-404-mreza">
        <div className="am-404-tekst">
          <p className="oz" data-reveal>
            Greška 404
          </p>
          <Naslov as="h1" delay={0.08}>
            {"Ova stranica nije na *svom mjestu.*"}
          </Naslov>
          <p className="glava-uvod" data-reveal style={kas(0.38)}>
            Možda je premještena ili adresa nije točna. Vratite se na početnu ili pogledajte što vas zanima.
          </p>
          <div className="gumbi" data-reveal style={{ marginTop: 14 }}>
            <Link className="btn btn-zlato" href="/">
              Na početnu
            </Link>
            <Link className="btn btn-svijetlo" href="/kontakt">
              Kontakt
            </Link>
          </div>
        </div>
        <Karta404 />
      </div>
      <svg className="am-404-kraj" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
        <path d={greben({ sjeme: 37, y: 74, amp: 30, valova: 2.3, dno: 200 })} fill="#27305f" opacity=".7" />
        <path d={greben({ sjeme: 45, y: 104, amp: 24, valova: 3.2, suma: 8, dno: 200 })} fill="#171e3e" />
        <path d={greben({ sjeme: 58, y: 150, amp: 18, valova: 1.8, oktave: 3, dno: 200 })} fill="#10162b" />
      </svg>
    </section>
  );
}

import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Prima upite sa svih obrazaca (prijava na radionicu, termin, knjige, kontakt)
 * i šalje ih e-mailom preko Resend API-ja. Postavke su u .env (vidi .env.example).
 */
export const runtime = "nodejs";

const VRSTE: Record<string, string> = {
  radionica: "Prijava na radionicu",
  konzultacije: "Upit za termin",
  knjige: "Knjige: želim obavijest",
  kontakt: "Poruka s kontakt obrasca",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const jedanRed = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function POST(zahtjev: Request) {
  let tijelo: unknown;
  try {
    tijelo = await zahtjev.json();
  } catch {
    return NextResponse.json({ greska: "Neispravan zahtjev." }, { status: 400 });
  }
  const t = (tijelo ?? {}) as Record<string, unknown>;

  // Zamka za robote: skriveno polje koje čovjek ne vidi, i obrazac ispunjen prebrzo.
  // Robotu se odgovara kao da je sve prošlo, ali se ništa ne šalje.
  if (typeof t.med === "string" && t.med.length > 0) return NextResponse.json({ ok: true });
  if (typeof t.trajanje === "number" && t.trajanje < 2500) return NextResponse.json({ ok: true });

  const vrsta = typeof t.vrsta === "string" ? t.vrsta : "";
  const naslov = VRSTE[vrsta];
  const email = typeof t.email === "string" ? jedanRed(t.email).slice(0, 200) : "";
  const ime = typeof t.ime === "string" ? jedanRed(t.ime).slice(0, 120) : "";
  const polja = Array.isArray(t.polja) ? t.polja.slice(0, 20) : [];

  if (!naslov) return NextResponse.json({ greska: "Nepoznata vrsta upita." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ greska: "Upišite ispravnu e-mail adresu." }, { status: 400 });
  if (vrsta !== "knjige" && ime.length < 2) return NextResponse.json({ greska: "Upišite ime i prezime." }, { status: 400 });

  const redovi: string[] = [];
  if (ime) redovi.push(`Ime i prezime: ${ime}`);
  redovi.push(`E-mail: ${email}`);
  for (const p of polja) {
    if (!Array.isArray(p) || typeof p[0] !== "string" || typeof p[1] !== "string") continue;
    const oznaka = jedanRed(p[0]).slice(0, 60);
    const vrijednost = p[1].trim().slice(0, 4000);
    if (oznaka && vrijednost) redovi.push(`${oznaka}: ${vrijednost}`);
  }
  const tekst = `${naslov}\n${"-".repeat(naslov.length)}\n\n${redovi.join("\n")}\n\nPoslano s ${site.url}`;

  const kljuc = process.env.RESEND_API_KEY;
  const prima = process.env.UPITI_EMAIL_TO || site.email;
  const salje = process.env.UPITI_EMAIL_FROM;

  if (!kljuc || !salje) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n[upit] Slanje e-maila nije podešeno, upit se samo ispisuje:\n${tekst}\n`);
      return NextResponse.json({ ok: true, razvoj: true });
    }
    // U produkciji se upit ne smije izgubiti u tišini: posjetitelj dobije jasnu poruku i e-mail adresu.
    console.error("[upit] RESEND_API_KEY ili UPITI_EMAIL_FROM nisu postavljeni, upit nije poslan.");
    return NextResponse.json({ greska: "Slanje trenutno nije moguće." }, { status: 503 });
  }

  try {
    const odgovor = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${kljuc}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: salje,
        to: [prima],
        reply_to: email,
        subject: `${naslov}${ime ? `: ${ime}` : ""}`,
        text: tekst,
      }),
    });
    if (!odgovor.ok) {
      console.error("[upit] Resend je odbio poruku:", odgovor.status, await odgovor.text());
      return NextResponse.json({ greska: "Slanje nije uspjelo." }, { status: 502 });
    }
  } catch (e) {
    console.error("[upit] Greška pri slanju:", e);
    return NextResponse.json({ greska: "Slanje nije uspjelo." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * Osnovni podaci o stranici na jednom mjestu.
 * Prazna vrijednost ("") znači da se podatak nigdje ne prikazuje.
 */
type Site = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  indexable: boolean;
  email: string;
  phone: string;
  company: string;
  location: string;
  facebook: string;
  facebookName: string;
  owner: { name: string; prefix: string; roles: string[]; photo: string };
};

export const site: Site = {
  name: "AlBa Centar",
  tagline: "Konstelacije · Edukacije · Konzultacije",
  description:
    "Obiteljske i sistemske konstelacije prema pristupu Berta Hellingera, individualno i u grupi. Radionice, edukacije, individualne konzultacije i knjige o obiteljskom nasljeđu.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://albacentar.hr").replace(/\/$/, ""),
  indexable: process.env.SITE_INDEXABLE === "true",

  // Kontakt
  email: "info@albacentar.hr",
  phone: "",
  company: "",
  location: "",
  facebook: "https://www.facebook.com/profile.php?id=61570632931103",
  facebookName: "AlBa konstelacije",

  owner: {
    name: "Aleksandra Baljak Biško",
    prefix: "MSc.",
    roles: ["Magistar ekonomskih znanosti", "Porezna specijalist", "Konstelator"],
    // Putanja do fotografije u /public (npr. "/img/aleksandra.jpg"). Dok je prazno, prikazuje se znak drveta.
    photo: "",
  },
};

export const nav = [
  { href: "/konstelacije", label: "Konstelacije" },
  { href: "/radionice", label: "Radionice" },
  { href: "/konzultacije", label: "Konzultacije" },
  { href: "/knjige", label: "Knjige" },
  { href: "/blog", label: "Blog" },
  { href: "/o-meni", label: "O meni" },
] as const;

export const footerNav = {
  rad: [
    { href: "/konstelacije", label: "Obiteljske konstelacije" },
    { href: "/radionice", label: "Radionice i edukacije" },
    { href: "/konzultacije", label: "Načini rada i konzultacije" },
    { href: "/pratnja", label: "Pratnja u završnom životnom razdoblju" },
  ],
  centar: [
    { href: "/o-meni", label: "O meni" },
    { href: "/knjige", label: "Knjige i publikacije" },
    { href: "/blog", label: "Blog" },
    { href: "/cesta-pitanja", label: "Česta pitanja" },
  ],
} as const;

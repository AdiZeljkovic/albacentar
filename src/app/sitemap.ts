import type { MetadataRoute } from "next";
import { sviClanci } from "@/lib/blog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const stranice = ["", "/konstelacije", "/radionice", "/konzultacije", "/knjige", "/blog", "/o-meni", "/pratnja", "/cesta-pitanja", "/kontakt", "/privatnost"];
  return [
    ...stranice.map((s) => ({ url: `${site.url}${s}`, changeFrequency: "monthly" as const, priority: s === "" ? 1 : 0.7 })),
    ...sviClanci().map((c) => ({ url: `${site.url}/blog/${c.slug}`, lastModified: c.datum, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}

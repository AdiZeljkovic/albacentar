import { createElement, Fragment, type CSSProperties, type ReactNode } from "react";

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  /** Tekst naslova. *Zvjezdice* označavaju kurziv u zlatnoj boji, a \n novi red. */
  children: string;
  className?: string;
  delay?: number;
  id?: string;
};

/**
 * Naslov koji se pri ulasku u ekran otkriva riječ po riječ.
 * Čitači ekrana dobiju cijeli tekst kroz aria-label, a animirani dijelovi su im skriveni.
 */
export default function Naslov({ as = "h2", children, className, delay = 0, id }: Props) {
  const cist = children.replace(/\*/g, "").replace(/\n/g, " ");
  const sadrzaj: ReactNode[] = [];
  let i = 0;

  children.split("\n").forEach((red, r) => {
    if (r > 0) sadrzaj.push(<br key={`br${r}`} />);
    red
      .split(/(\*[^*]+\*)/g)
      .filter(Boolean)
      .forEach((dio) => {
        const kurziv = dio.startsWith("*") && dio.endsWith("*");
        const tekst = kurziv ? dio.slice(1, -1) : dio;
        tekst
          .split(/\s+/)
          .filter(Boolean)
          .forEach((rijec) => {
            const k = i++;
            sadrzaj.push(
              <Fragment key={k}>
                <span className="rij" aria-hidden="true">
                  <span className={kurziv ? "em" : undefined} style={{ "--i": k } as CSSProperties}>
                    {rijec}
                  </span>
                </span>{" "}
              </Fragment>,
            );
          });
      });
  });

  // naslovi smiju nositi aria-label; odlomak ne smije, pa čitačima ekrana cijeli tekst daje skriveni span
  const jeOdlomak = as === "p";
  return createElement(
    as,
    {
      className,
      id,
      "data-reveal": "rijeci",
      "aria-label": jeOdlomak ? undefined : cist,
      style: { "--d": `${delay}s` } as CSSProperties,
    },
    jeOdlomak ? <span className="sr">{cist}</span> : null,
    sadrzaj,
  );
}

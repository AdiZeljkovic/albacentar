import type { CSSProperties } from "react";

/** Kašnjenje animacije otkrivanja, u sekundama: style={kas(0.2)} */
export const kas = (s: number): CSSProperties => ({ "--d": `${s}s` }) as CSSProperties;

/** Proizvoljne CSS varijable u style atributu. */
export const vars = (v: Record<string, string | number>): CSSProperties => v as CSSProperties;

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

import type { CSSProperties } from "react";

/** Ornament iz logotipa: linija, uvojci i list u sredini. Iscrtava se kad uđe u ekran. */
export default function Ornament({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={`ornament${className ? ` ${className}` : ""}`}
      style={style}
      data-reveal="crta"
      viewBox="0 0 260 24"
      width="260"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path pathLength={1} d="M88 12H2" />
      <path pathLength={1} d="M172 12h86" />
      <path pathLength={1} d="M88 12c6 0 9-6 15-6s6 6 0 6-6-4-2-6" />
      <path pathLength={1} d="M172 12c-6 0-9-6-15-6s-6 6 0 6 6-4 2-6" />
      <path pathLength={1} className="list" d="M130 3c-7 5-7 13 0 18 7-5 7-13 0-18z" />
      <path pathLength={1} d="M122 12h-4M138 12h4" />
    </svg>
  );
}

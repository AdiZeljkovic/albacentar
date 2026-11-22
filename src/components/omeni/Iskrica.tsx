import { ISKRA } from "@/lib/zvijezda";

/** Mali sjaj zvijezde kao oznaka u popisu ili ukras na okviru kartice. Boju uzima od teksta (currentColor). */
export default function Iskrica({ className }: { className?: string }) {
  return (
    <svg className={className ? `am-iskrica ${className}` : "am-iskrica"} viewBox="-10 -13 20 26" aria-hidden="true">
      <path d={ISKRA} fill="currentColor" />
    </svg>
  );
}

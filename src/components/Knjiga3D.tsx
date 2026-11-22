import Image from "next/image";
import { cx } from "@/lib/util";

type Props = {
  naslov: string;
  podnaslov: string;
  korica: "svijetla" | "nocna";
  className?: string;
};

/** Knjiga u 3D-u, složena od CSS ploha: prednja korica, hrbat, listovi i stražnja korica. */
export default function Knjiga3D({ naslov, podnaslov, korica, className }: Props) {
  return (
    <div className={cx("k3d", `k3d-${korica}`, className)}>
      <div className="k3d-straznja" />
      <div className="k3d-listovi" />
      <div className="k3d-hrbat">
        <span>{naslov}</span>
      </div>
      <div className="k3d-prednja">
        <span className="k3d-izdavac">AlBa Centar</span>
        <span className="k3d-naslov">{naslov}</span>
        <span className="k3d-crta" />
        <span className="k3d-podnaslov">{podnaslov}</span>
        {korica === "svijetla" ? (
          <Image className="k3d-znak" src="/img/drvo-zlatno.png" alt="" width={520} height={500} sizes="260px" />
        ) : (
          <svg className="k3d-znak k3d-niti" viewBox="0 0 240 200" fill="none" stroke="#d9b56f" strokeLinecap="round" aria-hidden="true">
            <path d="M20 40 C70 70 80 120 120 150" strokeWidth=".9" opacity=".75" />
            <path d="M220 34 C170 64 160 118 120 150" strokeWidth=".9" opacity=".75" />
            <path d="M70 22 C92 70 104 112 120 150" strokeWidth=".8" opacity=".55" />
            <path d="M170 18 C148 68 136 112 120 150" strokeWidth=".8" opacity=".55" />
            <path d="M120 150 C120 168 120 180 120 196" strokeWidth="1.1" />
            <path d="M20 40 C60 20 110 44 170 18" strokeWidth=".6" opacity=".35" strokeDasharray="2 5" />
            <path d="M70 22 C120 60 180 20 220 34" strokeWidth=".6" opacity=".35" strokeDasharray="2 5" />
            <g fill="#19213b" strokeWidth="1.2">
              <circle cx="20" cy="40" r="7" />
              <circle cx="70" cy="22" r="7" />
              <circle cx="170" cy="18" r="7" />
              <circle cx="220" cy="34" r="7" />
            </g>
            <circle cx="120" cy="150" r="10" fill="#e2c487" stroke="none" />
          </svg>
        )}
      </div>
    </div>
  );
}

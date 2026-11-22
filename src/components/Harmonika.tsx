"use client";

import { useId, useState } from "react";
import { kas } from "@/lib/util";

type Stavka = { p: string; o: string };

/** Pitanja i odgovori koji se glatko otvaraju. Odgovori su u HTML-u i kad su zatvoreni, zbog tražilica. */
export default function Harmonika({ stavke, otvorenoPrvo = false }: { stavke: readonly Stavka[]; otvorenoPrvo?: boolean }) {
  const id = useId();
  const [otvoreno, setOtvoreno] = useState<number | null>(otvorenoPrvo ? 0 : null);

  return (
    <div className="harmonika">
      {stavke.map((s, i) => {
        const jest = otvoreno === i;
        return (
          <div key={s.p} className="harm" data-otvoreno={jest ? "1" : undefined} data-reveal style={kas(Math.min(i, 6) * 0.05)}>
            <h3>
              <button type="button" aria-expanded={jest} aria-controls={`${id}-${i}`} id={`${id}-g-${i}`} onClick={() => setOtvoreno(jest ? null : i)}>
                <span className="harm-br">{String(i + 1).padStart(2, "0")}</span>
                <span className="harm-p">{s.p}</span>
                <span className="harm-znak" aria-hidden="true" />
              </button>
            </h3>
            <div className="harm-tijelo" id={`${id}-${i}`} role="region" aria-labelledby={`${id}-g-${i}`} inert={!jest}>
              <div>
                <p>{s.o}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

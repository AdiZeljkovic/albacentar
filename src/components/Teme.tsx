"use client";

import { useState, type CSSProperties } from "react";
import { teme } from "@/content/konstelacije";

/** Životne teme po područjima. Kartice se izmjenjuju, a stavke ulaze jedna za drugom. */
export default function Teme() {
  const [akt, setAkt] = useState(0);
  const podrucje = teme[akt];

  return (
    <div className="teme">
      <div className="teme-kartice" role="tablist" aria-label="Područja života">
        {teme.map((t, i) => (
          <button key={t.id} type="button" role="tab" id={`tema-${t.id}`} aria-selected={akt === i} aria-controls="teme-ploca" onClick={() => setAkt(i)}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {t.naziv}
          </button>
        ))}
      </div>
      {/* ploča je tabpanel, a popis unutar nje ostaje popis (ul ne smije nositi ulogu tabpanel) */}
      <div className="teme-ploca" id="teme-ploca" role="tabpanel" aria-labelledby={`tema-${podrucje.id}`} key={podrucje.id}>
        <ul className="teme-popis">
          {podrucje.stavke.map((s, i) => (
            <li key={s} style={{ "--i": i } as CSSProperties}>
              <span className="fig" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

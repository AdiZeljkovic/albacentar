import { ImageResponse } from "next/og";

export const alt = "AlBa Centar: Konstelacije, Edukacije, Konzultacije";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Slika koja se prikazuje kad se stranica podijeli na Facebooku, WhatsAppu i drugdje. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "linear-gradient(135deg, #141b34 0%, #19213b 45%, #2b3766 100%)",
          color: "#fff4e0",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 22, letterSpacing: 7, color: "#d9b56f", fontFamily: "sans-serif" }}>ALBA CENTAR</div>
          <div style={{ fontSize: 86, lineHeight: 1.04, marginTop: 26 }}>Vratiti svakome</div>
          <div style={{ fontSize: 86, lineHeight: 1.04, color: "#d9b56f", fontStyle: "italic" }}>njegovo mjesto.</div>
          <div style={{ fontSize: 26, marginTop: 34, color: "#cdbfa6", fontFamily: "sans-serif" }}>
            Konstelacije · Edukacije · Konzultacije
          </div>
        </div>
        <div style={{ display: "flex", position: "relative", width: 360, height: 360, alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: 360, height: 360, borderRadius: 360, border: "2px solid rgba(217,181,111,.55)" }} />
          <div style={{ position: "absolute", width: 250, height: 250, borderRadius: 250, border: "1px solid rgba(217,181,111,.3)" }} />
          <div style={{ position: "absolute", width: 200, height: 200, borderRadius: 200, background: "rgba(217,181,111,.16)" }} />
          <div style={{ width: 84, height: 84, borderRadius: 84, background: "#e2c487" }} />
        </div>
      </div>
    ),
    size,
  );
}

import fs from "node:fs";
import path from "node:path";

/**
 * Širina i visina slike iz mape /public (JPEG ili PNG), pročitane iz zaglavlja datoteke.
 * Okvir slike u članku tako zna pravi omjer prije nego što se slika učita, pa se stranica ne pomiče.
 * Poziva se samo na poslužitelju.
 */
export function mjereSlike(src: string): { w: number; h: number } | null {
  if (!src.startsWith("/") || src.includes("..")) return null;
  try {
    const b = fs.readFileSync(path.join(process.cwd(), "public", src));
    if (b[0] === 0x89 && b.toString("ascii", 1, 4) === "PNG") return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length - 9) {
        if (b[i] !== 0xff) {
          i++;
          continue;
        }
        const oznaka = b[i + 1];
        // SOF0–SOF15 (osim DHT, JPG i DAC) nosi mjere slike
        if (oznaka >= 0xc0 && oznaka <= 0xcf && oznaka !== 0xc4 && oznaka !== 0xc8 && oznaka !== 0xcc) {
          return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
        }
        if (oznaka === 0xff) {
          i++;
          continue;
        }
        if (oznaka === 0x01 || (oznaka >= 0xd0 && oznaka <= 0xd8)) {
          i += 2;
          continue;
        }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch {
    /* datoteke nema ili nije slika: okvir uzima zadani omjer */
  }
  return null;
}

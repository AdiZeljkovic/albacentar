"use client";

import { useEffect, useRef } from "react";
import { pokreniSjencar } from "@/lib/sjencar";

/**
 * Podnožje brda, noću: tamna zemlja u koju se spušta korijenje iz sekcije iznad, a u visini
 * vrata topla magla koju obasjava svjetlo iz njih i sitne iskre koje se polako dižu.
 * Vrh je iste boje kao dno brda u „Načelima", pa spoja nema.
 * `pojas` je id elementa (mreža vrata) čija visina određuje gdje je magla najgušća.
 */
const BOJA = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_jed;   // piksela platna na 1000 CSS piksela
uniform float u_t;
uniform vec2 u_pojas;  // vrh i dno mreže vrata, u tisućama CSS piksela od vrha

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float sum(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * sum(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 3.1; a *= 0.5; }
  return v;
}

void main() {
  vec2 f = gl_FragCoord.xy;
  vec2 q = vec2(f.x, u_res.y - f.y) / u_jed;     // CSS-koordinate od vrha, 1.0 = 1000 px
  float W = u_res.x / u_jed;
  float H = u_res.y / u_jed;

  vec3 vrh = vec3(0.020, 0.027, 0.059);           // dno brda iznad (#05070f)
  vec3 boja = mix(vrh, vec3(0.043, 0.059, 0.137), smoothstep(0.0, 0.5, q.y));
  boja = mix(boja, vec3(0.035, 0.047, 0.110), smoothstep(H - 0.5, H, q.y));

  // pojas vrata: 0 na vrhu mreže, 1 na dnu
  float p = clamp((q.y - u_pojas.x) / max(u_pojas.y - u_pojas.x, 0.001), -1.0, 2.0);
  float uPojasu = smoothstep(-0.25, 0.25, p) * (1.0 - smoothstep(0.85, 1.35, p));

  // magla koja se polako valja: dva sloja različite brzine
  float m1 = fbm(vec2(q.x * 1.5 + u_t * 0.012, q.y * 3.2 - u_t * 0.004));
  float m2 = fbm(vec2(q.x * 3.4 - u_t * 0.02, q.y * 6.0 + 7.0));
  float magla = smoothstep(0.32, 0.86, m1 * 0.7 + m2 * 0.3);
  vec3 topla = mix(vec3(0.34, 0.20, 0.10), vec3(0.62, 0.42, 0.18), smoothstep(0.2, 0.75, p));
  boja += topla * magla * uPojasu * 0.26;
  boja += vec3(0.10, 0.13, 0.30) * smoothstep(0.4, 0.9, m2) * (1.0 - uPojasu) * 0.16;

  // sjaj poda u visini pragova
  float prag = exp(-pow((p - 0.52) / 0.2, 2.0));
  boja += vec3(0.50, 0.32, 0.13) * prag * (0.10 + 0.14 * m1) * (1.0 - 0.5 * smoothstep(0.34, 0.5, abs(q.x / W - 0.5)));

  // iskre koje se dižu
  vec2 g = vec2(q.x, q.y + u_t * 0.006) * 46.0;
  vec2 id = floor(g);
  vec2 pomak = (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.7;
  pomak.x += sin(u_t * 0.5 + hash(id) * 30.0) * 0.12;
  float iskra = smoothstep(0.955, 1.0, hash(id)) * smoothstep(0.16, 0.0, length(fract(g) - 0.5 + pomak));
  iskra *= 0.5 + 0.5 * sin(u_t * (0.8 + hash(id + 1.7) * 1.4) + hash(id) * 40.0);
  boja += vec3(1.0, 0.82, 0.50) * iskra * (0.25 + 0.75 * uPojasu);

  // vrh ostaje točno boje zemlje iznad; rubovi tamniji
  boja = mix(vrh, boja, smoothstep(0.0, 0.12, q.y));
  boja *= 1.0 - 0.32 * smoothstep(0.30, 0.56, abs(q.x / W - 0.5));
  boja += (hash(f) - 0.5) * 0.008;
  gl_FragColor = vec4(boja, 1.0);
}`;

export default function Magla({ pojas }: { pojas: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const platno = ref.current;
    if (!platno) return;
    const ugasi = pokreniSjencar(platno, {
      izvor: BOJA,
      uniforme: ["u_res", "u_jed", "u_t", "u_pojas"],
      mjerilo: (s, v) => (s * v > 3_000_000 ? 0.4 : 0.5),
      postavi: (gl, u, stanje) => {
        gl.uniform2f(u.u_res, stanje.sirina, stanje.visina);
        gl.uniform1f(u.u_jed, 1000 * stanje.mjerilo);
        gl.uniform1f(u.u_t, stanje.t);
        const o = document.getElementById(pojas)?.getBoundingClientRect();
        if (o) gl.uniform2f(u.u_pojas, (o.top - stanje.okvir.top) / 1000, (o.bottom - stanje.okvir.top) / 1000);
        else gl.uniform2f(u.u_pojas, 0.35, 1.2);
      },
    });
    return () => ugasi?.();
  }, [pojas]);

  return <canvas ref={ref} className="dv-magla" aria-hidden="true" />;
}

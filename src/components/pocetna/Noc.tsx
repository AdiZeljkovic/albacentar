"use client";

import { useEffect, useRef } from "react";
import { pokreniSjencar } from "@/lib/sjencar";

/**
 * Noć nad krajolikom, iscrtana na grafičkoj kartici: tamno nebo, Mliječna staza koja se
 * dijagonalno proteže preko sekcije (s tamnim trakama prašine i toplijom jezgrom) i
 * blijedi sjaj uz obzor. Vrh je iste boje kao dno sumraka iznad, pa spoja nema.
 * Oštre zvijezde i padalice crta zasebno platno iznad (Zvijezde).
 */
const BOJA = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_jed;  // piksela platna na 1000 CSS piksela
uniform float u_t;

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
  float y = q.y / H;                              // 0 vrh, 1 dno

  vec3 vrh = vec3(0.086, 0.114, 0.220);           // dno sumraka
  vec3 boja = mix(vrh, vec3(0.040, 0.054, 0.128), smoothstep(0.0, 0.45, y));

  // Mliječna staza
  vec2 c = vec2(q.x - W * 0.5, q.y - H * 0.40);
  float kut = -0.44;
  vec2 r = vec2(c.x * cos(kut) - c.y * sin(kut), c.x * sin(kut) + c.y * cos(kut));
  float sirina = 0.17 + 0.05 * sin(r.x * 2.1 + 1.0);
  float traka = exp(-pow(r.y / sirina, 2.0));
  float oblaci = fbm(r * vec2(2.2, 5.0) + vec2(u_t * 0.004, 0.0));
  float prasina = smoothstep(0.44, 0.72, fbm(r * vec2(5.0, 13.0) + 9.0));
  float sjaj = traka * (0.30 + 1.0 * oblaci) * (1.0 - 0.62 * prasina * traka);
  vec3 staza = mix(vec3(0.40, 0.50, 0.90), vec3(1.0, 0.82, 0.62), exp(-r.x * r.x * 5.0) * 0.75);
  boja += staza * sjaj * 0.46;
  boja += vec3(0.50, 0.36, 0.70) * exp(-pow(r.y / (sirina * 2.4), 2.0)) * 0.10;   // ljubičasti rub

  // zvjezdani prah: tisuće sitnih zvijezda, gušće u Mliječnoj stazi
  vec2 g = q * 150.0;
  vec2 id = floor(g);
  vec2 pomak = (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.6;
  float prah = smoothstep(0.990 - traka * 0.085, 1.0, hash(id)) * smoothstep(0.30, 0.0, length(fract(g) - 0.5 + pomak));
  prah *= 0.75 + 0.25 * sin(u_t * (0.6 + hash(id + 1.7) * 1.6) + hash(id) * 40.0);
  boja += mix(vec3(0.80, 0.86, 1.0), vec3(1.0, 0.90, 0.74), hash(id + 5.3)) * prah * (0.10 + traka * 0.42) * (1.0 - 0.6 * prasina * traka);

  // sjaj neba uz obzor
  boja += vec3(0.10, 0.17, 0.33) * smoothstep(0.52, 1.0, y) * 0.6;
  boja += vec3(0.30, 0.20, 0.10) * smoothstep(0.80, 1.0, y) * exp(-pow((q.x - W * 0.5) / 0.5, 2.0)) * 0.5;   // toplo svjetlo stabla

  // vrh ostaje točno boje sumraka
  boja = mix(vrh, boja, smoothstep(0.0, 0.10, y));
  boja += (hash(f) - 0.5) * 0.010;
  gl_FragColor = vec4(boja, 1.0);
}`;

export default function Noc() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const platno = ref.current;
    if (!platno) return;
    const ugasi = pokreniSjencar(platno, {
      izvor: BOJA,
      uniforme: ["u_res", "u_jed", "u_t"],
      mjerilo: (s, v) => (s * v > 3_000_000 ? 0.45 : 0.55),
      postavi: (gl, u, stanje) => {
        gl.uniform2f(u.u_res, stanje.sirina, stanje.visina);
        gl.uniform1f(u.u_jed, 1000 * stanje.mjerilo);
        gl.uniform1f(u.u_t, stanje.t);
      },
    });
    return () => ugasi?.();
  }, []);

  return <canvas ref={ref} className="noc-nebo" aria-hidden="true" />;
}

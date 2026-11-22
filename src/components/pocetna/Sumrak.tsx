"use client";

import { useEffect, useRef } from "react";
import { pokreniSjencar } from "@/lib/sjencar";

/**
 * Sumrak: nebo koje se odozgo prema dolje pretapa iz dana u noć.
 * Počinje bojom pijeska (nastavak sunčane sekcije iznad), prolazi kroz zlatnu, koraljnu i
 * ljubičastu, i na otprilike 620 px od vrha postaje noć. Rub između boja nije ravan nego
 * ga lome oblaci, a u koraljnom pojasu trake oblaka hvataju zadnje svjetlo.
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
  vec2 q = vec2(f.x, u_res.y - f.y) / u_jed;   // CSS-koordinate od vrha, 1.0 = 1000 px

  // oblaci lome granice među bojama; na samom vrhu ne, da se spoj s danom ne vidi
  float val = (fbm(vec2(q.x * 1.6 + u_t * 0.01, q.y * 5.0)) - 0.5) * smoothstep(0.0, 0.09, q.y);
  float t = clamp(q.y / 0.62 + val * 0.11, 0.0, 1.0);

  vec3 boja = mix(vec3(0.945, 0.894, 0.820), vec3(0.962, 0.800, 0.590), smoothstep(0.0, 0.16, t));   // pijesak → zlato
  boja = mix(boja, vec3(0.905, 0.560, 0.440), smoothstep(0.12, 0.32, t));                              // → koralj
  boja = mix(boja, vec3(0.540, 0.320, 0.500), smoothstep(0.28, 0.50, t));                              // → ljubičasta
  boja = mix(boja, vec3(0.210, 0.196, 0.396), smoothstep(0.44, 0.70, t));                              // → indigo
  boja = mix(boja, vec3(0.086, 0.114, 0.220), smoothstep(0.62, 1.0, t));                               // → noć

  // trake oblaka koje hvataju zadnje svjetlo
  float o = fbm(vec2(q.x * 1.1 - u_t * 0.006, q.y * 7.0 + 3.0));
  float pojas = smoothstep(0.06, 0.20, t) * (1.0 - smoothstep(0.34, 0.58, t));
  boja = mix(boja, vec3(1.0, 0.86, 0.66), smoothstep(0.50, 0.80, o) * pojas * 0.6);

  // sunce koje tone, u sredini
  vec2 sp = vec2(0.5 * u_res.x / u_jed, 0.16);
  float d = length((q - sp) * vec2(0.5, 1.0));
  boja += vec3(1.0, 0.62, 0.36) * exp(-d * 6.0) * 0.32 * (1.0 - smoothstep(0.5, 0.78, t)) * smoothstep(0.0, 0.06, q.y);

  boja += (hash(f) - 0.5) * 0.01;
  gl_FragColor = vec4(boja, 1.0);
}`;

export default function Sumrak() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const platno = ref.current;
    if (!platno) return;
    const ugasi = pokreniSjencar(platno, {
      izvor: BOJA,
      uniforme: ["u_res", "u_jed", "u_t"],
      mjerilo: (s, v) => (s * v > 3_000_000 ? 0.36 : 0.45),
      postavi: (gl, u, stanje) => {
        gl.uniform2f(u.u_res, stanje.sirina, stanje.visina);
        gl.uniform1f(u.u_jed, 1000 * stanje.mjerilo);
        gl.uniform1f(u.u_t, stanje.t);
      },
    });
    return () => ugasi?.();
  }, []);

  return <canvas ref={ref} className="sumrak-nebo" aria-hidden="true" />;
}

"use client";

import { useEffect, useRef } from "react";
import { pokreniSjencar } from "@/lib/sjencar";

/**
 * Dan nakon svitanja: prostor okupan suncem, iscrtan na grafičkoj kartici.
 * Sunce je izvan kadra, gore lijevo. Iz njega se preko sekcije spuštaju meke zrake koje se
 * polako pomiču, a u zraku lebde neoštri krugovi svjetla (odsjaji). Sve je namjerno svijetlo
 * i tiho, da tamni tekst ostane čitljiv. Rubovi sekcije ostaju u boji pijeska, pa se
 * prizor bez šava nastavlja na maglu iz svitanja iznad.
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

void main() {
  vec2 f = gl_FragCoord.xy;
  vec2 n = f / u_res;
  vec2 q = vec2(f.x, u_res.y - f.y) / u_jed;     // CSS-koordinate od vrha, 1.0 = 1000 px

  vec3 pijesak = vec3(0.945, 0.894, 0.820);
  vec3 svjetlo = vec3(1.000, 0.985, 0.930);
  // rubovi ostaju pijesak (spoj sa sekcijama iznad i ispod); sredina je toplija i tamnija,
  // jer se zrake svjetla vide tek kad oko njih ima sjene
  float sredina = smoothstep(0.0, 0.14, n.y) * smoothstep(1.0, 0.90, n.y);
  vec3 boja = mix(pijesak, vec3(0.912, 0.822, 0.676), sredina * 0.9);

  // sunce izvan kadra, gore lijevo
  vec2 sp = vec2(0.10 * u_res.x / u_jed, -0.30);
  vec2 dv = q - sp;
  float d = length(dv);
  float a = atan(dv.y, dv.x);
  vec2 kr = vec2(cos(a), sin(a));
  float zr = sum(kr * 4.0 + vec2(u_t * 0.02, 3.0)) * sum(kr * 11.0 + vec2(1.0, u_t * 0.014)) * (0.55 + 0.9 * sum(kr * 27.0 + 5.0));
  float zraka = smoothstep(0.10, 0.46, zr);
  float doseg = smoothstep(4.2, 0.2, d);
  boja = mix(boja, svjetlo, zraka * doseg * 0.82 * sredina);
  // žar sunca u kutu
  boja = mix(boja, vec3(1.0, 0.965, 0.84), exp(-d * 0.95) * 0.9 * sredina);
  // neoštri krugovi svjetla koji polako lebde
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float gustoca = 2.2 + fi * 1.5;
    vec2 g = q * gustoca + vec2(u_t * 0.012 * (fi + 1.0), -u_t * 0.02 - fi * 3.7);
    vec2 id = floor(g);
    vec2 fr = fract(g) - 0.5;
    vec2 odmak = (vec2(hash(id + 1.3 + fi), hash(id + 2.7 + fi)) - 0.5) * 0.5;
    float polumjer = 0.09 + 0.2 * hash(id + 9.1 + fi);
    float krug = smoothstep(polumjer, polumjer * 0.66, length(fr - odmak));
    float pali = step(0.74, hash(id + 5.1 + fi)) * (0.6 + 0.4 * sin(u_t * 0.6 + hash(id) * 6.28));
    boja = mix(boja, vec3(1.0, 0.975, 0.88), krug * pali * 0.55 * sredina);
  }

  boja += (hash(f) - 0.5) * 0.008;
  // dno i vrh ostaju točno boje pijeska: spojevi sa susjednim sekcijama ne smiju se vidjeti
  float visinaP = u_res.y / u_jed;
  boja = mix(boja, pijesak, smoothstep(visinaP - 0.30, visinaP - 0.04, q.y));
  boja = mix(pijesak, boja, smoothstep(0.0, 0.16, q.y));
  gl_FragColor = vec4(boja, 1.0);
}`;

export default function Dan() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const platno = ref.current;
    if (!platno) return;
    const ugasi = pokreniSjencar(platno, {
      izvor: BOJA,
      uniforme: ["u_res", "u_jed", "u_t"],
      mjerilo: (s, v) => (s * v > 3_000_000 ? 0.33 : 0.4),
      postavi: (gl, u, stanje) => {
        gl.uniform2f(u.u_res, stanje.sirina, stanje.visina);
        gl.uniform1f(u.u_jed, 1000 * stanje.mjerilo);
        gl.uniform1f(u.u_t, stanje.t);
      },
    });
    return () => ugasi?.();
  }, []);

  return <canvas ref={ref} className="dan-nebo" aria-hidden="true" />;
}

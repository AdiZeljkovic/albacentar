"use client";

import { useEffect, useRef } from "react";
import { pokreniSjencar } from "@/lib/sjencar";

/**
 * Nebo u svitanje, iscrtano na grafičkoj kartici.
 * Dok se sekcija skrola kroz ekran, sunce izlazi iza obzora: nebo prelazi iz noći u ljubičastu,
 * ružičastu i zlatnu, oblaci nad obzorom dobiju obasjane rubove, a iz sunca izlaze zrake.
 * Vrh neba uvijek ostaje noćan, pa se sekcija bez šava nastavlja na svemir iz heroja.
 */
const BOJA = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_t;
uniform float u_p;    // koliko je sunce izašlo, 0 do 1
uniform float u_obz;  // visina obzora, kao dio visine platna (od dna)

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
  vec2 n = f / u_res;
  float omjer = u_res.x / u_res.y;
  vec2 q = vec2((n.x - 0.5) * omjer, n.y);
  float h = clamp((n.y - u_obz) / (1.0 - u_obz), 0.0, 1.0);   // 0 na obzoru, 1 na vrhu
  float p = u_p;

  // nebo: od zlata na obzoru do noći u zenitu
  vec3 zenit = mix(vec3(0.043, 0.060, 0.133), vec3(0.082, 0.106, 0.268), p);
  vec3 sred  = mix(vec3(0.080, 0.078, 0.196), vec3(0.392, 0.226, 0.470), p);
  vec3 nisko = mix(vec3(0.140, 0.096, 0.214), vec3(0.930, 0.476, 0.360), p);
  vec3 obzor = mix(vec3(0.220, 0.140, 0.230), vec3(1.000, 0.740, 0.440), p);
  vec3 boja = mix(obzor, nisko, smoothstep(0.0, 0.14, h));
  boja = mix(boja, sred, smoothstep(0.08, 0.46, h));
  boja = mix(boja, zenit, smoothstep(0.36, 0.92, h));

  // sunce: žar, široki sjaj i zrake
  vec2 sp = vec2(0.0, u_obz + mix(-0.085, 0.135, p));
  vec2 dv = q - sp;
  float d = length(dv);
  float a = atan(dv.y, dv.x);
  vec2 kr = vec2(cos(a), sin(a));
  float zr = sum(kr * 2.6 + 4.0) * sum(kr * 8.0 + vec2(u_t * 0.03, 1.0)) * (0.6 + 0.8 * sum(kr * 17.0 + 2.0));
  boja += vec3(1.0, 0.70, 0.40) * exp(-d * 5.0) * 0.62 * (0.25 + 0.75 * p);
  boja += vec3(1.0, 0.52, 0.36) * exp(-d * 1.7) * 0.26 * p;
  boja += vec3(1.0, 0.82, 0.55) * pow(zr, 1.6) * exp(-d * 2.0) * 0.6 * p;

  // oblaci nad obzorom, obasjani odozdo
  vec2 c = vec2(q.x * 1.25 + u_t * 0.005, h * 6.0);
  float o1 = fbm(c * vec2(1.0, 2.6) + vec2(0.0, 3.0));
  float o2 = fbm(c * vec2(2.3, 5.2) + vec2(u_t * 0.004 + 7.0, 1.0));
  float pojas = smoothstep(0.02, 0.12, h) * (1.0 - smoothstep(0.34, 0.8, h));
  float oblak = smoothstep(0.48, 0.80, o1 * 0.62 + o2 * 0.46) * pojas;
  float obasjan = clamp(p * exp(-d * 1.5) * 1.7, 0.0, 1.0);
  vec3 oboja = mix(mix(vec3(0.10, 0.09, 0.20), vec3(0.30, 0.18, 0.36), p), vec3(1.0, 0.64, 0.44), obasjan);
  boja = mix(boja, oboja, oblak * 0.72);
  boja += vec3(1.0, 0.80, 0.52) * oblak * exp(-d * 3.0) * 0.4 * p;

  // svjetla se ne smiju prežariti u bijelo: nebo ostaje toplo
  boja = min(boja, vec3(1.0, 0.90, 0.72));

  // sunčev disk
  boja = mix(boja, vec3(1.0, 0.96, 0.84), smoothstep(0.052, 0.045, d) * (0.55 + 0.45 * p));

  // ispod obzora je zemlja u sjeni; vrh ostaje noć da se spoji sa svemirom iznad
  boja = mix(boja, vec3(0.045, 0.040, 0.085), smoothstep(u_obz, u_obz - 0.012, n.y));
  boja = mix(boja, vec3(0.043, 0.060, 0.133), smoothstep(0.84, 1.0, n.y));
  boja += (hash(f) - 0.5) * 0.012;
  gl_FragColor = vec4(boja, 1.0);
}`;

const stepen = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Zora({ sekcija, obzor }: { sekcija: string; obzor: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const platno = ref.current;
    const okvir = document.getElementById(sekcija);
    if (!platno || !okvir) return;

    const ugasi = pokreniSjencar(platno, {
      izvor: BOJA,
      uniforme: ["u_res", "u_t", "u_p", "u_obz"],
      mjerilo: (s, v) => (s * v > 2_400_000 ? 0.5 : 0.62),
      pratiSkrol: true,
      postavi: (gl, u, stanje) => {
        // --p postavlja ScrollFx: 0 kad sekcija ulazi odozdo, 1 kad izađe gore.
        const p = Number(okvir.style.getPropertyValue("--p")) || 0;
        const crta = document.getElementById(obzor)?.getBoundingClientRect();
        const visinaObzora = crta ? (stanje.okvir.bottom - crta.top) / stanje.okvir.height : 0.3;
        gl.uniform2f(u.u_res, stanje.sirina, stanje.visina);
        gl.uniform1f(u.u_t, stanje.t);
        gl.uniform1f(u.u_p, stepen(0.2, 0.66, p));
        gl.uniform1f(u.u_obz, Math.min(0.6, Math.max(0.05, visinaObzora)));
      },
    });
    return () => ugasi?.();
  }, [sekcija, obzor]);

  return <canvas ref={ref} className="zora-nebo" aria-hidden="true" />;
}

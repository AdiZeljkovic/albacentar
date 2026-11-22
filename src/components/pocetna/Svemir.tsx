"use client";

import { useEffect, useRef } from "react";
import { pokreniSjencar } from "@/lib/sjencar";

/**
 * Svemir iza heroja, iscrtan na grafičkoj kartici (WebGL):
 *  - maglice u plavim, ljubičastim i zlatnim tonovima koje se polako prelijevaju,
 *  - spiralna galaksija čija je jezgra točno iza polja konstelacije,
 *  - tri udaljene galaksije.
 * Oštre zvijezde crta zasebno platno iznad (Zvijezde), pa se ovo može računati
 * u manjoj rezoluciji i ostati lagano. Bez WebGL-a ostaje CSS podloga heroja.
 */
const VRH = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const BOJA = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;   // veličina platna u pikselima
uniform float u_jed;  // piksela platna na 1000 CSS piksela
uniform float u_t;    // vrijeme u sekundama
uniform vec2 u_c;     // središte polja (pikseli platna, ishodište dolje lijevo)
uniform float u_r;    // polumjer obruča polja
uniform vec2 u_m;     // pokazivač, -1 do 1

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
// mala, udaljena galaksija: jezgra i dva kraka, spljoštena i zakrenuta
float galaksija(vec2 p, vec2 c, float vel, float kut, float splj) {
  vec2 d = p - c; float cs = cos(kut); float sn = sin(kut);
  d = mat2(cs, -sn, sn, cs) * d; d.y *= splj;
  float r = length(d) / vel; float a = atan(d.y, d.x);
  float jezgra = exp(-r * r * 9.0);
  float krak = pow(0.5 + 0.5 * cos(a * 2.0 - log(r + 0.03) * 3.6), 3.0) * exp(-r * 2.4);
  return jezgra * 0.9 + krak * 0.65 + exp(-r * 3.2) * 0.12;
}

void main() {
  vec2 f = gl_FragCoord.xy;
  vec2 n = f / u_res;
  vec2 uv = f / u_jed;
  vec2 gp = (f - u_c) / u_r + u_m * 0.02;   // 1.0 = obruč polja
  float r = length(gp);
  float a = atan(gp.y, gp.x);

  vec3 boja = mix(vec3(0.046, 0.060, 0.130), vec3(0.080, 0.102, 0.210), n.y);

  // maglice: meki oblaci, vlakna svjetla i tamne trake prašine
  vec2 q = uv * 1.9 + u_m * 0.03 + vec2(u_t * 0.006, -u_t * 0.003);
  vec2 w = vec2(fbm(q + vec2(1.7, 9.2)), fbm(q + vec2(8.3, 2.8)));
  float n1 = fbm(q * 1.15 + 2.6 * w);
  float n2 = fbm(q * 2.4 - 1.9 * w + 4.0);
  float vlakna = 1.0 - abs(2.0 * fbm(q * 3.2 + 3.0 * w) - 1.0);
  float gust = smoothstep(0.36, 0.94, n1); gust *= gust;
  float zariste = mix(0.4, 1.0, smoothstep(3.4, 0.9, r));
  vec3 maglica = mix(vec3(0.09, 0.21, 0.60), vec3(0.33, 0.19, 0.62), smoothstep(0.3, 0.7, n2));
  maglica = mix(maglica, vec3(0.08, 0.40, 0.56), smoothstep(0.5, 0.85, fbm(q * 0.9 + 20.0)) * 0.55);
  boja += maglica * gust * (0.5 + 0.9 * pow(vlakna, 3.0)) * 0.78 * zariste;
  boja += vec3(1.0, 0.72, 0.36) * pow(vlakna, 6.0) * gust * 0.42 * zariste;
  boja *= 1.0 - 0.2 * smoothstep(0.5, 0.9, fbm(q * 1.5 + 11.0)) * (1.0 - gust);

  // spiralna galaksija iza polja: zlatna jezgra, plavi krakovi koji izlaze iza obruča
  float spirala = a * 2.0 + log(r + 0.06) * 4.4 - u_t * 0.022;
  float krak = pow(0.5 + 0.5 * cos(spirala), 2.4);
  float prasina = fbm(gp * 2.6 + vec2(sin(spirala), cos(spirala)) * 0.4);
  float disk = exp(-r * 0.8) * smoothstep(0.1, 0.5, r);
  float unutra = mix(0.26, 1.0, smoothstep(0.86, 1.06, r));
  vec3 gboja = mix(vec3(1.0, 0.82, 0.54), vec3(0.42, 0.55, 1.0), smoothstep(0.7, 2.3, r));
  boja += gboja * krak * disk * (0.35 + 0.95 * prasina) * 0.95 * unutra;
  boja += vec3(1.0, 0.84, 0.56) * (exp(-r * r * 5.0) * 0.26 + exp(-r * 1.9) * 0.1);

  // korona: polje zrači iza obruča, kao sunce u pomrčini
  float van = smoothstep(0.985, 1.07, r);
  vec2 kr = vec2(cos(a), sin(a));
  float zr = sum(kr * 2.3 + 7.0) * sum(kr * 6.5 + vec2(3.0, u_t * 0.035)) * (0.55 + 0.9 * sum(kr * 15.0 + vec2(u_t * 0.02, 2.0)));
  float korona = exp(-(r - 1.0) * 4.4) * van;
  float zrake = pow(zr, 1.7) * exp(-(r - 1.0) * 1.3) * van;
  vec3 kboja = mix(vec3(1.0, 0.90, 0.68), vec3(0.98, 0.66, 0.32), smoothstep(1.0, 1.9, r));
  boja += kboja * (korona * 0.5 + zrake * 0.82);
  // udaljene galaksije
  vec2 sp = f / u_res.y; float omjer = u_res.x / u_res.y;
  boja += vec3(0.74, 0.80, 1.0) * galaksija(sp, vec2(0.12 * omjer, 0.82), 0.085, 0.6, 2.2) * 0.5;
  boja += vec3(1.0, 0.86, 0.66) * galaksija(sp, vec2(0.91 * omjer, 0.19), 0.06, -0.9, 2.6) * 0.45;
  boja += vec3(0.82, 0.72, 1.0) * galaksija(sp, vec2(0.58 * omjer, 0.94), 0.034, 0.2, 1.8) * 0.4;

  vec2 v = n - 0.5;
  boja *= 1.0 - 0.55 * dot(v, v);
  boja += (hash(f) - 0.5) * 0.012;
  gl_FragColor = vec4(boja, 1.0);
}`;

export default function Svemir({ okvir, srediste }: { okvir: string; srediste: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const platno = ref.current;
    const hero = document.getElementById(okvir);
    if (!platno || !hero) return;

    return pokreniSjencar(platno, {
      vrh: VRH,
      izvor: BOJA,
      uniforme: ["u_res", "u_jed", "u_t", "u_c", "u_r", "u_m"],
      // Maglice su meke, pa je dovoljna manja rezolucija; na vrlo velikim ekranima još manja.
      mjerilo: (sirina, visina) => (sirina * visina > 2_400_000 ? 0.5 : 0.62),
      postavi: (gl, u, stanje) => {
        const o = stanje.okvir;
        const cilj = document.getElementById(srediste)?.getBoundingClientRect();
        const cx = cilj ? cilj.left + cilj.width / 2 - o.left : o.width * 0.72;
        const cy = cilj ? o.bottom - (cilj.top + cilj.height / 2) : o.height * 0.5;
        const polumjer = cilj ? cilj.width * 0.471 : o.height * 0.36;
        const stil = hero.style;
        gl.uniform2f(u.u_res, stanje.sirina, stanje.visina);
        gl.uniform1f(u.u_jed, 1000 * stanje.mjerilo);
        gl.uniform1f(u.u_t, stanje.t);
        gl.uniform2f(u.u_c, cx * stanje.mjerilo, cy * stanje.mjerilo);
        gl.uniform1f(u.u_r, Math.max(40, polumjer * stanje.mjerilo));
        gl.uniform2f(u.u_m, Number(stil.getPropertyValue("--mx")) || 0, -(Number(stil.getPropertyValue("--my")) || 0));
      },
    });
  }, [okvir, srediste]);

  return <canvas ref={ref} className="svemir" aria-hidden="true" />;
}

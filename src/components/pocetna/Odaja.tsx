"use client";

import { useEffect, useRef } from "react";
import { pokreniSjencar } from "@/lib/sjencar";

/**
 * Čitaonica iza vrata, noću: zid s policama punim knjiga koji obasjavaju samo plamen svijeće
 * (treperi) i snop mjesečine kroz prozor. Sve što je daleko od svijeće tone u mrak, pa tekst
 * s desne strane ostaje čitak. Vrh je iste boje kao dno sekcije iznad.
 * `svijeca` i `prozor` su id-ovi elemenata po kojima se svjetlo namješta.
 */
const BOJA = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_jed;     // piksela platna na 1000 CSS piksela
uniform float u_t;
uniform vec2 u_svijeca;  // plamen, u tisućama CSS piksela od gornjeg lijevog kuta
uniform vec4 u_prozor;   // sredina prozora (x, y) i pola širine, pola visine

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float sum(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * sum(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 3.1; a *= 0.5; }
  return v;
}

// zid s policama: redovi knjiga različitih visina i boja, poneko prazno mjesto, zlatne trake na hrptovima
vec3 police(vec2 q) {
  float ry = (q.y - 0.02) / 0.168;
  float red = floor(ry);
  float fy = fract(ry);
  float x = q.x / (0.0165 + 0.004 * hash(vec2(red, 1.0))) + hash(vec2(red, 3.0)) * 17.0;
  float ix = floor(x);
  float fx = fract(x);
  float h1 = hash(vec2(ix, red));
  float h2 = hash(vec2(ix + 31.0, red + 7.0));
  float h3 = hash(vec2(ix + 11.0, red + 3.0));
  float daska = step(0.90, fy);
  float vis = 0.50 + 0.36 * h2;
  float knjiga = step(0.90 - vis, fy) * (1.0 - daska) * step(0.07, h1);
  float rub = smoothstep(0.0, 0.16, fx) * smoothstep(1.0, 0.84, fx);
  vec3 b = mix(vec3(0.44, 0.27, 0.18), vec3(0.20, 0.25, 0.42), step(0.5, h3));
  b = mix(b, vec3(0.52, 0.44, 0.31), step(0.82, h3));
  b *= (0.55 + 0.45 * h1) * (0.32 + 0.68 * rub);
  float traka = step(0.55, h2) * smoothstep(0.022, 0.0, abs(fy - (0.90 - vis * 0.72)));
  b += vec3(0.60, 0.46, 0.22) * traka * rub;
  vec3 c = mix(vec3(0.05, 0.045, 0.06), b, knjiga);
  c = mix(c, vec3(0.30, 0.21, 0.15), daska);
  c *= 1.0 - 0.55 * smoothstep(0.13, 0.0, fy);   // sjena ispod gornje daske
  return c;
}

void main() {
  vec2 f = gl_FragCoord.xy;
  vec2 q = vec2(f.x, u_res.y - f.y) / u_jed;     // CSS-koordinate od vrha, 1.0 = 1000 px
  float W = u_res.x / u_jed;
  float H = u_res.y / u_jed;
  vec3 vrh = vec3(0.035, 0.047, 0.110);           // dno sekcije iznad (#090c1c)

  // plamen svijeće: svjetlo opada s udaljenošću i nemirno treperi
  float tr = 0.80 + 0.26 * sum(vec2(u_t * 5.0, 4.2)) + 0.05 * sin(u_t * 17.0);
  vec2 ds = (q - u_svijeca) * vec2(1.0, 1.12);
  float d = length(ds);
  float svijeca = tr / (1.0 + d * d * 24.0);

  // mjesečina: snop koji iz prozora pada koso dolje desno, s prašinom koja u njemu lebdi
  vec2 pm = q - u_prozor.xy;
  vec2 smjer = normalize(vec2(0.62, 1.0));
  float uz = dot(pm, smjer);
  float pop = dot(pm, vec2(-smjer.y, smjer.x));
  float snop = smoothstep(u_prozor.z * 1.25, u_prozor.z * 0.15, abs(pop)) * smoothstep(-0.04, 0.22, uz) * exp(-max(uz, 0.0) * 1.5);
  snop *= 0.65 + 0.35 * fbm(vec2(pop * 12.0, uz * 2.0 - u_t * 0.03));

  vec3 svjetlo = vec3(0.060, 0.070, 0.115) + vec3(1.0, 0.60, 0.28) * svijeca * 1.35 + vec3(0.40, 0.50, 0.95) * snop * 0.55;
  vec3 boja = police(q) * svjetlo + vec3(0.014, 0.018, 0.042);

  // svjetlo u zraku: žar oko plamena i vidljiv snop mjesečine
  boja += vec3(1.0, 0.55, 0.22) * tr * exp(-d * 6.5) * 0.17;
  boja += vec3(0.45, 0.55, 1.0) * snop * 0.045;
  vec2 g = vec2(q.x + u_t * 0.003, q.y - u_t * 0.004) * 70.0;
  vec2 id = floor(g);
  float prah = smoothstep(0.93, 1.0, hash(id)) * smoothstep(0.2, 0.0, length(fract(g) - 0.5 + (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.6));
  boja += vec3(0.75, 0.82, 1.0) * prah * snop * 0.8 + vec3(1.0, 0.80, 0.50) * prah * svijeca * 0.5;

  // rubovi tonu u mrak; vrh i dno stapaju se sa susjednim sekcijama
  boja *= 1.0 - 0.45 * smoothstep(0.30, 0.60, abs(q.x / W - 0.5));
  boja = mix(vrh, boja, smoothstep(0.0, 0.16, q.y));
  boja = mix(boja, vec3(0.030, 0.038, 0.085), smoothstep(H - 0.20, H, q.y));
  boja += (hash(f) - 0.5) * 0.008;
  gl_FragColor = vec4(boja, 1.0);
}`;

export default function Odaja({ svijeca, prozor }: { svijeca: string; prozor: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const platno = ref.current;
    if (!platno) return;
    const ugasi = pokreniSjencar(platno, {
      izvor: BOJA,
      uniforme: ["u_res", "u_jed", "u_t", "u_svijeca", "u_prozor"],
      mjerilo: (s, v) => (s * v > 3_000_000 ? 0.45 : 0.6),
      postavi: (gl, u, stanje) => {
        gl.uniform2f(u.u_res, stanje.sirina, stanje.visina);
        gl.uniform1f(u.u_jed, 1000 * stanje.mjerilo);
        gl.uniform1f(u.u_t, stanje.t);
        const o = stanje.okvir;
        const s = document.getElementById(svijeca)?.getBoundingClientRect();
        const p = document.getElementById(prozor)?.getBoundingClientRect();
        if (s) gl.uniform2f(u.u_svijeca, (s.left + s.width / 2 - o.left) / 1000, (s.top + s.height / 2 - o.top) / 1000);
        else gl.uniform2f(u.u_svijeca, 0.3, 0.5);
        if (p) gl.uniform4f(u.u_prozor, (p.left + p.width / 2 - o.left) / 1000, (p.top + p.height / 2 - o.top) / 1000, p.width / 2000, p.height / 2000);
        else gl.uniform4f(u.u_prozor, 0.2, 0.3, 0.12, 0.18);
      },
    });
    return () => ugasi?.();
  }, [svijeca, prozor]);

  return <canvas ref={ref} className="odaja-zid" aria-hidden="true" />;
}

/**
 * Mali pogon za pozadine iscrtane na grafičkoj kartici (WebGL, jedan fragment shader preko cijelog platna).
 * Brine o svemu dosadnom: prevođenje sjenčara, veličina platna, crtanje samo dok je platno u ekranu,
 * 30 sličica u sekundi, „manje pokreta" i gubitak konteksta. Pozivatelj samo postavlja uniforme.
 *
 * Prevođenje sjenčara je najskuplji dio (na Windowsu i preko sekunde za složeniji sjenčar), pa se
 * nikad ne radi dok se stranica učitava: počinje tek kad se platno približi ekranu i teče u pozadini
 * (KHR_parallel_shader_compile), bez zaustavljanja glavne niti. Dok nije gotovo, vidi se CSS podloga
 * sekcije; platno dobije data-radi i pretopi se preko nje kad je prva sličica spremna.
 *
 * Pripreme svih platna na stranici idu jedna po jedna, tek kad je grafički proces spreman (lib/gpu.ts)
 * i u slobodnim trenucima: stvaranje WebGL konteksta čeka grafički proces, pa ne smije stati pred prvo iscrtavanje.
 */
import { kadGpuSpreman } from "./gpu";

export type StanjeSjencara = {
  /** Vrijeme u sekundama od pokretanja. */
  t: number;
  /** Veličina platna u pikselima i omjer prema CSS pikselima. */
  sirina: number;
  visina: number;
  mjerilo: number;
  /** Položaj platna u prozoru. */
  okvir: DOMRect;
};

type Opcije = {
  izvor: string;
  /** Sjenčar vrhova; zadan je jedan trokut preko cijelog platna. */
  vrh?: string;
  uniforme: string[];
  /** Omjer rezolucije platna prema CSS pikselima; meke pozadine ne trebaju punu rezoluciju. */
  mjerilo?: (sirina: number, visina: number) => number;
  postavi: (gl: WebGLRenderingContext, u: Record<string, WebGLUniformLocation | null>, stanje: StanjeSjencara) => void;
  /** Koliko puta u sekundi se pozadina iscrtava (zadano 30). Pozadine koje se sporo mijenjaju ne trebaju više od 20. */
  fps?: number;
  /** Crtaj i na skrol (za pozadine vezane uz skrol) kad je uključeno „manje pokreta". */
  pratiSkrol?: boolean;
};

const VRH = "attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }";
/** Koliko prije ulaska u ekran počinje priprema (u visinama prozora). */
const BLIZINA = "120% 0px";

/** Red priprema: jedna po jedna, nakon učitavanja stranice, svaka u slobodnom trenutku. */
const red: Array<(gotovo: () => void) => void> = [];
let zauzeto = false;
const sljedeci = () => {
  if (zauzeto) return;
  const posao = red.shift();
  if (!posao) return;
  zauzeto = true;
  const radi = () =>
    posao(() => {
      zauzeto = false;
      sljedeci();
    });
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(radi, { timeout: 700 });
  else window.setTimeout(radi, 80);
};
const uRed = (posao: (gotovo: () => void) => void) => {
  red.push(posao);
  void kadGpuSpreman().then(() => window.setTimeout(sljedeci, 60));
};

/** Pokreće sjenčar na platnu. Vraća funkciju za gašenje. Bez WebGL-a platno ostaje prazno i vidi se CSS podloga. */
export function pokreniSjencar(platno: HTMLCanvasElement, opcije: Opcije): () => void {
  const mirno = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let gl: WebGLRenderingContext | null = null;
  let u: Record<string, WebGLUniformLocation | null> = {};
  let mjerilo = 0.6;
  let raf = 0;
  let cekanje = 0;
  let vidljivo = false;
  let zadnje = 0;
  let uPripremi = false;
  let ugaseno = false;
  const pocetak = performance.now();
  /** najmanji razmak između dva crtanja, s malo zraka da se ne preskoči sličica zaslona */
  const razmak = 1000 / (opcije.fps ?? 30) - 3;

  const velicina = () => {
    if (!gl) return;
    const o = platno.getBoundingClientRect();
    mjerilo = opcije.mjerilo ? opcije.mjerilo(o.width, o.height) : 0.6;
    platno.width = Math.max(2, Math.round(o.width * mjerilo));
    platno.height = Math.max(2, Math.round(o.height * mjerilo));
    gl.viewport(0, 0, platno.width, platno.height);
  };

  const crtaj = (sada: number) => {
    if (!gl) return;
    opcije.postavi(gl, u, {
      t: mirno ? 40 : (sada - pocetak) / 1000 + 40,
      sirina: platno.width,
      visina: platno.height,
      mjerilo,
      okvir: platno.getBoundingClientRect(),
    });
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const petlja = (sada: number) => {
    raf = 0;
    if (!vidljivo) return;
    if (sada - zadnje > razmak) {
      zadnje = sada;
      crtaj(sada);
    }
    if (!mirno) raf = requestAnimationFrame(petlja);
  };
  const kreni = () => {
    if (!raf && vidljivo && gl) raf = requestAnimationFrame(petlja);
  };

  /** Prevodi sjenčar bez čekanja na glavnoj niti i javlja kad je program spreman. */
  const pripremi = (gotovo: () => void) => {
    if (uPripremi || gl || ugaseno) return gotovo();
    const kontekst = platno.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!kontekst) return gotovo();
    uPripremi = true;
    const usporedno = kontekst.getExtension("KHR_parallel_shader_compile");

    const prevedi = () => {
      const v = kontekst.createShader(kontekst.VERTEX_SHADER);
      const f = kontekst.createShader(kontekst.FRAGMENT_SHADER);
      const program = kontekst.createProgram();
      if (!v || !f || !program) {
        uPripremi = false;
        return gotovo();
      }
      kontekst.shaderSource(v, opcije.vrh ?? VRH);
      kontekst.shaderSource(f, opcije.izvor);
      kontekst.compileShader(v);
      kontekst.compileShader(f);
      kontekst.attachShader(program, v);
      kontekst.attachShader(program, f);
      kontekst.linkProgram(program);

      const zavrsi = () => {
        uPripremi = false;
        gotovo();
        if (ugaseno) return;
        if (!kontekst.getProgramParameter(program, kontekst.LINK_STATUS)) {
          console.warn("[sjencar]", kontekst.getShaderInfoLog(f) || kontekst.getProgramInfoLog(program));
          return;
        }
        kontekst.useProgram(program);
        kontekst.bindBuffer(kontekst.ARRAY_BUFFER, kontekst.createBuffer());
        kontekst.bufferData(kontekst.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), kontekst.STATIC_DRAW);
        const mjesto = kontekst.getAttribLocation(program, "p");
        kontekst.enableVertexAttribArray(mjesto);
        kontekst.vertexAttribPointer(mjesto, 2, kontekst.FLOAT, false, 0, 0);
        u = Object.fromEntries(opcije.uniforme.map((ime) => [ime, kontekst.getUniformLocation(program, ime)]));
        gl = kontekst;
        velicina();
        // prva sličica odmah, da se platno pretopi već nacrtano
        crtaj(performance.now());
        zadnje = 0;
        platno.dataset.radi = "1";
        kreni();
      };

      if (!usporedno) return zavrsi();
      const provjeri = () => {
        cekanje = 0;
        if (ugaseno) return gotovo();
        if (kontekst.getProgramParameter(program, usporedno.COMPLETION_STATUS_KHR)) zavrsi();
        else cekanje = window.setTimeout(provjeri, 40);
      };
      provjeri();
    };

    prevedi();
  };

  const naVelicinu = new ResizeObserver(() => {
    if (!gl) return;
    velicina();
    zadnje = 0;
    kreni();
  });
  naVelicinu.observe(platno);

  const naBlizu = new IntersectionObserver(
    ([unos]) => {
      if (!unos.isIntersecting) return;
      naBlizu.disconnect();
      uRed(pripremi);
    },
    { rootMargin: BLIZINA },
  );
  naBlizu.observe(platno);

  const naEkranu = new IntersectionObserver(([unos]) => {
    vidljivo = unos.isIntersecting;
    if (vidljivo) kreni();
    else {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  naEkranu.observe(platno);

  const naSkrol = () => {
    zadnje = 0;
    kreni();
  };
  if (mirno && opcije.pratiSkrol) window.addEventListener("scroll", naSkrol, { passive: true });

  const izgubljen = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    raf = 0;
    gl = null;
  };
  const vracen = () => uRed(pripremi);
  platno.addEventListener("webglcontextlost", izgubljen);
  platno.addEventListener("webglcontextrestored", vracen);

  return () => {
    ugaseno = true;
    cancelAnimationFrame(raf);
    clearTimeout(cekanje);
    naVelicinu.disconnect();
    naBlizu.disconnect();
    naEkranu.disconnect();
    window.removeEventListener("scroll", naSkrol);
    platno.removeEventListener("webglcontextlost", izgubljen);
    platno.removeEventListener("webglcontextrestored", vracen);
  };
}

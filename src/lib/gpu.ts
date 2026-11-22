/**
 * Kada je grafički proces preglednika spreman za platna (WebGL i ubrzani 2D canvas).
 *
 * Stvaranje prvog grafičkog konteksta na stranici čeka grafički proces, a taj je neposredno nakon
 * učitavanja zauzet prvim iscrtavanjem stranice (u tek pokrenutom pregledniku i dulje od sekunde).
 * Kad bi ga platno zatražilo odmah, to bi čekanje zaustavilo glavnu nit usred prvog prikaza.
 * Zato se grafički proces najprije „probudi" iz pozadinske niti: ondje se stvori i isprazni mali
 * WebGL kontekst, a platna na stranici počinju tek kad se on javi. U već zagrijanom pregledniku
 * to traje nekoliko desetaka milisekundi.
 */
let ucitano: Promise<void> | null = null;
const kadSeUcita = () =>
  (ucitano ??= new Promise<void>((rijesi) => {
    if (document.readyState === "complete") rijesi();
    else window.addEventListener("load", () => rijesi(), { once: true });
  }));

let spreman: Promise<void> | null = null;

export function kadGpuSpreman(): Promise<void> {
  return (spreman ??= kadSeUcita().then(
    () =>
      new Promise<void>((rijesi) => {
        try {
          if (typeof OffscreenCanvas === "undefined" || typeof Worker === "undefined") return rijesi();
          const kod =
            "try{var c=new OffscreenCanvas(2,2),g=c.getContext('webgl');if(g){g.clearColor(0,0,0,1);g.clear(g.COLOR_BUFFER_BIT);g.finish()}}catch(e){}postMessage(1)";
          const adresa = URL.createObjectURL(new Blob([kod], { type: "text/javascript" }));
          const nit = new Worker(adresa);
          let gotovo = false;
          const kraj = () => {
            if (gotovo) return;
            gotovo = true;
            nit.terminate();
            URL.revokeObjectURL(adresa);
            rijesi();
          };
          nit.onmessage = kraj;
          nit.onerror = kraj;
          // osigurač: ako se nit ne javi, platna svejedno kreću
          window.setTimeout(kraj, 4000);
        } catch {
          rijesi();
        }
      }),
  ));
}

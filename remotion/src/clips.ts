// ── Config de la tanda WPC Tandil ───────────────────────────────────────────
// Para sumar un clip nuevo de Flow: copiá el mp4 a remotion/public/ y agregá
// una entrada acá. No hay que tocar ningún otro archivo.
//
// durationInSeconds = largo del clip de Flow (Veo = 8s). fps 24 = el de Veo.
export type ClipCfg = {
  id: string;          // id de la composición -> `npx remotion render <id>`
  src: string;         // archivo en remotion/public/
  kicker: string;      // línea chica de arriba del caption
  headline: string;    // caption grande (usar \n para cortar)
  seconds?: number;    // default 8
  caption?: boolean;   // default true — false = solo logo + placa final
};

// Tanda 2 sep 2026 (Veo 3.1, voz Locutor WPC, ingrediente real-svg). 8 anuncios.
export const CLIPS: ClipCfg[] = [
  {
    id: 'wpc-1',              // galería hormigón + sierras, atardecer — 8/10
    src: 'clip-1.mp4',
    kicker: 'Deck WPC · Tandil',
    headline: 'Ponelo una vez.\nOlvidate para siempre.',
    seconds: 8,
  },
  {
    id: 'wpc-2',              // antes/después macro (tabla vieja gris vs nueva) — 6/10
    src: 'clip-2.mp4',
    kicker: 'Más de 25 años',
    headline: 'La madera se astilla.\nEste se ve siempre nuevo.',
    seconds: 8,
  },
  {
    id: 'wpc-3',              // rooftop atardecer + lens flare — 9/10, el mejor
    src: 'clip-3.mp4',
    kicker: 'Plata bien puesta',
    headline: 'Invertís una vez.\nDura más de 25 años.',
    seconds: 10,
  },
  {
    id: 'wpc-4',              // deck amplio hormigón + sierras atardecer — 8/10
    src: 'clip-4.mp4',
    kicker: 'Resiste la sierra',
    headline: 'Humedad, sol y heladas.\nNi se inmuta.',
    seconds: 10,
  },
  {
    id: 'wpc-5',              // 2 personas de espaldas con mate — 7/10
    src: 'clip-5.mp4',
    kicker: 'Cero mantenimiento',
    headline: 'El finde es para disfrutar.\nNo para lijar.',
    seconds: 10,
  },
  {
    id: 'wpc-6',              // deck lateral + reposeras, sol pleno — 7/10
    src: 'clip-6.mp4',
    kicker: 'Presupuesto sin cargo',
    headline: 'Medición y presupuesto.\nAcá en Tandil.',
    seconds: 10,
  },
  {
    id: 'wpc-7',              // instalador colocando tabla sobre rastreles — 8/10
    src: 'clip-7.mp4',
    kicker: 'Instalación en Tandil',
    headline: 'Te lo dejamos listo.\nY no lo tocás más.',
    seconds: 10,
  },
  {
    id: 'wpc-8',              // galería mañana, veta marcada — 8/10
    src: 'clip-8.mp4',
    kicker: 'Deck · Wall Panel · Perfilería',
    headline: 'El deck que no\nvas a mantener nunca.',
    seconds: 8,
  },
];

export const FPS = 24;
export const ENDCARD_SECONDS = 3;

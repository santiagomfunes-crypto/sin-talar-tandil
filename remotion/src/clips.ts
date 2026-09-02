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

export const CLIPS: ClipCfg[] = [
  {
    id: 'wpc-1',
    src: 'clip-1.mp4',
    kicker: 'Deck WPC · Tandil',
    headline: 'Ponelo una vez.\nOlvidate para siempre.',
    seconds: 10,
  },
  {
    id: 'wpc-2',
    src: 'clip-2.mp4',
    kicker: 'Más de 25 años',
    headline: 'La madera se astilla.\nEste se ve siempre nuevo.',
  },
  {
    id: 'wpc-3',
    src: 'clip-3.mp4',
    kicker: 'Cero mantenimiento',
    headline: 'Ni lijar, ni barnizar,\nni volver a hacerlo.',
  },
  {
    id: 'wpc-7',
    src: 'clip-7.mp4',
    kicker: 'Instalación en Tandil',
    headline: 'Te lo dejamos listo.\nY no lo tocás más.',
  },
];

export const FPS = 24;
export const ENDCARD_SECONDS = 3;

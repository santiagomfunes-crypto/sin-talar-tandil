import React from 'react';
import {Composition} from 'remotion';
import {ClipAd} from './ClipAd';
import {CLIPS, FPS, ENDCARD_SECONDS} from './clips';

// Solo las composiciones WPC Tandil. Las viejas (Ad1/Ad2/Reel/Explainer) usan la
// marca anterior "Sin Talar" y quedaron des-registradas a propósito: el fabricante
// es Sin Talar, la marca de Santi es WPC Tandil.
export const RemotionRoot: React.FC = () => (
  <>
    {CLIPS.map((c) => (
      <Composition
        key={c.id}
        id={c.id}
        component={ClipAd}
        defaultProps={c}
        durationInFrames={Math.round(((c.seconds ?? 8) + ENDCARD_SECONDS) * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
    ))}
  </>
);

import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, spring, Sequence,
} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {ClipCfg, ENDCARD_SECONDS} from './clips';

const {fontFamily: serif} = loadCormorant();
const {fontFamily: sans} = loadInter();

// Identidad WPC Tandil (misma paleta que index.html)
const GREEN = '#2f5133';
const GREEN_HI = '#35593a';   // viñeta suave, ±6% del verde de marca (más y lee embarrado)
const GREEN_LO = '#2b4c2f';
const GREEN_INK = '#1b2f1e';
const GREEN_SOFT = '#bcd3b6';
const CREAM = '#f4f1e6';      // el ÚNICO claro del sistema: logo, titulares, chips y botón

// Zonas seguras de Reels (sobre 1920): la UI de IG/FB tapa ~180px arriba y ~420px abajo.
const SAFE_TOP = 275;
const SAFE_BOTTOM = 560;

// ── Marca de agua: logo crema arriba, con scrim para que no flote desnudo ───
const BrandTop: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: SAFE_TOP}}>
      <Img
        src={staticFile('logo-wpc-cream.png')}
        style={{width: 330, opacity: op, filter: 'drop-shadow(0 4px 22px rgba(0,0,0,.55))'}}
      />
    </AbsoluteFill>
  );
};

// ── Caption inferior: arriba de la zona que come la UI de Reels ─────────────
const Caption: React.FC<{kicker: string; headline: string; vidFrames: number}> = ({
  kicker, headline, vidFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - fps, fps, config: {damping: 200}});
  const y = interpolate(s, [0, 1], [46, 0]);
  const outStart = vidFrames - fps * 1.4;   // se va justo antes de la placa, sin hueco mudo
  const op = interpolate(
    frame,
    [fps * 0.4, fps * 1.0, outStart, outStart + fps * 0.8],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', padding: `0 76px ${SAFE_BOTTOM}px`}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 980, opacity: op,
        background: 'linear-gradient(to top,' +
          'rgba(12,20,13,.62) 0%,rgba(12,20,13,.76) 30%,rgba(12,20,13,.88) 56%,' +
          'rgba(12,20,13,.72) 76%,rgba(12,20,13,.30) 90%,rgba(12,20,13,0) 100%)'}} />
      <div style={{transform: `translateY(${y}px)`, opacity: op, position: 'relative'}}>
        <div style={{fontFamily: sans, color: GREEN_SOFT, fontWeight: 700, fontSize: 36, letterSpacing: 6,
          textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16,
          textShadow: '0 2px 12px rgba(0,0,0,.85)'}}>
          <span style={{width: 48, height: 3, background: GREEN_SOFT}} />{kicker}
        </div>
        <div style={{fontFamily: serif, color: CREAM, fontWeight: 700, fontSize: 78, lineHeight: 1.12,
          maxWidth: 800, whiteSpace: 'pre-line', textShadow: '0 6px 40px rgba(0,0,0,.75)'}}>{headline}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Placa final verde WPC ───────────────────────────────────────────────────
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const pulse = 1 + 0.035 * Math.sin(frame / 5);
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(130% 90% at 50% 32%, ${GREEN_HI} 0%, ${GREEN} 55%, ${GREEN_LO} 100%)`,
      justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: fadeIn}}>
      {/* Centro óptico: la UI de Reels come arriba y abajo, así que el bloque sube. */}
      <div style={{transform: `translateY(${interpolate(s, [0, 1], [38, -30], {extrapolateRight: 'clamp'})}px) scale(1.08)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Img src={staticFile('logo-wpc-cream.png')} style={{width: 620}} />
        <div style={{fontFamily: serif, color: CREAM, fontSize: 44, letterSpacing: 3,
          fontWeight: 600, marginTop: 45}}>
          Deck · Wall Panel · Perfilería
        </div>
        <div style={{display: 'flex', gap: 32, justifyContent: 'center', marginTop: 54}}>
          {['Cero mantenimiento', '+25 años'].map((c) => (
            <div key={c} style={{fontFamily: sans, border: `2px solid ${GREEN_SOFT}`, color: CREAM,
              borderRadius: 100, padding: '16px 34px', fontSize: 28, fontWeight: 500,
              letterSpacing: 1.5, textTransform: 'uppercase'}}>{c}</div>
          ))}
        </div>
        <div style={{fontFamily: sans, background: CREAM, color: GREEN_INK, fontWeight: 800, fontSize: 38,
          padding: '28px 62px', borderRadius: 100, marginTop: 56, transform: `scale(${pulse})`}}>
          Pedí tu presupuesto
        </div>
        <div style={{fontFamily: sans, color: CREAM, opacity: .92, fontSize: 30, marginTop: 28}}>
          WhatsApp · Tandil
        </div>
        <div style={{fontFamily: sans, color: CREAM, opacity: .92, fontSize: 30, marginTop: 12, letterSpacing: 2}}>
          @wpc.tandil
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ClipAd: React.FC<ClipCfg> = ({src, kicker, headline, seconds = 8, caption = true}) => {
  const {fps} = useVideoConfig();
  const vid = Math.round(seconds * fps);
  return (
    <AbsoluteFill style={{backgroundColor: GREEN_INK}}>
      <Sequence durationInFrames={vid}>
        {/* Se mantiene el audio del clip (la VO de Flow); fade-out al final. */}
        <OffthreadVideo
          src={staticFile(src)}
          volume={(f) => interpolate(f, [vid - fps * 0.6, vid], [1, 0], {extrapolateLeft: 'clamp'})}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
        {/* Scrim superior: el logo tiene que leerse contra cualquier cosa que traiga el video. */}
        <AbsoluteFill style={{background:
          'linear-gradient(180deg,rgba(12,20,13,.40) 0%,rgba(12,20,13,.22) 18%,rgba(12,20,13,.06) 27%,rgba(12,20,13,0) 34%)'}} />
        <BrandTop />
        {caption ? <Caption kicker={kicker} headline={headline} vidFrames={vid} /> : null}
      </Sequence>
      <Sequence from={vid} durationInFrames={Math.round(ENDCARD_SECONDS * fps)}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

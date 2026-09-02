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
const GREEN_D = '#1b2f1e';
const GREEN_L = '#6f9a6d';
const CREAM = '#f4f1e6';

// ── Marca de agua: logo crema arriba, sobre un scrim suave ──────────────────
const BrandTop: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 14], [0, 0.94], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 64}}>
      <Img
        src={staticFile('logo-wpc-cream.png')}
        style={{width: 330, opacity: op, filter: 'drop-shadow(0 4px 22px rgba(0,0,0,.75))'}}
      />
    </AbsoluteFill>
  );
};

// ── Caption inferior: entra ~1s, sale ~1s antes de que termine el clip ──────
const Caption: React.FC<{kicker: string; headline: string; vidFrames: number}> = ({
  kicker, headline, vidFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - fps, fps, config: {damping: 200}});
  const y = interpolate(s, [0, 1], [46, 0]);
  const outStart = vidFrames - fps * 1.2;
  const op = interpolate(
    frame,
    [fps * 0.9, fps * 1.5, outStart, outStart + fps * 0.5],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 76px 210px'}}>
      <AbsoluteFill style={{opacity: op, background:
        'linear-gradient(0deg,rgba(12,20,13,.92) 0%,rgba(12,20,13,.62) 24%,rgba(12,20,13,0) 50%)'}} />
      <div style={{transform: `translateY(${y}px)`, opacity: op, position: 'relative'}}>
        <div style={{fontFamily: sans, color: '#b9d6b3', fontWeight: 700, fontSize: 27, letterSpacing: 6,
          textTransform: 'uppercase', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14,
          textShadow: '0 2px 12px rgba(0,0,0,.85)'}}>
          <span style={{width: 44, height: 3, background: '#b9d6b3'}} />{kicker}
        </div>
        <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: 82, lineHeight: 1.04,
          whiteSpace: 'pre-line', textShadow: '0 6px 40px rgba(0,0,0,.75)'}}>{headline}</div>
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
      background: `radial-gradient(120% 80% at 50% 22%, ${GREEN}, ${GREEN_D})`,
      justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: fadeIn}}>
      <div style={{transform: `translateY(${interpolate(s, [0, 1], [38, 0])}px)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Img src={staticFile('logo-wpc-cream.png')} style={{width: 620}} />
        <div style={{fontFamily: sans, color: '#bcd3b6', fontSize: 32, letterSpacing: 2, marginTop: 4}}>
          Deck · Wall Panel · Perfilería
        </div>
        <div style={{display: 'flex', gap: 18, justifyContent: 'center', marginTop: 52}}>
          {['Cero mantenimiento', '+25 años'].map((c) => (
            <div key={c} style={{fontFamily: sans, border: `1.5px solid ${GREEN_L}`, color: CREAM,
              borderRadius: 100, padding: '15px 32px', fontSize: 24, fontWeight: 500,
              letterSpacing: 1.5, textTransform: 'uppercase'}}>{c}</div>
          ))}
        </div>
        <div style={{fontFamily: sans, background: CREAM, color: GREEN_D, fontWeight: 800, fontSize: 38,
          padding: '28px 62px', borderRadius: 100, marginTop: 60, transform: `scale(${pulse})`}}>
          Pedí tu presupuesto
        </div>
        <div style={{fontFamily: sans, color: '#bcd3b6', fontSize: 30, marginTop: 28}}>
          WhatsApp · Tandil
        </div>
        <div style={{fontFamily: sans, color: '#8fae8b', fontSize: 26, marginTop: 10, letterSpacing: 2}}>
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
    <AbsoluteFill style={{backgroundColor: GREEN_D}}>
      <Sequence durationInFrames={vid}>
        {/* Se mantiene el audio del clip (la VO de Flow); fade-out al final. */}
        <OffthreadVideo
          src={staticFile(src)}
          volume={(f) => interpolate(f, [vid - fps * 0.6, vid], [1, 0], {extrapolateLeft: 'clamp'})}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
        <AbsoluteFill style={{background:
          'linear-gradient(180deg,rgba(12,20,13,.55) 0%,rgba(12,20,13,.14) 14%,rgba(12,20,13,0) 28%)'}} />
        <BrandTop />
        {caption ? <Caption kicker={kicker} headline={headline} vidFrames={vid} /> : null}
      </Sequence>
      <Sequence from={vid} durationInFrames={Math.round(ENDCARD_SECONDS * fps)}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

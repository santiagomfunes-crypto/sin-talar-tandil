import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, spring, Sequence,
} from 'remotion';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

const {fontFamily: serif} = loadCormorant();
const {fontFamily: sans} = loadInter();
const AMBER = '#e0a45f';
const DARK = '#0c0a08';

// clip Veo = 8s. Composición 30fps -> video 240 frames, endcard 96 -> total 336
const VID = 240;

const BrandTop: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', top: 58, height: 0}}>
    <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: 42, letterSpacing: 1,
      textShadow: '0 2px 20px rgba(0,0,0,.8)'}}>Sin Talar<span style={{color: AMBER}}>®</span> · Tandil</div>
  </AbsoluteFill>
);

// caption lower-third: entra a ~0.8s, se va a ~5s (deja respirar el final)
const HeroCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 24, fps, config: {damping: 200}});
  const y = interpolate(s, [0, 1], [50, 0]);
  const op = interpolate(frame, [24, 40, 140, 165], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 70px 170px'}}>
      {/* scrim inferior que aparece/desaparece con el caption */}
      <AbsoluteFill style={{opacity: op, background: 'linear-gradient(0deg,rgba(8,6,4,.9) 0%,rgba(8,6,4,.6) 22%,rgba(8,6,4,0) 46%)'}} />
      <div style={{transform: `translateY(${y}px)`, opacity: op, position: 'relative'}}>
        <div style={{fontFamily: sans, color: '#f4d3a6', fontWeight: 700, fontSize: 28, letterSpacing: 6,
          textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14,
          textShadow: '0 2px 12px rgba(0,0,0,.8)'}}>
          <span style={{width: 42, height: 3, background: '#f4d3a6'}} />Instalación en Tandil
        </div>
        <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: 86, lineHeight: 1.02,
          textShadow: '0 6px 40px rgba(0,0,0,.7)'}}>Te lo dejamos listo.<br/>Cero mantenimiento después.</div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const pulse = 1 + 0.04 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 25%, #241c14, ${DARK})`,
      justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: fadeIn}}>
      <div style={{transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`}}>
        <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: 128}}>Sin Talar<span style={{color: AMBER, fontSize: 64, verticalAlign: 'super'}}>®</span></div>
        <div style={{fontFamily: sans, color: '#cbb89f', fontSize: 34, marginTop: 2}}>Deck · Wall Panel · Perfilería</div>
        <div style={{display: 'flex', gap: 18, justifyContent: 'center', marginTop: 46}}>
          {['Cero mantenimiento', 'Resiste la sierra'].map((c) => (
            <div key={c} style={{fontFamily: sans, border: `1.5px solid ${AMBER}77`, color: '#efe0cd',
              borderRadius: 100, padding: '15px 30px', fontSize: 24, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase'}}>{c}</div>
          ))}
        </div>
        <div style={{fontFamily: sans, background: AMBER, color: '#2a1a0c', fontWeight: 800, fontSize: 38,
          padding: '28px 60px', borderRadius: 100, marginTop: 58, display: 'inline-block', transform: `scale(${pulse})`}}>
          Pedí tu presupuesto</div>
        <div style={{fontFamily: sans, color: '#cbb89f', fontSize: 30, marginTop: 26}}>WhatsApp · Tandil</div>
      </div>
    </AbsoluteFill>
  );
};

export const Ad2: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: DARK}}>
      <Sequence durationInFrames={VID}>
        <OffthreadVideo src={staticFile('clip-3.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(8,6,4,.5) 0%,rgba(8,6,4,.12) 12%,rgba(8,6,4,0) 24%)'}} />
        <BrandTop />
        <HeroCaption />
      </Sequence>
      <Sequence from={VID}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

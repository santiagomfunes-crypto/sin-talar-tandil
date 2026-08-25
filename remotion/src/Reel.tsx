import React from 'react';
import {
  AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, spring, Sequence,
} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

const {fontFamily: serif} = loadCormorant();
const {fontFamily: sans} = loadInter();

const AMBER = '#e0a45f';
const DARK = '#0c0a08';

// Foto con Ken Burns (zoom + pan sutil) y degradado para el texto
const Photo: React.FC<{src: string; dir?: number}> = ({src, dir = 1}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.14, 1.0]);
  const x = interpolate(frame, [0, durationInFrames], [0, 22 * dir]);
  return (
    <AbsoluteFill style={{backgroundColor: DARK, overflow: 'hidden'}}>
      <Img
        src={staticFile(src)}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${x}px)`}}
      />
      <AbsoluteFill style={{background:
        'linear-gradient(180deg,rgba(8,6,4,.74) 0%,rgba(8,6,4,.16) 13%,rgba(8,6,4,.05) 30%,rgba(8,6,4,.10) 50%,rgba(8,6,4,.84) 82%,rgba(8,6,4,.96) 100%)'}} />
    </AbsoluteFill>
  );
};

// Caption animado (kicker + titular serif) que sube con spring
const Caption: React.FC<{kicker: string; title: React.ReactNode}> = ({kicker, title}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  const y = interpolate(s, [0, 1], [60, 0]);
  const op = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 70px 150px'}}>
      <div style={{transform: `translateY(${y}px)`, opacity: op}}>
        <div style={{fontFamily: sans, color: AMBER, fontWeight: 700, fontSize: 30, letterSpacing: 6,
          textTransform: 'uppercase', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16}}>
          <span style={{width: 44, height: 3, background: AMBER, display: 'inline-block'}} />{kicker}
        </div>
        <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: 96, lineHeight: 1.02,
          textShadow: '0 6px 40px rgba(0,0,0,.6)', maxWidth: 900}}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const Em: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{fontStyle: 'italic', color: AMBER}}>{children}</span>
);

const BrandTop: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', top: 60, height: 0}}>
    <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: 40, letterSpacing: 1,
      textShadow: '0 2px 18px rgba(0,0,0,.7)'}}>Sin Talar<span style={{color: AMBER}}>®</span> · Tandil</div>
  </AbsoluteFill>
);

// Intro y cierre de marca
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 30%, #241c14, ${DARK})`,
      justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <BrandTop />
      <div style={{opacity: interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'}),
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`}}>
        <div style={{fontFamily: sans, color: AMBER, fontWeight: 700, fontSize: 28, letterSpacing: 8,
          textTransform: 'uppercase', marginBottom: 22}}>Deck WPC · Tandil</div>
        <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: 118, lineHeight: 1.0}}>
          La madera<br/>que <Em>no se tala</Em>.</div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  const pulse = 1 + 0.04 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 25%, #241c14, ${DARK})`,
      justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 0}}>
      <div style={{transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp'})}}>
        <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: 130}}>Sin Talar<span style={{color: AMBER}}>®</span></div>
        <div style={{fontFamily: sans, color: '#cbb89f', fontSize: 36, marginTop: 4}}>Deck · Wall Panel · Perfilería</div>
        <div style={{display: 'flex', gap: 18, justifyContent: 'center', marginTop: 50}}>
          {['Sin talar un árbol', 'Cero mantenimiento'].map((c) => (
            <div key={c} style={{fontFamily: sans, border: `1.5px solid ${AMBER}77`, color: '#efe0cd',
              borderRadius: 100, padding: '15px 30px', fontSize: 24, fontWeight: 500, letterSpacing: 1.5,
              textTransform: 'uppercase'}}>{c}</div>
          ))}
        </div>
        <div style={{fontFamily: sans, background: AMBER, color: '#2a1a0c', fontWeight: 800, fontSize: 38,
          padding: '28px 60px', borderRadius: 100, marginTop: 60, display: 'inline-block', transform: `scale(${pulse})`}}>
          Pedí tu presupuesto</div>
        <div style={{fontFamily: sans, color: '#cbb89f', fontSize: 30, marginTop: 28}}>WhatsApp · Tandil</div>
      </div>
    </AbsoluteFill>
  );
};

const T = linearTiming({durationInFrames: 15});

export const Reel: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: DARK}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={75}><Intro /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={90}>
          <Photo src="life-deck.jpg" dir={1} /><BrandTop /><Caption kicker="Sin talar" title={<>La calidez de la madera, <Em>sin talar</Em>.</>} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={90}>
          <Photo src="life-pool.jpg" dir={-1} /><BrandTop /><Caption kicker="Cero mantenimiento" title={<>Ni <Em>lijar</Em>, ni barnizar. Nunca.</>} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={90}>
          <Photo src="life-facade.jpg" dir={1} /><BrandTop /><Caption kicker="Resiste la sierra" title={<>El clima de Tandil <Em>no lo toca</Em>.</>} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={90}>
          <Photo src="life-wall.jpg" dir={-1} /><BrandTop /><Caption kicker="Estética premium" title={<>Transformá tu ambiente <Em>en un finde</Em>.</>} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={105}><EndCard /></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

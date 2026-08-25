import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, useVideoConfig,
  interpolate, spring,
} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

const {fontFamily: serif} = loadCormorant();
const {fontFamily: sans} = loadInter();
const AMBER = '#e0a45f';
const DARK = '#0c0a08';

const VideoBg: React.FC<{src: string; scrim?: number}> = ({src, scrim = 0.55}) => (
  <AbsoluteFill style={{backgroundColor: DARK}}>
    <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(8,6,4,${scrim}) 0%,rgba(8,6,4,.2) 30%,rgba(8,6,4,.35) 55%,rgba(8,6,4,${scrim + .3}) 100%)`}} />
  </AbsoluteFill>
);
const PhotoBg: React.FC<{src: string; scrim?: number}> = ({src, scrim = 0.6}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1]);
  return (
    <AbsoluteFill style={{backgroundColor: DARK}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(8,6,4,${scrim}) 0%,rgba(8,6,4,.25) 32%,rgba(8,6,4,.35) 55%,rgba(8,6,4,${scrim + .3}) 100%)`}} />
    </AbsoluteFill>
  );
};

const BrandTop: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', top: 56, height: 0}}>
    <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: 38, letterSpacing: 1, textShadow: '0 2px 18px rgba(0,0,0,.8)'}}>
      Sin Talar<span style={{color: AMBER}}>®</span> · Tandil</div>
  </AbsoluteFill>
);

const Kick: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: sans, color: '#f4d3a6', fontWeight: 700, fontSize: 26, letterSpacing: 5,
    textTransform: 'uppercase', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14, textShadow: '0 2px 12px rgba(0,0,0,.8)'}}>
    <span style={{width: 40, height: 3, background: '#f4d3a6'}} />{children}</div>
);
const Title: React.FC<{size?: number; children: React.ReactNode}> = ({size = 90, children}) => (
  <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: size, lineHeight: 1.03, textShadow: '0 6px 40px rgba(0,0,0,.75)'}}>{children}</div>
);
const Em: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{fontStyle: 'italic', color: AMBER}}>{children}</span>;

const Rise: React.FC<{delay?: number; children: React.ReactNode}> = ({delay = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 200}});
  return <div style={{transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [delay, delay + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{children}</div>;
};

// listas de ventajas/desventajas con check/cross que aparecen una por una
const ListItem: React.FC<{ok: boolean; delay: number; children: React.ReactNode}> = ({ok, delay, children}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [delay, delay + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = interpolate(frame, [delay, delay + 12], [-24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{display: 'flex', alignItems: 'flex-start', gap: 18, opacity: op, transform: `translateX(${x}px)`, marginBottom: 22}}>
      <div style={{flex: '0 0 auto', width: 46, height: 46, borderRadius: 12, background: ok ? 'rgba(63,140,90,.9)' : 'rgba(178,59,59,.9)',
        color: '#fff', fontSize: 26, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4}}>{ok ? '✓' : '✕'}</div>
      <div style={{fontFamily: sans, color: '#fff', fontSize: 38, fontWeight: 600, lineHeight: 1.15, textShadow: '0 2px 14px rgba(0,0,0,.8)'}}>{children}</div>
    </div>
  );
};

const Section: React.FC<{children: React.ReactNode; bottom?: boolean}> = ({children, bottom}) => (
  <AbsoluteFill style={{justifyContent: bottom ? 'flex-end' : 'center', padding: bottom ? '0 66px 150px' : '0 66px'}}>{children}</AbsoluteFill>
);

const T = linearTiming({durationInFrames: 15});

export const Explainer: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: DARK}}>
      <TransitionSeries>
        {/* HOOK */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <VideoBg src="clip-1.mp4" scrim={0.5} />
          <BrandTop />
          <Section bottom>
            <Rise><Kick>Deck WPC · Tandil</Kick></Rise>
            <Rise delay={10}><Title>¿Un deck que <Em>no se mantiene</Em> nunca?</Title></Rise>
            <Rise delay={22}><div style={{fontFamily: sans, color: '#e9dcc9', fontSize: 34, marginTop: 18, textShadow: '0 2px 14px rgba(0,0,0,.8)'}}>Te explico qué es el WPC — con la verdad.</div></Rise>
          </Section>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />

        {/* QUÉ ES */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <PhotoBg src="life-wall.jpg" scrim={0.62} />
          <BrandTop />
          <Section>
            <Rise><Kick>Qué es</Kick></Rise>
            <Rise delay={10}><Title size={80}>Madera reciclada<br/>+ plástico recuperado.</Title></Rise>
            <Rise delay={24}><div style={{fontFamily: sans, color: '#e9dcc9', fontSize: 36, marginTop: 22, textShadow: '0 2px 14px rgba(0,0,0,.8)'}}>La calidez de la madera, <Em>sin talar</Em> un árbol.</div></Rise>
          </Section>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />

        {/* VENTAJAS */}
        <TransitionSeries.Sequence durationInFrames={270}>
          <VideoBg src="clip-3.mp4" scrim={0.55} />
          <BrandTop />
          <Section>
            <Rise><Kick>Ventajas</Kick></Rise>
            <div style={{marginTop: 20}}>
              <ListItem ok delay={20}>Cero mantenimiento: ni lija ni barniz</ListItem>
              <ListItem ok delay={60}>No se pudre ni le entran termitas</ListItem>
              <ListItem ok delay={100}>Aguanta humedad, sol y heladas de la sierra</ListItem>
              <ListItem ok delay={140}>+25 años de vida útil</ListItem>
            </div>
          </Section>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />

        {/* DESVENTAJAS (honestas) */}
        <TransitionSeries.Sequence durationInFrames={270}>
          <PhotoBg src="life-facade.jpg" scrim={0.72} />
          <BrandTop />
          <Section>
            <Rise><Kick>Seamos honestos</Kick></Rise>
            <div style={{marginTop: 20}}>
              <ListItem ok={false} delay={20}>Sale más que la madera común</ListItem>
              <ListItem ok={false} delay={64}>En tonos oscuros y pleno sol, se calienta</ListItem>
              <ListItem ok={false} delay={108}>Necesita una instalación prolija</ListItem>
            </div>
            <Rise delay={165}><div style={{fontFamily: sans, color: '#e9dcc9', fontSize: 32, marginTop: 20, textShadow: '0 2px 14px rgba(0,0,0,.8)'}}>…pero nada de eso te va a hacer perder los findes lijando.</div></Rise>
          </Section>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />

        {/* CIERRE / CTA */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 25%, #241c14, ${DARK})`, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
            <Rise><Title size={78}>No gastás un peso<br/>en mantenimiento. <Em>Nunca.</Em></Title></Rise>
            <Rise delay={18}><div style={{fontFamily: sans, color: '#cbb89f', fontSize: 34, marginTop: 24}}>Bien instalado, dura décadas.</div></Rise>
            <Rise delay={34}>
              <div style={{fontFamily: sans, background: AMBER, color: '#2a1a0c', fontWeight: 800, fontSize: 40, padding: '28px 60px', borderRadius: 100, marginTop: 54, display: 'inline-block'}}>Pedí tu presupuesto</div>
              <div style={{fontFamily: serif, color: '#fff', fontWeight: 700, fontSize: 44, marginTop: 40}}>Sin Talar<span style={{color: AMBER}}>®</span> · Tandil</div>
            </Rise>
          </AbsoluteFill>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

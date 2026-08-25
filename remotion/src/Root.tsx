import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {Ad1} from './Ad1';
import {Ad2} from './Ad2';
import {Explainer} from './Explainer';
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="reel" component={Reel} durationInFrames={465} fps={30} width={1080} height={1920} />
    <Composition id="ad1" component={Ad1} durationInFrames={336} fps={30} width={1080} height={1920} />
    <Composition id="ad2" component={Ad2} durationInFrames={336} fps={30} width={1080} height={1920} />
    <Composition id="explainer" component={Explainer} durationInFrames={930} fps={30} width={1080} height={1920} />
  </>
);

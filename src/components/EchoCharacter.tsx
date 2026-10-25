import React from 'react';
import { JarvisHologram, JarvisHologramProps } from './JarvisHologram';
import { JarvisState } from '../types';

export type EchoState = JarvisState;

export interface EchoCharacterProps extends JarvisHologramProps {}

/**
 * EchoCharacter forwards directly to JarvisHologram.
 */
export const EchoCharacter: React.FC<EchoCharacterProps> = (props) => {
  return <JarvisHologram {...props} />;
};

export default EchoCharacter;

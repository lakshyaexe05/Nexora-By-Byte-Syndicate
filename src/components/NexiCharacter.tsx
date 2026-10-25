import React from 'react';
import { JarvisHologram } from './JarvisHologram';
import { JarvisState } from '../types';

export type EchoState = JarvisState;

export interface NexiCharacterProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | number;
  state?: JarvisState;
  audioLevel?: number;
  interactiveGaze?: boolean;
  interactiveParallax?: boolean;
  className?: string;
  onClick?: () => void;
  showStatusBadge?: boolean;
}

/**
 * Backward compatibility wrapper.
 * Renders the living orange-gold JARVIS Hologram intelligence.
 */
export const NexiCharacter: React.FC<NexiCharacterProps> = ({
  size = 'hero',
  state = 'idle',
  audioLevel = 0,
  interactiveGaze = true,
  interactiveParallax = true,
  className = '',
  onClick,
  showStatusBadge = false,
}) => {
  return (
    <JarvisHologram
      size={size}
      state={state}
      audioLevel={audioLevel}
      interactiveParallax={interactiveParallax ?? interactiveGaze}
      className={className}
      onClick={onClick}
      showStatusBadge={showStatusBadge}
    />
  );
};

export default NexiCharacter;

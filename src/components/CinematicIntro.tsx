import React, { useEffect, useState, useRef } from 'react';

interface CinematicIntroProps {
  onComplete?: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'arrival' | 'emergence' | 'sweep' | 'reveal' | 'finished'>('idle');
  const [shouldRender, setShouldRender] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate triggers in React StrictMode
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check localStorage safely
    let hasSeenIntro = false;
    try {
      hasSeenIntro = localStorage.getItem('nexora_intro_completed') === 'true';
    } catch {
      hasSeenIntro = false;
    }

    if (hasSeenIntro) {
      if (onComplete) onComplete();
      return;
    }

    if (prefersReducedMotion) {
      try {
        localStorage.setItem('nexora_intro_completed', 'true');
      } catch {
        // Ignore storage errors
      }
      if (onComplete) onComplete();
      return;
    }

    // Start Cinematic Intro Sequence (Target ~2.5s total)
    setShouldRender(true);
    setPhase('arrival');

    // Phase 1 -> Phase 2: Logo emergence (0.4s to 1.2s)
    const t1 = setTimeout(() => {
      setPhase('emergence');
    }, 400);

    // Phase 2 -> Phase 3: Electric-lime light sweep (1.2s to 1.8s)
    const t2 = setTimeout(() => {
      setPhase('sweep');
    }, 1200);

    // Phase 3 -> Phase 4: Website reveal (1.8s to 2.5s)
    const t3 = setTimeout(() => {
      setPhase('reveal');
      try {
        localStorage.setItem('nexora_intro_completed', 'true');
      } catch {
        // Storage might be restricted
      }
    }, 1800);

    // Sequence finished at 2.5s
    const t4 = setTimeout(() => {
      setPhase('finished');
      setShouldRender(false);
      if (onComplete) onComplete();
    }, 2500);

    // Safety failsafe: never leave user stuck on blank screen
    const failsafe = setTimeout(() => {
      setPhase('finished');
      setShouldRender(false);
      if (onComplete) onComplete();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(failsafe);
    };
  }, [onComplete]);

  if (!shouldRender || phase === 'finished') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-700 select-none ${
        phase === 'reveal'
          ? 'opacity-0 pointer-events-none scale-[1.03]'
          : 'opacity-100 bg-[#050B08]'
      }`}
      style={{
        backgroundColor: phase === 'reveal' ? 'transparent' : '#050B08',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      aria-hidden="true"
    >
      {/* Diffused green ambient glow behind the wordmark */}
      <div
        className={`absolute w-[440px] h-[440px] sm:w-[580px] sm:h-[580px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          phase === 'arrival'
            ? 'opacity-40 scale-75 bg-[#B6FF00]/15'
            : phase === 'emergence' || phase === 'sweep'
            ? 'opacity-80 scale-100 bg-[#B6FF00]/25'
            : 'opacity-0 scale-125 bg-[#B6FF00]/10'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />

      {/* Center Wordmark Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Large, bold, uppercase electric-lime typography (#B6FF00) */}
        <div
          className={`relative transition-all duration-800 ${
            phase === 'arrival'
              ? 'opacity-0 scale-[0.96]'
              : phase === 'emergence'
              ? 'opacity-100 scale-100'
              : phase === 'sweep'
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-[1.04]'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight font-display text-[#B6FF00] drop-shadow-[0_0_40px_rgba(182,255,0,0.45)] select-none block"
            style={{
              letterSpacing: '-0.025em',
            }}
          >
            NEXORA
          </span>

          {/* Phase 3: Narrow, elegant light sweep traveling left to right */}
          <div
            className={`absolute inset-0 pointer-events-none overflow-hidden ${
              phase === 'sweep' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className={`w-full h-full ${phase === 'sweep' ? 'animate-light-sweep' : ''}`}
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 45%, rgba(182,255,0,0.95) 55%, transparent 100%)',
                mixBlendMode: 'overlay',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

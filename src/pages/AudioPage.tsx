import React, { useState, useEffect } from 'react';
import { 
  Headphones, Volume2, VolumeX, Play, Pause, RotateCcw, 
  Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart, Radio, Flame
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AmbientSoundType } from '../types';

import { MotionReveal } from '../components/MotionReveal';

export const AudioPage: React.FC = () => {
  const { 
    activeSound, 
    handleToggleSound, 
    tasks, 
    setActiveFocusTask 
  } = useAppContext();

  // Timer states
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // minutes
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Breathing pacer state
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  // Breathing 4-4-4-4 pacer cycle (16s total)
  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick = (tick + 1) % 16;
      if (tick < 4) setBreathPhase('Inhale');
      else if (tick < 8) setBreathPhase('Hold');
      else if (tick < 12) setBreathPhase('Exhale');
      else setBreathPhase('Rest');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const resetTimer = (mins: number) => {
    setSelectedDuration(mins);
    setSecondsRemaining(mins * 60);
    setIsTimerRunning(false);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const soundscapes: { type: AmbientSoundType; title: string; subtitle: string; tag: string }[] = [
    {
      type: 'cosmos',
      title: 'Cosmic Drift Drone',
      subtitle: 'Low-frequency sawtooth & triangle sub-harmonics for steady cognitive insulation.',
      tag: 'Ambient Deep Focus',
    },
    {
      type: 'binaural',
      title: 'Alpha Wave Binaural Beats',
      subtitle: '200Hz left / 210Hz right differential producing a 10Hz calming alpha synchrony.',
      tag: 'Neural Coherence',
    },
    {
      type: 'whitenoise',
      title: 'Atmospheric Stellar Noise',
      subtitle: 'Gently lowpass-filtered noise spectrum blocking background conversations and chatter.',
      tag: 'Acoustic Masking',
    },
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#06080D] relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#38BDF8]/08 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#B4F000]/08 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <MotionReveal delay={80}>
          <div className="max-w-3xl space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-mono font-medium">
              <Headphones className="w-3.5 h-3.5" />
              <span>NEURAL AUDIO & IMMERSION</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.05]">
              Procedural Soundscapes <br />
              <span className="text-[#38BDF8]">For Deep Cognitive Flow.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              Synthesized live in your browser using the Web Audio API. Zero streaming bandwidth, zero compression artifacts, pure uninterrupted mental shielding.
            </p>
          </div>
        </MotionReveal>

        {/* Section 1: Soundscape Selection Cards */}
        <MotionReveal delay={120}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {soundscapes.map((s) => {
              const isActive = activeSound === s.type;

              return (
                <div
                  key={s.type}
                  onClick={() => handleToggleSound(isActive ? 'none' : s.type)}
                  className={`p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 card-hover-depth interactive-tap ${
                    isActive
                      ? 'bg-[#0E1626] border-[#38BDF8] shadow-[0_0_30px_rgba(56,189,248,0.2)] scale-[1.02]'
                      : 'bg-[#090D16] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-[#38BDF8]">
                        {s.tag}
                      </span>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-[#38BDF8] text-black shadow-md' : 'bg-white/5 text-slate-400'
                      }`}>
                        {isActive ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white font-display">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {s.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className={`text-xs font-mono font-semibold ${isActive ? 'text-[#38BDF8]' : 'text-slate-400'}`}>
                      {isActive ? '● PLAYING NOW' : 'Click to Activate'}
                    </span>
                    {isActive && (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-[#38BDF8] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-5 bg-[#38BDF8] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-2 bg-[#38BDF8] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </MotionReveal>

        {/* Section 2: Timer & Breathing Sync Console */}
        <MotionReveal delay={160}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Focus Timer */}
            <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-[#090D16] border border-white/10 flex flex-col justify-between space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Target Work Sprint
                  </span>
                  <h3 className="text-2xl font-bold text-white font-display mt-0.5">
                    Deep Flow Chronometer
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {[15, 25, 50].map((d) => (
                    <button
                      key={d}
                      onClick={() => resetTimer(d)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer interactive-tap ${
                        selectedDuration === d
                          ? 'bg-[#B4F000] text-black font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Huge Digital Clock Display */}
              <div className="text-center py-6">
                <div className="text-6xl sm:text-8xl font-black font-display tracking-tight text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.15)]">
                  {formattedTime}
                </div>
                <p className="text-xs font-mono text-slate-400 mt-2">
                  {isTimerRunning ? 'Sprint Active · Neural shielding engaged' : 'Paused · Ready for launch'}
                </p>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-8 py-3.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 cursor-pointer interactive-tap active:scale-[0.98] ${
                    isTimerRunning
                      ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                      : 'bg-[#B4F000] text-black shadow-[0_0_20px_rgba(180,240,0,0.35)]'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isTimerRunning ? 'Pause Sprint' : 'Commence Flow'}</span>
                </button>

                <button
                  onClick={() => resetTimer(selectedDuration)}
                  className="p-3.5 rounded-full border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-colors cursor-pointer interactive-tap active:scale-[0.95]"
                  title="Reset Chronometer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Box Breathing Pacer */}
            <div className="lg:col-span-5 p-8 sm:p-12 rounded-3xl bg-[#090D16] border border-white/10 flex flex-col justify-between items-center text-center space-y-6">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Vagus Nerve Reset
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-0.5">
                  Box Breathing 4-4-4-4
                </h3>
              </div>

              {/* Visual Expanding Breathing Orb */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <div 
                  className={`absolute inset-0 rounded-full border border-[#38BDF8]/40 transition-all duration-1000 ease-in-out ${
                    breathPhase === 'Inhale' 
                      ? 'scale-110 bg-[#38BDF8]/20 shadow-[0_0_40px_rgba(56,189,248,0.3)]' 
                      : breathPhase === 'Hold' 
                      ? 'scale-110 bg-[#B4F000]/15 shadow-[0_0_40px_rgba(180,240,0,0.25)]' 
                      : breathPhase === 'Exhale'
                      ? 'scale-75 bg-slate-800/40'
                      : 'scale-75 bg-transparent'
                  }`}
                />
                <div className="relative z-10 text-center">
                  <div className="text-xl font-bold text-white font-display">
                    {breathPhase}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">
                    4s Cadence
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Inhale deeply for 4s, hold with fullness for 4s, exhale completely for 4s, rest empty for 4s.
              </p>
            </div>

          </div>
        </MotionReveal>

        {/* Section 3: Task Focus Launcher Strip */}
        <MotionReveal delay={200}>
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C1220] to-[#0A101C] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 card-hover-depth">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-display">
                Attach a Workspace Task to this Session
              </h3>
              <p className="text-xs text-slate-300">
                Open the full-screen ambient focus portal with checklist tracking for your active priority.
              </p>
            </div>

            <button
              onClick={() => {
                const pending = tasks.find(t => t.status !== 'completed') || tasks[0];
                if (pending) setActiveFocusTask(pending);
              }}
              className="px-6 py-3.5 rounded-full bg-[#B4F000] hover:bg-[#c6ff1a] text-black font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(180,240,0,0.35)] whitespace-nowrap cursor-pointer interactive-tap active:scale-[0.98]"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>Launch Ambient Focus Portal</span>
            </button>
          </div>
        </MotionReveal>

      </div>
    </div>
  );
};

import React from 'react';
import { ArrowRight, Play, Compass, Calendar, RefreshCw } from 'lucide-react';
import { CinematicPortal } from './CinematicPortal';

interface HeroSectionProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onWatchDemo,
}) => {
  return (
    <section id="hero" className="relative min-h-[92vh] pt-28 pb-16 flex items-center overflow-hidden bg-[#06080D]">
      {/* Background Starfield and Atmospheric Nebulae */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-[#38BDF8]/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-1/3 right-1/3 w-[450px] h-[450px] bg-[#B4F000]/10 rounded-full blur-[160px] mix-blend-screen" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-indigo-950/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: 45% width for Bold Editorial Typography & Value Proposition */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:pr-6 z-20">
            
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[0.95] text-white font-display text-balance">
                MAKE<br />
                <span className="text-white">EVERYDAY</span><br />
                <span className="text-[#B4F000] drop-shadow-[0_0_35px_rgba(180,240,0,0.4)]">
                  BETTER.
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-lg font-normal leading-relaxed text-balance animate-in fade-in slide-in-from-bottom-3 duration-600 delay-100">
              Turn overwhelming tasks into clear, personalised plans with the power of AI. Realistic scheduling that adapts to your time, energy, and priorities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
              <button
                onClick={onGetStarted}
                className="group px-7 py-3.5 text-sm sm:text-base font-semibold text-black bg-[#B4F000] hover:bg-[#c6ff1a] rounded-full transition-all duration-200 flex items-center gap-2 shadow-[0_0_25px_rgba(180,240,0,0.4)] hover:shadow-[0_0_35px_rgba(180,240,0,0.65)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer interactive-tap"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onWatchDemo}
                className="px-6 py-3.5 text-sm sm:text-base font-medium text-white hover:text-[#B4F000] border border-white/15 hover:border-[#B4F000]/50 rounded-full transition-all duration-200 flex items-center gap-2 bg-white/[0.03] backdrop-blur-sm active:scale-[0.98] cursor-pointer interactive-tap"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5 text-[#B4F000]" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Social Trust: Student & Professional Avatar Proof */}
            <div className="pt-4 flex items-center gap-4 border-t border-white/[0.08]">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full ring-2 ring-[#06080D] bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  AK
                </div>
                <div className="w-9 h-9 rounded-full ring-2 ring-[#06080D] bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  SL
                </div>
                <div className="w-9 h-9 rounded-full ring-2 ring-[#06080D] bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  MR
                </div>
              </div>
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Designed for </span>
                students, professionals and everyday planners.
              </div>
            </div>

            {/* Tagline */}
            <div className="text-[11px] font-mono tracking-widest uppercase text-slate-500">
              Your mind. Your universe.
            </div>
          </div>

          {/* Right Column: 55% width for Monumental Cinematic Sci-Fi Portal Scene */}
          <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end">
            
            {/* Interactive Vertical Pillar Indicators */}
            <div className="hidden xl:flex flex-col gap-6 absolute right-0 top-1/2 -translate-y-1/2 z-30 text-[10px] font-mono tracking-widest text-slate-400 border-l border-white/10 pl-3">
              <a href="#how-it-works" className="hover:text-[#B4F000] transition-colors flex items-center gap-2">
                <Compass className="w-3 h-3" />
                <span>DISCOVER</span>
              </a>
              <a href="#workspace" className="hover:text-[#B4F000] transition-colors flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>PLAN</span>
              </a>
              <a href="#features" className="hover:text-[#B4F000] transition-colors flex items-center gap-2">
                <RefreshCw className="w-3 h-3" />
                <span>ADAPT</span>
              </a>
            </div>

            {/* Dedicated Cinematic Portal Environment */}
            <CinematicPortal className="w-full" />

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-14 flex justify-center">
          <a
            href="#problem"
            className="flex flex-col items-center gap-2 text-xs font-mono tracking-widest text-slate-500 hover:text-white transition-colors cursor-pointer group"
          >
            <span>SCROLL</span>
            <div className="w-5 h-8 rounded-full border border-slate-700 flex justify-center pt-1.5 group-hover:border-[#B4F000] transition-colors">
              <div className="w-1 h-2 rounded-full bg-[#B4F000] animate-bounce" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

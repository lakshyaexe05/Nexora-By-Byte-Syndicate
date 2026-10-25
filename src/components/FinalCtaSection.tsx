import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

interface FinalCtaSectionProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onGetStarted, onWatchDemo }) => {
  return (
    <section className="py-24 bg-[#06080D] relative overflow-hidden border-t border-white/[0.08]">
      
      {/* Background Portal Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-[#B4F000]/10 blur-[180px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0E1424] via-[#090D17] to-[#06080D] border border-white/15 p-8 sm:p-14 overflow-hidden shadow-2xl text-center">
          
          {/* Subtle Glowing Stargate Ring Silhouette */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-30 pointer-events-none hidden md:block">
            <svg viewBox="0 0 200 200" className="w-full h-full text-[#B4F000]/20">
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" fill="none" />
              <circle cx="100" cy="100" r="75" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
              <circle cx="100" cy="100" r="60" stroke="#B4F000" strokeWidth="1" strokeDasharray="12 12" fill="none" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B4F000]/10 border border-[#B4F000]/25 text-[#B4F000] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>REIMAGINE EVERYDAY LIFE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-display text-balance">
              Your next chapter<br />
              <span className="text-[#B4F000]">starts here.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-balance">
              Make everyday life simpler, clearer and more meaningful with NEXORA. Transform chaos into confidence today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="px-8 py-3.5 text-sm sm:text-base font-semibold text-black bg-[#B4F000] hover:bg-[#c6ff1a] rounded-full transition-all duration-200 flex items-center gap-2 shadow-[0_0_30px_rgba(180,240,0,0.4)] hover:shadow-[0_0_40px_rgba(180,240,0,0.65)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer interactive-tap"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onWatchDemo}
                className="px-6 py-3.5 text-sm sm:text-base font-medium text-white hover:text-[#B4F000] border border-white/15 hover:border-[#B4F000]/50 rounded-full transition-all duration-200 flex items-center gap-2 bg-white/[0.04] backdrop-blur-sm active:scale-[0.98] cursor-pointer interactive-tap"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5 text-[#B4F000]" />
                </div>
                <span>Watch Product Tour</span>
              </button>
            </div>

            {/* Brand Signature */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white font-display tracking-tight">NEXORA</span>
                <span className="text-[10px] text-slate-400 font-mono">by BYTE SYNDICATE</span>
              </div>
              <span className="font-mono tracking-widest text-slate-400 font-semibold">
                BUILD BEYOND LIMITS.
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

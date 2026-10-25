import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JarvisHologram } from './JarvisHologram';
import { MessageSquare, Sparkles, X, ArrowRight, Zap, Clock, Radio } from 'lucide-react';

export const EchoCompanion: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Hidden on the dedicated /chat flagship page
  if (location.pathname === '/chat') {
    return null;
  }

  const handleLaunchChat = (initialPrompt?: string) => {
    setIsOpen(false);
    if (initialPrompt) {
      navigate('/chat', { state: { initialPrompt } });
    } else {
      navigate('/chat');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Quick Interactive Mini-Panel (Opens on click if not directly navigating) */}
      {isOpen && (
        <div className="mb-3 w-80 rounded-2xl bg-[#090D16]/95 border border-white/15 backdrop-blur-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.7)] animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#FFA726] animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide font-mono">
                JARVIS · HOLOGRAPHIC AI
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Companion Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-slate-300">
            <p className="font-medium text-white mb-1">“Good day. What shall we organize?”</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Tell me your priorities, available hours, or what changed in your schedule today.
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => handleLaunchChat('Plan my remaining hours for maximum focus')}
              className="w-full text-left px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-amber-400/30 text-xs text-slate-200 flex items-center justify-between group transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Plan my remaining hours</span>
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </button>

            <button
              onClick={() => handleLaunchChat("I'm running 30 minutes late, rebalance my tasks")}
              className="w-full text-left px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-orange-400/30 text-xs text-slate-200 flex items-center justify-between group transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>I'm running late...</span>
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-orange-400 transition-colors" />
            </button>

            <button
              onClick={() => handleLaunchChat()}
              className="w-full mt-2 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,167,38,0.3)] cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open JARVIS NEXUS</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating 3D Character Button & Tooltip */}
      <div className="relative group">
        {/* Hover Speech Pill */}
        {!isOpen && (
          <div
            className={`absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-xl bg-[#0D121F]/90 border border-amber-500/30 backdrop-blur-md text-[11px] font-medium text-amber-200 whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none flex items-center gap-1.5 ${
              hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Talk to JARVIS</span>
          </div>
        )}

        {/* 3D Hologram Anchor Container */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative rounded-3xl p-1 bg-[#0A0D15]/90 backdrop-blur-md border border-white/15 hover:border-amber-400/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)] cursor-pointer overflow-hidden"
        >
          <JarvisHologram
            size={88}
            state={isOpen ? 'listening' : hovered ? 'listening' : 'idle'}
            interactiveParallax={true}
            onClick={() => setIsOpen(!isOpen)}
          />
          <span className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#06080D] shadow-[0_0_8px_#FFA726]" />
        </div>
      </div>
    </div>
  );
};

export default EchoCompanion;

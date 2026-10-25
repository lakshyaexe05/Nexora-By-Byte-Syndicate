import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, RefreshCw, Brain, Headphones, BarChart3, Cloud, 
  ArrowRight, Check, Zap, Clock, ShieldCheck, Compass, Sliders
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MotionReveal } from '../components/MotionReveal';

export const FeaturesPage: React.FC = () => {
  const { 
    setIsSmartRescheduleOpen, 
    tasks, 
    setActiveFocusTask, 
    handleToggleSound,
    activeSound 
  } = useAppContext();

  const handleLaunchFocus = () => {
    const target = tasks.find(t => t.status !== 'completed') || tasks[0];
    if (target) setActiveFocusTask(target);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#06080D] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-[#38BDF8]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-[#B4F000]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <MotionReveal delay={100}>
          <div className="max-w-3xl space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRODUCT CAPABILITIES</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.05]">
              Engineered For Focus. <br />
              <span className="text-[#B4F000]">Powered By NEXUS.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              Every feature in NEXORA is purpose-built to eliminate cognitive drag, shield your deep work windows, and keep your daily schedule resilient to reality.
            </p>
          </div>
        </MotionReveal>

        {/* 6 Feature Pillars Bento Grid */}
        <MotionReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          
          {/* Feature 1: Natural Language Planning */}
          <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/10 hover:border-[#B4F000]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#B4F000]/15 border border-[#B4F000]/30 flex items-center justify-center text-[#B4F000] group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Natural-Language Synthesis
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Type scattered thoughts or speak your messy daily commitments in freeform prose. NEXUS parses deadlines, energy curves, and durations into structured, executable steps.
              </p>
            </div>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#B4F000] hover:underline"
            >
              <span>Explore in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2: Smart Reschedule */}
          <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/10 hover:border-sky-400/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Adaptive Smart Reschedule
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Running behind? Tell NEXUS your remaining minutes. It instantly triages tasks: retaining high-value work, compressing buffer times, and deferring non-urgents safely.
              </p>
            </div>
            <button
              onClick={() => setIsSmartRescheduleOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:underline cursor-pointer"
            >
              <span>Launch Reschedule Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 3: Energy-Aware Prioritization */}
          <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/10 hover:border-indigo-400/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Energy & Circadian Matching
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Never assign complex code reviews or theorem practice to your 3:00 PM energy slump. Tasks are tagged with energy requirements and sequenced to match biological rhythms.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Bio-Cognitive Alignment</span>
            </div>
          </div>

          {/* Feature 4: Neural Soundscapes & Focus */}
          <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/10 hover:border-[#B4F000]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#B4F000]/15 border border-[#B4F000]/30 flex items-center justify-center text-[#B4F000] group-hover:scale-110 transition-transform">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Generative Neural Audio
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Procedurally synthesized in the browser via Web Audio API. Zero external audio downloads. Choose Alpha wave binaural beats, cosmic drones, or calibrated noise to block distractions.
              </p>
            </div>
            <Link
              to="/audio"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#B4F000] hover:underline"
            >
              <span>Explore Audio Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 5: Telemetry & Progress Insights */}
          <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/10 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Real-Time Telemetry
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Track completion velocity, time investment across categories (Study, Work, Health, Personal), and remaining minutes without feeling judged. Pure objective clarity.
              </p>
            </div>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:underline"
            >
              <span>View Live Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 6: Real Firestore Cloud Persistence */}
          <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/10 hover:border-emerald-400/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Cloud Sync & Local Backup
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Instant one-click Google Sign-In with Firebase Firestore data sync across desktop, tablet, and mobile. Works seamlessly in offline guest mode with zero tracking.
              </p>
            </div>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:underline"
            >
              <span>Account & Sync Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        </MotionReveal>

        {/* Interactive Feature Demo Strip */}
        <MotionReveal delay={300}>
          <div className="p-8 sm:p-12 rounded-3xl bg-[#090D16] border border-white/15 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 max-w-xl text-center lg:text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B4F000]">
                Immediate Action
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Ready to take control of your day?
              </h3>
              <p className="text-sm text-slate-300">
                Jump straight into your workspace to formulate and execute your master plan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/workspace"
                className="px-6 py-3.5 rounded-full bg-[#B4F000] hover:bg-[#c6ff1a] text-black font-semibold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(180,240,0,0.35)] hover:shadow-[0_0_28px_rgba(180,240,0,0.55)] hover:-translate-y-0.5"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </MotionReveal>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, Brain, Clock, Zap, ArrowRight, ShieldAlert, 
  Flame, BatteryCharging, CheckCircle, RefreshCw, Sparkles 
} from 'lucide-react';
import { MotionReveal } from '../components/MotionReveal';

export const ProblemPage: React.FC = () => {
  const [taskCount, setTaskCount] = useState<number>(12);
  const [interruptions, setInterruptions] = useState<number>(4);

  // Compute cognitive friction score
  const traditionalFriction = Math.min(100, Math.round(taskCount * 5.5 + interruptions * 9));
  const nexusFriction = Math.min(100, Math.round(traditionalFriction * 0.28));

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#06080D] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#38BDF8]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Breadcrumb & Eyebrow */}
        <MotionReveal delay={100}>
          <div className="max-w-3xl space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-mono font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>THE COGNITIVE OVERLOAD CRISIS</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.05]">
              Why Modern Productivity Tools <br />
              <span className="text-rose-400">Fail Human Minds.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              Every day begins with high intentions. By noon, unpredictable delays, competing priorities, and rigid to-do lists turn that optimism into cognitive burnout.
            </p>
          </div>
        </MotionReveal>

        {/* The 3 Fatal Flaws of Traditional Systems */}
        <MotionReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/10 hover:border-rose-500/40 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-display">
                1. The Static Time Trap
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Standard calendars expect life to run like clockwork. A single 20-minute delayed meeting or transit stall shatters the entire day's schedule, leaving you feeling instantly behind.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/10 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-display">
                2. Decision Paralysis
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                A list of 25 unchecked items doesn't tell you what matters right now. You spend precious mental bandwidth deciding what to do next rather than actually executing.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/10 hover:border-sky-500/40 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-display">
                3. Energy Blindness
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Human energy is not uniform across a 14-hour wake cycle. Forcing complex analytical work during biological slumps causes slow execution, frustration, and procrastination.
              </p>
            </div>
          </div>
        </MotionReveal>

        {/* Interactive Cognitive Friction Simulator */}
        <MotionReveal delay={250}>
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0A0D16] border border-white/15 relative overflow-hidden mb-20 shadow-2xl">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B4F000]">
              Interactive Simulation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Simulate Your Cognitive Overhead
            </h2>
            <p className="text-sm text-slate-400">
              Adjust your daily variables to see how friction accumulates in traditional to-do lists versus NEXUS autonomous replanning.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Queued Commitments & Tasks:</span>
                  <span className="text-[#B4F000] font-bold">{taskCount} tasks</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  value={taskCount}
                  onChange={(e) => setTaskCount(Number(e.target.value))}
                  className="w-full accent-[#B4F000] bg-white/10 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Unplanned Interruptions / Spills:</span>
                  <span className="text-rose-400 font-bold">{interruptions} events</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={interruptions}
                  onChange={(e) => setInterruptions(Number(e.target.value))}
                  className="w-full accent-rose-400 bg-white/10 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-200">The NEXUS Difference:</div>
                <div>When friction peaks, NEXUS runs autonomous triage: trimming, shortening, or deferring non-essentials to preserve your focus.</div>
              </div>
            </div>

            {/* Friction Meters Comparison */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Traditional */}
              <div className="p-6 rounded-2xl bg-rose-500/[0.08] border border-rose-500/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-mono mb-2">
                    <Flame className="w-4 h-4" />
                    <span>TRADITIONAL LIST</span>
                  </div>
                  <div className="text-4xl font-extrabold text-white font-display">
                    {traditionalFriction}%
                  </div>
                  <div className="text-xs text-rose-300 mt-1">Cognitive Friction Index</div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${traditionalFriction}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {traditionalFriction > 60 ? 'Severe decision fatigue and evening guilt.' : 'Moderate friction and persistent backlog.'}
                </p>
              </div>

              {/* NEXUS */}
              <div className="p-6 rounded-2xl bg-[#B4F000]/[0.08] border border-[#B4F000]/40 flex flex-col justify-between space-y-4 shadow-[0_0_25px_rgba(180,240,0,0.1)]">
                <div>
                  <div className="flex items-center gap-2 text-[#B4F000] text-xs font-mono mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>NEXUS ADAPTIVE</span>
                  </div>
                  <div className="text-4xl font-extrabold text-[#B4F000] font-display">
                    {nexusFriction}%
                  </div>
                  <div className="text-xs text-emerald-300 mt-1">Cognitive Friction Index</div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#B4F000] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#B4F000]"
                    style={{ width: `${nexusFriction}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-300">
                  {Math.round(traditionalFriction - nexusFriction)}% cognitive load eliminated through autonomous triage.
                </p>
              </div>
            </div>
          </div>
        </div>
        </MotionReveal>

        {/* Transition Bridge to Transformation */}
        <MotionReveal delay={300}>
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0C1220] to-[#0A101C] border border-[#B4F000]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Ready to see how the shift looks in practice?
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Explore the interactive Chaos to Clarity transformation timeline and experience adaptive scheduling firsthand.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                to="/transformation"
                className="px-6 py-3 rounded-full bg-[#B4F000] hover:bg-[#c6ff1a] text-black font-semibold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(180,240,0,0.35)] hover:shadow-[0_0_28px_rgba(180,240,0,0.55)] hover:-translate-y-0.5"
              >
                <span>Explore Transformation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </MotionReveal>

      </div>
    </div>
  );
};

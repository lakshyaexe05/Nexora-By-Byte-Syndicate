import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, CheckCircle2, RefreshCw, Zap, Clock, 
  Layers, ShieldCheck, HeartPulse, ChevronRight, Sliders
} from 'lucide-react';
import { ChaosToClaritySection } from '../components/ChaosToClaritySection';
import { MotionReveal } from '../components/MotionReveal';

export const TransformationPage: React.FC = () => {
  const [selectedTimelineHour, setSelectedTimelineHour] = useState<number>(14); // 2:00 PM default

  const timelineEvents: Record<number, {
    time: string;
    withoutNexora: { title: string; desc: string; mood: string; status: 'red' | 'amber' };
    withNexus: { title: string; desc: string; mood: string; status: 'green' | 'cyan' };
  }> = {
    9: {
      time: '09:00 AM',
      withoutNexora: {
        title: 'Morning Inbox Ambush',
        desc: 'Stares at 35 unread emails and 18 random notes. Paralysis sets in. Drinks second espresso without starting.',
        mood: 'Scattered & anxious',
        status: 'red',
      },
      withNexus: {
        title: 'Neural Morning Briefing',
        desc: 'NEXUS presents a 3-block focus plan: deep analytical work first while morning willpower is at peak.',
        mood: 'Calm & purposeful',
        status: 'green',
      },
    },
    11: {
      time: '11:30 AM',
      withoutNexora: {
        title: 'Meeting Run-Over Shock',
        desc: 'A sprint review runs 40 minutes over. The planned study window is completely decimated. Panic starts.',
        mood: 'Frustrated & derailed',
        status: 'red',
      },
      withNexus: {
        title: 'Instant Autonomous Rebalance',
        desc: 'NEXUS detects the 40m delay, shortens secondary tasks, and defers administrative errands without manual edits.',
        mood: 'Completely unbothered',
        status: 'cyan',
      },
    },
    14: {
      time: '02:00 PM',
      withoutNexora: {
        title: 'Afternoon Biological Slump',
        desc: 'Trying to write complex proposal while exhausted. Scrolling social media guiltily between sentences.',
        mood: 'Guilt & cognitive fog',
        status: 'amber',
      },
      withNexus: {
        title: 'Energy-Matched Micro-Triage',
        desc: 'NEXUS matches the slump with low-energy organizational tasks and 15 minutes of cosmic binaural recharge.',
        mood: 'Steady progress maintained',
        status: 'green',
      },
    },
    17: {
      time: '05:30 PM',
      withoutNexora: {
        title: 'Evening Defeat & Overflow',
        desc: '12 unchecked tasks rolled over to tomorrow. Guilt carries over into dinner and family time.',
        mood: 'Chronic burnout',
        status: 'red',
      },
      withNexus: {
        title: 'Clean Shutdown & Accomplishment',
        desc: 'All core priorities completed. Deferred tasks safely queued for optimal future windows. Brain at zero load.',
        mood: 'Total peace of mind',
        status: 'green',
      },
    },
  };

  const currentEvent = timelineEvents[selectedTimelineHour] || timelineEvents[14];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#06080D] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#B4F000]/08 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#38BDF8]/08 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <MotionReveal delay={100}>
          <div className="max-w-3xl space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B4F000]/30 bg-[#B4F000]/10 text-[#B4F000] text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE NEXORA SHIFT</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.05]">
              From Reactive Chaos <br />
              <span className="text-[#B4F000]">To Effortless Clarity.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              See how your entire day transforms when an intelligent agent continuously safeguards your focus, time, and mental capacity.
            </p>
          </div>
        </MotionReveal>

        {/* Component 1: Interactive Chaos to Clarity Section */}
        <MotionReveal delay={200}>
          <div className="mb-20">
            <ChaosToClaritySection />
          </div>
        </MotionReveal>

        {/* Component 2: A Typical Monday Timeline Comparison */}
        <MotionReveal delay={250}>
          <div className="p-8 sm:p-12 rounded-3xl bg-[#090D16] border border-white/10 mb-20 shadow-2xl">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
              Hour-By-Hour Reality Check
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              A Typical Day: With vs Without NEXORA
            </h2>
            <p className="text-sm text-slate-400">
              Select a milestone time of day to contrast traditional friction with NEXUS guidance.
            </p>
          </div>

          {/* Time Selector Pills */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 mb-8">
            {[9, 11, 14, 17].map((hour) => (
              <button
                key={hour}
                onClick={() => setSelectedTimelineHour(hour)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  selectedTimelineHour === hour
                    ? 'bg-[#B4F000] text-black shadow-[0_0_20px_rgba(180,240,0,0.35)]'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{timelineEvents[hour].time}</span>
              </button>
            ))}
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Without NEXORA */}
            <div className="p-8 rounded-3xl bg-rose-950/20 border border-rose-500/30 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                    Without NEXORA
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 font-mono">
                    {currentEvent.withoutNexora.mood}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 font-display">
                  {currentEvent.withoutNexora.title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentEvent.withoutNexora.desc}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 text-xs text-rose-300/80">
                <span className="font-semibold text-rose-300">Cost:</span> Wasted willpower, accumulated anxiety, and diminished focus.
              </div>
            </div>

            {/* With NEXUS */}
            <div className="p-8 rounded-3xl bg-[#B4F000]/[0.05] border border-[#B4F000]/40 flex flex-col justify-between space-y-6 shadow-[0_0_30px_rgba(180,240,0,0.1)]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#B4F000] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>With NEXUS Intelligence</span>
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#B4F000]/15 text-[#B4F000] font-mono font-semibold">
                    {currentEvent.withNexus.mood}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 font-display">
                  {currentEvent.withNexus.title}
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentEvent.withNexus.desc}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-[#B4F000]/25 text-xs text-[#B4F000]/90">
                <span className="font-semibold text-[#B4F000]">Result:</span> Maximum throughput with zero mental overhead or self-blame.
              </div>
            </div>
          </div>
        </div>
        </MotionReveal>

        {/* Action Callout */}
        <MotionReveal delay={300}>
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0C1220] to-[#0A101C] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-display">
                Experience the Workspace Dashboard
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Add tasks, run smart reschedule simulations, and see how NEXORA manages real data.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                to="/workspace"
                className="px-6 py-3.5 rounded-full bg-[#B4F000] hover:bg-[#c6ff1a] text-black font-semibold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(180,240,0,0.35)] hover:shadow-[0_0_28px_rgba(180,240,0,0.55)] hover:-translate-y-0.5"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </MotionReveal>

      </div>
    </div>
  );
};

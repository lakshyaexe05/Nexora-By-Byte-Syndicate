import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, MessageSquare, Cpu, Calendar, RefreshCw, 
  CheckCircle2, Terminal, Play, Zap, Shield, ChevronRight
} from 'lucide-react';
import { MotionReveal } from '../components/MotionReveal';

export const HowItWorksPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [demoInput, setDemoInput] = useState<string>(
    'Need to finish differential calculus problem set 4, do 30m gym warmup, and draft email to marketing director by 5pm.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<any | null>(null);

  const steps = [
    {
      num: 1,
      title: 'Expressive Unstructured Input',
      desc: 'Speak or type however thoughts arrive in your head. No rigid time slots, no complex forms, no tags required.',
      icon: MessageSquare,
      badge: 'Step 01 · Ingestion',
    },
    {
      num: 2,
      title: 'Neural Parsing & Energy Modeling',
      desc: 'NEXUS deconstructs your input, identifies hidden dependencies, estimates duration, and tags required cognitive load.',
      icon: Cpu,
      badge: 'Step 02 · Analysis',
    },
    {
      num: 3,
      title: 'Circadian Timetable Synthesis',
      desc: 'Tasks are allocated to optimal hours of the day, matching demanding work with high-alertness periods and buffering breaks.',
      icon: Calendar,
      badge: 'Step 03 · Architecture',
    },
    {
      num: 4,
      title: 'Dynamic Real-Time Rebalancing',
      desc: 'When life happens and meetings run long, NEXUS adapts without shame. It compresses, shifts, or defers tasks autonomously.',
      icon: RefreshCw,
      badge: 'Step 04 · Adaptation',
    },
  ];

  const handleSimulateDeconstruct = () => {
    setIsProcessing(true);
    setParsedResult(null);

    setTimeout(() => {
      setParsedResult({
        detectedCommitments: [
          {
            title: 'Calculus Problem Set 4',
            category: 'Study',
            energy: 'High (Analytical Peak)',
            duration: '90 mins',
            recommendedWindow: '09:00 - 10:30',
          },
          {
            title: 'Gym Warmup & Conditioning',
            category: 'Health',
            energy: 'Medium (Physical Reset)',
            duration: '30 mins',
            recommendedWindow: '12:00 - 12:30',
          },
          {
            title: 'Draft Marketing Director Email',
            category: 'Work',
            energy: 'Medium (Communication)',
            duration: '25 mins',
            recommendedWindow: '14:00 - 14:25',
          },
        ],
        bufferAllocated: '25 mins for cognitive reset',
        confidenceScore: '98.4%',
      });
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#06080D] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#B4F000]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <MotionReveal delay={100}>
          <div className="max-w-3xl space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B4F000]/30 bg-[#B4F000]/10 text-[#B4F000] text-xs font-mono font-medium">
              <Cpu className="w-3.5 h-3.5" />
              <span>NEXUS ARCHITECTURE</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.05]">
              How NEXUS Turns <br />
              <span className="text-[#B4F000]">Chaos Into Action.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              A look under the hood at the 4-phase cognitive engine that eliminates schedule friction and keeps you in deep flow.
            </p>
          </div>
        </MotionReveal>

        {/* 4 Interactive Process Step Cards */}
        <MotionReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCurrent = activeStep === st.num;

            return (
              <div
                key={st.num}
                onClick={() => setActiveStep(st.num)}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 ${
                  isCurrent
                    ? 'bg-[#0E1424] border-[#B4F000] shadow-[0_0_25px_rgba(180,240,0,0.15)] scale-[1.02]'
                    : 'bg-[#090D16] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#B4F000]">
                      {st.badge}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isCurrent ? 'bg-[#B4F000] text-black' : 'bg-white/5 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B4F000]" />
                  <span>Autonomous Operation</span>
                </div>
              </div>
            );
          })}
        </div>
        </MotionReveal>

        {/* Interactive Architecture Console / Sandbox */}
        <MotionReveal delay={250}>
          <div className="p-8 sm:p-12 rounded-3xl bg-[#090D16] border border-white/15 relative overflow-hidden mb-20 shadow-2xl">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
              Interactive Sandbox
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display flex items-center gap-3">
              <span>Test the Deconstruction Engine</span>
              <Sparkles className="w-5 h-5 text-[#B4F000]" />
            </h2>
            <p className="text-sm text-slate-400">
              Type or adjust sample messy thoughts to see how NEXUS identifies tasks, assigns cognitive energy weights, and sequences them.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Console */}
            <div className="lg:col-span-5 space-y-4">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#B4F000]" />
                <span>Raw Cognitive Stream (Input):</span>
              </label>
              <textarea
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                rows={4}
                className="w-full bg-black/50 border border-white/15 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#B4F000] font-sans leading-relaxed resize-none"
              />

              <button
                onClick={handleSimulateDeconstruct}
                disabled={isProcessing || !demoInput.trim()}
                className="w-full py-3.5 rounded-2xl bg-[#B4F000] hover:bg-[#c6ff1a] text-black font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(180,240,0,0.3)] disabled:opacity-40"
              >
                {isProcessing ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                    <span>Parsing Neural Flow...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Simulate NEXUS Deconstruction</span>
                  </>
                )}
              </button>
            </div>

            {/* Structured Output Visualization */}
            <div className="lg:col-span-7 bg-[#05070D] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-[#B4F000]" />
                    <span>NEXUS Structured Schema Output</span>
                  </div>
                  {parsedResult && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Confidence: {parsedResult.confidenceScore}
                    </span>
                  )}
                </div>

                {parsedResult ? (
                  <div className="space-y-3">
                    {parsedResult.detectedCommitments.map((c: any, i: number) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{c.title}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Category: {c.category} · Energy: {c.energy}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 font-mono">
                          <span className="text-[#B4F000]">{c.duration}</span>
                          <span className="text-slate-400">[{c.recommendedWindow}]</span>
                        </div>
                      </div>
                    ))}
                    <div className="p-2.5 rounded-lg bg-[#38BDF8]/10 text-sky-300 font-mono text-[11px] flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{parsedResult.bufferAllocated}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono">
                    Click "Simulate NEXUS Deconstruction" to see how raw text transforms into categorized, energy-sequenced commitments.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Model: Failover Autonomous Mesh</span>
                <span>Zero Hallucinations Guarantee</span>
              </div>
            </div>
          </div>
        </div>
        </MotionReveal>

        {/* Action Link to Workspace */}
        <MotionReveal delay={300}>
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C1220] to-[#0A101C] border border-[#B4F000]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-display">
                Test it with your real schedule
              </h3>
              <p className="text-xs text-slate-300">
                Apply this intelligence to your day inside the interactive workspace.
              </p>
            </div>
            <Link
              to="/workspace"
              className="px-6 py-3 rounded-full bg-[#B4F000] hover:bg-[#c6ff1a] text-black font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(180,240,0,0.35)] hover:shadow-[0_0_28px_rgba(180,240,0,0.55)] hover:-translate-y-0.5 whitespace-nowrap"
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </MotionReveal>

      </div>
    </div>
  );
};

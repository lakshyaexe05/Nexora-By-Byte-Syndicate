import React from 'react';
import { MessageSquareText, RefreshCw, Timer, BarChart3, ArrowUpRight } from 'lucide-react';

interface FeatureShowcaseProps {
  onSelectFeature: (featureKey: 'planner' | 'reschedule' | 'focus' | 'insights') => void;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ onSelectFeature }) => {
  const features = [
    {
      key: 'planner' as const,
      title: 'AI Planning Assistant',
      desc: 'Describe your goals in natural language and receive a personalized, realistic plan.',
      detail: 'Parses urgency, available time budget, energy state, and dependencies automatically.',
      icon: MessageSquareText,
      badge: 'Gemini 3.8 Flash',
      glow: 'group-hover:border-[#B4F000]/40 group-hover:shadow-[0_0_30px_rgba(180,240,0,0.15)]'
    },
    {
      key: 'reschedule' as const,
      title: 'Smart Reschedule',
      desc: 'Running late? NEXORA reorganises your plan instantly without guilt or disruption.',
      detail: 'Intelligently shortens tasks or defers lower priority items while protecting hard deadlines.',
      icon: RefreshCw,
      badge: 'Signature Adaptation',
      glow: 'group-hover:border-sky-500/40 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]'
    },
    {
      key: 'focus' as const,
      title: 'Focus Mode',
      desc: 'Stay focused with a countdown timer, ambient audio soundscapes, and step guidance.',
      detail: 'Distraction-free interface with Web Audio synthesizer (binaural beats, cosmos drone).',
      icon: Timer,
      badge: 'Procedural Audio',
      glow: 'group-hover:border-[#B4F000]/40 group-hover:shadow-[0_0_30px_rgba(180,240,0,0.15)]'
    },
    {
      key: 'insights' as const,
      title: 'Progress Insights',
      desc: 'Track your completion velocity, planned versus completed hours, and workload density.',
      detail: 'Real data analytics derived from your actual task executions with zero vanity metrics.',
      icon: BarChart3,
      badge: 'Real-Time Telemetry',
      glow: 'group-hover:border-purple-500/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#080B12] relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Features that<br />
            <span className="text-[#B4F000]">make life simpler.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Engineered to remove friction from scheduling, time management, and execution.
          </p>
        </div>

        {/* 4 Feature Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.key}
                onClick={() => onSelectFeature(feat.key)}
                className={`group p-6 rounded-2xl bg-[#0D121F] border border-white/[0.08] cursor-pointer flex flex-col justify-between card-hover-depth interactive-tap ${feat.glow}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#B4F000] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 font-display flex items-center justify-between">
                    <span>{feat.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#B4F000] transition-colors" />
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 text-xs text-slate-400">
                  {feat.detail}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

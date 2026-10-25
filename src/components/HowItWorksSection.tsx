import React from 'react';
import { Compass, Calendar, RefreshCw, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'DISCOVER',
      subtitle: 'Natural Language & Context Extraction',
      desc: 'Type or speak your messy everyday situation. NEXORA extracts deadlines, identifies dependencies, and gauges your energy constraints.',
      icon: Compass,
      tag: 'Step 1'
    },
    {
      num: '02',
      title: 'PLAN',
      subtitle: 'Realistic Chronological Decomposition',
      desc: 'The planning engine breaks intimidating workloads into micro-steps, inserts cognitive recovery breaks, and strictly respects your available hours.',
      icon: Calendar,
      tag: 'Step 2'
    },
    {
      num: '03',
      title: 'ADAPT',
      subtitle: 'Dynamic Run-Late Rebalancing',
      desc: 'When life happens and you run behind, one click re-calibrates remaining priorities, compresses flexible tasks, and reschedules without guilt.',
      icon: RefreshCw,
      tag: 'Step 3'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#080B12] relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B4F000] font-bold block mb-2">
            THREE STAGES OF CLARITY
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            How NEXORA works.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            A continuous loop designed to turn overwhelmed minds into confident, focused execution.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="relative p-8 rounded-3xl bg-[#0D1220] border border-white/[0.08] hover:border-[#B4F000]/30 card-hover-depth group"
              >
                {/* Number & Tag */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-black text-slate-700 font-mono group-hover:text-[#B4F000] transition-colors">
                    {s.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#B4F000]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white font-display tracking-tight mb-1">
                  {s.title}
                </h3>
                <h4 className="text-xs font-semibold text-sky-400 mb-3 font-mono">
                  {s.subtitle}
                </h4>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {s.desc}
                </p>

                {/* Arrow connector on desktop */}
                {idx < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#06080D] border border-white/15 flex items-center justify-center text-slate-500">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

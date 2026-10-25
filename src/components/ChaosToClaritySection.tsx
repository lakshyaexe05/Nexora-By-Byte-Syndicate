import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Clock, Coffee, Sparkles, BookOpen, FileText } from 'lucide-react';

export const ChaosToClaritySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'before' | 'after'>('both');
  const [sliderPosition, setSliderPosition] = useState(50);

  const beforeTasks = [
    { title: 'Maths assignment', status: 'Urgent?' },
    { title: 'Physics notes', status: 'Overdue?' },
    { title: 'Project report', status: 'No deadline' },
    { title: 'Exam preparation', status: 'Where to start?' },
    { title: 'Room cleaning', status: 'Postponed' },
    { title: 'Gym workout', status: 'Low energy' },
    { title: 'Meeting with group', status: 'Uncoordinated' },
    { title: 'Family work', status: 'Unplanned' },
  ];

  const afterSchedule = [
    {
      time: '09:00',
      title: 'Maths Assignment',
      duration: '1h 30m',
      category: 'Study',
      icon: BookOpen,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      badge: 'High Priority'
    },
    {
      time: '10:30',
      title: 'Short Break & Hydration',
      duration: '15m',
      category: 'Health',
      icon: Coffee,
      color: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
      badge: 'Recovery'
    },
    {
      time: '10:45',
      title: 'Physics Notes',
      duration: '1h',
      category: 'Study',
      icon: FileText,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      badge: 'High Priority'
    },
    {
      time: '12:00',
      title: 'Nutritious Lunch',
      duration: '30m',
      category: 'Health',
      icon: Coffee,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      badge: 'Refuel'
    },
    {
      time: '12:30',
      title: 'Project Report Intro',
      duration: '1h 30m',
      category: 'Work',
      icon: Sparkles,
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
      badge: 'Milestone'
    }
  ];

  return (
    <section id="clarity" className="py-24 bg-[#06080D] relative overflow-hidden border-t border-white/[0.06]">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-[#B4F000]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              From chaos<br />
              <span className="text-[#B4F000]">to clarity.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl">
              NEXORA turns your messy to-do list into a clear, actionable plan. No more guessing what to do next or feeling guilty about unfinished work.
            </p>

            {/* Checklist */}
            <div className="space-y-3.5 pt-4">
              {[
                { title: 'Smart prioritisation', desc: 'Identifies high-leverage commitments first.' },
                { title: 'Realistic scheduling', desc: 'Guarantees planned time strictly respects your budget.' },
                { title: 'Step-by-step guidance', desc: 'Converts intimidating tasks into five-minute micro-actions.' },
                { title: 'Adapts when plans change', desc: 'One-click smart rescheduling without starting from scratch.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#B4F000]/15 flex items-center justify-center text-[#B4F000] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 fill-[#B4F000]/20" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">{item.title}</span>
                    <span className="text-xs text-slate-400 block">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Transformation Visual Board */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-[#0B0F19] border border-white/[0.1] p-6 shadow-2xl relative">
              
              {/* Segmented control to toggle or compare */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-lg border border-white/[0.08]">
                  <button
                    onClick={() => setActiveTab('both')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      activeTab === 'both' ? 'bg-[#B4F000] text-black shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Side by Side
                  </button>
                  <button
                    onClick={() => setActiveTab('before')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      activeTab === 'before' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Before
                  </button>
                  <button
                    onClick={() => setActiveTab('after')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      activeTab === 'after' ? 'bg-[#B4F000] text-black shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    After (NEXORA)
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  Interactive Transformation
                </span>
              </div>

              {/* Side by side display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative">
                
                {/* BEFORE PANEL */}
                {(activeTab === 'both' || activeTab === 'before') && (
                  <div className={`p-4 rounded-xl bg-[#070A11] border border-white/[0.06] space-y-2.5 ${activeTab === 'before' ? 'sm:col-span-2' : ''}`}>
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Before</span>
                      <span className="text-[10px] text-rose-400 font-mono">Unstructured</span>
                    </div>

                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {beforeTasks.map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                            <span className="text-slate-300">{task.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{task.status}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-[11px] text-rose-400/80 font-mono">
                      ✕ No time slots · No recovery intervals
                    </div>
                  </div>
                )}

                {/* AFTER PANEL */}
                {(activeTab === 'both' || activeTab === 'after') && (
                  <div className={`p-4 rounded-xl bg-[#0E1524] border border-[#B4F000]/30 shadow-[0_0_30px_rgba(180,240,0,0.1)] space-y-2.5 ${activeTab === 'after' ? 'sm:col-span-2' : ''}`}>
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#B4F000] animate-ping" />
                        <span className="text-xs font-bold text-[#B4F000] font-mono uppercase tracking-wider">After (NEXORA)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">Feasible 4h Total</span>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {afterSchedule.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs hover:border-[#B4F000]/40 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-slate-400 font-bold text-[11px]">{item.time}</span>
                              <div className="p-1 rounded bg-white/5 text-slate-300">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-medium text-white">{item.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-slate-400">{item.duration}</span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${item.color}`}>
                                {item.badge}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 text-[11px] text-[#B4F000] font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Realistic schedule with integrated mental recovery</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

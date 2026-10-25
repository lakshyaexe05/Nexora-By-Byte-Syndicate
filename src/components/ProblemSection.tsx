import React, { useState } from 'react';
import { Clock, AlertTriangle, BookOpen, Dumbbell, Sparkles, HeartHandshake, Compass, CalendarCheck, RefreshCw } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const [activeFriction, setActiveFriction] = useState<string | null>(null);

  const frictionItems = [
    {
      id: 'maths',
      title: 'Maths Assignment',
      meta: 'Tomorrow',
      priority: 'High Priority',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      icon: BookOpen,
      friction: 'Overwhelming volume of problems with no clear sequence or starting formula.'
    },
    {
      id: 'project',
      title: 'Project Report',
      meta: '3 days left',
      priority: 'Urgent',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      icon: Clock,
      friction: 'Unclear deliverable requirements lead to chronic procrastination.'
    },
    {
      id: 'exam',
      title: 'Exam Preparation',
      meta: 'Tomorrow',
      priority: 'Critical',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      icon: AlertTriangle,
      friction: 'Low energy after a long day makes 2 hours feel insufficient.'
    },
    {
      id: 'cleaning',
      title: 'Room Cleaning',
      meta: 'Tomorrow',
      priority: 'High Priority',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      icon: Sparkles,
      friction: 'Physical chaos creates subconscious mental fog and distraction.'
    },
    {
      id: 'gym',
      title: 'Gym & Fitness',
      meta: 'Keep going',
      priority: 'Routine',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      icon: Dumbbell,
      friction: 'Easily sacrificed when academic or work deadlines pile up.'
    },
    {
      id: 'birthday',
      title: "Friend's Birthday",
      meta: 'This weekend',
      priority: 'Personal',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      icon: HeartHandshake,
      friction: 'Forgotten until the last minute due to cognitive overload.'
    }
  ];

  return (
    <section id="problem" className="py-24 bg-[#080B12] relative overflow-hidden border-t border-white/[0.06]">
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-sky-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Strip: "A smarter way to everyday life." */}
        <div className="mb-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
              A smarter way to <span className="text-[#B4F000]">everyday life.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300">
              NEXORA simplifies the complex. Tell it what you need, and it creates a realistic plan that adapts to your time, priorities and energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* Card 1 */}
            <div className="p-7 rounded-2xl bg-[#0D121D] border border-white/[0.08] hover:border-white/20 card-hover-depth group">
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#B4F000] mb-5 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Understand Your Day</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Describe your goals, energy constraints, and looming deadlines in natural everyday language.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-2xl bg-[#0D121D] border border-white/[0.08] hover:border-[#B4F000]/30 card-hover-depth group">
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-sky-400 mb-5 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Create A Plan</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive a personalised, chronological schedule with clear action steps and realistic time budgets.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-2xl bg-[#0D121D] border border-white/[0.08] hover:border-white/20 card-hover-depth group">
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#B4F000] mb-5 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Adapt Anytime</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                When life runs late, NEXORA instantly rebalances your remaining time without guilt or panic.
              </p>
            </div>
          </div>
        </div>

        {/* Lower Problem Section: "Too much to do. Not enough time." */}
        <div className="relative rounded-3xl bg-[#0A0E17] border border-white/[0.08] p-8 lg:p-12 overflow-hidden shadow-2xl">
          
          {/* Visual Background with dark atmospheric gradient mesh */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[450px] h-[350px] bg-sky-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[350px] h-[250px] bg-[#B4F000]/5 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E17] via-[#0A0E17]/90 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>THE COGNITIVE OVERLOAD TRAP</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                Too much to do.<br />
                <span className="text-[#B4F000]">Not enough time.</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Assignments, deadlines, personal goals and unexpected interruptions can make everyday life feel chaotic. When everything feels urgent, people freeze.
              </p>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-400">
                <span className="text-white font-medium">Click any card</span> on the right to inspect how fragmented obligations trigger cognitive paralysis.
              </div>
            </div>

            {/* Right: Floating Interactive Friction Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {frictionItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeFriction === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveFriction(isSelected ? null : item.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? 'bg-[#151D2C] border-[#B4F000] shadow-[0_0_20px_rgba(180,240,0,0.2)] scale-[1.02]'
                        : 'bg-[#0E1422]/90 border-white/[0.08] hover:border-white/20 hover:bg-[#121929]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-white/[0.05] text-slate-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                          <span className="text-[11px] text-slate-400">{item.meta}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.badgeColor}`}>
                        {item.priority}
                      </span>
                    </div>

                    {isSelected ? (
                      <div className="mt-3 pt-3 border-t border-white/10 text-xs text-[#B4F000] font-sans">
                        ⚠️ {item.friction}
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] text-slate-500 truncate">
                        Tap to analyze scheduling friction...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { BarChart3, Clock, CheckCircle2, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import { TaskItem } from '../types';

interface ProgressInsightsSectionProps {
  tasks: TaskItem[];
}

export const ProgressInsightsSection: React.FC<ProgressInsightsSectionProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');

  const completedMinutes = completedTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
  const pendingMinutes = pendingTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
  const totalPlannedMinutes = completedMinutes + pendingMinutes;

  const completionPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Category breakdown
  const categoryStats = ['Study', 'Work', 'Personal', 'Health'].map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const catCompleted = catTasks.filter((t) => t.status === 'completed');
    const catMinutes = catTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
    return {
      category: cat,
      total: catTasks.length,
      completed: catCompleted.length,
      minutes: catMinutes,
    };
  });

  // Actionable dynamic recommendations based on real data
  const highPriorityPending = pendingTasks.filter((t) => t.priority === 'High');
  let realRecommendation = '';
  if (highPriorityPending.length > 0) {
    realRecommendation = `You have ${highPriorityPending.length} high-priority task${
      highPriorityPending.length === 1 ? '' : 's'
    } remaining today (${highPriorityPending.map((t) => t.title).join(', ')}). Protect the next hour from notifications.`;
  } else if (pendingTasks.length > 0) {
    realRecommendation = `All critical high-priority items are finished! You only have moderate and low urgency tasks left.`;
  } else {
    realRecommendation = `All planned commitments for today are 100% complete! Rest and recover cognitive energy.`;
  }

  return (
    <section id="insights" className="py-24 bg-[#06080D] relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300 mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-[#B4F000]" />
            <span>REAL TASK TELEMETRY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Actionable<br />
            <span className="text-[#B4F000]">progress insights.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Transparent metrics calculated strictly from your active tasks and schedule data.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1: Completed Rate */}
          <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Completion Velocity</span>
              <CheckCircle2 className="w-4 h-4 text-[#B4F000]" />
            </div>
            <div className="text-3xl font-black text-white font-mono tabular-nums">
              {completionPercent}%
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-emerald-400 font-bold">{completedTasks.length}</span> of {totalTasks} tasks cleared
            </div>
          </div>

          {/* Card 2: Time Completed */}
          <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Time Invested</span>
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono tabular-nums">
              {Math.floor(completedMinutes / 60)}h {completedMinutes % 60}m
            </div>
            <div className="text-xs text-slate-400">
              of {Math.floor(totalPlannedMinutes / 60)}h {totalPlannedMinutes % 60}m total budget
            </div>
          </div>

          {/* Card 3: Remaining Workload */}
          <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Remaining Workload</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono tabular-nums">
              {Math.floor(pendingMinutes / 60)}h {pendingMinutes % 60}m
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-amber-400 font-bold">{pendingTasks.length}</span> task{pendingTasks.length === 1 ? '' : 's'} waiting
            </div>
          </div>

          {/* Card 4: High Priority Ratio */}
          <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Critical Urgency</span>
              <TrendingUp className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono tabular-nums">
              {highPriorityPending.length}
            </div>
            <div className="text-xs text-slate-400">
              High priority commitment{highPriorityPending.length === 1 ? '' : 's'} remaining
            </div>
          </div>

        </div>

        {/* Lower Row: Category Time Distribution & Dynamic Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Category Distribution */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0B0F19] border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Workload Allocation by Category
            </h3>

            <div className="space-y-3">
              {categoryStats.map((item) => {
                const percent = totalPlannedMinutes > 0 ? Math.round((item.minutes / totalPlannedMinutes) * 100) : 0;
                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">{item.category}</span>
                      <span className="font-mono text-slate-400">
                        {item.minutes}m ({percent}%) · {item.completed}/{item.total} done
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-[#B4F000] rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Observation / Recommendation */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0D15] border border-white/10 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#B4F000] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>NEXORA DATA-GROUNDED RECOMMENDATION</span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">Actionable Takeaway</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {realRecommendation}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-500 font-mono">
              Calculated live from active task graph · Updates in real time
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

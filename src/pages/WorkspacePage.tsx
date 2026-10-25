import React from 'react';
import { Workspace } from '../components/Workspace';
import { PromptPlanner } from '../components/PromptPlanner';
import { ProgressInsightsSection } from '../components/ProgressInsightsSection';
import { MotionReveal } from '../components/MotionReveal';
import { useAppContext } from '../context/AppContext';
import { Sparkles } from 'lucide-react';

export const WorkspacePage: React.FC = () => {
  const {
    tasks,
    handleToggleTaskStatus,
    setSelectedTaskDetail,
    setIsAddTaskOpen,
    setIsSmartRescheduleOpen,
    setActiveFocusTask,
    handleResetDemo,
    handlePlanGenerated,
  } = useAppContext();

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#06080D]">
      {/* Workspace Banner & Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <MotionReveal delay={50}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#B4F000] bg-[#B4F000]/10 px-2 py-0.5 rounded-md">
                  LIVE ENVIRONMENT
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {tasks.length} active tasks registered
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display mt-1">
                Personal Workspace
              </h1>
            </div>
            <div className="text-xs text-slate-400 font-mono text-left sm:text-right">
              <span>Adaptive Schedule Engine v3.1</span>
              <div className="text-[#38BDF8] flex items-center gap-1.5 sm:justify-end mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-Time Sync Ready</span>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* Main Workspace Dashboard */}
      <MotionReveal delay={100}>
        <Workspace
          tasks={tasks}
          onToggleTaskStatus={handleToggleTaskStatus}
          onOpenTaskDetail={(task) => setSelectedTaskDetail(task)}
          onOpenAddTask={() => setIsAddTaskOpen(true)}
          onOpenSmartReschedule={() => setIsSmartRescheduleOpen(true)}
          onOpenFocusTask={(task) => setActiveFocusTask(task)}
          onResetDemo={handleResetDemo}
        />
      </MotionReveal>

      {/* Inline AI Natural Language Prompt Planner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <MotionReveal delay={150}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B4F000]" />
              <span>Generate Additional Plans with AI Planner</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Need to schedule an upcoming project or study session? Enter your thoughts below to synthesize new task cards directly into this board.
            </p>
          </div>
          <PromptPlanner onPlanGenerated={handlePlanGenerated} />
        </MotionReveal>
      </div>

      {/* Progress & Telemetry Section */}
      <div className="mt-12">
        <MotionReveal delay={180}>
          <ProgressInsightsSection tasks={tasks} />
        </MotionReveal>
      </div>
    </div>
  );
};

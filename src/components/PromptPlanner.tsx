import React, { useState } from 'react';
import { Sparkles, ArrowRight, Clock, Zap, Target, Loader2, Check, AlertCircle } from 'lucide-react';
import { PlanRequest, PlanResponse, TaskItem } from '../types';

interface PromptPlannerProps {
  onPlanGenerated: (newTasks: TaskItem[], summary: string, reasoning: string) => void;
}

export const PromptPlanner: React.FC<PromptPlannerProps> = ({ onPlanGenerated }) => {
  const [prompt, setPrompt] = useState('Help me prepare for my exam tomorrow. I have 3 hours and I am tired.');
  const [availableMinutes, setAvailableMinutes] = useState<number>(180);
  const [energyLevel, setEnergyLevel] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [focusArea, setFocusArea] = useState<'All' | 'Study' | 'Personal' | 'Work' | 'Health'>('Study');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<PlanResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presetChips = [
    {
      label: 'Study Plan',
      prompt: 'Help me prepare for my exam tomorrow. I have 3 hours and I am tired.',
      time: 180,
      energy: 'Low' as const,
      area: 'Study' as const
    },
    {
      label: 'Project Planning',
      prompt: 'I need to write a full software engineering project report before Friday.',
      time: 120,
      energy: 'High' as const,
      area: 'Work' as const
    },
    {
      label: 'Daily Routine',
      prompt: 'Structure my chaotic afternoon with exercise, emails, and grocery shopping.',
      time: 90,
      energy: 'Medium' as const,
      area: 'Personal' as const
    },
    {
      label: 'Room Cleaning',
      prompt: 'My apartment is a mess and I have 45 minutes before guests arrive.',
      time: 45,
      energy: 'Medium' as const,
      area: 'Personal' as const
    }
  ];

  const handleApplyPreset = (chip: typeof presetChips[0]) => {
    setPrompt(chip.prompt);
    setAvailableMinutes(chip.time);
    setEnergyLevel(chip.energy);
    setFocusArea(chip.area);
    setErrorMsg(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    const payload: PlanRequest = {
      prompt,
      availableMinutes,
      energyLevel,
      focusArea
    };

    try {
      const res = await fetch('/api/gemini/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: PlanResponse = await res.json();
      setLastResult(data);
    } catch (err: any) {
      console.warn('API error during plan generation:', err);
      // Fallback
      setErrorMsg('Connected to fallback heuristic planner.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToWorkspace = () => {
    if (lastResult && lastResult.tasks.length > 0) {
      onPlanGenerated(lastResult.tasks, lastResult.summary, lastResult.reasoning);
      // Scroll to workspace
      const el = document.getElementById('workspace');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="planner" className="py-24 bg-[#06080D] relative overflow-hidden border-t border-white/[0.06]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[350px] bg-sky-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B4F000]/10 border border-[#B4F000]/20 text-[#B4F000] text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>POWERED BY REAL GEMINI 3.8 FLASH</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Plan anything<br />
            <span className="text-[#B4F000]">with one prompt.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Tell NEXORA what you need and get a detailed, realistic schedule engineered around your constraints.
          </p>
        </div>

        {/* Input Card Container */}
        <div className="rounded-3xl bg-[#0B0F19] border border-white/[0.1] p-6 sm:p-8 shadow-2xl relative">
          
          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* Main Prompt Bar */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Help me prepare for my exam tomorrow. I have 3 hours and I'm tired."
                rows={3}
                className="w-full bg-[#06080D] border border-white/15 focus:border-[#B4F000] rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#B4F000] transition-all resize-none shadow-inner"
              />
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="absolute top-4 right-4 text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 mr-1 font-mono">Suggestions:</span>
              {presetChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(chip)}
                  className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#B4F000]/40 text-xs text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap interactive-tap active:scale-[0.95]"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Controls Strip: Available Time, Energy Level, Focus Area */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* Available Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Available Time</span>
                </label>
                <select
                  value={availableMinutes}
                  onChange={(e) => setAvailableMinutes(Number(e.target.value))}
                  className="w-full bg-[#06080D] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B4F000] cursor-pointer"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={90}>1.5 Hours</option>
                  <option value={120}>2 Hours</option>
                  <option value={180}>3 Hours</option>
                  <option value={240}>4 Hours</option>
                </select>
              </div>

              {/* Energy Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#B4F000]" />
                  <span>Energy Level</span>
                </label>
                <select
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(e.target.value as any)}
                  className="w-full bg-[#06080D] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B4F000] cursor-pointer"
                >
                  <option value="Low">Low (Tired / Depleted)</option>
                  <option value="Medium">Medium (Balanced)</option>
                  <option value="High">High (Peaked / Ready)</option>
                </select>
              </div>

              {/* Focus Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-purple-400" />
                  <span>Focus Area</span>
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value as any)}
                  className="w-full bg-[#06080D] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B4F000] cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Study">Study & Academic</option>
                  <option value="Work">Work & Projects</option>
                  <option value="Personal">Personal & Home</option>
                  <option value="Health">Health & Wellness</option>
                </select>
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-black bg-[#B4F000] hover:bg-[#c6ff1a] disabled:opacity-50 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(180,240,0,0.35)] cursor-pointer interactive-tap active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Analyzing & Scheduling...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Generated Result Preview Box */}
          {lastResult && (
            <div className="mt-8 pt-8 border-t border-white/10 space-y-5 animate-in fade-in duration-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111726] p-4 rounded-xl border border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B4F000]" />
                    <h3 className="text-sm font-bold text-white">{lastResult.summary}</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    {lastResult.reasoning}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApplyToWorkspace}
                  className="px-5 py-2.5 rounded-xl bg-[#B4F000] hover:bg-[#c6ff1a] text-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Workspace</span>
                </button>
              </div>

              {/* Task Cards Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lastResult.tasks.map((task, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#080B12] border border-white/[0.08] space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{task.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{task.category}</span>
                          <span>·</span>
                          <span className="font-mono text-sky-400">{task.durationMinutes}m</span>
                          <span>·</span>
                          <span className="text-amber-400">{task.priority} Priority</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        {task.scheduledTime || `${9 + idx}:00`}
                      </span>
                    </div>

                    {task.steps && task.steps.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-white/5">
                        {task.steps.map((s, sIdx) => (
                          <div key={sIdx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            <span>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};

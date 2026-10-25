import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Check, Volume2, Sparkles, Trophy } from 'lucide-react';
import { TaskItem, AmbientSoundType } from '../types';
import { focusAudio } from '../utils/audio';

interface FocusModeViewProps {
  task: TaskItem;
  onExit: () => void;
  onUpdateTaskSteps: (taskId: string, updatedSteps: TaskItem['steps']) => void;
  activeSound: AmbientSoundType;
  onChangeSound: (type: AmbientSoundType) => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  task,
  onExit,
  onUpdateTaskSteps,
  activeSound,
  onChangeSound,
}) => {
  // Timer state (default 25 minutes pomodoro or task duration)
  const initialSeconds = Math.min(25, task.durationMinutes || 25) * 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [steps, setSteps] = useState(task.steps);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            focusAudio.playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const toggleStep = (stepId: string) => {
    const updated = steps.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s));
    setSteps(updated);
    onUpdateTaskSteps(task.id, updated);
    focusAudio.playChime();
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;
  const completedSteps = steps.filter((s) => s.completed).length;
  const allCompleted = steps.length > 0 && completedSteps === steps.length;

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080D] flex flex-col justify-between overflow-y-auto p-4 sm:p-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </button>

        {/* Ambient Soundscape selector */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 hidden sm:inline">Soundscape:</span>
          <select
            value={activeSound}
            onChange={(e) => onChangeSound(e.target.value as AmbientSoundType)}
            className="bg-[#0D121F] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#B4F000]"
          >
            <option value="none">Mute</option>
            <option value="cosmos">Cosmos Drone</option>
            <option value="binaural">Alpha Binaural Beats (10Hz)</option>
            <option value="whitenoise">Pink Noise</option>
          </select>
        </div>
      </div>

      {/* Main Focus Center */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          {/* Left: Circular SVG Countdown Timer */}
          <div className="md:col-span-6 flex flex-col items-center text-center">
            
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                {/* Track */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="10"
                  fill="none"
                />
                {/* Progress */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  stroke="#B4F000"
                  strokeWidth="10"
                  strokeDasharray="534"
                  strokeDashoffset={534 - (534 * (100 - progressPercent)) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-500 drop-shadow-[0_0_15px_#B4F000]"
                />
              </svg>

              {/* Inner Digital Readout */}
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-[10px] font-mono tracking-widest text-[#B4F000] uppercase mb-1">
                  FOCUS TIME
                </span>
                <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight tabular-nums">
                  {formattedTime}
                </span>
                <span className="text-xs text-slate-400 mt-1 capitalize">
                  {task.category} Sprint
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-8 py-3 rounded-full bg-[#B4F000] hover:bg-[#c6ff1a] text-black font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(180,240,0,0.4)] cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Focus</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-full bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Current Task Checklist */}
          <div className="md:col-span-6 rounded-3xl bg-[#0B0F19] border border-white/10 p-6 sm:p-7 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  CURRENT OBJECTIVE
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{task.title}</h3>
              </div>
              <span className="text-xs font-mono text-[#B4F000] bg-[#B4F000]/10 px-2.5 py-1 rounded-full border border-[#B4F000]/20">
                {completedSteps} / {steps.length} completed
              </span>
            </div>

            {/* Step Checkbox List */}
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {steps.length === 0 ? (
                <div className="p-4 text-xs text-slate-400 text-center">
                  No sub-steps defined for this task. Focus on completing the primary goal.
                </div>
              ) : (
                steps.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      step.completed
                        ? 'bg-white/[0.02] border-white/5 opacity-60'
                        : 'bg-[#101625] border-white/10 hover:border-[#B4F000]/40'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        step.completed
                          ? 'bg-[#B4F000] border-[#B4F000] text-black'
                          : 'border-slate-500'
                      }`}
                    >
                      {step.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        step.completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {step.text}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* All Completed Celebration */}
            {allCompleted && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All sub-steps cleared! Phenomenal focus sprint.</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Footer Quote */}
      <div className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 font-mono tracking-wider pt-6 border-t border-white/5">
        BUILD BEYOND LIMITS. · DEEP CONCENTRATION ZONE
      </div>

    </div>
  );
};

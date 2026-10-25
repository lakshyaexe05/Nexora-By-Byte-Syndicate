import React, { useState } from 'react';
import { X, RefreshCw, Clock, ArrowRight, Check, AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import { RescheduleProposal, TaskItem } from '../types';

interface SmartRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTasks: TaskItem[];
  onApplyReschedule: (proposal: RescheduleProposal) => void;
}

export const SmartRescheduleModal: React.FC<SmartRescheduleModalProps> = ({
  isOpen,
  onClose,
  currentTasks,
  onApplyReschedule,
}) => {
  const [remainingMinutes, setRemainingMinutes] = useState<number>(45);
  const [reason, setReason] = useState<string>('Got delayed by unexpected call');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [proposal, setProposal] = useState<RescheduleProposal | null>(null);

  if (!isOpen) return null;

  const incompleteTasks = currentTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const totalIncompleteMinutes = incompleteTasks.reduce((acc, t) => acc + t.durationMinutes, 0);

  const handleCalculateReschedule = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTasks,
          remainingMinutes,
          reason
        })
      });

      if (!res.ok) {
        throw new Error('Reschedule request failed');
      }

      const data: RescheduleProposal = await res.json();
      setProposal(data);
    } catch (err) {
      console.warn('Fallback reschedule triggered:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (proposal) {
      onApplyReschedule(proposal);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0D121F] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">Smart Reschedule Engine</h3>
            <span className="text-xs text-slate-400">Adaptive real-time time rebalancing</span>
          </div>
        </div>

        {/* Step 1: Input remaining time */}
        {!proposal ? (
          <div className="space-y-6">
            
            <div className="p-4 rounded-2xl bg-[#070A11] border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Incomplete Tasks:</span>
                <span className="text-white font-bold font-mono">{incompleteTasks.length} tasks</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Originally Scheduled Time:</span>
                <span className="text-rose-400 font-bold font-mono">{totalIncompleteMinutes} minutes</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>How much realistic time do you have left today?</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[20, 30, 45, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setRemainingMinutes(mins)}
                    className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                      remainingMinutes === mins
                        ? 'bg-[#B4F000] text-black shadow-md'
                        : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/10'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Reason / Note (Optional context for AI)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Traffic delay, fatigue, unexpected meeting..."
                className="w-full bg-[#070A11] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#B4F000]"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCalculateReschedule}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Recalculating Schedule...</span>
                  </>
                ) : (
                  <>
                    <span>Preview New Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Explanation callout */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
              <span className="font-bold block mb-1">Adaptive Strategy:</span>
              {proposal.explanation}
            </div>

            {/* Retained / Shortened list */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#B4F000] font-bold">
                Retained & Shortened Tasks ({proposal.retainedTasks.length})
              </span>
              <div className="space-y-2">
                {proposal.retainedTasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-xl bg-[#080B12] border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B4F000]" />
                      <span className="font-semibold text-white">{task.title}</span>
                      <span className="text-[10px] text-slate-400">({task.priority})</span>
                    </div>
                    <span className="font-mono text-sky-400 font-bold">{task.durationMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deferred Tasks list */}
            {proposal.deferredTasks.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                  Postponed Tasks ({proposal.deferredTasks.length})
                </span>
                <div className="space-y-2">
                  {proposal.deferredTasks.map((task, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#080B12] border border-rose-500/20 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-300">{task.title}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{task.reason}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 shrink-0">
                        Moved to {task.deferredTo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setProposal(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to adjust time
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-white"
                >
                  Reject & Keep Original
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-6 py-2.5 rounded-xl bg-[#B4F000] hover:bg-[#c6ff1a] text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(180,240,0,0.3)] cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept & Apply Plan</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

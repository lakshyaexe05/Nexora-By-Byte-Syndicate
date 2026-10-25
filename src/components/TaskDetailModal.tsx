import React, { useState } from 'react';
import { X, Check, Trash2, Clock, Plus, Play, Tag, Sparkles } from 'lucide-react';
import { TaskCategory, TaskItem, TaskPriority } from '../types';

interface TaskDetailModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updated: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
  onStartFocus: (task: TaskItem) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onStartFocus,
}) => {
  if (!isOpen || !task) return null;

  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [category, setCategory] = useState<TaskCategory>(task.category);
  const [duration, setDuration] = useState<number>(task.durationMinutes);
  const [steps, setSteps] = useState(task.steps);
  const [newStepText, setNewStepText] = useState('');

  const handleSave = () => {
    onUpdateTask({
      ...task,
      title,
      priority,
      category,
      durationMinutes: duration,
      steps
    });
    onClose();
  };

  const handleToggleStep = (stepId: string) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s));
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    setSteps([
      ...steps,
      { id: `step-${Date.now()}`, text: newStepText.trim(), completed: false }
    ]);
    setNewStepText('');
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0D121F] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            TASK DETAILS & REASONING
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-bold text-white bg-transparent border-b border-white/10 focus:border-[#B4F000] focus:outline-none pb-1 mt-1 font-display"
          />
        </div>

        {/* AI Scheduling Rationale */}
        {task.reasoning && (
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#B4F000] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Scheduling Reasoning:</span>
              <p className="leading-relaxed">{task.reasoning}</p>
            </div>
          </div>
        )}

        {/* Priority & Category & Duration Settings */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-[#06080D] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#B4F000]"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full bg-[#06080D] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#B4F000]"
            >
              <option value="Study">Study</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Duration (m)</label>
            <input
              type="number"
              min={5}
              max={480}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-[#06080D] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#B4F000] font-mono"
            />
          </div>
        </div>

        {/* Sub-steps Checklist */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-white flex items-center justify-between">
            <span>Actionable Sub-steps ({steps.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">Check off as you progress</span>
          </label>

          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-2 rounded-xl bg-[#080B12] border border-white/5 text-xs group"
              >
                <div
                  onClick={() => handleToggleStep(step.id)}
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      step.completed ? 'bg-[#B4F000] border-[#B4F000] text-black' : 'border-slate-500'
                    }`}
                  >
                    {step.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={step.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                    {step.text}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteStep(step.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Sub-step */}
          <form onSubmit={handleAddStep} className="flex gap-2">
            <input
              type="text"
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              placeholder="Add micro-step..."
              className="flex-1 bg-[#06080D] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#B4F000]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
            >
              Add
            </button>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onDeleteTask(task.id);
              onClose();
            }}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartFocus(task);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Focus</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#B4F000] hover:bg-[#c6ff1a] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(180,240,0,0.3)] cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

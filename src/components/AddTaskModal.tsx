import React, { useState } from 'react';
import { X, Plus, Calendar } from 'lucide-react';
import { TaskCategory, TaskItem, TaskPriority } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: TaskItem) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Study');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [deadlineLabel, setDeadlineLabel] = useState('Today');
  const [scheduledTime, setScheduledTime] = useState('14:00');
  const [stepInput, setStepInput] = useState('');
  const [steps, setSteps] = useState<{ id: string; text: string; completed: boolean }[]>([]);

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepInput.trim()) return;
    setSteps([...steps, { id: `step-${Date.now()}`, text: stepInput.trim(), completed: false }]);
    setStepInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      category,
      priority,
      durationMinutes: Number(durationMinutes) || 30,
      scheduledTime,
      deadlineLabel,
      status: 'pending',
      steps,
      reasoning: 'User created commitment.'
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0D121F] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white font-display">Create New Task</h3>
          <p className="text-xs text-slate-400 mt-0.5">Add an everyday commitment or goal to your plan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. History Essay Draft, Chemistry Lab Numerical..."
              className="w-full bg-[#06080D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#B4F000]"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-[#06080D] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B4F000]"
              >
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-[#06080D] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B4F000]"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Duration & Scheduled Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Duration (minutes)</label>
              <input
                type="number"
                min={5}
                max={360}
                step={5}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-[#06080D] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B4F000] font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Scheduled Time</label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="14:00"
                className="w-full bg-[#06080D] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B4F000] font-mono"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Deadline / Window</label>
            <input
              type="text"
              value={deadlineLabel}
              onChange={(e) => setDeadlineLabel(e.target.value)}
              placeholder="e.g. Today, Tomorrow, This weekend"
              className="w-full bg-[#06080D] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#B4F000]"
            />
          </div>

          {/* Sub-steps */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Micro-Steps ({steps.length})
            </label>
            
            <div className="space-y-1.5 mb-2 max-h-24 overflow-y-auto">
              {steps.map((s, idx) => (
                <div key={s.id} className="text-xs text-slate-300 flex items-center justify-between p-1.5 rounded bg-[#06080D]">
                  <span>{idx + 1}. {s.text}</span>
                  <button
                    type="button"
                    onClick={() => setSteps(steps.filter(st => st.id !== s.id))}
                    className="text-slate-500 hover:text-rose-400 text-xs px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                placeholder="Add sub-action..."
                className="flex-1 bg-[#06080D] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#B4F000]"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#B4F000] hover:bg-[#c6ff1a] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(180,240,0,0.3)] cursor-pointer"
            >
              Add to Workspace
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

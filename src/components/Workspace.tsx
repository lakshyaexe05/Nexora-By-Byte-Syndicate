import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Check, Clock, AlertCircle, RefreshCw, 
  Trash2, Play, ChevronRight, RotateCcw, Filter, Calendar, Sparkles
} from 'lucide-react';
import { TaskCategory, TaskItem, TaskPriority } from '../types';

interface WorkspaceProps {
  tasks: TaskItem[];
  onToggleTaskStatus: (taskId: string) => void;
  onOpenTaskDetail: (task: TaskItem) => void;
  onOpenAddTask: () => void;
  onOpenSmartReschedule: () => void;
  onOpenFocusTask: (task: TaskItem) => void;
  onResetDemo: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  tasks,
  onToggleTaskStatus,
  onOpenTaskDetail,
  onOpenAddTask,
  onOpenSmartReschedule,
  onOpenFocusTask,
  onResetDemo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | TaskCategory>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | TaskPriority>('All');

  const categories: ('All' | TaskCategory)[] = ['All', 'Study', 'Personal', 'Work', 'Health'];

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.steps.some((s) => s.text.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [tasks, searchQuery, selectedCategory, priorityFilter]);

  // Today vs Upcoming split
  const todayTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.deadlineLabel === 'Today' || t.deadlineLabel === 'Tomorrow' || !t.deadlineLabel);
  }, [filteredTasks]);

  const upcomingTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.deadlineLabel && t.deadlineLabel !== 'Today' && t.deadlineLabel !== 'Tomorrow');
  }, [filteredTasks]);

  // Completion calculation
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = totalCount - completedCount;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalMinutes = tasks.reduce((acc, t) => acc + (t.status !== 'completed' ? t.durationMinutes : 0), 0);
  const plannedHours = Math.floor(totalMinutes / 60);
  const plannedMins = totalMinutes % 60;

  return (
    <section id="workspace" className="py-24 bg-[#080B12] relative overflow-hidden border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Shell */}
        <div className="rounded-3xl bg-[#0C101A] border border-white/[0.09] shadow-2xl p-6 sm:p-8">
          
          {/* Top Header Strip: Brand Title, Search, Category Tabs, Add Task */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            
            {/* Wordmark */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">NEXORA</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#B4F000]/15 text-[#B4F000] font-semibold border border-[#B4F000]/30">
                  Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Live interactive task execution and schedule management</p>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, sub-steps..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#06080D] border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#B4F000]"
              />
            </div>

            {/* Actions: "I'm running late" & "+ Add Task" */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenSmartReschedule}
                className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer interactive-tap active:scale-[0.98]"
                title="Reorganize remaining tasks when running behind schedule"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>I'm running late</span>
              </button>

              <button
                onClick={onOpenAddTask}
                className="px-5 py-2 rounded-xl bg-[#B4F000] hover:bg-[#c6ff1a] text-black text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(180,240,0,0.3)] cursor-pointer interactive-tap active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Filter Bar Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-white/[0.06]">
            {/* Category Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#B4F000] text-black font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Priority and Reset buttons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="bg-[#06080D] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <button
                onClick={onResetDemo}
                title="Reset tasks to initial reference demo dataset"
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/10 text-xs flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>
            </div>
          </div>

          {/* Main 3-Column Workspace Grid (Today, Upcoming, Quick Stats) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            
            {/* Column 1: Today's Tasks (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Column Header & Progress */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B4F000]" />
                    <span>Today's Focus</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {completedCount} / {totalCount} completed ({completionPercent}%)
                  </span>
                </div>

                <span className="text-xs font-mono text-slate-400">
                  {todayTasks.length} active
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-[#B4F000] rounded-full transition-all duration-500 shadow-[0_0_10px_#B4F000]"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>

              {/* Task Items List */}
              <div className="space-y-3 pt-2">
                {todayTasks.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-xs text-slate-400">
                    No matching tasks found. Click "+ Add Task" or reset filters.
                  </div>
                ) : (
                  todayTasks.map((task) => {
                    const isDone = task.status === 'completed';
                    const completedSteps = task.steps.filter((s) => s.completed).length;
                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 group flex items-start justify-between gap-3 animate-in fade-in duration-200 ${
                          isDone
                            ? 'bg-[#080B12]/60 border-white/[0.05] opacity-70'
                            : 'bg-[#101624] border-white/[0.08] hover:border-[#B4F000]/40 hover:bg-[#131b2e]'
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => onToggleTaskStatus(task.id)}
                          className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-all cursor-pointer interactive-tap ${
                            isDone
                              ? 'bg-[#B4F000] border-[#B4F000] text-black'
                              : 'border-slate-500 hover:border-[#B4F000]'
                          }`}
                          aria-label={`Mark ${task.title} as ${isDone ? 'pending' : 'completed'}`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        {/* Title & Details */}
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => onOpenTaskDetail(task)}
                        >
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-semibold transition-colors ${
                                isDone ? 'line-through text-slate-500' : 'text-white group-hover:text-[#B4F000]'
                              }`}
                            >
                              {task.title}
                            </h4>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                                task.priority === 'High'
                                  ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                                  : task.priority === 'Medium'
                                  ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                                  : 'text-sky-400 border-sky-500/30 bg-sky-500/10'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {/* Metadata row */}
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                            <span>{task.category}</span>
                            <span>·</span>
                            <span className="font-mono text-slate-300">{task.durationMinutes}m</span>
                            {task.scheduledTime && (
                              <>
                                <span>·</span>
                                <span className="font-mono text-sky-400">{task.scheduledTime}</span>
                              </>
                            )}
                            {task.steps.length > 0 && (
                              <>
                                <span>·</span>
                                <span>
                                  {completedSteps}/{task.steps.length} steps
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Quick Focus Button */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => onOpenFocusTask(task)}
                            title="Start distraction-free Focus Mode with timer"
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-[#B4F000] hover:text-black text-slate-400 transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button
                            onClick={() => onOpenTaskDetail(task)}
                            className="p-1.5 text-slate-500 hover:text-white"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Column 2: Upcoming Commitments (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>Upcoming</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {upcomingTasks.length} queued
                </span>
              </div>

              <div className="space-y-3">
                {upcomingTasks.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-500">
                    No upcoming items scheduled.
                  </div>
                ) : (
                  upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onOpenTaskDetail(task)}
                      className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-white group-hover:text-[#B4F000]">
                          {task.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {task.deadlineLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2 font-mono">
                        <span>{task.durationMinutes}m</span>
                        <span>·</span>
                        <span className="text-slate-300">{task.priority}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 3: Quick Stats & Radial Progress (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-base font-bold text-white">Quick Stats</h3>

              <div className="p-5 rounded-2xl bg-[#090D16] border border-white/[0.08] flex flex-col items-center text-center space-y-4">
                
                {/* Radial Progress Ring */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#B4F000"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * completionPercent) / 100}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-700 drop-shadow-[0_0_8px_#B4F000]"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-white font-mono">{completionPercent}%</span>
                    <span className="text-[9px] block text-slate-400 uppercase tracking-wider">Done</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="w-full space-y-2 pt-2 border-t border-white/5 text-xs text-left">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Total Tasks:</span>
                    <span className="font-mono font-bold text-white">{totalCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Completed:</span>
                    <span className="font-mono font-bold text-emerald-400">{completedCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Remaining:</span>
                    <span className="font-mono font-bold text-amber-400">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Workload Left:</span>
                    <span className="font-mono font-bold text-sky-400">
                      {plannedHours > 0 ? `${plannedHours}h ` : ''}{plannedMins}m
                    </span>
                  </div>
                </div>

                {/* Reschedule Callout */}
                <button
                  onClick={onOpenSmartReschedule}
                  className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reschedule Remaining</span>
                </button>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

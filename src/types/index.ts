export type TaskCategory = 'Study' | 'Personal' | 'Work' | 'Health';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'deferred';

export interface TaskStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  durationMinutes: number;
  scheduledTime?: string; // e.g. "09:00", "10:45"
  deadlineLabel?: string; // e.g. "Tomorrow", "3 days left", "This weekend"
  status: TaskStatus;
  steps: TaskStep[];
  reasoning?: string;
  energyRequired?: 'Low' | 'Medium' | 'High';
}

export interface PlanRequest {
  prompt: string;
  availableMinutes: number;
  energyLevel: 'Low' | 'Medium' | 'High';
  focusArea: 'All' | TaskCategory;
}

export interface PlanResponse {
  tasks: TaskItem[];
  reasoning: string;
  summary: string;
  isFallback?: boolean;
}

export interface RescheduleProposal {
  remainingMinutes: number;
  explanation: string;
  retainedTasks: TaskItem[];
  shortenedTasks: { taskId: string; title: string; oldDuration: number; newDuration: number }[];
  deferredTasks: { taskId: string; title: string; deferredTo: string; reason: string }[];
  isFallback?: boolean;
}

export type AmbientSoundType = 'none' | 'binaural' | 'cosmos' | 'whitenoise';

export type JarvisState = 'idle' | 'listening' | 'processing' | 'speaking' | 'thinking' | 'acting' | 'success' | 'error';
export type EchoState = JarvisState;

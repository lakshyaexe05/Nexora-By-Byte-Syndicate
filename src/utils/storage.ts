import { TaskItem } from '../types';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Maths Assignment',
    category: 'Study',
    priority: 'High',
    durationMinutes: 90,
    scheduledTime: '09:00',
    deadlineLabel: 'Tomorrow',
    status: 'completed',
    reasoning: 'Critical calculus problem set due first thing tomorrow morning. Fresh morning energy allocated.',
    energyRequired: 'High',
    steps: [
      { id: 's-1-1', text: 'Read and understand question prompts', completed: true },
      { id: 's-1-2', text: 'Solve first 3 differential equations', completed: true },
      { id: 's-1-3', text: 'Take short 5-minute break', completed: true },
      { id: 's-1-4', text: 'Complete remaining questions 4 to 8', completed: true },
      { id: 's-1-5', text: 'Review calculations and compile PDF', completed: true }
    ]
  },
  {
    id: 'task-2',
    title: 'Physics Notes',
    category: 'Study',
    priority: 'High',
    durationMinutes: 60,
    scheduledTime: '10:45',
    deadlineLabel: 'Tomorrow',
    status: 'completed',
    reasoning: 'Synthesize thermodynamics and optics concepts before exam review session.',
    energyRequired: 'Medium',
    steps: [
      { id: 's-2-1', text: 'Summarize thermodynamic laws', completed: true },
      { id: 's-2-2', text: 'Highlight key formula sheet equations', completed: true },
      { id: 's-2-3', text: 'Practice 2 past paper numericals', completed: true }
    ]
  },
  {
    id: 'task-3',
    title: 'Project Report',
    category: 'Work',
    priority: 'Medium',
    durationMinutes: 90,
    scheduledTime: '12:30',
    deadlineLabel: '3 days left',
    status: 'completed',
    reasoning: 'Draft introduction and methodology sections while momentum is active.',
    energyRequired: 'Medium',
    steps: [
      { id: 's-3-1', text: 'Collate system architecture diagrams', completed: true },
      { id: 's-3-2', text: 'Draft section 1 & 2 methodology', completed: true },
      { id: 's-3-3', text: 'Export draft for peer feedback', completed: true }
    ]
  },
  {
    id: 'task-4',
    title: 'Exam Preparation',
    category: 'Study',
    priority: 'High',
    durationMinutes: 120,
    scheduledTime: '14:30',
    deadlineLabel: 'Tomorrow',
    status: 'in_progress',
    reasoning: 'Comprehensive timed practice test covering core test modules.',
    energyRequired: 'High',
    steps: [
      { id: 's-4-1', text: 'Review high-yield flashcards', completed: true },
      { id: 's-4-2', text: 'Complete 45-minute timed simulation', completed: false },
      { id: 's-4-3', text: 'Analyze mistakes and write memory cues', completed: false }
    ]
  },
  {
    id: 'task-5',
    title: 'Room Cleaning',
    category: 'Personal',
    priority: 'Medium',
    durationMinutes: 30,
    scheduledTime: '17:00',
    deadlineLabel: 'Sat, 25 Oct',
    status: 'pending',
    reasoning: 'Clear physical workspace clutter to reduce cognitive fatigue for evening review.',
    energyRequired: 'Low',
    steps: [
      { id: 's-5-1', text: 'Organize study desk and cables', completed: false },
      { id: 's-5-2', text: 'Clear floor and empty trash bin', completed: false },
      { id: 's-5-3', text: 'Air out room and restock water bottle', completed: false }
    ]
  },
  {
    id: 'task-6',
    title: 'Gym & Cardio',
    category: 'Health',
    priority: 'Low',
    durationMinutes: 45,
    scheduledTime: '18:00',
    deadlineLabel: 'Sat, 25 Oct',
    status: 'pending',
    reasoning: 'Moderate movement to stimulate dopamine and alleviate physical tension.',
    energyRequired: 'Medium',
    steps: [
      { id: 's-6-1', text: '10 min dynamic warmup & mobility', completed: false },
      { id: 's-6-2', text: '25 min resistance routine', completed: false },
      { id: 's-6-3', text: 'Cool down stretch & hydration', completed: false }
    ]
  },
  {
    id: 'task-7',
    title: "Friend's Birthday Prep",
    category: 'Personal',
    priority: 'Low',
    durationMinutes: 30,
    scheduledTime: '20:00',
    deadlineLabel: 'This weekend',
    status: 'pending',
    reasoning: 'Order gift and RSVP to weekend gathering.',
    energyRequired: 'Low',
    steps: [
      { id: 's-7-1', text: 'Select digital gift card or delivery', completed: false },
      { id: 's-7-2', text: 'Send RSVP message in group chat', completed: false }
    ]
  }
];

const STORAGE_KEY = 'nexora_tasks_v1';

export function loadSavedTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load tasks from localStorage, using initial sample:', e);
  }
  return INITIAL_TASKS;
}

export function saveTasks(tasks: TaskItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to save tasks to localStorage:', e);
  }
}

export function resetToDemoTasks(): TaskItem[] {
  saveTasks(INITIAL_TASKS);
  return INITIAL_TASKS;
}

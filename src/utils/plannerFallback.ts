import { PlanRequest, PlanResponse, RescheduleProposal, TaskItem } from '../types';

export function generateHeuristicPlan(req: PlanRequest): PlanResponse {
  const { prompt, availableMinutes, energyLevel, focusArea } = req;
  const lower = prompt.toLowerCase();

  const minutesBudget = availableMinutes || 120;
  let tasks: TaskItem[] = [];
  let summary = '';
  let reasoning = '';

  if (lower.includes('exam') || lower.includes('study') || lower.includes('assignment') || focusArea === 'Study') {
    summary = `Optimized study roadmap allocating ${minutesBudget} minutes with calibrated review intervals for ${energyLevel.toLowerCase()} energy.`;
    reasoning = `High-yield concepts are prioritized upfront when cognitive reserves are freshest. Low-energy breaks are interleaved to prevent burnout.`;

    if (minutesBudget <= 60) {
      tasks = [
        {
          id: `task-${Date.now()}-1`,
          title: 'High-Yield Formula & Core Review',
          category: 'Study',
          priority: 'High',
          durationMinutes: Math.round(minutesBudget * 0.65),
          scheduledTime: '09:00',
          deadlineLabel: 'Tomorrow',
          status: 'pending',
          reasoning: 'Focus exclusively on the 20% of formulas generating 80% of exam questions.',
          energyRequired: 'High',
          steps: [
            { id: 'step-1', text: 'Scan past exam question types', completed: false },
            { id: 'step-2', text: 'Drill 4 top-priority problem templates', completed: false }
          ]
        },
        {
          id: `task-${Date.now()}-2`,
          title: 'Speed Flashcard Recall',
          category: 'Study',
          priority: 'Medium',
          durationMinutes: Math.round(minutesBudget * 0.35),
          scheduledTime: '09:40',
          deadlineLabel: 'Tomorrow',
          status: 'pending',
          reasoning: 'Active recall reinforcement for high-friction definitions.',
          energyRequired: 'Low',
          steps: [
            { id: 'step-3', text: 'Run rapid 15-minute Leitner deck session', completed: false }
          ]
        }
      ];
    } else {
      tasks = [
        {
          id: `task-${Date.now()}-1`,
          title: 'Core Concepts & Problem Solving',
          category: 'Study',
          priority: 'High',
          durationMinutes: Math.round(minutesBudget * 0.5),
          scheduledTime: '09:00',
          deadlineLabel: 'Tomorrow',
          status: 'pending',
          reasoning: 'Target most difficult concepts first while mental bandwidth is peaked.',
          energyRequired: 'High',
          steps: [
            { id: 'step-1', text: 'Review weak chapter highlights', completed: false },
            { id: 'step-2', text: 'Solve 3 previous year exam problems', completed: false },
            { id: 'step-3', text: 'Verify step-by-step solutions', completed: false }
          ]
        },
        {
          id: `task-${Date.now()}-2`,
          title: 'Consolidation & Short Break',
          category: 'Health',
          priority: 'Medium',
          durationMinutes: 15,
          scheduledTime: '10:00',
          deadlineLabel: 'Today',
          status: 'pending',
          reasoning: '15-minute active recovery to let working memory consolidate neural pathways.',
          energyRequired: 'Low',
          steps: [
            { id: 'step-4', text: 'Hydrate and step away from screens', completed: false }
          ]
        },
        {
          id: `task-${Date.now()}-3`,
          title: 'Timed Simulation & Mistake Audit',
          category: 'Study',
          priority: 'High',
          durationMinutes: Math.max(30, minutesBudget - Math.round(minutesBudget * 0.5) - 15),
          scheduledTime: '10:15',
          deadlineLabel: 'Tomorrow',
          status: 'pending',
          reasoning: 'Test readiness under realistic constraints and log recurring errors.',
          energyRequired: 'Medium',
          steps: [
            { id: 'step-5', text: 'Complete timed 30-min trial run', completed: false },
            { id: 'step-6', text: 'Review incorrect answers in red pen', completed: false }
          ]
        }
      ];
    }
  } else if (lower.includes('clean') || lower.includes('room') || lower.includes('organize') || focusArea === 'Personal') {
    summary = `Micro-zoned declutter sprint designed for high spatial impact in ${minutesBudget} minutes.`;
    reasoning = `Clear visible flat surfaces first to yield immediate visual calm and neurochemical momentum.`;
    tasks = [
      {
        id: `task-${Date.now()}-1`,
        title: 'Desk & Workstation Surface Reset',
        category: 'Personal',
        priority: 'High',
        durationMinutes: Math.round(minutesBudget * 0.4),
        scheduledTime: '11:00',
        deadlineLabel: 'Today',
        status: 'pending',
        reasoning: 'Directly impacts concentration for subsequent tasks.',
        energyRequired: 'Low',
        steps: [
          { id: 'step-1', text: 'File loose documents and receipts', completed: false },
          { id: 'step-2', text: 'Wipe surface and organize cables', completed: false }
        ]
      },
      {
        id: `task-${Date.now()}-2`,
        title: 'Floor & Wardrobe Sort',
        category: 'Personal',
        priority: 'Medium',
        durationMinutes: Math.round(minutesBudget * 0.4),
        scheduledTime: '11:30',
        deadlineLabel: 'Today',
        status: 'pending',
        reasoning: 'Clears walkways and eliminates background visual noise.',
        energyRequired: 'Medium',
        steps: [
          { id: 'step-3', text: 'Sort laundry into basket', completed: false },
          { id: 'step-4', text: 'Empty trash cans and open window', completed: false }
        ]
      },
      {
        id: `task-${Date.now()}-3`,
        title: 'Quick Vacuum / Dusting',
        category: 'Personal',
        priority: 'Low',
        durationMinutes: Math.max(15, minutesBudget - Math.round(minutesBudget * 0.8)),
        scheduledTime: '11:50',
        deadlineLabel: 'Today',
        status: 'pending',
        reasoning: 'Final sensory polish.',
        energyRequired: 'Low',
        steps: [
          { id: 'step-5', text: 'Quick sweep and dusting of main surfaces', completed: false }
        ]
      }
    ];
  } else {
    // General structured day plan
    summary = `Balanced productivity schedule fitting ${minutesBudget} minutes with priority tiers.`;
    reasoning = `High-importance actions scheduled first, followed by administrative and recovery tasks.`;
    tasks = [
      {
        id: `task-${Date.now()}-1`,
        title: prompt.slice(0, 45) || 'Primary Focus Goal',
        category: focusArea === 'All' ? 'Work' : focusArea,
        priority: 'High',
        durationMinutes: Math.round(minutesBudget * 0.6),
        scheduledTime: '09:00',
        deadlineLabel: 'Today',
        status: 'pending',
        reasoning: 'Core objective that delivers 80% of today’s meaningful output.',
        energyRequired: 'High',
        steps: [
          { id: 'step-1', text: 'Define exact acceptance criteria', completed: false },
          { id: 'step-2', text: 'Execute core milestone blocks', completed: false },
          { id: 'step-3', text: 'Verify output against expectations', completed: false }
        ]
      },
      {
        id: `task-${Date.now()}-2`,
        title: 'Administrative Follow-ups & Next Steps',
        category: 'Personal',
        priority: 'Medium',
        durationMinutes: Math.max(20, minutesBudget - Math.round(minutesBudget * 0.6)),
        scheduledTime: '10:15',
        deadlineLabel: 'Today',
        status: 'pending',
        reasoning: 'Ensure deliverables are communicated and logged.',
        energyRequired: 'Low',
        steps: [
          { id: 'step-4', text: 'Clear related emails and notifications', completed: false },
          { id: 'step-5', text: 'Log updates in task tracker', completed: false }
        ]
      }
    ];
  }

  return {
    tasks,
    reasoning,
    summary,
    isFallback: true
  };
}

export function generateHeuristicReschedule(
  currentTasks: TaskItem[],
  remainingMinutes: number
): RescheduleProposal {
  // Filter pending or in-progress tasks
  const pendingTasks = currentTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  
  if (pendingTasks.length === 0) {
    return {
      remainingMinutes,
      explanation: "All current tasks are already completed! You're free for the remainder of your time.",
      retainedTasks: [],
      shortenedTasks: [],
      deferredTasks: [],
      isFallback: true
    };
  }

  // Sort by priority (High -> Medium -> Low)
  const priorityScore = { High: 3, Medium: 2, Low: 1 };
  const sorted = [...pendingTasks].sort((a, b) => priorityScore[b.priority] - priorityScore[a.priority]);

  let accumulatedTime = 0;
  const retainedTasks: TaskItem[] = [];
  const shortenedTasks: { taskId: string; title: string; oldDuration: number; newDuration: number }[] = [];
  const deferredTasks: { taskId: string; title: string; deferredTo: string; reason: string }[] = [];

  for (const task of sorted) {
    if (accumulatedTime + task.durationMinutes <= remainingMinutes) {
      retainedTasks.push(task);
      accumulatedTime += task.durationMinutes;
    } else {
      const availableSlack = remainingMinutes - accumulatedTime;
      // If high priority and we have at least 20 minutes left, compress it!
      if (task.priority === 'High' && availableSlack >= 20) {
        shortenedTasks.push({
          taskId: task.id,
          title: task.title,
          oldDuration: task.durationMinutes,
          newDuration: availableSlack
        });
        retainedTasks.push({
          ...task,
          durationMinutes: availableSlack,
          reasoning: `Compressed from ${task.durationMinutes}m to ${availableSlack}m to preserve critical deadline.`
        });
        accumulatedTime += availableSlack;
      } else {
        deferredTasks.push({
          taskId: task.id,
          title: task.title,
          deferredTo: task.deadlineLabel || 'Tomorrow',
          reason: task.priority === 'Low'
            ? 'Lower priority task deferred to ensure critical commitments finish.'
            : 'Insufficient remaining time. Rescheduled to prevent rushed quality.'
        });
      }
    }
  }

  const explanation = `With only ${remainingMinutes} minutes remaining, NEXORA prioritized ${retainedTasks.length} essential item${retainedTasks.length === 1 ? '' : 's'}. ${shortenedTasks.length > 0 ? `Compressed ${shortenedTasks.map(t => t.title).join(', ')} to fit the window.` : ''} Postponed ${deferredTasks.length} non-urgent item${deferredTasks.length === 1 ? '' : 's'} without compromising quality.`;

  return {
    remainingMinutes,
    explanation,
    retainedTasks,
    shortenedTasks,
    deferredTasks,
    isFallback: true
  };
}

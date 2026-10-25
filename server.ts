import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Type, Modality, LiveServerMessage } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(express.static('public'));

// Initialize Google Gen AI client if key exists
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('[NEXORA Server] Gemini AI client initialized successfully.');
  } catch (err) {
    console.warn('[NEXORA Server] Failed to initialize Gemini AI client:', err);
  }
} else {
  console.log('[NEXORA Server] No active GEMINI_API_KEY found. Utilizing intelligent heuristic fallback engine.');
}

function withTimeout<T>(promise: Promise<T>, ms: number = 30000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('UPSTREAM_TIMEOUT')), ms))
  ]);
}

// Resilient helper to call Gemini models with automatic multi-model failover
async function generateGeminiContent(options: {
  contents: any;
  config?: any;
  preferredModel?: string;
  timeoutMs?: number;
}): Promise<{ response: any; modelUsed: string }> {
  if (!ai) throw new Error('AI_CLIENT_NOT_INITIALIZED');
  const timeoutMs = options.timeoutMs || 25000;
  const models = Array.from(new Set([
    options.preferredModel || 'gemini-3.1-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
  ])).filter(Boolean);

  let lastError: any = null;
  for (const model of models) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        }),
        timeoutMs
      );
      return { response, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      console.warn(`[NEXORA Server] Model ${model} request did not succeed (${err?.status || err?.message || 'error'}). Trying fallback...`);
    }
  }
  throw lastError;
}

// Heuristic fallback implementations
function localFallbackPlan(prompt: string, availableMinutes: number, energyLevel: string, focusArea: string) {
  const budget = availableMinutes || 120;
  const isStudy = /exam|study|math|physics|assignment/i.test(prompt) || focusArea === 'Study';
  const isCleaning = /clean|room|organize|tidy/i.test(prompt) || focusArea === 'Personal';

  if (isStudy) {
    return {
      summary: `High-yield study schedule optimized for ${budget} minutes (${energyLevel} energy).`,
      reasoning: 'Frontloads complex problem-solving into the first peak cognitive block, with timed recall review at the end.',
      tasks: [
        {
          id: `task-${Date.now()}-1`,
          title: 'High-Yield Formula & Problem Practice',
          category: 'Study',
          priority: 'High',
          durationMinutes: Math.round(budget * 0.55),
          scheduledTime: '09:00',
          deadlineLabel: 'Tomorrow',
          status: 'pending',
          reasoning: 'Calculus and physics core theorems that make up the highest question percentage.',
          energyRequired: 'High',
          steps: [
            { id: 'st-1', text: 'Review core theorems & formula sheet', completed: false },
            { id: 'st-2', text: 'Solve 3 previous exam questions', completed: false },
            { id: 'st-3', text: 'Audit calculations and tag errors', completed: false }
          ]
        },
        {
          id: `task-${Date.now()}-2`,
          title: 'Active Recall Leitner Review',
          category: 'Study',
          priority: 'Medium',
          durationMinutes: Math.max(25, budget - Math.round(budget * 0.55) - 15),
          scheduledTime: '10:00',
          deadlineLabel: 'Tomorrow',
          status: 'pending',
          reasoning: 'Consolidate memory cues while fatigue is manageable.',
          energyRequired: 'Medium',
          steps: [
            { id: 'st-4', text: 'Speed-drill high-friction flashcards', completed: false },
            { id: 'st-5', text: 'Summarize key takeaways in one page', completed: false }
          ]
        },
        {
          id: `task-${Date.now()}-3`,
          title: 'Hydration & Neural Rest',
          category: 'Health',
          priority: 'Low',
          durationMinutes: 15,
          scheduledTime: '10:45',
          deadlineLabel: 'Today',
          status: 'pending',
          reasoning: 'Allow working memory to transfer knowledge to long-term storage.',
          energyRequired: 'Low',
          steps: [
            { id: 'st-6', text: 'Step away from screen and stretch', completed: false }
          ]
        }
      ],
      isFallback: true
    };
  }

  if (isCleaning) {
    return {
      summary: `Room reset and declutter blitz for ${budget} minutes.`,
      reasoning: 'Clears visible flat surfaces first to lower mental strain and build rapid momentum.',
      tasks: [
        {
          id: `task-${Date.now()}-1`,
          title: 'Desk & Workstation Surface Reset',
          category: 'Personal',
          priority: 'High',
          durationMinutes: Math.round(budget * 0.45),
          scheduledTime: '11:00',
          deadlineLabel: 'Today',
          status: 'pending',
          reasoning: 'Clear desktop visual noise to restore immediate focus.',
          energyRequired: 'Low',
          steps: [
            { id: 'st-1', text: 'Sort papers, loose cables, and cups', completed: false },
            { id: 'st-2', text: 'Wipe surface and align desk lamp', completed: false }
          ]
        },
        {
          id: `task-${Date.now()}-2`,
          title: 'Floor & Wardrobe Sort',
          category: 'Personal',
          priority: 'Medium',
          durationMinutes: Math.max(20, budget - Math.round(budget * 0.45)),
          scheduledTime: '11:30',
          deadlineLabel: 'Today',
          status: 'pending',
          reasoning: 'Clear open floor paths and bag recyclables.',
          energyRequired: 'Medium',
          steps: [
            { id: 'st-3', text: 'Put clean laundry away & empty bin', completed: false }
          ]
        }
      ],
      isFallback: true
    };
  }

  return {
    summary: `Structured execution plan allocating ${budget} minutes with priority tiers.`,
    reasoning: 'Decomposes primary goal into prioritized action chunks with verified time constraints.',
    tasks: [
      {
        id: `task-${Date.now()}-1`,
        title: prompt.slice(0, 48) || 'Core Execution Sprint',
        category: (focusArea === 'All' ? 'Work' : focusArea) as any,
        priority: 'High',
        durationMinutes: Math.round(budget * 0.65),
        scheduledTime: '09:00',
        deadlineLabel: 'Today',
        status: 'pending',
        reasoning: 'Primary lever that delivers 80% of desired outcome.',
        energyRequired: 'High',
        steps: [
          { id: 'st-1', text: 'Define deliverables and key acceptance criteria', completed: false },
          { id: 'st-2', text: 'Execute main implementation chunk', completed: false },
          { id: 'st-3', text: 'Review against quality standard', completed: false }
        ]
      },
      {
        id: `task-${Date.now()}-2`,
        title: 'Review & Wrap-up',
        category: 'Personal',
        priority: 'Medium',
        durationMinutes: Math.max(20, budget - Math.round(budget * 0.65)),
        scheduledTime: '10:20',
        deadlineLabel: 'Today',
        status: 'pending',
        reasoning: 'Close loop and log next day action points.',
        energyRequired: 'Low',
        steps: [
          { id: 'st-4', text: 'Organize completed artifacts and notes', completed: false }
        ]
      }
    ],
    isFallback: true
  };
}

// 1. Natural Language Plan Generation Route
app.post('/api/gemini/plan', async (req, res) => {
  const { prompt, availableMinutes, energyLevel, focusArea } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'A prompt description is required.' });
  }

  const minutes = Number(availableMinutes) || 120;
  const energy = energyLevel || 'Medium';
  const category = focusArea || 'All';

  if (!ai) {
    const result = localFallbackPlan(prompt, minutes, energy, category);
    return res.json(result);
  }

  try {
    const systemInstruction = `You are NEXORA, an intelligent everyday-life planning assistant by BYTE SYNDICATE.
Your task is to take an everyday request, available time (${minutes} minutes), energy level (${energy}), and category (${category}),
and decompose it into a realistic, chronologically ordered task schedule.
CRITICAL RULES:
1. The total duration of all tasks MUST NOT exceed ${minutes} minutes.
2. Break large goals into clear, actionable steps.
3. Prioritize high-importance and urgent tasks first.
4. Provide a clear reasoning for why the schedule is arranged this way.
5. Return JSON matching the requested schema.`;

    const { response, modelUsed } = await generateGeminiContent({
      contents: `User goal: "${prompt}". Available time: ${minutes} minutes. Energy level: ${energy}. Focus area: ${category}. Generate an actionable schedule.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: '1-sentence punchy summary of the plan' },
            reasoning: { type: Type.STRING, description: 'Clear explanation of scheduling decisions and energy alignment' },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ['Study', 'Personal', 'Work', 'Health'] },
                  priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                  durationMinutes: { type: Type.INTEGER },
                  scheduledTime: { type: Type.STRING },
                  deadlineLabel: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  energyRequired: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING }
                      },
                      required: ['text']
                    }
                  }
                },
                required: ['title', 'category', 'priority', 'durationMinutes', 'steps']
              }
            }
          },
          required: ['summary', 'reasoning', 'tasks']
        }
      },
      preferredModel: 'gemini-3.1-flash-lite',
      timeoutMs: 25000
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.tasks && Array.isArray(parsed.tasks)) {
      const formattedTasks = parsed.tasks.map((t: any, idx: number) => ({
        id: `gemini-task-${Date.now()}-${idx}`,
        title: t.title,
        category: t.category || (category === 'All' ? 'Study' : category),
        priority: t.priority || 'Medium',
        durationMinutes: t.durationMinutes || 30,
        scheduledTime: t.scheduledTime || `${9 + idx}:00`,
        deadlineLabel: t.deadlineLabel || 'Today',
        status: 'pending',
        reasoning: t.reasoning || '',
        energyRequired: t.energyRequired || energy,
        steps: (t.steps || []).map((s: any, sIdx: number) => ({
          id: `step-${Date.now()}-${idx}-${sIdx}`,
          text: s.text || s,
          completed: false
        }))
      }));

      return res.json({
        summary: parsed.summary || 'Custom schedule created.',
        reasoning: parsed.reasoning || 'Arranged according to priority and energy.',
        tasks: formattedTasks,
        isFallback: false
      });
    }

    // Fallback if parsing failed
    return res.json(localFallbackPlan(prompt, minutes, energy, category));
  } catch (err) {
    console.warn('[NEXORA Server] Gemini plan API error, using heuristic fallback:', err);
    return res.json(localFallbackPlan(prompt, minutes, energy, category));
  }
});

// 2. Smart Reschedule Route ("I'm running late")
app.post('/api/gemini/reschedule', async (req, res) => {
  const { currentTasks, remainingMinutes, reason } = req.body;
  const remaining = Number(remainingMinutes) || 60;
  const tasks = Array.isArray(currentTasks) ? currentTasks : [];

  const pending = tasks.filter((t: any) => t.status === 'pending' || t.status === 'in_progress');

  if (pending.length === 0) {
    return res.json({
      remainingMinutes: remaining,
      explanation: 'All current tasks are already finished! No rescheduling needed.',
      retainedTasks: [],
      shortenedTasks: [],
      deferredTasks: [],
      isFallback: true
    });
  }

  // If Gemini client is not initialized, run algorithmic heuristic rebalancer
  if (!ai) {
    const priorityScore: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
    const sorted = [...pending].sort((a, b) => (priorityScore[b.priority] || 1) - (priorityScore[a.priority] || 1));

    let accumulatedTime = 0;
    const retainedTasks: any[] = [];
    const shortenedTasks: any[] = [];
    const deferredTasks: any[] = [];

    for (const task of sorted) {
      if (accumulatedTime + task.durationMinutes <= remaining) {
        retainedTasks.push(task);
        accumulatedTime += task.durationMinutes;
      } else {
        const slack = remaining - accumulatedTime;
        if (task.priority === 'High' && slack >= 20) {
          shortenedTasks.push({
            taskId: task.id,
            title: task.title,
            oldDuration: task.durationMinutes,
            newDuration: slack
          });
          retainedTasks.push({
            ...task,
            durationMinutes: slack,
            reasoning: `Compressed from ${task.durationMinutes}m to ${slack}m to protect critical deadline.`
          });
          accumulatedTime += slack;
        } else {
          deferredTasks.push({
            taskId: task.id,
            title: task.title,
            deferredTo: task.deadlineLabel || 'Tomorrow',
            reason: task.priority === 'Low' ? 'Lower priority task deferred.' : 'Time limit reached; moved to avoid rushed mistakes.'
          });
        }
      }
    }

    return res.json({
      remainingMinutes: remaining,
      explanation: `With ${remaining} minutes left, NEXORA preserved ${retainedTasks.length} high-impact task${retainedTasks.length === 1 ? '' : 's'} and postponed ${deferredTasks.length} non-urgent item${deferredTasks.length === 1 ? '' : 's'}.`,
      retainedTasks,
      shortenedTasks,
      deferredTasks,
      isFallback: true
    });
  }

  try {
    const prompt = `User is running late.
Remaining time budget: ${remaining} minutes.
Reason/Context: ${reason || 'Running late on schedule'}.
Current pending tasks: ${JSON.stringify(pending.map((t: any) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      durationMinutes: t.durationMinutes,
      deadlineLabel: t.deadlineLabel
    })))}.
Rebalance the schedule so total retained duration <= ${remaining} minutes.
Identify which tasks should be retained, which should be compressed in duration, and which should be deferred to tomorrow or later.`;

    const { response, modelUsed } = await generateGeminiContent({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            retainedTaskIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            shortenedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskId: { type: Type.STRING },
                  newDuration: { type: Type.INTEGER }
                },
                required: ['taskId', 'newDuration']
              }
            },
            deferredTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskId: { type: Type.STRING },
                  deferredTo: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ['taskId', 'deferredTo', 'reason']
              }
            }
          },
          required: ['explanation', 'retainedTaskIds', 'deferredTasks']
        }
      },
      preferredModel: 'gemini-3.1-flash-lite',
      timeoutMs: 25000
    });

    const parsed = JSON.parse(response.text || '{}');
    const shortenedMap = new Map((parsed.shortenedTasks || []).map((s: any) => [s.taskId, s.newDuration]));
    const retainedTasks: any[] = [];
    const shortenedTasksFormatted: any[] = [];

    (parsed.retainedTaskIds || []).forEach((id: string) => {
      const orig = pending.find((t: any) => t.id === id);
      if (orig) {
        if (shortenedMap.has(id)) {
          const newDur = shortenedMap.get(id);
          shortenedTasksFormatted.push({
            taskId: id,
            title: orig.title,
            oldDuration: orig.durationMinutes,
            newDuration: newDur
          });
          retainedTasks.push({ ...orig, durationMinutes: newDur });
        } else {
          retainedTasks.push(orig);
        }
      }
    });

    const deferredTasksFormatted = (parsed.deferredTasks || []).map((d: any) => {
      const orig = pending.find((t: any) => t.id === d.taskId);
      return {
        taskId: d.taskId,
        title: orig ? orig.title : 'Deferred Task',
        deferredTo: d.deferredTo || 'Tomorrow',
        reason: d.reason || 'Deferred to prevent schedule overflow'
      };
    });

    return res.json({
      remainingMinutes: remaining,
      explanation: parsed.explanation || `Rebalanced schedule for ${remaining} minutes.`,
      retainedTasks,
      shortenedTasks: shortenedTasksFormatted,
      deferredTasks: deferredTasksFormatted,
      isFallback: false
    });
  } catch (err) {
    console.warn('[NEXORA Server] Gemini reschedule error, falling back:', err);
    // Algorithm fallback
    const priorityScore: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
    const sorted = [...pending].sort((a, b) => (priorityScore[b.priority] || 1) - (priorityScore[a.priority] || 1));

    let accumulatedTime = 0;
    const retainedTasks: any[] = [];
    const shortenedTasks: any[] = [];
    const deferredTasks: any[] = [];

    for (const task of sorted) {
      if (accumulatedTime + task.durationMinutes <= remaining) {
        retainedTasks.push(task);
        accumulatedTime += task.durationMinutes;
      } else {
        deferredTasks.push({
          taskId: task.id,
          title: task.title,
          deferredTo: task.deadlineLabel || 'Tomorrow',
          reason: 'Time budget exceeded.'
        });
      }
    }

    return res.json({
      remainingMinutes: remaining,
      explanation: `Heuristically prioritized ${retainedTasks.length} task${retainedTasks.length === 1 ? '' : 's'} fitting within ${remaining} minutes.`,
      retainedTasks,
      shortenedTasks,
      deferredTasks,
      isFallback: true
    });
  }
});

// 3. Multi-turn Chat Endpoint with Gemini models and role system instructions
app.post('/api/gemini/chat', async (req, res) => {
  const { messages, persona = 'general', currentTasks } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  // Model selection:
  // - 'complex': Deep strategic architectural prompt
  // - 'fast': Rapid triage coach prompt
  // - 'general' / default: JARVIS Holographic Intelligence
  let modelName = 'gemini-3.8-flash';
  let roleInstruction = '';

  if (persona === 'complex') {
    modelName = 'gemini-3.8-flash';
    roleInstruction = `You are the NEXORA Deep Strategic Architect by BYTE SYNDICATE.
Your role: High-depth cognitive planning, multi-constraint prioritization, deep project work breakdown, and scientific study technique optimization.
Provide thorough, structured, and insightful advice. Break down complex goals into rigorous execution phases.`;
  } else if (persona === 'fast') {
    modelName = 'gemini-3.1-flash-lite';
    roleInstruction = `You are the NEXORA Rapid Triage Coach by BYTE SYNDICATE.
Your role: Fast, punchy, immediate everyday triage. Keep responses short (under 3-4 bullet points), direct, and immediately actionable. Eliminate hesitation.`;
  } else {
    // JARVIS Holographic Intelligence (Sophisticated Male AI Butler & Strategic Partner)
    modelName = 'gemini-3.8-flash';
    roleInstruction = `You are JARVIS, an advanced male artificial intelligence and strategic executive partner for the NEXORA productivity platform, created by BYTE SYNDICATE.
Brand Tagline: "Your mind. Your universe." Team Slogan: "BUILD BEYOND LIMITS."
Persona & Delivery:
- Identity: Sophisticated, masculine, highly intelligent, and impeccably composed.
- Tone: Courteous, professional, calm under pressure, and articulate, with subtle, refined dry wit when appropriate.
- Speech & Writing Style: Evokes a cinematic AI butler and strategic advisor. Delivery is measured, precise, and reassuring without ever being robotic or verbose.
- Spoken/Voice Guidance: In spoken conversation, keep answers concise and natural (typically 1 to 3 sentences). In text, structure priorities cleanly with actionable steps.
- Example Greetings: "Good evening. JARVIS is online. What shall we work on?" / "At your service. Let us organize your commitments."
- Example Planning: "Understood. Let's establish your priorities and create a practical plan."
- Example Clarification: "Certainly. I require one detail before proceeding."
- Never refer to yourself as a language model, OpenAI, or generic chatbot. Always speak as JARVIS.`;
  }

  if (Array.isArray(currentTasks) && currentTasks.length > 0) {
    roleInstruction += `\nUser's current active tasks context: ${JSON.stringify(
      currentTasks.map((t: any) => ({ title: t.title, priority: t.priority, duration: t.durationMinutes, status: t.status }))
    )}. Refer to these tasks when relevant.`;
  }

  if (!ai) {
    const lastUserMsg = messages[messages.length - 1]?.content || 'Hello';
    return res.json({
      role: 'model',
      content: `I'm here to help you structure your day! Regarding "${lastUserMsg.slice(
        0,
        50
      )}...", remember to protect your high-priority goals first and take 15-minute recovery intervals. How can we break down your next task?`,
      modelUsed: 'local-fallback'
    });
  }

  try {
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || '' }]
    }));

    const { response, modelUsed } = await generateGeminiContent({
      contents: formattedContents,
      config: {
        systemInstruction: roleInstruction,
      },
      preferredModel: modelName,
      timeoutMs: 25000,
    });

    return res.json({
      role: 'model',
      content: response.text || 'I processed your request. How else can I assist your schedule?',
      modelUsed
    });
  } catch (err: any) {
    console.warn('[NEXORA Server] Chat API error, using fallback response:', err?.message || err);
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    const lastLower = lastUserMsg.toLowerCase();
    let fallbackContent = "I've analyzed your priorities against your workspace commitments. Tackle your top-priority commitment first for 45 minutes with all notifications silenced, then take a short rest.";
    
    if (lastLower.includes('plan') || lastLower.includes('schedule')) {
      fallbackContent = "Here is an optimized sequence for your day:\n1. Peak Energy Block (45m): Tackle your most demanding task first.\n2. Rapid Execution Block (30m): Clear urgent communications and secondary tasks.\n3. Neural Rest & Audit (15m): Review deliverables and recharge before the afternoon.";
    } else if (lastLower.includes('prioritize') || lastLower.includes('priority')) {
      fallbackContent = "Prioritization analysis:\n• High Impact: Protect 45 minutes for your critical deliverable.\n• Moderate Impact: Handle scheduled reviews.\n• Low Impact: Defer non-critical items to protect your focus.";
    } else if (lastLower.includes('break') || lastLower.includes('goal')) {
      fallbackContent = "To overcome inertia on this goal, let's break it down into 3 micro-steps:\n1. Step 1 (5 mins): Outline the deliverable and gather required assets.\n2. Step 2 (25 mins): Write or build the first functional pass without judging quality.\n3. Step 3 (10 mins): Review, polish, and save your progress.";
    } else if (lastLower.includes('window') || lastLower.includes('45') || lastLower.includes('time')) {
      fallbackContent = "For a 45-minute open window, execute a single focused sprint: select one concrete high-friction task, set a 35-minute countdown, and keep 10 minutes to log next steps.";
    } else if (lastLower.includes('late') || lastLower.includes('behind')) {
      fallbackContent = "When running behind, do not try to rush everything. Drop or defer the bottom 50% of low-priority items, compress your next task to 30 minutes, and focus on finishing one thing well.";
    }

    return res.json({
      role: 'model',
      content: fallbackContent,
      modelUsed: 'heuristic-adaptive-fallback'
    });
  }
});

// 4. Live API Configuration & Status Check
app.get('/api/gemini/live-status', (_req, res) => {
  res.json({
    configured: Boolean(ai),
    model: 'gemini-3.8-live',
    voice: 'Orus',
    status: ai ? 'ready' : 'unconfigured',
    message: ai
      ? 'Gemini Live real-time bidirectional voice engine is ready.'
      : 'GEMINI_API_KEY environment variable is not set. Browser voice fallback is active.',
  });
});

// Setup static downloads route
app.use('/downloads', express.static(path.resolve('public/downloads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.zip')) {
      res.setHeader('Content-Type', 'application/zip');
      const filename = path.basename(filePath);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }
  }
}));

// Setup Vite middleware in dev or static files in production with WebSocket support
async function startServer() {
  const server = http.createServer(app);

  // Setup WebSocket server for Gemini Live bidirectional voice streaming
  const wss = new WebSocketServer({ server, path: '/api/live' });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('[Live WebSocket] New voice client connected.');

    if (!ai) {
      console.warn('[Live WebSocket] Client connected but GEMINI_API_KEY is not configured.');
      clientWs.send(
        JSON.stringify({
          error: 'Gemini API is not configured on the server. Please add GEMINI_API_KEY.',
        })
      );
      clientWs.close();
      return;
    }

    try {
      // Connect to official Gemini Live API (gemini-3.8-live)
      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Orus' },
            },
          },
          systemInstruction: `You are JARVIS, an advanced male artificial intelligence and strategic executive partner for the NEXORA productivity platform by BYTE SYNDICATE.
Persona & Vocal Delivery:
- Identity: Sophisticated, masculine, highly intelligent, and impeccably composed.
- Tone: Courteous, professional, calm under pressure, articulate, with subtle dry wit.
- Delivery: Low-register masculine delivery, refined British-style cadence, clear pronunciation, measured pacing, and calm confidence. Sound composed, precise, warm, and quietly authoritative rather than energetic or theatrical.
- Verbose Constraint: Spoken responses must be concise, conversational, and direct (typically 1 to 2 sentences, 3 max).
- Assist users with daily prioritization, overcoming scheduling friction, and high-yield focus.
- Never refer to yourself as a language model. Always speak as JARVIS.`,
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            const textData = message.serverContent?.modelTurn?.parts?.[0]?.text;

            if (audioData && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio: audioData, text: textData }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
            if (message.serverContent?.turnComplete && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ turnComplete: true }));
            }
          },
          onclose: () => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ status: 'closed' }));
            }
          },
          onerror: (err: any) => {
            console.warn('[Live WebSocket] Gemini session error:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ error: err?.message || 'Live session error' }));
            }
          },
        },
      });

      // Forward client audio packets to Gemini Live session
      clientWs.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (parsed.interrupted) {
            // User interrupted while JARVIS was speaking
          }
        } catch (err) {
          console.warn('[Live WebSocket] Packet parse error:', err);
        }
      });

      clientWs.on('close', () => {
        console.log('[Live WebSocket] Client disconnected.');
        try {
          session.close();
        } catch (e) {}
      });

      clientWs.on('error', (err) => {
        console.warn('[Live WebSocket] Client socket error:', err);
        try {
          session.close();
        } catch (e) {}
      });
    } catch (err: any) {
      console.error('[Live WebSocket] Failed to initialize Gemini Live session:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            error: err?.message || 'Failed to establish Gemini Live session.',
          })
        );
        clientWs.close();
      }
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXORA] Server listening on port ${PORT} (HTTP & Live WebSocket)`);
  });
}

startServer();

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JarvisHologram } from '../components/JarvisHologram';
import { JarvisHologramFace } from '../components/JarvisHologramFace';
import { useJarvisLive } from '../hooks/useJarvisLive';
import { useAppContext } from '../context/AppContext';
import { TaskItem, JarvisState } from '../types';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Layers,
  RotateCcw,
  Zap,
  Plus,
  Compass,
  Radio,
  Volume2,
  Square,
  AlertCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  suggestedTasks?: Partial<TaskItem>[];
}

export const ChatPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks, handleAddTask, showToast } = useAppContext();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [textChatState, setTextChatState] = useState<JarvisState>('idle');
  const [deployedTaskIds, setDeployedTaskIds] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Callback when voice conversation generates speech/transcript
  const handleLiveMessage = useCallback((role: 'user' | 'model', content: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role,
        content,
        timestamp: timeStr,
      },
    ]);
  }, []);

  // Initialize official Gemini Live bidirectional voice hook
  const {
    isVoiceActive,
    isConnecting,
    isListening,
    isSpeaking,
    isProcessing,
    jarvisState: liveState,
    audioLevel,
    liveMode,
    error: voiceError,
    startVoiceSession,
    endVoiceSession,
    interruptSpeaking,
  } = useJarvisLive(handleLiveMessage);

  // Active composite hologram state
  const currentHologramState: JarvisState = isVoiceActive
    ? liveState
    : textChatState !== 'idle'
    ? textChatState
    : 'idle';

  // Handle incoming prompt passed from route navigation
  useEffect(() => {
    if (location.state?.initialPrompt) {
      const prompt = location.state.initialPrompt;
      window.history.replaceState({}, document.title);
      handleSubmit(prompt);
    }
  }, [location.state]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentHologramState]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputValue]);

  const parseSuggestedTasks = (text: string): Partial<TaskItem>[] => {
    const found: Partial<TaskItem>[] = [];
    const lines = text.split('\n');

    lines.forEach((line, idx) => {
      const match = line.match(
        /^\s*(?:\d+\.|\*|-|Step \d+:)\s+(.+?)(?:\s*\((?:(\d+)\s*(?:m|min|mins|minutes)|high|medium|low)\))?$/i
      );
      if (match && match[1] && match[1].length > 5 && match[1].length < 75) {
        const title = match[1].replace(/\*\*/g, '').trim();
        const duration = match[2] ? parseInt(match[2], 10) : 30;
        found.push({
          id: `suggested-${Date.now()}-${idx}`,
          title,
          durationMinutes: duration,
          priority: idx === 0 ? 'High' : 'Medium',
          category: 'Personal',
          scheduledTime: `${9 + idx}:00`,
          status: 'pending',
          steps: [{ id: `step-${Date.now()}-${idx}-1`, text: 'Execute milestone', completed: false }],
        });
      }
    });

    return found.slice(0, 3);
  };

  const handleSubmit = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    if (isSpeaking) {
      interruptSpeaking();
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTextChatState('processing');

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          persona: 'jarvis',
          currentTasks: tasks.map((t) => ({
            title: t.title,
            priority: t.priority,
            duration: t.durationMinutes,
            status: t.status,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const aiContent =
        data.content ||
        'Good day. I have analyzed your schedule. What specific priority shall we organize?';

      const isPlanningIntent =
        text.toLowerCase().includes('plan') ||
        text.toLowerCase().includes('schedule') ||
        text.toLowerCase().includes('break') ||
        text.toLowerCase().includes('prioritize');

      const suggestedTasks = isPlanningIntent ? parseSuggestedTasks(aiContent) : [];

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: aiContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTasks: suggestedTasks.length > 0 ? suggestedTasks : undefined,
      };

      setTextChatState('speaking');
      setMessages([...newMessages, modelMsg]);

      setTimeout(() => {
        setTextChatState('idle');
      }, 2500);
    } catch (err) {
      console.error('Chat error:', err);
      setTextChatState('error');

      const fallbackMsg: ChatMessage = {
        id: `model-fallback-${Date.now()}`,
        role: 'model',
        content:
          'Understood. I have reviewed your current commitments. Protect 45 minutes for your primary priority deliverable with notifications muted, then take a short mental reset.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...newMessages, fallbackMsg]);
      setTimeout(() => {
        setTextChatState('idle');
      }, 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDeployTask = async (task: Partial<TaskItem>) => {
    const newTask: TaskItem = {
      id: `jarvis-task-${Date.now()}`,
      title: task.title || 'Focus Sprint',
      category: (task.category as any) || 'Personal',
      priority: (task.priority as any) || 'High',
      durationMinutes: task.durationMinutes || 30,
      scheduledTime: task.scheduledTime || '09:00',
      deadlineLabel: 'Today',
      status: 'pending',
      steps: task.steps || [{ id: `st-${Date.now()}`, text: 'Execute core deliverable', completed: false }],
      reasoning: 'Synthesized and prioritized by JARVIS in NEXUS.',
    };

    await handleAddTask(newTask);
    setDeployedTaskIds((prev) => new Set(prev).add(task.id || newTask.id));
    showToast(`Added "${newTask.title}" to your active workspace.`);
  };

  const handleResetChat = () => {
    setMessages([]);
    setTextChatState('idle');
  };

  const suggestions = [
    {
      title: 'Plan my day',
      desc: '3-hour sprint for high-impact focus',
      prompt: 'I have 3 hours of open time and need to finish high-priority study/work. Create an optimized schedule for me.',
      icon: Clock,
      tag: 'Schedule',
    },
    {
      title: 'Help me prioritize',
      desc: 'Sort competing deadlines & reduce cognitive load',
      prompt: "Here is what's on my plate: multiple deadlines and lower energy. Help me figure out what matters most right now.",
      icon: Zap,
      tag: 'Triage',
    },
    {
      title: 'Break a goal into steps',
      desc: 'Decompose complex milestones into micro-actions',
      prompt: 'I have a major goal to prepare for an upcoming project review. Break it down into clear, stress-free micro-steps.',
      icon: Layers,
      tag: 'Breakdown',
    },
    {
      title: 'Adapt my schedule',
      desc: 'Running late? Rebalance without guilt',
      prompt: "I'm running 45 minutes behind schedule today. Rebalance my pending tasks so I can finish without feeling overwhelmed.",
      icon: RotateCcw,
      tag: 'Rebalance',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 flex flex-col bg-[#05070D] text-slate-100 relative overflow-hidden">
      {/* Amber Atmospheric Ambient Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[360px] bg-gradient-to-b from-amber-600/15 via-orange-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* HEADER BAR */}
      <header className="border-b border-white/[0.08] bg-[#070A12]/85 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-sm font-bold text-white tracking-wider">JARVIS</span>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleResetChat}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>New Plan</span>
            </button>
          )}

          <button
            onClick={() => navigate('/workspace')}
            className="px-3.5 py-1.5 rounded-lg bg-[#B4F000] hover:bg-[#c6ff1a] text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(180,240,0,0.25)] cursor-pointer"
          >
            <span>Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* LIVE VOICE SESSION BANNER (when voice active) */}
      {isVoiceActive && (
        <div className="bg-[#0c0f18]/90 border-b border-amber-500/30 backdrop-blur-xl px-4 py-2.5 z-20 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                <span className="absolute w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>JARVIS LIVE VOICE</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                    {liveMode === 'gemini-live' ? 'JARVIS CORE' : 'JARVIS VOICE'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-amber-300/80">
                  {isSpeaking && 'Transmitting verbal response...'}
                  {isProcessing && 'Computing response...'}
                  {isListening && 'Listening to speech... Speak naturally or interrupt anytime.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSpeaking && (
                <button
                  onClick={interruptSpeaking}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Square className="w-3 h-3 text-amber-400" />
                  <span>Interrupt</span>
                </button>
              )}
              <button
                onClick={endVoiceSession}
                className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MicOff className="w-3.5 h-3.5" />
                <span>End Voice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOICE ERROR TOAST */}
      {voiceError && (
        <div className="bg-rose-950/80 border-b border-rose-500/30 px-4 py-2 z-20 flex items-center justify-between text-xs text-rose-200">
          <div className="max-w-6xl mx-auto flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{voiceError}</span>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 box-border">
        {/* ======================================================== */}
        {/* WELCOME HERO: JARVIS ORANGE-GOLD HOLOGRAPHIC INTELLIGENCE */}
        {/* ======================================================== */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 animate-in fade-in duration-300 w-full min-w-0">
            {/* Hero Grid: Desktop 2-column (Text Left, JARVIS Right), Responsive Stack */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full min-w-0">
              {/* Left Column: Status, Headline, Supporting Text, and Composer */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-4 text-left min-w-0 w-full">
                {/* Status Indicator */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-xs font-mono text-amber-300 w-fit">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#FFA726] animate-pulse" />
                  <span className="font-semibold tracking-wide">JARVIS · HOLOGRAPHIC AI</span>
                </div>

                {/* Exact Required Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display leading-[1.08] text-balance">
                  Let&apos;s make today
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 drop-shadow-[0_0_35px_rgba(255,167,38,0.4)]">
                    work for you.
                  </span>
                </h1>

                {/* Exact Required Supporting Text */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl text-balance">
                  Tell me what&apos;s on your mind. We&apos;ll turn it into a plan you can actually follow.
                </p>

                {/* Multiline Composer with Gemini Live Voice Toggle */}
                <div className="w-full pt-2">
                  <div className="relative rounded-2xl bg-[#090D17]/95 border border-white/15 focus-within:border-amber-400/60 focus-within:shadow-[0_0_25px_rgba(255,167,38,0.2)] transition-all p-3 shadow-2xl">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask JARVIS: 'I have 2 hours open, what should I tackle first?'"
                      rows={2}
                      className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed pr-24"
                    />

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-500">
                      <span className="text-[11px] font-mono">
                        Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Enter</kbd> to send
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Gemini Live Voice Activation Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isVoiceActive) {
                              endVoiceSession();
                            } else {
                              startVoiceSession();
                            }
                          }}
                          disabled={isConnecting}
                          title={isVoiceActive ? 'End JARVIS Voice' : 'Start Real-Time Voice Conversation'}
                          className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            isVoiceActive
                              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(255,167,38,0.4)] animate-pulse'
                              : 'bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-amber-300 hover:text-white'
                          }`}
                        >
                          <Radio className={`w-3.5 h-3.5 ${isVoiceActive ? 'animate-spin' : ''}`} />
                          <span>{isConnecting ? 'Connecting...' : isVoiceActive ? 'Voice Active' : 'JARVIS Voice'}</span>
                        </button>

                        {/* Send Text Button */}
                        <button
                          type="button"
                          onClick={() => handleSubmit()}
                          disabled={!inputValue.trim()}
                          aria-label="Send Message"
                          className="p-2 rounded-xl bg-[#B4F000] hover:bg-[#c6ff1a] disabled:opacity-30 disabled:cursor-not-allowed text-black transition-all shadow-[0_0_12px_rgba(180,240,0,0.3)] cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Prominent Living Orange-Gold Holographic Face */}
              <div className="lg:col-span-5 flex items-center justify-center relative min-w-0 w-full py-2 lg:py-0">
                <JarvisHologramFace
                  size={380}
                  state={currentHologramState}
                  audioLevel={audioLevel}
                  isSpeaking={isSpeaking || textChatState === 'speaking'}
                  isListening={isListening}
                  isProcessing={isProcessing || textChatState === 'processing'}
                  isTyping={inputValue.trim().length > 0}
                  interactiveParallax={true}
                  showStatusBadge={true}
                  className="mx-auto"
                />
              </div>
            </div>

            {/* Action Cards / Suggestions Below the Hero */}
            <div className="mt-10 pt-6 border-t border-white/5">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
                Quick Goal Starters
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full text-left">
                {suggestions.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSubmit(item.prompt)}
                      className="group p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between text-left relative overflow-hidden cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.05] group-hover:bg-amber-500/15 flex items-center justify-center shrink-0 transition-colors">
                          <IconComponent className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                          {item.tag}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* ACTIVE CONVERSATION STATE */
          /* ======================================================== */
          <div className="flex-1 flex flex-col justify-between py-4">
            {/* COMPACT TOP STATUS STRIP */}
            <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 mb-4">
              <div className="flex items-center gap-3">
                <JarvisHologramFace
                  size={56}
                  state={currentHologramState}
                  audioLevel={audioLevel}
                  isSpeaking={isSpeaking || textChatState === 'speaking'}
                  isListening={isListening}
                  isProcessing={isProcessing || textChatState === 'processing'}
                  interactiveParallax={false}
                  showStatusBadge={false}
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>JARVIS · Holographic AI</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#FFA726]" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {currentHologramState === 'speaking' && 'Transmitting response...'}
                    {currentHologramState === 'processing' && 'Synthesizing schedule & constraints...'}
                    {currentHologramState === 'listening' && 'Listening to audio stream...'}
                    {currentHologramState === 'idle' && 'Online · Ready for your next objective'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (isVoiceActive) endVoiceSession();
                    else startVoiceSession();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
                    isVoiceActive
                      ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(255,167,38,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-amber-300'
                  }`}
                >
                  <Radio className="w-3 h-3" />
                  <span>{isVoiceActive ? 'Voice Live' : 'Voice Mode'}</span>
                </button>
                <div className="text-[11px] font-mono text-slate-500">
                  {messages.filter((m) => m.role === 'user').length} prompt(s)
                </div>
              </div>
            </div>

            {/* MESSAGE STREAM */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  } animate-in fade-in duration-200`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-mono text-slate-500">
                      {msg.role === 'user' ? 'YOU' : 'JARVIS'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#121A2B] border border-white/10 text-white rounded-tr-sm'
                        : 'bg-[#0A0E18] border border-white/10 text-slate-200 rounded-tl-sm shadow-xl'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* STRUCTURED ACTIONABLE TASK CARDS */}
                    {msg.suggestedTasks && msg.suggestedTasks.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Synthesized Action Plan</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {msg.suggestedTasks.length} task(s)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.suggestedTasks.map((t, tIdx) => {
                            const isDeployed = deployedTaskIds.has(t.id || '');
                            return (
                              <div
                                key={tIdx}
                                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="font-semibold text-white truncate max-w-[160px]">
                                      {t.title}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      {t.durationMinutes}m
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2">
                                    <span className="text-amber-400">{t.priority} Priority</span>
                                    <span>·</span>
                                    <span>{t.scheduledTime}</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  disabled={isDeployed}
                                  onClick={() => handleDeployTask(t)}
                                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    isDeployed
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-[#B4F000] hover:bg-[#c6ff1a] text-black shadow-sm'
                                  }`}
                                >
                                  {isDeployed ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>In Workspace</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add to Workspace</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Real-time Processing Indicator */}
              {currentHologramState === 'processing' && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 max-w-xs animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs font-mono text-slate-400">JARVIS is computing plan...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* DOCKED BOTTOM COMPOSER */}
            <div className="relative rounded-2xl bg-[#090D17]/95 border border-white/15 focus-within:border-amber-400/60 p-3 shadow-2xl backdrop-blur-xl">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask JARVIS to adapt, prioritize, or break down your goals..."
                rows={1}
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed pr-28"
              />

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSubmit('Break down my top priority task into 3 steps')}
                    className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Break down top task
                  </button>
                  <button
                    onClick={() => handleSubmit("I'm running 30m behind, what should change?")}
                    className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Running late
                  </button>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {/* Voice Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isVoiceActive) endVoiceSession();
                      else startVoiceSession();
                    }}
                    title={isVoiceActive ? 'End voice conversation' : 'Activate JARVIS Voice'}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isVoiceActive
                        ? 'bg-amber-500 text-black animate-pulse shadow-[0_0_12px_rgba(255,167,38,0.4)]'
                        : 'bg-white/5 hover:bg-white/10 text-amber-400 hover:text-white'
                    }`}
                  >
                    {isVoiceActive ? <Radio className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={!inputValue.trim()}
                    aria-label="Send Message"
                    className="p-2 rounded-xl bg-[#B4F000] hover:bg-[#c6ff1a] disabled:opacity-30 disabled:cursor-not-allowed text-black transition-all shadow-[0_0_12px_rgba(180,240,0,0.3)] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

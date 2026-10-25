import React, { useState } from 'react';
import { X, Play, ArrowRight, ArrowLeft, CheckCircle2, RefreshCw, Sparkles, Timer } from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTryNow: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({ isOpen, onClose, onTryNow }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: '1. Natural Language Goal Decomposition',
      headline: 'Speak Naturally, Plan Feasibly',
      desc: 'Enter real-world messy thoughts: "I have two assignments, an exam tomorrow, and only 2 hours left today. I am tired and do not know where to start."',
      highlight: 'NEXORA automatically assesses energy level, extracts deadlines, and builds a realistic timeline that never over-allocates time.',
      icon: Sparkles,
      color: 'text-[#B4F000]'
    },
    {
      title: '2. The Workspace & Micro-Actions',
      headline: 'From Overwhelm to Five-Minute Sprints',
      desc: 'Instead of monolithic intimidating items, each task is split into concrete 5-minute micro-actions. Track progress in real-time with automatic timeline updates.',
      highlight: 'Filter by category, search instantly, adjust durations on the fly, and view the AI scheduling rationale for every item.',
      icon: CheckCircle2,
      color: 'text-sky-400'
    },
    {
      title: '3. Signature Adaptation: Smart Reschedule',
      headline: 'When Life Derails, Rebalance Instantly',
      desc: 'Running late? Tell NEXORA how many minutes you actually have left. The engine protects hard deadlines, compresses flexible tasks, and cleanly defers low-priority items.',
      highlight: 'Review a transparent preview diff before committing, so you stay in total control of your day.',
      icon: RefreshCw,
      color: 'text-amber-400'
    },
    {
      title: '4. Distraction-Free Ambient Focus Mode',
      headline: 'Deep Concentration with Procedural Audio',
      desc: 'Enter an isolated full-screen flow state with an SVG timer, step checklist, and built-in procedural Web Audio synthesizer (10Hz Alpha Waves, Cosmos Drone, Pink Noise).',
      highlight: 'Crystal chimes notify you when milestones are reached, with zero external bandwidth or ads.',
      icon: Timer,
      color: 'text-purple-400'
    }
  ];

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0D121F] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-[#B4F000]' : 'w-2 bg-white/20'
              }`}
            />
          ))}
          <span className="text-xs font-mono text-slate-400 ml-2">
            {currentSlide + 1} of {slides.length}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
              <Icon className={`w-4 h-4 ${slide.color}`} />
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {slide.title}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white font-display">
            {slide.headline}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            {slide.desc}
          </p>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white block mb-1">Key Innovation:</span>
            {slide.highlight}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {currentSlide < slides.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Feature</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTryNow();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#B4F000] hover:bg-[#c6ff1a] text-black text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(180,240,0,0.4)] cursor-pointer"
              >
                <span>Experience NEXORA Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

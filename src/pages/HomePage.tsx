import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { ProblemSection } from '../components/ProblemSection';
import { ChaosToClaritySection } from '../components/ChaosToClaritySection';
import { FeatureShowcase } from '../components/FeatureShowcase';
import { PromptPlanner } from '../components/PromptPlanner';
import { Workspace } from '../components/Workspace';
import { ProgressInsightsSection } from '../components/ProgressInsightsSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { MotionReveal } from '../components/MotionReveal';
import { useAppContext } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    handleToggleTaskStatus,
    setSelectedTaskDetail,
    setIsAddTaskOpen,
    setIsSmartRescheduleOpen,
    setActiveFocusTask,
    handleResetDemo,
    handlePlanGenerated,
    setIsDemoTourOpen,
  } = useAppContext();

  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/workspace');
  };

  return (
    <div className="space-y-0">
      {/* 1. Cinematic Hero */}
      <HeroSection
        onGetStarted={scrollToPlanner}
        onWatchDemo={() => setIsDemoTourOpen(true)}
      />

      {/* 2. Problem & 3 Core Pillars */}
      <MotionReveal delay={60}>
        <ProblemSection />
      </MotionReveal>

      {/* 3. Interactive Chaos to Clarity */}
      <MotionReveal delay={80}>
        <ChaosToClaritySection />
      </MotionReveal>

      {/* 4. Feature Showcase Bento */}
      <MotionReveal delay={80}>
        <FeatureShowcase
          onSelectFeature={(feat) => {
            if (feat === 'planner') scrollToPlanner();
            if (feat === 'reschedule') setIsSmartRescheduleOpen(true);
            if (feat === 'focus') {
              const pending = tasks.find((t) => t.status !== 'completed') || tasks[0];
              setActiveFocusTask(pending);
            }
            if (feat === 'insights') navigate('/features');
          }}
        />
      </MotionReveal>

      {/* 5. Natural Language Prompt Planner */}
      <MotionReveal delay={80}>
        <PromptPlanner onPlanGenerated={handlePlanGenerated} />
      </MotionReveal>

      {/* 6. Live Interactive Workspace Dashboard */}
      <MotionReveal delay={80}>
        <Workspace
          tasks={tasks}
          onToggleTaskStatus={handleToggleTaskStatus}
          onOpenTaskDetail={(task) => setSelectedTaskDetail(task)}
          onOpenAddTask={() => setIsAddTaskOpen(true)}
          onOpenSmartReschedule={() => setIsSmartRescheduleOpen(true)}
          onOpenFocusTask={(task) => setActiveFocusTask(task)}
          onResetDemo={handleResetDemo}
        />
      </MotionReveal>

      {/* 7. Progress Insights & Telemetry */}
      <MotionReveal delay={80}>
        <ProgressInsightsSection tasks={tasks} />
      </MotionReveal>

      {/* 8. How It Works */}
      <MotionReveal delay={80}>
        <HowItWorksSection />
      </MotionReveal>

      {/* 9. Final Call to Action */}
      <MotionReveal delay={80}>
        <FinalCtaSection
          onGetStarted={scrollToPlanner}
          onWatchDemo={() => setIsDemoTourOpen(true)}
        />
      </MotionReveal>
    </div>
  );
};

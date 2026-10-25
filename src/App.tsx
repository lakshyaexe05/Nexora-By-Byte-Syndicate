import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SmartRescheduleModal } from './components/SmartRescheduleModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { AddTaskModal } from './components/AddTaskModal';
import { DemoTourModal } from './components/DemoTourModal';
import { DownloadModal } from './components/DownloadModal';
import { FocusModeView } from './components/FocusModeView';

import { HomePage } from './pages/HomePage';
import { ProblemPage } from './pages/ProblemPage';
import { TransformationPage } from './pages/TransformationPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AudioPage } from './pages/AudioPage';
import { SignInPage } from './pages/SignInPage';
import { ChatPage } from './pages/ChatPage';
import { EchoCompanion } from './components/EchoCompanion';

import { FirebaseProvider } from './firebase/context';
import { AppProvider, useAppContext } from './context/AppContext';
import { Sparkles } from 'lucide-react';
import { CinematicIntro } from './components/CinematicIntro';

// Scroll to top automatically on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition-enter">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/problem" element={<ProblemPage />} />
        <Route path="/transformation" element={<TransformationPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/audio" element={<AudioPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function MainAppShell() {
  const {
    tasks,
    activeSound,
    handleToggleSound,
    isSmartRescheduleOpen,
    setIsSmartRescheduleOpen,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isDownloadOpen,
    setIsDownloadOpen,
    selectedTaskDetail,
    setSelectedTaskDetail,
    isDemoTourOpen,
    setIsDemoTourOpen,
    activeFocusTask,
    setActiveFocusTask,
    handleApplyReschedule,
    handleUpdateTask,
    handleDeleteTask,
    handleAddTask,
    handleUpdateTaskSteps,
    toastMessage,
  } = useAppContext();

  return (
    <div className="min-h-screen bg-[#06080D] text-slate-100 font-sans selection:bg-[#B4F000] selection:text-black flex flex-col justify-between relative">
      <ScrollToTop />

      {/* Cinematic First-Visit Intro */}
      <CinematicIntro />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-[#0D121F] border border-[#B4F000]/40 text-xs sm:text-sm text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#B4F000]/15 flex items-center justify-center text-[#B4F000] shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Main Multi-Page Routed Content */}
      <main className="flex-1">
        <AnimatedRoutes />
      </main>

      {/* Floating 3D AI Companion */}
      <EchoCompanion />

      {/* Footer */}
      <Footer />

      {/* MODALS */}

      {/* 1. Smart Reschedule Modal */}
      <SmartRescheduleModal
        isOpen={isSmartRescheduleOpen}
        onClose={() => setIsSmartRescheduleOpen(false)}
        currentTasks={tasks}
        onApplyReschedule={handleApplyReschedule}
      />

      {/* 2. Task Detail Modal */}
      <TaskDetailModal
        task={selectedTaskDetail}
        isOpen={!!selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onStartFocus={(task) => {
          setSelectedTaskDetail(null);
          setActiveFocusTask(task);
        }}
      />

      {/* 3. Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* 4. Interactive Demo Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onTryNow={() => {
          setIsDemoTourOpen(false);
          window.location.href = '/workspace';
        }}
      />

      {/* 5. Download / Export Codebase Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* 6. Fullscreen Ambient Focus Mode */}
      {activeFocusTask && (
        <FocusModeView
          task={activeFocusTask}
          onExit={() => setActiveFocusTask(null)}
          onUpdateTaskSteps={handleUpdateTaskSteps}
          activeSound={activeSound}
          onChangeSound={handleToggleSound}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FirebaseProvider>
        <AppProvider>
          <MainAppShell />
        </AppProvider>
      </FirebaseProvider>
    </BrowserRouter>
  );
}

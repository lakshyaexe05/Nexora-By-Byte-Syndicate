import React, { createContext, useContext, useState, useEffect } from 'react';
import { AmbientSoundType, RescheduleProposal, TaskItem } from '../types';
import { loadSavedTasks, resetToDemoTasks, saveTasks } from '../utils/storage';
import { focusAudio } from '../utils/audio';
import { useFirebase } from '../firebase/context';
import { User } from 'firebase/auth';

interface AppContextType {
  // Tasks
  tasks: TaskItem[];
  localTasks: TaskItem[];
  handleToggleTaskStatus: (taskId: string) => Promise<void>;
  handleUpdateTask: (updated: TaskItem) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  handleAddTask: (newTask: TaskItem) => Promise<void>;
  handlePlanGenerated: (newTasks: TaskItem[], summary: string, reasoning: string) => Promise<void>;
  handleApplyReschedule: (proposal: RescheduleProposal) => Promise<void>;
  handleResetDemo: () => Promise<void>;
  handleUpdateTaskSteps: (taskId: string, updatedSteps: TaskItem['steps']) => Promise<void>;

  // Audio Soundscape
  activeSound: AmbientSoundType;
  handleToggleSound: (type: AmbientSoundType) => void;

  // Modals & Active Overlays
  isSmartRescheduleOpen: boolean;
  setIsSmartRescheduleOpen: (open: boolean) => void;
  isAddTaskOpen: boolean;
  setIsAddTaskOpen: (open: boolean) => void;
  isDownloadOpen: boolean;
  setIsDownloadOpen: (open: boolean) => void;
  selectedTaskDetail: TaskItem | null;
  setSelectedTaskDetail: (task: TaskItem | null) => void;
  isDemoTourOpen: boolean;
  setIsDemoTourOpen: (open: boolean) => void;
  activeFocusTask: TaskItem | null;
  setActiveFocusTask: (task: TaskItem | null) => void;

  // Floating Companion Quick Assistant
  isQuickAssistantOpen: boolean;
  setIsQuickAssistantOpen: (open: boolean) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Auth
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    signInWithGoogle, 
    signOutUser, 
    firestoreTasks, 
    syncTaskToFirestore, 
    deleteTaskFromFirestore,
    seedInitialTasksToFirestore
  } = useFirebase();

  const [localTasks, setLocalTasks] = useState<TaskItem[]>(() => loadSavedTasks());
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('none');

  // Modals
  const [isSmartRescheduleOpen, setIsSmartRescheduleOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<TaskItem | null>(null);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<TaskItem | null>(null);
  const [isQuickAssistantOpen, setIsQuickAssistantOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active tasks
  const tasks = (user && firestoreTasks !== null) ? firestoreTasks : localTasks;

  useEffect(() => {
    if (user && firestoreTasks && firestoreTasks.length === 0 && localTasks.length > 0) {
      seedInitialTasksToFirestore(localTasks);
    }
  }, [user, firestoreTasks]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleToggleSound = (type: AmbientSoundType) => {
    setActiveSound(type);
    focusAudio.playSoundscape(type);
    if (type !== 'none') {
      showToast(`Neural Soundscape: ${type.toUpperCase()} active`);
    } else {
      showToast('Soundscape muted');
    }
  };

  const handleToggleTaskStatus = async (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const nextStatus = target.status === 'completed' ? 'pending' : 'completed';
    const updated = { ...target, status: nextStatus as any };

    if (nextStatus === 'completed') {
      focusAudio.playChime();
      showToast(`Completed: ${target.title}`);
    }

    if (user) {
      await syncTaskToFirestore(updated);
    } else {
      setLocalTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    }
  };

  const handleUpdateTask = async (updated: TaskItem) => {
    if (user) {
      await syncTaskToFirestore(updated);
    } else {
      setLocalTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    }
    showToast(`Updated "${updated.title}"`);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (user) {
      await deleteTaskFromFirestore(taskId);
    } else {
      setLocalTasks(prev => prev.filter(t => t.id !== taskId));
    }
    showToast('Task removed from workspace.');
  };

  const handleAddTask = async (newTask: TaskItem) => {
    if (user) {
      await syncTaskToFirestore(newTask);
    } else {
      setLocalTasks(prev => [newTask, ...prev]);
    }
    showToast(`Added "${newTask.title}" to workspace.`);
  };

  const handlePlanGenerated = async (newTasks: TaskItem[], summary: string, _reasoning: string) => {
    if (user) {
      for (const t of newTasks) {
        await syncTaskToFirestore(t);
      }
    } else {
      setLocalTasks(prev => [...newTasks, ...prev]);
    }
    showToast(`Generated ${newTasks.length} tasks: ${summary}`);
  };

  const handleApplyReschedule = async (proposal: RescheduleProposal) => {
    const retainedMap = new Map(proposal.retainedTasks.map(t => [t.id, t]));
    const deferredMap = new Map(proposal.deferredTasks.map(d => [d.taskId, d]));

    const updatedList = tasks.map(t => {
      if (retainedMap.has(t.id)) {
        const updated = retainedMap.get(t.id)!;
        return { ...t, durationMinutes: updated.durationMinutes, reasoning: updated.reasoning || t.reasoning };
      }
      if (deferredMap.has(t.id)) {
        const def = deferredMap.get(t.id)!;
        return { ...t, deadlineLabel: def.deferredTo, reasoning: def.reason, status: 'deferred' as const };
      }
      return t;
    });

    if (user) {
      for (const t of updatedList) {
        await syncTaskToFirestore(t);
      }
    } else {
      setLocalTasks(updatedList);
    }

    focusAudio.playChime();
    showToast(`Reschedule applied for ${proposal.remainingMinutes} minutes.`);
  };

  const handleResetDemo = async () => {
    const fresh = resetToDemoTasks();
    if (user) {
      for (const t of fresh) {
        await syncTaskToFirestore(t);
      }
    } else {
      setLocalTasks(fresh);
    }
    showToast('Workspace reset to baseline demo dataset.');
  };

  const handleUpdateTaskSteps = async (taskId: string, updatedSteps: TaskItem['steps']) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const updated = { ...target, steps: updatedSteps };
    if (user) {
      await syncTaskToFirestore(updated);
    } else {
      setLocalTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    }
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        localTasks,
        handleToggleTaskStatus,
        handleUpdateTask,
        handleDeleteTask,
        handleAddTask,
        handlePlanGenerated,
        handleApplyReschedule,
        handleResetDemo,
        handleUpdateTaskSteps,
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
        isQuickAssistantOpen,
        setIsQuickAssistantOpen,
        toastMessage,
        showToast,
        user,
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

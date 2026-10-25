import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query,
  getDocs
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testFirestoreConnection } from './config';
import { TaskItem } from '../types';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  firestoreTasks: TaskItem[] | null;
  syncTaskToFirestore: (task: TaskItem) => Promise<void>;
  deleteTaskFromFirestore: (taskId: string) => Promise<void>;
  seedInitialTasksToFirestore: (tasks: TaskItem[]) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  firestoreTasks: null,
  syncTaskToFirestore: async () => {},
  deleteTaskFromFirestore: async () => {},
  seedInitialTasksToFirestore: async () => {},
});

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firestoreTasks, setFirestoreTasks] = useState<TaskItem[] | null>(null);

  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Save user profile document
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          await setDoc(userDocRef, {
            id: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Anonymous Explorer',
            photoURL: currentUser.photoURL || '',
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
        }
      } else {
        setFirestoreTasks(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to tasks collection for signed-in user
  useEffect(() => {
    if (!user) {
      setFirestoreTasks(null);
      return;
    }

    const tasksColPath = `users/${user.uid}/tasks`;
    const tasksQuery = query(collection(db, 'users', user.uid, 'tasks'));

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const loaded: TaskItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loaded.push({
            id: docSnap.id,
            title: data.title || 'Untitled Task',
            category: data.category || 'Study',
            priority: data.priority || 'Medium',
            durationMinutes: data.durationMinutes || 30,
            scheduledTime: data.scheduledTime,
            deadlineLabel: data.deadlineLabel,
            status: data.status || 'pending',
            steps: data.steps || [],
            reasoning: data.reasoning,
            energyRequired: data.energyRequired
          });
        });
        setFirestoreTasks(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, tasksColPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn('Google sign-in popup error:', err);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setFirestoreTasks(null);
    } catch (err: any) {
      console.warn('Sign-out error:', err);
    }
  };

  const syncTaskToFirestore = async (task: TaskItem) => {
    if (!user) return;
    const taskPath = `users/${user.uid}/tasks/${task.id}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'tasks', task.id), {
        id: task.id,
        userId: user.uid,
        title: task.title,
        category: task.category,
        priority: task.priority,
        durationMinutes: task.durationMinutes,
        scheduledTime: task.scheduledTime || '',
        deadlineLabel: task.deadlineLabel || '',
        status: task.status,
        steps: task.steps || [],
        reasoning: task.reasoning || '',
        energyRequired: task.energyRequired || 'Medium',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, taskPath);
    }
  };

  const deleteTaskFromFirestore = async (taskId: string) => {
    if (!user) return;
    const taskPath = `users/${user.uid}/tasks/${taskId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, taskPath);
    }
  };

  const seedInitialTasksToFirestore = async (initialTasks: TaskItem[]) => {
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'tasks'));
      if (snap.empty) {
        for (const t of initialTasks) {
          await syncTaskToFirestore(t);
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/tasks`);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOutUser,
        firestoreTasks,
        syncTaskToFirestore,
        deleteTaskFromFirestore,
        seedInitialTasksToFirestore
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogIn, LogOut, ShieldCheck, Cloud, Check, Sparkles, 
  ArrowRight, User as UserIcon, Database, HardDrive, AlertCircle 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

import { MotionReveal } from '../components/MotionReveal';

export const SignInPage: React.FC = () => {
  const { user, signInWithGoogle, signOutUser, tasks } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#06080D] relative overflow-hidden flex items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#B4F000]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-xl mx-auto px-4 w-full relative z-10">
        <MotionReveal delay={80}>
          <div className="p-8 sm:p-10 rounded-3xl bg-[#090D16] border border-white/15 shadow-2xl space-y-8 card-hover-depth">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B4F000]/30 bg-[#B4F000]/10 text-[#B4F000] text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEXORA CLOUD GATEWAY</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              {user ? 'Account & Cloud Sync' : 'Access Your Universe'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {user 
                ? 'Your workspace is synchronized across all devices via Firestore.' 
                : 'Sign in to persist your schedule across devices, or continue in private offline guest mode.'}
            </p>
          </div>

          {/* User Logged In State */}
          {user ? (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#060910] border border-white/10 flex items-center gap-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#B4F000]/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'U'}
                  </div>
                )}

                <div className="overflow-hidden space-y-1">
                  <div className="text-base font-bold text-white truncate font-display">
                    {user.displayName || 'Authorized Planner'}
                  </div>
                  <div className="text-xs text-slate-400 truncate font-mono">
                    {user.email}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Firestore Connected · {tasks.length} tasks synced</span>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-slate-400 block text-[10px]">SYNC PROTOCOL:</span>
                  <span className="text-white font-semibold">Firebase Firestore</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-slate-400 block text-[10px]">SECURITY LEVEL:</span>
                  <span className="text-emerald-400 font-semibold">AES-256 Cloud Token</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigate('/workspace')}
                  className="flex-1 py-3.5 rounded-full bg-[#B4F000] hover:bg-[#c6ff1a] text-black font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(180,240,0,0.35)] cursor-pointer"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => signOutUser()}
                  className="py-3.5 px-6 rounded-full border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Feature list */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#B4F000] shrink-0" />
                  <span>Persistent real-time synchronization with Firestore</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#B4F000] shrink-0" />
                  <span>Seamless task access across desktop and mobile browsers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#B4F000] shrink-0" />
                  <span>Automatic conflict resolution and offline cached queue</span>
                </div>
              </div>

              {/* Sign in with Google Button */}
              <button
                onClick={signInWithGoogle}
                className="w-full py-4 rounded-2xl bg-white hover:bg-slate-100 text-black font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Guest mode option */}
              <div className="pt-2 text-center">
                <Link
                  to="/workspace"
                  className="text-xs font-mono text-slate-400 hover:text-[#B4F000] transition-colors"
                >
                  Or continue in guest mode (Local storage fallback) →
                </Link>
              </div>

            </div>
          )}

          {/* Privacy Note */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Tracker Architecture</span>
            </span>
            <span>BYTE SYNDICATE</span>
          </div>

          </div>
        </MotionReveal>

      </div>
    </div>
  );
};

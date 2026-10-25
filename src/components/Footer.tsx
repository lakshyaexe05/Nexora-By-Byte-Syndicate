import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#04060A] border-t border-white/[0.08] py-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.08]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-white font-display tracking-tight">NEXORA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B4F000]" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              by BYTE SYNDICATE
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed mt-2">
              Intelligent everyday-life planning assistant that transforms overwhelming tasks, competing priorities, and changing schedules into personalized, actionable plans.
            </p>
            <div className="text-xs font-mono text-slate-300 pt-2">
              Tagline: <span className="text-[#B4F000]">Your mind. Your universe.</span>
            </div>
          </div>

          {/* Dedicated Page Routes */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Product Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/problem" className="hover:text-white transition-colors">
                  The Problem
                </Link>
              </li>
              <li>
                <Link to="/transformation" className="hover:text-white transition-colors">
                  Transformation
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Features Bento
                </Link>
              </li>
              <li>
                <Link to="/workspace" className="text-[#B4F000] hover:underline font-semibold">
                  Workspace Dashboard
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-amber-400 hover:text-white transition-colors">
                  JARVIS AI · Holographic Intelligence
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/audio" className="hover:text-sky-400 transition-colors">
                  Neural Audio & Focus
                </Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-white transition-colors">
                  Account & Cloud Sync
                </Link>
              </li>
            </ul>
          </div>

          {/* Mission & Team Slogan */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Engineering Mission
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built for Problem Statement 2: <span className="text-slate-200">Reimagine Everyday Life: Make the Complex Simple.</span> Designed to answer what to do first, how to fit available hours realistically, and what to adapt when circumstances change.
            </p>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-[11px] text-[#B4F000]">
              TEAM SLOGAN: <span className="text-white font-bold tracking-widest">BUILD BEYOND LIMITS.</span>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              AI INTELLIGENCE: <span className="text-slate-300">JARVIS</span> · FORM: <span className="text-slate-300">HOLOGRAPHIC INTELLIGENCE</span>
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} NEXORA by BYTE SYNDICATE. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Think. Plan. Adapt. Act.</span>
            <span>·</span>
            <span>Client & Cloud Synchronized</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

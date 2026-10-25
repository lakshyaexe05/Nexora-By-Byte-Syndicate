import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const {
    user,
    signOutUser,
  } = useAppContext();

  // Primary navigation links requested in specification
  const primaryNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'The Problem', path: '/problem' },
    { name: 'Transformation', path: '/transformation' },
    { name: 'Features', path: '/features' },
    { name: 'Workspace', path: '/workspace' },
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Audio', path: '/audio' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#06080D]/90 backdrop-blur-md border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex flex-col group cursor-pointer"
            aria-label="NEXORA Home"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display group-hover:text-[#B4F000] transition-colors">
                NEXORA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B4F000] shadow-[0_0_8px_#B4F000]" />
            </div>
            <span className="text-[9px] tracking-[0.18em] font-medium text-slate-400 uppercase -mt-1 group-hover:text-slate-300 transition-colors">
              BY BYTE SYNDICATE
            </span>
          </Link>
        </div>

        {/* Center: Main Navigation (Desktop) */}
        <nav 
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13px] font-medium text-slate-300"
          aria-label="Main Navigation"
        >
          {primaryNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `transition-all duration-200 whitespace-nowrap cursor-pointer relative py-1.5 px-1 hover:text-white interactive-tap ${
                  isActive
                    ? 'text-[#B4F000] font-semibold after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-[#B4F000] after:rounded-full after:shadow-[0_0_8px_#B4F000]'
                    : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right: Action Controls (JARVIS → Sign In → Workspace) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Action 1: JARVIS Button */}
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap interactive-tap active:scale-[0.98] ${
                isActive
                  ? 'border border-amber-400 bg-amber-500/25 text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/50'
                  : 'border border-amber-500/50 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.18)] hover:shadow-[0_0_18px_rgba(245,158,11,0.3)]'
              }`
            }
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse" />
            <span>JARVIS</span>
          </NavLink>

          {/* Action 2: Sign In / User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] text-xs text-slate-200 transition-all cursor-pointer interactive-tap active:scale-[0.98]"
                aria-label="User Account Menu"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {user.displayName ? user.displayName.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[80px] truncate">
                  {user.displayName ? user.displayName.split(' ')[0] : 'Account'}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0C101A] border border-white/15 p-2.5 shadow-2xl space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-2 py-1.5 border-b border-white/10">
                    <div className="text-xs font-bold text-white truncate">{user.displayName || 'User'}</div>
                    <div className="text-[11px] text-slate-400 truncate font-mono">{user.email}</div>
                  </div>
                  <Link
                    to="/signin"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer interactive-tap"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOutUser();
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer interactive-tap"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/25 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap interactive-tap active:scale-[0.98]"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Action 3: Primary Workspace Action */}
          <Link
            to="/workspace"
            className="px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-black bg-[#B4F000] hover:bg-[#c6ff1a] rounded-lg transition-all shadow-[0_0_14px_rgba(180,240,0,0.25)] hover:shadow-[0_0_20px_rgba(180,240,0,0.45)] cursor-pointer whitespace-nowrap interactive-tap active:scale-[0.98]"
          >
            Workspace
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer interactive-tap active:scale-[0.95]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-4 bg-[#0A0D14]/98 backdrop-blur-xl border-b border-white/10 space-y-1">
          {primaryNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block w-full text-left py-2 px-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[#B4F000]/15 text-[#B4F000] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile Quick Action Links: JARVIS → Sign In → Workspace */}
          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs px-1 gap-2">
            <NavLink
              to="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isActive
                    ? 'border-amber-400 bg-amber-500/25 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:text-amber-200'
                }`
              }
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>JARVIS</span>
            </NavLink>

            <Link
              to="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5 py-1.5"
            >
              <LogIn className="w-4 h-4 text-slate-400" />
              <span>{user ? 'My Account' : 'Sign In'}</span>
            </Link>

            <Link
              to="/workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#B4F000] text-black font-semibold px-3 py-1.5 rounded-lg shadow-sm"
            >
              Workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

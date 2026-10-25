import React from 'react';
import { X, Download, Terminal, FolderArchive, Layers, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl bg-[#090D16] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#B4F000]/20 text-[#B4F000] border border-[#B4F000]/30">
                EXPORT & DEPLOY
              </span>
              <span className="text-xs font-mono text-slate-400">NEXORA by BYTE SYNDICATE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
              Download Frontend & Source Code
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Export the full, production-ready codebase to run locally or deploy to your own cloud infrastructure.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Download Packages Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
          {/* Source Code Package */}
          <div className="rounded-2xl p-5 bg-white/[0.03] border border-[#B4F000]/30 hover:border-[#B4F000] transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#B4F000]/10 border border-[#B4F000]/30 flex items-center justify-center text-[#B4F000] mb-3 group-hover:scale-105 transition-transform">
                <FolderArchive className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Full Source Code</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Complete developer package including React 19, TypeScript, Tailwind CSS v4, Express proxy backend, Canvas particle engine, and Gemini API integration.
              </p>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-300 mb-5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B4F000]" />
                  <span>React 19 + TypeScript + Vite</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B4F000]" />
                  <span>Express API server (`server.ts`)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B4F000]" />
                  <span>Firebase & Gemini AI configs</span>
                </div>
              </div>
            </div>

            <a
              href="/downloads/nexora-source-code.zip"
              download="nexora-source-code.zip"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-[#B4F000] hover:bg-[#c4ff1a] transition-all flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(180,240,0,0.25)] text-center cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Source (.ZIP)</span>
            </a>
          </div>

          {/* Compiled Static Build */}
          <div className="rounded-2xl p-5 bg-white/[0.03] border border-sky-400/30 hover:border-sky-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Compiled Static Build</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Pre-compiled, minified distribution directory (`dist/`). Ready to upload directly to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or S3.
              </p>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-300 mb-5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                  <span>Optimized JS, CSS, and HTML</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                  <span>Standalone client distribution</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                  <span>Instant preview without build step</span>
                </div>
              </div>
            </div>

            <a
              href="/downloads/nexora-static-build.zip"
              download="nexora-static-build.zip"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-sky-500 hover:bg-sky-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(56,189,248,0.25)] text-center cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Build (.ZIP)</span>
            </a>
          </div>
        </div>

        {/* Local Setup Instructions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <Terminal className="w-4 h-4 text-[#B4F000]" />
              <span>Running Locally in 3 Steps</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Node.js 18+ required</span>
          </div>

          <div className="font-mono text-xs text-slate-300 bg-black/80 rounded-xl p-3 border border-white/5 space-y-2 overflow-x-auto">
            <div><span className="text-slate-500"># 1. Unzip and enter project folder</span></div>
            <div className="text-[#B4F000]">cd nexora-source-code</div>
            <div className="pt-1"><span className="text-slate-500"># 2. Install dependencies</span></div>
            <div className="text-white">npm install</div>
            <div className="pt-1"><span className="text-slate-500"># 3. Start local development server (port 3000)</span></div>
            <div className="text-[#B4F000]">npm run dev</div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Note: Copy <code className="text-[#B4F000] font-mono">.env.example</code> to <code className="text-[#B4F000] font-mono">.env</code> and add your <code className="text-white font-mono">GEMINI_API_KEY</code> to enable live Gemini AI planning and the multi-turn planning chatbot locally.
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

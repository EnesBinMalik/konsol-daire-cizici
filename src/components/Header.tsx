/**
 * @license
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

import React from 'react';
import { Terminal, Code2, ShieldCheck, TerminalSquare } from 'lucide-react';
import { CopyrightService } from '../core/CopyrightService';

interface HeaderProps {
  onOpenArchitecture: () => void;
  onOpenCopyright: () => void;
  onLogToBrowser: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenArchitecture,
  onOpenCopyright,
  onLogToBrowser,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-semibold text-slate-100 tracking-tight whitespace-nowrap block">
              Konsol Daire Çizici
            </span>
            <span className="text-xs text-slate-400 block -mt-0.5">
              Telif Sahibi: {CopyrightService.AUTHOR}
            </span>
          </div>
        </div>

        {/* Zone 2: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              const el = document.getElementById('terminal-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Konsol Terminali
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('controls-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Parametreler
          </button>
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>OOP Mimari & SRP</span>
          </button>
          <button
            onClick={onOpenCopyright}
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Telif & İmza</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLogToBrowser}
            title="Tarayıcı geliştirici konsoluna (F12) çizimi ve istatistikleri basar"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <TerminalSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Tarayıcı Konsolu</span> (F12)
          </button>
        </div>
      </div>
    </header>
  );
};

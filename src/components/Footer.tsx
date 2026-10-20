/**
 * @license
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

import React from 'react';
import { ShieldCheck, Code2, Terminal } from 'lucide-react';
import { CopyrightService } from '../core/CopyrightService';

interface FooterProps {
  onOpenArchitecture: () => void;
  onOpenCopyright: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenArchitecture,
  onOpenCopyright,
}) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Sol: Telif & Yazar */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="text-slate-300 font-medium">
            {CopyrightService.PROJECT_NAME}
          </span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span>{CopyrightService.getShortSignature()}</span>
        </div>

        {/* Orta/Sağ: Prensipler ve Bağlantılar */}
        <div className="flex items-center gap-5">
          <button
            onClick={onOpenArchitecture}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Single Responsibility (SRP) Analizi</span>
          </button>

          <span className="text-slate-700">|</span>

          <button
            onClick={onOpenCopyright}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Telif Hakkı & Lisans</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

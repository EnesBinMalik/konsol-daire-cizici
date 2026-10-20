/**
 * @license
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

import React from 'react';
import { X, ShieldCheck, Award, FileCheck, CheckCircle2 } from 'lucide-react';
import { CopyrightService } from '../core/CopyrightService';

interface CopyrightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopyrightModal: React.FC<CopyrightModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Telif Hakkı & Yazar İmzası
              </h2>
              <p className="text-xs text-slate-400">Resmi Lisans & Mülkiyet Bildirimi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Mühür & Sertifika Kartı */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase block">
                  Resmi Telif Beyanı
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                  {CopyrightService.AUTHOR}
                </h3>
                <span className="text-slate-400 text-[11px]">
                  Yazılım Geliştirici & Proje Sahibi
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400/90 whitespace-pre">
              {CopyrightService.getShortSignature()}
            </div>
          </div>

          {/* Telif Maddeleri */}
          <div className="space-y-2.5">
            <span className="font-semibold text-slate-200 text-xs block">
              Telif ve Kullanım Koşulları:
            </span>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Bu yazılımın tüm tasarım, mimari (Single Responsibility & DRY kurgusu), matematiksel formülasyonları ve kodları <strong>Enes Öztürk</strong> adına tescilli olup telif hakları saklıdır.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Konsol çıktılarında ve oluşturulan ASCII çizimlerinde Enes Öztürk telif başlığı ve imzası otomatik olarak eklenir ve korunur.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Eğitim, inceleme ve akademik ödev amaçlı referans gösterilmek kaydıyla kullanılabilir.
                </span>
              </div>
            </div>
          </div>

          {/* ASCII İmzası */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-mono">Çıktı Telif Damgası:</span>
            <div className="p-2 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-slate-400 select-all">
              {CopyrightService.getConsoleBanner()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Yıl: {CopyrightService.YEAR}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};

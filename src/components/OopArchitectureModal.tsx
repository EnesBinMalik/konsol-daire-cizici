/**
 * @license
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

import React, { useState } from 'react';
import { X, Check, Copy, Code2, BookOpen, Layers, Terminal } from 'lucide-react';
import { ARCHITECTURE_CLASSES, CSHARP_FULL_CODE } from '../data/architectureDoc';
import { CopyrightService } from '../core/CopyrightService';

interface OopArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'srp' | 'csharp' | 'ts';

export const OopArchitectureModal: React.FC<OopArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('srp');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                OOP & Single Responsibility (SRP) Mimarisi
              </h2>
              <p className="text-xs text-slate-400">
                Geliştirici & Telif Sahibi: {CopyrightService.AUTHOR} © {CopyrightService.YEAR}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('srp')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'srp'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sınıf Sorumlulukları (SRP Analizi)</span>
          </button>
          <button
            onClick={() => setActiveTab('csharp')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'csharp'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>C# Konsol Kodu (Enes Öztürk İmzalı)</span>
          </button>
          <button
            onClick={() => setActiveTab('ts')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ts'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>TypeScript Mimarisi</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'srp' && (
            <div className="space-y-6 text-sm">
              {/* Açıklama Kutusu */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="font-semibold text-emerald-400 text-sm">
                  Single Responsibility (Tek Sorumluluk) & DRY Prensibi Nasıl Uygulandı?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Single Responsibility Principle (SRP) gereği her sınıfın değişmesi için yalnızca
                  <strong> tek bir meşru gerekçesi</strong> olmalıdır. Bu uygulamada çizim
                  matematiği, tuval hafızası, çizim algoritması, konsol çıktısı ve telif yönetimi
                  kesin çizgilerle birbirinden ayrılmış; hiçbir matematiksel formül veya döngü tekrar
                  edilmemiştir (DRY).
                </p>
              </div>

              {/* Sınıf Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ARCHITECTURE_CLASSES.map((cls) => (
                  <div
                    key={cls.name}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-300">
                        {cls.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">SRP Uyumlu</span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
                        Tek Sorumluluğu (Single Responsibility):
                      </span>
                      <p className="text-xs text-slate-300">{cls.responsibility}</p>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
                        DRY Önlemi:
                      </span>
                      <p className="text-xs text-slate-400 italic">{cls.dryExplanation}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-500 font-mono">Metotlar:</span>
                      <ul className="mt-1 space-y-1">
                        {cls.methods.slice(0, 3).map((m) => (
                          <li key={m.name} className="text-[11px] font-mono text-slate-400">
                            • <strong className="text-slate-300">{m.name}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'csharp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">
                    C# (.NET) Konsol Uygulaması Tam Kaynak Kodu
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Visual Studio veya .NET CLI ile doğrudan çalıştırılabilir tam dosya.
                  </p>
                </div>
                <button
                  onClick={() => handleCopyCode(CSHARP_FULL_CODE)}
                  className="px-3 py-1.5 text-xs font-medium bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Kopyalandı!' : 'Tüm C# Kodunu Kopyala'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto max-h-[500px]">
                <pre className="text-xs font-mono text-emerald-400/90 leading-relaxed whitespace-pre select-all">
                  {CSHARP_FULL_CODE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'ts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">
                    TypeScript Modüler Mimari Yapısı
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Bu web uygulamasında aktif olarak çalışan modüler sınıflar.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleCopyCode(
                      `// Konsol Daire Çizimi - Enes Öztürk\n// Telif Hakkı © 2026 Enes Öztürk. Tüm Hakları Saklıdır.\n\n` +
                        ARCHITECTURE_CLASSES.map((c) => `// Sınıf: ${c.name}\n// Sorumluluk: ${c.responsibility}\n`).join('\n')
                    )
                  }
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Kopyalandı' : 'Mimari Özeti Kopyala'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                  <div className="text-cyan-300 font-semibold">📁 src/core/</div>
                  <div className="pl-4 space-y-1 text-slate-400">
                    <div>├── <strong className="text-slate-200">CircleGeometry.ts</strong> → Matematik ve mesafe formülleri (SRP)</div>
                    <div>├── <strong className="text-slate-200">AsciiCanvas.ts</strong> → 2D karakter ızgara belleği (SRP)</div>
                    <div>├── <strong className="text-slate-200">CircleDrawer.ts</strong> → Çizim rasterizasyonu (IShapeDrawer) (SRP)</div>
                    <div>├── <strong className="text-slate-200">ConsoleRenderer.ts</strong> → Terminal & browser console.log (SRP)</div>
                    <div>├── <strong className="text-slate-200">TerminalController.ts</strong> → CLI komut ayrıştırma & geçmiş (SRP)</div>
                    <div>└── <strong className="text-slate-200">CopyrightService.ts</strong> → Enes Öztürk telif & imza yönetimi (SRP)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>{CopyrightService.getShortSignature()}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

import React from 'react';
import {
  Play,
  Copy,
  Download,
  Trash2,
  Info,
  Sparkles,
  Check,
  Maximize2,
  Sliders,
} from 'lucide-react';
import { CircleConfig, DrawStats } from '../core/types';

interface ControlsPanelProps {
  config: CircleConfig;
  onChangeConfig: (newConfig: Partial<CircleConfig>) => void;
  stats: DrawStats | null;
  onRedraw: () => void;
  onClear: () => void;
  onCopyAscii: () => void;
  onDownloadTxt: () => void;
  isCopied: boolean;
  isAnimating: boolean;
  onToggleAnimation: () => void;
  animationSpeed: number;
  onChangeAnimationSpeed: (speed: number) => void;
}

const PRESET_RADII = [4, 7, 10, 14, 18, 22];
const COMMON_CHARS = ['*', '#', '@', 'O', '●', '■', '+', '✦'];

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  config,
  onChangeConfig,
  stats,
  onRedraw,
  onClear,
  onCopyAscii,
  onDownloadTxt,
  isCopied,
  isAnimating,
  onToggleAnimation,
  animationSpeed,
  onChangeAnimationSpeed,
}) => {
  return (
    <div id="controls-section" className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Daire Parametreleri</span>
        </div>
        <span className="text-xs text-slate-400">SRP & DRY Mimarisi</span>
      </div>

      {/* 1. Yarıçap (r) Kontrolü */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="radius-input" className="text-slate-300 font-medium flex items-center gap-1.5">
            <span>Yarıçap (r)</span>
            <span className="text-slate-500 font-normal">birim</span>
          </label>
          <span className="font-mono text-emerald-400 font-semibold text-sm">
            r = {config.radius}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="radius-range"
            type="range"
            min="2"
            max="30"
            step="1"
            value={config.radius}
            onChange={(e) => onChangeConfig({ radius: parseInt(e.target.value, 10) || 5 })}
            className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <input
            id="radius-input"
            type="number"
            min="1"
            max="45"
            value={config.radius}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val > 0 && val <= 45) {
                onChangeConfig({ radius: val });
              }
            }}
            className="w-16 bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-center font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Hızlı Yarıçap Seçicileri */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500 mr-1">Örnek:</span>
          {PRESET_RADII.map((preset) => (
            <button
              key={preset}
              onClick={() => onChangeConfig({ radius: preset })}
              className={`px-2 py-0.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                config.radius === preset
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Çizim Modu: İçi Boş vs İçi Dolu */}
      <div className="space-y-2">
        <label className="text-xs text-slate-300 font-medium block">
          Çizim Tipi (Mod)
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => onChangeConfig({ mode: 'outline' })}
            className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              config.mode === 'outline'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>○ İçi Boş (Çember)</span>
          </button>
          <button
            onClick={() => onChangeConfig({ mode: 'filled' })}
            className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              config.mode === 'filled'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>● İçi Dolu (Daire)</span>
          </button>
        </div>
      </div>

      {/* 3. Karakter Seçimi */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-slate-300 font-medium">Çizim Karakteri</label>
          <span className="font-mono text-slate-400 text-xs">Seçili: '{config.char}'</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {COMMON_CHARS.map((char) => (
            <button
              key={char}
              onClick={() => onChangeConfig({ char })}
              className={`w-8 h-8 rounded font-mono text-sm flex items-center justify-center transition-colors cursor-pointer ${
                config.char === char
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {char}
            </button>
          ))}
          {/* Özel Karakter Girdisi */}
          <input
            type="text"
            maxLength={1}
            value={config.char}
            onChange={(e) => {
              if (e.target.value) {
                onChangeConfig({ char: e.target.value[0] });
              }
            }}
            placeholder="Özel"
            title="Kendi özel karakterinizi yazabilirsiniz"
            className="w-12 h-8 bg-slate-950 border border-slate-700 rounded text-center font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* 4. En/Boy Oranı (Monospace Karakter Geometrisi) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-slate-300 font-medium flex items-center gap-1">
            <span>En/Boy Orantı Düzeltmesi</span>
            <span
              title="Monospace yazıtiplerinde karakterler yaklaşık 2 kat dikey uzundur. Bu katsayı dairenin elips gibi değil, optik olarak tam yuvarlak görünmesini sağlar."
              className="text-slate-500 hover:text-slate-400 cursor-help"
            >
              <Info className="w-3.5 h-3.5" />
            </span>
          </label>
          <span className="font-mono text-slate-400 text-xs">{config.aspectRatio.toFixed(1)}x</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.1"
            value={config.aspectRatio}
            onChange={(e) => onChangeConfig({ aspectRatio: parseFloat(e.target.value) || 2.0 })}
            className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => onChangeConfig({ aspectRatio: 2.0 })}
            title="Önerilen 2.0 değerine sıfırla"
            className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 cursor-pointer whitespace-nowrap"
          >
            2.0x (İdeal)
          </button>
        </div>
      </div>

      {/* 5. Animasyon & Çizim Hızı */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-slate-300">Adım Adım Çizim Efekti</span>
          </div>
          <button
            onClick={onToggleAnimation}
            className={`px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
              isAnimating
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            {isAnimating ? 'Animasyonu Durdur' : 'Animasyonu Oynat'}
          </button>
        </div>

        {isAnimating && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Hız:</span>
            {[
              { label: 'Hızlı', speed: 8 },
              { label: 'Normal', speed: 25 },
              { label: 'Yavaş', speed: 60 },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => onChangeAnimationSpeed(s.speed)}
                className={`px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                  animationSpeed === s.speed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 6. Geometri İstatistik Özeti */}
      {stats && (
        <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/60 pb-1.5">
            <span className="font-sans font-medium text-slate-300">Geometri Hesabı</span>
            <span className="text-emerald-400">{stats.executionTimeMs} ms</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400 text-[11px]">
            <div>
              <span className="text-slate-500">Izgara: </span>
              <span className="text-slate-300">{stats.width} × {stats.height}</span>
            </div>
            <div>
              <span className="text-slate-500">Piksel: </span>
              <span className="text-emerald-400">{stats.drawnChars} adet</span>
            </div>
            <div>
              <span className="text-slate-500">Çevre (2πr): </span>
              <span className="text-slate-300">{stats.circumference.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-slate-500">Alan (πr²): </span>
              <span className="text-slate-300">{stats.area.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. Aksiyon Butonları */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <button
          onClick={onRedraw}
          className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Daireyi Konsola Çiz (Enter)</span>
        </button>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onCopyAscii}
            className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
            title="ASCII Çizimi panoya kopyalar"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>
          <button
            onClick={onDownloadTxt}
            className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
            title=".txt dosyası olarak indirir"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.txt İndir</span>
          </button>
          <button
            onClick={onClear}
            className="py-1.5 px-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-400 text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
            title="Konsol geçmişini temizler"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

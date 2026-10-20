/**
 * @license
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CornerDownLeft,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { TerminalLine, TerminalThemeId } from '../core/types';
import { CopyrightService } from '../core/CopyrightService';
import { soundEffects } from '../utils/audio';

interface TerminalViewProps {
  lines: TerminalLine[];
  onCommandSubmit: (cmd: string) => void;
  onClear: () => void;
  onOpenArchitecture: () => void;
  onOpenCopyright: () => void;
}

const THEMES: Record<
  TerminalThemeId,
  {
    name: string;
    bg: string;
    text: string;
    prompt: string;
    border: string;
    selection: string;
    glow?: string;
  }
> = {
  matrix: {
    name: 'Matrix Yeşili',
    bg: 'bg-black',
    text: 'text-emerald-400',
    prompt: 'text-emerald-500',
    border: 'border-emerald-950',
    selection: 'selection:bg-emerald-900 selection:text-emerald-200',
    glow: 'drop-shadow-[0_0_8px_rgba(52,211,153,0.25)]',
  },
  amber: {
    name: 'Retro Kehribar',
    bg: 'bg-[#0f0a05]',
    text: 'text-amber-400',
    prompt: 'text-amber-500',
    border: 'border-amber-950',
    selection: 'selection:bg-amber-900 selection:text-amber-200',
    glow: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.25)]',
  },
  cyberpunk: {
    name: 'Siber Mavi',
    bg: 'bg-[#030712]',
    text: 'text-cyan-300',
    prompt: 'text-fuchsia-400',
    border: 'border-cyan-950',
    selection: 'selection:bg-cyan-900 selection:text-cyan-200',
    glow: 'drop-shadow-[0_0_8px_rgba(103,232,249,0.25)]',
  },
  monokai: {
    name: 'Monokai',
    bg: 'bg-[#18181b]',
    text: 'text-[#f8f8f2]',
    prompt: 'text-[#a6e22e]',
    border: 'border-zinc-800',
    selection: 'selection:bg-zinc-700 selection:text-white',
  },
  classic: {
    name: 'Klasik Gri',
    bg: 'bg-zinc-950',
    text: 'text-slate-200',
    prompt: 'text-slate-400',
    border: 'border-zinc-800',
    selection: 'selection:bg-zinc-800 selection:text-white',
  },
};

const SUGGESTED_COMMANDS = [
  'ciz 8',
  'ciz 12',
  'mod filled',
  'mod outline',
  'karakter #',
  'karakter ●',
  'yardim',
  'bilgi',
  'telif',
  'temizle',
];

export const TerminalView: React.FC<TerminalViewProps> = ({
  lines,
  onCommandSubmit,
  onClear,
  onOpenArchitecture,
  onOpenCopyright,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<TerminalThemeId>('matrix');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const theme = THEMES[selectedTheme];

  // Otomatik aşağı kaydırma
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    soundEffects.playKeyClick();
    if (e.key === 'Enter') {
      if (inputVal.trim()) {
        onCommandSubmit(inputVal);
        soundEffects.playSuccessBeep();
        setInputVal('');
      }
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
    if (next) soundEffects.playSuccessBeep();
  };

  return (
    <div
      id="terminal-section"
      className={`flex flex-col transition-all duration-200 ${
        isExpanded
          ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl border-2'
          : 'rounded-xl border shadow-lg'
      } ${theme.bg} ${theme.border} ${theme.selection} overflow-hidden`}
      style={{ minHeight: isExpanded ? 'calc(100vh - 2rem)' : '580px' }}
    >
      {/* 1. Terminal Pencere Başlığı (Window Title Bar) */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 select-none">
        <div className="flex items-center gap-3">
          {/* Pencere kontrol noktaları */}
          <div className="flex items-center gap-1.5">
            <span
              onClick={onClear}
              title="Ekranı temizle"
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer block"
            />
            <span
              onClick={() => setSelectedTheme((t) => (t === 'matrix' ? 'amber' : t === 'amber' ? 'cyberpunk' : 'matrix'))}
              title="Temayı değiştir"
              className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 cursor-pointer block"
            />
            <span
              onClick={() => setIsExpanded(!isExpanded)}
              title="Genişlet / Küçült"
              className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 cursor-pointer block"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium">enes@ozturk:</span>
            <span className="text-slate-500">~/seki-cizimi/daire</span>
          </div>
        </div>

        {/* Sağ Araçlar: Tema, Ses, Büyüt */}
        <div className="flex items-center gap-2">
          {/* Tema Seçici */}
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as TerminalThemeId)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded px-2 py-0.5 focus:outline-none cursor-pointer"
          >
            {(Object.keys(THEMES) as TerminalThemeId[]).map((tId) => (
              <option key={tId} value={tId} className="bg-slate-900 text-slate-200">
                {THEMES[tId].name}
              </option>
            ))}
          </select>

          {/* Ses Aç/Kapat */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Terminal ses efektlerini kapat' : 'Retro mekanik tuş seslerini aç'}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Tam Ekran / Normal Ekran */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Normal boyuta dön' : 'Genişletilmiş terminal'}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Terminal Çıktı Akışı (Output Buffer) */}
      <div
        ref={scrollContainerRef}
        onClick={() => inputRef.current?.focus()}
        className={`flex-1 p-4 overflow-y-auto font-mono text-xs sm:text-[13px] leading-relaxed cursor-text ${theme.text}`}
      >
        {lines.map((line) => {
          if (line.type === 'copyright') {
            return (
              <div
                key={line.id}
                className="my-2.5 p-3 rounded bg-slate-900/60 border border-slate-800/80 text-cyan-300 text-[11px] sm:text-xs leading-normal select-all"
              >
                <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Telif & Lisans Doğrulaması</span>
                  </span>
                  <span>{line.timestamp}</span>
                </div>
                <pre className="whitespace-pre font-mono overflow-x-auto">{line.content}</pre>
              </div>
            );
          }

          if (line.type === 'input') {
            return (
              <div key={line.id} className="flex items-center gap-2 my-1.5 opacity-90">
                <span className={`${theme.prompt} font-bold`}>daire&gt;</span>
                <span className="text-white font-medium">{line.content}</span>
                <span className="text-[10px] text-slate-600 ml-auto">{line.timestamp}</span>
              </div>
            );
          }

          if (line.type === 'error') {
            return (
              <div key={line.id} className="text-red-400 my-1 py-1 px-2 rounded bg-red-950/30 border border-red-900/50">
                [Hata] {line.content}
              </div>
            );
          }

          if (line.type === 'system') {
            return (
              <div key={line.id} className="text-slate-400 text-xs my-2 whitespace-pre-wrap border-l-2 border-slate-700 pl-2">
                {line.content}
              </div>
            );
          }

          // Daire çıktısı (ASCII Çizimi)
          return (
            <div key={line.id} className="my-3 overflow-x-auto select-all">
              <pre
                className={`whitespace-pre font-mono leading-none tracking-tight ${theme.glow || ''}`}
                style={{
                  fontFamily: 'Consolas, "Cascadia Code", "Fira Code", "Courier New", monospace',
                  fontSize: 'clamp(8px, 1.2vw, 13px)',
                  letterSpacing: '0.15em',
                  lineHeight: '0.95',
                }}
              >
                {line.content}
              </pre>
            </div>
          );
        })}

        {/* 3. Aktif Komut İstemi (Interactive Input Line) */}
        <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-800/60">
          <span className={`${theme.prompt} font-bold whitespace-nowrap select-none`}>
            daire&gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="yarıçap (örn: 8) veya 'ciz 10', 'yardim', 'mod filled' yazıp Enter'a basın..."
            className="flex-1 bg-transparent border-none text-slate-100 font-mono text-xs sm:text-[13px] focus:outline-none placeholder:text-slate-600"
            autoFocus
          />
          <button
            onClick={() => {
              if (inputVal.trim()) {
                onCommandSubmit(inputVal);
                setInputVal('');
              }
            }}
            className="text-slate-500 hover:text-emerald-400 p-1 cursor-pointer transition-colors"
            title="Komutu Çalıştır"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Hızlı Komut Çipleri & Kısayollar */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider mr-1">Hızlı Komutlar:</span>
          {SUGGESTED_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                onCommandSubmit(cmd);
                soundEffects.playKeyClick();
              }}
              className="px-2 py-0.5 text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded border border-slate-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              {cmd}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-400">
          <button
            onClick={onOpenArchitecture}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Code2 className="w-3 h-3" />
            <span>SRP Kodu</span>
          </button>
          <button
            onClick={onOpenCopyright}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Telif: {CopyrightService.AUTHOR}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

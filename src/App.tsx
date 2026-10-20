/**
 * @license
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 * Proje: Şekil Çizimi - Konsol Daire Çizici (Single Responsibility & DRY)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ControlsPanel } from './components/ControlsPanel';
import { TerminalView } from './components/TerminalView';
import { Footer } from './components/Footer';
import { OopArchitectureModal } from './components/OopArchitectureModal';
import { CopyrightModal } from './components/CopyrightModal';
import { CircleConfig, DrawStats, TerminalLine } from './core/types';
import { CircleDrawer } from './core/CircleDrawer';
import { ConsoleRenderer } from './core/ConsoleRenderer';
import { TerminalController } from './core/TerminalController';
import { CopyrightService } from './core/CopyrightService';
import { AsciiCanvas } from './core/AsciiCanvas';
import { CircleGeometry } from './core/CircleGeometry';
import {
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Code2,
  Sparkles,
} from 'lucide-react';

const INITIAL_CONFIG: CircleConfig = {
  radius: 7,
  mode: 'outline',
  char: '*',
  emptyChar: ' ',
  aspectRatio: 2.0,
  thicknessTolerance: 0.55,
};

export default function App() {
  const [config, setConfig] = useState<CircleConfig>(INITIAL_CONFIG);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [stats, setStats] = useState<DrawStats | null>(null);
  const [currentAscii, setCurrentAscii] = useState<string>('');

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isCopyrightOpen, setIsCopyrightOpen] = useState<boolean>(false);
  const [browserConsoleToast, setBrowserConsoleToast] = useState<string | null>(null);

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(20);
  const animationTimerRef = useRef<number | null>(null);

  const terminalControllerRef = useRef<TerminalController>(new TerminalController());

  // 1. Temel Çizim Fonksiyonu (SRP - Çizim Motoru)
  const drawCircle = useCallback((activeConfig: CircleConfig, silent: boolean = false) => {
    const drawer = new CircleDrawer(activeConfig);
    const { canvas, stats: newStats } = drawer.draw();
    const ascii = canvas.toString();

    setCurrentAscii(ascii);
    setStats(newStats);

    // Tarayıcı Developer Tools (F12) konsoluna bas
    ConsoleRenderer.logToBrowserConsole(ascii, newStats, activeConfig.mode);

    if (!silent) {
      const newLines = ConsoleRenderer.formatDrawResultLines(ascii, newStats, activeConfig.mode);
      setLines((prev) => [...prev, ...newLines]);
    }

    return { ascii, newStats };
  }, []);

  // Uygulama ilk yüklendiğinde karşılama ve ilk daire çizimi
  useEffect(() => {
    const welcomeLine = ConsoleRenderer.createTerminalLine(
      `Konsol Daire Çizim Motoru Başlatıldı.\n© ${CopyrightService.YEAR} ${CopyrightService.AUTHOR} - Telif Hakları Saklıdır.\nMimari: Single Responsibility Principle (SRP) & DRY\nKomut listesi için 'yardim' yazabilirsiniz.`,
      'system'
    );

    const { ascii, newStats } = drawCircle(INITIAL_CONFIG, true);
    const initialDrawLines = ConsoleRenderer.formatDrawResultLines(ascii, newStats, INITIAL_CONFIG.mode);

    setLines([welcomeLine, ...initialDrawLines]);
  }, [drawCircle]);

  // Yapılandırma güncellendiğinde çiz
  const handleConfigChange = (newPartial: Partial<CircleConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...newPartial };
      drawCircle(next);
      return next;
    });
  };

  // Komut satırı (CLI) girdisini çalıştırma
  const handleCommandSubmit = (rawInput: string) => {
    // Önce kullanıcının komutunu terminal akışına ekle
    const inputLine = ConsoleRenderer.createTerminalLine(rawInput, 'input');
    setLines((prev) => [...prev, inputLine]);

    const result = terminalControllerRef.current.executeCommand(rawInput, config);

    if (result.clearTerminal) {
      setLines([]);
      return;
    }

    if (result.lines.length > 0) {
      setLines((prev) => [...prev, ...result.lines]);
    }

    if (result.updatedConfig) {
      const newConfig = { ...config, ...result.updatedConfig };
      setConfig(newConfig);
      if (result.shouldDraw) {
        drawCircle(newConfig);
      }
    } else if (result.shouldDraw) {
      drawCircle(config);
    }
  };

  // Ekranı temizleme
  const handleClear = () => {
    setLines([]);
  };

  // ASCII çıktıyı panoya kopyalama
  const handleCopyAscii = () => {
    if (!currentAscii) return;
    const fullText = `${CopyrightService.getConsoleBanner()}\n\n${currentAscii}\n\n${CopyrightService.getFooterSignature()}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // .txt dosyası olarak indirme
  const handleDownloadTxt = () => {
    if (!currentAscii || !stats) return;
    const content = [
      CopyrightService.getConsoleBanner(),
      '',
      `Yarıçap (r): ${stats.radius}`,
      `Çizim Modu: ${config.mode === 'filled' ? 'İçi Dolu' : 'İçi Boş'}`,
      `Karakter: '${config.char}'`,
      `En/Boy Oranı: ${config.aspectRatio}`,
      `Çözünürlük: ${stats.width}x${stats.height}`,
      `Çevre: ${stats.circumference.toFixed(2)}`,
      `Alan: ${stats.area.toFixed(2)}`,
      '',
      '--- ASCII DAİRE ÇİZİMİ ---',
      currentAscii,
      '',
      CopyrightService.getFooterSignature(),
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daire_r${stats.radius}_enes_ozturk.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Tarayıcı Developer Tools'a manuel basma ve toast gösterme
  const handleLogToBrowser = () => {
    if (stats) {
      ConsoleRenderer.logToBrowserConsole(currentAscii, stats, config.mode);
      setBrowserConsoleToast(`Daire (r=${stats.radius}) tarayıcı DevTools konsoluna basıldı! (F12 tuşuna basarak inceleyebilirsiniz)`);
      setTimeout(() => setBrowserConsoleToast(null), 4000);
    }
  };

  // Animasyonlu Çizim Oynatma
  const handleToggleAnimation = () => {
    if (isAnimating) {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    const drawer = new CircleDrawer(config);
    const coords = drawer.getDrawCoordinates();
    const { width, height } = CircleGeometry.calculateGridDimensions(config.radius, config.aspectRatio);
    const tempCanvas = new AsciiCanvas(width, height, config.emptyChar);

    // Animasyon satırını oluştur
    const animLineId = `anim-${Date.now()}`;
    const animLine: TerminalLine = {
      id: animLineId,
      type: 'output',
      content: tempCanvas.toString(),
      timestamp: new Date().toTimeString().split(' ')[0],
    };

    setLines((prev) => [
      ...prev,
      ConsoleRenderer.createTerminalLine(`Animasyonlu çizim başlatılıyor (r=${config.radius})...`, 'system'),
      animLine,
    ]);

    let step = 0;
    const stepSize = Math.max(1, Math.floor(coords.length / 40));

    animationTimerRef.current = window.setInterval(() => {
      for (let i = 0; i < stepSize && step < coords.length; i++) {
        const pt = coords[step];
        tempCanvas.setPixel(pt.x, pt.y, pt.char);
        step++;
      }

      const updatedStr = tempCanvas.toString();
      setCurrentAscii(updatedStr);

      setLines((prev) =>
        prev.map((l) => (l.id === animLineId ? { ...l, content: updatedStr } : l))
      );

      if (step >= coords.length) {
        if (animationTimerRef.current) {
          clearInterval(animationTimerRef.current);
        }
        setIsAnimating(false);
        setLines((prev) => [
          ...prev,
          ConsoleRenderer.createTerminalLine(
            `Animasyon tamamlandı! Toplam ${coords.length} piksel çizildi. ${CopyrightService.getFooterSignature()}`,
            'system'
          ),
        ]);
      }
    }, animationSpeed);
  };

  // Temizleme
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Header (Top Bar Contract) */}
      <Header
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenCopyright={() => setIsCopyrightOpen(true)}
        onLogToBrowser={handleLogToBrowser}
      />

      {/* 2. Toast Bildirimi */}
      {browserConsoleToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-500 text-slate-950 font-medium text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{browserConsoleToast}</span>
        </div>
      )}

      {/* 3. Ana İçerik */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Üst Bilgi / Hero Başlığı */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Telif Hakkı & İmza: {CopyrightService.AUTHOR}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Single Responsibility & DRY Mimarisi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Konsol Daire Çizim Uygulaması
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Kullanıcıdan alınan yarıçap parametresine göre konsola optik orantılı daire çizer.
              Matematik, tuval ve çıktı katmanları Single Responsibility kuralına göre modüler
              sınıflara bölünmüştür.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>SRP ve C# Kodunu Gör</span>
            </button>
            <button
              onClick={() => setIsCopyrightOpen(true)}
              className="px-3.5 py-2 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Telif Belgesi</span>
            </button>
          </div>
        </div>

        {/* 2 Kolonlu Yerleşim: Kontroller ve Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sol Kolon: Parametreler & Kontrol Paneli (4 Kolon) */}
          <div className="lg:col-span-4 space-y-4">
            <ControlsPanel
              config={config}
              onChangeConfig={handleConfigChange}
              stats={stats}
              onRedraw={() => drawCircle(config)}
              onClear={handleClear}
              onCopyAscii={handleCopyAscii}
              onDownloadTxt={handleDownloadTxt}
              isCopied={isCopied}
              isAnimating={isAnimating}
              onToggleAnimation={handleToggleAnimation}
              animationSpeed={animationSpeed}
              onChangeAnimationSpeed={setAnimationSpeed}
            />

            {/* Bilgilendirici Mimari Notu */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2 text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Neden En/Boy Oranı (2.0x)?</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Monospace fontlarda her karakter kutusu yaklaşık olarak 1:2 en-boy oranına
                sahiptir. Orantı düzeltmesi uygulanmadığında daire dikey elips şeklinde bozulur.
                <strong> CircleGeometry</strong> sınıfımız bu matematiksel formülü tek merkezden
                hesaplayarak DRY sağlar.
              </p>
            </div>
          </div>

          {/* Sağ Kolon: Sanal Terminal & Konsol Çıktısı (8 Kolon) */}
          <div className="lg:col-span-8">
            <TerminalView
              lines={lines}
              onCommandSubmit={handleCommandSubmit}
              onClear={handleClear}
              onOpenArchitecture={() => setIsArchitectureOpen(true)}
              onOpenCopyright={() => setIsCopyrightOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <Footer
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenCopyright={() => setIsCopyrightOpen(true)}
      />

      {/* 5. Modallar */}
      <OopArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <CopyrightModal
        isOpen={isCopyrightOpen}
        onClose={() => setIsCopyrightOpen(false)}
      />
    </div>
  );
}

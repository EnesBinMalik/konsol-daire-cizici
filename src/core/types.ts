/**
 * @license
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 * Proje: Konsol Daire Çizim Uygulaması (Single Responsibility & DRY)
 */

export type DrawMode = 'outline' | 'filled';

export interface CircleConfig {
  radius: number;
  mode: DrawMode;
  char: string;
  emptyChar: string;
  aspectRatio: number; // Monospace karakter en/boy oranı düzeltmesi (~1.8 - 2.2)
  thicknessTolerance: number; // İçi boş mod için sınır toleransı
}

export interface DrawStats {
  radius: number;
  width: number;
  height: number;
  totalChars: number;
  drawnChars: number;
  circumference: number;
  area: number;
  executionTimeMs: number;
}

export interface TerminalLine {
  id: string;
  type: 'system' | 'input' | 'output' | 'error' | 'copyright';
  content: string;
  timestamp: string;
}

export type TerminalThemeId = 'matrix' | 'amber' | 'cyberpunk' | 'monokai' | 'classic';

export interface TerminalTheme {
  id: TerminalThemeId;
  name: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  accentClass: string;
  glowClass: string;
}

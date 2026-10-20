/**
 * @file ConsoleRenderer.ts
 * Single Responsibility: Çizim sonuçlarını ve mesajları konsol ortamlarına (UI Sanal Terminali ve Tarayıcı DevTools Console'u) biçimlendirip iletmekten tek başına sorumludur.
 * Yazar: Enes Öztürk
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

import { CopyrightService } from './CopyrightService';
import { DrawStats, TerminalLine } from './types';

export class ConsoleRenderer {
  /**
   * Çizilen daireyi ve telif imzasını tarayıcının gerçek Developer Tools konsoluna basar (`console.log`).
   */
  public static logToBrowserConsole(
    asciiOutput: string,
    stats: DrawStats,
    mode: string
  ): void {
    const banner = CopyrightService.getDevToolsStyledBanner();
    console.groupCollapsed(
      `%c[Enes Öztürk] Daire Çizimi | r=${stats.radius} (${mode === 'filled' ? 'İçi Dolu' : 'İçi Boş'})`,
      'color: #38bdf8; font-weight: bold;'
    );
    console.log(banner.text, ...banner.styles);
    console.log(
      `%c\n${asciiOutput}\n`,
      'font-family: monospace; font-size: 11px; line-height: 1.05; color: #4ade80; background: #020617; padding: 12px; border-radius: 6px;'
    );
    console.table({
      'Yarıçap (r)': stats.radius,
      'Izgara Boyutu': `${stats.width}x${stats.height}`,
      'Çizilen Karakter Sayısı': stats.drawnChars,
      'Toplam Izgara Hücresi': stats.totalChars,
      'Çevre (2πr)': stats.circumference.toFixed(2),
      'Alan (πr²)': stats.area.toFixed(2),
      'İşlem Süresi': `${stats.executionTimeMs} ms`,
      'Telif Sahibi': CopyrightService.AUTHOR,
    });
    console.groupEnd();
  }

  /**
   * Terminal için biçimlendirilmiş tekil satır nesnesi oluşturur.
   */
  public static createTerminalLine(
    content: string,
    type: TerminalLine['type'] = 'output'
  ): TerminalLine {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    return {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      content,
      timestamp: timeStr,
    };
  }

  /**
   * Çizim çıktısını telif başlığı ve istatistiklerle birlikte terminal satırları olarak paketler.
   */
  public static formatDrawResultLines(
    asciiOutput: string,
    stats: DrawStats,
    mode: string
  ): TerminalLine[] {
    const lines: TerminalLine[] = [];

    // Telif Başlığı (Enes Öztürk imzası)
    lines.push(
      this.createTerminalLine(CopyrightService.getConsoleBanner(), 'copyright')
    );

    // Daire Çıktısı
    lines.push(this.createTerminalLine(asciiOutput, 'output'));

    // İstatistik ve Alt Bilgi
    const infoText = [
      `--- Çizim İstatistikleri ---`,
      `Yarıçap (r): ${stats.radius} birim | Mod: ${mode === 'filled' ? 'İçi Dolu' : 'İçi Boş'}`,
      `Çözünürlük: ${stats.width} x ${stats.height} (${stats.totalChars} hücre) | Çizilen Piksel: ${stats.drawnChars}`,
      `Çevre: ${stats.circumference.toFixed(2)} | Alan: ${stats.area.toFixed(2)} | Çizim Süresi: ${stats.executionTimeMs}ms`,
      CopyrightService.getFooterSignature(),
    ].join('\n');

    lines.push(this.createTerminalLine(infoText, 'system'));

    return lines;
  }
}

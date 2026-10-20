/**
 * @file TerminalController.ts
 * Single Responsibility: Terminal kullanıcı komutlarını ayrıştırmak (parsing), komut geçmişini yönetmek ve yürütmekten tek başına sorumludur.
 * Yazar: Enes Öztürk
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

import { CopyrightService } from './CopyrightService';
import { CircleConfig, DrawMode, TerminalLine } from './types';
import { ConsoleRenderer } from './ConsoleRenderer';
import { CircleGeometry } from './CircleGeometry';

export interface CommandExecutionResult {
  lines: TerminalLine[];
  updatedConfig?: Partial<CircleConfig>;
  shouldDraw?: boolean;
  clearTerminal?: boolean;
}

export class TerminalController {
  private history: string[] = [];
  private historyIndex: number = -1;

  public addToHistory(command: string): void {
    const trimmed = command.trim();
    if (trimmed && (this.history.length === 0 || this.history[this.history.length - 1] !== trimmed)) {
      this.history.push(trimmed);
    }
    this.historyIndex = this.history.length;
  }

  public getPreviousCommand(): string | null {
    if (this.history.length === 0) return null;
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.history[this.historyIndex];
    }
    return this.history[0] ?? null;
  }

  public getNextCommand(): string | null {
    if (this.history.length === 0) return null;
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      return this.history[this.historyIndex];
    }
    this.historyIndex = this.history.length;
    return '';
  }

  /**
   * Kullanıcının terminale yazdığı metni ayrıştırır ve sonucu üretir.
   */
  public executeCommand(rawInput: string, currentConfig: CircleConfig): CommandExecutionResult {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return { lines: [] };
    }

    this.addToHistory(trimmed);
    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'ciz':
      case 'draw': {
        if (args.length > 0) {
          const parsedR = parseFloat(args[0]);
          const validation = CircleGeometry.validateRadius(parsedR);
          if (!validation.valid) {
            return {
              lines: [ConsoleRenderer.createTerminalLine(`Hata: ${validation.error}`, 'error')],
            };
          }
          return {
            lines: [
              ConsoleRenderer.createTerminalLine(`Yarıçap ${parsedR} olarak ayarlandı ve çiziliyor...`, 'system'),
            ],
            updatedConfig: { radius: parsedR },
            shouldDraw: true,
          };
        }
        return {
          lines: [
            ConsoleRenderer.createTerminalLine(`Mevcut yarıçap (${currentConfig.radius}) ile çizim yapılıyor...`, 'system'),
          ],
          shouldDraw: true,
        };
      }

      case 'yaricap':
      case 'radius':
      case 'r': {
        if (args.length === 0) {
          return {
            lines: [
              ConsoleRenderer.createTerminalLine(`Mevcut yarıçap: ${currentConfig.radius}. Değiştirmek için: yaricap <sayı>`, 'system'),
            ],
          };
        }
        const r = parseFloat(args[0]);
        const validation = CircleGeometry.validateRadius(r);
        if (!validation.valid) {
          return {
            lines: [ConsoleRenderer.createTerminalLine(`Hata: ${validation.error}`, 'error')],
          };
        }
        return {
          lines: [
            ConsoleRenderer.createTerminalLine(`Yarıçap ${r} birim olarak güncellendi. Çizim için 'ciz' yazın veya bekleyin.`, 'system'),
          ],
          updatedConfig: { radius: r },
          shouldDraw: true,
        };
      }

      case 'mod':
      case 'mode': {
        if (args.length === 0) {
          return {
            lines: [
              ConsoleRenderer.createTerminalLine(`Mevcut mod: ${currentConfig.mode}. Değiştirmek için: mod outline veya mod filled`, 'system'),
            ],
          };
        }
        const targetMode = args[0].toLowerCase();
        if (targetMode === 'outline' || targetMode === 'bos' || targetMode === 'cember') {
          return {
            lines: [ConsoleRenderer.createTerminalLine('Mod değiştirildi: İçi Boş (Outline)', 'system')],
            updatedConfig: { mode: 'outline' },
            shouldDraw: true,
          };
        } else if (targetMode === 'filled' || targetMode === 'dolu' || targetMode === 'daire') {
          return {
            lines: [ConsoleRenderer.createTerminalLine('Mod değiştirildi: İçi Dolu (Filled)', 'system')],
            updatedConfig: { mode: 'filled' },
            shouldDraw: true,
          };
        }
        return {
          lines: [ConsoleRenderer.createTerminalLine('Geçersiz mod. Kullanım: mod outline | mod filled', 'error')],
        };
      }

      case 'karakter':
      case 'char': {
        if (args.length === 0) {
          return {
            lines: [
              ConsoleRenderer.createTerminalLine(`Mevcut karakter: '${currentConfig.char}'. Değiştirmek için: karakter <sembol>`, 'system'),
            ],
          };
        }
        const newChar = args[0][0] || '*';
        return {
          lines: [ConsoleRenderer.createTerminalLine(`Çizim karakteri '${newChar}' olarak güncellendi.`, 'system')],
          updatedConfig: { char: newChar },
          shouldDraw: true,
        };
      }

      case 'oran':
      case 'aspect': {
        if (args.length === 0) {
          return {
            lines: [
              ConsoleRenderer.createTerminalLine(`Mevcut en/boy oranı düzeltmesi: ${currentConfig.aspectRatio}. Değiştirmek için: oran <1.0 - 2.5>`, 'system'),
            ],
          };
        }
        const ratio = parseFloat(args[0]);
        if (isNaN(ratio) || ratio < 0.5 || ratio > 3.0) {
          return {
            lines: [ConsoleRenderer.createTerminalLine('Oran 0.5 ile 3.0 arasında bir değer olmalıdır (Monospace yazıtipleri için önerilen: 2.0).', 'error')],
          };
        }
        return {
          lines: [ConsoleRenderer.createTerminalLine(`En/boy oranı katsayısı ${ratio} olarak ayarlandı.`, 'system')],
          updatedConfig: { aspectRatio: ratio },
          shouldDraw: true,
        };
      }

      case 'temizle':
      case 'clear':
      case 'cls': {
        return {
          lines: [],
          clearTerminal: true,
        };
      }

      case 'telif':
      case 'copyright':
      case 'imza': {
        return {
          lines: [
            ConsoleRenderer.createTerminalLine(CopyrightService.getConsoleBanner(), 'copyright'),
          ],
        };
      }

      case 'bilgi':
      case 'info': {
        const infoMsg = [
          `=== Konsol Daire Çizici Yapılandırması ===`,
          `Yarıçap (r): ${currentConfig.radius}`,
          `Çizim Modu: ${currentConfig.mode === 'filled' ? 'İçi Dolu' : 'İçi Boş (Çember)'}`,
          `Karakter: '${currentConfig.char}'`,
          `En/Boy Oranı: ${currentConfig.aspectRatio}`,
          `Telif Sahibi: ${CopyrightService.AUTHOR} © ${CopyrightService.YEAR}`,
          `Mimari Kuralı: Single Responsibility Principle (SRP) & DRY`,
        ].join('\n');
        return {
          lines: [ConsoleRenderer.createTerminalLine(infoMsg, 'system')],
        };
      }

      case 'yardim':
      case 'help':
      case '?': {
        const helpMsg = [
          `=== KULLANILABİLİR KOMUTLAR ===`,
          `  ciz [yarıçap]      : Belirtilen veya mevcut yarıçapla konsola daire çizer`,
          `  yaricap <değer>    : Yarıçapı günceller (Örn: yaricap 10)`,
          `  mod <outline|filled> : Çizim modunu seçer (içi boş / içi dolu)`,
          `  karakter <sembol>  : Çizim karakterini değiştirir (Örn: karakter #)`,
          `  oran <katsayı>     : Monospace font en/boy oranını ayarlar (Örn: oran 2.0)`,
          `  bilgi              : Mevcut çizim ayarlarını gösterir`,
          `  telif              : Enes Öztürk telif hakkı ve imza bilgilerini listeler`,
          `  temizle            : Konsol ekranını temizler`,
        ].join('\n');
        return {
          lines: [ConsoleRenderer.createTerminalLine(helpMsg, 'system')],
        };
      }

      default:
        // Kullanıcı doğrudan sadece bir sayı girdiyse (Örn: 8) bunu yarıçap olarak yorumlayalım
        const maybeNumber = parseFloat(trimmed);
        if (!isNaN(maybeNumber) && parts.length === 1) {
          const validation = CircleGeometry.validateRadius(maybeNumber);
          if (validation.valid) {
            return {
              lines: [
                ConsoleRenderer.createTerminalLine(`Yarıçap ${maybeNumber} olarak algılandı ve daire çiziliyor...`, 'system'),
              ],
              updatedConfig: { radius: maybeNumber },
              shouldDraw: true,
            };
          }
        }

        return {
          lines: [
            ConsoleRenderer.createTerminalLine(
              `Bilinmeyen komut: '${trimmed}'. Kullanılabilir komutları görmek için 'yardim' yazın.`,
              'error'
            ),
          ],
        };
    }
  }
}

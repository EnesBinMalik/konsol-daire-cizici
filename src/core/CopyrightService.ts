/**
 * @file CopyrightService.ts
 * Single Responsibility: Telif hakkı, imza metinleri ve lisans banner'larının yönetiminden tek başına sorumludur.
 * Yazar: Enes Öztürk
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

export class CopyrightService {
  public static readonly AUTHOR: string = 'Enes Öztürk';
  public static readonly YEAR: number = 2026;
  public static readonly PROJECT_NAME: string = 'Konsol Daire Çizim Uygulaması';
  public static readonly LICENSE_TYPE: string = 'Özel Telif Hakkı (Tüm Hakları Saklıdır)';

  /**
   * Kısa tek satırlık telif imzası döndürür.
   */
  public static getShortSignature(): string {
    return `© ${this.YEAR} ${this.AUTHOR}. Tüm Hakları Saklıdır.`;
  }

  /**
   * Konsol çıktılarının üstüne veya altına eklenecek resmi ASCII telif banner'ı.
   */
  public static getConsoleBanner(): string {
    const divider = '='.repeat(52);
    return [
      `/* ${divider}`,
      ` * ${this.PROJECT_NAME}`,
      ` * Yazar / Geliştirici: ${this.AUTHOR}`,
      ` * Lisans / Telif: © ${this.YEAR} ${this.AUTHOR} (Tüm Hakları Saklıdır)`,
      ` * Mimari: Single Responsibility Principle (SRP) & DRY`,
      ` * ${divider} */`,
    ].join('\n');
  }

  /**
   * Konsol çıktısının altındaki mini imza.
   */
  public static getFooterSignature(): string {
    return `[İmza: ${this.AUTHOR} | Telif Hakkı © ${this.YEAR}]`;
  }

  /**
   * Tarayıcı DevTools konsoluna renkli özel imza basmak için stil kuralları döndürür.
   */
  public static getDevToolsStyledBanner(): { text: string; styles: string[] } {
    const text = `%c  Şekil Çizimi: Daire Konsol Motoru  %c\n%c  © ${this.YEAR} ${this.AUTHOR} - Tüm Hakları Saklıdır  %c\n%c  Single Responsibility & DRY Mimarisi  `;
    const styles = [
      'background: #0f172a; color: #38bdf8; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px 4px 0 0;',
      '',
      'background: #1e293b; color: #a5f3fc; font-weight: 600; font-size: 12px; padding: 2px 8px;',
      '',
      'background: #0284c7; color: #ffffff; font-size: 11px; padding: 2px 8px; border-radius: 0 0 4px 4px;',
    ];
    return { text, styles };
  }
}

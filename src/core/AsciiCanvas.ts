/**
 * @file AsciiCanvas.ts
 * Single Responsibility: 2 Boyutlu karakter matrisini (ızgara hafızası) saklamak, pikselleri set/get etmek ve metne dönüştürmekten tek başına sorumludur.
 * Yazar: Enes Öztürk
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

export class AsciiCanvas {
  private readonly width: number;
  private readonly height: number;
  private readonly buffer: string[][];
  private readonly defaultEmptyChar: string;

  constructor(width: number, height: number, defaultEmptyChar: string = ' ') {
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));
    this.defaultEmptyChar = defaultEmptyChar;
    this.buffer = this.createBuffer(this.defaultEmptyChar);
  }

  /**
   * Boş karakterlerle doldurulmuş yeni bir 2D matris oluşturur (DRY prensibi).
   */
  private createBuffer(char: string): string[][] {
    const grid: string[][] = [];
    for (let y = 0; y < this.height; y++) {
      grid.push(new Array(this.width).fill(char));
    }
    return grid;
  }

  /**
   * İstenen koordinatın sınırlar dahilinde olup olmadığını kontrol eder.
   */
  public isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Belirtilen (x, y) konumuna karakter yazar.
   */
  public setPixel(x: number, y: number, char: string): boolean {
    if (!this.isInBounds(x, y)) {
      return false;
    }
    this.buffer[y][x] = char;
    return true;
  }

  /**
   * Belirtilen (x, y) konumundaki karakteri okur.
   */
  public getPixel(x: number, y: number): string {
    if (!this.isInBounds(x, y)) {
      return this.defaultEmptyChar;
    }
    return this.buffer[y][x];
  }

  /**
   * Tuvali belirli bir karakterle temizler.
   */
  public clear(emptyChar: string = this.defaultEmptyChar): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.buffer[y][x] = emptyChar;
      }
    }
  }

  /**
   * Tuval genişliğini döndürür.
   */
  public getWidth(): number {
    return this.width;
  }

  /**
   * Tuval yüksekliğini döndürür.
   */
  public getHeight(): number {
    return this.height;
  }

  /**
   * Matristeki toplam hücre sayısını verir.
   */
  public getTotalCells(): number {
    return this.width * this.height;
  }

  /**
   * Boş olmayan (çizilmiş) karakter sayısını sayar.
   */
  public countDrawnPixels(emptyChar: string = this.defaultEmptyChar): number {
    let count = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.buffer[y][x] !== emptyChar) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * 2D karakter matrisini konsol için satır sonuyla birleştirilmiş metin (string) haline getirir.
   */
  public toString(): string {
    return this.buffer.map((row) => row.join('')).join('\n');
  }

  /**
   * Ham matris kopyasını döndürür.
   */
  public getRawGrid(): string[][] {
    return this.buffer.map((row) => [...row]);
  }
}

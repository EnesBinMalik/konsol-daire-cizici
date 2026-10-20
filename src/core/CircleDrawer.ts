/**
 * @file CircleDrawer.ts
 * Single Responsibility: Daire geometrisi ve tuvalini bir araya getirerek daireyi rasterize etmekten (çizim algoritmasından) tek başına sorumludur.
 * Yazar: Enes Öztürk
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

import { AsciiCanvas } from './AsciiCanvas';
import { CircleGeometry } from './CircleGeometry';
import { CircleConfig, DrawStats } from './types';

export interface IShapeDrawer {
  draw(): { canvas: AsciiCanvas; stats: DrawStats };
}

export class CircleDrawer implements IShapeDrawer {
  private readonly config: CircleConfig;

  constructor(config: CircleConfig) {
    this.config = config;
  }

  /**
   * Daireyi çizer ve ortaya çıkan tuvali ile istatistikleri döndürür.
   */
  public draw(): { canvas: AsciiCanvas; stats: DrawStats } {
    const startTime = performance.now();
    const { radius, mode, char, emptyChar, aspectRatio, thicknessTolerance } = this.config;

    // 1. Geometriden ızgara boyutlarını al (SRP)
    const { width, height, centerX, centerY } = CircleGeometry.calculateGridDimensions(
      radius,
      aspectRatio
    );

    // 2. Tuvali başlat (SRP)
    const canvas = new AsciiCanvas(width, height, emptyChar);

    // 3. Her koordinat için mesafe ve nokta kontrolü uygula (DRY)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const distance = CircleGeometry.calculateDistance(x, y, centerX, centerY, aspectRatio);

        const shouldDraw =
          mode === 'filled'
            ? CircleGeometry.isPointInsideCircle(distance, radius)
            : CircleGeometry.isPointOnCircumference(distance, radius, thicknessTolerance);

        if (shouldDraw) {
          canvas.setPixel(x, y, char);
        }
      }
    }

    const endTime = performance.now();
    const drawnChars = canvas.countDrawnPixels(emptyChar);

    const stats: DrawStats = {
      radius,
      width,
      height,
      totalChars: canvas.getTotalCells(),
      drawnChars,
      circumference: CircleGeometry.calculateCircumference(radius),
      area: CircleGeometry.calculateArea(radius),
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    };

    return { canvas, stats };
  }

  /**
   * Çizim animasyonu için adım adım çizilecek piksel listesini döndürür.
   */
  public getDrawCoordinates(): { x: number; y: number; char: string; width: number; height: number }[] {
    const { radius, mode, char, emptyChar, aspectRatio, thicknessTolerance } = this.config;
    const { width, height, centerX, centerY } = CircleGeometry.calculateGridDimensions(
      radius,
      aspectRatio
    );

    const coordinates: { x: number; y: number; char: string; width: number; height: number }[] = [];

    // Dıştan içe veya satır satır sıralama
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const distance = CircleGeometry.calculateDistance(x, y, centerX, centerY, aspectRatio);

        const shouldDraw =
          mode === 'filled'
            ? CircleGeometry.isPointInsideCircle(distance, radius)
            : CircleGeometry.isPointOnCircumference(distance, radius, thicknessTolerance);

        if (shouldDraw) {
          coordinates.push({ x, y, char, width, height });
        }
      }
    }

    return coordinates;
  }
}

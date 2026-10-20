/**
 * @file CircleGeometry.ts
 * Single Responsibility: Daireye ait salt geometrik ve matematiksel hesaplamalardan tek başına sorumludur.
 * Yazar: Enes Öztürk
 * Telif Hakkı: Enes Öztürk © 2026. Tüm Hakları Saklıdır.
 */

export class CircleGeometry {
  /**
   * Yarıçapın geçerli bir sayı olup olmadığını doğrular.
   */
  public static validateRadius(radius: number): { valid: boolean; error?: string } {
    if (isNaN(radius)) {
      return { valid: false, error: 'Yarıçap sayısal bir değer olmalıdır.' };
    }
    if (radius <= 0) {
      return { valid: false, error: 'Yarıçap 0\'dan büyük bir pozitif tam sayı olmalıdır.' };
    }
    if (radius > 50) {
      return { valid: false, error: 'Konsol görünürlüğü için maksimum yarıçap 50 olarak sınırlandırılmıştır.' };
    }
    return { valid: true };
  }

  /**
   * Terminal / konsol karakterlerinin dikeyde yataya göre yaklaşık 2 kat uzun olması nedeniyle
   * optik olarak kusursuz bir daire elde etmek için gereken ızgara boyutlarını hesaplar.
   *
   * @param radius Yarıçap (r)
   * @param aspectRatio Monospace karakter en-boy düzeltme katsayısı (varsayılan: 2.0)
   */
  public static calculateGridDimensions(radius: number, aspectRatio: number = 2.0): { width: number; height: number; centerX: number; centerY: number } {
    const height = Math.round(2 * radius) + 1;
    const width = Math.round(2 * radius * aspectRatio) + 1;
    const centerX = (width - 1) / 2;
    const centerY = (height - 1) / 2;

    return { width, height, centerX, centerY };
  }

  /**
   * Verilen (x, y) koordinatının merkezden olan normalleştirilmiş yarıçap mesafesini hesaplar.
   * $D(x, y) = \sqrt{\left(\frac{x - cx}{\text{aspectRatio}}\right)^2 + (y - cy)^2}$
   */
  public static calculateDistance(
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    aspectRatio: number
  ): number {
    const dx = (x - centerX) / aspectRatio;
    const dy = y - centerY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Noktanın daire sınırında (çember çizgisinde) olup olmadığını belirler.
   *
   * @param distance Merkezden hesaplanan mesafe
   * @param radius Yarıçap
   * @param tolerance Çizgi kalınlığı toleransı (varsayılan: 0.5)
   */
  public static isPointOnCircumference(
    distance: number,
    radius: number,
    tolerance: number = 0.55
  ): boolean {
    return Math.abs(distance - radius) <= tolerance;
  }

  /**
   * Noktanın dairenin içinde (içi dolu mod) olup olmadığını belirler.
   */
  public static isPointInsideCircle(distance: number, radius: number): boolean {
    return distance <= radius + 0.35;
  }

  /**
   * Dairenin matematiksel çevresini hesaplar: $2 \times \pi \times r$
   */
  public static calculateCircumference(radius: number): number {
    return 2 * Math.PI * radius;
  }

  /**
   * Dairenin matematiksel alanını hesaplar: $\pi \times r^2$
   */
  public static calculateArea(radius: number): number {
    return Math.PI * radius * radius;
  }
}

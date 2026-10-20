/**
 * @file architectureDoc.ts
 * Single Responsibility & DRY ilkesi açıklamaları ve C# / TypeScript referans kodları.
 * Telif Hakkı: Enes Öztürk © 2026
 */

export interface ClassDoc {
  name: string;
  responsibility: string;
  methods: { name: string; description: string }[];
  dryExplanation: string;
}

export const ARCHITECTURE_CLASSES: ClassDoc[] = [
  {
    name: 'CircleGeometry',
    responsibility: 'Yalnızca daireye ait matematiksel ve geometrik hesaplamalardan (mesafe, çevre, alan, ızgara boyutları) sorumludur.',
    methods: [
      { name: 'validateRadius(r)', description: 'Yarıçapın pozitif ve geçerli bir sayı olduğunu kontrol eder.' },
      { name: 'calculateGridDimensions(r, ar)', description: 'Monospace karakter oranına göre en-boy ve merkez koordinatlarını üretir.' },
      { name: 'calculateDistance(x, y, cx, cy, ar)', description: 'Verilen koordinatın merkezden olan normalleştirilmiş mesafesini verir.' },
      { name: 'isPointOnCircumference(d, r, tol)', description: 'Noktanın çember sınırında (içi boş) olup olmadığını belirler.' },
      { name: 'isPointInsideCircle(d, r)', description: 'Noktanın daire içinde (içi dolu) olup olmadığını belirler.' },
      { name: 'calculateCircumference(r)', description: '2 * π * r formülüyle çevre hesaplar.' },
      { name: 'calculateArea(r)', description: 'π * r² formülüyle alan hesaplar.' },
    ],
    dryExplanation: 'Mesafe formülü ve yarıçap kontrolü tek bir yerde toplanarak çizim motoru ve validasyonlarda tekrar yazılması önlenmiştir.',
  },
  {
    name: 'AsciiCanvas',
    responsibility: 'Yalnızca 2 boyutlu karakter matrisini (ızgara hafızası) saklamak, sınır kontrollerini yapmak ve dizeye (string) dönüştürmekten sorumludur.',
    methods: [
      { name: 'setPixel(x, y, char)', description: 'Sınırları güvenli şekilde denetleyerek belirtilen konuma karakter koyar.' },
      { name: 'getPixel(x, y)', description: 'Verilen koordinattaki karakteri döndürür.' },
      { name: 'clear(emptyChar)', description: 'Tuvali baştan boşluk veya seçilen karakterle sıfırlar.' },
      { name: 'countDrawnPixels()', description: 'Çizilmiş piksel sayısını hesaplar.' },
      { name: 'toString()', description: 'Matrisi satır sonu ile birleştirip konsola basılmaya hazır metin yapar.' },
    ],
    dryExplanation: '2D dizi dolaşma, sınır aşımı korumaları ve satır birleştirme mantığı her çizimde yeniden yazılmaz.',
  },
  {
    name: 'CircleDrawer (IShapeDrawer)',
    responsibility: 'Yalnızca geometri hesaplamaları ile tuvali koordine edip çizim algoritmasını (rasterization) yürütmekten sorumludur.',
    methods: [
      { name: 'draw()', description: 'Verilen yarıçap ve yapılandırmayla daireyi tuval üzerine çizer ve istatistikleri üretir.' },
      { name: 'getDrawCoordinates()', description: 'Adım adım çizim animasyonu için çizilecek koordinat dizisini çıkarır.' },
    ],
    dryExplanation: 'Çizim modu (içi boş vs dolu) tek bir ortak döngüde CircleGeometry kararlarına delege edilerek döngü tekrarı ortadan kaldırılmıştır.',
  },
  {
    name: 'ConsoleRenderer',
    responsibility: 'Yalnızca çizim çıktılarını terminale, tarayıcı console.log ortamına biçimlendirip göndermekten sorumludur.',
    methods: [
      { name: 'logToBrowserConsole(output, stats, mode)', description: 'F12 geliştirici konsoluna renkli başlık, telif ve istatistik tablosu basar.' },
      { name: 'formatDrawResultLines(output, stats, mode)', description: 'UI sanal terminaline telif bannerı ve istatistik satırlarını hazırlar.' },
      { name: 'createTerminalLine(content, type)', description: 'Zaman damgalı terminal satırı oluşturur.' },
    ],
    dryExplanation: 'Konsol biçimlendirme ve telif ekleme kuralları tek merkezden yürütülür.',
  },
  {
    name: 'TerminalController',
    responsibility: 'Yalnızca kullanıcı komut satırı girdilerini ayrıştırmak (CLI parser) ve komut geçmişini (history) yönetmekten sorumludur.',
    methods: [
      { name: 'executeCommand(input, config)', description: 'Metni komut ve argümanlara ayırıp uygun servislere iletir.' },
      { name: 'addToHistory(cmd)', description: 'Komut geçmişine ekler.' },
      { name: 'getPreviousCommand() / getNextCommand()', description: 'Yukarı/Aşağı ok tuşlarıyla geçmişte dolaşmayı sağlar.' },
    ],
    dryExplanation: 'Komut eşleştirme ve argüman denetimleri tek bir yerde toplanmıştır.',
  },
  {
    name: 'CopyrightService',
    responsibility: 'Yalnızca Enes Öztürk telif hakları, imza metinleri, telif bannerları ve lisans doğrulamalarından sorumludur.',
    methods: [
      { name: 'getConsoleBanner()', description: 'ASCII telif ve imza çerçevesini üretir.' },
      { name: 'getShortSignature()', description: 'Kısa telif satırını döndürür.' },
      { name: 'getFooterSignature()', description: 'Konsol altı imza metnini döndürür.' },
    ],
    dryExplanation: 'Telif metni ve yazar adı hiçbir yerde hardcoded çoğaltılmaz, bu servisten çağrılır.',
  },
];

export const CSHARP_FULL_CODE = `/**
 * ============================================================================
 * Proje: Konsol Daire Çizim Uygulaması (C# Console Application)
 * Yazar & Telif Sahibi: Enes Öztürk
 * Telif Hakkı: © 2026 Enes Öztürk. Tüm Hakları Saklıdır.
 * Mimari İlkeler: Single Responsibility Principle (SRP) & Don't Repeat Yourself (DRY)
 * ============================================================================
 */

using System;
using System.Text;

namespace ConsoleCircleDrawing
{
    // ------------------------------------------------------------------------
    // 1. TELİF HAKKI SERVİSİ (Single Responsibility: Telif & İmza Yönetimi)
    // ------------------------------------------------------------------------
    public static class CopyrightService
    {
        public const string Author = "Enes Öztürk";
        public const int Year = 2026;

        public static void PrintBanner()
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("/* ========================================================");
            Console.WriteLine($" * Şekil Çizimi: Konsol Daire Çizici");
            Console.WriteLine($" * Yazar / Geliştirici: {Author}");
            Console.WriteLine($" * Telif Hakkı: © {Year} {Author} (Tüm Hakları Saklıdır)");
            Console.WriteLine($" * Mimari: Single Responsibility Principle (SRP) & DRY");
            Console.WriteLine(" * ======================================================== */");
            Console.ResetColor();
        }

        public static void PrintFooter()
        {
            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.WriteLine($"\\n[Telif Hakkı © {Year} {Author} | Tüm Hakları Saklıdır]\\n");
            Console.ResetColor();
        }
    }

    // ------------------------------------------------------------------------
    // 2. DAİRE GEOMETRİSİ (Single Responsibility: Matematik & Geometrik Hesaplar)
    // ------------------------------------------------------------------------
    public static class CircleGeometry
    {
        public const double AspectRatio = 2.0; // Monospace karakter en/boy oranı düzeltmesi

        public static bool ValidateRadius(string input, out double radius, out string errorMessage)
        {
            if (!double.TryParse(input, out radius))
            {
                errorMessage = "Lütfen geçerli bir sayı giriniz!";
                return false;
            }
            if (radius <= 0)
            {
                errorMessage = "Yarıçap 0'dan büyük pozitif bir sayı olmalıdır!";
                return false;
            }
            if (radius > 40)
            {
                errorMessage = "Konsol ekran sınırları için yarıçap en fazla 40 olabilir!";
                return false;
            }
            errorMessage = string.Empty;
            return true;
        }

        public static double CalculateDistance(int x, int y, double centerX, double centerY)
        {
            double dx = (x - centerX) / AspectRatio;
            double dy = y - centerY;
            return Math.Sqrt(dx * dx + dy * dy);
        }

        public static bool IsOnCircumference(double distance, double radius, double tolerance = 0.55)
        {
            return Math.Abs(distance - radius) <= tolerance;
        }

        public static bool IsInside(double distance, double radius)
        {
            return distance <= radius + 0.35;
        }
    }

    // ------------------------------------------------------------------------
    // 3. ASCII TUVALİ (Single Responsibility: 2D Karakter Matrisi & Metin Üretimi)
    // ------------------------------------------------------------------------
    public class AsciiCanvas
    {
        public int Width { get; }
        public int Height { get; }
        private readonly char[,] _buffer;
        private readonly char _emptyChar;

        public AsciiCanvas(int width, int height, char emptyChar = ' ')
        {
            Width = width;
            Height = height;
            _emptyChar = emptyChar;
            _buffer = new char[height, width];
            Clear();
        }

        public void Clear()
        {
            for (int y = 0; y < Height; y++)
                for (int x = 0; x < Width; x++)
                    _buffer[y, x] = _emptyChar;
        }

        public bool SetPixel(int x, int y, char c)
        {
            if (x < 0 || x >= Width || y < 0 || y >= Height)
                return false;

            _buffer[y, x] = c;
            return true;
        }

        public override string ToString()
        {
            var sb = new StringBuilder();
            for (int y = 0; y < Height; y++)
            {
                for (int x = 0; x < Width; x++)
                {
                    sb.Append(_buffer[y, x]);
                }
                sb.AppendLine();
            }
            return sb.ToString();
        }
    }

    // ------------------------------------------------------------------------
    // 4. DAİRE ÇİZİCİ (Single Responsibility: Geometri ve Tuvali Birleştirip Çizim Yapma)
    // ------------------------------------------------------------------------
    public class CircleDrawer
    {
        public AsciiCanvas Draw(double radius, bool isFilled = false, char drawChar = '*')
        {
            int height = (int)Math.Round(2 * radius) + 1;
            int width = (int)Math.Round(2 * radius * CircleGeometry.AspectRatio) + 1;
            double centerX = (width - 1) / 2.0;
            double centerY = (height - 1) / 2.0;

            var canvas = new AsciiCanvas(width, height);

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    double dist = CircleGeometry.CalculateDistance(x, y, centerX, centerY);
                    bool shouldDraw = isFilled
                        ? CircleGeometry.IsInside(dist, radius)
                        : CircleGeometry.IsOnCircumference(dist, radius);

                    if (shouldDraw)
                    {
                        canvas.SetPixel(x, y, drawChar);
                    }
                }
            }

            return canvas;
        }
    }

    // ------------------------------------------------------------------------
    // 5. KONSOL RENDERER (Single Responsibility: Çıktıyı Ekrana Renkli Basma)
    // ------------------------------------------------------------------------
    public static class ConsoleRenderer
    {
        public static void Render(AsciiCanvas canvas, double radius, bool isFilled)
        {
            CopyrightService.PrintBanner();

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine(canvas.ToString());
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"[Bilgi] Yarıçap: {radius} | Mod: {(isFilled ? "İçi Dolu" : "İçi Boş")} | Çözünürlük: {canvas.Width}x{canvas.Height}");
            Console.ResetColor();

            CopyrightService.PrintFooter();
        }
    }

    // ------------------------------------------------------------------------
    // 6. GİRİŞ VE UYGULAMA AKIŞI (Program - Main)
    // ------------------------------------------------------------------------
    class Program
    {
        static void Main(string[] args)
        {
            Console.Title = "Konsol Daire Çizici - Enes Öztürk";
            CopyrightService.PrintBanner();

            while (true)
            {
                Console.ForegroundColor = ConsoleColor.White;
                Console.Write("Lütfen çizmek istediğiniz dairenin yarıçapını (r) giriniz (Çıkış için 'q'): ");
                Console.ResetColor();

                string? input = Console.ReadLine();
                if (string.Equals(input?.Trim(), "q", StringComparison.OrdinalIgnoreCase))
                {
                    Console.WriteLine("Uygulamadan çıkılıyor. İyi günler dileriz!");
                    break;
                }

                if (!CircleGeometry.ValidateRadius(input ?? "", out double radius, out string error))
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"[HATA] {error}\\n");
                    Console.ResetColor();
                    continue;
                }

                Console.Write("Çizim modu (1: İçi Boş Çember, 2: İçi Dolu Daire) [Varsayılan 1]: ");
                string? modeInput = Console.ReadLine();
                bool isFilled = modeInput?.Trim() == "2";

                Console.Write("Kullanılacak karakter (Varsayılan '*'): ");
                string? charInput = Console.ReadLine();
                char drawChar = string.IsNullOrEmpty(charInput) ? '*' : charInput[0];

                Console.WriteLine("\\nÇiziliyor...\\n");

                var drawer = new CircleDrawer();
                var canvas = drawer.Draw(radius, isFilled, drawChar);

                ConsoleRenderer.Render(canvas, radius, isFilled);
            }
        }
    }
}
`;

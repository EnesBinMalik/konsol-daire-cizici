# Konsol Daire Çizici

Kullanıcının belirlediği yarıçap ve çizim karakteriyle konsolda daire oluşturan etkileşimli bir algoritma eğitim uygulaması. Geometri hesaplama, ASCII çizimi, terminal çıktısı ve uygulama akışı ayrı sorumluluklara bölünmüştür.

## Özellikler

- Yarıçap ve çizim karakteri seçerek daire oluşturma
- Daire geometrisinin ve ASCII koordinatlarının hesaplanması
- Adım adım terminal simülasyonu ve çizim çıktısı
- Konsol tamponunu yönetme ve çıktıyı temizleme
- Nesne yönelimli mimariyi inceleme
- Single Responsibility ve DRY ilkelerini gösteren modüler tasarım

## Teknolojiler

- React
- TypeScript
- Vite
- Tailwind CSS

## Gereksinimler

- Node.js LTS
- npm

## Kurulum ve çalıştırma

```bash
npm install
npm run dev
```

Geliştirme sunucusu başladıktan sonra terminalde gösterilen yerel adresi tarayıcıda açın.

## Kontroller ve üretim derlemesi

```bash
npm run lint
npm run build
```

`npm run lint` TypeScript tip denetimini, `npm run build` ise üretim derlemesini çalıştırır. Derlemeyi yerel olarak görüntülemek için `npm run build` sonrasında `npm run preview` komutunu kullanın.

## Proje yapısı

- `src/core/` — daire geometrisi, ASCII tuvali, çizici ve terminal denetleyicisi
- `src/components/` — kontrol paneli, terminal görünümü ve mimari açıklamalar
- `src/data/` — mimari dokümantasyon verileri
- `src/App.tsx` — uygulama akışı ve ekran bileşenlerinin koordinasyonu
- `src/main.tsx` — uygulama giriş noktası

## Kullanım

1. Daire yarıçapını ve çizim karakterini belirleyin.
2. Simülasyonu başlatıp oluşturulan terminal çıktısını inceleyin.
3. Geometri ve koordinat hesaplamalarını adım adım takip edin.
4. Mimari görünümünden modüllerin sorumluluklarını inceleyin.

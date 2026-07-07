# Harcama Defteri

Yurt dışı iş avansı ve döviz harcama takibi. App Store gerekmez, ücretsizdir, verileriniz
yalnızca kendi cihazınızda kalır. iPhone'un ana ekranına eklendiğinde gerçek bir uygulama
gibi tam ekran açılır ve **çevrimdışı** da çalışır (yurt dışında internet olmasa bile).

---

## 📱 iPhone ana ekranına uygulama olarak ekleme

iOS'ta bir web uygulamasını "uygulama" gibi ana ekrana koymak için önce onu bir internet
adresinde (HTTPS) yayınlamak gerekir. Aşağıda en kolay ücretsiz yol var.

### 1. Adım — Yayınla (ücretsiz, ~1 dakika)

**En kolay yöntem — Netlify Drop:**
1. Bilgisayarında https://app.netlify.com/drop adresini aç.
2. Bu klasördeki **`dist`** klasörünü sürükleyip sayfaya bırak.
3. Birkaç saniye içinde sana `https://...netlify.app` gibi bir adres verilir.
   (Adresi kalıcı tutmak için ücretsiz bir hesapla giriş yapman yeterli.)

> Alternatifler: GitHub Pages, Vercel veya Cloudflare Pages — hepsi ücretsiz ve HTTPS verir.
> Hangisini kullanırsan kullan, yayınlanan klasör her zaman **`dist`** olmalı.

### 2. Adım — Ana ekrana ekle (iPhone'da)

1. Verilen adresi iPhone'da **Safari** ile aç (Chrome değil, Safari olmalı).
2. Alttaki **Paylaş** düğmesine dokun (kutudan yukarı ok çıkan simge).
3. Listede **"Ana Ekrana Ekle"**yi seç.
4. İstersen adını düzenle, **"Ekle"**ye dokun.

Artık ana ekranında kendi simgesiyle bir uygulaman var. Dokununca tarayıcı çubukları
olmadan tam ekran açılır. İlk açılıştan sonra internetsiz de çalışır.

---

## 💻 Geliştirme (isteğe bağlı — kodu değiştirmek istersen)

Gerekli: [Node.js](https://nodejs.org) (18 veya üzeri).

```bash
npm install       # bağımlılıkları kur (ilk seferde bir kez)
npm run dev       # canlı geliştirme sunucusu (tarayıcıda otomatik yenilenir)
npm run build     # yayına hazır sürümü 'dist' klasörüne üretir
npm run preview   # üretilen 'dist' sürümünü yerelde önizler
```

Kodu her değiştirdikten sonra `npm run build` çalıştırıp yeni `dist` klasörünü tekrar
yayınla (Netlify Drop'a yeniden sürükle) — uygulaman otomatik güncellenir.

---

## 🗂️ Proje yapısı

```
harcama-defteri/
├─ index.html                # HTML girişi + iOS ana ekran etiketleri
├─ vite.config.js            # Vite + PWA (manifest, çevrimdışı) ayarları
├─ package.json
├─ public/                   # simgeler (ana ekran ikonu) ve favicon
│  ├─ apple-touch-icon.png
│  ├─ icon-192.png / icon-512.png / icon-512-maskable.png
│  └─ favicon.svg
├─ dist/                     # DERLENMİŞ, yayına hazır sürüm (bunu yayınla)
└─ src/
   ├─ main.jsx               # React girişi + servis çalışanı kaydı
   ├─ App.jsx                # ana ekran + tüm durum yönetimi
   ├─ index.css              # renk paleti ve stiller
   ├─ data/
   │  ├─ currencies.js       # para birimleri listesi
   │  └─ categories.js       # harcama kategorileri (renk + ikon)
   ├─ lib/
   │  ├─ format.js           # sayı / para / tarih yardımcıları
   │  └─ storage.js          # verileri cihazda saklama (localStorage)
   └─ components/
      ├─ ServisKart.jsx      # listedeki servis kartı
      ├─ ServisDetay.jsx     # servis detayı (özet, grafik, harcamalar)
      ├─ ServisFormu.jsx     # servis ekle / düzenle
      ├─ HarcamaFormu.jsx    # harcama ekle / düzenle (döviz + kur)
      ├─ OzetModal.jsx       # teslim özeti (kopyalanabilir döküm)
      ├─ ParaBirimiSecici.jsx
      ├─ KategoriRozeti.jsx
      ├─ Donut.jsx
      └─ Modal.jsx
```

---

## ℹ️ Notlar

- **Veriler nerede?** Her şey cihazın tarayıcısında (`localStorage`) saklanır; buluta hiçbir
  şey gönderilmez. Sadece o cihaza aittir.
- **Yedek al:** iOS, uzun süre açılmayan web uygulamalarının verisini bazen temizleyebilir.
  Önemli kayıtların için servis içindeki **Teslim özeti → Panoya kopyala** ile dökümü
  saklamak iyi bir alışkanlıktır. (İstenirse dışa/içe JSON yedekleme eklenebilir.)
- **Kur elle girilir:** Her harcamada "1 [döviz] = kaç ₺" değerini sen belirlersin; aynı
  serviste bir dövizi tekrar kullanınca son kuru otomatik gelir.
```

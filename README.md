# Müşteri Şube Değişim Uygulaması

Bu proje, bankacılık müşterilerinin bağlı oldukları şubeyi **hizmet ihtiyaçlarına ve konuma göre yapay zeka destekli** olarak değiştirmelerini sağlayan bir web uygulamasıdır. Kullanıcıdan alınan bilgiler ve konum verisiyle birlikte **en yakın 5 şube analiz edilir**, ardından Google Gemini modeli en uygun şubeyi önerir. Kullanıcı onaylarsa sistem otomatik olarak müşteriyi yeni şubeye devreder.

---

## Özellikler

- TC Kimlik No veya Müşteri No ile müşteri girişi
- Haversine formülünün fonksiyonlaştırılması ile mesafe hesaplama
- Hizmet anketi ile müşteri ihtiyaçlarının belirlenmesi
- Yapay zeka (Gemini API) ile şube önerisi
- JSON dosyalarında gerçek zamanlı güncelleme ile devir işlemi

---

## Klasör Yapısı

```
musteri_devir_react/
├── backend/
│   ├── routes/
│   ├── data/
│   ├── app.js
│   └── bin/www
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── .env
└── README.md
```

---

## Kurulum

### 1. Projeyi klonla

```bash
git clone https://github.com/kullaniciAdi/musteri_devir_react.git
cd musteri_devir_react
```

### 2. Backend bağımlılıklarını yükle

```bash
cd backend
npm install
```

### 3. Frontend bağımlılıklarını yükle

```bash
cd ../frontend
npm install
```

---

## 🔐 .env Dosyası

`backend` klasörüne `.env` adında bir dosya oluştur ve içine şu satırı ekle:

```env
GEMINI_API_KEY=buraya_gemini_api_anahtarını_yaz
```

## Uygulamayı Çalıştır

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run dev
```

## 🧠 Kullanılan Teknolojiler

- **React (Vite)** — Önyüz bileşen yapısı
- **Node.js & Express** — API sunucusu
- **Google Gemini API** — LLM destekli şube önerisi
- **Haversine** — Konumlar arası mesafe hesaplama
- **JSON** — Veri yönetimi (veritabanı yerine)

---

## 📦 JSON Dosyaları

| Dosya Adı             | Açıklama                            |
|-----------------------|-------------------------------------|
| `customers.json`      | Müşteri bilgileri                   |
| `branches.json`       | Şube konum ve hizmet bilgisi        |
| `services.json`       | Bankacılık hizmet listesi           |

Tüm dosyalar `backend/data` klasöründe yer alır.

---

## 🧪 Kullanım Akışı

1. Müşteri TC Kimlik No veya Müşteri No ile giriş yapar.
2. Sistemdeki mevcut şube bilgileri görüntülenir.
3. "Ankete Git" butonuna tıklanarak hizmet ihtiyaçları seçilir.
4. Sistem, müşterinin konumuna en yakın 5 şubeyi belirler.
5. Gemini API'ye bu bilgiler iletilerek öneri alınır.
6. Müşteri öneriyi onaylarsa sistem müşteri kaydını günceller.

---

## 📝 Ek Bilgiler

- Müşterilerde `needsDisabilitySupport` alanı bulunur.
- Şubelerde `hasDisabilityUnit` alanı engelli erişimini belirtir.
- "Engelli Müşteri Desteği" hizmeti kaldırılmıştır çünkü bu bilgi ayrı olarak tutulmaktadır.
- Tüm frontend bileşenleri `.jsx` uzantısı ile yazılmıştır.
- Müşteri arayüzü kırmızı-beyaz temalı modern bir tasarıma sahiptir.

---

## 📮 Katkıda Bulun

Bu proje eğitim amaçlıdır. İstek, öneri veya katkılar için `issue` ya da `pull request` gönderebilirsiniz.

---

## 🛡️ Lisans

Bu proje telif hakkı sahibine aittir. Ticari kullanım için izin gerektirir.


# 🎮 MoodStack — Geliştirici Ruh Hali Takipçisi

> *"Bugün hangi yazılımcısın?"* — Kod Canavarı mı, yoksa Shift Sonu mu?

MoodStack, yazılımcıların gün içindeki ruh halini ve üretkenlik durumunu **RPG oyun mekaniğiyle** takip etmesini sağlayan eğlenceli bir mobil uygulamadır. Sıkıcı yapılacaklar listesi değil; XP kazan, seviye atla, kombo yap!

---

## 📺 Tanıtım Videosu

[![MoodStack YouTube Tanıtım Videosu](https://img.youtube.com/vi/_VwPpQXdTpI/maxresdefault.jpg)](https://youtube.com/shorts/_VwPpQXdTpI?feature=share)

▶️ **[YouTube'da İzle →](https://youtube.com/shorts/_VwPpQXdTpI?feature=share)**

---

## 🎯 Projenin Amacı

Yazılımcılar gün boyunca çok farklı ruh halleri yaşar. Bazen her şey mükemmel akar, bazen de tek bir bug saati yutar. MoodStack bu değişimleri kayıt altına alarak:

- **Kendi verimliliğini fark etmeni** sağlar
- **Hangi saatlerde en üretken olduğunu** görselleştirir
- **Günlük logun** ile geri dönüp saatlik durumunu analiz etmeni sağlar
- Ve tüm bunları sıkıcı değil, **oyun gibi hissettirerek** yapar

---

## ⚔️ Oyunlaştırma (Gamification) Özellikleri

MoodStack sadece bir mood tracker değil — tam bir RPG deneyimi!

| Özellik | Açıklama |
|---|---|
| 🏅 **XP Sistemi** | Her mod seçiminde `+10 XP` kazanırsın. 100 XP'ye ulaşınca seviye atlarsın! |
| 💥 **Critical Hit** | %15 ihtimalle mod seçiminde `+30 XP` patlak Critical Hit yaşanır |
| 🔥 **Combo Serisi** | Üst üste üretken modlar seçersen (🚀 veya 🤯) kombo seri başlar ve XP 2 katına çıkar |
| 🧠 **RPG Stats** | Her mod seçimi farklı bir yeteneği geliştirir: Hız / Zeka / Enerji / Akıl Sağlığı |
| 🏆 **Dinamik Unvan** | En çok hangi modu seçtiysen ona göre unvanın değişir: *10x Ninja, Çözüm Mimarı, Kafein Bağımlısı...* |
| ⏱️ **Odak Asistanı** | Seçtiğin moda göre Pomodoro zamanlayıcısı otomatik başlar (50dk odak, 25dk debug, 15dk mola) |
| 🗓️ **Günlük Günlük** | Gün içinde seçtiğin tüm modları ve zamanlarını görebileceğin geçmiş ekranı |
| 🎨 **Dinamik Tema** | Seçtiğin moda göre uygulama arka planı renk değiştirir |

### 🕹️ Mod Seçenekleri

- 🚀 **Kod Canavarı** — Flow halinde, hiçbir şey durduramaz! (50 dk Odak)
- ☕ **Kahve Lazım** — Enerji düşük, mola zamanı (15 dk Mola)
- 🤯 **Debug Çıkmazı** — Tek bir bug için saatler geçiyor... (25 dk Pomodoro)
- 😴 **Shift Bitti** — Bugün dünyayı kurtardın, git uyu

---

## 📲 İndirilebilir APK

Android cihazınıza kurarak hemen test edebilirsiniz:

🔗 **[MoodStack.apk — Direkt İndir](https://expo.dev/artifacts/eas/tg7Uh5EyAdbvoj3nYRnBD5.apk)**

> **Not:** APK dosyasını indirirken Android sistemi "Bilinmeyen kaynaklardan yükleme" izni isteyebilir. Bunu **Ayarlar → Güvenlik → Bilinmeyen Uygulamalar** bölümünden izin vererek kurulumu tamamlayabilirsiniz. Bu tamamen normaldir çünkü uygulama Play Store üzerinden değil, doğrudan kurulmaktadır.

---

## 🚀 Nasıl Çalıştırılır? (Installation & Run)

### Gereksinimler

- [Node.js](https://nodejs.org/) (v18 veya üzeri)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android veya iOS cihaz (ya da Emülatör)

### Adım Adım Kurulum

**1. Repoyu Klonlayın**
```bash
git clone https://github.com/yagmurtprkl/MoodStack.git
cd MoodStack
```

**2. Bağımlılıkları Yükleyin**
```bash
npm install
```

**3. Uygulamayı Başlatın**
```bash
npx expo start
```

**4. Telefonunuzda Açın**

Terminalde QR kodu çıkacaktır. Bunu telefona okutmanın iki yolu var:

- 📱 **Android:** [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) uygulamasını indirin ve QR kodu okutun
- 📱 **iOS:** Kamera uygulamasıyla QR kodu okutun

> Alternatif olarak bilgisayarınızda Android Emülatörü çalıştırıyorsanız terminalde `a` tuşuna basmanız yeterlidir.

---

## 🛠️ Kullanılan Teknolojiler

- **React Native** — Cross-platform mobil geliştirme
- **Expo** — Geliştirme ve derleme altyapısı
- **expo-linear-gradient** — Gradient efektleri
- **react-native-safe-area-context** — Güvenli ekran alanı yönetimi
- **React Hooks** — `useState`, `useEffect`, `useCallback`, `React.memo`

---

## 👩‍💻 Geliştirici

**Yağmur Topraklı** — [@yagmurtprkl](https://github.com/yagmurtprkl)

---

*Made with ☕ and 🚀 by a developer, for developers.*

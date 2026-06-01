<h1 align="center">OpenFrontIO-TroopTiming</h1>

<p align="center">
  <img src="assets/TroopTimingNoBackground.svg" alt="OpenFrontIO-TroopTiming Logo" width="200"/>
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a>
</p>

[OpenFront.io](https://openfront.io/) oyunu için gerçek zamanlı birlik (troop) timing overlay'i. Tek bir userscript. Çalışması için tarayıcınıza Tampermonkey, Greasemonkey veya Violentmonkey gibi bir kullanıcı betiği eklentisi yüklemeniz gerekir. ✨

## 🚀 Özellikler

- 🎯 **Troop Timing Overlay** — Gerçek zamanlı birlik çubuğu overlay'i
- 📊 Renk kodlu gradient çubuğu (0%–100%)
- ✨ Yumuşak geçişli animasyonlu marker
- 🎨 Birlik oranına göre renk kodlu strateji ikonları (yıldız/onay/saat)
- 🏷️ Birlik rozeti rengi override
- 🔄 Game API kullanılamıyorsa DOM scraping ile çalışır

## 📸 Ekran Görüntüleri

<p align="center">
<img src="assets/TroopTiming1.png" alt="Troop Timing Overlay - Düşük Birlik" width="45%"/>
&nbsp;&nbsp;
<img src="assets/TroopTiming2.png" alt="Troop Timing Overlay - Yüksek Birlik" width="45%"/>
</p>

## 🛠️ Kurulum

1. Tarayıcınıza bir kullanıcı betiği eklentisi yükleyin:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Edge)
   - [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)
2. Scripti yükleyin:

**[📥 Scripti Yükle](OpenFrontIO-TroopTiming.user.js)** · **[📥 GreasyFork ile Yükle](https://greasyfork.org/scripts/580709-openfrontio-trooptiming)**

Veya [`OpenFrontIO-TroopTiming.user.js`](OpenFrontIO-TroopTiming.user.js) dosyasının içeriğini yeni bir kullanıcı betiğine kopyalayın.

3. [openfront.io](https://openfront.io/) veya [openfront.dev](https://openfront.dev/) adresine gidin — overlay otomatik olarak oyun sayfalarında görünecektir 🎮

## 📁 Deposun Yapısı

```
OpenFrontIO-TroopTiming/
├── README.md # İngilizce versiyon 🇬🇧
├── README.tr.md # Bu dosya (Türkçe) 🇹🇷
├── AGENTS.md # AI ajan bilgi bankası 🤖
├── .gitignore
├── OpenFrontIO-TroopTiming.user.js # Userscript (Tampermonkey/Greasemonkey)
├── assets/ # Proje logoları ve ekran görüntüleri 🖼️
│   ├── TroopTimingBackground.svg
│   ├── TroopTimingNoBackground.svg
│   ├── TroopTiming1.png
│   └── TroopTiming2.png
└── colors/ # Material Design 3 renk şemaları 🎨
```

## 💻 Geliştirme

Script tek bağımsız bir JavaScript dosyasıdır. Build adımına gerek yoktur. ⚡

Değişiklik yapmak için:
1. `OpenFrontIO-TroopTiming.user.js` dosyasını düzenleyin
2. Tampermonkey'de script simgesine tıklayın → Düzenle
3. Veya dosyadan yeniden yükleyin

## 📜 Lisans

Kaynak kodu AGPL v3 lisansı altındadır. Detaylar için [OpenFrontIO/LICENSE](https://github.com/openfrontio/OpenFrontIO/blob/main/LICENSE). ⚖️

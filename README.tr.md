# OpenFrontIO-TroopTiming

<p align="center">
  <img src="assets/TroopTimingNoBackground.svg" alt="OpenFrontIO-TroopTiming Logo" width="200"/>
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a>
</p>

[OpenFront.io](https://openfront.io/) oyunu için gerçek zamanlı birlik (troop) timing overlay'i. Tek bir Tampermonkey/Greasemonkey userscript.

## Özellikler

- **Troop Timing Overlay** — Gerçek zamanlı birlik çubuğu overlay'i
  - Renk kodlu gradient çubuğu (0%–100%)
  - Yumuşak geçişli animasyonlu marker
  - Birlik oranına göre renk kodlu strateji ikonları (yıldız/onay/saat)
  - Birlik rozeti rengi override
  - Game API kullanılamıyorsa DOM scraping ile çalışır

## Kurulum

1. Tarayıcınıza [Tampermonkey](https://www.tampermonkey.net/) veya [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) yükleyin
2. Scripti yükleyin:

   **[Scripti Yükle](OpenFrontIO-TroopTiming.user.js)**

   Veya `OpenFrontIO-TroopTiming.user.js` dosyasının içeriğini yeni bir Tampermonkey scriptine kopyalayın.

3. [openfront.io](https://openfront.io/) veya [openfront.dev](https://openfront.dev/) adresine gidin — overlay otomatik olarak oyun sayfalarında görünecektir

## Deposun Yapısı

```
OpenFrontIO-TroopTiming/
├── README.md                         # İngilizce versiyon
├── README.tr.md                      # Bu dosya (Türkçe)
├── .gitignore
├── OpenFrontIO-TroopTiming.user.js   # Userscript (Tampermonkey/Greasemonkey)
├── assets/                           # Proje logoları (SVG)
└── colors/                           # Material Design 3 renk şemaları
```

## Geliştirme

Script tek bağımsız bir JavaScript dosyasıdır. Build adımına gerek yoktur.

Değişiklik yapmak için:
1. `OpenFrontIO-TroopTiming.user.js` dosyasını düzenleyin
2. Tampermonkey'de script simgesine tıklayın → Düzenle
3. Veya dosyadan yeniden yükleyin

## Lisans

Kaynak kodu AGPL v3 lisansı altındadır. Detaylar için [OpenFrontIO/LICENSE](https://github.com/openfrontio/OpenFrontIO/blob/main/LICENSE).

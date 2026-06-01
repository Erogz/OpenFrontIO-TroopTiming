# OpenFrontIO-TroopTiming

<p align="center">
<a href="https://github.com/erenferhat/openfront-io-trooptiming">GitHub'da Görüntüle</a>
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

Userscript'i Tampermonkey veya Greasemonkey ile yükleyin, ardından openfront.io veya openfront.dev adresine gidin — overlay otomatik olarak oyun sayfalarında görünecektir.

## Depo

Kaynak kod ve sorunlar: [github.com/erenferhat/openfront-io-trooptiming](https://github.com/erenferhat/openfront-io-trooptiming)

## Yapı

    OpenFrontIO-TroopTiming/
    ├── OpenFrontIO-TroopTiming.user.js  # Userscript (Tampermonkey/Greasemonkey)
    ├── assets/                           # Proje logoları ve ekran görüntüleri
    │   ├── TroopTimingBackground.svg
    │   ├── TroopTimingNoBackground.svg
    │   ├── TroopTiming1.png
    │   └── TroopTiming2.png
    └── colors/                           # Material Design 3 renk şemaları

## Geliştirme

Script tek bağımsız bir JavaScript dosyasıdır. Build adımına gerek yoktur.

Değişiklik yapmak için:
1. `OpenFrontIO-TroopTiming.user.js` dosyasını düzenleyin
2. Tampermonkey'de script simgesine tıklayın → Düzenle
3. Veya dosyadan yeniden yükleyin

## Lisans

Kaynak kodu AGPL v3 lisansı altındadır. Detaylar için OpenFrontIO/LICENSE dosyasına bakın.

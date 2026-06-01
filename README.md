<h1 align="center">OpenFrontIO-TroopTiming</h1>

<p align="center">
<img src="assets/TroopTimingNoBackground.svg" alt="OpenFrontIO-TroopTiming Logo" width="200"/>
</p>

<p align="center">
<a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a>
</p>

A userscript that adds a real-time troop timing overlay to <a href="https://openfront.io/" target="_blank" rel="noopener noreferrer">OpenFront.io</a>. Requires a userscript extension such as <a href="https://www.tampermonkey.net/" target="_blank" rel="noopener noreferrer">Tampermonkey</a>, <a href="https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/" target="_blank" rel="noopener noreferrer">Greasemonkey</a>, or <a href="https://violentmonkey.github.io/" target="_blank" rel="noopener noreferrer">Violentmonkey</a>. ✨

## 🚀 Features

- 🎯 **Troop Timing Overlay** — Real-time troop bar overlay with color-coded strategy indicator
- 📊 Gradient bar showing troop percentage (0%–100%)
- ✨ Animated marker with smooth transitions
- 🎨 Color-coded strategy icons (star/checkmark/clock) based on troop ratio
- 🏷️ Troop badge override with matching colors
- 🔄 Falls back to DOM scraping if the game API is unavailable

## 📸 Screenshots

<p align="center">
<img src="assets/TroopTiming1.png" alt="Troop Timing Overlay - Low Troops" width="45%"/>
&nbsp;&nbsp;
<img src="assets/TroopTiming2.png" alt="Troop Timing Overlay - High Troops" width="45%"/>
</p>

## 🛠️ Installation

1. Install a userscript extension in your browser:
- <a href="https://www.tampermonkey.net/" target="_blank" rel="noopener noreferrer">Tampermonkey</a> (Chrome, Firefox, Edge)
- <a href="https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/" target="_blank" rel="noopener noreferrer">Greasemonkey</a> (Firefox)
- <a href="https://violentmonkey.github.io/" target="_blank" rel="noopener noreferrer">Violentmonkey</a> (Chrome, Firefox, Edge)
2. Install the script:

**[📥 Install Script](OpenFrontIO-TroopTiming.user.js)** · **[📥 Install from GreasyFork](https://greasyfork.org/scripts/580709-openfrontio-trooptiming)**

Or copy the contents of [`OpenFrontIO-TroopTiming.user.js`](OpenFrontIO-TroopTiming.user.js) into a new userscript.

3. Navigate to <a href="https://openfront.io/" target="_blank" rel="noopener noreferrer">openfront.io</a> or <a href="https://nightly.openfront.dev/" target="_blank" rel="noopener noreferrer">nightly.openfront.dev</a> — the overlay will appear automatically on game pages 🎮

## 📁 Repository Structure

```
OpenFrontIO-TroopTiming/
├── README.md # This file (English) 🇬🇧
├── README.tr.md # Turkish version 🇹🇷
├── AGENTS.md # AI agent knowledge base 🤖
├── .gitignore
├── OpenFrontIO-TroopTiming.user.js # Userscript (Tampermonkey/Greasemonkey)
├── assets/ # Project logos and screenshots 🖼️
│ ├── TroopTimingBackground.svg
│ ├── TroopTimingNoBackground.svg
│ ├── TroopTiming1.png
│ └── TroopTiming2.png
└── colors/ # Material Design 3 color schemes 🎨
```

## 💻 Development

The script is a single self-contained JavaScript file. No build step required. ⚡

To modify:
1. Edit `OpenFrontIO-TroopTiming.user.js`
2. In Tampermonkey, click the script icon → Edit
3. Or reinstall from the file

## 📜 License

Source code is licensed under AGPL v3. See <a href="https://github.com/openfrontio/OpenFrontIO/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">OpenFrontIO/LICENSE</a> for details. ⚖️

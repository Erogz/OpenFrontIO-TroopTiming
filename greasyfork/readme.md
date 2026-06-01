# OpenFrontIO-TroopTiming

<p align="center">
<a href="https://github.com/erenferhat/openfront-io-trooptiming">View on GitHub</a>
</p>

A Tampermonkey/Greasemonkey userscript that adds a real-time troop timing overlay to [OpenFront.io](https://openfront.io/).

## Features

- **Troop Timing Overlay** — Real-time troop bar overlay with color-coded strategy indicator
- Gradient bar showing troop percentage (0%–100%)
- Animated marker with smooth transitions
- Color-coded strategy icons (star/checkmark/clock) based on troop ratio
- Troop badge override with matching colors
- Falls back to DOM scraping if the game API is unavailable

## Installation

Install the userscript using Tampermonkey or Greasemonkey, then open openfront.io or openfront.dev — the overlay will appear automatically on game pages.

## Repository

Source code and issues: [github.com/erenferhat/openfront-io-trooptiming](https://github.com/erenferhat/openfront-io-trooptiming)

## Structure

    OpenFrontIO-TroopTiming/
    ├── OpenFrontIO-TroopTiming.user.js  # Userscript (Tampermonkey/Greasemonkey)
    ├── assets/                           # Project logos and screenshots
    │   ├── TroopTimingBackground.svg
    │   ├── TroopTimingNoBackground.svg
    │   ├── TroopTiming1.png
    │   └── TroopTiming2.png
    └── colors/                           # Material Design 3 color schemes

## Development

The script is a single self-contained JavaScript file. No build step required.

To modify:
1. Edit `OpenFrontIO-TroopTiming.user.js`
2. In Tampermonkey, click the script icon → Edit
3. Or reinstall from the file

## License

Source code is licensed under AGPL v3. See OpenFrontIO/LICENSE for details.

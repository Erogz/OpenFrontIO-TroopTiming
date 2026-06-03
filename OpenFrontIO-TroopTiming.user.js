// ==UserScript==
// @name OpenFrontIO-TroopTiming
// @name:tr OpenFrontIO-TroopTiming
// @namespace https://github.com/Erogz/OpenFrontIO-TroopTiming
// @version 1.1.1
// @description Real-time troop timing overlay for OpenFront.io
// @description:tr OpenFront.io için gerçek zamanlı birlik timing overlay'i
// @author       Erogz
// @match        https://openfront.io/*
// @match https://nightly.openfront.dev/*

// @grant        GM_getValue
// @grant GM_setValue
// @run-at document-idle
// @icon https://raw.githubusercontent.com/Erogz/OpenFrontIO-TroopTiming/main/assets/TroopTimingNoBackground.svg
// @homepage https://github.com/Erogz/OpenFrontIO-TroopTiming
// @license MIT
// ==/UserScript==

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════
  //  Storage (Tampermonkey GM_* API)
  // ══════════════════════════════════════════════════════════════
  const StorageHelper = {
  get(key, defaultValue = null) {
    try {
      const val = GM_getValue(key, defaultValue);
      return val !== undefined ? val : defaultValue;
    } catch (e) {
      console.warn('[OFTT] StorageHelper.get error:', e.message);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      GM_setValue(key, value);
    } catch (e) {
      console.warn('[OFTT] StorageHelper.set error:', e.message);
    }
  },
  };

  // ══════════════════════════════════════════════════════════════
  //  Utils
  // ══════════════════════════════════════════════════════════════
  const Utils = {
    _cachedGame: null,

    findGame() {
      // Fast path: return cached game if still alive
      if (this._cachedGame) {
        try {
          this._cachedGame.ticks();
          return this._cachedGame;
        } catch (e) {
          this._cachedGame = null;
        }
      }
      // Scan HUD elements for .game property
      const HUD_SELECTORS = [
        'events-display', 'leader-board', 'control-panel',
        'chat-display', 'player-panel', 'build-menu',
        'actionable-events', 'unit-display', 'team-stats',
        'game-left-sidebar', 'game-right-sidebar',
        'heads-up-message', 'alert-frame', 'spawn-timer',
        'immunity-timer', 'win-modal', 'replay-panel',
        'emoji-table', 'in-game-promo', 'performance-overlay',
      ];
      for (const sel of HUD_SELECTORS) {
        try {
          const el = document.querySelector(sel);
          if (el && el.game && typeof el.game === 'object' && typeof el.game.ticks === 'function') {
            this._cachedGame = el.game;
            return el.game;
          }
        } catch (e) { /* noop */ }
      }
      // window.game global
      try {
        if (window.game && typeof window.game === 'object' && typeof window.game.ticks === 'function') {
          this._cachedGame = window.game;
          return window.game;
        }
      } catch (e) { /* noop */ }
      return null;
    },

    findPlayer(gameObj) {
      if (!gameObj) return null;
      if (typeof gameObj.myPlayer === 'function') {
        const p = gameObj.myPlayer();
        if (p && typeof p.troops === 'function') return p;
      }
      if (gameObj.player && typeof gameObj.player.troops === 'function') return gameObj.player;
      if (Array.isArray(gameObj.players) && gameObj.players.length > 0) {
        const p = gameObj.players[0];
        if (typeof p.troops === 'function') return p;
      }
      for (const key in gameObj) {
        const val = gameObj[key];
        if (val && typeof val === 'object' && typeof val.troops === 'function') return val;
      }
      return null;
    },

    isInGamePage() {
      return /\/(?:w\d+\/)?game(?:\/|$)/.test(window.location.pathname);
    },

    getTroopData() {
      const game = this.findGame();
      if (game) {
        try {
          const player = this.findPlayer(game);
          if (!player) throw new Error('Player not found');
          const config = game.config();
          if (!config) throw new Error('Config not found');
          const current = player.troops();
          const max = config.maxTroops(player);
          const incPerTick = config.troopIncreaseRate(player);
          const tickRate = config.tickDuration ? config.tickDuration() : 100;
          const incPerSec = incPerTick * (1000 / tickRate);
          return { current, max, incPerSec, source: 'api' };
        } catch (e) {
          console.warn('[OFTT] API failed, falling back to DOM:', e.message);
        }
      }
      const scraped = this.scrapeTroopFromDOM();
      if (scraped) {
        return { current: scraped.current, max: scraped.max, incPerSec: scraped.incPerSec, source: 'dom' };
      }
      return { current: 0, max: 0, incPerSec: 0, source: 'none' };
    },

    scrapeTroopFromDOM() {
      const fill = document.querySelector('.bg-malibu-blue[style*="width"]');
      if (!fill) return null;
      const bar = fill.closest('.h-6.border-gray-600') || fill.parentElement?.parentElement;
      if (!bar) return null;
      const between = bar.querySelector('.justify-between');
      if (!between) return null;
      const txt = (between.textContent || '').replace(/\s+/g, '');
      const matches = [...txt.matchAll(/([\d.]+)\s*(K|M|B)/g)];
      if (matches.length < 2) return null;
      const parse = (n, s) => {
        const val = parseFloat(n);
        const mult = s === 'M' ? 1e6 : s === 'B' ? 1e9 : 1e3;
        return Math.round(val * mult);
      };
      const current = parse(matches[0][1], matches[0][2]);
      const max = parse(matches[1][1], matches[1][2]);
      let incPerSec = 0;
      const panel = document.querySelector('control-panel') || document;
      const rateSpans = panel.querySelectorAll('span[translate="no"].tabular-nums, span.tabular-nums');
      for (const span of rateSpans) {
        const t = (span.textContent || '').trim();
        if (t.includes('/s')) {
          const m = t.match(/^([+-]?[\d.]+)/);
          if (m) { incPerSec = parseFloat(m[1]); break; }
        }
      }
      return { current, max, incPerSec };
    },
  };

  // ══════════════════════════════════════════════════════════════
  //  TroopAdvisor
  // ══════════════════════════════════════════════════════════════
  const GRADIENT_STOPS = [
    { p: 0.00, hex: '#ff1744' },
    { p: 0.22, hex: '#ff1744' },
    { p: 0.30, hex: '#ff9100' },
    { p: 0.38, hex: '#ffea00' },
    { p: 0.44, hex: '#76ff03' },
    { p: 0.48, hex: '#00e676' },
    { p: 0.52, hex: '#00e676' },
    { p: 0.56, hex: '#76ff03' },
    { p: 0.62, hex: '#ffea00' },
    { p: 0.70, hex: '#ff9100' },
    { p: 0.78, hex: '#ff1744' },
    { p: 1.00, hex: '#ff1744' },
  ];

  const TroopAdvisor = {
    zoneBar: null,
    markerEl: null,
    iconWrapEl: null,
    iconSvg: null,
    pctEl: null,
    pctText: null,
    settings: {},
    refreshInterval: 100,

    init() {
      this.loadSettings();
      this.startLoop();
    },

  loadSettings() {
    const stored = StorageHelper.get('troopOverlaySettings', {});
    this.settings = {
      enabled: true,
      ...stored,
    };
  },

    createElements() {
      if (this.zoneBar) return;
      const zoneBar = document.createElement('div');
      zoneBar.style.cssText = `
        position: absolute; left: 0; right: 0; top: 0px; height: 4px;
        pointer-events: none; z-index: 1;
        border-radius: 2px; opacity: 0;
        background: linear-gradient(to right,
          #ff1744 0%, #ff1744 22%,
          #ff9100 30%, #ffea00 38%,
          #76ff03 44%, #00e676 48%,
          #00e676 52%, #76ff03 56%,
          #ffea00 62%, #ff9100 70%,
          #ff1744 78%, #ff1744 100%);
      `;
      this.zoneBar = zoneBar;

      const marker = document.createElement('div');
      marker.style.cssText = `
        position: absolute; top: -4px; bottom: -4px; width: 4px;
        transform: translateX(-50%); pointer-events: none; z-index: 10;
        border-radius: 2px; opacity: 0.5;
        box-shadow: 0 0 6px rgba(0,0,0,0.6);
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                   background 0.3s ease,
                   box-shadow 0.3s ease;
      `;
      this.markerEl = marker;

      const pctEl = document.createElement('span');
      pctEl.style.cssText = `
        position: absolute; left: 4px; bottom: 0px; display: inline-flex;
        align-items: center; pointer-events: none; z-index: 20;
        white-space: nowrap;
      `;
      this.pctEl = pctEl;

      const pctText = document.createElement('span');
      pctText.style.cssText = `
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 14px; font-weight: 1000; letter-spacing: -0.02em; line-height: 1;
        text-shadow: 0 0 3px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,0.9);
        color: #fff;
      `;
      this.pctText = pctText;
      pctEl.appendChild(pctText);

      const iconWrap = document.createElement('span');
      iconWrap.style.cssText = `
        position: absolute; right: 4px; bottom: 0px; display: inline-flex;
        align-items: center; gap: 3px; pointer-events: none; z-index: 20;
        white-space: nowrap;
      `;
      this.iconWrapEl = iconWrap;

      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.setAttribute('width', '14');
      iconSvg.setAttribute('height', '14');
      iconSvg.setAttribute('viewBox', '0 0 24 24');
      iconSvg.style.cssText = 'display: block; flex-shrink: 0; fill: currentColor; filter: drop-shadow(0 0 2px rgba(0,0,0,0.9));';
      this.iconSvg = iconSvg;
      iconWrap.appendChild(iconSvg);
    },

    ensureInjected() {
      try {
        if (!document.body) return;
        const panel = document.querySelector('control-panel');
        if (!panel) return;
        if (!this.zoneBar || !this.markerEl || !this.iconWrapEl || !this.iconSvg) {
          this.zoneBar = null;
          this.markerEl = null;
          this.iconWrapEl = null;
          this.iconSvg = null;
        }
        this.createElements();
        const fills = panel.querySelectorAll('div.bg-malibu-blue[style*="width"]');
        for (const fill of fills) {
          if (fill.contains(this.markerEl)) continue;
          const container = fill.closest('div.h-6.border.border-gray-600.rounded-md') || fill.parentElement;
          if (!container) continue;
          container.style.position = container.style.position || 'relative';
          container.style.overflow = 'visible';
          if (!container.contains(this.zoneBar)) container.appendChild(this.zoneBar);
          if (!container.contains(this.iconWrapEl)) container.appendChild(this.iconWrapEl);
          if (!container.contains(this.markerEl)) container.appendChild(this.markerEl);
          if (!container.contains(this.pctEl)) container.appendChild(this.pctEl);
        }
      } catch (e) { /* noop */ }
    },

    hide() {
      try {
        if (this.zoneBar) this.zoneBar.style.opacity = '0';
        if (this.markerEl) this.markerEl.style.opacity = '0';
        if (this.iconWrapEl) this.iconWrapEl.style.opacity = '0';
        if (this.pctEl) this.pctEl.style.opacity = '0';
      } catch (e) { /* noop */ }
    },

    startLoop() {
      let running = false;
      const tick = async () => {
        if (running) { setTimeout(tick, this.refreshInterval); return; }
        running = true;
        try {
          const inGame = Utils.isInGamePage();
          if (inGame && document.querySelector('control-panel')) {
            this.ensureInjected();
            this.updateBar();
          } else {
            this.hide();
          }
        } catch (e) { /* noop */ }
        running = false;
        setTimeout(tick, this.refreshInterval);
      };
      setTimeout(tick, 500);
    },

    updateBar() {
      if (!this.zoneBar || !this.markerEl || !this.iconWrapEl || !this.iconSvg || !this.pctEl) return;
      if (!Utils.isInGamePage()) {
        this.zoneBar.style.opacity = '0';
        this.markerEl.style.opacity = '0';
        this.iconWrapEl.style.opacity = '0';
        this.pctEl.style.opacity = '0';
        return;
      }
      const { current, max, incPerSec, source } = Utils.getTroopData();
      if (max === 0) {
        this.zoneBar.style.opacity = this.settings.enabled ? '0.65' : '0';
        this.markerEl.style.opacity = '0';
        this.iconWrapEl.style.opacity = '0';
        this.pctEl.style.opacity = '0';
        return;
      }
      this.zoneBar.style.opacity = this.settings.enabled ? '0.65' : '0';
      this.markerEl.style.opacity = this.settings.enabled ? '0.85' : '0';
      this.iconWrapEl.style.opacity = this.settings.enabled ? '1' : '0';
      this.pctEl.style.opacity = this.settings.enabled ? '1' : '0';
      const ratio = current / max;
      const container = this.zoneBar.parentElement;
      if (container) {
        this.markerEl.style.left = (ratio * 100) + '%';
      }
      const s = this.evaluateStrategy(current, max, incPerSec, source);
      this.markerEl.style.background = s.color;
      this.markerEl.style.boxShadow = '0 0 6px ' + s.color;
      this.iconSvg.innerHTML = `<path d="${s.iconPath}"/>`;
      this.iconWrapEl.style.color = s.color;
      this.pctText.textContent = Math.round(ratio * 100) + '%';
      this.pctText.style.color = s.color;
      this.overrideTroopBadge(ratio);
    },

    _gradientColorAt(ratio) {
      let lo = GRADIENT_STOPS[0], hi = GRADIENT_STOPS[GRADIENT_STOPS.length - 1];
      for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
        if (ratio >= GRADIENT_STOPS[i].p && ratio <= GRADIENT_STOPS[i + 1].p) {
          lo = GRADIENT_STOPS[i]; hi = GRADIENT_STOPS[i + 1]; break;
        }
      }
      return this.lerpHex(lo.hex, hi.hex, (ratio - lo.p) / (hi.p - lo.p || 1));
    },

    overrideTroopBadge(ratio) {
      try {
        const panel = document.querySelector('control-panel');
        if (!panel) return;
        const candidates = panel.querySelectorAll('div[translate="no"]');
        for (const el of candidates) {
          const span = el.querySelector('span.tabular-nums');
          if (!span || !/\+\d/.test((span.textContent || ''))) continue;
          const img = el.querySelector('img');
          if (!img) continue;
          const color = this._gradientColorAt(ratio);
          const filter = this._hexToIconFilter(color);
          el.style.borderColor = color;
          span.style.color = color;
          img.style.filter = filter;
          break;
        }
      } catch (e) { /* noop */ }
    },

    _hexToIconFilter(hex) {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const l = (max + min) / 2;
      const d = max - min;
      let h = 0;
      if (d > 0) {
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
      }
      const hueDeg = h * 360;
      const hueRotate = hueDeg - 30;
      const invert = l < 0.5 ? 65 + (0.5 - l) * 50 : 65 - (l - 0.5) * 40;
      const invertPct = Math.max(35, Math.min(80, invert));
      const sepiaPct = Math.max(55, Math.min(85, 60 + (1 - l) * 30));
      return `brightness(0) saturate(100%) invert(${invertPct}%) sepia(${sepiaPct}%) saturate(600%) hue-rotate(${hueRotate}deg) brightness(105%)`;
    },

    evaluateStrategy(current, max, incPerSec, source) {
      const ratio = current / max;
      let lo = GRADIENT_STOPS[0], hi = GRADIENT_STOPS[GRADIENT_STOPS.length - 1];
      for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
        if (ratio >= GRADIENT_STOPS[i].p && ratio <= GRADIENT_STOPS[i + 1].p) {
          lo = GRADIENT_STOPS[i]; hi = GRADIENT_STOPS[i + 1]; break;
        }
      }
      const color = this.lerpHex(lo.hex, hi.hex, (ratio - lo.p) / (hi.p - lo.p || 1));
      if (ratio > 0.70) return { color, iconPath: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' };
      if (ratio >= 0.35) return { color, iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' };
      return { color, iconPath: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z' };
    },

    lerpHex(a, b, t) {
      const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
      const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
      const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
      const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
      const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
      return '#' + [r, g, bl].map(v => v.toString(16).padStart(2, '0')).join('');
    },
  };

  // ══════════════════════════════════════════════════════════════
  //  Bootstrap
  // ══════════════════════════════════════════════════════════════
  TroopAdvisor.init();
  console.log('[OpenFrontIO-TroopTiming] Loaded successfully');
})();

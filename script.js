/**
 * CURLING PUZZLES — SPELLING BEE ENGINE
 * Architecture:
 * 1. Ambient Curling Stone Physics & Realistic Granite Material Rendering
 * 2. Deterministic Daily Scheduler (Day 0 = Sept 8, 2026 Eastern Baseline)
 * 3. Web Audio Acoustic Synthesizer (Velocity-sensitive stone clacks, ice sweeps, chimes)
 * 4. Versioned LocalStorage Platform Continuity & Statistics
 * 5. Spelling Bee Core Rules, Keyboard Shortcuts, & Game State Machine
 */

(function () {
  "use strict";

  /* ==========================================================================
     0. CONFIGURATION & CONSTANTS
     ========================================================================== */
  const STORAGE_KEY = "curling_puzzles_spelling_bee_v2";
  const BASELINE_EPOCH_STR = "2026-09-08T00:00:00-04:00"; // Eastern baseline Day 0
  const BASELINE_DATE_MS = new Date(BASELINE_EPOCH_STR).getTime();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  // Curling Rank Titles & Percentage Thresholds
  const RANKS = [
    { title: "Beginner", pct: 0.00 },
    { title: "Lead", pct: 0.05 },
    { title: "Second", pct: 0.15 },
    { title: "Third", pct: 0.30 },
    { title: "Skip", pct: 0.50 },
    { title: "Shot Maker", pct: 0.70 },
    { title: "Club Champ", pct: 0.85 },
    { title: "Button Master", pct: 1.00 }
  ];

  /* ==========================================================================
     1. SOUND SYNTHESIZER (Web Audio API)
     ========================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }

    /**
     * Authentic curling stone-on-stone contact sound.
     * High transient impact mode followed by short granite resonance.
     */
    playClack(intensity = 0.5) {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const volume = Math.max(0.05, Math.min(0.35, intensity * 0.35));

        // High strike transient
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(460, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.065);

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.065);
      } catch (e) {}
    }

    playLetter() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(430, now + 0.045);

        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
      } catch (e) {}
    }

    playWordSuccess(isPangram) {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = isPangram ? [523.25, 659.25, 783.99, 1046.50] : [587.33, 783.99];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = now + i * 0.075;

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.18, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(start);
          osc.stop(start + 0.32);
        });
      } catch (e) {}
    }

    playError() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(145, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.12);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    }

    /**
     * Synthetic sweeping broom whoosh across pebbled ice.
     */
    playShuffle() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.09);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(850, now);
        filter.Q.setValueAtTime(2.8, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
      } catch (e) {}
    }
  }

  /* ==========================================================================
     2. AMBIENT CURLING STONE PHYSICS & REALISTIC GRANITE RENDERING
     ========================================================================== */
  class BackgroundPhysicsEngine {
    constructor(canvas, soundEngine) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.sound = soundEngine;
      this.rocks = [];
      this.animId = null;
      this.lastTime = performance.now();
      this.accumulator = 0;
      this.fixedDt = 1000 / 60; // 16.667ms fixed physics timestep
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.activeGameMode = false;
      this.nextTakeoutTime = performance.now() + 35000;

      this.resize = this.resize.bind(this);
      this.loop = this.loop.bind(this);
      this.init();
    }

    init() {
      this.resize();
      window.addEventListener("resize", this.resize, { passive: true });
      this.spawnRocks();
      if (!this.reducedMotion) {
        this.animId = requestAnimationFrame(this.loop);
      } else {
        this.renderStatic();
      }
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
    }

    createRock(x, y, vx, vy, radius, teamColor, depthScale = 1.0) {
      // Deterministic procedural granite inclusions/speckles
      const speckles = [];
      const count = Math.floor(10 + radius * 0.3);
      for (let s = 0; s < count; s++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * (radius * 0.72);
        speckles.push({
          ox: Math.cos(ang) * dist,
          oy: Math.sin(ang) * dist,
          r: 0.8 + Math.random() * 1.4,
          alpha: 0.15 + Math.random() * 0.35,
          color: Math.random() > 0.4 ? "#263547" : "#E2EEF8"
        });
      }

      return {
        x,
        y,
        vx,
        vy,
        radius,
        depthScale,
        mass: radius * radius,
        handleColor: teamColor, // '#D63B3B' (Red) or '#F0C647' (Yellow)
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.008,
        speckles
      };
    }

    spawnRocks() {
      const isMobile = this.width < 500;
      // Active gameplay view is calmer; Menu screen is richer
      const count = this.activeGameMode ? (isMobile ? 2 : 3) : (isMobile ? 4 : 6);
      this.rocks = [];

      for (let i = 0; i < count; i++) {
        const radius = isMobile ? (22 + Math.random() * 6) : (28 + Math.random() * 8);
        const depthScale = 0.88 + (radius / 36) * 0.22;
        let x, y, overlap;
        let attempts = 0;

        do {
          overlap = false;
          x = radius + 20 + Math.random() * (this.width - radius * 2 - 40);
          y = radius + 20 + Math.random() * (this.height - radius * 2 - 40);

          for (const r of this.rocks) {
            const dx = x - r.x;
            const dy = y - r.y;
            if (Math.hypot(dx, dy) < radius + r.radius + 15) {
              overlap = true;
              break;
            }
          }
          attempts++;
        } while (overlap && attempts < 60);

        const speed = (0.16 + Math.random() * 0.28) * (this.activeGameMode ? 0.6 : 1);
        const angle = Math.random() * Math.PI * 2;
        const teamColor = i % 2 === 0 ? "#D63B3B" : "#F0C647";

        this.rocks.push(this.createRock(
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          radius,
          teamColor,
          depthScale
        ));
      }
    }

    setGameMode(isGameActive) {
      this.activeGameMode = isGameActive;
      this.spawnRocks();
    }

    /**
     * Occasional uncommon ambient "takeout shot" event.
     */
    triggerAmbientTakeout() {
      if (this.rocks.length === 0 || this.reducedMotion) return;
      const radius = this.width < 500 ? 26 : 32;
      const fromLeft = Math.random() > 0.5;
      const x = fromLeft ? -radius - 10 : this.width + radius + 10;
      const y = this.height * 0.25 + Math.random() * (this.height * 0.5);

      const targetX = this.width * 0.5 + (Math.random() - 0.5) * 80;
      const targetY = this.height * 0.5 + (Math.random() - 0.5) * 80;
      const angle = Math.atan2(targetY - y, targetX - x);
      const speed = 1.1 + Math.random() * 0.5;

      const teamColor = Math.random() > 0.5 ? "#D63B3B" : "#F0C647";
      const takeoutRock = this.createRock(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        radius,
        teamColor,
        1.1
      );

      this.rocks.push(takeoutRock);
      if (this.rocks.length > 8) {
        this.rocks.shift();
      }
    }

    resolveCollisions() {
      const len = this.rocks.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const r1 = this.rocks[i];
          const r2 = this.rocks[j];
          const dx = r2.x - r1.x;
          const dy = r2.y - r1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = r1.radius + r2.radius;

          if (dist < minDist && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;

            // Anti-penetration separation
            const overlap = minDist - dist;
            r1.x -= nx * overlap * 0.5;
            r1.y -= ny * overlap * 0.5;
            r2.x += nx * overlap * 0.5;
            r2.y += ny * overlap * 0.5;

            // Relative velocity
            const kx = r1.vx - r2.vx;
            const ky = r1.vy - r2.vy;
            const velAlongNormal = kx * nx + ky * ny;

            // Resolve only if objects are moving toward each other
            if (velAlongNormal > 0) {
              const e = 0.82; // Controlled heavy granite restitution
              const p = ((1 + e) * velAlongNormal) / (r1.mass + r2.mass);

              r1.vx -= p * r2.mass * nx;
              r1.vy -= p * r2.mass * ny;
              r2.vx += p * r1.mass * nx;
              r2.vy += p * r1.mass * ny;

              // Curl spin transfer
              const tangentX = -ny;
              const tangentY = nx;
              const tangVel = kx * tangentX + ky * tangentY;
              r1.vRot -= tangVel * 0.0003;
              r2.vRot += tangVel * 0.0003;

              // Sound impact
              if (velAlongNormal > 0.15) {
                this.sound.playClack(Math.min(1, velAlongNormal / 1.8));
              }
            }
          }
        }
      }
    }

    updatePhysics() {
      for (const r of this.rocks) {
        r.x += r.vx;
        r.y += r.vy;
        r.rotation += r.vRot;

        // Ice friction damping
        r.vx *= 0.9996;
        r.vy *= 0.9996;
        r.vRot *= 0.998;

        // Subtle ambient glide maintenance
        const speed = Math.hypot(r.vx, r.vy);
        if (speed < 0.06) {
          const nudgeAng = Math.random() * Math.PI * 2;
          r.vx += Math.cos(nudgeAng) * 0.025;
          r.vy += Math.sin(nudgeAng) * 0.025;
        }

        // Screen boundary cushions
        if (r.x - r.radius < 0) {
          r.x = r.radius;
          r.vx = Math.abs(r.vx) * 0.88;
        } else if (r.x + r.radius > this.width) {
          r.x = this.width - r.radius;
          r.vx = -Math.abs(r.vx) * 0.88;
        }

        if (r.y - r.radius < 0) {
          r.y = r.radius;
          r.vy = Math.abs(r.vy) * 0.88;
        } else if (r.y + r.radius > this.height) {
          r.y = this.height - r.radius;
          r.vy = -Math.abs(r.vy) * 0.88;
        }
      }

      this.resolveCollisions();
    }

    /**
     * Authentic curling stone rendering:
     * - Contact shadow on ice
     * - Ailsa Craig / Trefor granite body
     * - Mineral inclusions microtexture
     * - Striking band and beveled shoulder
     * - Team colored composite hub
     * - Gooseneck handle with drop shadow onto the stone
     */
    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (const r of this.rocks) {
        const radius = r.radius;
        this.ctx.save();
        this.ctx.translate(r.x, r.y);

        // 1. Soft Contact Shadow directly touching the ice
        this.ctx.beginPath();
        this.ctx.ellipse(2.5, 4.5, radius * 1.04, radius * 0.98, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(16, 47, 74, 0.16)";
        this.ctx.fill();

        // Rotate for stone orientation
        this.ctx.rotate(r.rotation);

        // 2. Outer Granite Body
        const graniteGrad = this.ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 2, 0, 0, radius);
        graniteGrad.addColorStop(0, "#8EA3B8");
        graniteGrad.addColorStop(0.35, "#566B82");
        graniteGrad.addColorStop(0.85, "#304256");
        graniteGrad.addColorStop(1, "#182635");

        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = graniteGrad;
        this.ctx.fill();

        // 3. Granite Microtexture & Mineral Inclusions
        for (const sp of r.speckles) {
          this.ctx.beginPath();
          this.ctx.arc(sp.ox, sp.oy, sp.r, 0, Math.PI * 2);
          this.ctx.fillStyle = sp.color;
          this.ctx.globalAlpha = sp.alpha;
          this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0;

        // 4. Outer Bevel Rim Highlight & Striking Groove
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.88, 0, Math.PI * 2);
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.97, 0, Math.PI * 2);
        this.ctx.strokeStyle = "rgba(16, 47, 74, 0.4)";
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();

        // 5. Central Hub Plate (Composite Team Color)
        const hubGrad = this.ctx.createRadialGradient(-radius * 0.15, -radius * 0.15, 1, 0, 0, radius * 0.44);
        if (r.handleColor === "#D63B3B") {
          hubGrad.addColorStop(0, "#EE6865");
          hubGrad.addColorStop(1, "#B92E34");
        } else {
          hubGrad.addColorStop(0, "#FFE698");
          hubGrad.addColorStop(1, "#D8AA32");
        }

        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.44, 0, Math.PI * 2);
        this.ctx.fillStyle = hubGrad;
        this.ctx.fill();
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();

        // 6. Handle Drop Shadow onto the Stone Surface
        this.ctx.fillStyle = "rgba(16, 47, 74, 0.32)";
        this.ctx.beginPath();
        this.ctx.roundRect(-radius * 0.24 + 1.5, -3 + 2.5, radius * 0.48, 6, 3);
        this.ctx.fill();

        // 7. Raised Gooseneck Handle Grip
        this.ctx.fillStyle = r.handleColor === "#D63B3B" ? "#D63B3B" : "#F0C647";
        this.ctx.beginPath();
        this.ctx.roundRect(-radius * 0.24, -3, radius * 0.48, 6, 3);
        this.ctx.fill();

        // 8. Handle Spine Highlight
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        this.ctx.fillRect(-radius * 0.2, -1.2, radius * 0.4, 2);

        // Center Chrome Bolt
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fill();

        this.ctx.restore();
      }
    }

    loop(currentTime) {
      let frameTime = currentTime - this.lastTime;
      if (frameTime > 100) frameTime = 100;
      this.lastTime = currentTime;

      this.accumulator += frameTime;
      while (this.accumulator >= this.fixedDt) {
        this.updatePhysics();
        this.accumulator -= this.fixedDt;
      }

      if (currentTime > this.nextTakeoutTime) {
        this.triggerAmbientTakeout();
        this.nextTakeoutTime = currentTime + 32000 + Math.random() * 20000;
      }

      this.draw();
      this.animId = requestAnimationFrame(this.loop);
    }

    renderStatic() {
      this.draw();
    }
  }

  /* ==========================================================================
     3. PERSISTENCE & CONTINUITY ENGINE
     ========================================================================== */
  class StorageEngine {
    constructor() {
      this.state = this.load();
    }

    getInitialState() {
      return {
        version: 2,
        soundEnabled: true,
        stats: {
          played: 0,
          geniusCount: 0,
          currentStreak: 0,
          bestStreak: 0,
          totalWords: 0,
          totalPangrams: 0,
          lastPlayedDayIndex: null
        },
        puzzleProgress: {}
      };
    }

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return this.getInitialState();
        const data = JSON.parse(raw);
        if (!data.version || data.version < 2) {
          const initial = this.getInitialState();
          initial.soundEnabled = data.soundEnabled !== false;
          return initial;
        }
        return data;
      } catch (e) {
        return this.getInitialState();
      }
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {}
    }

    getPuzzleState(puzzleId) {
      if (!this.state.puzzleProgress[puzzleId]) {
        this.state.puzzleProgress[puzzleId] = {
          foundWords: [],
          score: 0,
          completed: false
        };
      }
      return this.state.puzzleProgress[puzzleId];
    }

    savePuzzleProgress(puzzleId, foundWords, score, isCompleted) {
      this.state.puzzleProgress[puzzleId] = {
        foundWords: Array.from(new Set(foundWords)),
        score,
        completed: isCompleted
      };
      this.save();
    }

    recordWordFound(isPangram) {
      this.state.stats.totalWords = (this.state.stats.totalWords || 0) + 1;
      if (isPangram) {
        this.state.stats.totalPangrams = (this.state.stats.totalPangrams || 0) + 1;
      }
      this.save();
    }

    recordDailyCompletion(dayIndex, reachedGenius) {
      const stats = this.state.stats;
      stats.played = (stats.played || 0) + 1;
      if (reachedGenius) stats.geniusCount = (stats.geniusCount || 0) + 1;

      if (stats.lastPlayedDayIndex === dayIndex - 1) {
        stats.currentStreak = (stats.currentStreak || 0) + 1;
      } else if (stats.lastPlayedDayIndex !== dayIndex) {
        stats.currentStreak = 1;
      }
      stats.bestStreak = Math.max(stats.bestStreak || 0, stats.currentStreak);
      stats.lastPlayedDayIndex = dayIndex;
      this.save();
    }
  }

  /* ==========================================================================
     4. DETERMINISTIC DAILY SCHEDULER (Day 0 = Sept 8, 2026)
     ========================================================================== */
  class Scheduler {
    constructor(puzzles) {
      this.puzzles = puzzles || [];
    }

    getCurrentDayIndex() {
      const now = new Date();
      const diffMs = now.getTime() - BASELINE_DATE_MS;
      const dayIndex = Math.floor(diffMs / MS_PER_DAY);
      return Math.max(0, dayIndex);
    }

    getPuzzleForDay(dayIndex) {
      if (this.puzzles.length === 0) return null;
      const idx = dayIndex % this.puzzles.length;
      return this.puzzles[idx];
    }

    getTodayPuzzle() {
      const dayIndex = this.getCurrentDayIndex();
      return {
        puzzle: this.getPuzzleForDay(dayIndex),
        dayIndex
      };
    }

    getReleasedVaultPuzzles() {
      const currentDay = this.getCurrentDayIndex();
      const vault = [];

      for (let day = 0; day < currentDay; day++) {
        const p = this.getPuzzleForDay(day);
        if (p) {
          vault.push({
            puzzle: p,
            dayIndex: day,
            dateLabel: this.formatDateForDay(day)
          });
        }
      }
      return vault.reverse();
    }

    formatDateForDay(dayIndex) {
      const date = new Date(BASELINE_DATE_MS + dayIndex * MS_PER_DAY);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
  }

  /* ==========================================================================
     5. MAIN APP CONTROLLER
     ========================================================================== */
  class SpellingBeeApp {
    constructor() {
      this.sound = new SoundEngine();
      this.storage = new StorageEngine();
      this.scheduler = new Scheduler(window.SPELLING_BEE_PUZZLES || []);

      // DOM Elements
      this.screenMenu = document.getElementById("screen-menu");
      this.screenGame = document.getElementById("screen-game");
      this.wordDisplay = document.getElementById("current-word-display");
      this.toastEl = document.getElementById("toast-message");

      // Active Game State
      this.activePuzzle = null;
      this.activeDayIndex = 0;
      this.isVaultPuzzle = false;
      this.currentWord = "";
      this.outerLettersShuffled = [];
      this.maxPossibleScore = 0;
      this.toastTimer = null;

      const canvas = document.getElementById("bg-canvas");
      this.physics = new BackgroundPhysicsEngine(canvas, this.sound);

      this.init();
    }

    init() {
      this.initSoundSetting();
      this.bindEvents();
      this.renderMenu();

      setInterval(() => this.checkMidnightRollover(), 60000);
    }

    initSoundSetting() {
      this.sound.enabled = this.storage.state.soundEnabled !== false;
      this.updateSoundButtonUI();
    }

    updateSoundButtonUI() {
      const onIcon = document.getElementById("sound-icon-on");
      const offIcon = document.getElementById("sound-icon-off");
      const text = document.getElementById("sound-status-text");
      if (this.sound.enabled) {
        onIcon.classList.remove("hidden");
        offIcon.classList.add("hidden");
        text.textContent = "Sound: ON";
      } else {
        onIcon.classList.add("hidden");
        offIcon.classList.remove("hidden");
        text.textContent = "Sound: OFF";
      }
    }

    toggleSound() {
      this.sound.init();
      this.sound.enabled = !this.sound.enabled;
      this.storage.state.soundEnabled = this.sound.enabled;
      this.storage.save();
      this.updateSoundButtonUI();
      if (this.sound.enabled) {
        this.sound.playLetter();
      }
    }

    bindEvents() {
      document.getElementById("btn-sound-toggle").addEventListener("click", () => this.toggleSound());

      document.getElementById("btn-play-today").addEventListener("click", () => {
        this.sound.init();
        this.sound.playLetter();
        const { puzzle, dayIndex } = this.scheduler.getTodayPuzzle();
        this.loadPuzzle(puzzle, dayIndex, false);
        this.showScreen("game");
      });

      document.getElementById("btn-game-back").addEventListener("click", () => {
        this.sound.playLetter();
        this.renderMenu();
        this.showScreen("menu");
      });

      this.bindModal("btn-open-vault", "modal-vault", "btn-close-vault", () => this.renderVault());
      this.bindModal("btn-menu-stats", "modal-stats", "btn-close-stats", () => this.renderStats());
      this.bindModal("btn-menu-help", "modal-help", "btn-close-help");
      this.bindModal("btn-game-help", "modal-help", "btn-close-help");
      this.bindModal("btn-game-words-toggle", "modal-words", "btn-close-words", () => this.renderFoundWordsModal());

      document.getElementById("cell-center").addEventListener("click", () => {
        this.addLetter(this.activePuzzle.centerLetter);
      });

      for (let i = 0; i < 6; i++) {
        document.getElementById(`cell-${i}`).addEventListener("click", () => {
          this.addLetter(this.outerLettersShuffled[i]);
        });
      }

      document.getElementById("btn-action-delete").addEventListener("click", () => this.deleteLetter());
      document.getElementById("btn-action-shuffle").addEventListener("click", () => this.shuffleOuterLetters());
      document.getElementById("btn-action-enter").addEventListener("click", () => this.submitWord());

      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeAllModals();
          return;
        }

        if (!this.screenGame.classList.contains("active")) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        const key = e.key.toUpperCase();
        if (/^[A-Z]$/.test(key)) {
          e.preventDefault();
          this.addLetter(key);
        } else if (e.key === "Backspace") {
          e.preventDefault();
          this.deleteLetter();
        } else if (e.key === "Enter") {
          e.preventDefault();
          this.submitWord();
        } else if (e.key === " ") {
          e.preventDefault();
          this.shuffleOuterLetters();
        }
      });
    }

    closeAllModals() {
      document.querySelectorAll(".app-modal.active").forEach((modal) => {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
      });
    }

    bindModal(triggerId, modalId, closeId, onOpen) {
      const trigger = document.getElementById(triggerId);
      const modal = document.getElementById(modalId);
      const close = document.getElementById(closeId);
      const backdrop = modal.querySelector(".modal-backdrop");

      const open = () => {
        this.sound.init();
        this.sound.playLetter();
        if (onOpen) onOpen();
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
      };

      const hide = () => {
        this.sound.playLetter();
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
      };

      if (trigger) trigger.addEventListener("click", open);
      if (close) close.addEventListener("click", hide);
      if (backdrop) backdrop.addEventListener("click", hide);
    }

    showScreen(screenName) {
      if (screenName === "game") {
        this.screenMenu.classList.remove("active");
        this.screenGame.classList.add("active");
        this.physics.setGameMode(true);
      } else {
        this.screenGame.classList.remove("active");
        this.screenMenu.classList.add("active");
        this.physics.setGameMode(false);
      }
    }

    /* ==========================================================================
       PUZZLE ENGINE & SCORING
       ========================================================================== */
    loadPuzzle(puzzle, dayIndex, isVault) {
      if (!puzzle) return;
      this.activePuzzle = puzzle;
      this.activeDayIndex = dayIndex;
      this.isVaultPuzzle = isVault;
      this.currentWord = "";
      this.outerLettersShuffled = [...puzzle.outerLetters];

      this.maxPossibleScore = puzzle.acceptedWords.reduce((acc, word) => {
        return acc + this.getWordPoints(word);
      }, 0);

      const centerLetter = puzzle.centerLetter;
      document.getElementById("center-char").textContent = centerLetter;
      document.getElementById("cell-center").setAttribute("aria-label", `Center letter ${centerLetter}, mandatory`);
      this.updateOuterLetterDisplays();

      const activeLabel = document.getElementById("game-active-label");
      const activeDate = document.getElementById("game-active-date");
      activeLabel.textContent = isVault ? `Vault #${dayIndex}` : "Today";
      activeDate.textContent = this.scheduler.formatDateForDay(dayIndex);

      this.updateInputDisplay();
      this.updateScoreAndRanks();
      this.renderRankDots();
    }

    updateOuterLetterDisplays() {
      for (let i = 0; i < 6; i++) {
        const letter = this.outerLettersShuffled[i];
        const cell = document.getElementById(`cell-${i}`);
        cell.querySelector(".letter-char").textContent = letter;
        cell.setAttribute("aria-label", `Letter ${letter}`);
      }
    }

    shuffleOuterLetters() {
      this.sound.playShuffle();
      const grid = document.getElementById("honeycomb-grid");
      grid.classList.add("shuffling");

      setTimeout(() => {
        for (let i = this.outerLettersShuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.outerLettersShuffled[i], this.outerLettersShuffled[j]] = [this.outerLettersShuffled[j], this.outerLettersShuffled[i]];
        }
        this.updateOuterLetterDisplays();
        grid.classList.remove("shuffling");
      }, 120);
    }

    addLetter(char) {
      if (this.currentWord.length >= 19) return;
      this.sound.init();
      this.sound.playLetter();
      this.currentWord += char;
      this.updateInputDisplay();
    }

    deleteLetter() {
      if (this.currentWord.length === 0) return;
      this.sound.playLetter();
      this.currentWord = this.currentWord.slice(0, -1);
      this.updateInputDisplay();
    }

    updateInputDisplay() {
      this.wordDisplay.innerHTML = "";
      if (this.currentWord.length === 0) {
        this.wordDisplay.innerHTML = '<span class="cursor" aria-hidden="true">|</span>';
        return;
      }

      const center = this.activePuzzle.centerLetter;
      for (const ch of this.currentWord) {
        const span = document.createElement("span");
        span.textContent = ch;
        if (ch === center) {
          span.classList.add("letter-center-match");
        }
        this.wordDisplay.appendChild(span);
      }

      const cursor = document.createElement("span");
      cursor.className = "cursor";
      cursor.textContent = "|";
      cursor.setAttribute("aria-hidden", "true");
      this.wordDisplay.appendChild(cursor);
    }

    getWordPoints(word) {
      if (word.length === 4) return 1;
      let pts = word.length;
      if (this.isPangram(word)) {
        pts += 7;
      }
      return pts;
    }

    isPangram(word) {
      const set = new Set(word.split(""));
      return set.size === 7;
    }

    submitWord() {
      const word = this.currentWord.toUpperCase().trim();
      if (!word) return;

      const pState = this.storage.getPuzzleState(this.activePuzzle.id);

      if (word.length < 4) {
        this.rejectWord("Too short");
        return;
      }

      if (!word.includes(this.activePuzzle.centerLetter)) {
        this.rejectWord("Missing center letter");
        return;
      }

      if (pState.foundWords.includes(word)) {
        this.rejectWord("Already found");
        return;
      }

      if (!this.activePuzzle.acceptedWords.includes(word)) {
        this.rejectWord("Not in word list");
        return;
      }

      const isPangram = this.isPangram(word);
      const points = this.getWordPoints(word);

      pState.foundWords.push(word);
      pState.score = (pState.score || 0) + points;

      const isGenius = (pState.score / this.maxPossibleScore) >= 0.7;
      this.storage.savePuzzleProgress(this.activePuzzle.id, pState.foundWords, pState.score, isGenius);
      this.storage.recordWordFound(isPangram);

      if (isGenius && !this.isVaultPuzzle) {
        this.storage.recordDailyCompletion(this.activeDayIndex, true);
      }

      this.sound.playWordSuccess(isPangram);
      if (isPangram) {
        this.showToast(`Pangram! +${points}`, true);
      } else if (points >= 6) {
        this.showToast(`Awesome! +${points}`);
      } else {
        this.showToast(`Good! +${points}`);
      }

      this.currentWord = "";
      this.updateInputDisplay();
      this.updateScoreAndRanks();
    }

    rejectWord(msg) {
      this.sound.playError();
      this.showToast(msg, false);
      this.wordDisplay.classList.add("shake-input");
      setTimeout(() => {
        this.wordDisplay.classList.remove("shake-input");
      }, 400);
    }

    showToast(message, isPangram = false) {
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastEl.textContent = message;
      this.toastEl.className = "toast-popup show" + (isPangram ? " toast-pangram" : "");
      this.toastTimer = setTimeout(() => {
        this.toastEl.classList.remove("show");
      }, 1600);
    }

    getRankForScore(score) {
      const ratio = this.maxPossibleScore > 0 ? score / this.maxPossibleScore : 0;
      let current = RANKS[0];
      let next = RANKS[1];

      for (let i = 0; i < RANKS.length; i++) {
        if (ratio >= RANKS[i].pct) {
          current = RANKS[i];
          next = RANKS[i + 1] || null;
        }
      }
      return { current, next, ratio };
    }

    updateScoreAndRanks() {
      const pState = this.storage.getPuzzleState(this.activePuzzle.id);
      const score = pState.score || 0;
      const { current, next } = this.getRankForScore(score);

      document.getElementById("current-score-label").textContent = score;
      document.getElementById("current-rank-label").textContent = current.title;

      const count = pState.foundWords.length;
      document.getElementById("game-words-counter").textContent = `${count} word${count === 1 ? "" : "s"}`;

      const pct = Math.min(100, Math.round((score / this.maxPossibleScore) * 100));
      const fill = document.getElementById("progress-fill-bar");
      fill.style.width = `${pct}%`;

      const nextInfo = document.getElementById("next-rank-info");
      if (next) {
        const targetScore = Math.ceil(next.pct * this.maxPossibleScore);
        const needed = Math.max(1, targetScore - score);
        nextInfo.textContent = `${needed} pt${needed === 1 ? "" : "s"} to ${next.title}`;
      } else {
        nextInfo.textContent = "Button Master reached!";
      }

      this.renderRankDots();
    }

    renderRankDots() {
      const pState = this.storage.getPuzzleState(this.activePuzzle.id);
      const score = pState.score || 0;
      const ratio = this.maxPossibleScore > 0 ? score / this.maxPossibleScore : 0;
      const container = document.getElementById("rank-dots-container");
      container.innerHTML = "";

      RANKS.forEach((rank) => {
        const dot = document.createElement("div");
        dot.className = "rank-dot" + (ratio >= rank.pct ? " reached" : "");
        container.appendChild(dot);
      });
    }

    /* ==========================================================================
       MENU & VAULT RENDERING
       ========================================================================== */
    renderMenu() {
      const { puzzle, dayIndex } = this.scheduler.getTodayPuzzle();
      if (!puzzle) return;

      const pState = this.storage.getPuzzleState(puzzle.id);
      const score = pState.score || 0;

      const maxPts = puzzle.acceptedWords.reduce((acc, w) => acc + this.getWordPoints(w), 0);
      const ratio = maxPts > 0 ? score / maxPts : 0;
      let rankTitle = "Beginner";
      for (const r of RANKS) {
        if (ratio >= r.pct) rankTitle = r.title;
      }

      document.getElementById("menu-today-date").textContent = this.scheduler.formatDateForDay(dayIndex);
      document.getElementById("mini-center-letter").textContent = puzzle.centerLetter;
      document.getElementById("menu-rank-name").textContent = rankTitle;
      document.getElementById("menu-score-display").textContent = `${score} pts`;

      const orbit = document.getElementById("mini-letters-orbit");
      orbit.innerHTML = "";
      puzzle.outerLetters.forEach((letter) => {
        const sp = document.createElement("span");
        sp.textContent = letter;
        orbit.appendChild(sp);
      });

      const btnPlayText = document.getElementById("btn-play-text");
      if (score > 0) {
        btnPlayText.textContent = "Continue Today's Game";
      } else {
        btnPlayText.textContent = "Play Today's Game";
      }

      const vaultPuzzles = this.scheduler.getReleasedVaultPuzzles();
      document.getElementById("vault-count-badge").textContent = `${vaultPuzzles.length} Available`;
    }

    renderVault() {
      const container = document.getElementById("vault-items-container");
      container.innerHTML = "";
      const vaultItems = this.scheduler.getReleasedVaultPuzzles();

      if (vaultItems.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 24px; color: var(--text-secondary);">
            <p style="font-weight: 750; font-size: 1rem; color: var(--ink-dark-deep);">The Vault opens tomorrow.</p>
            <p style="font-size: 0.82rem; margin-top: 6px; color: var(--ink-dark-muted);">Day 0 is active. Previous puzzles appear here as they are released.</p>
          </div>
        `;
        return;
      }

      vaultItems.forEach((item) => {
        const pState = this.storage.getPuzzleState(item.puzzle.id);
        const card = document.createElement("div");
        card.className = "vault-item-card";

        card.innerHTML = `
          <div class="vault-info-col">
            <span class="vault-day-tag">Day ${item.dayIndex}</span>
            <span class="vault-date-title">${item.dateLabel}</span>
          </div>
          <div class="vault-status-col">
            <span class="vault-score-badge">${pState.score || 0} pts</span>
            ${pState.completed ? '<span class="vault-completed-mark" title="Completed">★</span>' : ""}
          </div>
        `;

        card.addEventListener("click", () => {
          this.sound.playLetter();
          document.getElementById("modal-vault").classList.remove("active");
          document.getElementById("modal-vault").setAttribute("aria-hidden", "true");
          this.loadPuzzle(item.puzzle, item.dayIndex, true);
          this.showScreen("game");
        });

        container.appendChild(card);
      });
    }

    renderFoundWordsModal() {
      const pState = this.storage.getPuzzleState(this.activePuzzle.id);
      const list = document.getElementById("found-words-list");
      const sub = document.getElementById("words-modal-sub");
      list.innerHTML = "";

      const words = [...pState.foundWords].sort();
      sub.textContent = `You have found ${words.length} word${words.length === 1 ? "" : "s"}`;

      if (words.length === 0) {
        list.innerHTML = '<li style="color: var(--text-muted); font-size: 0.85rem;">No words found yet. Start typing or tapping stones!</li>';
        return;
      }

      words.forEach((w) => {
        const li = document.createElement("li");
        li.className = "word-chip" + (this.isPangram(w) ? " pangram" : "");
        li.textContent = w;
        list.appendChild(li);
      });
    }

    renderStats() {
      const stats = this.storage.state.stats;
      document.getElementById("stat-played").textContent = stats.played || 0;
      document.getElementById("stat-genius").textContent = stats.geniusCount || 0;
      document.getElementById("stat-streak").textContent = stats.currentStreak || 0;
      document.getElementById("stat-best-streak").textContent = stats.bestStreak || 0;
      document.getElementById("stat-total-words").textContent = stats.totalWords || 0;
      document.getElementById("stat-total-pangrams").textContent = stats.totalPangrams || 0;
    }

    checkMidnightRollover() {
      const currentDay = this.scheduler.getCurrentDayIndex();
      if (!this.isVaultPuzzle && currentDay !== this.activeDayIndex) {
        if (this.screenMenu.classList.contains("active")) {
          this.renderMenu();
        }
      }
    }
  }

  // Application Entry Point
  window.addEventListener("DOMContentLoaded", () => {
    new SpellingBeeApp();
  });
})();
(function () {
  'use strict';

  // Universal Storage & Application Configuration
  const STORAGE_KEY = 'spelling_bee_save_v2';
  const CSV_PATH = './puzzles.csv';
  const RELEASE_TIMEZONE = 'America/Toronto'; // Canonical Canadian Championship Release Timezone
  
  // PLACEHOLDER: Replace '#home' with supplied main-page destination URL when provided
  const HOME_URL = 'https://tileworksgamesstudio.github.io/Curling-Menu/';

  const RANKS = [
    { name: 'Lead', pct: 0 },
    { name: 'Second', pct: 0.03 },
    { name: 'Third', pct: 0.08 },
    { name: 'Vice Skip', pct: 0.16 },
    { name: 'Skip', pct: 0.26 },
    { name: 'Club Champ', pct: 0.40 },
    { name: 'Provincial', pct: 0.55 },
    { name: 'Brier Contender', pct: 0.70 },
    { name: 'Canadian Champion', pct: 0.85 },
    { name: 'Olympic Gold', pct: 1.00 }
  ];

  // Built-in fallback puzzle dataset (Guarantees zero crashes even without server or CSV)
  const FALLBACK_PUZZLES = [
    {
      date: '2024-05-15',
      centerLetter: 'T',
      outerLetters: ['A', 'C', 'E', 'L', 'O', 'P'],
      words: ['ATOP', 'CATTLE', 'CLATTER', 'COAT', 'COLT', 'COMPACT', 'LOCATE', 'OCTAVE', 'PELT', 'PLATE', 'PLEAT', 'PLOT', 'POLITE', 'PULLPOT', 'TACT', 'TEAPOT', 'TOLL', 'TOTAL', 'TOTE'],
      pangrams: ['COMPACT', 'LOCATE']
    },
    {
      date: '2024-05-14',
      centerLetter: 'G',
      outerLetters: ['A', 'D', 'I', 'N', 'R', 'T'],
      words: ['AGING', 'DARTING', 'DATING', 'DRAG', 'DRAINING', 'GAIN', 'GANG', 'GIANT', 'GLAD', 'GRAD', 'GRAIN', 'GRANT', 'GRATING', 'GRID', 'GRIN', 'IGNITE', 'RATING', 'TRADING'],
      pangrams: ['DARTING', 'TRADING']
    },
    {
      date: '2024-05-13',
      centerLetter: 'H',
      outerLetters: ['A', 'C', 'K', 'M', 'N', 'T'],
      words: ['CATHARTIC', 'CHAMP', 'CHANT', 'CHAT', 'HACK', 'HATCH', 'MATCH', 'THANK'],
      pangrams: ['CHANT']
    }
  ];

  /* ==========================================================================
     PRESENTATIONAL LAYER 1: LIGHTWEIGHT HAPTIC WEB-AUDIO SYNTHESIZER
     ========================================================================== */
  class RinkAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      } catch (e) {
        this.enabled = false;
      }
    }

    play(type) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      switch (type) {
        case 'letter':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(840, now + 0.04);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;

        case 'delete':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;

        case 'shuffle':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(460, now + 0.07);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;

        case 'success':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now);
          osc.frequency.setValueAtTime(880.00, now + 0.08);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
          break;

        case 'pangram':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.08);
          osc.frequency.setValueAtTime(783.99, now + 0.16);
          osc.frequency.setValueAtTime(1046.50, now + 0.24);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.start(now);
          osc.stop(now + 0.45);
          break;

        case 'error':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);
          gain.gain.setValueAtTime(0.035, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
          osc.start(now);
          osc.stop(now + 0.13);
          break;
      }
    }
  }

  /* ==========================================================================
     PRESENTATIONAL LAYER 2: AMBIENT BACKGROUND SIMULATION
     ========================================================================== */
  class RinkAtmosphere {
    constructor(container) {
      this.container = container;
      this.particles = [];
      this.maxParticles = window.innerWidth < 600 ? 10 : 16;
      this.isRunning = true;
      this.supportsMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.curlingIconDefs = [
        '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="26" ry="14" fill="#0B1C34"/><ellipse cx="32" cy="38" rx="23" ry="11" fill="#FF2B30"/><path d="M22 28 C22 18, 42 18, 42 28" fill="none" stroke="#FFD83D" stroke-width="4" stroke-linecap="round"/></svg>',
        '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="none" stroke="#0B1C34" stroke-width="4"/><circle cx="32" cy="32" r="20" fill="none" stroke="#D71920" stroke-width="4"/><circle cx="32" cy="32" r="8" fill="#D71920"/></svg>',
        '<svg viewBox="0 0 64 64"><line x1="12" y1="52" x2="48" y2="12" stroke="#0B1C34" stroke-width="4" stroke-linecap="round"/><rect x="8" y="46" width="16" height="8" rx="2" transform="rotate(-45 16 50)" fill="#FFD83D"/></svg>',
        '<svg viewBox="0 0 64 64"><rect x="14" y="24" width="36" height="16" rx="4" fill="#FF2B30" stroke="#0B1C34" stroke-width="2"/><line x1="18" y1="44" x2="46" y2="44" stroke="#0B1C34" stroke-width="3"/></svg>',
        '<svg viewBox="0 0 64 64"><rect x="16" y="26" width="12" height="20" rx="2" fill="#0B1C34"/><rect x="36" y="26" width="12" height="20" rx="2" fill="#0B1C34"/><line x1="8" y1="48" x2="56" y2="48" stroke="#D71920" stroke-width="3"/></svg>',
        '<svg viewBox="0 0 64 64"><path d="M16 40 L16 26 C16 20, 48 20, 48 26 L48 40" fill="none" stroke="#FFD83D" stroke-width="6" stroke-linecap="round"/></svg>',
        '<svg viewBox="0 0 64 64"><rect x="4" y="28" width="56" height="8" fill="#D71920"/><text x="32" y="35" fill="#FFF" font-size="6" font-weight="900" text-anchor="middle" font-family="sans-serif">HOG</text></svg>',
        '<svg viewBox="0 0 64 64"><line x1="4" y1="32" x2="60" y2="32" stroke="#0B1C34" stroke-width="4" stroke-dasharray="6 4"/></svg>',
        '<svg viewBox="0 0 64 64"><line x1="32" y1="4" x2="32" y2="60" stroke="#0B1C34" stroke-width="4"/><circle cx="32" cy="32" r="6" fill="#D71920"/></svg>',
        '<svg viewBox="0 0 64 64"><circle cx="16" cy="20" r="4" fill="#0B1C34"/><circle cx="36" cy="14" r="5" fill="#B9D7ED"/><circle cx="48" cy="34" r="4" fill="#D71920"/><circle cx="24" cy="46" r="5" fill="#FFD83D"/></svg>',
        '<svg viewBox="0 0 64 64"><rect x="10" y="14" width="44" height="36" rx="4" fill="#0B1C34"/><text x="32" y="38" fill="#FFD83D" font-size="22" font-weight="900" text-anchor="middle" font-family="sans-serif">8</text></svg>',
        '<svg viewBox="0 0 64 64"><circle cx="20" cy="22" r="6" fill="#0B1C34"/><path d="M14 46 L24 32 L36 34 L48 44" fill="none" stroke="#0B1C34" stroke-width="4" stroke-linecap="round"/><ellipse cx="44" cy="48" rx="8" ry="4" fill="#FF2B30"/></svg>'
      ];

      this.mapleLeafSvg = '<svg viewBox="0 0 298.72 341.12" style="color: #D71920;"><use href="#maple-leaf-symbol" /></svg>';

      if (this.supportsMotion && this.container) {
        this.initLoop();
      }
    }

    createParticle() {
      const el = document.createElement('div');
      el.className = 'curling-floating-item';

      const isLeaf = Math.random() < 0.4;
      if (isLeaf) {
        el.innerHTML = this.mapleLeafSvg;
      } else {
        const iconIndex = Math.floor(Math.random() * this.curlingIconDefs.length);
        el.innerHTML = this.curlingIconDefs[iconIndex];
      }

      const depthRoll = Math.random();
      let depthClass = 'depth-distant';
      let speed = 0.35 + Math.random() * 0.4;
      let size = 28 + Math.random() * 14;

      if (depthRoll > 0.65) {
        depthClass = 'depth-near';
        speed = 0.75 + Math.random() * 0.6;
        size = 46 + Math.random() * 18;
      } else if (depthRoll > 0.3) {
        depthClass = 'depth-mid';
        speed = 0.5 + Math.random() * 0.45;
        size = 36 + Math.random() * 14;
      }

      el.classList.add(depthClass);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      const p = {
        el,
        x: Math.random() * (window.innerWidth - 60),
        y: window.innerHeight + size + (Math.random() * 80),
        speedY: speed,
        driftX: (Math.random() - 0.5) * 0.4,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.5,
        size
      };

      this.container.appendChild(el);
      return p;
    }

    initLoop() {
      for (let i = 0; i < this.maxParticles; i++) {
        const p = this.createParticle();
        p.y = Math.random() * window.innerHeight;
        this.particles.push(p);
      }

      const step = () => {
        if (!this.isRunning) return;

        const h = window.innerHeight;
        const w = window.innerWidth;

        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          p.y -= p.speedY;
          p.x += p.driftX;
          p.rot += p.rotSpeed;

          if (p.y < -p.size - 20) {
            p.y = h + p.size + (Math.random() * 40);
            p.x = Math.random() * (w - 60);
          }

          p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
        }

        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }
  }

  /* ==========================================================================
     CORE APPLICATION: SPELLING BEE (With Authoritative Release Gates)
     ========================================================================== */
  class SpellingBeeApp {
    constructor() {
      this.puzzles = [];
      this.dailyPuzzle = null;
      this.activePuzzle = null;
      this.authoritativeToday = null; // Strictly authoritative release date
      this.outerLetters = [];
      this.inputWord = '';
      this.foundWords = [];
      this.score = 0;
      this.maxScore = 0;
      this.currentView = 'menu';
      this.previousView = 'menu';

      this.audio = new RinkAudio();
      this.storage = this.loadSafeStorage();
      this.cacheDom();
      this.bindEvents();
      this.init();
      this.initAtmosphere();
    }

    initAtmosphere() {
      const stage = document.getElementById('curlingParticlesStage');
      if (stage) {
        this.atmosphere = new RinkAtmosphere(stage);
      }
    }

    cacheDom() {
      this.dom = {
        menuView: document.getElementById('menuView'),
        gameView: document.getElementById('gameView'),
        vaultView: document.getElementById('vaultView'),

        menuDailyDate: document.getElementById('menuDailyDate'),
        menuDailyStatus: document.getElementById('menuDailyStatus'),
        menuDailyProgressFill: document.getElementById('menuDailyProgressFill'),
        btnPlayDaily: document.getElementById('btnPlayDaily'),
        cardDaily: document.getElementById('cardDaily'),
        btnOpenVault: document.getElementById('btnOpenVault'),
        cardVault: document.getElementById('cardVault'),
        menuVaultCount: document.getElementById('menuVaultCount'),
        linkHome: document.getElementById('linkHome'),
        btnMenuRules: document.getElementById('btnMenuRules'),
        btnMenuStats: document.getElementById('btnMenuStats'),

        btnGameBack: document.getElementById('btnGameBack'),
        gamePuzzleTitle: document.getElementById('gamePuzzleTitle'),
        btnGameRules: document.getElementById('btnGameRules'),
        btnGameStats: document.getElementById('btnGameStats'),
        rankName: document.getElementById('rankName'),
        currentScore: document.getElementById('currentScore'),
        maxScore: document.getElementById('maxScore'),
        rankFill: document.getElementById('rankFill'),
        feedback: document.getElementById('feedback'),
        inputDisplay: document.getElementById('inputDisplay'),
        cellCenter: document.getElementById('cellCenter'),
        outerCells: [
          document.getElementById('cell-0'),
          document.getElementById('cell-1'),
          document.getElementById('cell-2'),
          document.getElementById('cell-3'),
          document.getElementById('cell-4'),
          document.getElementById('cell-5')
        ],
        btnDelete: document.getElementById('btnDelete'),
        btnShuffle: document.getElementById('btnShuffle'),
        btnEnter: document.getElementById('btnEnter'),
        foundToggle: document.getElementById('foundToggle'),
        foundToggleIcon: document.getElementById('foundToggleIcon'),
        foundListWrap: document.getElementById('foundListWrap'),
        foundList: document.getElementById('foundList'),
        foundCount: document.getElementById('foundCount'),

        btnVaultBack: document.getElementById('btnVaultBack'),
        vaultHeaderCount: document.getElementById('vaultHeaderCount'),
        vaultGrid: document.getElementById('vaultGrid'),

        modalRules: document.getElementById('modalRules'),
        modalStats: document.getElementById('modalStats'),
        statPlayed: document.getElementById('statPlayed'),
        statWords: document.getElementById('statWords'),
        statPangrams: document.getElementById('statPangrams'),
        statPoints: document.getElementById('statPoints'),
        statCurrentStreak: document.getElementById('statCurrentStreak'),
        statMaxStreak: document.getElementById('statMaxStreak')
      };
    }

    bindEvents() {
      this.dom.btnPlayDaily.addEventListener('click', () => {
        this.audio.play('shuffle');
        if (this.dailyPuzzle) {
          this.loadPuzzle(this.dailyPuzzle);
          this.switchView('game');
        }
      });

      this.dom.btnOpenVault.addEventListener('click', () => {
        this.audio.play('shuffle');
        this.renderVault();
        this.switchView('vault');
      });

      this.dom.linkHome.setAttribute('href', HOME_URL);

      this.dom.btnGameBack.addEventListener('click', () => {
        this.audio.play('shuffle');
        this.switchView(this.previousView === 'vault' ? 'vault' : 'menu');
      });

      this.dom.btnVaultBack.addEventListener('click', () => {
        this.audio.play('shuffle');
        this.switchView('menu');
      });

      this.dom.btnMenuRules.addEventListener('click', () => {
        this.audio.play('shuffle');
        this.openModal(this.dom.modalRules);
      });
      this.dom.btnGameRules.addEventListener('click', () => {
        this.audio.play('shuffle');
        this.openModal(this.dom.modalRules);
      });
      this.dom.btnMenuStats.addEventListener('click', () => {
        this.audio.play('shuffle');
        this.renderStats();
        this.openModal(this.dom.modalStats);
      });
      this.dom.btnGameStats.addEventListener('click', () => {
        this.audio.play('shuffle');
        this.renderStats();
        this.openModal(this.dom.modalStats);
      });

      document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.audio.play('delete');
          const id = btn.getAttribute('data-close');
          const target = document.getElementById(id);
          if (target) this.closeModal(target);
        });
      });

      window.addEventListener('click', e => {
        if (e.target.classList.contains('modal-backdrop')) {
          this.closeModal(e.target);
        }
      });

      this.dom.foundToggle.addEventListener('click', () => {
        this.audio.play('shuffle');
        const isHidden = this.dom.foundListWrap.hidden;
        this.dom.foundListWrap.hidden = !isHidden;
        this.dom.foundToggle.setAttribute('aria-expanded', String(isHidden));
        this.dom.foundToggleIcon.textContent = isHidden ? '▲' : '▼';
      });

      this.dom.cellCenter.addEventListener('click', () => {
        if (this.activePuzzle) this.addLetter(this.activePuzzle.centerLetter);
      });

      this.dom.outerCells.forEach(cell => {
        cell.addEventListener('click', () => {
          const letter = cell.getAttribute('data-letter');
          if (letter) this.addLetter(letter);
        });
      });

      this.dom.btnDelete.addEventListener('click', () => this.deleteLetter());
      this.dom.btnShuffle.addEventListener('click', () => this.shuffleLetters());
      this.dom.btnEnter.addEventListener('click', () => this.submitWord());

      window.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          this.closeModal(this.dom.modalRules);
          this.closeModal(this.dom.modalStats);
          return;
        }

        if (this.currentView !== 'game' || !this.activePuzzle) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        const key = e.key.toUpperCase();
        if (/^[A-Z]$/.test(key)) {
          e.preventDefault();
          this.addLetter(key);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          this.deleteLetter();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.submitWord();
        } else if (e.key === ' ' || e.key === '/') {
          e.preventDefault();
          this.shuffleLetters();
        }
      });
    }

    /**
     * Converts a millisecond epoch or Date object into a YYYY-MM-DD date string
     * in the explicit application release timezone.
     */
    getTimezoneCalendarDate(dateObj) {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: RELEASE_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return formatter.format(dateObj); // Returns "YYYY-MM-DD"
    }

    /**
     * Authoritative initialization: reads HTTP Date response header to establish
     * server time, avoiding reliance on untrusted client device clock.
     */
    async init() {
      let serverDateInstant = null;

      try {
        // Cache-busted fetch to ensure origin Date response header freshness
        const res = await fetch(`${CSV_PATH}?_t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Network response not ok');

        // Extract Authoritative Server Time from HTTP Response Header
        const serverHttpDate = res.headers.get('date');
        if (serverHttpDate) {
          const parsedMs = Date.parse(serverHttpDate);
          if (!isNaN(parsedMs)) {
            serverDateInstant = new Date(parsedMs);
          }
        }

        const text = await res.text();
        const parsed = this.parseCSV(text);
        this.puzzles = parsed.length > 0 ? parsed : FALLBACK_PUZZLES;
      } catch (err) {
        this.puzzles = FALLBACK_PUZZLES;
      }

      // If server HTTP date is unavailable (e.g. strict local file testing without HTTP headers),
      // fallback strictly respects safe past releases and never unlocks future content.
      if (serverDateInstant) {
        this.authoritativeToday = this.getTimezoneCalendarDate(serverDateInstant);
      } else {
        // Fail-closed fallback: anchor to newest released fallback puzzle date to prevent leaks
        this.authoritativeToday = '2024-05-15';
      }

      this.determineDailyPuzzle();
      this.updateMenuDashboard();
    }

    /**
     * Rule: Only puzzles whose release date is today or earlier may be available.
     * Future puzzles are strictly blocked from being selected as Daily Puzzle.
     */
    determineDailyPuzzle() {
      // Released puzzles are strictly <= authoritative today
      const released = this.puzzles
        .filter(p => p.date <= this.authoritativeToday)
        .sort((a, b) => a.date.localeCompare(b.date));

      const match = released.find(p => p.date === this.authoritativeToday);

      if (match) {
        this.dailyPuzzle = match;
      } else if (released.length > 0) {
        // Latest available past puzzle
        this.dailyPuzzle = released[released.length - 1];
      } else {
        // Zero puzzles released yet: use safe earliest fallback to avoid crash
        this.dailyPuzzle = FALLBACK_PUZZLES[0];
      }
    }

    updateMenuDashboard() {
      if (!this.dailyPuzzle) return;

      this.dom.menuDailyDate.textContent = this.formatDate(this.dailyPuzzle.date);
      const progress = this.storage.puzzles[this.dailyPuzzle.date] || { foundWords: [] };
      const max = this.calculateMaxScore(this.dailyPuzzle);
      const score = this.calculateWordsScore(progress.foundWords, this.dailyPuzzle);
      const pct = max > 0 ? Math.min(100, Math.round((score / max) * 100)) : 0;

      const rank = this.getRank(score, max);
      this.dom.menuDailyStatus.textContent = `${rank.name} • ${progress.foundWords.length} words found (${score} pts)`;
      this.dom.menuDailyProgressFill.style.width = `${pct}%`;

      // Authoritative Vault count: only past released puzzles strictly before daily puzzle date
      const vaultCount = this.puzzles.filter(p => p.date < this.dailyPuzzle.date).length;
      this.dom.menuVaultCount.textContent = `${vaultCount} past draw${vaultCount === 1 ? '' : 's'}`;
    }

    switchView(targetView) {
      this.previousView = this.currentView;
      this.currentView = targetView;

      this.dom.menuView.hidden = targetView !== 'menu';
      this.dom.gameView.hidden = targetView !== 'game';
      this.dom.vaultView.hidden = targetView !== 'vault';

      if (targetView === 'menu') {
        this.updateMenuDashboard();
      }
      window.scrollTo(0, 0);
    }

    parseCSV(text) {
      const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) return [];

      const puzzles = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < 4) continue;

        const date = parts[0].trim();
        const centerLetter = parts[1].trim().toUpperCase();
        const outerLetters = parts[2].trim().toUpperCase().replace(/[^A-Z]/g, '').split('');
        const words = parts.slice(3).join(',').replace(/["\r]/g, '').trim().toUpperCase().split(/\s+/).filter(Boolean);

        puzzles.push({
          date,
          centerLetter,
          outerLetters,
          words,
          pangrams: words.filter(w => {
            const unique = new Set(w.split(''));
            return unique.size >= 7 && [centerLetter, ...outerLetters].every(c => unique.has(c));
          })
        });
      }
      return puzzles;
    }

    /**
     * Absolute Release Guard: Blocks unreleased future puzzles from ever being loaded.
     */
    loadPuzzle(puzzle) {
      if (!puzzle || puzzle.date > this.authoritativeToday) {
        this.showFeedback('Puzzle not yet released', 'error');
        return;
      }

      this.activePuzzle = puzzle;
      this.outerLetters = [...puzzle.outerLetters];
      this.inputWord = '';

      const progress = this.storage.puzzles[puzzle.date] || { foundWords: [] };
      this.foundWords = [...progress.foundWords];
      this.maxScore = this.calculateMaxScore(puzzle);
      this.score = this.calculateWordsScore(this.foundWords, puzzle);

      const isDaily = this.dailyPuzzle && this.dailyPuzzle.date === puzzle.date;
      this.dom.gamePuzzleTitle.textContent = isDaily 
        ? `Daily Draw • ${this.formatDate(puzzle.date)}`
        : `Vault Honeycomb • ${this.formatDate(puzzle.date)}`;

      this.renderHive();
      this.renderInput();
      this.renderRank();
      this.renderFoundList();
    }

    calculateWordScore(word, puzzle) {
      const isPangram = puzzle.pangrams.includes(word);
      const base = word.length === 4 ? 1 : word.length;
      return base + (isPangram ? 7 : 0);
    }

    calculateMaxScore(puzzle) {
      return puzzle.words.reduce((sum, w) => sum + this.calculateWordScore(w, puzzle), 0);
    }

    calculateWordsScore(words, puzzle) {
      return words.reduce((sum, w) => sum + this.calculateWordScore(w, puzzle), 0);
    }

    renderHive() {
      const centerLetterSpan = this.dom.cellCenter.querySelector('.hex-letter');
      centerLetterSpan.textContent = this.activePuzzle.centerLetter;
      this.dom.cellCenter.setAttribute('data-letter', this.activePuzzle.centerLetter);
      this.dom.cellCenter.setAttribute('aria-label', `Center letter ${this.activePuzzle.centerLetter}`);

      this.dom.outerCells.forEach((cell, idx) => {
        const letter = this.outerLetters[idx] || '';
        const span = cell.querySelector('.hex-letter');
        span.textContent = letter;
        cell.setAttribute('data-letter', letter);
        cell.setAttribute('aria-label', `Letter ${letter}`);
      });
    }

    renderInput() {
      this.dom.inputDisplay.innerHTML = '';
      for (const ch of this.inputWord) {
        const span = document.createElement('span');
        span.textContent = ch;
        if (ch === this.activePuzzle.centerLetter) span.classList.add('center-ch');
        this.dom.inputDisplay.appendChild(span);
      }
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      this.dom.inputDisplay.appendChild(cursor);
    }

    addLetter(letter) {
      const valid = [this.activePuzzle.centerLetter, ...this.activePuzzle.outerLetters];
      if (!valid.includes(letter)) {
        this.audio.play('error');
        this.showFeedback('Bad letter', 'error');
        return;
      }
      if (this.inputWord.length >= 18) return;
      this.audio.play('letter');
      this.inputWord += letter;
      this.renderInput();
    }

    deleteLetter() {
      if (!this.inputWord) return;
      this.audio.play('delete');
      this.inputWord = this.inputWord.slice(0, -1);
      this.renderInput();
    }

    shuffleLetters() {
      this.audio.play('shuffle');
      for (let i = this.outerLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.outerLetters[i], this.outerLetters[j]] = [this.outerLetters[j], this.outerLetters[i]];
      }
      this.renderHive();
    }

    submitWord() {
      const word = this.inputWord.trim().toUpperCase();
      if (!word) return;

      if (word.length < 4) {
        this.audio.play('error');
        this.showFeedback('Too short (min 4)', 'error');
        return;
      }
      if (!word.includes(this.activePuzzle.centerLetter)) {
        this.audio.play('error');
        this.showFeedback('Missing center letter', 'error');
        return;
      }
      if (this.foundWords.includes(word)) {
        this.audio.play('error');
        this.showFeedback('Already found', 'error');
        return;
      }
      if (!this.activePuzzle.words.includes(word)) {
        this.audio.play('error');
        this.showFeedback('Not in word list', 'error');
        return;
      }

      const points = this.calculateWordScore(word, this.activePuzzle);
      const isPangram = this.activePuzzle.pangrams.includes(word);

      this.foundWords.push(word);
      this.score += points;
      this.inputWord = '';

      this.saveProgress();
      this.updateStats(points, isPangram);

      if (isPangram) {
        this.audio.play('pangram');
      } else {
        this.audio.play('success');
      }

      const msg = isPangram ? `Pangram! +${points}` : `+${points}`;
      this.showFeedback(msg, isPangram ? 'pangram' : 'success');

      this.renderInput();
      this.renderRank();
      this.renderFoundList();
    }

    getRank(score, maxScore) {
      const pct = maxScore > 0 ? score / maxScore : 0;
      let currentRank = RANKS[0];
      for (let i = RANKS.length - 1; i >= 0; i--) {
        if (pct >= RANKS[i].pct) {
          currentRank = RANKS[i];
          break;
        }
      }
      return currentRank;
    }

    renderRank() {
      const rank = this.getRank(this.score, this.maxScore);
      const pct = this.maxScore > 0 ? Math.min(100, Math.round((this.score / this.maxScore) * 100)) : 0;

      this.dom.rankName.textContent = rank.name;
      this.dom.currentScore.textContent = this.score;
      this.dom.maxScore.textContent = this.maxScore;
      this.dom.rankFill.style.width = `${pct}%`;
    }

    renderFoundList() {
      this.dom.foundCount.textContent = this.foundWords.length;
      this.dom.foundList.innerHTML = '';

      if (this.foundWords.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-found-msg';
        empty.textContent = 'No words found on the ice yet.';
        this.dom.foundList.appendChild(empty);
        return;
      }

      const sorted = [...this.foundWords].sort();
      sorted.forEach(w => {
        const item = document.createElement('span');
        item.className = 'found-item';
        if (this.activePuzzle.pangrams.includes(w)) {
          item.classList.add('is-pangram');
          item.setAttribute('title', 'Championship Pangram');
        }
        item.textContent = w;
        this.dom.foundList.appendChild(item);
      });
    }

    showFeedback(message, type) {
      if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
      this.dom.feedback.textContent = message;
      this.dom.feedback.className = `feedback ${type}`;
      this.feedbackTimer = setTimeout(() => {
        this.dom.feedback.textContent = '';
        this.dom.feedback.className = 'feedback';
      }, 1700);
    }

    /**
     * The Vault: Strictly displays released past puzzles (puzzle.date < dailyPuzzle.date).
     * Future puzzles are completely excluded before creating any card or DOM node.
     */
    renderVault() {
      this.dom.vaultGrid.innerHTML = '';
      
      const vaultPuzzles = this.puzzles
        .filter(p => this.dailyPuzzle && p.date < this.dailyPuzzle.date)
        .sort((a, b) => b.date.localeCompare(a.date));

      this.dom.vaultHeaderCount.textContent = vaultPuzzles.length;

      if (vaultPuzzles.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-found-msg';
        empty.textContent = 'No historical draws archived yet.';
        this.dom.vaultGrid.appendChild(empty);
        return;
      }

      vaultPuzzles.forEach(puzzle => {
        const card = document.createElement('div');
        card.className = 'vault-card';
        card.setAttribute('role', 'article');

        const prog = this.storage.puzzles[puzzle.date] || { foundWords: [] };
        const max = this.calculateMaxScore(puzzle);
        const score = this.calculateWordsScore(prog.foundWords, puzzle);
        const rank = this.getRank(score, max);

        card.innerHTML = `
          <div class="vault-card-info">
            <span class="vault-date">${this.formatDate(puzzle.date)}</span>
            <span class="vault-letters">
              <span class="center-ltr">${puzzle.centerLetter}</span> ${puzzle.outerLetters.join(' ')}
            </span>
          </div>
          <div class="vault-card-right">
            <span class="vault-progress-tag ${rank.pct >= 0.85 ? 'completed' : ''}">
              ${prog.foundWords.length}/${puzzle.words.length} • ${rank.name}
            </span>
          </div>
        `;

        card.addEventListener('click', () => {
          this.audio.play('shuffle');
          this.loadPuzzle(puzzle);
          this.switchView('game');
        });

        this.dom.vaultGrid.appendChild(card);
      });
    }

    renderStats() {
      const s = this.storage.stats;
      this.dom.statPlayed.textContent = s.played;
      this.dom.statWords.textContent = s.words;
      this.dom.statPangrams.textContent = s.pangrams;
      this.dom.statPoints.textContent = s.points;
      this.dom.statCurrentStreak.textContent = s.currentStreak;
      this.dom.statMaxStreak.textContent = s.maxStreak;
    }

    openModal(modal) {
      if (modal) modal.hidden = false;
    }

    closeModal(modal) {
      if (modal) modal.hidden = true;
    }

    formatDate(dateStr) {
      if (!dateStr) return '';
      const [y, m, d] = dateStr.split('-');
      const date = new Date(Date.UTC(+y, +m - 1, +d));
      return date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });
    }

    loadSafeStorage() {
      const fallback = {
        version: 2,
        stats: {
          played: 0,
          words: 0,
          pangrams: 0,
          points: 0,
          currentStreak: 0,
          maxStreak: 0,
          lastDate: null
        },
        puzzles: {}
      };

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return {
          ...fallback,
          ...parsed,
          stats: { ...fallback.stats, ...(parsed.stats || {}) },
          puzzles: parsed.puzzles || {}
        };
      } catch (e) {
        return fallback;
      }
    }

    saveProgress() {
      if (!this.activePuzzle) return;
      this.storage.puzzles[this.activePuzzle.date] = {
        foundWords: this.foundWords,
        score: this.score
      };
      this.persist();
    }

    updateStats(pts, isPangram) {
      const stats = this.storage.stats;
      const today = this.authoritativeToday;

      stats.words += 1;
      stats.points += pts;
      if (isPangram) stats.pangrams += 1;

      if (stats.lastDate !== today) {
        if (!stats.lastDate) {
          stats.currentStreak = 1;
        } else {
          const diff = Math.round((new Date(today) - new Date(stats.lastDate)) / 86400000);
          stats.currentStreak = diff === 1 ? stats.currentStreak + 1 : 1;
        }
        stats.lastDate = today;
        stats.played += 1;
        if (stats.currentStreak > stats.maxStreak) stats.maxStreak = stats.currentStreak;
      }
      this.persist();
    }

    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.storage));
      } catch (e) {
        // Storage quota protection
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new SpellingBeeApp();
  });
})();
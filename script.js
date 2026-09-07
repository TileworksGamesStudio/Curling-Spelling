const PUZZLE_DATA = [
  {
    id: "puzzle_01",
    name: "Puzzle #1",
    centerLetter: "P",
    outerLetters: ["E", "G", "I", "N", "S", "W"],
    pangrams: ["SWEEPING"],
    validWords: [
      "SWEEPING", "SWEEP", "SWEEPS", "PING", "PINGS", "PIPE", "PIPES", 
      "PIPING", "PEEP", "PEEPS", "SPIN", "SPINS", "SPINE", "SPINES", 
      "SPINNING", "SNIP", "SNIPS", "SNIPE", "SNIPES", "SNIPPING", "WEEP", 
      "WEEPS", "WEEPING", "WIPE", "WIPES", "WIPING", "WISP", "WISPS", 
      "SEEP", "SEEPS", "SEEPING", "SPEW", "SPEWS", "PIGS", "PIGPEN", 
      "PIGPENS", "PEEN", "PEENS", "PENS", "PENNING", "PINING", "PINES", 
      "PINE", "PEPPING", "PEWS"
    ]
  },
  {
    id: "puzzle_02",
    name: "Puzzle #2",
    centerLetter: "C",
    outerLetters: ["D", "E", "L", "R", "S", "U"],
    pangrams: ["CURDLES"],
    validWords: [
      "CURDLES", "CURDLE", "CURL", "CURLS", "CURLED", "CLUE", "CLUES", 
      "CLUED", "CRUDE", "CRUDES", "CRUDER", "CRUEL", "CRUELS", "CURE", 
      "CURES", "CURED", "CURER", "CURERS", "CURSE", "CURSES", "CURSED", 
      "CURSER", "CURSERS", "SCULL", "SCULLS", "SCULLED", "CREED", "CREEDS", 
      "ULCER", "ULCERS", "CELLED", "RECUR", "RECURS", "RECURRED", "CEDE", 
      "CEDES", "CEDED", "SUCCEED", "SUCCEEDED", "SUCCEEDS", "SCUD", "SCUDS", 
      "CURD", "CURDS", "REDUCE", "REDUCES", "REDUCED", "DEDUCE", "DEDUCES", 
      "DEDUCED", "RECLUSE", "RECLUSES", "LUCRE", "LUCRES"
    ]
  },
  {
    id: "puzzle_03",
    name: "Puzzle #3",
    centerLetter: "G",
    outerLetters: ["E", "H", "I", "L", "N", "O"],
    pangrams: ["HOGLINE"],
    validWords: [
      "HOGLINE", "GOING", "GOINGS", "GIGGLE", "GIGGLES", "GIGGLING", "GLEN", 
      "GLENS", "GONG", "GONGS", "GONGING", "GILL", "GILLS", "GLEE", "GOOGLE", 
      "GOOGLES", "GOOGLING", "LEGION", "LEGIONS", "LIEGE", "LIEGES", "LOGE", 
      "LOGES", "LOGIN", "LOGINS", "LOGGING", "LONGE", "LONGES", "NIGGLE", 
      "NIGGLES", "NIGGLING", "OGLE", "OGLES", "OGLING", "EGGING", "INGLE", 
      "INGLES", "LING", "LINGS", "LINGO", "ENGINE", "ENGINES", "HINGE", 
      "HINGES", "HIGH", "HONING", "HOEING", "GELID", "LONG", "LONGS"
    ]
  },
  {
    id: "puzzle_04",
    name: "Puzzle #4",
    centerLetter: "O",
    outerLetters: ["B", "D", "E", "N", "T", "U"],
    pangrams: ["BUTTONED"],
    validWords: [
      "BUTTONED", "BUTTON", "BONED", "BONE", "BONBON", "BOON", "BOUT", 
      "BOUND", "BOUNDED", "BOUNDEN", "DOUBT", "DOUBTED", "DOTE", "DOTED", 
      "NOTE", "NOTED", "NOON", "NODE", "ONTO", "OUTDO", "OUTDONE", "TONED", 
      "TONE", "TOUT", "TOUTED", "BENTO", "BODE", "BODED", "TENON", "DONE", 
      "BOOT", "BOOTED", "NONET", "DONEE", "OUTBOUND"
    ]
  },
  {
    id: "puzzle_05",
    name: "Puzzle #5",
    centerLetter: "E",
    outerLetters: ["D", "I", "L", "R", "V", "Y"],
    pangrams: ["DELIVERY"],
    validWords: [
      "DELIVERY", "DELIVER", "DELIVERED", "DERIVE", "DERIVED", "EERIE", 
      "ELDER", "EVER", "EVERY", "IDLE", "IDLED", "IDLER", "LEER", "LEERY", 
      "LEVEL", "LEVELED", "LEVELER", "LEVER", "LEVERED", "LIVERY", "REED", 
      "REEDY", "REEL", "REELED", "RELIED", "RELIEVE", "RELIEVED", "RIDE", 
      "RIDER", "RIVE", "RIVER", "VEER", "VEERED", "VEIL", "VEILED", "YIELD", 
      "YIELDED", "YIELDER", "LIVE", "LIVED", "LIVER", "DEVIL", "DIVE", 
      "DIVER", "EDDY"
    ]
  },
  {
    id: "puzzle_06",
    name: "Puzzle #6",
    centerLetter: "A",
    outerLetters: ["E", "G", "I", "N", "R", "T"],
    pangrams: ["GRANITE", "TEARING", "INTEGRATE"],
    validWords: [
      "GRANITE", "TEARING", "INTEGRATE", "AGATE", "AGENT", "ANGER", "ANTE", 
      "ATTAIN", "EARRING", "GAIN", "GAINER", "GARNET", "GIANT", "GRAIN", 
      "GRATE", "GREAT", "INGRATE", "RATING", "REAGENT", "REGAIN", "RETAIN", 
      "TARGET", "TRAIN", "TRAINEE", "RANT", "RANG", "TANG", "NEAR", "EARN", 
      "EARNING", "GATE"
    ]
  },
  {
    id: "puzzle_07",
    name: "Puzzle #7",
    centerLetter: "O",
    outerLetters: ["D", "E", "F", "R", "S", "T"],
    pangrams: ["FROSTED", "DEFROST", "DEFROSTS"],
    validWords: [
      "FROSTED", "DEFROST", "DEFROSTS", "FROST", "FROSTS", "FOSTER", 
      "FOSTERS", "FORTE", "FORTES", "FORT", "FORTS", "FOOT", "FOOTS", 
      "FOOTED", "DOOR", "DOORS", "DOSE", "DOSES", "DOSED", "DOTE", 
      "DOTES", "DOTED", "FORE", "RODE", "ROOF", "ROOFS", "ROOFED", 
      "ROOT", "ROOTS", "ROOTED", "ROSE", "ROSES", "ROTE", "SOFT", 
      "SOFTER", "SOOT", "SORE", "SORES", "SORT", "SORTS", "SORTED", 
      "STORE", "STORES", "STORED", "TORSO", "TORSOS", "TORTE", "TORTES", 
      "TORE"
    ]
  }
];

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } catch (e) {}
  }

  playTap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(640, t);
    osc.frequency.exponentialRampToValueAtTime(920, t + 0.032);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.038);
  }

  playDelete() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.05);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.055);
  }

  playShuffle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    [380, 520, 680].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + (idx * 0.03);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq + 160, start + 0.045);

      gain.gain.setValueAtTime(0.09, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.055);
    });
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.16);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.17);
  }

  playSuccess(isPangram = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    if (!isPangram) {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = t + (idx * 0.06);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.16);
      });
    } else {
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = t + (idx * 0.075);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.24, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.38);
      });
    }
  }
}

const sounds = new SoundEngine();

const STORAGE_KEY_PROGRESS = "spelling_bee_progress_v3";
const STORAGE_KEY_STATS = "spelling_bee_stats_v3";
const STORAGE_KEY_SOUND = "spelling_bee_sound_v3";

class StorageManager {
  static getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS)) || {};
    } catch (e) {
      return {};
    }
  }

  static getStats() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_STATS)) || {
        streakCurrent: 0,
        streakMax: 0,
        lastPlayedDate: "",
        wordsFound: 0,
        totalPoints: 0,
        pangramsFound: 0,
        endsCleared: 0
      };
    } catch (e) {
      return {
        streakCurrent: 0,
        streakMax: 0,
        lastPlayedDate: "",
        wordsFound: 0,
        totalPoints: 0,
        pangramsFound: 0,
        endsCleared: 0
      };
    }
  }

  static saveStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (e) {}
  }

  static getPuzzleState(puzzleId) {
    const all = this.getProgress();
    return all[puzzleId] || { foundWords: [], score: 0, completed: false };
  }

  static saveWord(puzzleId, word, points, maxScore, isPangram, effectiveDate) {
    const all = this.getProgress();
    if (!all[puzzleId]) {
      all[puzzleId] = { foundWords: [], score: 0, completed: false };
    }

    if (!all[puzzleId].foundWords.includes(word)) {
      all[puzzleId].foundWords.push(word);
      all[puzzleId].score += points;

      const wasAlreadyCompleted = all[puzzleId].completed;
      if (all[puzzleId].score >= Math.floor(maxScore * 0.70)) {
        all[puzzleId].completed = true;
      }

      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(all));

      const stats = this.getStats();
      stats.wordsFound += 1;
      stats.totalPoints += points;
      if (isPangram) stats.pangramsFound += 1;
      if (!wasAlreadyCompleted && all[puzzleId].completed) {
        stats.endsCleared += 1;
      }

      if (stats.lastPlayedDate !== effectiveDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

        if (stats.lastPlayedDate === yStr) {
          stats.streakCurrent += 1;
        } else {
          stats.streakCurrent = 1;
        }
        stats.streakMax = Math.max(stats.streakMax, stats.streakCurrent);
        stats.lastPlayedDate = effectiveDate;
      }

      this.saveStats(stats);
    }
    return all[puzzleId];
  }

  static resetAll() {
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    localStorage.removeItem(STORAGE_KEY_STATS);
  }
}

const GAME_RANKS = [
  { name: "BEGINNER", pct: 0 },
  { name: "GOOD START", pct: 0.03 },
  { name: "MOVING UP", pct: 0.08 },
  { name: "GOOD", pct: 0.15 },
  { name: "SOLID", pct: 0.25 },
  { name: "GREAT", pct: 0.40 },
  { name: "AMAZING", pct: 0.55 },
  { name: "GENIUS", pct: 0.70 }
];

class SpellingBeeGame {
  constructor() {
    this.activePuzzle = null;
    this.activePuzzleSource = "daily";
    this.currentInput = "";
    this.shuffledOuter = [];
    this.cachedState = { foundWords: [], score: 0, completed: false };

    this.puzzles = this.preparePuzzles(PUZZLE_DATA);
    this.initDOM();
    this.bindEvents();
    this.refreshMenuAndVault();
  }

  getTodayDateString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  preparePuzzles(rawList) {
    return rawList.map((item, index) => {
      const center = item.centerLetter.toUpperCase();
      const outers = item.outerLetters.map(l => l.toUpperCase());
      const allowedLetters = new Set([center, ...outers]);

      const validWords = item.validWords.filter(w => {
        const clean = w.toUpperCase();
        if (clean.length < 4 || !clean.includes(center)) return false;
        for (const ch of clean) {
          if (!allowedLetters.has(ch)) return false;
        }
        return true;
      });

      const pangrams = validWords.filter(w => new Set(w).size === 7);

      let maxScore = 0;
      validWords.forEach(w => {
        const isPangram = pangrams.includes(w);
        const base = w.length === 4 ? 1 : w.length;
        maxScore += isPangram ? (base + 7) : base;
      });

      return {
        id: item.id,
        name: item.name,
        index: index + 1,
        centerLetter: center,
        outerLetters: outers,
        pangrams: pangrams.length ? pangrams : item.pangrams,
        validWords: validWords,
        maxScore: Math.max(maxScore, 30)
      };
    });
  }

  getDailyPuzzle() {
    const today = new Date();
    const epoch = new Date(2024, 0, 1).getTime();
    const dayDiff = Math.floor((today.getTime() - epoch) / 86400000);
    const cycleIndex = Math.abs(dayDiff) % this.puzzles.length;
    return this.puzzles[cycleIndex];
  }

  initDOM() {
    this.screenMenu = document.getElementById("screen-menu");
    this.screenGame = document.getElementById("screen-game");
    this.screenVault = document.getElementById("screen-vault");

    this.btnPlayDaily = document.getElementById("btn-play-daily");
    this.btnOpenVault = document.getElementById("btn-open-vault");
    this.btnOpenRules = document.getElementById("btn-open-rules");
    this.btnOpenStats = document.getElementById("btn-open-stats");
    this.dailyStatusText = document.getElementById("daily-puzzle-status");
    this.vaultBadgeText = document.getElementById("vault-count-badge");

    this.btnGameBack = document.getElementById("btn-game-back");
    this.btnToggleWords = document.getElementById("btn-toggle-words");
    this.gamePuzzleBadge = document.getElementById("game-puzzle-badge");
    this.gamePuzzleName = document.getElementById("game-puzzle-name");
    this.foundCountBadge = document.getElementById("game-found-count");
    this.rankNameEl = document.getElementById("rank-name");
    this.rankScoreEl = document.getElementById("rank-score");
    this.progressFillEl = document.getElementById("progress-fill");
    this.milestonesEl = document.getElementById("rank-milestones");
    this.wordInputDisplay = document.getElementById("word-input-display");
    this.hiveCluster = document.getElementById("hive-cluster");

    this.btnDelete = document.getElementById("btn-action-delete");
    this.btnShuffle = document.getElementById("btn-action-shuffle");
    this.btnEnter = document.getElementById("btn-action-enter");

    this.btnVaultBack = document.getElementById("btn-vault-back");
    this.btnVaultStats = document.getElementById("btn-vault-stats");
    this.vaultListContainer = document.getElementById("vault-puzzles-list");

    this.modalWords = document.getElementById("modal-words");
    this.btnCloseWords = document.getElementById("btn-close-words");
    this.wordsTagCloud = document.getElementById("found-words-tagcloud");
    this.wordsModalTitle = document.getElementById("words-modal-title");

    this.modalStats = document.getElementById("modal-stats");
    this.btnCloseStats = document.getElementById("btn-close-stats");
    this.statStreak = document.getElementById("stat-streak");
    this.statMaxStreak = document.getElementById("stat-max-streak");
    this.statWordsFound = document.getElementById("stat-words-found");
    this.statTotalPoints = document.getElementById("stat-total-points");
    this.statPangrams = document.getElementById("stat-pangrams");
    this.statEndsCleared = document.getElementById("stat-ends-cleared");
    this.btnShareResult = document.getElementById("btn-share-result");

    this.modalSettings = document.getElementById("modal-settings");
    this.btnCloseSettings = document.getElementById("btn-close-settings");
    this.btnToggleSound = document.getElementById("btn-toggle-sound");
    this.btnResetData = document.getElementById("btn-reset-data");

    this.toastContainer = document.getElementById("toast-container");

    const savedSound = localStorage.getItem(STORAGE_KEY_SOUND);
    if (savedSound === "off") {
      sounds.enabled = false;
      this.btnToggleSound.textContent = "OFF";
      this.btnToggleSound.classList.remove("active");
      this.btnToggleSound.setAttribute("aria-pressed", "false");
    }
  }

  bindEvents() {
    const handleFirstGesture = () => {
      sounds.init();
      window.removeEventListener("pointerdown", handleFirstGesture);
    };
    window.addEventListener("pointerdown", handleFirstGesture, { once: true });

    this.btnPlayDaily.addEventListener("click", () => {
      sounds.playTap();
      const daily = this.getDailyPuzzle();
      this.loadPuzzle(daily, "daily");
      this.switchScreen("game");
    });

    this.btnOpenVault.addEventListener("click", () => {
      sounds.playTap();
      this.renderVault();
      this.switchScreen("vault");
    });

    this.btnGameBack.addEventListener("click", () => {
      sounds.playTap();
      this.refreshMenuAndVault();
      this.switchScreen("menu");
    });

    this.btnVaultBack.addEventListener("click", () => {
      sounds.playTap();
      this.refreshMenuAndVault();
      this.switchScreen("menu");
    });

    this.btnDelete.addEventListener("click", () => this.handleDelete());
    this.btnShuffle.addEventListener("click", () => this.handleShuffle());
    this.btnEnter.addEventListener("click", () => this.handleEnter());

    this.btnToggleWords.addEventListener("click", () => {
      sounds.playTap();
      this.openWordsModal();
    });
    this.btnCloseWords.addEventListener("click", () => {
      sounds.playTap();
      this.closeModal(this.modalWords);
    });

    this.btnOpenStats.addEventListener("click", () => {
      sounds.playTap();
      this.openStatsModal();
    });
    this.btnVaultStats.addEventListener("click", () => {
      sounds.playTap();
      this.openStatsModal();
    });
    this.btnCloseStats.addEventListener("click", () => {
      sounds.playTap();
      this.closeModal(this.modalStats);
    });
    this.btnShareResult.addEventListener("click", () => this.handleShareScore());

    this.btnOpenRules.addEventListener("click", () => {
      sounds.playTap();
      this.openModal(this.modalSettings);
    });
    this.btnCloseSettings.addEventListener("click", () => {
      sounds.playTap();
      this.closeModal(this.modalSettings);
    });

    this.btnToggleSound.addEventListener("click", () => {
      sounds.enabled = !sounds.enabled;
      if (sounds.enabled) {
        sounds.playTap();
        this.btnToggleSound.textContent = "ON";
        this.btnToggleSound.classList.add("active");
        this.btnToggleSound.setAttribute("aria-pressed", "true");
        localStorage.setItem(STORAGE_KEY_SOUND, "on");
      } else {
        this.btnToggleSound.textContent = "OFF";
        this.btnToggleSound.classList.remove("active");
        this.btnToggleSound.setAttribute("aria-pressed", "false");
        localStorage.setItem(STORAGE_KEY_SOUND, "off");
      }
    });

    this.btnResetData.addEventListener("click", () => {
      sounds.playDelete();
      if (confirm("Reset all saved progress, scores, and statistics?")) {
        StorageManager.resetAll();
        this.refreshMenuAndVault();
        this.closeModal(this.modalSettings);
        this.switchScreen("menu");
        this.showToast("All progress reset");
      }
    });

    [this.modalWords, this.modalStats, this.modalSettings].forEach(m => {
      m.addEventListener("click", (e) => {
        if (e.target === m) {
          sounds.playTap();
          this.closeModal(m);
        }
      });
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.modalWords.classList.contains("active")) this.closeModal(this.modalWords);
        if (this.modalStats.classList.contains("active")) this.closeModal(this.modalStats);
        if (this.modalSettings.classList.contains("active")) this.closeModal(this.modalSettings);
        return;
      }

      if (!this.screenGame.classList.contains("active")) return;
      if (this.modalWords.classList.contains("active") || 
          this.modalStats.classList.contains("active") || 
          this.modalSettings.classList.contains("active")) return;

      const key = e.key.toUpperCase();
      if (key === "ENTER") {
        e.preventDefault();
        this.handleEnter();
      } else if (key === "BACKSPACE" || key === "DELETE") {
        e.preventDefault();
        this.handleDelete();
      } else if (key === " " || key === "SPACEBAR") {
        e.preventDefault();
        this.handleShuffle();
      } else if (/^[A-Z]$/.test(key)) {
        if (this.activePuzzle) {
          const allowed = [this.activePuzzle.centerLetter, ...this.activePuzzle.outerLetters];
          if (allowed.includes(key)) {
            this.handleLetterTap(key);
            this.pulseHexButton(key);
          } else {
            sounds.playError();
            this.flashInputError();
          }
        }
      }
    });
  }

  openModal(el) {
    el.classList.add("active");
    el.setAttribute("aria-hidden", "false");
  }

  closeModal(el) {
    el.classList.remove("active");
    el.setAttribute("aria-hidden", "true");
  }

  pulseHexButton(letter) {
    const buttons = this.hiveCluster.querySelectorAll(".hex-stone");
    buttons.forEach(btn => {
      if (btn.textContent.trim() === letter) {
        btn.classList.add("key-active");
        setTimeout(() => btn.classList.remove("key-active"), 120);
      }
    });
  }

  switchScreen(screenName) {
    [this.screenMenu, this.screenGame, this.screenVault].forEach(s => s.classList.remove("active"));
    if (screenName === "menu") this.screenMenu.classList.add("active");
    if (screenName === "game") this.screenGame.classList.add("active");
    if (screenName === "vault") this.screenVault.classList.add("active");
  }

  refreshMenuAndVault() {
    const daily = this.getDailyPuzzle();
    const state = StorageManager.getPuzzleState(daily.id);
    const rank = this.getRankForScore(state.score, daily.maxScore);

    this.dailyStatusText.textContent = state.score > 0
      ? `${state.score} PTS — ${rank.name}`
      : "Play today's puzzle";

    this.vaultBadgeText.textContent = `${this.puzzles.length} Available`;
  }

  loadPuzzle(puzzle, source = "daily") {
    this.activePuzzle = puzzle;
    this.activePuzzleSource = source;
    this.currentInput = "";
    this.shuffledOuter = [...puzzle.outerLetters];
    this.cachedState = StorageManager.getPuzzleState(puzzle.id);

    this.gamePuzzleBadge.textContent = source === "daily" ? "TODAY'S PUZZLE" : "ARCHIVE";
    this.gamePuzzleName.textContent = puzzle.name;

    this.renderHive();
    this.updateInputDisplay();
    this.updateScoreAndRank();
  }

  renderHive() {
    this.hiveCluster.innerHTML = "";
    const hexPositions = [
      "hex-pos-top",
      "hex-pos-tr",
      "hex-pos-br",
      "hex-pos-bottom",
      "hex-pos-bl",
      "hex-pos-tl"
    ];

    const centerBtn = document.createElement("button");
    centerBtn.className = "hex-stone center hex-pos-center";
    centerBtn.setAttribute("aria-label", `Center letter ${this.activePuzzle.centerLetter}`);
    centerBtn.innerHTML = `<div class="hex-inner">${this.activePuzzle.centerLetter}</div>`;
    centerBtn.addEventListener("click", () => this.handleLetterTap(this.activePuzzle.centerLetter));
    this.hiveCluster.appendChild(centerBtn);

    this.shuffledOuter.forEach((letter, i) => {
      const outerBtn = document.createElement("button");
      outerBtn.className = `hex-stone outer ${hexPositions[i]}`;
      outerBtn.setAttribute("aria-label", `Letter ${letter}`);
      outerBtn.innerHTML = `<div class="hex-inner">${letter}</div>`;
      outerBtn.addEventListener("click", () => this.handleLetterTap(letter));
      this.hiveCluster.appendChild(outerBtn);
    });
  }

  handleLetterTap(letter) {
    if (this.currentInput.length >= 18) return;
    sounds.playTap();
    this.currentInput += letter;
    this.updateInputDisplay();
  }

  handleDelete() {
    if (this.currentInput.length === 0) return;
    sounds.playDelete();
    this.currentInput = this.currentInput.slice(0, -1);
    this.updateInputDisplay();
  }

  handleShuffle() {
    sounds.playShuffle();
    const glyph = this.btnShuffle.querySelector(".shuffle-glyph");
    if (glyph) {
      glyph.classList.add("shuffle-spinning");
      setTimeout(() => glyph.classList.remove("shuffle-spinning"), 220);
    }

    for (let i = this.shuffledOuter.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledOuter[i], this.shuffledOuter[j]] = [this.shuffledOuter[j], this.shuffledOuter[i]];
    }
    this.renderHive();
  }

  handleEnter() {
    const word = this.currentInput.trim().toUpperCase();

    if (word.length < 4) {
      sounds.playError();
      this.flashInputError();
      this.showToast("Too short (< 4 letters)");
      return;
    }

    if (!word.includes(this.activePuzzle.centerLetter)) {
      sounds.playError();
      this.flashInputError();
      this.showToast(`Must use center letter: ${this.activePuzzle.centerLetter}`);
      return;
    }

    if (this.cachedState.foundWords.includes(word)) {
      sounds.playError();
      this.flashInputError();
      this.showToast("Already found!");
      return;
    }

    if (!this.activePuzzle.validWords.includes(word)) {
      sounds.playError();
      this.flashInputError();
      this.showToast("Not in word list");
      return;
    }

    const isPangram = this.activePuzzle.pangrams.includes(word);
    const basePoints = word.length === 4 ? 1 : word.length;
    const earnedPoints = isPangram ? (basePoints + 7) : basePoints;

    sounds.playSuccess(isPangram);

    this.cachedState = StorageManager.saveWord(
      this.activePuzzle.id,
      word,
      earnedPoints,
      this.activePuzzle.maxScore,
      isPangram,
      this.getTodayDateString()
    );

    if (isPangram) {
      this.showToast(`PANGRAM! +${earnedPoints} PTS!`, true);
    } else {
      const compliments = ["Good!", "Great!", "Awesome!", "Nice!", "Solid!"];
      const accolade = compliments[Math.floor(Math.random() * compliments.length)];
      this.showToast(`${accolade} +${earnedPoints} PTS`);
    }

    this.currentInput = "";
    this.updateInputDisplay();
    this.updateScoreAndRank();
  }

  updateInputDisplay() {
    if (this.currentInput.length === 0) {
      this.wordInputDisplay.innerHTML = `<span class="input-placeholder">TYPE OR TAP LETTERS</span>`;
      return;
    }

    let html = "";
    for (let i = 0; i < this.currentInput.length; i++) {
      const ch = this.currentInput[i];
      const isCenter = ch === this.activePuzzle.centerLetter;
      const cls = isCenter ? "input-letter center-letter-highlight" : "input-letter";
      html += `<span class="${cls}">${ch}</span>`;
    }
    this.wordInputDisplay.innerHTML = html;
  }

  flashInputError() {
    this.wordInputDisplay.classList.remove("shake-error");
    void this.wordInputDisplay.offsetWidth;
    this.wordInputDisplay.classList.add("shake-error");
  }

  getRankForScore(score, maxScore) {
    let cur = GAME_RANKS[0];
    for (let i = GAME_RANKS.length - 1; i >= 0; i--) {
      if (score >= Math.floor(GAME_RANKS[i].pct * maxScore)) {
        cur = GAME_RANKS[i];
        break;
      }
    }
    return cur;
  }

  updateScoreAndRank() {
    const score = this.cachedState.score;
    const maxScore = this.activePuzzle.maxScore;
    const rank = this.getRankForScore(score, maxScore);

    this.rankScoreEl.textContent = score;
    this.rankNameEl.textContent = rank.name;
    this.foundCountBadge.textContent = this.cachedState.foundWords.length;

    const pct = Math.min(100, Math.round((score / maxScore) * 100));
    this.progressFillEl.style.width = `${pct}%`;

    this.milestonesEl.innerHTML = "";
    GAME_RANKS.forEach(r => {
      const pip = document.createElement("div");
      pip.className = "rank-pip";
      pip.style.left = `${r.pct * 100}%`;
      if (score >= Math.floor(r.pct * maxScore)) {
        pip.classList.add("reached");
      }
      this.milestonesEl.appendChild(pip);
    });
  }

  renderVault() {
    this.vaultListContainer.innerHTML = "";

    this.puzzles.forEach(puzzle => {
      const state = StorageManager.getPuzzleState(puzzle.id);
      const card = document.createElement("div");
      card.className = "vault-puzzle-card";
      if (state.completed) card.classList.add("completed");

      const rank = this.getRankForScore(state.score, puzzle.maxScore);

      card.innerHTML = `
        <div class="vault-card-info">
          <span class="vault-date">${puzzle.name}</span>
          <span class="vault-title">Center: ${puzzle.centerLetter} • Letters: ${puzzle.outerLetters.join(" ")}</span>
          <span class="vault-stats-chip">WORDS: ${state.foundWords.length}/${puzzle.validWords.length} • ${state.score} PTS (${rank.name})</span>
        </div>
        <div class="vault-play-badge">${state.completed ? "★ COMPLETED" : "PLAY"}</div>
      `;

      card.addEventListener("click", () => {
        sounds.playTap();
        this.loadPuzzle(puzzle, "vault");
        this.switchScreen("game");
      });

      this.vaultListContainer.appendChild(card);
    });
  }

  openWordsModal() {
    this.wordsModalTitle.textContent = `FOUND WORDS (${this.cachedState.foundWords.length})`;
    this.wordsTagCloud.innerHTML = "";

    if (this.cachedState.foundWords.length === 0) {
      this.wordsTagCloud.innerHTML = `
        <p style="font-family: var(--font-mono); font-size: 0.78rem; color: #475569;">
          No words found yet.
        </p>
      `;
    } else {
      const sorted = [...this.cachedState.foundWords].sort();
      sorted.forEach(word => {
        const isPangram = this.activePuzzle.pangrams.includes(word);
        const tag = document.createElement("span");
        tag.className = isPangram ? "word-tag pangram" : "word-tag";
        tag.textContent = isPangram ? `★ ${word}` : word;
        this.wordsTagCloud.appendChild(tag);
      });
    }

    this.openModal(this.modalWords);
  }

  openStatsModal() {
    const stats = StorageManager.getStats();
    this.statStreak.textContent = stats.streakCurrent;
    this.statMaxStreak.textContent = stats.streakMax;
    this.statWordsFound.textContent = stats.wordsFound;
    this.statTotalPoints.textContent = stats.totalPoints;
    this.statPangrams.textContent = stats.pangramsFound;
    this.statEndsCleared.textContent = stats.endsCleared;

    this.openModal(this.modalStats);
  }

  handleShareScore() {
    sounds.playTap();
    const puzzle = this.activePuzzle || this.getDailyPuzzle();
    const state = StorageManager.getPuzzleState(puzzle.id);
    const rank = this.getRankForScore(state.score, puzzle.maxScore);

    const shareText = `SPELLING BEE — ${puzzle.name}\n` +
      `Score: ${state.score} PTS (${rank.name})\n` +
      `Words: ${state.foundWords.length}\n` +
      `Date: ${this.getTodayDateString()}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        this.showToast("Result copied to clipboard!");
      }).catch(() => {
        this.showToast("Copied to clipboard!");
      });
    } else {
      this.showToast("Result copied!");
    }
  }

  showToast(message, isPangram = false) {
    const toast = document.createElement("div");
    toast.className = isPangram ? "brutal-toast toast-pangram" : "brutal-toast";
    toast.textContent = message;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
      toast.style.transition = "all 0.18s ease-out";
      setTimeout(() => toast.remove(), 180);
    }, 1700);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.spellingBee = new SpellingBeeGame();
});
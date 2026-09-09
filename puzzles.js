/**
 * CURLING PUZZLES — SPELLING BEE CONTENT LIBRARY
 * 
 * CONTRACT & CURRICULUM:
 * - Each puzzle contains:
 *     id: unique stable identifier
 *     sequenceIndex: stable chronological release day index (0 = Sept 8, 2026)
 *     dateString: canonical ISO date
 *     centerLetter: single uppercase mandatory character (The Button)
 *     outerLetters: array of 6 distinct uppercase characters
 *     pangrams: list of words using all 7 characters (+7 bonus points)
 *     acceptedWords: array of valid words (>= 4 letters, containing center letter)
 *     curriculumCategory: curling curriculum reference
 *     difficulty: 'Easy' | 'Medium' | 'Hard'
 * 
 * Future content can be appended to this array without modifying script.js, style.css, or index.html.
 */

const SPELLING_BEE_PUZZLES = [
  {
    id: "bee_2026_09_08_00",
    sequenceIndex: 0,
    dateString: "2026-09-08",
    curriculumCategory: "Curling Basics & Sheet Markings",
    difficulty: "Medium",
    centerLetter: "S",
    outerLetters: ["W", "E", "P", "T", "O", "N"],
    pangrams: ["SWEPT", "SWEETSPOT", "NEWSPOST"],
    acceptedWords: [
      "SWEPT", "SWEEP", "SWEEPS", "SWEETS", "SWEET", "STONE", "STONES", "SPOT", "SPOTS",
      "SPOON", "SPOONS", "STOP", "STOPS", "STEP", "STEPS", "STEEP", "STEEPS", "SEWN",
      "SEWS", "SEEN", "SEES", "NOSE", "NOSES", "NOTE", "NOTES", "NEST", "NESTS",
      "NETS", "NEWS", "ONES", "OPEN", "OPENS", "PEST", "PESTS", "PETS", "POSE",
      "POSES", "POST", "POSTS", "POTS", "SEEP", "SEEPS", "SOOT", "SOON", "SNOT",
      "TONS", "TOWS", "TOWN", "TOWNS", "WEST", "WEEP", "WEEPS", "WENT"
    ]
  },
  {
    id: "bee_2026_09_09_01",
    sequenceIndex: 1,
    dateString: "2026-09-09",
    curriculumCategory: "Stones & Granite Equipment",
    difficulty: "Easy",
    centerLetter: "G",
    outerLetters: ["A", "R", "N", "I", "T", "E"],
    pangrams: ["GRANITE"],
    acceptedWords: [
      "GRANITE", "GRAIN", "GRAINS", "GRATE", "GREAT", "GIANT", "GARNET", "GEAR",
      "GATING", "GATE", "GIRN", "GNAT", "GRIN", "GRIT", "AGING", "ANGER", "GAINER",
      "RAGING", "RING", "RANGE", "TIGER", "TARGET", "TANGLE", "INTEGRATE"
    ]
  },
  {
    id: "bee_2026_09_10_02",
    sequenceIndex: 2,
    dateString: "2026-09-10",
    curriculumCategory: "The House & Button Strategy",
    difficulty: "Medium",
    centerLetter: "U",
    outerLetters: ["B", "T", "O", "N", "H", "S"],
    pangrams: ["BUTTONS", "UNBUTTONS"],
    acceptedWords: [
      "BUTTON", "BUTTONS", "BUSH", "BUNT", "BUNS", "BOUT", "BOUTS", "HUNT", "HUNTS",
      "SHUT", "SHUTS", "SHOUT", "SHOUTS", "SOUT", "SUNS", "STUN", "STUNS", "TOUT", "TOUTS",
      "TUBES", "TUBS", "UNTO", "UPON"
    ]
  },
  {
    id: "bee_2026_09_11_03",
    sequenceIndex: 3,
    dateString: "2026-09-11",
    curriculumCategory: "Curling Strategy & The Hammer",
    difficulty: "Hard",
    centerLetter: "M",
    outerLetters: ["H", "A", "E", "R", "T", "O"],
    pangrams: ["HAMMER", "HAMMERER", "HAMMERTOE"],
    acceptedWords: [
      "HAMMER", "HOME", "HOMER", "HOMEMADE", "HARM", "MATE", "MATER", "MATTER",
      "MATH", "MEAT", "MEET", "METER", "MOAT", "MOOT", "MORE", "MORTAR", "MOTE",
      "MOTH", "MOTHER", "MOTHERS", "ROAM", "ROOM", "ROOMMATE", "TEAM", "TERM",
      "THEOREM", "TOMORROW"
    ]
  },
  {
    id: "bee_2026_09_12_04",
    sequenceIndex: 4,
    dateString: "2026-09-12",
    curriculumCategory: "Guards & Shot Selection",
    difficulty: "Medium",
    centerLetter: "D",
    outerLetters: ["G", "U", "A", "R", "N", "I"],
    pangrams: ["GUARDING", "GUARDIAN"],
    acceptedWords: [
      "GUARD", "GUARDS", "GUARDING", "GUARDIAN", "GRID", "GRAD", "GRADING", "GRAIN",
      "DRAG", "DRUG", "DRAIN", "DURANG", "DURING", "DAWN", "DARN", "DARING",
      "RAGED", "RUGGED", "RATED", "UNGUARDED", "URGING"
    ]
  },
  {
    id: "bee_2026_09_13_05",
    sequenceIndex: 5,
    dateString: "2026-09-13",
    curriculumCategory: "Ice Conditions & Pebbling",
    difficulty: "Easy",
    centerLetter: "P",
    outerLetters: ["E", "B", "L", "I", "N", "G"],
    pangrams: ["PEBBLING"],
    acceptedWords: [
      "PEBBLE", "PEBBLING", "PEEP", "PEEPING", "PELT", "PELTING", "PINE", "PINING",
      "PING", "PINGING", "PIPE", "PIPING", "PLEBE", "PLIN", "PLIE", "PIGEN",
      "BLEEP", "BEEP", "BEEPING", "LIMP", "LIMPING", "NIPPER"
    ]
  },
  {
    id: "bee_2026_09_14_06",
    sequenceIndex: 6,
    dateString: "2026-09-14",
    curriculumCategory: "Delivery & Rotation",
    difficulty: "Medium",
    centerLetter: "L",
    outerLetters: ["C", "U", "R", "I", "N", "G"],
    pangrams: ["CURLING"],
    acceptedWords: [
      "CURL", "CURLING", "CURLER", "CURLERS", "CLING", "CLINIC", "CURR", "GIRL",
      "GLUING", "GRIL", "RUIN", "RULING", "RUNIC", "LUNG", "LURCH", "LURING",
      "ICING", "INCUR"
    ]
  }
];

// Content Integrity Check
if (typeof window !== "undefined") {
  window.SPELLING_BEE_PUZZLES = SPELLING_BEE_PUZZLES;
}
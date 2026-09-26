/* ============================================================================
   script.js — "Wortmeister" German Word Guessing Game
   ----------------------------------------------------------------------------
   HOW THE GAME WORKS (overview):
   1. The player picks a word length (5, 6, 7, 8+ or 13 letters).
   2. A random German word of that length is chosen; its letters are hidden
      behind blank tiles.
   3. The player guesses letters (by clicking the on-screen keyboard or typing
      on a physical keyboard). Correct letters are revealed on the tiles;
      wrong guesses cost one "try".
   4. The player wins by revealing the whole word before running out of tries.
      Winning extends the score streak; losing resets it to 0.
   ========================================================================== */

// 'use strict' enables JavaScript Strict Mode: the browser becomes stricter
// about silent errors (e.g., using an undeclared variable throws an error
// instead of silently creating a global). This helps catch bugs early.
'use strict';

/* ---------- Word data: frequent German nouns (A–Z only, no umlauts/ß) ---------- */
// WORDS is a lookup table keyed by word length. Each key (5, 6, 7, 8, 13)
// holds an array of word entries used by the game:
//   w = the German word (uppercase, shown on the tiles)
//   m = the English meaning/translation revealed after the round ends

/* ---------- Word data: frequent German nouns (A–Z only, no umlauts/ß) ---------- */
const WORDS = {
  5: [
    { w:'APFEL', m:'apple' }, { w:'TISCH', m:'table' }, { w:'KATZE', m:'cat' },
    { w:'BLUME', m:'flower' }, { w:'STUHL', m:'chair' }, { w:'SPIEL', m:'game; play' },
    { w:'BRIEF', m:'letter (mail)' }, { w:'FISCH', m:'fish' }, { w:'VOGEL', m:'bird' },
    { w:'PFERD', m:'horse' }, { w:'MILCH', m:'milk' }, { w:'LICHT', m:'light' },
    { w:'NACHT', m:'night' }, { w:'REGEN', m:'rain' }, { w:'SCHNEE', m:'snow' },
    { w:'FEUER', m:'fire' }, { w:'WOCHE', m:'week' }, { w:'MONAT', m:'month' },
    { w:'HERBST', m:'autumn' }, { w:'STERN', m:'star' }, { w:'WOLKE', m:'cloud' },
    { w:'LEBEN', m:'life' }, { w:'VATER', m:'father' }, { w:'JUNGE', m:'boy' },
    { w:'STADT', m:'city' }, { w:'FLUSS', m:'river' }, { w:'LAMPE', m:'lamp' },
    { w:'MARKT', m:'market' }, { w:'KARTE', m:'card; map; ticket' }, { w:'KRAFT', m:'power; force' },
    { w:'TASSE', m:'cup' }, { w:'GABEL', m:'fork' }, { w:'FARBE', m:'color; paint' },
    { w:'BLITZ', m:'lightning' }, { w:'STURM', m:'storm' }, { w:'SONNE', m:'sun' },
    { w:'ABEND', m:'evening' }, { w:'INSEL', m:'island' }, { w:'HAFEN', m:'harbor' },
    { w:'IMMER', m:'always' }, { w:'FRAGE', m:'question' }, { w:'REISE', m:'journey' },
    { w:'GLÜCK', m:'luck' }, { w:'GEIST', m:'spirit' }, { w:'KLEID', m:'dress' },
    { w:'SCHUH', m:'shoe' }, { w:'STIFT', m:'pen' }, { w:'BODEN', m:'floor' }, { w:'WEISS', m:'white' },
    { w:'BRAUN', m:'brown' }, { w:'KLEIN', m:'small' }, { w:'GROSS', m:'large' }, { w:'STOLZ', m:'proud' },
    { w:'MÄUSE', m:'mice' }, { w:'HUNDE', m:'dogs' }, { w:'SÜSSE', m:'sweet' }, { w:'BITTE', m:'please' },
    { w:'DANKE', m:'thanks' }, { w:'GERNE', m:'gladly' }, { w:'STARK', m:'strong' }, { w:'RECHT', m:'right/law' },
    { w:'WÄRME', m:'warmth' }, { w:'KÄLTE', m:'coldness' }, { w:'STILL', m:'quiet' }, { w:'SÜDEN', m:'south' },
    { w:'OSTEN', m:'east' }, { w:'GRUND', m:'ground' }, { w:'STÜCK', m:'piece' }, { w:'WINDY', m:'windy' },
    { w:'SENSE', m:'scythe' }, { w:'KUNDE', m:'customer' }, { w:'STERN', m:'star' }, { w:'WAGEN', m:'car/wagon' },
    { w:'SORGE', m:'worry' }, { w:'STADT', m:'city' }, { w:'WUNSCH', m:'wish' }, { w:'SCHEIN', m:'glow/bill' },
    { w:'STROM', m:'current/electricity' }, { w:'SÜSSE', m:'sweetness' }
  ],
  6: [
    { w:'WASSER', m:'water' }, { w:'ZIMMER', m:'room' }, { w:'SCHULE', m:'school' },
    { w:'LEHRER', m:'teacher' }, { w:'KLASSE', m:'class; classroom' }, { w:'MUTTER', m:'mother' },
    { w:'BRUDER', m:'brother' }, { w:'MENSCH', m:'human; person' }, { w:'FREUND', m:'friend' },
    { w:'GARTEN', m:'garden' }, { w:'PAPIER', m:'paper' }, { w:'BILDER', m:'pictures' },
    { w:'FINGER', m:'finger' }, { w:'STIMME', m:'voice' }, { w:'KINDER', m:'children' },
    { w:'FRAUEN', m:'women' }, { w:'ARBEIT', m:'work' }, { w:'TREPPE', m:'stairs' },
    { w:'KELLER', m:'cellar; basement' }, { w:'SCHIFF', m:'ship' }, { w:'STRAND', m:'beach' },
    { w:'WINTER', m:'winter' }, { w:'SOMMER', m:'summer' }, { w:'FLAMME', m:'flame' },
    { w:'STUNDE', m:'hour' }, { w:'MINUTE', m:'minute' }, { w:'MORGEN', m:'morning; tomorrow' },
    { w:'MITTAG', m:'midday; noon' }, { w:'ANFANG', m:'beginning' }, { w:'KLEINE', m:'small one' },
    { w:'KIRCHE', m:'church' }, { w:'TELLER', m:'plate' }, { w:'MESSER', m:'knife' },
    { w:'PFANNE', m:'pan' }, { w:'PINSEL', m:'brush' }, { w:'MUSEUM', m:'museum' },
    { w:'HIMMEL', m:'sky; heaven' }, { w:'DONNER', m:'thunder' }, { w:'NUMMER', m:'number' },
    { w:'FERIEN', m:'vacation; holidays' }, { w:'SIEGER', m:'winner' }, { w:'PUNKTE', m:'points' },
    { w:'KÜCHEN', m:'kitchens' }, { w:'FENSTER', m:'window' }, { w:'SPIEGE', m:'mirror' },
    { w:'TÜRMEN', m:'towers' }, { w:'STRASSE', m:'street' }, { w:'DORFES', m:'village' },
    { w:'WÄLDER', m:'forests' }, { w:'BERGE', m:'mountains' }, { w:'FLUGEN', m:'flights' },
    { w:'REISEN', m:'travels' }, { w:'KÖNIGE', m:'kings' }, { w:'PRINZE', m:'princes' },
    { w:'SÜSSEN', m:'sweet' }, { w:'BITTER', m:'bitter' }, { w:'STARKER', m:'strong' },
    { w:'SCHWAC', m:'weak' }, { w:'GEWALT', m:'violence; force' }, { w:'GESICHT', m:'face' },
    { w:'SCHULTER', m:'shoulder' }, { w:'KNIEEN', m:'knees' }, { w:'HÄNDEN', m:'hands' },
    { w:'FÜSSEN', m:'feet' }, { w:'KÖRPER', m:'body' }, { w:'GEHIRN', m:'brain' }, { w:'HERZEN', m:'hearts' },
    { w:'BLUTEN', m:'to bleed' }, { w:'ATEMEN', m:'to breathe' }, { w:'SCHLAF', m:'sleep' },
    { w:'TRAUME', m:'dreams' }, { w:'GLÜCKE', m:'luck' }, { w:'SORGE', m:'worry' }, { w:'WUNSCH', m:'wish' },
    { w:'GEFÜHL', m:'feeling' }, { w:'SPRUCH', m:'saying' }, { w:'SÄTZE', m:'sentences' }, { w:'BUCHST', m:'letter (alphabet)' },
    { w:'STIFTE', m:'pens' }, { w:'HEFTE', m:'notebooks' }, { w:'TAFELN', m:'blackboards' }, { w:'STÜHLE', m:'chairs' },
    { w:'TISCHE', m:'tables' }, { w:'LAMPE', m:'lamp' }
  ],
  7: [
    { w:'FENSTER', m:'window' }, { w:'ZEITUNG', m:'newspaper' }, { w:'STRASSE', m:'street' },
    { w:'FAMILIE', m:'family' }, { w:'WOHNUNG', m:'apartment; flat' }, { w:'GESICHT', m:'face' },
    { w:'BAHNHOF', m:'train station' }, { w:'FAHRRAD', m:'bicycle' }, { w:'HEIZUNG', m:'heating' },
    { w:'SPIEGEL', m:'mirror' }, { w:'FLASCHE', m:'bottle' }, { w:'SCHRANK', m:'wardrobe; cabinet' },
    { w:'THEATER', m:'theater' }, { w:'KONZERT', m:'concert' }, { w:'SPIELER', m:'player' },
    { w:'SPRACHE', m:'language' }, { w:'DEUTSCH', m:'German (language)' }, { w:'VERKAUF', m:'sale' },
    { w:'SCHLOSS', m:'castle; palace' }, { w:'RATHAUS', m:'town hall' }, { w:'BRUNNEN', m:'fountain; well' },
    { w:'GEBIRGE', m:'mountain range' }, { w:'FREITAG', m:'Friday' }, { w:'SAMSTAG', m:'Saturday' },
    { w:'SONNTAG', m:'Sunday' }, { w:'BESTECK', m:'cutlery; set of forks/knives' },
    { w:'GEBÄUDE', m:'building' }, { w:'KLEIDUNG', m:'clothing' }, { w:'RECHNUNG', m:'bill' },
    { w:'GEDANKE', m:'thought' }, { w:'GEFÜHLE', m:'feelings' }, { w:'KÜHLUNG', m:'cooling' },
    { w:'SÜDWEST', m:'southwest' }, { w:'NORDOST', m:'northeast' }, { w:'SÜDWIND', m:'south wind' }, { w:'KÜSSTEN', m:'coasts' },
     { w:'SCHÜLER', m:'pupil' }, { w:'FREUNDE', m:'friends' }, { w:'NACHBAR', m:'neighbor' }, { w:'KELLNER', m:'waiter' },
     { w:'METZGER', m:'butcher' }, { w:'FISCHER', m:'fisherman' }, { w:'MEISTER', m:'master; champion' }, { w:'PATIENT', m:'patient' },
     { w:'SEKUNDE', m:'second' }, { w:'FEBRUAR', m:'February' }, { w:'OKTOBER', m:'October' }, { w:'UHRZEIT', m:'time (of day)' },
     { w:'TERMINE', m:'appointments' }, { w:'NEUJAHR', m:'New Year' }, { w:'TELEFON', m:'telephone' }, { w:'TOASTER', m:'toaster' },
     { w:'LATERNE', m:'lantern; street lamp' }, { w:'TREPPEN', m:'stairs' }, { w:'PFLANZE', m:'plant' }, { w:'FLEISCH', m:'meat' },
     { w:'PFEFFER', m:'pepper' }, { w:'ZWIEBEL', m:'onion' }, { w:'TOMATEN', m:'tomatoes' }, { w:'KAROTTE', m:'carrot' },
     { w:'BANANEN', m:'bananas' }, { w:'ZITRONE', m:'lemon' }, { w:'PFLAUME', m:'plum' }, { w:'KIRSCHE', m:'cherry' },
     { w:'TRAUBEN', m:'grapes' }, { w:'AVOCADO', m:'avocado' }, { w:'OMELETT', m:'omelette' }, { w:'EINTOPF', m:'stew' },
     { w:'AUFLAUF', m:'casserole' }, { w:'GERICHT', m:'dish; court' }, { w:'BEILAGE', m:'side dish' }, { w:'DESSERT', m:'dessert' },
     { w:'SCHEIBE', m:'slice; disc' }, { w:'BREZELN', m:'pretzels' }, { w:'WAFFELN', m:'waffles' }, { w:'STADION', m:'stadium' },
     { w:'KAPELLE', m:'chapel' }, { w:'DENKMAL', m:'monument' }, { w:'SCHEUNE', m:'barn' }, { w:'GALERIE', m:'gallery' },
     { w:'FUSSWEG', m:'footpath' }, { w:'STRECKE', m:'route; distance' }, { w:'ANTWORT', m:'answer' }, { w:'MEINUNG', m:'opinion' },
     { w:'ZUKUNFT', m:'future' }, { w:'AUFGABE', m:'task' }, { w:'ANGEBOT', m:'offer' }, { w:'PROJEKT', m:'project' },
     { w:'PRODUKT', m:'product' }, { w:'ENERGIE', m:'energy' }, { w:'SCHMERZ', m:'pain' }, { w:'FRIEDEN', m:'peace' },
     { w:'PRÜFUNG', m:'exam' }, { w:'ZEUGNIS', m:'report card' }, { w:'STUDIUM', m:'studies' }, { w:'MEDIZIN', m:'medicine' },
     { w:'VERBAND', m:'bandage' }, { w:'EINKAUF', m:'purchase; shopping' }, { w:'STEUERN', m:'taxes' }, { w:'VERLUST', m:'loss' },
     { w:'URKUNDE', m:'certificate' }, { w:'WELTALL', m:'outer space' }, { w:'GALAXIE', m:'galaxy' }, { w:'UNKRAUT', m:'weeds' },
     { w:'STRAUCH', m:'shrub' }, { w:'BLÄTTER', m:'leaves' }, { w:'WURZELN', m:'roots' }, { w:'SCHAUER', m:'shower' }, { w:'FLOCKEN', m:'flakes' },
     { w:'KLIPPEN', m:'cliffs' }, { w:'SCHIFFE', m:'ships' }, { w:'GESTEIN', m:'rock' }, { w:'KLEIDER', m:'dresses' }, { w:'STIEFEL', m:'boots' },
     { w:'DIAMANT', m:'diamond' }, { w:'ARMBAND', m:'bracelet' }, { w:'OHRRING', m:'earring' }, { w:'ARMREIF', m:'bangle' }, { w:'GITARRE', m:'guitar' },
     { w:'KLAVIER', m:'piano' }, { w:'TROMMEL', m:'drum' }, { w:'MELODIE', m:'melody' }, { w:'GEMÄLDE', m:'painting' }, { w:'DICHTER', m:'poet' },
     { w:'SCHRIFT', m:'writing' }, { w:'POLIZEI', m:'police' }, { w:'SCHWERT', m:'sword' }, { w:'ADRESSE', m:'address' }, { w:'MESSING', m:'brass' },
     { w:'PLASTIK', m:'plastic' }, { w:'SCHWEIN', m:'pig' }, { w:'TURNIER', m:'tournament' }, { w:'WECHSEL', m:'change' },
     { w:'SCHEINE', m:'banknotes' }, { w:'KLAUSUR', m:'written exam' }, { w:'STUDENT', m:'student' }
  ],
  8: [
    { w:'WÖRTERBUCH', m:'dictionary' },  { w:'GEBURTSTAG', m:'birthday' }, { w:'FREUNDSCHAFT', m:'friendship' },  { w:'GESCHÄFT', m:'business' },
    { w:'LEBENSMITTEL', m:'food' },  { w:'ARBEITSZIMMER', m:'study/office' },  { w:'WOHNZIMMER', m:'living room' },  { w:'SCHULKIND', m:'schoolchild' },
    { w:'GESCHWISTER', m:'siblings' },  { w:'GEBÄUDE', m:'building' },  { w:'KÜCHENGERÄT', m:'kitchen appliance' },  { w:'WASCHMASCHINE', m:'washing machine' },
    { w:'KÜHLschrank', m:'refrigerator' },  { w:'FERNSEHER', m:'television' },  { w:'COMPUTER', m:'computer' },  { w:'HANDSCHUH', m:'glove' },
    { w:'SCHULTER', m:'shoulder' },  { w:'GEMEINDE', m:'community' },  { w:'BEVÖLKERUNG', m:'population' },  { w:'REGENWALD', m:'rainforest' },
    { w: 'AUTOMOBIL', m: 'automobile' }, { w: 'BAHNHOF', m: 'train station' },  { w: 'BIBLIOTHEK', m: 'library' },  { w: 'BLUMENTOPF', m: 'flower pot' },
    { w: 'BUCHHANDLUNG', m: 'bookstore' },  { w: 'DONNERSTAG', m: 'Thursday' },  { w: 'ELEKTRIZITÄT', m: 'electricity' },  { w: 'FOTOGRAFIE', m: 'photography' },
    { w: 'GEBIRGSZUG', m: 'mountain range' },  { w: 'GEMEINSCHAFT', m: 'community' },  { w: 'GESCHICHTE', m: 'history' },  { w: 'GESUNDHEIT', m: 'health' },
    { w: 'HAUSHALT', m: 'household' },  { w: 'INTERNET', m: 'internet' },  { w: 'KALENDER', m: 'calendar' },  { w: 'KINDERGARTEN', m: 'kindergarten' },
    { w: 'KONZERT', m: 'concert' },  { w: 'KRANKENHAUS', m: 'hospital' },  { w: 'KÜCHENTISCH', m: 'kitchen table' },  { w: 'LEHRERZIMMER', m: 'teachers\' lounge' },
    { w: 'MITTWOCH', m: 'Wednesday' },  { w: 'NACHBAR', m: 'neighbor' },  { w: 'OBSTGARTEN', m: 'orchard' },  { w: 'PARKHAUS', m: 'parking garage' },
    { w: 'REISEBÜRO', m: 'travel agency' },  { w: 'SCHULRANZEN', m: 'school backpack' },  { w: 'SCHWIMMBAD', m: 'swimming pool' },  { w: 'SONNENBLUME', m: 'sunflower' },
    { w: 'SPORTPLATZ', m: 'sports field' },  { w: 'STADION', m: 'stadium' },  { w: 'STRAßENBAHN', m: 'tram' },  { w: 'TELEFON', m: 'telephone' },
    { w: 'UNTERNEHMEN', m: 'company' },  { w: 'VERKEHRSMITTEL', m: 'means of transport' },  { w: 'WASCHBECKEN', m: 'sink' },  { w: 'WOHNUNG', m: 'apartment' },
    { w: 'ZEITUNG', m: 'newspaper' },  { w: 'ZIMMERPFLANZE', m: 'houseplant' },  { w: 'ZUCKER', m: 'sugar' },  { w: 'ZUGFAHRAUSWEIS', m: 'train ticket' },  { w: 'ZWIEBEL', m: 'onion' }
  ],
  13: [ // Added longer words
    { w: 'WORTMEISTER', m: 'word master' },
    { w: 'GESCHWINDIGKEIT', m: 'speed' },
    { w: 'VERANTWORTUNG', m: 'responsibility' },
    { w: 'ZUSAMMENARBEIT', m: 'collaboration' },
    { w: 'WELTMEISTERSCHAFT', m: 'world championship' }
  ]
};
// TRIES maps each word length to the number of WRONG guesses the player is
// allowed before losing the round (e.g., a 6-letter word allows 3 misses).
const TRIES = { 5:2, 6:3, 7:3, 8:3, 13:4 };

// ROWS defines the on-screen keyboard layout, top row to bottom row.
// It follows the German QWERTZ layout and includes the umlaut keys Ä Ö Ü.
const ROWS = ['QWERTZUIOPÄÖÜ', 'ASDFGHJKL', 'YXCVBNM'];

/* ---------- DOM elements ---------- */
// $ is a shorthand helper: document.querySelector('#id') becomes $('#id').
const $ = (s) => document.querySelector(s);

// els caches references to all HTML elements the game manipulates,
// so we don't have to search the DOM over and over again.
const els = {
  start: $('#screen-start'),    // the start/menu screen
  game: $('#screen-game'),      // the main game screen
  tiles: $('#tiles'),           // container holding the letter tiles
  tilesWrap: $('#tilesWrap'),   // wrapper around the tiles (layout)
  message: $('#message'),       // status/instruction text line
  stamp: $('#stamp'),           // decorative "stamp" overlay element
  dots: $('#dots'),             // row of dots showing remaining wrong guesses
  lenBadge: $('#lenBadge'),     // badge showing the chosen word length
  keyboard: $('#keyboard'),     // on-screen keyboard container
  result: $('#resultPanel'),    // end-of-round result panel
  resultWord: $('#resultWord'), // headline inside the result panel
  resultSub: $('#resultSub'),   // sub-line (score) inside the result panel
  scoreChip: $('#scoreChip'),   // small chip displaying the current score
  soundBtn: $('#soundBtn'),     // sound on/off toggle button
  below: $('#below'),           // area below the board (buttons etc.)
  stage: $('#stage')            // board/stage area used for width measuring
};

// state holds everything that changes while playing a round.
const state = {
  len: 6,            // currently selected word length
  word: '',          // the secret word for this round
  meaning: '',       // English translation of the secret word
  revealed: [],      // one slot per letter: null = hidden, letter = revealed
  triesLeft: 0,      // wrong guesses remaining this round
  maxTries: 0,       // total wrong guesses allowed this round
  used: new Set(),   // letters already guessed (prevents duplicate guesses)
  active: false,     // true while a round is in progress and guesses count
  lastWord: ''       // the previous word, so we avoid picking it twice in a row
};

// Scores are persisted in the browser's localStorage so they survive page
// reloads. The "+(...)" converts the stored string into a number; if nothing
// is stored (null), the expression falls back to 0.
let score = +(localStorage.getItem('wm_score') || 0);          // current win streak
let bestScore = +(localStorage.getItem('wm_best_score') || 0); // best streak ever
let resizeTimeout; // used to debounce window-resize handling (see handleResize)

/* ---------- Sound engine ---------- */
// Sound is a small self-contained audio module built on the Web Audio API.
// It is wrapped in an IIFE (Immediately Invoked Function Expression): the
// function runs once, and only the returned object (the public API at the
// bottom) is exposed — internal variables like ctx and muted stay private.
const Sound = (() => {
  let ctx = null;                                       // the AudioContext, created lazily
  let muted = localStorage.getItem('wm_muted') === '1'; // mute preference, persisted

  // ac() returns the shared AudioContext, creating it on first use.
  // Browsers block audio until the user interacts with the page, so the
  // context is also "resumed" here if the browser suspended it.
  function ac() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // env() shapes a note's volume over time (a volume "envelope"):
  // start at 0 → quickly ramp up to `peak` (attack) → decay exponentially to
  // near-silence. This avoids harsh clicks at the start/end of each sound.
  function env(g, t, a = 0.005, d = 0.15, peak = 0.2) {
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  // tone() plays one synthesized note.
  //   freq  = pitch in Hz
  //   type  = oscillator waveform (sine, square, triangle, sawtooth…)
  //   dur   = duration in seconds
  //   peak  = volume
  //   slide = optional end frequency (creates a pitch-bend effect)
  //   when  = optional delay in seconds before the note starts
  function tone(freq, { type = 'sine', dur = 0.15, peak = 0.18, slide = null, when = 0 } = {}) {
    if (muted) return;              // do nothing when sound is muted
    const c = ac();
    const t = c.currentTime + when;
    const o = c.createOscillator(); // the sound source (a wave)
    const g = c.createGain();       // node that controls the volume
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur); // pitch slide
    env(g, t, 0.005, dur, peak);
    o.connect(g).connect(c.destination); // oscillator → volume → speakers
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // noise() generates a short burst of white noise (random audio samples) —
  // used for percussive effects like the "stamp" thump. A lowpass filter
  // removes high frequencies so it sounds deep and muffled, not hissy.
  function noise(dur = 0.08, peak = 0.12, when = 0) {
    if (muted) return;
    const c = ac();
    const t = c.currentTime + when;
    // create an audio buffer filled with random values (white noise)
    const b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); // fades out linearly
    const s = c.createBufferSource();
    s.buffer = b;
    const g = c.createGain();
    g.gain.value = peak;
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 900; // cut everything above 900 Hz for a softer sound
    s.connect(f).connect(g).connect(c.destination);
    s.start(t);
  }

  // Public API of the Sound module — the named sound effects used by the game:
  return {
    get muted() { return muted; },   // read-only access to the mute state
    toggle() {                       // flip mute on/off and remember the choice
      muted = !muted;
      localStorage.setItem('wm_muted', muted ? '1' : '0');
      return muted;
    },
    tick() { tone(720, { type: 'square', dur: 0.04, peak: 0.05 }); },  // short key-click
    stamp() { noise(0.09, 0.22); tone(150, { type: 'sine', dur: 0.12, peak: 0.25, slide: 70 }); }, // letter-reveal thump
    error() {                        // descending "wrong guess" buzz
      tone(190, { type: 'sawtooth', dur: 0.22, peak: 0.14, slide: 90 });
      tone(95, { type: 'sawtooth', dur: 0.28, peak: 0.12, slide: 55, when: 0.02 });
    },
    win() {                          // rising victory arpeggio (C–E–G–C)
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(f, { type: 'triangle', dur: 0.16, peak: 0.14, when: i * 0.09 })
      );
      noise(0.06, 0.1);
    },
    lose() {                         // sad descending tones
      tone(220, { type: 'triangle', dur: 0.25, peak: 0.14, slide: 160 });
      tone(160, { type: 'triangle', dur: 0.4, peak: 0.12, slide: 110, when: 0.18 });
    },
    thud() { noise(0.12, 0.3); tone(90, { type: 'sine', dur: 0.18, peak: 0.3, slide: 45 }); }
  };
})();

/* ---------- Keyboard ---------- */
// keyEls stores a reference to each on-screen key button, keyed by its letter
// (e.g., keyEls['A']), so the game can highlight/disable keys later.
const keyEls = {};

// buildKeyboard() creates the on-screen keyboard buttons from the ROWS layout.
function buildKeyboard() {
  els.keyboard.innerHTML = ''; // clear any existing keys first
  ROWS.forEach((row, r) => {
    const div = document.createElement('div');
    div.className = 'kb-row';  // one visual row of keys
    [...row].forEach(L => {    // [...row] splits the string into single letters
      const b = document.createElement('button');
      b.className = 'key';
      b.textContent = L;
      b.dataset.key = L;       // store the letter on the element (data-key="L")
      b.addEventListener('click', () => {
        Sound.tick();          // click feedback...
        guess(L);              // ...then process the guess
      });
      keyEls[L] = b;           // remember this button for later updates
      div.appendChild(b);
    });
    els.keyboard.appendChild(div);
  });
}

/* ---------- Game logic ---------- */

// startRound(len) begins a new round using words of the given length.
function startRound(len) {
  state.len = len;
  let pool = []; // the list of candidate words to pick from

  if (len === 8) {
    // Combine all words with 8 or more letters
    Object.keys(WORDS).forEach(key => {
      if (parseInt(key) >= 8) {
        pool.push(...WORDS[key]);
      }
    });
    // Sort by length to get a variety of word lengths
    // (with a random comparator this actually SHUFFLES the pool randomly)
    pool.sort(() => Math.random() - 0.5);
  } else {
    pool = WORDS[len];
  }

  // Select a word, avoiding repeats
  let entry;
  do {
    entry = pool[Math.floor(Math.random() * pool.length)];
  } while (pool.length > 1 && entry.w === state.lastWord);

  state.lastWord = entry.w;                          // remember for the next round
  state.word = entry.w;                              // the secret word
  state.meaning = entry.m;                           // its translation
  state.maxTries = TRIES[len] || 3;                  // allowed misses (fallback: 3)
  state.triesLeft = state.maxTries;
  state.revealed = Array(entry.w.length).fill(null); // all letters start hidden
  state.used = new Set();                            // no letters guessed yet
  state.active = true;                               // round is now playable

  // Update badge text
  els.lenBadge.textContent = len === 8 ? '8 LETTERS+' : `${len} LETTERS`;

  renderTries();  // draw the miss-dots
  renderTiles();  // draw the blank letter tiles
  Object.values(keyEls).forEach(k => {
    k.disabled = false;                 // re-enable every key...
    k.classList.remove('hit', 'miss');  // ...and clear the previous round's colors
  });

  els.stamp.hidden = true;   // hide leftover decorations
  els.stamp.className = 'stamp';
  els.result.hidden = true;  // hide the result panel

  setMessage(`Pick letters — you can miss ${state.maxTries} time${state.maxTries > 1 ? 's' : ''}.`, '');
  showScreen('game');

  // Delay fitTiles to ensure DOM is ready
  setTimeout(() => {
    fitTiles(); // size the tiles once the new tiles are actually in the DOM
    window.addEventListener('resize', handleResize); // keep tiles sized on resize
  }, 50);
}

// renderTiles() builds one blank tile per letter of the secret word.
function renderTiles() {
  els.tiles.innerHTML = ''; // remove old tiles
  const wordLength = state.word.length;

  // Add long-word class for words with 10+ letters
  if (wordLength >= 10) {
    els.tiles.classList.add('long-word'); // CSS makes long words more compact
  } else {
    els.tiles.classList.remove('long-word');
  }

  [...state.word].forEach((ch, i) => {
    const t = document.createElement('div');
    t.className = 'tile';
    t.style.setProperty('--i', i); // CSS variable used for staggered animations
    const s = document.createElement('span');
    s.className = 'letter';        // this span will hold the revealed letter
    t.appendChild(s);
    els.tiles.appendChild(t);
  });

  // Force recalculation after rendering
  requestAnimationFrame(() => fitTiles()); // size tiles on the next animation frame
}

// fitTiles() responsively calculates the tile size so the whole word fits
// within the visible width of the stage, then applies it via CSS variables.
function fitTiles() {
  if (!state.word) return; // nothing to size before a round starts

  const n = state.word.length;       // number of letters/tiles
  const stageWidth = els.stage.clientWidth;

  // Calculate available width considering padding
  const avail = stageWidth - 16;

  // Dynamic gap based on word length — longer words get tighter spacing
  const gap = n > 12 ? 2 : n > 10 ? 3 : n > 8 ? 4 : Math.min(8, Math.max(4, 8 - (n * 0.5)));

  // Calculate ideal tile size: divide the available width evenly among tiles
  const idealSize = Math.floor((avail - (n - 1) * gap) / n);

  // Dynamic min/max sizes based on word length (longer words → smaller tiles)
  const minSize = n > 12 ? 16 : n > 10 ? 18 : n > 8 ? 20 : 24;
  const maxSize = n > 12 ? 28 : n > 10 ? 32 : n > 8 ? 36 : 40;

  // Clamp the ideal size between the min and max bounds
  const size = Math.max(minSize, Math.min(maxSize, idealSize));

  // Apply the calculated size
  els.tiles.style.setProperty('--tile', `${size}px`); // consumed by the CSS
  els.tiles.style.gap = `${gap}px`;

  // Adjust font size for very small tiles
  if (size < 20) {
    document.documentElement.style.setProperty('--tile-font-ratio', '0.6'); // smallest tiles → biggest font ratio
  } else if (size < 25) {
    document.documentElement.style.setProperty('--tile-font-ratio', '0.55');
  } else {
    document.documentElement.style.setProperty('--tile-font-ratio', '0.5'); // normal tiles
  }
}

// handleResize() recalculates tile sizes when the browser window is resized,
// but "debounced": it waits 100ms after the LAST resize event before running,
// so dragging the window doesn't trigger dozens of recalculations.
function handleResize() {
  clearTimeout(resizeTimeout); // cancel any pending recalculation
  resizeTimeout = setTimeout(() => {
    if (els.game.classList.contains('active')) {
      fitTiles(); // only recalculate if the game screen is visible
    }
  }, 100);
}

// revealLetter(L) uncovers every occurrence of letter L in the word,
// animates the tiles, updates the keyboard, and returns the number of hits.
function revealLetter(L) {
  const hits = [];
  [...state.word].forEach((ch, i) => {
    if (ch === L) hits.push(i); // collect all positions where L appears
  });
  const key = keyEls[L];
  key.classList.add('hit');   // mark the key green (via CSS)
  key.disabled = true;        // this letter can't be guessed again
  hits.forEach((i, k) => {
    const tile = els.tiles.children[i];
    // random slight tilt between -2.5° and +2.5° for a natural "stamped" look
    tile.style.setProperty('--tilt', (Math.random() * 5 - 2.5).toFixed(2) + 'deg');
    tile.style.animationDelay = (k * 110) + 'ms'; // stagger multiple reveals
    tile.classList.add('revealed');               // triggers the reveal animation
    tile.firstElementChild.textContent = L;       // show the letter on the tile
    state.revealed[i] = L;                        // record it in the game state
  });
  Sound.stamp();
  return hits.length;
}

// guess(L) is the heart of the game: it handles one letter guess from
// start to finish (correct reveal OR wrong-guess penalty).
function guess(L) {
  // ignore the guess if the round is over or the letter was already tried
  if (!state.active || state.used.has(L)) return;
  state.used.add(L);
  const hits = [];
  [...state.word].forEach((ch, i) => {
    if (ch === L) hits.push(i); // find all matching positions
  });

  if (hits.length) {
    // --- Correct guess ---
    revealLetter(L);
    const n = hits.length;
    setMessage(n > 1 ? `“${L}” is in the word — ${n}×!` : `“${L}” is in the word!`, 'good');
    if (state.revealed.every(Boolean)) endRound(true); // every letter revealed → win!
  } else {
    // --- Wrong guess ---
    const key = keyEls[L];
    key.classList.add('miss');  // mark the key red (via CSS)
    key.disabled = true;
    state.triesLeft--;          // use up one try
    renderTries();              // update the dots display
    shake();                    // shake the tile row for feedback
    Sound.error();
    const left = state.triesLeft;
    setMessage(left > 0 ? `No “${L}” here — ${left} tr${left === 1 ? 'y' : 'ies'} left.` : `No “${L}” here — that was your last try.`, 'bad');
    if (left <= 0) endRound(false); // out of tries → lose
  }
}

// shake() plays the CSS "shake" animation on the tile row (wrong-guess feedback).
function shake() {
  const t = els.tiles;
  t.classList.remove('shake');
  void t.offsetWidth;  // force a browser reflow so the animation can restart
  t.classList.add('shake');
  t.addEventListener('animationend', () => t.classList.remove('shake'), { once: true });
}

// renderTries() redraws the row of dots showing how many wrong guesses remain.
function renderTries() {
  els.dots.innerHTML = '';
  for (let i = 0; i < state.maxTries; i++) {
    const d = document.createElement('span');
    // dots at/after triesLeft have been "used" (spent misses)
    d.className = 'dot' + (i >= state.triesLeft ? ' used' : '');
    if (i === state.triesLeft) d.classList.add('just'); // highlight the dot just lost
    els.dots.appendChild(d);
  }
}

// setMessage(text, kind) updates the status line. kind is '', 'good' or 'bad'
// and controls the message color. The 'pop' animation restarts each time.
function setMessage(text, kind) {
  els.message.textContent = text;
  els.message.className = 'message' + (kind ? ' ' + kind : '');
  els.message.classList.remove('pop');
  void els.message.offsetWidth;      // reflow trick to restart the animation
  els.message.classList.add('pop');
}

// endRound(win) finishes the round: updates the score, plays sounds and
// animations, reveals the answer, and shows the result panel.
function endRound(win) {
  state.active = false;                                  // stop accepting guesses
  Object.values(keyEls).forEach(k => k.disabled = true); // lock the keyboard

  if (win) {
    score++;                                             // extend the win streak
    if (score > bestScore) {
      bestScore = score;                                 // new personal best
      localStorage.setItem('wm_best_score', bestScore);
    }
    localStorage.setItem('wm_score', score);             // persist the streak
    updateScoreChip();
    bounceTiles();  // celebratory tile animation
    Sound.win();
    setMessage(`Correct! The word means: "${state.meaning}"`, 'good');
    setTimeout(showResult, 1000);                        // show result panel after 1s
  } else {
    score = 0;                                           // losing resets the streak
    localStorage.setItem('wm_score', 0);
    updateScoreChip();
    // Reveal the missed letters one by one so the player sees the full answer
    [...state.word].forEach((ch,i)=>{
      if (!state.revealed[i]){
        const tile = els.tiles.children[i];
        tile.style.setProperty('--tilt','0deg');
        // staggered reveal: starts after 250ms, 70ms apart per letter
        setTimeout(()=>{ tile.classList.add('miss'); tile.firstElementChild.textContent = ch; }, 250 + i*70);
      }
    });
    setTimeout(()=>{ setMessage(`Game over! The word was "${state.word}" and means: "${state.meaning}"`, 'bad'); }, 650);
    setTimeout(()=>{ Sound.lose(); }, 650);
    setTimeout(showResult, 1500);                        // show result panel after 1.5s
  }
}

// bounceTiles() makes every tile bounce, staggered left-to-right (win animation).
function bounceTiles() {
  [...els.tiles.children].forEach((t, i) => {
    t.style.animationDelay = '0ms';
    setTimeout(() => { t.classList.add('bounce'); }, i * 70); // 70ms apart
  });
}

// showResult() displays the end-of-round panel with the outcome and score.
function showResult() {
  els.resultWord.innerHTML = state.revealed.every(Boolean)
    ? `<strong>Correct!</strong>`  // all letters were revealed → win
    : `Game over`;                 // ran out of tries → loss
  els.resultSub.textContent = `Score: ${score}`;
  els.result.hidden = false;
}

// updateScoreChip() refreshes the small score display (e.g., "SCORE 4").
function updateScoreChip() {
  els.scoreChip.innerHTML = `SCORE <b>${score}</b>`;
}

// showScreen(name) switches between the 'start' menu and the 'game' screen
// by toggling the CSS 'active' class on each screen element.
function showScreen(name) {
  els.start.classList.toggle('active', name === 'start');
  els.game.classList.toggle('active', name === 'game');

  if (name === 'start') {
    window.removeEventListener('resize', handleResize); // not needed on the menu
  }
}

/* ---------- Event listeners ---------- */

// Everything below runs once the HTML has finished loading, so all elements
// referenced here are guaranteed to exist in the page.
document.addEventListener('DOMContentLoaded', function() {
  buildKeyboard();    // create the on-screen keyboard
  updateScoreChip();  // show the saved score
  renderSoundIcon();  // show the correct speaker icon
  fitTiles();         // initial tile sizing

  const nextBtn = $('#nextBtn');     // "next word" button (same length)
  const backBtn = $('#backBtn');     // "back to menu" button
  const randomBtn = $('#randomBtn'); // "random length" button
  const soundBtn = $('#soundBtn');   // mute toggle button

  if (nextBtn) nextBtn.addEventListener('click', () => startRound(state.len));
  if (backBtn) backBtn.addEventListener('click', () => showScreen('start'));
  if (randomBtn) randomBtn.addEventListener('click', () => {
    const lens = [5, 6, 7, 8, 13];
    startRound(lens[Math.floor(Math.random() * lens.length)]); // pick a random length
  });
  if (soundBtn) soundBtn.addEventListener('click', () => {
    Sound.toggle();       // flip mute state (also saved to localStorage)
    renderSoundIcon();    // update the speaker icon
    if (!Sound.muted) Sound.tick(); // confirmation click when unmuting
  });

  // The word-length option buttons on the start screen (data-len="5" etc.)
  document.querySelectorAll('.opt').forEach(o => {
    o.addEventListener('click', () => startRound(+o.dataset.len)); // "+" converts string to number
  });
});

// renderSoundIcon() shows the speaker-on or speaker-off icon depending on
// whether sound is currently muted.
function renderSoundIcon() {
  const iconSoundOn = $('#iconSoundOn');
  const iconSoundOff = $('#iconSoundOff');
  if (iconSoundOn && iconSoundOff) {
    iconSoundOn.style.display = Sound.muted ? 'none' : 'block';
    iconSoundOff.style.display = Sound.muted ? 'block' : 'none';
  }
}

// Keyboard event listener — lets the player use a physical keyboard
// instead of clicking the on-screen keys.
document.addEventListener('keydown', (e) => {
  if (els.game.classList.contains('active')) {
    // On the game screen:
    if (e.key === 'Enter' && !state.active && !els.result.hidden) {
      startRound(state.len); // Enter starts the next round after a round ends
      return;
    }
    const k = e.key.toUpperCase();
    // Accept single letters A–Z plus German umlauts Ä Ö Ü, but ignore
    // combos with Meta/Ctrl/Alt (so browser shortcuts like Ctrl+C still work)
    if (/^[A-ZÄÖÜ]$/.test(k) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      if (keyEls[k]) {   // only letters that exist on our virtual keyboard
        Sound.tick();
        guess(k);
      }
    }
  } else {
    // On the start screen: pressing 5/6/7/8 quickly starts that word length
    if (/^[5678]$/.test(e.key)) startRound(+e.key);
  }
});

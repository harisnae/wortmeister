<div align="center">

# WORTMEISTER

**Ein deutsches Ratespiel · A German word-guessing game**

A dependency-free, letterpress-styled word game. Hidden German words are
revealed letter by letter — every miss costs a try.

![License](https://img.shields.io/badge/license-MIT-blue)
![Vanilla JS](https://img.shields.io/badge/vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Dependencies](https://img.shields.io/badge/dependencies-0-success)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Hosting](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-181717?logo=github)

<div align="center">

🎮 **[▶ Play it live](https://harisnae.github.io/wortmeister/)**

</div>

---

## Table of contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Architecture](#architecture)
5. [Technical deep dives](#technical-deep-dives)
6. [Data schemas](#data-schemas)
7. [Getting started](#getting-started)
8. [Customization recipes](#customization-recipes)
9. [Extension roadmap](#extension-roadmap)
10. [Known issues and technical debt](#known-issues-and-technical-debt)
11. [Contributing](#contributing)
12. [Deployment (GitHub Pages)](#deployment-github-pages)
13. [Browser support](#browser-support)
14. [Performance notes](#performance-notes)
15. [License](#license)

---

## Overview

Wortmeister is a static, single-page word-guessing game built with **zero runtime dependencies and no build step**. The player picks a word length, then guesses letters — correct letters are "stamped" onto tiles, while wrong guesses consume one of 3–4 tries (depending on length). Winning extends a score streak; losing resets it to zero.

The codebase is designed for transparency and forkability. Every non-trivial mechanism is documented at its point of use, and the architecture is decoupled to allow for easy expansion of word lists, languages, or sound effects.

---

## Features

- **5 difficulty tiers** — 5, 6, 7, 8+ and 13-letter words (the 13-letter tier is reachable via the "Random length" button). Tries are more forgiving: 3 misses for 5-letter words, 4 for every other tier.
- **1,000+ curated German nouns** with English glosses, revealed after each round — including a dedicated pool of long compounds (*WORTMEISTER*, *GESCHWINDIGKEIT*, *WELTMEISTERSCHAFT* …).
- **Procedural sound effects** — synthesized live via the Web Audio API (zero audio assets).
- **Win-streak scoring** persisted in `localStorage` (current + best).
- **Dual input** — on-screen QWERTZ keyboard (incl. Ä Ö Ü ß) and physical keyboard support.
- **Loss reveal** — after a lost round, missed letters are stamped in red one by one and the full word plus its meaning is shown.
- **Fluid responsive board** — length-aware JS tile sizing (dynamic gaps, per-length min/max clamps) combined with a `.long-word` compaction mode and CSS container queries.
- **Accessibility** — `:focus-visible` outlines, `prefers-reduced-motion` support, and safe-area insets.
- **Letterpress aesthetic** — hard offset shadows, paper-grain overlay, and stamp animations.

---

## Tech stack

| Layer       | Choice                 | Notes                                                    |
|-------------|------------------------|----------------------------------------------------------|
| Markup      | HTML5                  | Two-screen SPA pattern, inline SVG icons                 |
| Styles      | CSS3                   | Custom properties, container queries, keyframe animations |
| Logic       | ES6+ JavaScript        | Strict mode, IIFE module pattern, no frameworks          |
| Audio       | Web Audio API          | Oscillators + noise buffers, synthesized at runtime      |
| Fonts       | Google Fonts           | Fraunces (display serif), Space Grotesk (UI sans)        |
| Persistence | `localStorage`         | Score, best score, mute preference                       |
| Hosting     | GitHub Pages           | Static files, no CI/build required                       |

---

## Architecture

### File map

```
wortmeister/
├── index.html    # Markup: start screen, game screen, inline SVG icons
├── style.css     # Theme tokens, layout, components, animations, media queries
├── script.js     # Word data, game state, sound engine, event wiring
└── README.md
```

### Runtime overview

The app is a two-screen single-page app. Screen switching is handled by toggling the `.active` class on the section elements.

```
┌─────────────────────────── index.html ────────────────────────────┐
│                                                                   │
│   #screen-start  ◄──── .active toggle ────►  #screen-game         │
│   length picker,             │              board, keyboard,      │
│   demo animation             │              status, results       │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │  data-len attributes, element ids
                               ▼
┌─────────────────────────── script.js ─────────────────────────────┐
│                                                                   │
│   Static data           Mutable state          Audio module       │
│   WORDS · TRIES · ROWS  state · score·best     Sound (IIFE)       │
│                              │                                    │
│                              ▼                                    │
│   Game loop:                                                      │
│   startRound → guess → revealLetter → endRound → showResult       │
│                                                                   │
└──────────────────────────────┬────────────────────────────────────┘
                               │  CSS custom properties
                               │  (--tile, --tilt, --i, --tile-font-ratio)
                               ▼
┌─────────────────────────── style.css ─────────────────────────────┐
│   tokens → reset → grain → screens → components → keyframes → MQs │
└───────────────────────────────────────────────────────────────────┘
```

### Round lifecycle

```
START SCREEN ── pick length ──► startRound(len) ──► ACTIVE
                                                      │
                                                  guess(L)
                                              ┌──────────┴──────────┐
                                              ▼                     ▼
                                            HIT                   MISS
                                              │                     │
                                    revealLetter(L)           triesLeft - 1
                                              │                     │
                                     all letters revealed?      triesLeft = 0?
                                              │ yes                 │ yes
                                              ▼                     ▼
                                        endRound(true)        endRound(false)
                                              └─────────┬───────────┘
                                                        ▼
                                                  RESULT PANEL
                                                        │  Next word / Enter
                                                        ▼
                                              startRound(state.len) ──► ACTIVE
```

> On a lost round, `endRound(false)` reveals the remaining letters one by one
> (red "miss" tiles, staggered ~70 ms apart) before the result panel appears.

### Controls

- **On-screen keyboard**: click/tap the QWERTZ keys (incl. Ä Ö Ü ß).
- **Physical keyboard**: single letters A–Z and the umlauts Ä Ö Ü are accepted
  on the game screen; modifier combos (Ctrl/Cmd/Alt) are ignored so browser
  shortcuts keep working.
- **Start screen shortcuts**: pressing `5`–`8` immediately starts that word length.
- **Next round**: `Enter` (or the "Next word" button) starts a new round from
  the result panel.

### Game state reference

All mutable round data lives in a single `state` object.

| Property    | Type                | Purpose                                        |
|-------------|---------------------|------------------------------------------------|
| `len`       | `number`            | Selected word length                           |
| `word`      | `string`            | Secret word for the current round              |
| `meaning`   | `string`            | English gloss, revealed at round end           |
| `revealed`  | `(string\|null)[]`  | One slot per letter; `null` = still hidden     |
| `triesLeft` | `number`            | Wrong guesses remaining                        |
| `maxTries`  | `number`            | Tries allowed for this length (from `TRIES`)   |
| `used`      | `Set<string>`       | Letters already guessed (prevents duplicates)  |
| `active`    | `boolean`           | `true` while guesses are accepted              |
| `lastWord`  | `string`            | Previous word, used to avoid immediate repeats |

---

## Technical deep dives

### 1. Word selection (`startRound`)

- **Pool Logic**: For lengths 5–7 and 13, the pool is `WORDS[len]`. For the "8 LETTERS+" tier, all arrays with keys ≥ 8 (the `8` and `13` pools) are merged and shuffled, so long compounds can also appear there.
- **Anti-Repeat**: A `do...while` loop ensures the same word is not picked twice in a row (`state.lastWord`).
- **Tries**: `maxTries` is looked up from the `TRIES` object, defaulting to 3.

### 2. Responsive tile sizing (`fitTiles`)

Tile size is computed in JavaScript to ensure the word fits exactly within the stage width regardless of length.

**The Algorithm:**
1. `avail = stage.clientWidth - 16` (padding allowance).
2. `gap` is determined by word length $n$:
   - $n > 12 \rightarrow 2\text{px}$
   - $n > 10 \rightarrow 3\text{px}$
   - $n > 8 \rightarrow 4\text{px}$
   - Otherwise $\rightarrow \text{clamp}(4, 8 - n/2, 8)$
3. `idealSize = floor((avail - (n-1) * gap) / n)`
4. `size = clamp(idealSize, minSize(n), maxSize(n))` with length-dependent bounds:
   - `minSize`: 24px (≤8 letters) → 20px (>8) → 18px (>10) → 16px (>12)
   - `maxSize`: 40px (≤8) → 36px (>8) → 32px (>10) → 28px (>12)
5. `--tile-font-ratio` on `:root` steps down as the computed tile shrinks:
   `0.5` (≥25px) → `0.55` (<25px) → `0.6` (<20px).

The result is applied as a CSS custom property (`--tile`), and the font size is adjusted via `--tile-font-ratio` on the `:root` element.

**Long-word mode:** for words of 10+ letters, `renderTiles()` adds a `.long-word` class to the board; the CSS then compacts the row (smaller `--tile`, tighter gaps) with extra breakpoints at 600px and 400px.

### 3. Sound engine (`Sound`)

The sound engine is an IIFE module using the **Web Audio API**. It avoids external assets by synthesizing sounds at runtime.

- **Lazy Context**: The `AudioContext` is created on the first user interaction to comply with browser autoplay policies.
- **Envelopes**: A linear attack (5ms) and exponential decay are applied to every note to prevent audio popping.
- **Synthesis**:
  - `tone()`: Uses an oscillator with an optional exponential frequency ramp for pitch slides.
  - `noise()`: Generates a buffer of random samples with a linear fade-out, passed through a 900Hz lowpass filter.

### 4. JS ↔ CSS bridge

The game uses CSS custom properties as a data bridge, allowing JavaScript to control complex animations without manipulating individual styles:

| Custom property      | Set by          | Consumed by                                    |
|----------------------|-----------------|------------------------------------------------|
| `--tile`             | `fitTiles()`    | `.tile` width, height, and font-size            |
| `--tile-font-ratio`  | `fitTiles()`    | Glyph size as a fraction of tile width         |
| `--i`                | `renderTiles()` | Staggered animation delays                     |
| `--tilt`             | `revealLetter()`| Random rotation in `stampIn` and `bounce` frames|

### 5. Animation restart pattern

To restart a CSS animation (like the "shake" effect), the codebase uses the **forced-reflow trick**:
```js
el.classList.remove('shake');
void el.offsetWidth; // Forces the browser to calculate layout, resetting the animation state
el.classList.add('shake');
```

---

## Data schemas

### `WORDS` & `TRIES`

```js
const WORDS = {
  5:  [ { w: "APFEL", m: "apple" }, ... ],             // ~154 entries
  6:  [ ... ],                                         // ~434 entries
  7:  [ ... ],                                         // ~194 entries
  8:  [ ... ],                                         // ~285 entries — merged with `13` at runtime
  13: [ { w: "WORTMEISTER", m: "word master" }, ... ]  // 5 long compounds (11–18 letters)
};
const TRIES = { 5: 3, 6: 4, 7: 4, 8: 4, 13: 4 };
```

> The board is always built from the word's **actual** length; the badge and
> try count come from the **pool key**. Any key ≥ 8 is merged into the
> "8 LETTERS+" pool by `startRound()`.

### `localStorage`
| Key              | Type            | Purpose              |
|------------------|-----------------|----------------------|
| `wm_score`       | number (string) | Current win streak   |
| `wm_best_score`  | number (string) | Best streak ever     |
| `wm_muted`       | `'1'` / `'0'`   | Sound preference     |

---

## Getting started

No build step required.

```bash
git clone https://github.com/harisnae/wortmeister.git
cd <repo-name>

# Option A: Open index.html directly in a browser
# Option B: Serve locally (recommended)
python3 -m http.server 8000
```

---

## Customization recipes

- **Add words**: Append `{ w: 'WORD', m: 'meaning' }` to the relevant array in `WORDS`. Keep `w` uppercase and make sure the letter count matches the pool key (see the note in *Data schemas*).
- **Add a difficulty tier**: Add a key to `WORDS` and `TRIES`, then add a button in `index.html` with `data-len="X"`. Keys ≥ 8 are automatically merged into the 8+ pool.
- **Re-theme**: Modify the design tokens (colors/fonts) in the `:root` block of `style.css`.
- **Change sounds**: Edit the synthesis parameters (frequencies/waveforms) in the `Sound` module.

---

## Extension roadmap

The following "dormant" hooks are already present in the CSS and can be wired up in `script.js`:

- [ ] **Win/Lose Stamp**: Wire up the `.stamp.win` and `.stamp.lose` overlays.
- [ ] **Confetti**: Implement a function to spawn `.confetti` elements on win.
- [ ] **Haptic Feedback**: Trigger `.tiles-wrap.thud` and `Sound.thud()` on wrong guesses.
- [ ] **Key Nudge**: Trigger `.key.nudge` when a player guesses a letter already used.
- [ ] **Hint System**: Reveal a random letter at the cost of one try.
- [ ] **Daily Challenge**: Implement a seeded RNG for a shared daily word.

---

## Known issues and technical debt

**Fixed in the current version** (previously listed here):
- ~~Undefined token `--ink-30`~~ — now defined in `:root`.
- ~~The `ß` problem~~ — `ß` is now a key on the on-screen keyboard, so words like `STRAßENBAHN` are winnable.

1. **Result panel is button-only**: `showResult()` writes into `.result-word` / `.result-sub`, but those elements no longer exist in `index.html` (the panel now contains only the "Next word" button). The null-guards prevent errors, but the updates are silent no-ops — outcome and meaning are shown via the message line instead. Re-add the elements or delete the dead code (and its CSS).
2. **Physical `ß` key doesn't register**: the keydown handler uppercases input first, and `'ß'.toUpperCase() === 'SS'`, which fails the single-character regex — typed `ß` never reaches `guess()`. The on-screen `ß` key works. Fix: check `e.key === 'ß'` before uppercasing.
3. **Case sensitivity (data invariant)**: `guess()` compares case-sensitively after uppercasing input, so every `w` entry must be uppercase. All current entries comply; lowercase additions would be partially unguessable.
4. **Biased shuffle**: `pool.sort(() => Math.random() - 0.5)` is not a uniform shuffle (affects the merged 8+ pool).
5. **A11y**: `user-scalable=0` in the viewport meta blocks pinch-zoom.
6. **A11y**: `#message` lacks `aria-live="polite"` for screen readers.
7. **Debug logging**: `buildKeyboard()` still `console.log`s every key's char code — remove before shipping.
8. **Data length mismatches**: `SCHNEE` and `HERBST` (6 letters) sit in the 5-letter pool, `GEBÄUDE` (7 letters) in the 8+ pool, and the `13` pool spans 11–18 letters while the badge reads "13 LETTERS". `SÜSSE` is duplicated in the 5-letter pool. Gameplay still works (tiles follow the word's real length), but badge/tries can misrepresent the word.
9. **13-tier discoverability**: the 13-letter tier has no start-screen button — it's only reachable via "Feeling lucky? Random length" (the 5–8 keyboard shortcuts skip it).
10. **Stale comment**: `style.css` claims `.long-word` applies at "7+ letters"; the JS threshold is 10+.

---

## Contributing

1. **Fork** the repository and create a feature branch.
2. **Style**: Use 2-space indentation, single quotes, and `strict mode`.
3. **Dependencies**: Maintain the zero-dependency philosophy.
4. **Testing**: Verify on both touch and physical keyboard inputs.

---

## Deployment (GitHub Pages)

1. Push to GitHub.
2. **Settings** $\rightarrow$ **Pages** $\rightarrow$ **Deploy from a branch**.
3. Select `main` branch and `/ (root)` folder.

---

## Browser support

| Feature              | Requirement                                    | Fallback                       |
|----------------------|------------------------------------------------|--------------------------------|
| Container queries    | Chrome 105+, Safari 16+, Firefox 110+          | JS sizing + media queries      |
| `100dvh`             | Modern browsers                                | `100vh`                        |
| Web Audio API        | All evergreen browsers                         | Mute mode                      |
| `paint-order: stroke`| All evergreen browsers                         | Standard stroke                |

---

## Performance notes

- **Zero network overhead**: No external libraries; only two Google Font requests.
- **GPU Accelerated**: All animations use `transform` and `opacity` to avoid layout thrashing.
- **Optimized Assets**: Paper grain is an inline SVG data URI, eliminating an image request.

---

## License

Released under the [MIT License](LICENSE).

<div align="center">

<em>Viel Spaß beim Raten!</em>

</div>

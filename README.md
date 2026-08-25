# Excel Arena 🏟️

> **Interactive Excel Learning & Challenge Arena** built around practical problem-solving, structured progression, and deterministic mastery.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google%20Gemini-Integrated-orange.svg)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Product Concept & Philosophy

Excel Arena teaches Excel by making users **solve realistic problems** rather than passively reading textbook explanations.

The platform follows a core 4-stage pedagogical progression:

$$\textbf{Learn} \longrightarrow \textbf{Practice} \longrightarrow \textbf{Test} \longrightarrow \textbf{Solve}$$

### Key Principles
* **LeetCode + Modern SaaS + Excel**: Professional, focused, competitive, and distraction-free.
* **No Childish Gamification**: Zero XP, zero cartoon avatars, zero confetti explosions. Progress is measured through genuine **Mastery %**, **Accuracy Rate**, and **Consistency Streaks**.
* **Signature Visual Identity**: Clean off-white and obsidian slate palette with crimson red accents and an animated **red triangular ribbon marker** indicating active progression on the navigation panel.
* **Deterministic Mathematical Engine**: Mathematical and formula correctness is evaluated 100% deterministically in TypeScript—**never** by an LLM.

---

## 🏗️ Technical Architecture

```
                               ┌─────────────────────────┐
                               │   Next.js App Router    │
                               │ (Dashboard / Arena / UI)│
                               └────────────┬────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
┌──────────────────────────────┐ ┌──────────────────────┐ ┌──────────────────────────────┐
│  Deterministic Formula Engine│ │  Dual i18n & Locale  │ │   Server AI Provider Layer   │
│  - Tokenizer / Lexer         │ │  - Interface: EN/TR  │ │  - Gemini API (Server-side)  │
│  - Recursive Descent Parser  │ │  - Formulas: Auto/   │ │  - Progressive Hint Gen      │
│  - AST Grid Evaluator        │ │    EN (=SUM) /       │ │  - Conceptual Feedback       │
│  - Criteria Matcher (*, ?, >)│ │    TR (=TOPLA)       │ │  - Offline Fallback Provider │
│  - Anti-Cheat Intent Checker │ │  - Canonical Map     │ │                              │
└──────────────────────────────┘ └──────────────────────┘ └──────────────────────────────┘
```

---

## 🚀 Features

### 1. The 4-Stage Learning Loop
1. **Learn**: Short business problem $\rightarrow$ reasoning thought-process step $\rightarrow$ interactive dataset $\rightarrow$ **Formula Anatomy** breakdown with synchronized hover highlighting across formula tokens and spreadsheet columns.
2. **Practice**: Hands-on formula bar input (`fx | ...`) $\rightarrow$ instant deterministic grading $\rightarrow$ pedagogical feedback $\rightarrow$ 3-tier progressive hint system.
3. **Test**: High-velocity recognition suite supporting 5 distinct test types:
   - `formula-selection`: Multiple-choice syntax recognition.
   - `formula-debugging`: Spotting range dimension mismatches and syntax bugs.
   - `output-prediction`: Predicting values produced on real data grids.
   - `formula-ordering`: Interactive block-arranging of scrambled formula components.
   - `scenario-matching`: Mapping business requirements to function families.
4. **Solve**: Unguided real-world case on production-sized datasets (50–500+ rows) accepting any logically equivalent formula while detecting hardcoded numeric shortcuts.

### 2. Dual Independent Localization (English & Turkish)
Interface language and Excel formula language can be toggled independently:
* **Interface Language**: `English` or `Türkçe`
* **Formula Language**: `Auto` (matches UI), `English` (`=SUMIF(...)`), or `Türkçe` (`=ETOPLA(...)`)
* Internal logic uses immutable canonical IDs (`SUMIF`, `COUNTIF`, `SUMIFS`, `IF`, etc.) while mapping syntax delimiters (`,` vs `;`) and localized names seamlessly.

### 3. Google Gemini AI Integration
* Secure server-side route handlers (`/api/ai/hint`, `/api/ai/explain`, `/api/ai/scenario`).
* The client never receives or stores the API key.
* **Algorithmic Fallback Engine**: If no API key is provided or the network is offline, the platform automatically switches to heuristic local generators without any disruption.

---

## 📂 Project Structure

```
excel-arena/
 ├── app/
 │    ├── api/ai/               # Secure server-side AI routes (hint, explain, scenario)
 │    ├── arena/[levelId]/[topicId]/ # 4-Stage Learning Arena page
 │    ├── levels/               # Full curriculum overview
 │    ├── profile/              # Performance analytics & skills matrix
 │    ├── settings/             # Language, formula locale & theme preferences
 │    ├── globals.css           # Semantic CSS variables & theme design tokens
 │    ├── layout.tsx            # App root layout with providers
 │    └── page.tsx              # Arena Dashboard / Training resume hero
 ├── components/
 │    ├── excel/
 │    │    ├── ExcelGrid.tsx    # Spreadsheet component with sticky headers & selection
 │    │    ├── FormulaAnatomy.tsx # Interactive formula structure visualizer
 │    │    └── FormulaBar.tsx   # Formula input with live syntax suggestions
 │    ├── layout/
 │    │    ├── AppLayout.tsx    # Responsive shell
 │    │    ├── Header.tsx       # Live stats metrics & language switchers
 │    │    ├── LeftNav.tsx      # Sidebar with animated red triangular ribbon bookmark
 │    │    └── ThemeToggle.tsx  # Light / Dark / System theme switcher
 │    └── stages/
 │         ├── LearnStage.tsx   # Stage 1: Reasoning & Formula Anatomy
 │         ├── PracticeStage.tsx # Stage 2: Formula writing & progressive hints
 │         ├── TestStage.tsx    # Stage 3: 5 fast challenge types & scoring
 │         └── SolveStage.tsx   # Stage 4: Realistic unguided business problem
 ├── lib/
 │    ├── ai/                   # AI Provider abstraction, Gemini SDK, and offline fallbacks
 │    ├── content/              # Level definitions, topics, and challenge datasets
 │    │    ├── topics/level01-foundations.ts
 │    │    ├── topics/level02-logic.ts
 │    │    └── topics/level03-conditionals.ts
 │    ├── formula/              # Deterministic evaluation engine
 │    │    ├── criteria.ts      # Excel criteria matching (*, ?, >, <, <>, =)
 │    │    ├── evaluator.ts     # AST Grid evaluator
 │    │    ├── functions/       # Built-in Excel functions registry
 │    │    ├── parser.ts        # Recursive descent AST parser
 │    │    ├── tokenizer.ts     # Lexer supporting English & Turkish formula syntax
 │    │    ├── types.ts         # AST and evaluation types
 │    │    └── validator.ts     # Deterministic validator with anti-cheat checks
 │    ├── i18n/                 # Localization dictionaries and formula translations
 │    ├── services/             # Mastery calculation and persistence service
 │    └── theme/                # ThemeContext provider
 ├── .env.example
 ├── README.md
 └── package.json
```

---

## ⚡ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/excel-arena.git
cd excel-arena
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```
*(Note: If no API key is provided, Excel Arena runs seamlessly using its built-in heuristic fallback engine!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 📐 Extending Excel Arena

### Adding a New Excel Function
1. Add the canonical name in [`lib/i18n/types.ts`](file:///lib/i18n/types.ts).
2. Register the English and Turkish names and syntax in [`lib/i18n/formulaLocale.ts`](file:///lib/i18n/formulaLocale.ts).
3. Implement the execution logic in [`lib/formula/functions/index.ts`](file:///lib/formula/functions/index.ts).

### Adding a New Level or Topic
1. Define the topic content in `lib/content/topics/` adhering to the `TopicContent` interface (including `learn`, `practice`, `test`, and `solve` stages).
2. Import and register the topic in [`lib/content/levels.ts`](file:///lib/content/levels.ts).
3. The platform automatically generates routes, navigation items, progress tracking, and mastery analytics without modifying React components.

---

## 📊 Transparent Mastery Formula

Mastery for each topic is calculated as a deterministic weighted score:

$$\text{Topic Mastery} = (15\% \times \text{Learn}) + (30\% \times \text{Practice}) + (25\% \times \text{Test Score}) + (30\% \times \text{Solve})$$

Overall Mastery represents the unweighted arithmetic mean of all available topic masteries:

$$\text{Overall Mastery} = \frac{1}{N} \sum_{i=1}^{N} \text{TopicMastery}_i$$

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

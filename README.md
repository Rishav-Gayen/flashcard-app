# 📚 Flashcard Study App

A state-driven flashcard application built with **vanilla JavaScript**, designed to support focused learning through intelligent card selection, mastery tracking, and history navigation.

This project emphasizes **correct application logic, predictable behavior, and clean separation of concerns** — without relying on frameworks.

---

## ✨ Features

### 🔁 Study Modes

* **Study Mode**

  * Hides mastered cards
  * Avoids showing already visited cards in the current session
  * Ends with a clear “Topic Mastered” / “All Questions Mastered” state

* **All Cards Mode**

  * Includes all cards (mastered or not)
  * Allows repetition
  * Pure random browsing / revision

---

### 🧠 Smart Card Selection

* Cards are selected **randomly only after filtering**
* Filters applied *before* randomness:

  * Category
  * Mastered status
  * Visited status (session-based)

This guarantees:

* No accidental repeats
* No infinite loops
* Deterministic correctness

---

### ✅ Mastery Tracking

* Cards can be marked as **Mastered**
* Mastered cards:

  * Are never duplicated
  * Can be hidden or shown depending on mode
* Terminal cards (e.g. *Topic Mastered*) are explicitly excluded from mastery logic

---

### ⏮️ History Navigation

* **Next** → shows a new card (or moves forward in history)
* **Previous** → navigates backward through visited cards
* History is preserved during navigation and reset on:

  * Mode change
  * Category change

This mirrors real-world UX patterns (browsers, media players).

---

### 🧱 Terminal States

When no valid cards remain:

* **Specific Category** → `Topic Mastered`
* **All Categories** → `All Questions Mastered`

These terminal cards:

* Are UI-only
* Never enter `visited` or `mastered`
* Are explicitly marked with `isTerminal`

---

## 🧩 State Architecture

```js
state = {
  category: 'All Categories',
  question: null,

  mastered: [],     // long-term knowledge
  visited: [],      // session history
  historyIndex: -1, // navigation pointer

  hideMastered: true,
  mode: 'study'     // 'study' | 'all'
}
```

### State Design Principles

* **No DOM-driven logic**
* **No random retries**
* **No string-based hacks**
* All UI behavior is derived from state

---

## 🔍 Card Selection Logic

Card selection follows this pipeline:

1. Filter by category
2. Remove mastered cards (if enabled)
3. Remove visited cards (session-based)
4. If pool is empty → return terminal card
5. Randomly select from remaining pool

Randomness is applied **last**, never used to enforce correctness.

---

## 🚫 What This App Avoids (Intentionally)

* No frameworks (React, Vue, etc.)
* No global DOM mutations
* No duplicate state cleanup hacks
* No `includes()` for object comparison
* No randomness-driven correctness

---

## 🛠️ Tech Stack

* HTML
* CSS
* Vanilla JavaScript (ES6+)

No build tools, no dependencies.

---

## 🎯 Learning Goals Achieved

This project demonstrates understanding of:

* State modeling
* Deterministic application logic
* Session vs persistent data
* History-based navigation
* UI-only vs domain data separation
* Real-world UX expectations

---

## 🚀 Possible Extensions

* Persist mastery using `localStorage`
* Add spaced repetition logic
* Migrate state to a reducer pattern
* Rebuild UI using React (logic already compatible)

---

## 📌 Final Note

This project was built to **understand how applications actually work**, not just to render UI.

If you can reason about this codebase, you can reason about any frontend framework.

---

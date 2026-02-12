# Assignment 1: The JavaScript Developer's Handbook & Capstone Integration

**Student:** Gauravi  
**Date:** February 2026

---

## Overview

This repository contains a comprehensive JavaScript reference guide written in a developer-to-developer tone, along with a fully functional capstone mini-project.

## Repository Structure

```
Assignment/
├── assignment.tex              # LaTeX source for the handbook document
├── README.md                   # This file
└── recipe-search-app/          # Capstone Mini-Project
    ├── index.html              # Main HTML page
    ├── style.css               # Styles (light/dark mode, responsive)
    └── script.js               # All JavaScript logic
```

## Part 1–3: The Handbook (LaTeX Document)

The file `assignment.tex` contains the full handbook covering:

1. **Part 1 — The Core Engine (ES6+ Fundamentals)**  
   `var` vs `let` vs `const`, arrow functions, array methods (`.map()`, `.filter()`, `.reduce()`), destructuring, spread/rest operators.

2. **Part 2 — The Interface (DOM Manipulation & Storage)**  
   Element selection, event handling, event bubbling & delegation, LocalStorage with JSON.

3. **Part 3 — The Data Flow (Asynchronous JavaScript)**  
   Event loop, callback hell, Promises, `async/await`, error handling.

4. **Part 4 — Capstone Mini-Project**  
   Description, technical requirements, and "How I Built This" section.

### Compiling the LaTeX Document

- **Option A (Recommended):** Upload `assignment.tex` to [Overleaf](https://www.overleaf.com/) and compile to PDF.
- **Option B:** Use a local LaTeX distribution (TeX Live, MiKTeX) and run:
  ```bash
  pdflatex assignment.tex
  ```

## Part 4: Capstone Mini-Project — Recipe Search App

A single-page application that lets users search for recipes using the [TheMealDB API](https://www.themealdb.com/).

### Features

- **Live API Data** — Fetches recipes from TheMealDB
- **Search** — Text search with real-time API calls
- **Category Filters** — Browse by Chicken, Beef, Seafood, Vegetarian, Dessert, Pasta
- **Dynamic DOM** — All recipe cards generated via JavaScript (no hardcoded HTML)
- **Favorites** — Save/remove favorite recipes (persisted in LocalStorage)
- **Dark Mode** — Toggle light/dark theme (persisted in LocalStorage)
- **Search History** — Last 5 searches saved as quick-access chips
- **Recipe Details** — Click any card to view full ingredients, instructions, and video link
- **Error Handling** — Friendly messages for API failures and empty results
- **Responsive** — Works on desktop, tablet, and mobile

### How to Run Locally

1. Clone this repository
2. Open `recipe-search-app/index.html` in any modern browser
3. No build tools or dependencies required — it's pure HTML, CSS, and JavaScript

### Deploying to GitHub Pages

```bash
cd recipe-search-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/recipe-search-app.git
git push -u origin main
```

Then go to **Settings → Pages → Source: main branch** → Save.

### Deploying to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy — no configuration needed

---

## Technical Requirements Checklist

| Requirement | Status |
|---|---|
| Live API data (TheMealDB) | ✅ |
| Search input triggers API call | ✅ |
| Dynamic DOM (createElement / template literals) | ✅ |
| LocalStorage (favorites, dark mode, search history) | ✅ |
| Error handling (API failure, no results) | ✅ |
| LaTeX document with all 4 parts | ✅ |
| Developer-to-developer tone | ✅ |
| Bad Way vs Pro Way code snippets | ✅ |

---

Built with ❤ by Gauravi

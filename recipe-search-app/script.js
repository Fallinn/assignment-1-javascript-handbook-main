// ============================================
// Recipe Search App - Complete JavaScript Logic
// ============================================

// --- DOM Elements ---
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const resultsGrid = document.getElementById("results");
const resultsSection = document.getElementById("resultsSection");
const resultsTitle = document.getElementById("resultsTitle");
const favoritesGrid = document.getElementById("favorites");
const favoritesSection = document.getElementById("favoritesSection");
const noFavoritesMsg = document.getElementById("noFavorites");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const searchHistoryEl = document.getElementById("searchHistory");
const modal = document.getElementById("recipeModal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModal");

// --- API Base URL ---
const API_BASE = "https://www.themealdb.com/api/json/v1/1";

// --- State ---
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
let mealCache = {}; // Cache fetched meal details: { mealId: mealObject }
let preloadedMealsByCategory = {}; // { category: [mealObjects] }
let allPreloadedMeals = []; // Flat array of all fetched meals
let isPreloading = false;

// ============================================
// Theme Management
// ============================================
const initTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.textContent = "\u2600"; // Sun
  } else {
    themeIcon.textContent = "\u263E"; // Moon
  }
};

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeIcon.textContent = isDark ? "\u2600" : "\u263E";
});

// ============================================
// Search History
// ============================================
const saveSearchHistory = (query) => {
  // Remove duplicate if exists
  searchHistory = searchHistory.filter(
    (item) => item.toLowerCase() !== query.toLowerCase()
  );
  // Add to front
  searchHistory.unshift(query);
  // Keep only last 5
  searchHistory = searchHistory.slice(0, 5);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  renderSearchHistory();
};

const renderSearchHistory = () => {
  if (searchHistory.length === 0) {
    searchHistoryEl.innerHTML = "";
    return;
  }

  searchHistoryEl.innerHTML = searchHistory
    .map(
      (term) => `
      <span class="history-chip" data-search="${term}">
        ${term}
        <span class="chip-remove" data-remove="${term}">&times;</span>
      </span>
    `
    )
    .join("");
};

// Event delegation for search history chips
searchHistoryEl.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".chip-remove");
  if (removeBtn) {
    e.stopPropagation();
    const term = removeBtn.dataset.remove;
    searchHistory = searchHistory.filter((item) => item !== term);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
    return;
  }

  const chip = e.target.closest(".history-chip");
  if (chip) {
    const term = chip.dataset.search;
    input.value = term;
    searchRecipes(term);
  }
});

// ============================================
// UI Helpers
// ============================================
const showLoading = () => {
  loadingEl.classList.remove("hidden");
  errorEl.classList.add("hidden");
  resultsSection.classList.add("hidden");
};

const hideLoading = () => {
  loadingEl.classList.add("hidden");
};

const showError = (message) => {
  hideLoading();
  resultsSection.classList.add("hidden");
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
};

const hideError = () => {
  errorEl.classList.add("hidden");
};

// ============================================
// Favorites Management
// ============================================
const isFavorite = (mealId) => {
  return favorites.some((fav) => fav.idMeal === mealId);
};

const toggleFavorite = (meal) => {
  if (isFavorite(meal.idMeal)) {
    favorites = favorites.filter((fav) => fav.idMeal !== meal.idMeal);
  } else {
    favorites.push({
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strCategory: meal.strCategory || "",
      strArea: meal.strArea || "",
    });
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
};

const renderFavorites = () => {
  if (favorites.length === 0) {
    favoritesGrid.innerHTML = "";
    noFavoritesMsg.classList.remove("hidden");
    return;
  }

  noFavoritesMsg.classList.add("hidden");
  favoritesGrid.innerHTML = favorites.map((meal) => createCardHTML(meal)).join("");
};

// ============================================
// Card Rendering
// ============================================
const createCardHTML = (meal) => {
  const favClass = isFavorite(meal.idMeal) ? "is-favorite" : "";
  const heartSymbol = isFavorite(meal.idMeal) ? "\u2764" : "\u2661";
  const category = meal.strCategory || "";
  const area = meal.strArea || "";
  const meta = [category, area].filter(Boolean).join(" \u2022 ");

  return `
    <div class="card" data-meal-id="${meal.idMeal}">
      <div class="card-image-wrapper">
        <img
          class="card-image"
          src="${meal.strMealThumb}"
          alt="${meal.strMeal}"
          loading="lazy"
        />
        ${category ? `<span class="card-category">${category}</span>` : ""}
        <button
          class="card-favorite ${favClass}"
          data-fav-id="${meal.idMeal}"
          data-fav-name="${meal.strMeal}"
          data-fav-thumb="${meal.strMealThumb}"
          data-fav-category="${category}"
          data-fav-area="${area}"
          aria-label="Toggle favorite"
        >
          ${heartSymbol}
        </button>
      </div>
      <div class="card-body">
        <h3 class="card-title">${meal.strMeal}</h3>
        ${meta ? `<p class="card-meta">${meta}</p>` : ""}
      </div>
    </div>
  `;
};

const displayRecipes = (meals, title = "Search Results") => {
  hideLoading();
  hideError();
  resultsTitle.textContent = title;
  resultsSection.classList.remove("hidden");
  resultsGrid.innerHTML = meals.map((meal) => createCardHTML(meal)).join("");
};

// ============================================
// API Calls
// ============================================
const searchRecipes = async (query) => {
  showLoading();

  try {
    const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.meals) {
      showError(`No recipes found for "${query}". Try a different search term.`);
      return;
    }

    saveSearchHistory(query);
    displayRecipes(data.meals, `Results for "${query}"`);
  } catch (error) {
    console.error("Search error:", error);
    showError(
      "Something went wrong while searching. Please check your internet connection and try again."
    );
  }
};

const searchByCategory = async (category) => {
  // If we have pre-loaded data for this category, use it
  if (category === "All" && allPreloadedMeals.length > 0) {
    displayRecipes(allPreloadedMeals, `All Recipes (${allPreloadedMeals.length})`);
    return;
  }

  if (preloadedMealsByCategory[category] && preloadedMealsByCategory[category].length > 0) {
    const meals = preloadedMealsByCategory[category];
    displayRecipes(meals, `${category} Recipes (${meals.length})`);
    return;
  }

  // Fallback to API call if pre-loaded data not available
  showLoading();

  try {
    const response = await fetch(
      `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.meals) {
      showError(`No recipes found in the "${category}" category.`);
      return;
    }

    displayRecipes(data.meals, `${category} Recipes`);
  } catch (error) {
    console.error("Category search error:", error);
    showError(
      "Something went wrong while loading this category. Please try again."
    );
  }
};

// ============================================
// Batch Fetch Pre-loaded Meals from data.js
// ============================================
const fetchMealById = async (mealId) => {
  // Return from cache if available
  if (mealCache[mealId]) return mealCache[mealId];

  try {
    const response = await fetch(`${API_BASE}/lookup.php?i=${mealId}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
      mealCache[mealId] = data.meals[0];
      return data.meals[0];
    }
    return null;
  } catch {
    return null;
  }
};

// Fetch meals in small batches to avoid overwhelming the API
const fetchBatch = async (ids, batchSize = 5) => {
  const results = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(id => fetchMealById(id)));
    results.push(...batchResults.filter(Boolean));
  }
  return results;
};

const loadAllPreloadedMeals = async () => {
  if (isPreloading) return;
  isPreloading = true;
  showLoading();

  try {
    // Get unique IDs from data.js
    const uniqueIds = UNIQUE_MEAL_IDS;
    const totalCount = uniqueIds.length;
    let loadedCount = 0;

    // Update loading message with progress
    const loadingText = loadingEl.querySelector("p");

    // Fetch all unique meals in batches
    for (let i = 0; i < uniqueIds.length; i += 5) {
      const batch = uniqueIds.slice(i, i + 5);
      const batchResults = await Promise.all(batch.map(id => fetchMealById(id)));
      loadedCount += batch.length;
      loadingText.textContent = `Loading recipes... (${loadedCount}/${totalCount})`;
    }

    // Organize by category from MEAL_DATA
    for (const [category, ids] of Object.entries(MEAL_DATA)) {
      preloadedMealsByCategory[category] = ids
        .map(id => mealCache[id])
        .filter(Boolean);
    }

    // Build flat list of all unique meals
    allPreloadedMeals = Object.values(mealCache);

    hideLoading();
    loadingText.textContent = "Searching for delicious recipes...";

    // Display all recipes by default
    displayRecipes(allPreloadedMeals, `All Recipes (${allPreloadedMeals.length})`);
  } catch (error) {
    console.error("Preload error:", error);
    hideLoading();
    showError("Could not load recipes. Please refresh the page.");
  }

  isPreloading = false;
};

const fetchMealDetails = async (mealId) => {
  // Use cache if available
  if (mealCache[mealId]) return mealCache[mealId];

  try {
    const response = await fetch(`${API_BASE}/lookup.php?i=${mealId}`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      return null;
    }

    mealCache[mealId] = data.meals[0];
    return data.meals[0];
  } catch (error) {
    console.error("Detail fetch error:", error);
    return null;
  }
};

// ============================================
// Modal (Recipe Detail View)
// ============================================
const getIngredients = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() : ""} ${ingredient.trim()}`);
    }
  }
  return ingredients;
};

const openModal = async (mealId) => {
  const meal = await fetchMealDetails(mealId);

  if (!meal) {
    showError("Could not load recipe details. Please try again.");
    return;
  }

  const ingredients = getIngredients(meal);
  const tags = [meal.strCategory, meal.strArea].filter(Boolean);

  modalBody.innerHTML = `
    <img class="modal-image" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <h2 class="modal-title">${meal.strMeal}</h2>
    <div class="modal-meta">
      ${tags.map((tag) => `<span class="modal-tag">${tag}</span>`).join("")}
    </div>

    <h3 class="modal-section-title">Ingredients</h3>
    <ul class="modal-ingredients">
      ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
    </ul>

    <h3 class="modal-section-title">Instructions</h3>
    <p class="modal-instructions">${meal.strInstructions || "No instructions available."}</p>

    ${
      meal.strYoutube
        ? `<a class="modal-video-link" href="${meal.strYoutube}" target="_blank" rel="noopener">
            &#9654; Watch Video Tutorial
          </a>`
        : ""
    }
  `;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
};

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// ============================================
// Event Delegation for Cards
// ============================================
const handleCardInteraction = (e) => {
  // Handle favorite button click
  const favBtn = e.target.closest(".card-favorite");
  if (favBtn) {
    e.stopPropagation();
    const mealData = {
      idMeal: favBtn.dataset.favId,
      strMeal: favBtn.dataset.favName,
      strMealThumb: favBtn.dataset.favThumb,
      strCategory: favBtn.dataset.favCategory,
      strArea: favBtn.dataset.favArea,
    };
    toggleFavorite(mealData);
    // Re-render results to update heart icons
    const allCards = resultsGrid.querySelectorAll(".card");
    if (allCards.length > 0) {
      // Update just the heart button in results
      resultsGrid
        .querySelectorAll(`.card-favorite[data-fav-id="${mealData.idMeal}"]`)
        .forEach((btn) => {
          const isFav = isFavorite(mealData.idMeal);
          btn.classList.toggle("is-favorite", isFav);
          btn.textContent = isFav ? "\u2764" : "\u2661";
        });
    }
    return;
  }

  // Handle card click (open modal)
  const card = e.target.closest(".card");
  if (card) {
    const mealId = card.dataset.mealId;
    openModal(mealId);
  }
};

resultsGrid.addEventListener("click", handleCardInteraction);
favoritesGrid.addEventListener("click", handleCardInteraction);

// ============================================
// Form Submission
// ============================================
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) {
    searchRecipes(query);
  }
});

// ============================================
// Category Button Clicks
// ============================================
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active state
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;
    if (category === "All") {
      if (allPreloadedMeals.length > 0) {
        displayRecipes(allPreloadedMeals, `All Recipes (${allPreloadedMeals.length})`);
      } else {
        loadAllPreloadedMeals();
      }
    } else {
      searchByCategory(category);
    }
  });
});

// ============================================
// Initialize App
// ============================================
const init = () => {
  initTheme();
  renderSearchHistory();
  renderFavorites();

  // Restore last search if available
  const lastSearch = searchHistory[0];
  if (lastSearch) {
    input.value = lastSearch;
  }

  // Load all pre-loaded meals on startup
  if (typeof MEAL_DATA !== "undefined" && typeof UNIQUE_MEAL_IDS !== "undefined") {
    loadAllPreloadedMeals();
  }
};

init();

import { getRecipeHTML } from "./recipeRenderer.js";

const main = document.getElementById("main");
const favoriteEmpty = document.getElementById("favorite__empty");
let favoriteRecipeIcon;

// function that detecs whether localStorage is both supported and available:

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

export function saveRecipeToStorage(recipeObj) {
  if (storageAvailable("localStorage")) {
    localStorage.setItem("recipe", JSON.stringify(recipeObj));
  } else {
    console.warn("localStorage is not available");
  }
}

export function loadRecipeFromStorage() {
  const recipeObj = localStorage.getItem("recipe");
  return recipeObj ? JSON.parse(recipeObj) : null;
}

function createFavoriteRecipeElement(recipe) {
  // create html elements for recipe
  const recipeSectionFavorite = document.createElement("section");
  const recipeImg = document.createElement("img");
  const recipeName = document.createElement("h1");
  const recipeCategory = document.createElement("span");
  const recipeDetails = document.createElement("details");
  const recipeDetailsSummary = document.createElement("summary");
  const recipeIngredients = document.createElement("h2");
  const recipeInstructions = document.createElement("h2");
  const recipeIngredientsList = document.createElement("ul");
  const recipeInstructionsList = document.createElement("ol");
  favoriteRecipeIcon = document.createElement("i");

  // add css classes to html elements
  recipeSectionFavorite.classList.add("recipe__favorite");

  favoriteRecipeIcon.classList.add(
    "fa-regular",
    "fa-heart",
    "favorite-icon",
    "recipe__favorite-icon"
  );
  favoriteRecipeIcon.setAttribute("role", "button");
  favoriteRecipeIcon.setAttribute("tabindex", "0");
  favoriteRecipeIcon.setAttribute("data-id", recipe.idMeal);

  recipeImg.classList.add("recipe__img", "recipe__img--favorite");

  recipeName.classList.add("recipe__name", "recipe__name--favorite");

  recipeCategory.classList.add(
    "recipe__category",
    "recipe__category--favorite"
  );

  recipeDetails.classList.add("recipe__details--favorite");

  recipeDetailsSummary.textContent = "View ingredients and instructions";

  recipeIngredients.classList.add("recipe__section-title");
  recipeIngredients.textContent = "Ingredients";

  recipeInstructions.classList.add("recipe__section-title");
  recipeInstructions.textContent = "Instructions";

  recipeIngredientsList.classList.add("recipe__ingredients-list");

  recipeInstructionsList.classList.add("recipe__instructions-list");

  recipeDetails.append(
    recipeDetailsSummary,
    recipeIngredients,
    recipeIngredientsList,
    recipeInstructions,
    recipeInstructionsList
  );

  recipeSectionFavorite.append(
    favoriteRecipeIcon,
    recipeImg,
    recipeName,
    recipeCategory,
    recipeDetails
  );

  getRecipeHTML(recipe, {
    recipeImg,
    recipeName,
    recipeCategory,
    recipeIngredientsList,
    recipeInstructionsList,
  });

  updateFavoriteIcon(favoriteRecipeIcon, true);
  return recipeSectionFavorite;
}

const recipes = loadRecipeFromStorage();
isEmpty(recipes);

if (Array.isArray(recipes) && recipes.length) {
  recipes.forEach((recipe) => {
    if (recipe && main) {
      const recipeElement = createFavoriteRecipeElement(recipe);
      main.insertAdjacentElement("afterbegin", recipeElement);
    }
  });
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.id) {
    if (e.target.classList.contains("fa-solid")) {
      updateFavoriteIcon(e.target, false);
      updateRecipeFromLocalStorage(e.target.dataset.id, false);
    } else {
      updateFavoriteIcon(e.target, true);
      updateRecipeFromLocalStorage(e.target.dataset.id, true);
    }
  }
});

function isEmpty() {
  if (favoriteEmpty) {
    if (Array.isArray(recipes) && recipes.length > 0) {
      favoriteEmpty.style.display = "none";
    } else {
      favoriteEmpty.style.display = "flex";
    }
  }
}

const copiedLocalStorage = loadRecipeFromStorage();

function updateRecipeFromLocalStorage(favoriteRecipeId, shouldAddToFavorites) {
  let index;

  if (!shouldAddToFavorites) {
    index = copiedLocalStorage.findIndex((recipe) => {
      return recipe.idMeal === favoriteRecipeId;
    });
    copiedLocalStorage.splice(index, 1);
  } else if (shouldAddToFavorites) {
    index = recipes.findIndex((recipe) => recipe.idMeal === favoriteRecipeId);
    const item = recipes.find((recipe) => recipe.idMeal === favoriteRecipeId);
    copiedLocalStorage.splice(index, 0, item);
  }
  saveRecipeToStorage(copiedLocalStorage);
}

function updateFavoriteIcon(iconElement, isFavorite) {
  iconElement.classList.toggle("fa-solid", isFavorite);
  iconElement.classList.toggle("fa-regular", !isFavorite);
}

import { getRecipeHTML } from "./recipeRenderer.js";

const main = document.getElementById("main");
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

function loadRecipeFromStorage() {
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

  recipeImg.classList.add("recipe__img", "recipe__img--favorite");
  // de adaugat alt

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

  return recipeSectionFavorite;
}

const recipes = loadRecipeFromStorage();

if (Array.isArray(recipes) && recipes.length) {
  recipes.forEach((recipe) => {
    const recipeElement = createFavoriteRecipeElement(recipe);
    if (main) {
      main.insertAdjacentElement("afterbegin", recipeElement);
    }
  });
}

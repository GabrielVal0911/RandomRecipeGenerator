import { saveRecipeToStorage } from "./favorite-recipes.js";
import { getRecipeHTML } from "./recipeRenderer.js";

// gets elements from html
const buttonGenerate = document.getElementById("button--generate");
const mainPageDescription = document.getElementById("mainPage__description");
const mainIntroductionPage = document.getElementById("main__introductionPage");
const mainPageImg = document.getElementById("mainPage--img");
const containerCategory = document.getElementById("container__category");
const recipeCategories = document.querySelectorAll(".category");
const loader = document.getElementById("loader");
const loaderOverlay = document.getElementById("loader-overlay");
let datasetCategory = "anything";
const favorites = [];
let copyRecipeObj = "";

// create html elements
const recipeSection = document.createElement("section");
const recipeImg = document.createElement("img");
const recipeName = document.createElement("h1");
const recipeCategory = document.createElement("span");
const recipeIngredients = document.createElement("h2");
const recipeInstructions = document.createElement("h2");
const recipeIngredientsList = document.createElement("ul");
const recipeInstructionsList = document.createElement("ol");
const favoriteRecipeIcon = document.createElement("i");

// add css classes to html elements
recipeSection.classList.add("recipe");
addHiddenClass(recipeSection);

favoriteRecipeIcon.classList.add(
  "fa-regular", // fa-solid
  "fa-heart",
  "favorite-icon"
);

favoriteRecipeIcon.setAttribute("role", "button");
favoriteRecipeIcon.setAttribute("tabindex", "0");

recipeImg.classList.add("recipe__img");

recipeName.classList.add("recipe__name");

recipeCategory.classList.add("recipe__category");

recipeIngredients.classList.add("recipe__section-title");
recipeIngredients.textContent = "Ingredients";

recipeIngredientsList.classList.add("recipe__ingredients-list");

recipeInstructions.classList.add("recipe__section-title");
recipeInstructions.textContent = "Instructions";

recipeInstructionsList.classList.add("recipe__instructions-list");

// Append all html elements to the recipeSection
recipeSection.append(
  favoriteRecipeIcon,
  recipeImg,
  recipeName,
  recipeCategory,
  recipeIngredients,
  recipeIngredientsList,
  recipeInstructions,
  recipeInstructionsList
);

// Insert recipeSection to the main element in HTML
if (containerCategory) {
  containerCategory.insertAdjacentElement("afterend", recipeSection);
}

const htmlElements = {
  recipeImg,
  recipeName,
  recipeCategory,
  recipeIngredientsList,
  recipeInstructionsList,
};

async function getRecipe() {
  const urlRandomRecipe = "https://www.themealdb.com/api/json/v1/1/random.php";
  const urlCategoryRecipe = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${datasetCategory}`;

  try {
    if (datasetCategory === "anything") {
      const recipe = await fetchJSON(urlRandomRecipe);
      hideLoader();
      getRecipeHTML(recipe.meals[0], htmlElements);
      copyRecipeObj = { ...recipe.meals[0] };
    } else {
      const recipe = await fetchJSON(urlCategoryRecipe);
      if (!recipe.meals || recipe.meals.length === 0)
        throw new Error("No meals found!");
      const randomMeal = Math.floor(Math.random() * recipe.meals.length);

      const fullMeal = await fetchJSON(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.meals[randomMeal].idMeal}`
      );
      hideLoader();
      getRecipeHTML(fullMeal.meals[0], htmlElements);
      copyRecipeObj = { ...fullMeal.meals[0] };
    }
  } catch (error) {
    const errorMessage = mainIntroductionPage.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
    const p = document.createElement("p");
    p.classList.add("error-message");
    p.textContent =
      "There was a problem loading the recipe. Here's a backup one for you!";

    if (recipeSection) {
      recipeSection.insertAdjacentElement("afterbegin", p);
    } else {
      mainIntroductionPage.insertAdjacentElement("afterbegin", p);
    }

    const fallbackRecipe = {
      idMeal: "52771",
      strMeal: "Spicy Arrabiata Penne",
      strMealAlternate: null,
      strCategory: "Vegetarian",
      strArea: "Italian",
      strInstructions:
        "Bring a large pot of water to a boil. Add kosher salt to the boiling water, then add the pasta. Cook according to the package instructions, about 9 minutes.\r\nIn a large skillet over medium-high heat, add the olive oil and heat until the oil starts to shimmer. Add the garlic and cook, stirring, until fragrant, 1 to 2 minutes. Add the chopped tomatoes, red chile flakes, Italian seasoning and salt and pepper to taste. Bring to a boil and cook for 5 minutes. Remove from the heat and add the chopped basil.\r\nDrain the pasta and add it to the sauce. Garnish with Parmigiano-Reggiano flakes and more basil and serve warm.",
      strMealThumb:
        "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
      strTags: "Pasta,Curry",
      strIngredient1: "penne rigate",
      strIngredient2: "olive oil",
      strIngredient3: "garlic",
      strIngredient4: "chopped tomatoes",
      strIngredient5: "red chilli flakes",
      strIngredient6: "italian seasoning",
      strIngredient7: "basil",
      strIngredient8: "Parmigiano-Reggiano",
      strMeasure1: "1 pound",
      strMeasure2: "1/4 cup",
      strMeasure3: "3 cloves",
      strMeasure4: "1 tin ",
      strMeasure5: "1/2 teaspoon",
      strMeasure6: "1/2 teaspoon",
      strMeasure7: "6 leaves",
      strMeasure8: "sprinkling",
    };
    hideLoader();
    getRecipeHTML(fallbackRecipe, htmlElements);
    console.error("API error:", error.message);
  }
}

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

function clearRecipesLists() {
  recipeIngredientsList.innerHTML = "";
  recipeInstructionsList.innerHTML = "";
}

function hideLoader() {
  addHiddenClass(loader);
  addHiddenClass(loaderOverlay);
}

function showLoader() {
  loader.classList.remove("hidden");
  loaderOverlay.classList.remove("hidden");
}

function addHiddenClass(element) {
  element.classList.add("hidden");
}

function removeHiddenClass(element) {
  element.classList.remove("hidden");
}

buttonGenerate.addEventListener("click", function () {
  mainPageImg.style.display = "none";
  mainPageDescription.style.gridColumn = "1 / -1";
  // mainPageDescription.style.textAlign = "center";
  // recipeSection.classList.add("hidden");
  mainPageDescription.classList.add("mainPage__description--centerText");
  addHiddenClass(recipeSection);
  showLoader();
  clearRecipesLists();
  removeHiddenClass(recipeSection);
  getRecipe();
  favoriteRecipeIcon.classList.remove("fa-solid");
  favoriteRecipeIcon.classList.add("fa-regular");
  saveRecipeToStorage(removeDuplicateObjects(favorites));
});

containerCategory.addEventListener("click", function (e) {
  e.preventDefault();

  const parent = e.target.closest(".category");
  if (!parent) return;

  const activeCategory = containerCategory.querySelector(".category.active");
  if (activeCategory) activeCategory.classList.remove("active");

  parent.classList.add("active");
  datasetCategory = parent.dataset.category;
});

favoriteRecipeIcon.addEventListener("click", function () {
  favoriteRecipeIcon.classList.toggle("fa-regular");
  favoriteRecipeIcon.classList.toggle("fa-solid");
  if (favoriteRecipeIcon.classList.contains("fa-solid")) {
    favorites.push(copyRecipeObj);
    console.log("yes");
  } else {
    favorites.pop(copyRecipeObj);
    console.log("no");
  }
});

function removeDuplicateObjects(arr) {
  const uniqueMap = new Map();

  for (const recipe of arr) {
    if (!uniqueMap.has(recipe.idMeal)) {
      uniqueMap.set(recipe.idMeal, recipe);
    }
  }

  return Array.from(uniqueMap.values());
}

// verify if recipe obj it's the same with details of my displayed recipe container

// gets elements from html
const buttonGenerate = document.getElementById("button--generate");
const mainPageDescription = document.getElementById("mainPage__description");
const mainIntroductionPage = document.getElementById("main__introductionPage");
const mainPageImg = document.getElementById("mainPage--img");

// create html elements
const recipeSection = document.createElement("section");
const recipeImg = document.createElement("img");
const recipeName = document.createElement("h1");
const recipeCategory = document.createElement("span");
const recipeIngredients = document.createElement("h2");
const recipeInstructions = document.createElement("h2");
const recipeIngredientsList = document.createElement("ul");
const recipeInstructionsList = document.createElement("ol");

// add css classes to html elements
recipeSection.classList.add("recipe");
recipeSection.classList.add("hidden");

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
  recipeImg,
  recipeName,
  recipeCategory,
  recipeIngredients,
  recipeIngredientsList,
  recipeInstructions,
  recipeInstructionsList
);

// Insert recipeSection to the main element in HTML
mainPageDescription.insertAdjacentElement("afterend", recipeSection);

async function getRecipe() {
  const url = "https://www.themealdb.com/api/json/v1/1/random.php";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const recipe = await response.json();
    getRecipeHTML(recipe.meals[0]);
  } catch (error) {
    const p = document.createElement("p");
    p.classList.add("error-message");
    p.textContent =
      "There was a problem loading the recipe. Here's a backup one for you!";

    mainIntroductionPage.insertAdjacentElement("afterbegin", p);

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
    getRecipeHTML(fallbackRecipe);

    console.error("API error:", error.message);
  }
}

function getRecipeHTML(recipe) {
  // get all keys from recipe object
  // initialize empty arrays for ingredients key
  const recipeObjKeys = Object.keys(recipe);
  let measureKeys = [];
  let ingredientKeys = [];

  recipeImg.src = recipe.strMealThumb;

  recipeName.textContent = recipe.strMeal;

  recipeCategory.textContent = recipe.strCategory;

  // Iterate over the recipe keys and add the ingredients and measures keys in the  empty arrays.
  recipeObjKeys.forEach((key) => {
    if (key.includes("strIngredient")) {
      ingredientKeys.push(key);
    }
    if (key.includes("strMeasure")) {
      measureKeys.push(key);
    }
  });

  // Iterate over the ingredient keys.
  // If the recipe object has the current ingredient key,
  // create an <li> element, add a CSS class, set its textContent
  // to the ingredient's value and its corresponding measure,
  // and append the <li> to the <ul>.

  for (let i = 0; i < ingredientKeys.length; i++) {
    if (recipe[ingredientKeys[i]]) {
      const recipeIngredientsItem = document.createElement("li");
      recipeIngredientsItem.classList.add("recipe__ingredients-item");
      recipeIngredientsItem.textContent = `${recipe[ingredientKeys[i]]} - ${
        recipe[measureKeys[i]]
      } `;
      recipeIngredientsList.append(recipeIngredientsItem);
      // make a function for both ingredients and instructions to avoid duplicate code
    }
  }

  // Take the string and separate them after that sequence "\r\n"
  // Remove empty spaces
  const instructions = recipe.strInstructions
    .split("\r\n")
    .filter((instruction) => instruction);

  // Iterate over the instrutions array
  // create an <li> element, add a CSS class, set its textContent
  // and append the <li> to the <ul>
  instructions.forEach((instruction) => {
    const recipeInstructionsItem = document.createElement("li");
    recipeInstructionsItem.classList.add("recipe__instruction-item");
    recipeInstructionsItem.textContent = instruction;
    recipeInstructionsList.append(recipeInstructionsItem);
  });

  recipeSection.classList.remove("hidden");
}

function clearRecipesLists() {
  recipeIngredientsList.innerHTML = "";
  recipeInstructionsList.innerHTML = "";
}

buttonGenerate.addEventListener("click", function () {
  mainPageImg.style.display = "none";
  mainPageDescription.style.gridColumn = "1 / -1";
  // mainPageDescription.style.textAlign = "center";

  clearRecipesLists();
  getRecipe();
});

// verify if recipe obj it's the same with details of my displayed recipe container

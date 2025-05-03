const buttonGenerate = document.getElementById("button--generate");
const mainPageDescription = document.getElementById("mainPage__description");

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
    // add a function in case api doesnt work
    console.error(error.message);
  }
}

getRecipe();

function getRecipeHTML(recipe) {
  // get all keys from recipe object
  // initialize empty arrays for ingredients key
  const recipeObjKeys = Object.keys(recipe);
  let measureKeys = [];
  let ingredientKeys = [];

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

  recipeImg.classList.add("recipe__img");
  recipeImg.src = recipe.strMealThumb; // change soon

  recipeName.classList.add("recipe__name");
  recipeName.textContent = recipe.strMeal; // change soon

  recipeCategory.classList.add("recipe__category");
  recipeCategory.textContent = recipe.strCategory; // change soon

  recipeIngredients.classList.add("recipe__section-title");
  recipeIngredients.textContent = "Ingredients";

  recipeIngredientsList.classList.add("recipe__ingredients-list");

  recipeInstructions.classList.add("recipe__section-title");
  recipeInstructions.textContent = "Instructions";

  recipeInstructionsList.classList.add("recipe__instructions-list");

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
}

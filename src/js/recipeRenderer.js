export function getRecipeHTML(recipe, elements) {
  const {
    recipeImg,
    recipeName,
    recipeCategory,
    recipeIngredientsList,
    recipeInstructionsList,
  } = elements;
  // get all keys from recipe object
  // initialize empty arrays for ingredients key
  const recipeObjKeys = Object.keys(recipe);
  let measureKeys = [];
  let ingredientKeys = [];

  recipeImg.src = recipe.strMealThumb;
  recipeImg.alt = recipe.strMeal;

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
  // Remove numbers if they have
  // Remove empty spaces
  const instructions = recipe.strInstructions
    .split("\r\n")
    .map((instruction) => {
      return instruction.replace(/^\d+\s*[\.\-]?\s*/, "");
    })
    .filter((instruction) => instruction.trim() !== "");

  // Iterate over the instrutions array
  // create an <li> element, add a CSS class, set its textContent
  // and append the <li> to the <ul>
  instructions.forEach((instruction) => {
    const recipeInstructionsItem = document.createElement("li");
    recipeInstructionsItem.classList.add("recipe__instruction-item");
    recipeInstructionsItem.textContent = instruction;
    recipeInstructionsList.append(recipeInstructionsItem);
  });
}

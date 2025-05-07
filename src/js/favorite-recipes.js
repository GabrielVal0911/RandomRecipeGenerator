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

console.log(loadRecipeFromStorage());

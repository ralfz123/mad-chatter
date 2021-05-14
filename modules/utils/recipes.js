const recipes = [];

// add recipes to list
function AddRecipe(room, likedRecipes) {
  const recipe = { room, likedRecipes };

  recipes.push(recipe);

  return recipes;
}

// Get current recipe
function getCurrentRecipe(id) {
  return recipes.find((user) => user.id === id);
}

// User deletes recipe
function deleteRecipe(id) {
  const index = recipes.findIndex((user) => user.id === id);

  if (index !== -1) {
    return recipes.splice(index, 1)[0];
  }
}

// Get room recipes
function getRoomRecipes(room) {
  return recipes.filter((recipes) => recipes.room === room);
}

module.exports = {
  AddRecipe,
  getCurrentRecipe,
  deleteRecipe,
  getRoomRecipes,
};

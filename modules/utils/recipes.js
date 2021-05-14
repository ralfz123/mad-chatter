const recipes = [];

// Join user to chat
function AddRecipe(room, likedRecipes) {
  const recipe = { room, likedRecipes };

  recipes.push(recipe);

  return recipes;
}

// Get current user
function getCurrentRecipe(id) {
  return recipes.find((user) => user.id === id);
}

// User leaves chat
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

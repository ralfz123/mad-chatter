/**
 * The API endpoint of recipes on 1 query (ingredient)
 *
 */
const endpointIngr = 'https://themealdb.com';
const pathIngr = '/api/json/v1/1/search.php';
const queryPathIngr = '?s=';
const urlIngr = `${endpointIngr}${pathIngr}${queryPathIngr}`;

/**
 * The API endpoint of 1 recipe on 1 query (recipe ID)
 *
 */
const endpointRecipe = 'https://themealdb.com';
const pathRecipe = '/api/json/v1/1/lookup.php';
const queryPathRecipe = '?i=';
const urlRec = `${endpointRecipe}${pathRecipe}${queryPathRecipe}`;

module.exports = { urlIngr, urlRec };

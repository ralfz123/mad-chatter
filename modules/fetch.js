const fetch = require('node-fetch');
const filterData = require('./filter.js');

/**
 * Fetch data and parses it to JSON
 *
 * @param {string} endpoint url
 * @return {string} jsonData
 *
 */

async function fetchData(url) {
  const dataResponse = await fetch(url);
  const jsonData = await dataResponse.json();
  return jsonData;
}

/**
 * Get data of recipes of the requested ingredient
 *
 * @param {string} endpoint url
 * @return {string} checked data
 *
 */

async function getData(query) {
  if (typeof query === 'number') {
    console.log('check');
  }
  queryChecker(query);

  function queryChecker(query) {
    if (query === '') {
      query = 'All';
    } else {
      query;
    }
    return query;
  }

  const queryIngredients = query;

  // API endpoint by ingredients query
  const urlIngredients = `https://themealdb.com/api/json/v1/1/search.php?s=${queryIngredients}`;

  const dataRecipes = await fetchData(urlIngredients);

  if (dataRecipes.meals === null) {
    console.log('No data');
    return null;
  } else {
    // Filter data
    const filteredData = filterData(dataRecipes.meals);
    return filteredData;
  }
}

/**
 * Get data of the chosen recipe
 *
 * @param {string} jsonData - Dirty data
 * @return {string} jsonData - Clean data
 *
 */

async function getRecipeData(id) {
  const queryRecipe = id;

  // API endpoint by recipe query
  const urlRecipe = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${queryRecipe}`;

  const dataRecipe = await fetchData(urlRecipe);

  if (dataRecipe.meals === null) {
    console.log('dit is null');
    return null;
  } else {
    // Filter data
    const filteredData = filterData(dataRecipe.meals);
    return filteredData;
  }
}

module.exports = { getData, getRecipeData };

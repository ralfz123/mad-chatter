const fetch = require('node-fetch');
const filterData = require('./filter.js');

async function fetchData(url) {
  const dataResponse = await fetch(url);
  const jsonData = await dataResponse.json();
  return jsonData;
}

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

async function getRecipeDatas(id) {
  const queryRecipe = id;

  // API endpoint by ingredients query
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

module.exports = { getData, getRecipeDatas };

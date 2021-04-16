const fetch = require('node-fetch');
const filterData = require('./filter.js');

async function fetchData(url) {
  const dataResponse = await fetch(url);
  const jsonData = await dataResponse.json();
  return jsonData;
}

async function getData(query) {
  queryChecker(query);

  function queryChecker(query) {
    if (query === '') {
      query = 'All';
    } else {
      query;
    }
    return query;
  }
  console.log('query: ', query);

  const queryIngredients = query;

  // API endpoint by ingredients query
  const urlIngredients = `https://themealdb.com/api/json/v1/1/search.php?s=${queryIngredients}`;

  const dataRecipes = await fetchData(urlIngredients);

  if (dataRecipes.meals === null) {
    console.log('dit is null');
    return null;
  } else {
    // console.log('All fetched data: ', dataRecipes);

    // Filter data
    const filteredData = filterData(dataRecipes.meals);
    return filteredData;
  }
}

module.exports = getData;

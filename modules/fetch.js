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
      query = 'Cheese';
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
  console.log('All fetched data: ', dataRecipes);

  // Filter data
  const filteredData = filterData(dataRecipes.meals);

  return filteredData;
}

module.exports = getData;

// Cookbook API
// fetch('https://mycookbook-io1.p.rapidapi.com/recipes/rapidapi', {
//   method: 'GET',
//   headers: {
//     'content-type': 'text/plain',
//     'x-rapidapi-key': '3cc7aa52b1msh7d0d64cd31dabd6p1145c9jsn76dfd8cdb3dc',
//     'x-rapidapi-host': 'mycookbook-io1.p.rapidapi.com',
//   },
//   body:
//     'https://www.jamieoliver.com/recipes/vegetables-recipes/superfood-salad/',
// })
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

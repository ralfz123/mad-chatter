// used fetch example, has to rewrite to this project

const fetch = require('node-fetch');
const urlCats = 'https://api.thecatapi.com/v1/images/search';
const { filterCatData } = require('./filter.js');

async function fetchData(url) {
  const dataResponse = await fetch(url);
  const jsonData = await dataResponse.json();
  return jsonData;
}

async function getData() {
  const dataCats = await fetchData(urlCats);

  // Filter data
  const filteredDataCat = filterCatData(dataCats);

  return filteredDataCat;
}

module.exports = getData;

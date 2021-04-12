const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

app.use(express.static('public'));

const fetch = require('node-fetch');

// require('dotenv').config();
// const apiKey = process.env.KEY;
// const urlSpoonacular = `https://api.spoonacular.com/food/recipe/search?query=tomato&apiKey=${apiKey}`;

// 1. Destructure API

// example queries
const queryIngredients = 'tomato';
// const queryMeals = 'Kapsalon';

// API endpoint by ingredients query
const urlIngredients = `https://themealdb.com/api/json/v1/1/search.php?s=${queryIngredients}`;

// API endpoint by meals query
// const urlMeals = `https://themealdb.com/api/json/v1/1/${query}`;

// async function fetchData(url) {
//   const dataResponse = await fetch(url);
//   const jsonData = await dataResponse.json();
//   return jsonData;
// }

// async function getData() {
//   const receivedData = await fetchData(urlIngredients);

//   return receivedData;

//   // // Filter data
//   // const filteredDataCat = filterCatData(dataCats);

//   // return filteredDataCat;
// }

app.get('/', async function (req, res) {
  fetch(urlIngredients)
    .then((response) => response.json())
    .then((data) => res.render('index.ejs', { data: data.meals }))
    .catch((err) => {
      console.error(err);
    });

  // await getData()
  //   .then((data) => {
  //     console.log(data.meals[0]);
  //     res.render('index.ejs', data);
  //   })
  //   .catch((errObject) => console.error(errObject));
});

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

io.on('connection', (socket) => {
  console.log('user connected');

  // rule:
  // io.emit('message', "this is a test"); --> sending to all clients, include sender
  // socket.emit('message', "this is a test"); --> sending to sender-client only

  //  Receiving message, emit it
  socket.on('message', (messageInfo) => {
    // console.log('message: ', messageInfo);
    io.emit('message', messageInfo);
    console.log('query ingredient: ', messageInfo.query);
    // Get data by query
    // invoke searchQueryFunction
    // Render results
  });

  // Detects when user has disconnected
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

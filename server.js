const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
const { getData, getRecipeDatas } = require('./modules/fetch.js');

app.use(express.static('public'));

app.get('/', async function getHome(req, res) {
  // get name of login and render it as data with template
  res.render('index.ejs');
});

app.get('/match', function (req, res) {
  res.render('match.ejs');
});

io.on('connection', (socket) => {
  console.log('user connected');

  // rule:
  // io.emit('message', "this is a test"); --> sending to all clients, include sender
  // socket.emit('message', "this is a test"); --> sending to sender-client only

  // Ingredient id handler
  socket.on('query', (queryInfo) => {
    io.emit('query', queryInfo);
    getQueryData(queryInfo.query);
  });

  // Chosen recipe handler
  socket.on('chosenRecipe', (recipeID) => {
    io.emit('chosenRecipe', recipeID);
    getRecipeData(recipeID);
  });

  // Message handler
  socket.on('message', (messageInfo) => {
    io.emit('message', messageInfo);
  });
  // lowercase;
  // Detects when user has disconnected
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  async function getQueryData(query) {
    // Get data by query
    let dataQuery = await getData(query);
    console.log(dataQuery);

    // return emitted data for clientside handling
    return io.emit('data', dataQuery);
  }

  async function getRecipeData(id) {
    // Get data by id
    let dataRecipe = await getRecipeDatas(id);
    // look how I did at WAFS
    console.log(dataRecipe);

    // return emitted data for clientside handling
    return io.emit('data', dataRecipe);
  }
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

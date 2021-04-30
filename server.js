const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

const { getData, getRecipeData } = require('./modules/data/fetch.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index.ejs');
});

app.get('/match/:id', async function (req, res) {
  let data = await getRecipeData(req.params.id);
  console.log(data);
  res.render('pages/match.ejs', { data: data[0] });
});

app.get('/login', function (req, res) {
  res.render('pages/login.ejs');
});

app.post('/login', async function (req, res) {
  res.redirect('/');
});

app.get('/room', function (req, res) {
  res.render('pages/room.ejs');
});

app.get('/register', function (req, res) {
  res.render('pages/register.ejs');
});

app.post('/register', async function (req, res) {
  res.redirect('/login');
});

io.on('connection', (socket) => {
  console.log('user connected');

  // Ingredient id handler
  socket.on('query', (queryInfo) => {
    io.emit('query', queryInfo);
    getQueryData(queryInfo.query);
  });

  // Chosen recipe handler
  socket.on('chosenRecipe', (recipeID) => {
    io.emit('chosenRecipe', recipeID);
    getDataOfRecipe(recipeID);
  });

  // Message handler
  socket.on('message', (messageInfo) => {
    io.emit('message', messageInfo);
  });

  // Detects when user has disconnected
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  async function getQueryData(query) {
    // Get data by query
    let dataQuery = await getData(query);

    // return emitted data for clientside handling
    return io.emit('data', dataQuery);
  }

  async function getDataOfRecipe(id) {
    // Get data by id
    let dataRecipe = await getRecipeData(id);

    // return emitted data for clientside handling for the other client
    // return socket.broadcast.emit('dataRecipe', dataRecipe);
    return io.emit('dataRecipe', dataRecipe);
  }
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

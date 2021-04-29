const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

const { getData, getRecipeData } = require('./modules/fetch.js');
const { idCreator } = require('./modules/uniqueID.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('pages/login.ejs');
});

app.post('/', async function (req, res) {
  const nickname = req.body.name;
  console.log(nickname);

  let roomId = idCreator(8);

  res.redirect(`/${roomId}`);
});

app.get('/:roomId', function (req, res) {
  let roomId = req.params.roomId;
  console.log(roomId);
  res.render('index.ejs', { id: roomId });
});

app.get('/:roomId/match/:recipeId', async function (req, res) {
  let data = await getRecipeData(req.params.recipeId);
  console.log(data);
  res.render('pages/match.ejs', { data: data[0] });
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
    console.log(recipeID);
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
    return socket.emit('dataRecipe', dataRecipe);
  }
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

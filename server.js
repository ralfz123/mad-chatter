const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
const { getData, getRecipeDatas } = require('./modules/fetch.js');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.render('index.ejs');
});

// ! Emit this data+action to the other so user X knows the state of user Y
app.post('/match', async function (req, res) {
  let data = await getRecipeData(req.body.recipeID);
  console.log(data);
  res.render('pages/match.ejs', { data: data[0] });
});

app.get('/match', function (req, res) {
  res.render('pages/match.ejs');
});

// if user LoggedIn=false, then redirect to login
app.get('/login', function (req, res) {
  res.render('pages/login.ejs');
});

app.post('/login', function (req, res) {
  console.log(`Login credentials: ${req.body.name} - ${req.body.password}`);
  res.redirect('/');
});

app.get('/register', function (req, res) {
  res.render('pages/register.ejs');
});

app.post('/register', function (req, res) {
  res.redirect('/login');
});

// look how I did at WAFS!
async function getRecipeData(id) {
  // Get data by id
  let dataRecipe = await getRecipeDatas(id);
  // goToMatch(req, res, dataRecipe);
  // return emitted data for clientside handling
  return dataRecipe;
  // return io.emit('dataRecipe', dataRecipe);
}

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
  // socket.on('chosenRecipe', (recipeID) => {
  //   io.emit('chosenRecipe', recipeID);
  //   // getRecipeData(recipeID);
  // });

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

    // return emitted data for clientside handling
    return io.emit('data', dataQuery);
  }

  // // look how I did at WAFS!
  // async function getRecipeData(id) {
  //   // Get data by id
  //   let dataRecipe = await getRecipeDatas(id);
  //   // goToMatch(req, res, dataRecipe);
  //   // return emitted data for clientside handling
  //   return io.emit('dataRecipe', dataRecipe);
  // }

  app.get('/match', function goToMatch(req, res, data) {
    console.log(data);
  });
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
const { getData, getRecipeData } = require('./modules/fetch.js');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const uuid = require('uuid').v4;

require('dotenv').config();

firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.render('index.ejs');
});

// ! Emit this data+action to the other so user X knows the state of user Y
// return io.emit('dataRecipe', dataRecipe);
app.post('/match', async function (req, res) {
  let data = await getRecipeData(req.body.recipeID);
  console.log('query data: ', data);
  res.render('pages/match.ejs', { data: data[0] });
});

app.get('/match', function (req, res) {
  res.render('pages/match.ejs');
});

// if user LoggedIn=false, then redirect to login
app.get('/login', function (req, res) {
  res.render('pages/login.ejs');
});

app.post('/login', async function (req, res) {
  console.log(`Login credentials: ${req.body.name} - ${req.body.password}`);
  res.redirect('/room');
});

app.get('/room', function (req, res) {
  res.render('pages/room.ejs');
});

app.get('/register', function (req, res) {
  res.render('pages/register.ejs');
});

app.post('/register', async function (req, res) {
  const nickname = req.body.name;
  // const password = req.body.password;

  const db = firebase.firestore();
  const data = db.collection('users');

  const snapshot = await data.where('username', '==', nickname).get();

  if (snapshot.empty) {
    await db.collection('users').doc(uuid()).set({
      username: nickname.toLowerCase(),
    });
    return res.redirect('/login');
  }

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
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

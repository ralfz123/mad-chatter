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

// ! Emit this data+action to the other so user X knows the state of user Y // return io.emit('dataRecipe', dataRecipe);
// app.post('/match/:id', async function (req, res) {
//   let checkedRecipe = req.body.recipeID;

//   let data = await getRecipeData(checkedRecipe);
//   console.log('query data: ', data);

//   // const db = firebase.firestore();
//   // const dataCollection = db.collection('users').doc(nickname);

//   // const update = await dataCollection.update({
//   //   recipe: checkedRecipe,
//   // });
//   // update;

//   res.render('pages/match.ejs', { data: data[0] });
// });

app.get('/match/:id', async function (req, res) {
  let data = await getRecipeData(req.params.id);
  console.log(data);
  res.render('pages/match.ejs', { data: data[0] });
});

// if user LoggedIn=false, then redirect to login
app.get('/login', function (req, res) {
  res.render('pages/login.ejs');
});

app.post('/login', async function (req, res) {
  const nickname = req.body.name;
  const password = req.body.password;
  console.log(nickname, password);

  const db = firebase.firestore();
  const data = db.collection('users');

  const snapshot = await data
    .where('username', '==', nickname.toLowerCase())
    .where('password', '==', password)
    .get();

  snapshot.forEach((doc) => {
    console.log(doc.data());
  });

  if (snapshot.empty) {
    console.log('No user found');
    // send alert (validate)
    res.redirect('/login');
  }

  res.redirect('/');
});

app.get('/room', function (req, res) {
  res.render('pages/room.ejs');
});

app.get('/register', function (req, res) {
  res.render('pages/register.ejs');
});

app.post('/register', async function (req, res) {
  const nickname = req.body.name;
  const password = req.body.password;

  const db = firebase.firestore();
  const data = db.collection('users');

  const snapshot = await data.where('username', '==', nickname).get();

  if (snapshot.empty) {
    await data.doc(uuid()).set({
      username: nickname.toLowerCase(),
      password: password,
    });
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

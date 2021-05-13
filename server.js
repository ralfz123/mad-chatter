const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

const { getData, getRecipeData } = require('./modules/data/fetch.js');

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./modules/utils/users.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

let recipes = [];
// let chatMessages = [];

app.get('/', function (req, res) {
  res.render('index.ejs');
});

// app.get('/match/:id', async function (req, res) {
//   let data = await getRecipeData(req.params.id);
//   console.log(data);
//   res.render('pages/match.ejs', { data: data[0] });
// });

const rooms = [
  'room-1',
  'room-2',
  'room-3',
  'room-4',
  'room-5',
  'room-6',
  'room-7',
  'room-8',
  'room-9',
  'room-10',
];

io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit('welcome', 'Hello welcome to Cooking on Remote!');

  socket.on('joinRoom', ({ room, user }) => {
    const newUser = userJoin(socket.id, user, room);

    socket.join(newUser.room);

    // welcome msg to every new user individually
    // socket.emit(
    //   'message',
    //   formatMessage(botName, 'Welcome at the Cooking On Remote application!!')
    // );

    if (rooms.includes(room)) {
      socket.join(room);
      io.in(newUser.room).emit('roomUsers', {
        room: newUser.room,
        users: getRoomUsers(newUser.room),
      });
      return (
        socket.emit(
          'joinSucces',
          `${user}, You have succesfully joined ${room}`
        ) &&
        socket.to(newUser.room).emit('userJoined', `${user} joined this room`)
      );
    } else {
      return socket.emit('joinError', 'ERROR, No Room named ' + room);
    }
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('chatMessage', { user: user.username, message: msg });
  });

  // Ingredient id handler
  socket.on('query', ({ query }) => {
    getQueryData(query);
  });

  // Chosen recipe handler - // push to array that contains all liked recipes and thereof can be chosen of.
  socket.on('likedRecipe', async (recipeID) => {
    const user = getCurrentUser(socket.id);

    let data = await getRecipeData(recipeID);
    recipes.push(data[0]); // push to global array

    io.to(user.room).emit('dataRecipe', recipes);

    // let recipe = getDataOfRecipe(recipeID);

    // // Array item contains: image (template) and ID (for fetching that recipe data from API)
    // recipes.push(recipe);
    // console.log(recipes);

    // socket.to(newUser.room).emit('userJoined', `${user} joined this room`);
    // Send data list (recipe id) to other clients (display array)
  });

  // Detects when user has disconnected
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      // message that user left
      // io.to(user.room).emit(
      //   'message',
      //   formatMessage(botName, `${user.username} has left the chat`)
      // );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  async function getQueryData(query) {
    // Get data by query
    let dataQuery = await getData(query);

    // return emitted data for clientside handling
    // return dataQuery;
    return socket.emit('queryData', dataQuery);
  }

  async function getDataOfRecipe(id) {
    // Get data by id
    let dataRecipe = await getRecipeData(id);

    // return emitted data for clientside handling for the other client
    // return socket.broadcast.emit('dataRecipe', dataRecipe);
    return socket.broadcast.emit('dataRecipe', dataRecipe);
  }
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

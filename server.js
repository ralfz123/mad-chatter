const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

const { getData, getRecipeData } = require('./modules/data/fetch.js');

const { roomsState } = require('./modules/utils/state.js');

const {
  // userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./modules/utils/users.js');

const {
  AddRecipe,
  getCurrentRecipe,
  deleteRecipe,
  getRoomRecipes,
} = require('./modules/utils/recipes.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index.ejs');
});

const rooms = [
  'room1',
  'room2',
  'room3',
  'room4',
  'room5',
  'room6',
  'room7',
  'room8',
  'room9',
  'room10',
];

const userJoin = (roomID, user) => {
  const assignRoom = roomsState[roomID];

  const userR = {
    username: user,
    id: socket.id,
  };

  const addUser = roomsState[roomID].users.push(userR);

  return assignRoom;
};
console.log(roomsState);

io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit('welcome', 'Hello welcome to Cooking on Remote!');

  socket.on('joinRoom', ({ room, user }) => {
    const newUser = userJoin(room, user);

    socket.join(room);

    if (rooms.includes(room)) {
      socket.join(room);
      io.in(room).emit('roomUsers', {
        room: newUser.id,
        users: newUser.users,
      });

      io.in(room).emit('likedRecipesList', {
        room: newUser.room,
        recipes: newUser.likedRecipes,
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
    // 1. Which room
    // 2. Send msg to clients
    // 3. Add msg to chat Array
    // 4. Save to clientjs for new users (chat history)

    const user = getCurrentUserrr(socket.id);

    // Get current user
    function getCurrentUserrr(id) {
      // return roomsState[].users.find((user) => user.id === id);
    }

    io.to(user.room).emit('chatMessage', { user: user, message: msg });
  });

  // Ingredient id handler
  socket.on('query', ({ query }) => {
    getQueryData(query);
  });

  // Chosen recipe handler - // push to array that contains all liked recipes and thereof can be chosen of.
  socket.on('likedRecipe', async (recipeID) => {
    const user = getCurrentUser(socket.id);

    let recipeData = await getRecipeData(recipeID);

    const recipes = AddRecipe(user.room, recipeData[0]);

    io.to(user.room).emit('likedRecipesList', recipes);

    // io.to(user.room).emit('likedRecipesList', {
    //   recipes: getRoomRecipes(user.room),
    // });)
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

// app.get('/match/:id', async function (req, res) {
//   let data = await getRecipeData(req.params.id);
//   console.log(data);
//   res.render('pages/match.ejs', { data: data[0] });
// });

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

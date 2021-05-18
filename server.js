const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

const { getData, getRecipeData } = require('./modules/data/fetch.js');
const {
  userJoin,
  userLeave,
  getRoomData,
  addChatMsg,
  addLikedRecipe,
  addLikedRecipesLimit,
  addWonRecipe,
  getCurrentUser,
  findCurrentRoom,
} = require('./modules/utils/stateFunctions.js');

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

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('joinRoom', ({ room, user }) => {
    //has to be username
    const newUser = userJoin(room, user, socket.id);

    socket.join(room);

    if (rooms.includes(room)) {
      socket.join(room);

      // New user gets the history data of the room
      io.to(socket.id).emit('roomData', {
        room: newUser.id,
        users: newUser.users,
        chat: newUser.chat,
        likedRecipes: newUser.likedRecipes,
        likedRecipeLimit: newUser.likedRecipeLimit,
        wonRecipe: newUser.wonRecipe,
      });

      // Welcome message
      io.to(socket.id).emit('chatMessage', {
        user: 'chatBot',
        message: `Welcome ${user} to this chat!`,
      });

      // All users gets info about the roomUsers that has updated because of a new user joined
      socket.to(room).emit('roomUsers', {
        room: newUser.id,
        users: newUser.users,
      });

      return (
        socket.emit(
          'joinSucces',
          `${user}, You have succesfully joined ${room}`
        ) && socket.to(room).emit('userJoined', `${user} joined this room`)
      );
    } else {
      return socket.emit('joinError', 'ERROR, No Room named ' + room);
    }
  });

  // Listen for chatMessage
  socket.on('chatMessage', ({ msg, room }) => {
    // 1. Which user
    const currentUser = getCurrentUser(socket.id, room);
    const currentUserName = currentUser.username;

    // 2. Send msg to clients
    io.to(room).emit('chatMessage', { user: currentUserName, message: msg });

    // 3. Add msg to chat global state for later users
    addChatMsg(msg, room, currentUser);
  });

  // Ingredient id handler
  socket.on('query', async ({ query }) => {
    // 1. Fetch data on query
    let recipesData = await getData(query);

    // 2. Send socket with data to user
    socket.emit('queryData', recipesData);
  });

  // Liked recipe handler
  socket.on('likedRecipe', async ({ recipeID, room }) => {
    // 1. Which user
    const currentUser = getCurrentUser(socket.id, room);
    // const currentUserName = currentUser.username;

    // 2. Fetch data
    let recipeData = await getRecipeData(recipeID);

    // check limit, then add recipe
    const roomData = getRoomData(room);
    const firstJoinedUser = roomData.users[0];

    // array length
    const dataRecipes = roomData.likedRecipes;

    if (dataRecipes.length === 5) {
      // Set limit state to true
      addLikedRecipesLimit(true, room);

      // Send message that limit is reached and firstUser has to choose recipe
      io.to(room).emit('alertMessageRecipe', {
        type: 'allUsers',
        msg: `There are already 5 recipes chosen. ${firstJoinedUser.username} has to choose one recipe you all are going to make!`,
        data: null,
      });

      // Send message to firstUser that he has to choose one recipe
      return io.to(firstJoinedUser.id).emit('alertMessageRecipe', {
        type: 'firstUser',
        msg: `There are already 5 recipes chosen. You, ${firstJoinedUser.username}, as first user has to choose one recipe you all are going to make!`,
        data: dataRecipes,
      });
    }

    addLikedRecipe(recipeData[0], room, currentUser.username);
    io.to(room).emit('likedRecipesList', recipeData[0]);
  });

  // Won recipe (chosen)
  socket.on('wonRecipe', async ({ recipeID, room }) => {
    // 1. Which user
    const currentUser = getCurrentUser(socket.id, room);
    // console.log(currentUser);
    const currentUserName = currentUser.username;

    // 2. Fetch data by recipe id
    let wonRecipeData = await getRecipeData(recipeID);

    // 3. Add recipe to Clients -- add msg to clients that one recipe is chosen
    io.to(room).emit('wonRecipeData', {
      user: currentUserName,
      recipe: wonRecipeData[0],
    });

    // 4. Add recipe to server global state
    addWonRecipe(wonRecipeData[0], room, currentUserName);
  });

  // Detects when user has disconnected
  socket.on('disconnect', () => {
    // 1. Which room + user
    const currentRoomId = findCurrentRoom(socket.id);
    let room = `room${currentRoomId}`;

    // 2. Delete user from array
    const user = userLeave(room, socket.id);

    if (user) {
      const roomData = getRoomData(room);
      const roomUsers = roomData.users;

      // Send users and room info
      io.to(room).emit('roomUsers', {
        room: currentRoomId,
        users: roomUsers,
      });
    }
  });
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

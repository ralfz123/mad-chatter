const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

const { getData, getRecipeData } = require('./modules/data/fetch.js');
const {
  userJoin,
  userLeave,
  getRoom,
  addChatMsg,
  addLikedRecipe,
  addWonRecipe,
  getCurrentUser,
  getCurrentUserrr,
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
  // socket.emit('welcome', 'Hello welcome to Cooking on Remote!');

  socket.on('joinRoom', ({ room, user }) => {
    const newUser = userJoin(room, user, socket.id); // remove the var decl?
    // console.log(getRoom(room));
    const roomData = getRoom(room);

    socket.join(room);

    if (rooms.includes(room)) {
      socket.join(room);

      console.log('won recipe state: ', roomData.wonRecipe);
      // New user gets the history data of the room
      io.to(socket.id).emit('roomData', {
        room: roomData.id,
        users: roomData.users,
        chat: roomData.chat,
        likedRecipes: roomData.likedRecipes,
        wonRecipe: roomData.wonRecipe,
      });

      // Welcome message
      io.to(socket.id).emit('chatMessage', {
        user: 'chatBot',
        message: `Welcome ${user} to this chat!`,
      });

      // All users gets info about the roomUsers that has updated because of a new user joined
      socket.to(room).emit('roomUsers', {
        room: roomData.id,
        users: roomData.users,
      });

      // io.to(firstJoinedUser.id).emit('alertMessageRecipe', {}

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
  socket.on('query', ({ query }) => {
    getQueryData(query);
  });

  // Liked recipe handler
  socket.on('likedRecipe', async ({ recipeID, room }) => {
    // 1. Which user
    const currentUser = getCurrentUser(socket.id, room);
    // const currentUserName = currentUser.username;

    // 2. Fetch data
    let recipeData = await getRecipeData(recipeID);

    // 4. Add recipe to server global state
    const recipesCount = addLikedRecipe(recipeData[0], room, currentUser);

    // 1b. which room
    // const roomData = getRoom(room);
    // const recipesState = roomData.likedRecipes;
    // console.log(recipesState);

    // if limit is not reached, add recipe to object
    if (recipesCount == true) {
      // 3. Add recipe to all clients
      io.to(room).emit('likedRecipesList', recipeData[0]);
    } else {
      // limit is reached, not add recipe
      const roomData = getRoom(room);
      const firstJoinedUser = roomData.users[0];

      // push recipe ID to wonRecipe object key in state

      // !push to global state so when new user joins, he gets alert that the limit is reached

      // Send to all clients from room "limit is reached" -- no to the first user!-> doesnt work yet
      io.to(room).emit('alertMessageRecipe', {
        type: 'allUsers',
        msg: `There are already 5 recipes chosen. ${firstJoinedUser.username} has to choose one recipe you all are going to make!`,

        data: null,
      });

      // Say to first joined user that he has to choose and give him a choice menu
      io.to(firstJoinedUser.id).emit('alertMessageRecipe', {
        type: 'firstUser',
        msg: `There are already 5 recipes chosen. You, ${firstJoinedUser.username}, as first user has to choose one recipe you all are going to make!`,
        data: roomData.likedRecipes,
      });
    }

    // catching chosen recipe iD
    // fetch data
  });

  // Won recipe (chosen) roomdata[roomID].likedRecipes = array with liked recipes, there is one chosen
  socket.on('wonRecipe', async ({ recipeID, room }) => {
    // 1. Which user
    const currentUser = getCurrentUser(socket.id, room);
    const currentUserName = currentUser.username;
    console.log('gekozen door: ', currentUserName);

    // 2. fetch data by recipe id
    let wonRecipeData = await getRecipeData(recipeID);
    console.log('won recipe data: ', wonRecipeData[0].id);

    // 3.   add recipe to Clients -- add msg to clients that one recipe is chosen
    io.to(room).emit('wonRecipeData', {
      user: currentUserName,
      recipe: wonRecipeData[0],
    });

    // 4. Add recipe to server global state
    addWonRecipe(wonRecipeData[0], room, currentUserName);

    // message to all clients (io.emit) "John Doe has chosen for Creame Cheese Cake"
    // render display with recipe data
    // Add to state, chosen: recipeiD + title
  });

  // Detects when user has disconnected
  socket.on('disconnect', () => {
    // 1. Which room + user
    const currentRoom = findCurrentRoom(socket.id);
    let room = `room${currentRoom}`;

    // 2. user leaves

    // 2. Delete user from array
    const user = userLeave(room, socket.id);

    // 3. Render clientside the room userslist
    socket
      .in(currentRoom)
      .emit('roomUsers', { room: currentRoom, users: user });

    // if (user) {
    //   // message that user left
    //   // io.to(user.room).emit(
    //   //   'message',
    //   //   formatMessage(botName, `${user.username} has left the chat`)
    //   // );

    //   // Send users and room info
    //   io.to(user.room).emit('roomUsers', {
    //     room: user.room,
    //     users: getRoomUsers(user.room),
    //   });

    //   socket.to(newUser.room).emit('userJoined', `${user} joined this room`);
    // }
  });

  async function getQueryData(query) {
    // Get data by query
    let dataQuery = await getData(query);

    // return emitted data for clientside handling
    return socket.emit('queryData', dataQuery);
  }

  async function getDataOfRecipe(id) {
    // Get data by id
    let dataRecipe = await getRecipeData(id);

    return dataRecipe;

    // return emitted data for clientside handling for the other client
    // return socket.broadcast.emit('dataRecipe', dataRecipe);
  }
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

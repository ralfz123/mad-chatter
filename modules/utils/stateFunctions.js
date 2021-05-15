const { roomsState } = require('./state.js');

function userJoin(roomID, user, userID) {
  const assignRoom = roomsState[roomID];

  const userObj = {
    username: user,
    id: userID,
  };

  const addUser = roomsState[roomID].users.push(userObj);

  return assignRoom;
}

function userLeave(roomID, user, userID) {
  const index = roomsState[roomID].users.findIndex(
    (user) => user.id === userID
  );

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }

  console.log(roomsState[roomID].users);
}

function getRoom(roomID) {
  const test = roomsState[roomID];
  // console.log('test:::: ', test);
  return test;
}

// Add chat
function addChatMsg(message, roomID, user) {
  const assignMsg = roomsState[roomID].chat;

  const chatObj = {
    user: user.username,
    id: user.id,
    message: message,
  };

  const addMsg = roomsState[roomID].chat.push(chatObj);

  return console.log('NEW Message: ', assignMsg);
}

// Get chat history
// function getChatHistory(userID, roomID) {
//   const users = roomsState[roomID].users;
//   return users.find((user) => user.id === userID);
// }

// Add recipe
function addLikedRecipe(recipe, roomID, user) {
  // when there are 5 recipes chosen, there must be choose by (first user/random user) for the recipe

  const assignRecipe = roomsState[roomID].likedRecipes;

  const recipeObj = {
    user: user.username,
    recipe: recipe,
  };

  const addRecipe = roomsState[roomID].likedRecipes.push(recipeObj);

  return console.log('NEW recipe: ', assignRecipe);
}

// Get liked recipes
// function getLikedRecipes(userID, roomID) {
//   const users = roomsState[roomID].users;
//   return users.find((user) => user.id === userID);
// }

// Get current user
function getCurrentUser(userID, roomID) {
  const users = roomsState[roomID].users;
  return users.find((user) => user.id === userID);
}

// Get room users
// function getRoomUsers(roomID) {
//   return users.filter((user) => user.room === room);
// }

module.exports = {
  userJoin,
  getRoom,
  addChatMsg,
  addLikedRecipe,
  getCurrentUser,
};

const { roomsState } = require('./state.js');

let globalRoom;

// Add user to their room in the state
function userJoin(roomID, user, userID) {
  const assignRoom = roomsState[roomID];
  const roomUsers = assignRoom.users;
  globalRoom = roomID;

  const userObj = {
    username: user,
    id: userID,
  };

  roomUsers.push(userObj);
  return assignRoom; // returns room data
}

// Remove user from their room in the state
function userLeave(userID) {
  // if user had joined a room

  if (globalRoom != undefined) {
    roomID = globalRoom;

    let users = roomsState[roomID].users;
    const index = users.findIndex((user) => user.id === userID);

    if (index !== -1) {
      users.splice(index, 1);
    }
    return roomID;
  } else {
    return null;
  }
}

// Get data of room
function getRoomData(roomID) {
  return roomsState[roomID];
}

// Add chat to room in the state
function addChatMsg(message, roomID, user) {
  const assignMsg = roomsState[roomID].chat;

  const chatObj = {
    user: user.username,
    id: user.id,
    message: message,
  };

  assignMsg.push(chatObj);

  // return console.log('NEW Message: ', assignMsg);
}

// Add recipe to room in the state
function addLikedRecipe(recipe, roomID, username) {
  const length = roomsState[roomID].likedRecipes.length;

  // when there liked recipes lenght = 5 , then set limit to true in the state (for new user)
  if (length >= 5) {
    // set limit
    return (roomsState[roomID].likedRecipeLimit = true);
  } else {
    // add recipe to liked recipes array
    const assignRecipe = roomsState[roomID].likedRecipes;

    const recipeObj = {
      user: username,
      recipeTitle: recipe.title,
      recipeId: recipe.id,
      recipeImage: recipe.preview,
    };
    assignRecipe.push(recipeObj);
  }
  return;
}

// Add the liked recipes limit to the state
function addLikedRecipesLimit(value, roomID) {
  roomsState[roomID].likedRecipeLimit = value;
}

// Add won recipe to the state
function addWonRecipe(wonRecipe, roomID, user) {
  const recipeObj = {
    recipe: wonRecipe,
    user: user,
  };
  roomsState[roomID].wonRecipe.push(recipeObj);
  // console.log(roomsState[roomID].wonRecipe[0]);
}

/**
 * Get data of current user
 *
 * @param {Number} userID
 * @param {Number} roomID
 * @return {Object} user data
 *
 */

function getCurrentUser(userID, roomID) {
  const users = roomsState[roomID].users;
  return users.find((user) => user.id === userID);
}

module.exports = {
  userJoin,
  userLeave,
  getCurrentUser,
  getRoomData,
  addChatMsg,
  addLikedRecipe,
  addLikedRecipesLimit,
  addWonRecipe,
};

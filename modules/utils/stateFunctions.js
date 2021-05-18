const { roomsState } = require('./state.js');

// Add user to their room in the state
function userJoin(roomID, user, userID) {
  const assignRoom = roomsState[roomID];
  const roomUsers = assignRoom.users;

  const userObj = {
    username: user,
    id: userID,
  };

  roomUsers.push(userObj);
  return assignRoom; // returns room data
}

// Remove user from their room in the state
function userLeave(roomID, userID) {
  let users = roomsState[roomID].users;
  const index = users.findIndex((user) => user.id === userID);

  if (index !== -1) {
    return users.splice(index, 1);
  }
  return users;
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
function addLikedRecipe(recipe, roomID, user) {
  // when there are 5 recipes chosen, there must be choose by (first user/random user) for the recipe
  // let length = roomsState[roomID].likedRecipes.length + 1;

  const length = roomsState[roomID].likedRecipes.length;

  // console.log('lengtee: ', length);
  // checks if length = 5
  if (length >= 5) {
    // set limit
    // addLikedRecipesLimit(true, roomID);
    return (roomsState[roomID].likedRecipeLimit = true);

    // send alert
  }
  // else if (length == 3) {
  //   console.log('5? === ', length);
  //   // push recipe
  //   const assignRecipe = roomsState[roomID].likedRecipes;

  //   const recipeObj = {
  //     user: user.username,
  //     recipeTitle: recipe.title,
  //     recipeId: recipe.id,
  //     recipeImage: recipe.preview,
  //   };
  //   assignRecipe.push(recipeObj);
  //   // set limit
  //   addLikedRecipesLimit(length, roomID);
  // }
  else {
    // console.log('lengte', length);
    // console.log(`Maakt ${length + 1}-de recipe aan`);
    const assignRecipe = roomsState[roomID].likedRecipes;

    const recipeObj = {
      user: user.username,
      recipeTitle: recipe.title,
      recipeId: recipe.id,
      recipeImage: recipe.preview,
    };
    assignRecipe.push(recipeObj);

    console.log(assignRecipe);
    // console.log(assignRecipe.length);
    // return console.log(assignRecipe);
  }
  return;
}

// Add the liked recipes limit to the state
//!check--- add liked recipes limit to state
function addLikedRecipesLimit(value, roomID) {
  // let assignLimit = roomsState[roomID].likedRecipeLimit;
  // const recipeObj = {
  //   recipe: wonRecipe,
  //   user: user,
  // };
  // return roomsState[roomID].likedRecipeLimit = value;
  // return console.log('limit: ', assignLimit);
  roomsState[roomID].likedRecipeLimit = value;
}

// Add won recipe to the state
function addWonRecipe(wonRecipe, roomID, user) {
  let assignWonRecipe = roomsState[roomID].wonRecipe;

  const recipeObj = {
    recipe: wonRecipe,
    user: user,
  };

  assignWonRecipe = recipeObj;

  // return console.log('WON recipe: ', assignWonRecipe);
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

// finds roomID where userID is in

// 1. find id in whole obj (obj.users)
// 2. return the room where the id is in
// server: delete the id in that room
// server: update state by deleting state and render in clientside
function findCurrentRoom(userID) {
  for (const [key, value] of Object.entries(roomsState)) {
    let userId = roomsState[key].users;
    let roomId = roomsState[key].id;

    for (let i = 0; i < userId.length; i++) {
      if (userId[i].id === userID) {
        // roomId = `room${roomId}`;
        return roomId;

        // console.log(
        //   `Found user with id: ${userId[i].id} the user has the username: ${userId[i].username} and sits in room ${roomId}`
        // );
        // return true;
      }
    }
    // else: null
    // return false;
  }
}

module.exports = {
  userJoin,
  userLeave,
  getCurrentUser,
  getRoomData,
  findCurrentRoom,
  addChatMsg,
  addLikedRecipe,
  addLikedRecipesLimit,
  addWonRecipe,
};

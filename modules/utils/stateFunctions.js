const { Socket } = require('socket.io');
const { roomsState } = require('./state.js');

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
// Removes user object when user leaves
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

// Add chat
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

// Add recipe
function addLikedRecipe(recipe, roomID, user) {
  // when there are 5 recipes chosen, there must be choose by (first user/random user) for the recipe
  let length = roomsState[roomID].likedRecipes.length;
  // console.log('lengtee: ', length);
  // checks if length = 5
  if (length >= 5) {
    console.log(length);
    // set limit
    addLikedRecipesLimit(true, roomID);

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
  }
  // return;
}

//!check--- add liked recipes limit to state
function addLikedRecipesLimit(value, roomID) {
  // let assignLimit = roomsState[roomID].likedRecipeLimit;

  // const recipeObj = {
  //   recipe: wonRecipe,
  //   user: user,
  // };

  roomsState[roomID].likedRecipeLimit = value;

  // return console.log('limit: ', assignLimit);
}

// add won recipe to state
function addWonRecipe(wonRecipe, roomID, user) {
  let assignWonRecipe = roomsState[roomID].wonRecipe;

  const recipeObj = {
    recipe: wonRecipe,
    user: user,
  };

  assignWonRecipe = recipeObj;

  // return console.log('WON recipe: ', assignWonRecipe);
}

// Get current user
function getCurrentUser(userID, roomID) {
  const users = roomsState[roomID].users;
  return users.find((user) => user.id === userID);
}

// const roomsState = {
//   room1: {
//     id: 1,
//     likedRecipes: [],
//     users: [{ username: 'Kees', id: '-bssNfkdyPnZdT7LAAAB' }],
//     chat: [],
//   },
//   room2: {
//     id: 2,
//     likedRecipes: [],
//     users: [
//       { username: 'lappie', id: '-bsssfkd2PnZdT7LAAAB' },
//       { username: 'dappie', id: 'hcUqPmSiAw_lsZ0iAAAD' },
//     ],
//     chat: [],
//   },
// };

// const find = (object, id) => {
//   for (const [key, value] of Object.entries(object)) {
//     const userId = roomsState[key].users;
//     const roomid = roomsState[key].id;

//     for (let i = 0; i < userId.length; i++) {
//       if (userId[i].id === id) {
//         console.log(
//           `Found user with id: ${userId[i].id} the user has the username: ${userId[i].username} and sits in room ${roomid}`
//         );
//         return true;
//       }
//     }
//     return false;
//   }
// };

// const test = find(roomsState, '-bsssfkd2PnZdT7LAAAB');

// if (test) {
//   console.log(test);
// } else {
//   console.log('Not found');
// }

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

  // const test = find(roomsState, '-bsssfkd2PnZdT7LAAAB');

  // if (test) {
  //   console.log(test);
  // } else {
  //   console.log('Not found');
  // }

  // console.log(rooms);
  // // const users = roomsState.users;

  // // return users.find((user) => user.id === userID);

  // // Check the users in all rooms
  // for (let i in rooms) {
  //   let roomObjects = roomsState[rooms[i]].users;
  //   // console.log('roomObjects: ', roomObjects); //returns: users objects from room
  //   // console.log('rooms:::', rooms[i]); // returns: roomids

  //   // check the ids of the users in all rooms
  //   for (let i in roomObjects) {
  //     let idsUsers = roomObjects[i].id;
  //     // console.log('user ids: ', idsUsers); // returns: id from users

  //     let roomNumber = Object.keys(roomObjects).find((idsUsers) => roomsState);
  //     // console.log('roomNumber: ', roomNumber);

  //     // if(id == userID){ //server
  //     //   return true
  //     // }
  //   }
  // }
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

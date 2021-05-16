const { roomsState } = require('./state.js');

function userJoin(roomID, user, userID) {
  const assignRoom = roomsState[roomID];

  const userObj = {
    username: user,
    id: userID,
  };

  const addUser = roomsState[roomID].users.push(userObj); // remove console.log and the var name declaration above -- return nothing?

  return assignRoom;
}

function userLeave(roomID, userID) {
  let users = roomsState[roomID].users;
  const index = users.findIndex((user) => user.id === userID);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  return users;
  // console.log('overige users: ', users);
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

  // return console.log('NEW Message: ', assignMsg);
}

// Get chat history
// function getChatHistory(userID, roomID) {
//   const users = roomsState[roomID].users;
//   return users.find((user) => user.id === userID);
// }

// Add recipe
function addLikedRecipe(recipe, roomID, user) {
  // when there are 5 recipes chosen, there must be choose by (first user/random user) for the recipe
  if (roomsState[roomID].likedRecipes.length === 5) {
    return false;
  } else {
    const assignRecipe = roomsState[roomID].likedRecipes;

    const recipeObj = {
      user: user.username,
      recipeTitle: recipe.title,
      recipeId: recipe.id,
      recipeImage: recipe.preview,
    };

    const addRecipe = roomsState[roomID].likedRecipes.push(recipeObj);

    // return console.log('NEW recipe: ', assignRecipe); // remove console.log and the var name declaration above
    return true;
  }
  // return;
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
function getCurrentUserrr(userID) {
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

  // 1. find id in whole obj (obj.users)
  // 2. return the room where the id is in
  // server: delete the id in that room
  // server: update state by deleting state and render in clientside
}

// Get room users
// function getRoomUsers(roomID) {
//   return users.filter((user) => user.room === room);
// }

module.exports = {
  userJoin,
  userLeave,
  getRoom,
  addChatMsg,
  addLikedRecipe,
  getCurrentUser,
  getCurrentUserrr,
};

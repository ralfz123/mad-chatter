const { roomsState } = require('./state.js');

const userJoin = (roomID, user) => {
  const assignRoom = roomsState[roomID];

  const userR = {
    username: user,
    // id: socket.id,
  };

  const addUser = roomsState[roomID].users.push(userR);

  return assignRoom;
};

const getRoom = (roomid) => {
  const test = roomsState[roomid];
  return console.log(test);
};

module.exports = { userJoin, getRoom };

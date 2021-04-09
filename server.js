const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

app.use(express.static(path.resolve('public')));

io.on('connection', (socket) => {
  console.log('user connected');

  //  Receiving message, emit it
  socket.on('message', (messageText) => {
    console.log('message: ', messageText);
    io.emit('message', messageText);
  });

  // Detects when user has disconnected
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

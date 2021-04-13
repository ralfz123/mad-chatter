const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
const getData = require('./modules/fetch.js');

app.use(express.static('public'));

app.get('/', async function getHome(req, res) {
  // Get data through fetch and put in a variable called dataAll
  // let dataRecipes = await getData();

  // // Declare data variables for better use in .ejs files
  // let data = dataRecipes;

  // // Render data
  res.render('index.ejs');
//   let data = [{ title: 'Fill in ingredient in the input' }];
//   res.render('index.ejs', { data, rerender: false });
});

io.on('connection', (socket) => {
  console.log('user connected');

  // rule:
  // io.emit('message', "this is a test"); --> sending to all clients, include sender
  // socket.emit('message', "this is a test"); --> sending to sender-client only

  // Ingredient query handler
  socket.on('query', (queryInfo) => {
    io.emit('query', queryInfo);
    getQueryData(queryInfo.query);
  });

  // Message handler
  socket.on('message', (messageInfo) => {
    io.emit('message', messageInfo);
  });

  // Detects when user has disconnected
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  async function getQueryData(query) {
    // Get data by query
    let dataQuery = await getData(query);

    return io.emit('data', dataQuery);
  }
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

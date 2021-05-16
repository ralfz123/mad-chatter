import { loader } from './loader.js';
import {
  addRecipes,
  outputLikedRecipe,
  outputAlert,
  outputRecipeAlert,
  outputUsers,
  addMessage,
  historyOutputChat,
  historyOutputLikedRecipes,
} from './render.js';

// var socket = io();
const socket = io(window.location.host);

let globalRoom;

// --------------------------------

// default chat msg
socket.on('welcome', (msg) => {
  // console.log('Received: ', msg);
});

// --------------------------------

// login
const homeSecOne = document.querySelector('#chat-query');
const homeSecTwo = document.querySelector('#recipes');
// const homeSecThree = document.querySelector('#room-info');
homeSecOne.style.display = 'none';
homeSecTwo.style.display = 'none';
// homeSecThree.style.display = 'none';

const loginSection = document.querySelector('main > section');
const loginForm = document.querySelector('main > section form');
let roomInputs = document.getElementsByName('room');
let nickname = document.querySelector('input[name=nickname]');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  for (let i in roomInputs) {
    if (roomInputs[i].checked) {
      let roomID = `room${roomInputs[i].dataset.id}`; // assign to global client variable
      globalRoom = roomID;

      socket.emit('joinRoom', {
        room: roomID,
        // room: roomInputs[i].value,
        user: nickname.value,
      });
      loginSection.style.display = 'none';
      homeSecOne.style.display = 'flex';
      homeSecTwo.style.display = 'block';
      // homeSecThree.style.display = 'block';
    }
  }
});

// Succesful joining room
socket.on('joinSucces', (msg) => {
  outputAlert(msg, 'msgContainerSucces');
});

// Room error invaled
socket.on('joinError', (err) => {
  outputAlert(msg, 'msgContainerError');
});

// Other user has joined
socket.on('userJoined', (msg) => {
  outputAlert(msg, 'msgContainerUser');
});

// --------------------------------

// Get room and users
socket.on('roomData', ({ room, users, chat, likedRecipes }) => {
  // Render this state when new client is joined and then go over to "real life" experience?
  // console.log('room id: ', room);
  // console.log('users: ', users);
  // console.log('chat: ', chat);
  // console.log('likedRecipes: ', likedRecipes);
  outputUsers(room, users);
  historyOutputChat(chat);
  historyOutputLikedRecipes(likedRecipes);
});

// --------------------------------

// Ingredients query
const ingredientsForm = document.querySelector('#ingredientsForm');
const inputQuery = document.querySelector('#query-ingredient');

// Chat
const chatForm = document.querySelector('#chatForm');
const chatBox = document.querySelector('#messages');
const inputMessage = document.querySelector('#message');

loader('hide');

// Listens to ingredient query form submit
if (ingredientsForm) {
  ingredientsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (inputQuery.value) {
      loader('show');
      socket.emit('query', { query: inputQuery.value });
    }
  });
} else {
  null;
}

// --------------------------------

// Show recipes result
socket.on('queryData', (data) => {
  addRecipes(data);
});

// --------------------------------

const chosenRecipeForm = document.querySelector('#recipes form');
if (chosenRecipeForm) {
  let inputChosenRecipe = document.getElementsByName('recipes');

  chosenRecipeForm.addEventListener('submit', function (e) {
    e.preventDefault();

    for (var i = 0, length = inputChosenRecipe.length; i < length; i++) {
      if (inputChosenRecipe[i].checked) {
        socket.emit('likedRecipe', {
          recipeID: inputChosenRecipe[i].value,
          room: globalRoom,
        });
        inputChosenRecipe[i].removeAttribute('checked', 'checked');
      }
    }
  });
} else {
  null;
}

// Add liked recipe to container
socket.on('likedRecipesList', (data) => {
  // outputLikedRecipe(data); // one recipe!
  historyOutputLikedRecipes(data);
});

// Liked recipes - The limit is reached - alert msg
socket.on('alertMessageRecipe', (type, msg, data) => {
  outputRecipeAlert(type, msg, data);
});

// Message submit
if (chatForm) {
  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (inputMessage.value) {
      let msg = inputMessage;
      let msgText = inputMessage.value;

      // Emit message to server
      socket.emit('chatMessage', { msg: msgText, room: globalRoom });

      // Clear input
      inputMessage.value = '';
      msg.focus();
    }
  });
} else {
  null;
}

// Message from server
socket.on('chatMessage', (message) => {
  new Audio('https://www.myinstants.com/media/sounds/msn-sound_1.mp3').play();
  addMessage(message);

  chatBox.scrollTop = chatBox.scrollHeight;
});

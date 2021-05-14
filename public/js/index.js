import { loader } from './loader.js';
import {
  addRecipes,
  outputLikedRecipes,
  outputAlert,
  outputUsers,
  addMessage,
} from './render.js';

// var socket = io();
const socket = io(window.location.host);

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
        socket.emit('likedRecipe', inputChosenRecipe[i].value);
        inputChosenRecipe[i].removeAttribute('checked', 'checked');
      }
    }
  });
} else {
  null;
}

// Add liked recipe to container
socket.on('likedRecipesList', (data) => {
  outputLikedRecipes(data);
});

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
      socket.emit('joinRoom', {
        room: roomInputs[i].value,
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
socket.on('roomUsers', ({ room, users }) => {
  outputUsers(room, users);
});

// --------------------------------

// Message submit
if (chatForm) {
  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (inputMessage.value) {
      let msg = inputMessage;
      let msgText = inputMessage.value;

      // Emit message to server
      socket.emit('chatMessage', msgText);

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

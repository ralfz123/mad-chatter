import { loader } from './loader.js';
import {
  addRecipes,
  outputLikedRecipe,
  outputWonRecipe, // make function
  outputAlert,
  outputRecipeAlert,
  outputUsers,
  addMessage,
  historyOutputChat,
  historyOutputLikedRecipes,
  historyOutputWonRecipe,
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
const wonSec = document.querySelector('#won-recipe');

homeSecOne.style.display = 'none';
homeSecTwo.style.display = 'none';
wonSec.style.display = 'none';

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

// Get room and users -- Render this state when new client is joined
socket.on('roomData', ({ room, users, chat, likedRecipes, wonRecipe }) => {
  outputUsers(room, users);
  historyOutputChat(chat);
  historyOutputLikedRecipes(likedRecipes);
  historyOutputWonRecipe(wonRecipe);
});

socket.on('roomUsers', ({ room, users }) => {
  console.log('test room users');
  outputUsers(room, users);
});

// --------------------------------

// Ingredients query
const ingredientsForm = document.querySelector('#ingredientsForm');
const inputQuery = document.querySelector('#query-ingredient');

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

const likeRecipesForm = document.querySelector('#recipes form');
if (likeRecipesForm) {
  let inputChosenRecipe = document.getElementsByName('recipes');

  likeRecipesForm.addEventListener('submit', function (e) {
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
  outputLikedRecipe(data);
});

// --------------------------------
// Liked recipes - The limit is reached - alert msg
socket.on('alertMessageRecipe', (type, msg, data) => {
  // new Audio('../assets/waiting.mp3').play();
  outputRecipeAlert(type, msg, data);
});

// --------------------------------

// Chat
const chatForm = document.querySelector('#chatForm');
const chatBox = document.querySelector('#messages');
const inputMessage = document.querySelector('#message');

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

// --------------------------------

// When button is submitted
const inputRecipesChoices = document.getElementsByName('chosenRecipe');
const msgChooseRecipe = document.querySelector('.msgContainerRecipeLimitUser');
const chosenRecipeForm = document.querySelector(
  '.msgContainerRecipeLimitUser form'
);

// choses recipe submit
if (chosenRecipeForm) {
  chosenRecipeForm.addEventListener('submit', function (e) {
    e.preventDefault();

    for (var i = 0, length = inputRecipesChoices.length; i < length; i++) {
      if (inputRecipesChoices[i].checked) {
        socket.emit('wonRecipe', {
          recipeID: inputRecipesChoices[i].value,
          room: globalRoom,
        });
        msgChooseRecipe.style.display = 'none';
      }
    }
  });
} else {
  null;
}

const msgLimitAlertUsers = document.querySelector(
  '.msgContainerRecipeLimitAll'
);
const okayBtn = document.querySelector('.msgContainerRecipeLimitAll button');
console.log('conatiner', msgLimitAlertUsers);
console.log('button: ', okayBtn);

okayBtn.onclick = function (e) {
  e.preventDefault();
  console.log('clicked');

  msgLimitAlertUsers.style.display = 'none';
};

socket.on('wonRecipeData', (wonRecipeData) => {
  new Audio('https://www.myinstants.com/media/sounds/msn-sound_1.mp3').play();
  outputWonRecipe(wonRecipeData);
});

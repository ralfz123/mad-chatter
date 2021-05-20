import { loader } from './loader.js';
import {
  addRecipes,
  outputLikedRecipe,
  outputWonRecipe,
  outputAlert,
  outputRecipeAlert,
  outputUsers,
  addMessage,
  historyOutputChat,
  historyOutputLikedRecipes,
  checkOutputLikedRecipesLimit,
  historyOutputWonRecipe,
} from './render.js';

// var socket = io();
const socket = io(window.location.host);

let globalRoom;

// ------------------------------- Socket events

// Join room - Successful
socket.on('joinSucces', (msg) => {
  outputAlert(msg, 'msgContainerSucces');
});

// Join room  - Error
socket.on('joinError', (err) => {
  outputAlert(msg, 'msgContainerError');
});

// Other user has joined
socket.on('userJoined', (msg) => {
  outputAlert(msg, 'msgContainerUser');
});

// Get room and users -- Render this state when new client is joined
socket.on(
  'roomData',
  ({ room, users, chat, likedRecipes, likedRecipeLimit, wonRecipe }) => {
    outputUsers(room, users);
    historyOutputChat(chat);
    historyOutputLikedRecipes(likedRecipes);
    checkOutputLikedRecipesLimit(likedRecipes.length, users[0].username);
    historyOutputWonRecipe(wonRecipe);
  }
);

socket.on('roomUsers', ({ room, users }) => {
  outputUsers(room, users);
});

// Message from server
socket.on('addChatMessage', (message) => {
  new Audio('https://www.myinstants.com/media/sounds/msn-sound_1.mp3').play();
  addMessage(message);
});

// Show recipes result
socket.on('queryData', (data) => {
  addRecipes(data);
});

// Add liked recipe to container
socket.on('addLlikedRecipe', (data) => {
  outputLikedRecipe(data);
});

// Liked recipes - The limit is reached - alert msg
socket.on('alertMessageRecipe', (type, msg, data) => {
  outputRecipeAlert(type, msg, data);
});

socket.on('wonRecipeData', (wonRecipeData) => {
  new Audio('../assets/cookingTime.mp3').play();
  outputWonRecipe(wonRecipeData);
});

// ------------------------------- Declarations

// Sections
const loginSection = document.querySelector('main > section');
const homeSecOne = document.querySelector('#chat-query');
const homeSecTwo = document.querySelector('#recipes');
const wonSec = document.querySelector('#won-recipe');

// Forms
const loginForm = document.querySelector('main > section form');
const chatForm = document.querySelector('#chatForm');
const ingredientsForm = document.querySelector('#ingredientsForm');
const likeRecipesForm = document.querySelector('#recipes form');
const chosenRecipeForm = document.querySelector(
  '.msgContainerRecipeLimitUser form'
);
const okayBtn = document.querySelector('.msgContainerRecipeLimitAll button');

loader('hide');
homeSecOne.style.display = 'none';
homeSecTwo.style.display = 'none';
wonSec.style.display = 'none';

// ------------------------------- Form handlers

loginForm.addEventListener('submit', submitAddMember);
ingredientsForm.addEventListener('submit', submitAddIngredient);
likeRecipesForm.addEventListener('submit', submitLikedRecipe);
chatForm.addEventListener('submit', submitChatMsg);
chosenRecipeForm.addEventListener('submit', submitChosenRecipe);
okayBtn.onclick = handleClickOkayBtn;

// ------------------------------- Submit handlers

// Send user to server that needs to be added
function submitAddMember(e) {
  e.preventDefault();

  let roomInputs = document.getElementsByName('room');
  let nickname = document.querySelector('input[name=nickname]');
  for (let i in roomInputs) {
    if (roomInputs[i].checked) {
      let roomID = `room${roomInputs[i].dataset.id}`; // assign to global client variable
      globalRoom = roomID;

      socket.emit('joinRoom', {
        room: roomID,
        username: nickname.value,
      });
      loginSection.style.display = 'none';
      homeSecOne.style.display = 'flex';
      homeSecTwo.style.display = 'block';
    }
  }
}

// Send ingredient to server that has to fetch data
function submitAddIngredient(e) {
  e.preventDefault();
  const inputQuery = document.querySelector('#query-ingredient');
  if (inputQuery.value) {
    loader('show');
    socket.emit('inputQuery', { query: inputQuery.value });
  }
}

// Send liked recipe to server
function submitLikedRecipe(e) {
  e.preventDefault();
  let inputChosenRecipe = document.getElementsByName('recipes');
  for (let i = 0, length = inputChosenRecipe.length; i < length; i++) {
    if (inputChosenRecipe[i].checked) {
      socket.emit('likedRecipe', {
        recipeID: inputChosenRecipe[i].value,
        room: globalRoom,
      });
      inputChosenRecipe[i].removeAttribute('checked', 'checked');
    }
  }
}

// Send message to server
function submitChatMsg(e) {
  e.preventDefault();

  const inputMessage = document.querySelector('#message');

  if (inputMessage.value) {
    let msg = inputMessage;
    let msgText = inputMessage.value;

    // Emit message to server
    socket.emit('chatMessage', { msg: msgText, room: globalRoom });

    // Clear input
    inputMessage.value = '';
    msg.focus();
  }
}

// Send won/chosen recipe to server
function submitChosenRecipe(e) {
  e.preventDefault();

  const inputRecipesChoices = document.getElementsByName('chosenRecipe');
  const msgChooseRecipe = document.querySelector(
    '.msgContainerRecipeLimitUser'
  );

  for (let i = 0, length = inputRecipesChoices.length; i < length; i++) {
    if (inputRecipesChoices[i].checked) {
      socket.emit('wonRecipe', {
        recipeID: inputRecipesChoices[i].value,
        room: globalRoom,
      });
      msgChooseRecipe.style.display = 'none';
    }
  }
}

// When clicked on okay button, display disappears
function handleClickOkayBtn(e) {
  e.preventDefault();
  const msgLimitAlertUsers = document.querySelector(
    '.msgContainerRecipeLimitAll'
  );
  msgLimitAlertUsers.style.display = 'none';
}

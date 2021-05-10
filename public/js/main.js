var socket = io();

// Ingredients query
var ingredientsForm = document.querySelector('#ingredientsForm');
var inputQuery = document.querySelector('#query-ingredient');
var ingredientsBox = document.querySelector('#ingredients');

// Chat
var chatForm = document.querySelector('#chatForm');
var chatBox = document.querySelector('#messages');
var inputMessage = document.querySelector('#message');
var message = document.querySelector('.chat-message');

loader('hide');

// List
const list = document.querySelector('#recipes ol');
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

socket.on('query', (emitted) => {
  addIngredient(emitted.query);
});

// Add ingredient to box
function addIngredient(ingredient) {
  if (ingredient !== null) {
    ingredientsBox.style.padding = '0.3rem';
    ingredientsBox.textContent = ingredient;
    ingredientsBox.setAttribute('class', 'newIngr');
    setTimeout(() => {
      ingredientsBox.removeAttribute('class', 'newIngr');
    }, 1500);
  } else {
    null;
  }
}

// Show recipes result
socket.on('data', (data) => {
  if (data !== null) {
    loader('hide');
    let stateText = document.querySelector('#recipes ol p');
    stateText.style.display = 'none';

    // Update-pattern: removes recipes from old query
    // ! Not finished yet
    let oldRecipes = document.querySelector('.recipes-response');
    if (oldRecipes) {
      oldRecipes.parentNode.removeChild(oldRecipes);
    } else {
      for (let i in data) {
        let item = document.createElement('li');
        item.setAttribute('class', 'recipes-response');
        list.appendChild(item);

        let label = document.createElement('label');
        label.setAttribute('for', data[i].title);
        item.appendChild(label);

        let image = document.createElement('img');
        image.setAttribute('src', data[i].preview);
        image.setAttribute('alt', data[i].title);
        label.appendChild(image);

        let imageText = document.createElement('div');
        let text = document.createElement('p');
        text.textContent = data[i].title;
        imageText.appendChild(text);
        label.appendChild(imageText);

        let title = document.createElement('p');
        title.textContent = data[i].id;
        label.appendChild(title);
      }
    }
  } else {
    // ! Remove all old recipes
    loader('hide');
    let stateText = document.querySelector('#recipes ol p');
    stateText.textContent = 'Incorrect ingredient';
    stateText.setAttribute('class', 'errorMsg');
  }
});

let inputChosenRecipe = document.querySelector('#chosen-recipe');
const chosenRecipeForm = document.querySelector('#recipes form');
if (chosenRecipeForm) {
  chosenRecipeForm.addEventListener('submit', function (e) {
    e.preventDefault();
    socket.emit('chosenRecipe', inputChosenRecipe.value);
  });
} else {
  null;
}

// Show chosen recipe
socket.on('dataRecipe', (data) => {
  if (data !== null) {
    window.location.replace(`/match/${data[0].id}`);
    // let container = document.createElement('div');
    // let link = document.createElement('a');
    // link.textContent = `Gebruiker heeft gekozen voor ${data[0].title}`;
    // link.setAttribute('href', `/match/${data[0].id}`);
    // container.appendChild(link);
    // list.appendChild(container);
  } else {
    let stateText = document.querySelector('#recipes ol p');
    stateText.textContent = 'Incorrect recipe ID';
    stateText.setAttribute('class', 'errorMsg');
  }
});

// replace with user socket id
// Checks if name of the messager is the same as the client
function convertNameSelf(name) {
  if (name === inputName.value) {
    return (name = '(Yourself)');
  } else {
    return name;
  }
}

setTimer();
// Timer from player
function setTimer() {
  const form = document.querySelector('#match form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Create countdown section
      const countdownPlace = document.querySelector('#match article p span');
      let timer = document.querySelector('#timer');
      let timerHours = timer.value;
      let timerMinutes = timerHours * 60; // convert hours to minutes
      let timerSeconds = timerMinutes * 60; // convert minutes to seconds

      countdownPlace.textContent = timerSeconds;

      setInterval(function () {
        let container = document.createElement('div');
        container.setAttribute(
          'style',
          'position: absolute;background: #3e3e3ebf;left: 0;right: 0;margin-left: auto;margin-right: auto;width: 100%;text-align: center;top: 0;display: block;color: black;height: 100%;align-self: center;font-size: 9rem;'
        );
        let text = document.createElement('p');
        text.textContent = 'Time is up! {playerName} has won!';
        text.setAttribute('style', 'font-size:4rem;');
        container.appendChild(text);

        let body = document.querySelector('#playerdata');
        body.setAttribute('style', 'position:relative;');
        body.appendChild(container);

        let pOneData = document.querySelector('#player-one');
        pOneData.setAttribute('style', 'filter: blur(2px);');
      }, timerSeconds * 1000);
    });
  } else {
    null;
  }
}
// BACKLOG: function that checks when all input[type=checkbox] are checked from the instructions challenge --> then finished animation (toggle class)
function finished() {
  let form = document.querySelector('.recipe-instructions ~ form');
  // let finishBtn = document.querySelector('.recipe-instructions ~ form button');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log(`You're done!`);
    let container = document.createElement('div');
    container.setAttribute(
      'style',
      'position: absolute;background: #3e3e3ebf;left: 0;right: 0;margin-left: auto;margin-right: auto;width: 100%;text-align: center;top: 0;display: block;color: black;height: 100%;align-self: center;font-size: 9rem;'
    );
    let text = document.createElement('p');
    text.textContent = '{playerName} has won!';
    text.setAttribute('style', 'font-size:4rem;');
    container.appendChild(text);

    let link = document.createElement('a');
    link.setAttribute('href', '/');
    link.textContent = 'Try again';
    container.appendChild(link);

    let body = document.querySelector('#playerdata');
    body.setAttribute('style', 'position:relative;');
    body.appendChild(container);

    let pOneData = document.querySelector('#player-one');
    pOneData.setAttribute('style', 'filter: blur(2px);');
  });
}

/**
 * Loader as feedback element for the user (UX)
 *
 * @param {string} state - The state of the loader
 */

function loader(state) {
  const loader = document.querySelector('.loader');

  if (loader) {
    loader.classList = 'loader';
    if (state == 'show') {
      loader.classList = 'loader';
    } else if (state == 'hide') {
      loader.classList.add('hide');
    }
  } else {
    null;
  }
}

// default chat msg?
socket.on('welcome', (msg) => {
  // console.log('Received: ', msg);
});

const homeSecOne = document.querySelector('#chat-query');
const homeSecTwo = document.querySelector('#recipes');
homeSecOne.style.display = 'none';
homeSecTwo.style.display = 'none';

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
      homeSecOne.style.display = 'block';
      homeSecTwo.style.display = 'block';
    }
  }
});

socket.on('err', (err) => {
  console.log(err);
});

socket.on('succes', (res) => {
  console.log(res);
});

// Get room and users
socket.on('roomUsers', ({ users }) => {
  outputUsers(users);
});

// Add users to DOM
function outputUsers(users) {
  const userList = document.querySelector('.users');
  userList.textContent = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user.username;
    userList.appendChild(li);
  });
}

// // Message from server
// socket.on('message', (message) => {
//   outputMessage(message);

//   // Scroll down
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// chatForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   // Get message text
//   let msg = e.target.elements.msg.value;

//   msg = msg.trim();

//   if (!msg) {
//     return false;
//   }

//   socket.emit('chatMessage', msg);

//   // Clear input
//   e.target.elements.msg.value = '';
//   e.target.elements.msg.focus();
// });

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

socket.on('chatMessage', (message) => {
  new Audio('https://www.myinstants.com/media/sounds/msn-sound_1.mp3').play();
  addMessage(message);

  chatBox.scrollTop = chatBox.scrollHeight;
});

// Add message to chatbox DOM
function addMessage({ user, message }) {
  let item = document.createElement('li');
  item.setAttribute('class', 'newMsg');
  // name = convertNameSelf(name);
  let itemText = document.createElement('p');
  item.appendChild(itemText);

  let username = document.createElement('span');
  username.textContent = `${user}: `;
  username.style.fontWeight = 'bold';
  itemText.appendChild(username);

  let messageText = document.createElement('span');
  messageText.textContent = message;
  itemText.appendChild(messageText);

  chatBox.appendChild(item);
  chatBox.scrollTop = chatBox.scrollHeight;
  setTimeout(() => {
    item.removeAttribute('class', 'newMsg');
  }, 1500);
}

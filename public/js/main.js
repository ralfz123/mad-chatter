var socket = io();

// Ingredients query
var ingredientsForm = document.querySelector('#ingredientsForm');
var inputQuery = document.querySelector('#query-ingredient');
var ingredientsBox = document.querySelector('#ingredients');

// Chat
var chatForm = document.querySelector('#chatForm');
var chatBox = document.querySelector('#messages');
var inputName = document.querySelector('#name');
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

if (chatForm) {
  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (inputMessage.value) {
      socket.emit('message', {
        name: inputName.value,
        message: inputMessage.value,
      });
      inputName.setAttribute('disabled', 'disabled');
      inputMessage.value = '';
      inputMessage.focus();
    }
  });
} else {
  null;
}

socket.on('message', (emitted) => {
  new Audio('https://www.myinstants.com/media/sounds/msn-sound_1.mp3').play();
  addMessage(emitted.name, emitted.message);
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

// Add message to chatbox
function addMessage(name, message) {
  var item = document.createElement('li');
  // name = convertNameSelf(name);
  item.textContent = `${name}: ${message}`;
  item.setAttribute('class', 'newMsg');
  chatBox.appendChild(item);
  chatBox.scrollTop = chatBox.scrollHeight;
  setTimeout(() => {
    item.removeAttribute('class', 'newMsg');
  }, 1500);
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
        let category = document.createElement('p');
        category.textContent = data[i].category;
        imageText.appendChild(category);
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

// Handles chosen recipe id
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
  let roomId = window.location.pathname;
  let recipeId = data[0].id;
  let newUrl = `${roomId}/match/${recipeId}`;
  console.log(newUrl);

  // if (data !== null) {

  window.location.replace(newUrl);
  // let container = document.createElement('div');
  // let link = document.createElement('a');
  // link.textContent = `Gebruiker heeft gekozen voor ${data[0].title}`;
  // link.setAttribute('href', `/match/${data[0].id}`);
  // container.appendChild(link);
  // list.appendChild(container);
  // } else {
  //   let stateText = document.querySelector('#recipes ol p');
  //   stateText.textContent = 'Incorrect recipe ID';
  //   stateText.setAttribute('class', 'errorMsg');
  // }
});

// issue: somebody else can have the same name
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

// https://stackoverflow.com/questions/50795042/create-a-copy-button-without-an-input-text-box/50795833
let copyIdBtn = document.querySelector('.copyIdBtn');
copyIdBtn.addEventListener('click', () => {
  let rawRoomId = window.location.pathname;
  let roomId = rawRoomId.substring(
    rawRoomId.lastIndexOf('/') + 1,
    rawRoomId.length
  );
  Clipboard_CopyTo(roomId);

  // Feedback
  let container = document.createElement('div');
  container.classList.add('msgCopy');
  let text = document.createElement('p');
  text.textContent = `You've copied ${roomId} to clipboard!`;
  container.append(text);
  let header = document.querySelector('header');
  header.appendChild(container);
  header.style.position = 'relative';
  setTimeout(function () {
    container.remove();
  }, 2300);
});

// Clip the room ID to clipboard
function Clipboard_CopyTo(value) {
  const tempInput = document.createElement('input');
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}

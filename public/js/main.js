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
      // inputQuery.value = '';
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
        label.appendChild(imageText);

        let title = document.createElement('p');
        title.textContent = data[i].id;
        label.appendChild(title);

        // let input = document.createElement('input');
        // input.setAttribute('type', 'checkbox');
        // input.setAttribute('id', data[i].title);
        // input.setAttribute('value', data[i].title);
        // input.setAttribute('name', 'selectedRecipe');
        // item.appendChild(input);
        // }
      }
    }
  } else {
    // ! Remove all old recipes
    let stateText = document.querySelector('#recipes ol p');
    stateText.textContent = 'No correct ingredient';
  }
});

// let inputChosenRecipe = document.querySelector('#chosen-recipe');
// const chosenRecipeForm = document.querySelector('#recipes form');
// if (chosenRecipeForm) {
//   chosenRecipeForm.addEventListener('submit', function (e) {
//     e.preventDefault();
//     socket.emit('chosenRecipe', inputChosenRecipe.value);
//   });
// } else {
//   null;
// }

// Show chosen recipe -->

// RENDER IT IN /MATCH TEMPLATE!
// socket.on('dataRecipe', (data) => {
//   if (data !== null) {
//     let stateText = document.querySelector('#recipes ol p');
//     stateText.style.display = 'none';

//     for (let i in data) {
//       let item = document.createElement('li');
//       item.setAttribute('class', 'recipe-response');
//       list.appendChild(item);

//       let image = document.createElement('img');
//       image.setAttribute('src', data[i].preview);
//       image.setAttribute('alt', data[i].title);
//       image.setAttribute('style', 'width:50px;');
//       item.appendChild(image);

//       let title = document.createElement('p');
//       title.textContent = `chosen: ${data[i].id}`;
//       item.appendChild(title);
//     }
//   } else {
//     let stateText = document.querySelector('#recipes ol p');
//     stateText.textContent = 'No correct ingredient';
//   }
// });

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
      countdownPlace.textContent = timerMinutes;
    });
  } else {
    null;
  }
}
// function that checks when all input[type=checkbox] are checked from the instructions challenge --> then finished animation (toggle class)
function finished() {
  // lorem
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

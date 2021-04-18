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

// List
const list = document.querySelector('#recipes ol');

ingredientsForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (inputQuery.value) {
    socket.emit('query', { query: inputQuery.value });
    // inputQuery.value = '';
    inputQuery.setAttribute('disabled', 'disabled');
  }
});

socket.on('query', (emitted) => {
  addIngredient(emitted.query);
});

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

socket.on('message', (emitted) => {
  new Audio('https://www.myinstants.com/media/sounds/msn-sound_1.mp3').play();
  addMessage(emitted.name, emitted.message);
});

// Add ingredient to box
function addIngredient(ingredient) {
  if (ingredient !== null) {
    var item = document.createElement('li');
    item.textContent = ingredient;
    item.setAttribute('class', 'ingredient');
    ingredientsBox.appendChild(item);
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
    let stateText = document.querySelector('#recipes ol p');
    stateText.style.display = 'none';

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

      let title = document.createElement('p');
      title.textContent = data[i].id;
      label.appendChild(title);

      // let input = document.createElement('input');
      // input.setAttribute('type', 'checkbox');
      // input.setAttribute('id', data[i].title);
      // input.setAttribute('value', data[i].title);
      // input.setAttribute('name', 'selectedRecipe');
      // item.appendChild(input);
    }
  } else {
    let stateText = document.querySelector('#recipes ol p');
    stateText.textContent = 'No correct ingredient';
  }
});

// Get value of selected recipe
// www.themealdb.com/api/json/v1/1/lookup.php?i=52772
// Get whole recipe by entering the id of the recipe

// function selecRec() {
//   let recipes = document.getElementsByName('selectedRecipe');

//   let selected;

//   for (let i in recipes) {
//     console.log(recipes[i].checked);
//     if (recipes[i].checked) {
//       selected = recipes[i].value;
//       console.log(selected);
//     }
//   }
// }

let inputChosenRecipe = document.querySelector('#chosen-recipe');
const chosenRecipeForm = document.querySelector('#recipes form');

chosenRecipeForm.addEventListener('submit', function (e) {
  e.preventDefault();
  socket.emit('chosenRecipe', inputChosenRecipe.value);
});

// Show chosen recipe -->

// RENDER IT IN /MATCH TEMPLATE!
socket.on('dataRecipe', (data) => {
  if (data !== null) {
    let stateText = document.querySelector('#recipes ol p');
    stateText.style.display = 'none';

    for (let i in data) {
      let item = document.createElement('li');
      item.setAttribute('class', 'recipe-response');
      list.appendChild(item);

      let image = document.createElement('img');
      image.setAttribute('src', data[i].preview);
      image.setAttribute('alt', data[i].title);
      image.setAttribute('style', 'width:50px;');
      item.appendChild(image);

      let title = document.createElement('p');
      title.textContent = `chosen: ${data[i].id}`;
      item.appendChild(title);
    }
  } else {
    let stateText = document.querySelector('#recipes ol p');
    stateText.textContent = 'No correct ingredient';
  }
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

// function that checks when all input[type=checkbox] are checked from the instructions challenge --> then finished animation (toggle class)
function finished() {
  // lorem
}

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

ingredientsForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (inputQuery.value) {
    socket.emit('query', { query: inputQuery.value });
    inputQuery.value = '';
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
  addMessage(emitted.name, emitted.message);
});

// Add ingredient to box
function addIngredient(ingredient) {
  var item = document.createElement('li');
  item.textContent = ingredient;
  item.setAttribute('class', 'ingredient');
  ingredientsBox.appendChild(item);
}

// Add message to chatbox
function addMessage(name, message) {
  var item = document.createElement('li');
  // name = convertNameSelf(name);
  item.textContent = `${name}: ${message}`;
  item.setAttribute('class', 'newMsg');
  chatBox.appendChild(item);
  setTimeout(() => {
    item.removeAttribute('class', 'newMsg');
  }, 1500);
}

// // issue: somebody else can have the same name
// // Checks if name of the messager is the same as the client
// function convertNameSelf(name) {
//   if (name === inputName.value) {
//     return (name = '(Yourself)');
//   } else {
//     return name;
//   }
// }

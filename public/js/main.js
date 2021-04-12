var socket = io();
var chatPart = document.querySelector('ol');
var form = document.querySelector('form');
var inputName = document.querySelector('#name');
var inputQuery = document.querySelector('#query-ingredient');
var message = document.querySelector('.chat-message');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (inputQuery.value) {
    socket.emit('message', {
      name: inputName.value,
      query: inputQuery.value,
    });
    inputName.setAttribute('disabled', 'disabled');
    inputQuery.value = '';
  }
});

socket.on('message', (emitted) => {
  addMessage(emitted.name, emitted.query);
});

function addMessage(name, message) {
  var item = document.createElement('li');
  name = convertNameSelf(name);
  item.textContent = `${name}: ${message}`;
  item.setAttribute('class', 'chat-message');
  chatPart.appendChild(item);
}

// issue: somebody else can have the same name
// Checks if name of the messager is the same as the client
function convertNameSelf(name) {
  if (name === inputName.value) {
    return (name = '(Yourself)');
  } else {
    return name;
  }
}

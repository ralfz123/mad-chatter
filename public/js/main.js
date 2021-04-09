var socket = io();
var messages = document.querySelector('ol');
var form = document.querySelector('form');
var inputName = document.querySelector('#name');
var inputMessage = document.querySelector('#message');
var message = document.querySelector('.chat-message');

form.addEventListener('submit', function (e) {
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

function addMessage(name, message) {
  var item = document.createElement('li');
  name = convertNameSelf(name);
  item.textContent = `${name}: ${message}`;
  item.setAttribute('class', 'chat-message');
  messages.appendChild(item);
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

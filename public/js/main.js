var socket = io();
var messages = document.querySelector('ul');
var form = document.querySelector('form');
var input = document.querySelector('input');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('message', input.value);
    input.value = '';
  }
});

socket.on('message', (messageText) => {
    addMessage(messageText)
});

function addMessage(message) {
  var item = document.createElement('li');
  item.textContent = message;
  messages.appendChild(item);
}

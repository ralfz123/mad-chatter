import { loader } from './loader.js';

// function that makes all response from the data
export function addRecipes(data) {
  if (data !== null) {
    loader('hide');
    let stateText = document.querySelector('#recipes ol p');
    stateText.style.display = 'none';

    // Recipes List
    const list = document.querySelector('#recipes ol');

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
        label.setAttribute('for', data[i].id);
        item.appendChild(label);

        let input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('id', data[i].id);
        input.setAttribute('value', data[i].id);
        input.setAttribute('name', 'recipes');
        label.appendChild(input);

        let image = document.createElement('img');
        image.setAttribute('src', data[i].preview);
        image.setAttribute('alt', data[i].title);
        label.appendChild(image);

        let imageText = document.createElement('div');
        let text = document.createElement('p');
        text.textContent = data[i].title;
        imageText.appendChild(text);
        label.appendChild(imageText);
      }
    }
  } else {
    // ! Remove all old recipes
    loader('hide');
    let stateText = document.querySelector('#recipes ol p');
    stateText.textContent = 'Incorrect ingredient';
    stateText.setAttribute('class', 'errorMsg');
  }
}

// Add liked recipes to DOM
//  I strive to this (as by the roomUsers):  function outputLikedrecipes(room, recipes) -- Display the array
export function outputLikedRecipes(recipes) {
  console.log('global array: ', recipes);
  const recipesContainer = document.querySelector('.likedRecipes');
  const recipesList = document.querySelector('.likedRecipes ul');
  recipesList.textContent = '';
  let title = document.createElement('h3');
  title.textContent = 'Liked recipes';
  title.style.textDecoration = 'underline';
  recipesContainer.appendChild(title);
  recipesContainer.style.animation = 'glow 2s ease-in-out';

  recipes.forEach((recipe) => {
    // console.log('recipe data Obj: ', recipe.data);
    const li = document.createElement('li');
    // let recipeTitle = document.createElement('p');
    // let recipeId = document.createElement('p');
    let recipeImage = document.createElement('img');

    // recipeTitle.textContent = recipe.title;
    // recipeId.textContent = recipe.id;
    recipeImage.setAttribute('src', recipe.preview);

    // li.appendChild(recipeTitle);
    // li.appendChild(recipeId);
    li.appendChild(recipeImage);
    recipesList.appendChild(li);
  });
}

export function outputAlert(msg, className) {
  const header = document.querySelector('header');
  let msgContainer = document.createElement('div');
  msgContainer.setAttribute('class', className);
  header.appendChild(msgContainer);
  let msgTxt = document.createElement('p');
  msgTxt.textContent = msg;
  msgContainer.appendChild(msgTxt);

  // Removes HTML msg container after 1.5 s
  setTimeout(function () {
    msgContainer.remove();
  }, 3000);
}

// Add users to DOM
export function outputUsers(room, users) {
  const userList = document.querySelector('.users');
  userList.textContent = '';
  let roomName = document.createElement('h3');
  roomName.textContent = room.toUpperCase();
  userList.appendChild(roomName);
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user.username;
    userList.appendChild(li);
  });
}

// Add message to chatbox DOM
export function addMessage({ user, message }) {
  const chatBox = document.querySelector('#messages');

  let item = document.createElement('li');
  item.setAttribute('class', 'newMsg');
  let itemText = document.createElement('p');
  item.appendChild(itemText);

  let username = document.createElement('span');
  // name = convertNameSelf(name);
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

// // replace with user socket id --- Checks if name of the messager is the same as the client
// function convertNameSelf(name) {
//   if (name === inputName.value) {
//     return (name = '(Yourself)');
//   } else {
//     return name;
//   }
// }

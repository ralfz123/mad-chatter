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
export function outputLikedRecipe({ preview }) {
  const recipesContainer = document.querySelector('.likedRecipes');
  const recipesList = document.querySelector('.likedRecipes ul');
  recipesContainer.style.animation = 'glow 2s ease-in-out';
  // let msg = document.querySelector('.recipesMsg');
  // msg.style.display = 'none';

  const li = document.createElement('li');
  let recipeImage = document.createElement('img');

  recipeImage.setAttribute('src', preview);

  li.appendChild(recipeImage);
  recipesList.appendChild(li);
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

// recipe alert limit for first joined user and clients
export function outputRecipeAlert(data) {
  let type = data.type;
  let msg = data.msg;
  let recipe = data.data;

  let msgUser = document.querySelector('.msgContainerRecipeLimitUser');
  let msgAllUsers = document.querySelector('.msgContainerRecipeLimitAll');

  // Disable add button
  let addRecipeBtn = document.querySelector('#recipes form button');
  addRecipeBtn.setAttribute('disabled', 'disabled');

  if (type == 'allUsers') {
    console.log('data all users: ', recipe);
    msgAllUsers.style.display = 'block';

    let msgTxt = document.querySelector('.msgContainerRecipeLimitAll p');
    msgTxt.textContent = `${msg}`;
  } else if (type == 'firstUser') {
    msgUser.style.display = 'block';
    console.log('data first user:', recipe);

    let message = data.msg;

    // static
    let msgTxt = document.querySelector('.msgContainerRecipeLimitUser p');
    msgTxt.textContent = `${message}`;

    let list = document.querySelector('.msgContainerRecipeLimitUser form ol');

    // data component
    for (let i in recipe) {
      let item = document.createElement('li');
      item.setAttribute('class', 'choose-recipes');
      list.appendChild(item);

      let label = document.createElement('label');
      label.setAttribute('for', recipe[i].recipeId);
      item.appendChild(label);

      let input = document.createElement('input');
      input.setAttribute('type', 'radio');
      input.setAttribute('id', recipe[i].recipeId);
      input.setAttribute('value', recipe[i].recipeId);
      input.setAttribute('name', 'chosenRecipe');
      label.appendChild(input);

      let image = document.createElement('img');
      image.setAttribute('src', recipe[i].recipeImage);
      image.setAttribute('alt', recipe[i].recipeTitle);
      label.appendChild(image);

      let text = document.createElement('p');
      text.textContent = recipe[i].recipeTitle;
      label.appendChild(text);
    }

    // delete other message
    let msg = document.querySelector('.msgContainerRecipeLimitAll');
    msg.style.display = 'none';
  }
}

// Add users to DOM
export function outputUsers(room, users) {
  // console.log('room: ', room);
  // console.log('users: ', users);
  const userList = document.querySelector('.users');
  userList.textContent = '';
  let roomName = document.createElement('h3');
  roomName.textContent = `Room ${room}`;
  userList.appendChild(roomName);
  users.forEach((user) => {
    // console.log('userdata: ', user);
    const li = document.createElement('li');
    li.textContent = user.username;
    userList.appendChild(li);
  });
}

// Add message to chatbox DOM
export function addMessage({ user, message }) {
  const chatBox = document.querySelector('#messages');

  let item = document.createElement('li');

  let className;
  // Detects if message is from bot or real user
  if (user == 'chatBot') {
    className = 'newMsgBot';
  } else {
    className = 'newMsg';
  }

  item.setAttribute('class', className);
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

  if (user !== 'chatBot') {
    setTimeout(() => {
      item.removeAttribute('class', 'newMsg');
    }, 1500);
  }
  //  else {
  //   null;
  // }
}

// Add History chat to DOM
export function historyOutputChat(chatMessages) {
  const chatBox = document.querySelector('#messages');
  // chatBox.textContent = '';

  chatMessages.forEach((msg) => {
    let item = document.createElement('li');
    let itemText = document.createElement('p');
    item.appendChild(itemText);

    let username = document.createElement('span');
    username.textContent = `${msg.user}: `;
    username.style.fontWeight = 'bold';
    itemText.appendChild(username);

    let messageText = document.createElement('span');
    messageText.textContent = msg.message;
    itemText.appendChild(messageText);

    chatBox.appendChild(item);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// Add liked recipes to DOM
export function historyOutputLikedRecipes(recipesData) {
  // let data = recipes.recipes;
  console.log('history recipes: ', recipesData);
  const recipesContainer = document.querySelector('.likedRecipes');
  const recipesList = document.querySelector('.likedRecipes ul');
  // recipesList.textContent = '';
  // let title = document.createElement('h3');
  // title.textContent = 'Liked recipes';
  // title.style.textDecoration = 'underline';
  // recipesContainer.appendChild(title);
  recipesContainer.style.animation = 'glow 2s ease-in-out';
  if (recipesData.length) {
    recipesData.forEach((recipe) => {
      // let msg = document.querySelector('.recipesMsg');
      // msg.style.display = 'none';
      // console.log('recipe data Obj: ', recipe.data);
      const li = document.createElement('li');
      // let recipeTitle = document.createElement('p');
      // let recipeId = document.createElement('p');
      let recipeImage = document.createElement('img');

      // recipeTitle.textContent = recipe.title;
      // recipeId.textContent = recipe.recipe;
      recipeImage.setAttribute('src', recipe.recipeImage);

      // li.appendChild(recipeTitle);
      // li.appendChild(recipeId);
      li.appendChild(recipeImage);
      recipesList.appendChild(li);
    });
  } else {
    null;
    // const li = document.createElement('li');
    // li.setAttribute('class', 'recipesMsg');
    // const text = document.createElement('p');
    // text.textContent = 'No liked recipes yet';
    // li.appendChild(text);
    // recipesList.appendChild(li);
  }
}

export function outputWonRecipe(user, wonRecipe) {
  // set display to 'block' and render data in it (for all users) io.to(room).emit
  //  1. Make Display
  // 2. Render data so all users can watch it make the dish

  if (wonRecipe !== null || wonRecipe !== undefined) {
    console.log(wonRecipe);
    let title = wonRecipe.title;
    let category = wonRecipe.category;
    let ingredients = wonRecipe.ingredients;
    let instructions = wonRecipe.instructions;
    let preview = wonRecipe.preview;
    let video = wonRecipe.video;

    console.log('make el, chosen by: ', user);
    const homeSecOne = document.querySelector('#chat-query');
    const homeSecTwo = document.querySelector('#recipes');
    const wonSec = document.querySelector('#won-recipe');

    homeSecOne.style.display = 'none';
    homeSecTwo.style.display = 'none';
    wonSec.style.display = 'flex';

    const titleRecipe = document.querySelector('#won-recipe h2 span');
    titleRecipe.textContent = title;

    const image = document.querySelector('#won-recipe img');
    image.setAttribute('src', preview);
    image.setAttribute('alt', title);

    const categoryRecipe = document.querySelector(
      '#won-recipe p:nth-of-type(1) span'
    );
    categoryRecipe.textContent = category;

    // ingredients
    const ingredientsRecipe = document.querySelector(
      '#won-recipe form:nth-of-type(1) ul'
    );
    console.log(ingredientsRecipe);

    ingredients.forEach((ingredient) => {
      const item = document.createElement('li');
      const itemText = document.createElement('p');
      itemText.textContent = ingredient;
      item.appendChild(itemText);

      ingredientsRecipe.appendChild(item);
    });

    // instructions
    const instructionsRecipe = document.querySelector(
      '#won-recipe form:nth-of-type(2) ol'
    );

    instructions.forEach((step) => {
      const item = document.createElement('li');
      const itemText = document.createElement('p');
      itemText.textContent = step;
      item.appendChild(itemText);

      instructionsRecipe.appendChild(item);
    });

    // video
    if (!video) {
      // youtubue.com/q=title
      let link = document.createElement('a');
      link.setAttribute(
        'href',
        `https://www.youtube.com/results?search_query=${title}`
      );
      wonSec.appendChild(link);
    } else {
      const videoRecipe = document.createElement('iframe');
      videoRecipe.setAttribute('id', 'ytplayer');
      videoRecipe.setAttribute('type', 'text/html');
      videoRecipe.setAttribute('width', '360');
      videoRecipe.setAttribute('height', '360');
      videoRecipe.setAttribute('src', video);
      videoRecipe.setAttribute('frameborder', '0');

      wonSec.appendChild(videoRecipe);
    }
  }
}

// export function historyOutputWonRecipe(wonRecipe) {
//   console.log(wonRecipe);
//   if (wonRecipe !== null) {
//     // const homeSecOne = document.querySelector('#chat-query');
//     // const homeSecTwo = document.querySelector('#recipes');
//     // const wonSec = document.querySelector('#won-recipe');

//     // homeSecOne.style.display = 'none';
//     // homeSecTwo.style.display = 'none';
//     // wonSec.style.display = 'flex';
//     let user = 'jan';
//     outputWonRecipe(user, wonRecipe);
//   }
// }

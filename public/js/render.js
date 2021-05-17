import { loader } from './loader.js';

// Make recipes as list items of the data
export function addRecipes(data) {
  if (data !== null) {
    loader('hide');
    let stateText = document.querySelector('#recipes ol p');
    stateText.style.display = 'none';

    // Recipes List
    const list = document.querySelector('#recipes ol');

    // Update-pattern: removes recipes from old query
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
        let categoryText = document.createElement('p');
        categoryText.textContent = data[i].category;
        imageText.appendChild(categoryText);
        label.appendChild(imageText);
      }
    }
  } else {
    // Remove all old recipes
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
  recipesContainer.setAttribute('style', 'animation:glow .5s ease-in-out');

  // Removes HTML msg container after 1.5 s
  setTimeout(function () {
    recipesContainer.setAttribute('style', '');
  }, 1200);

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
    // console.log('data all users: ', recipe);
    msgAllUsers.style.display = 'block';

    let msgTxt = document.querySelector('.msgContainerRecipeLimitAll p');
    msgTxt.textContent = `${msg}`;
  } else if (type == 'firstUser') {
    msgUser.style.display = 'block';
    // console.log('data first user:', recipe);

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

export function checkOutputLikedRecipesLimit(state, firstUser) {
  if (state == true) {
    const dataObj = {
      type: 'allUsers',
      msg: `There are already 5 recipes chosen. ${firstUser} has to choose one recipe you all are going to make!`,
      data: null,
    };
    console.log(state);

    outputRecipeAlert(dataObj);
  }
  // else if (state == false) {
  // }
}

// Add users to DOM
export function outputUsers(room, users) {
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
  // console.log('history recipes: ', recipesData);
  const recipesContainer = document.querySelector('.likedRecipes');
  const recipesList = document.querySelector('.likedRecipes ul');
  // recipesList.textContent = '';
  // let title = document.createElement('h3');
  // title.textContent = 'Liked recipes';
  // title.style.textDecoration = 'underline';
  // recipesContainer.appendChild(title);
  // recipesContainer.style.animation = 'glow 2s ease-in-out';
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

export function outputWonRecipe(wonRecipe) {
  const homeSecOne = document.querySelector('#chat-query');
  const homeSecTwo = document.querySelector('#recipes');
  const wonSec = document.querySelector('#won-recipe');
  const msgAllUsers = document.querySelector('.msgContainerRecipeLimitAll');

  homeSecOne.style.display = 'none';
  homeSecTwo.style.display = 'none';
  wonSec.style.display = 'flex';
  msgAllUsers.style.display = 'none';

  let username = wonRecipe.user;
  let title = wonRecipe.recipe.title;
  let category = wonRecipe.recipe.category;
  let ingredients = wonRecipe.recipe.ingredients;
  let instructions = wonRecipe.recipe.instructions;
  let preview = wonRecipe.recipe.preview;
  let video = wonRecipe.recipe.video;

  // Username
  let user = document.querySelector('#won-recipe span');
  user.textContent = username;

  // Title recipe
  const titleRecipe = document.querySelector('#won-recipe h2 span');
  titleRecipe.textContent = title;

  // Image recipe
  const image = document.querySelector('#won-recipe img');
  image.setAttribute('src', preview);
  image.setAttribute('alt', title);

  // Category recipe
  const categoryRecipe = document.querySelector('#won-recipe p:nth-of-type(2)');
  categoryRecipe.textContent = category;

  // Ingredients recipe
  const ingredientsRecipe = document.querySelector(
    '#won-recipe form:nth-of-type(1) ul'
  );

  ingredients.forEach((ingredient) => {
    const item = document.createElement('li');
    const itemText = document.createElement('p');
    itemText.textContent = ingredient;
    item.appendChild(itemText);

    ingredientsRecipe.appendChild(item);
  });

  // Instructions recipe
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

  // Video recipe
  if (!video || video == '') {
    // Text
    let text = document.createElement('p');
    text.textContent = `No video available from the food API, but you can check the available YouTube video's about ${title} `;

    // Link
    let link = document.createElement('a');
    link.setAttribute(
      'href',
      `https://www.youtube.com/results?search_query=${title}`
    );
    link.setAttribute('target', '_blank');
    link.textContent = 'here';
    text.appendChild(link);
    wonSec.appendChild(text);
  } else {
    // makes link to YouTube with as query the recipe title
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

export function historyOutputWonRecipe(wonRecipe) {
  if (wonRecipe != null || wonRecipe != undefined) {
    console.log('history data: ', wonRecipe);
    outputWonRecipe(wonRecipe);
  }
}

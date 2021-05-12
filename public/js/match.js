// setTimer();
// // Timer from player
// function setTimer() {
//   const form = document.querySelector('#match form');
//   if (form) {
//     form.addEventListener('submit', function (e) {
//       e.preventDefault();
//       // Create countdown section
//       const countdownPlace = document.querySelector('#match article p span');
//       let timer = document.querySelector('#timer');
//       let timerHours = timer.value;
//       let timerMinutes = timerHours * 60; // convert hours to minutes
//       let timerSeconds = timerMinutes * 60; // convert minutes to seconds

//       countdownPlace.textContent = timerSeconds;

//       setInterval(function () {
//         let container = document.createElement('div');
//         container.setAttribute(
//           'style',
//           'position: absolute;background: #3e3e3ebf;left: 0;right: 0;margin-left: auto;margin-right: auto;width: 100%;text-align: center;top: 0;display: block;color: black;height: 100%;align-self: center;font-size: 9rem;'
//         );
//         let text = document.createElement('p');
//         text.textContent = 'Time is up! {playerName} has won!';
//         text.setAttribute('style', 'font-size:4rem;');
//         container.appendChild(text);

//         let body = document.querySelector('#playerdata');
//         body.setAttribute('style', 'position:relative;');
//         body.appendChild(container);

//         let pOneData = document.querySelector('#player-one');
//         pOneData.setAttribute('style', 'filter: blur(2px);');
//       }, timerSeconds * 1000);
//     });
//   } else {
//     null;
//   }
// }

// BACKLOG: function that checks when all input[type=checkbox] are checked from the instructions challenge --> then finished animation (toggle class)
// function finished() {
//   let form = document.querySelector('.recipe-instructions ~ form');
//   // let finishBtn = document.querySelector('.recipe-instructions ~ form button');

//   form.addEventListener('submit', function (e) {
//     e.preventDefault();
//     console.log(`You're done!`);
//     let container = document.createElement('div');
//     container.setAttribute(
//       'style',
//       'position: absolute;background: #3e3e3ebf;left: 0;right: 0;margin-left: auto;margin-right: auto;width: 100%;text-align: center;top: 0;display: block;color: black;height: 100%;align-self: center;font-size: 9rem;'
//     );
//     let text = document.createElement('p');
//     text.textContent = '{playerName} has won!';
//     text.setAttribute('style', 'font-size:4rem;');
//     container.appendChild(text);

//     let link = document.createElement('a');
//     link.setAttribute('href', '/');
//     link.textContent = 'Try again';
//     container.appendChild(link);

//     let body = document.querySelector('#playerdata');
//     body.setAttribute('style', 'position:relative;');
//     body.appendChild(container);

//     let pOneData = document.querySelector('#player-one');
//     pOneData.setAttribute('style', 'filter: blur(2px);');
//   });
// }

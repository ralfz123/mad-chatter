/**
 * Makes a random number for room id
 *
 * @param {Number} length of room id characters
 * @return {Number} room id
 *
 */

function idCreator(length) {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

module.exports = { idCreator };

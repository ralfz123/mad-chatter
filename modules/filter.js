/**
 * Makes new array with needed data variables
 *
 * @param {string} jsonData - Dirty cat data
 * @return {string} jsonData - Clean cat data
 *
 */

function filterCatData(rawCatData) {
    return {
      id: rawCatData[0].id,
      url: rawCatData[0].url,
    };
  }
  
  /**
   * Makes new object with needed data variables (this is another way to "map" an object, because this data consists of an object)
   *
   * @param {string} jsonData - Dirty joke data
   * @return {string} jsonData - Clean joke data
   *
   */
  
  function filterJokeData(rawJokeData) {
    return {
      id: rawJokeData.id,
      setup: rawJokeData.setup,
      punchline: rawJokeData.punchline,
    };
  }
  
  module.exports = { filterCatData, filterJokeData };
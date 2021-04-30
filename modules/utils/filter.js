/**
 * Makes new array with needed data variables
 *
 * @param {string} jsonData - Dirty data
 * @return {string} jsonData - Clean data
 *
 */

function filterData(rawData) {
  const dataObject = rawData.map((el) => {
    // Splitted up a text blob into seperated sentences
    let rawText = el.strInstructions;
    let intoSentences = rawText
      .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
      .split('|');

    // Converts Youtube URLs to embedded URLs
    const oldVideoUrl = el.strYoutube;
    let newVideoUrl = oldVideoUrl.replace('watch?v=', 'embed/');

    return {
      id: el.idMeal,
      title: el.strMeal,
      category: el.strCategory,
      ingredients: [
        el.strIngredient1,
        el.strIngredient2,
        el.strIngredient3,
        el.strIngredient4,
        el.strIngredient5,
        el.strIngredient6,
        el.strIngredient7,
        el.strIngredient9,
        el.strIngredient9,
        el.strIngredient10,
        el.strIngredient11,
        el.strIngredient12,
        el.strIngredient13,
        el.strIngredient14,
        el.strIngredient15,
        el.strIngredient16,
      ],
      instructions: intoSentences,
      preview: el.strMealThumb,
      video: newVideoUrl,
    };
  });

  return dataObject;
}

// check which ingredients are !null and
// Or put all ingrdeins in a selfcfreated array and then filter over it and check if its null
function filterIngredients(data) {
  let filteredIngredients = data[0].ingredients.filter((ingredient) => {
    return ingredient != '' && ingredient != null;
  });
  return filteredIngredients;
}
module.exports = filterData;

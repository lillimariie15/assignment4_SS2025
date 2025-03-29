/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
       Called on page load to start all the requests:
       - Fetch random meal
       - Display meal
       - Map meal category to spirit
       - Fetch matching (or random) cocktail
       - Display cocktail
*/
function init() {
  fetchRandomMeal()
    .then((meal) => {
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchCocktailByDrinkIngredient(spirit);
    })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */
function fetchRandomMeal() {
    // Fill in
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(response => response.json())
    .then(data => {
      console.log(data);

      //veien for å hente informasjon
      let meal = data.meals[0];
      //linker meal dataen til funksjonen som viser det i HTML dokumentet
      displayMealData(meal)
      })
    }


/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/
function displayMealData(meal) {
    //Image
    document.getElementById("img").src = meal.strMealThumb;

    //Meal Name
    document.getElementById("MealName").textContent = meal.strMeal;

    //category
    document.getElementById("category").textContent = "Category: " + meal.strCategory;

    //ingredients
    let ingredientList = document.getElementById("ingredients");

    for ( let i = 1; i <= 20; i++){
      let ingredient = meal["strIngredient" + i];
      let measure = meal["strMeasure" + i];

      if (!ingredient || ingredient.trim() === "") { 
        break; 
      }
      else {
        const li = document.createElement("li");
    
        li.textContent = measure + " " + ingredient;
        ingredientList.appendChild(li);
      }}

      //instructions
      document.getElementById("instructions").textContent = meal.strInstructions
}

/*
Convert MealDB Category to a TheCocktailDB Spirit
Looks up category in our map, or defaults to 'cola'
*/
function mapMealCategoryToDrinkIngredient(category) {
  if (!category) return "cola";
  return mealCategoryToCocktailIngredient[category] || "cola";
}

/*
Fetch a Cocktail Using a Spirit from TheCocktailDB
Returns Promise that resolves to cocktail object
We call https://www.thecocktaildb.com/api/json/v1/1/search.php?s=DRINK_INGREDIENT to get a list of cocktails
Don't forget encodeURIComponent()
If no cocktails found, fetch random
*/
function fetchCocktailByDrinkIngredient(drinkIngredient) {
    // Fill in
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
function fetchRandomCocktail() {
    // Fill in
}

/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
    // Fill in
}

/*
Call init() when the page loads
*/
window.onload = init;

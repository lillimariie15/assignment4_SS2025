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
        .then(function(meal) {
            displayMealData(meal);
            const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
            console.log("Matchende drikkeingrediens:", spirit);
            return fetchCocktailByDrinkIngredient(spirit);
        })
        .then(function(cocktail) {
            displayCocktailData(cocktail);
        })
        .catch(function(error) {
            console.error("Error i init-funksjonen:", error);
        });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */
function fetchRandomMeal() {
  return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("Måltids-API fungerer:", data);
            let meal = data.meals[0];
            return meal; // Returnerer måltidsobjektet
        })
        .catch(function(error) {
            console.error("Feil ved henting av måltid:", error);
        });
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
  console.log("Henter cocktail for:", drinkIngredient);
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(drinkIngredient)}`;

    return fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.drinks && data.drinks.length > 0) {
                console.log("Fant cocktail:", data.drinks[0]);
                return data.drinks[0]; // Returnerer cocktailobjektet
            } else {
                console.log("Ingen match, henter tilfeldig cocktail");
                return fetchRandomCocktail(); // Henter tilfeldig cocktail hvis ingen match
            }
        })
        .catch(function(error) {
            console.error("Feil ved henting av cocktail:", error);
            return fetchRandomCocktail();
        });
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
function fetchRandomCocktail() {
  console.log("Henter tilfeldig cocktail");
    return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("Tilfeldig cocktaildata:", data);
            return data.drinks[0]; // Returnerer cocktailobjektet
        })
        .catch(function(error) {
            console.error("Feil ved henting av tilfeldig cocktail:", error);
        });
}

/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
  if (!cocktail) {
    console.error("Ingen cocktaildata tilgjengelig");
    return;
}

// Bilde
document.getElementById("drinkimg").src = cocktail.strDrinkThumb;

// Navn
document.getElementById("cname").textContent = cocktail.strDrink;

// Kategori
document.getElementById("cCategory").textContent = "Category: " + (cocktail.strCategory || "Unknown");

// Ingredienser
let ingredientList = document.getElementById("cIngredients");
ingredientList.innerHTML = ""; // Tømmer tidligere innhold

for (let i = 1; i <= 15; i++) {
    let ingredient = cocktail["strIngredient" + i];
    let measure = cocktail["strMeasure" + i];

    if (!ingredient || ingredient.trim() === "") {
        break;
    }

    const li = document.createElement("li");
    li.textContent = (measure ? measure + " " : "") + ingredient;
    ingredientList.appendChild(li);
}
}


/*
Call init() when the page loads
*/
window.onload = init;

$(document).ready(function () {
  $("#searchForm").submit(function (e) {
    e.preventDefault();
    const cocktailName = $("#cocktailName").val();
    searchCocktailByName(cocktailName);
  });

  $("#randomCocktail").click(function () {
    getRandomCocktail();
  });
});

function searchCocktailByName(name) {
  const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`;

  if (name.trim() === "") {
    displayError("No cocktails match the search.");
    return;
  }
  $.ajax({
    url: apiUrl,
    dataType: "json",
    success: function (data) {
      displayResults(data.drinks);
    },
    error: function () {
      displayError("No cocktails match the search.");
    },
  });
}

function getRandomCocktail() {
  const apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

  $.ajax({
    url: apiUrl,
    dataType: "json",
    success: function (data) {
      displayResults(data.drinks);
    },
    error: function () {
      displayError(
        "An error occurred while searching for the random cocktail."
      );
    },
  });
}

function displayResults(cocktails) {
  const resultsContainer = $("#results");
  const resultCountContainer = $("#resultCount");
  resultsContainer.empty();

  if (cocktails === null || cocktails.length === 0) {
    resultCountContainer.html("<p>No results found.</p>");
    return;
  }

  resultCountContainer.html(`<p>${cocktails.length} result(s) found.</p>`);

  cocktails.forEach((cocktail) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      if (ingredient) {
        ingredients.push(`${ingredient}`);
      }
    }

    const isAlcoholic = cocktail.strAlcoholic.toLowerCase() === "alcoholic";
    const badgeText = isAlcoholic ? "Alcoholic" : "No-Alcoholic";
    const badgeClass = isAlcoholic ? "alcohol-badge" : "no-alcohol-badge";
    const alcoholicBadge = `<span class="${badgeClass}">${badgeText}</span>`;

    const resultInfo = `
            <div class="result">
                <p><strong>${cocktail.strDrink} ${alcoholicBadge}</strong></p>
                <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                <p><strong>Type: </strong>${cocktail.strCategory}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>${ingredients
                  .map((ingredient) => `<li>${ingredient}</li>`)
                  .join("")}</ul>
            </div>
        `;
    resultsContainer.append(resultInfo);
  });
}

function displayError(message) {
  const resultsContainer = $("#results");
  const resultCountContainer = $("#resultCount");
  resultCountContainer.html("");
  resultsContainer.html(`<p id="error">${message}</p>`);
}

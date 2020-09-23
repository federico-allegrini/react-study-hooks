import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(
    () => {
      console.log("Rendering Ingredients", userIngredients);
    },
    // In the second argument specify when the function have to run
    // In this case only when "userIngredients" changes
    [userIngredients]
  );

  // useCallback caches our function, when component re-render the function will not be recreated
  const filteredIngredientsHandler = useCallback((loadedIngredients) => {
    setUserIngredients(loadedIngredients);
  }, []);

  const addIngredientHandler = async (ingredient) => {
    const response = await fetch(
      "https://react-hooks-update-9d013.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    );
    const responseData = await response.json();
    setUserIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: responseData.name, ...ingredient },
    ]);
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;

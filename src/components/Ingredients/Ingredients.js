import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  // Run "after" and for "every" render cycle
  // Without second argument acts like "componentDidUpdate", run after every component update
  useEffect(
    async () => {
      const response = await fetch(
        "https://react-hooks-update-9d013.firebaseio.com/ingredients.json"
      );
      const responseData = await response.json();
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount,
        });
      }
      setUserIngredients(loadedIngredients);
    },
    // With the second argument "[]" acts like "componentDidMount", run "only once" after the first render
    []
  );

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
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;

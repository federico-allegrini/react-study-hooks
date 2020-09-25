import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

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
    setIsLoading(true);
    const response = await fetch(
      "https://react-hooks-update-9d013.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    );
    setIsLoading(false);
    const responseData = await response.json();
    setUserIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: responseData.name, ...ingredient },
    ]);
  };

  const removeIngredientHandler = async (ingredientId) => {
    setIsLoading(true);
    try {
      await fetch(
        `https://react-hooks-update-9d013.firebaseio.com/ingredients/${ingredientId}.json`,
        { method: "DELETE" }
      );
      setIsLoading(false);
      setUserIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
      );
    } catch (error) {
      setError("Something went wrong: " + error.message);
    }
  };

  const clearError = () => {
    //When there are two or more setState int he same block, react batch the setState in one syncronous setState
    //Re-render is trigger "only once"
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

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

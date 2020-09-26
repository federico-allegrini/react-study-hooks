import React, { useReducer, useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
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
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
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
    const responseData = await response.json();
    setIsLoading(false);
    dispatch({
      type: "ADD",
      ingredient: { id: responseData.name, ...ingredient },
    });
  };

  const removeIngredientHandler = async (ingredientId) => {
    setIsLoading(true);
    try {
      await fetch(
        `https://react-hooks-update-9d013.firebaseio.com/ingredients/${ingredientId}.json`,
        { method: "DELETE" }
      );
      setIsLoading(false);
      dispatch({ type: "DELETE", id: ingredientId });
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

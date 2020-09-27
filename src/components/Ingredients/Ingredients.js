import React, { useReducer, useEffect, useCallback } from "react";

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

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw new Error("Should not get there!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

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
    dispatchHttp({ type: "SEND" });
    const response = await fetch(
      "https://react-hooks-update-9d013.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    );
    const responseData = await response.json();
    dispatchHttp({ type: "RESPONSE" });
    dispatch({
      type: "ADD",
      ingredient: { id: responseData.name, ...ingredient },
    });
  };

  const removeIngredientHandler = async (ingredientId) => {
    dispatchHttp({ type: "SEND" });
    try {
      await fetch(
        `https://react-hooks-update-9d013.firebaseio.com/ingredients/${ingredientId}.json`,
        { method: "DELETE" }
      );
      dispatchHttp({ type: "RESPONSE" });
      dispatch({ type: "DELETE", id: ingredientId });
    } catch (error) {
      dispatchHttp({
        type: "ERROR",
        errorMessage: "Something went wrong: " + error.message,
      });
    }
  };

  const clearError = () => {
    dispatchHttp({ type: "CLEAR" });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
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

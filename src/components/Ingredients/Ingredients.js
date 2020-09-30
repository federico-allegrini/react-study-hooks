import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

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
  const { isLoading, data, error, sendRequest } = useHttp();

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

  const addIngredientHandler = useCallback(async (ingredient) => {
    // dispatchHttp({ type: "SEND" });
    const response = await fetch(
      "https://react-hooks-update-9d013.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    );
    const responseData = await response.json();
    // dispatchHttp({ type: "RESPONSE" });
    dispatch({
      type: "ADD",
      ingredient: { id: responseData.name, ...ingredient },
    });
  }, []);

  // useCallback do not permit React to recreate the function at every render cycle
  // Is based on second argument dependecies, if is [] never recreate the function
  const removeIngredientHandler = useCallback(
    async (ingredientId) => {
      sendRequest(
        `https://react-hooks-update-9d013.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE"
      );
    },
    [sendRequest]
  );

  const clearError = useCallback(() => {
    // dispatchHttp({ type: "CLEAR" });
  }, []);

  // useMemo is an alternative of React.Memo
  // Do not recreate the component at every rerende cycle based on dependencies (inside second argument [])
  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;

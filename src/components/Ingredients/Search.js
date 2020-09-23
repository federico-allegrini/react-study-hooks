import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props; // Object destructuring
  const [enteredFilter, setEnteredFilter] = useState("");

  useEffect(
    () => {
      async function fetchUserIngredients() {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        const response = await fetch(
          "https://react-hooks-update-9d013.firebaseio.com/ingredients.json" +
            query
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
        onLoadIngredients(loadedIngredients);
      }
      fetchUserIngredients();
    },
    // If component re-render for props change, this function will never be executed because depend only on internal "enteredFilter" state
    // For this problem we have to add the "onLoadIngredients" (the only) props
    // If the "onLoadIngredients" will changes (is a function and this is not the case, but is mandatory!) this useEffect function will be executed
    [enteredFilter, onLoadIngredients]
  );

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;

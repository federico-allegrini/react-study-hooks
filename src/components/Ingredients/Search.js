import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props; // Object destructuring
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  useEffect(
    () => {
      async function fetchUserIngredients() {
        if (enteredFilter === inputRef.current.value) {
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
      }
      const timer = setTimeout(fetchUserIngredients, 500);
      // In useEffect you "can" return something, if you return something it MUST be a function
      // The function run when component will be unmounted
      // In this case run when a new keystroke is triggered, when the "enteredFilter" var change (before the new useEffect, with new value)
      return () => {
        // Use as cleanup function
        clearTimeout(timer);
      };
    },
    // If component re-render for props change, this function will never be executed because depend only on internal "enteredFilter" state
    // For this problem we have to add the "onLoadIngredients" (the only) props
    // If the "onLoadIngredients" will changes (is a function and this is not the case, but is mandatory!) this useEffect function will be executed
    [enteredFilter, onLoadIngredients, inputRef]
  );

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
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

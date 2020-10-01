import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props; // Object destructuring
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(
    () => {
      const timer = setTimeout(() => {
        if (enteredFilter === inputRef.current.value) {
          const query =
            enteredFilter.length === 0
              ? ""
              : `?orderBy="title"&equalTo="${enteredFilter}"`;
          sendRequest(
            "https://react-hooks-update-9d013.firebaseio.com/ingredients.json" +
              query,
            "GET"
          );
        }
      }, 500);
      // In useEffect you "can" return something, if you return something it MUST be a function
      // The function run when component will be unmounted
      // In this case run when a new keystroke is triggered, when the "enteredFilter" var change (before the new useEffect, with new value)
      return () => {
        // Use as cleanup function
        clearTimeout(timer);
      };
    },
    // If component re-render for props change, this function will never be executed because depend only on internal "enteredFilter" state
    [enteredFilter, inputRef, sendRequest]
  );

  useEffect(() => {
    if (isLoading || error || !data) return;
    const loadedIngredients = [];
    for (const key in data) {
      loadedIngredients.push({
        id: key,
        title: data[key].title,
        amount: data[key].amount,
      });
    }
    onLoadIngredients(loadedIngredients);
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
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

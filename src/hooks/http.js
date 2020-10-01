import { useReducer, useCallback } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  indentifier: null,
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        indentifier: action.indentifier,
      };
    case "RESPONSE":
      return {
        ...curHttpState,
        loading: false,
        data: action.data,
        extra: action.extra,
      };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not get there!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);
  const clear = useCallback(() => dispatchHttp({ type: "CLEAR" }), []);
  const sendRequest = useCallback(
    async (url, method, body, reqExtra, reqIndentifier) => {
      dispatchHttp({ type: "SEND", indentifier: reqIndentifier });
      try {
        const response = await fetch(url, {
          method: method,
          body: body,
          headers: { "Content-Type": "application/json" },
        });
        const responseData = await response.json();
        dispatchHttp({ type: "RESPONSE", data: responseData, extra: reqExtra });
      } catch (error) {
        dispatchHttp({
          type: "ERROR",
          errorMessage: "Something went wrong: " + error.message,
        });
      }
    },
    []
  );
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIndentifier: httpState.indentifier,
    clear: clear,
  };
};

export default useHttp;

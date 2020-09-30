import { useReducer, useCallback } from "react";

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null, data: null };
    case "RESPONSE":
      return { ...curHttpState, loading: false, data: action.responseData };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw new Error("Should not get there!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
  });
  const sendRequest = useCallback(async (url, method, body) => {
    dispatchHttp({ type: "SEND" });
    try {
      const response = await fetch(url, {
        method: method,
        body: body,
        headers: { "Content-Type": "application/json" },
      });
      const responseData = await response.json();
      dispatchHttp({ type: "RESPONSE", data: responseData });
    } catch (error) {
      dispatchHttp({
        type: "ERROR",
        errorMessage: "Something went wrong: " + error.message,
      });
    }
  }, []);
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
  };
};

export default useHttp;

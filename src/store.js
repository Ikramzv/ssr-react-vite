import { configureStore } from "@reduxjs/toolkit";
import {
  middleware as commentMiddleware,
  reducer as commentReducer,
} from "./api/query";

const store = configureStore({
  reducer: {
    comments: commentReducer,
    user: (state = { name: "", surname: "" }, action) => {
      return state;
    },
  },
  preloadedState: (() => {
    console.log(typeof window !== "undefined" && window.__PRELOADED_STATE__);
    return typeof window !== "undefined"
      ? { user: window.__PRELOADED_STATE__ }
      : {};
  })(),
  middleware: (getDefaultMiddlewares) => {
    return getDefaultMiddlewares().concat(commentMiddleware);
  },
});

export default store;

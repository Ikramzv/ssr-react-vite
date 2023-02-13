import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import store from "./store";

export const app = (
  <Provider store={store}>
    <Router basename="/">
      <Suspense fallback={<h2>Loading ...</h2>}>
        <App data={window.__APP_DATA__} />
      </Suspense>
    </Router>
  </Provider>
);

ReactDOM.hydrateRoot(document.getElementById("root"), app);

import React, { Suspense } from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server";
import App, { getServerSideProps } from "./App";
import store from "./store";

export async function render() {
  const fn = getServerSideProps;
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter basename="/">
        <Suspense fallback={<h2>Loading ...</h2>}>
          <App data={(await fn()).props.data} />
        </Suspense>
      </StaticRouter>
    </Provider>
  );
  return {
    html,
    fn,
  };
}

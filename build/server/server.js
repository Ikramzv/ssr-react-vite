import * as jsxRuntime from "react/jsx-runtime";
import { useState, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { useDispatch, Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server.mjs";
import { Link, useLocation, Routes, Route } from "react-router-dom";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configureStore } from "@reduxjs/toolkit";
const Fragment = jsxRuntime.Fragment;
const jsx = jsxRuntime.jsx;
const jsxs = jsxRuntime.jsxs;
const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
    cache: "default",
    credentials: "same-origin"
  }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getComments: builder.query({
      query: () => ({
        url: `/comments`,
        cache: "default"
      }),
      onQueryStarted(arg, api2) {
        api2.getCacheEntry();
        api2.getState();
      },
      providesTags: (result, err, args) => {
        return result.map((comment) => ({ type: "Comment", id: comment.id }));
      },
      onCacheEntryAdded(arg, api2) {
        api2.getCacheEntry();
        api2.getState();
      },
      transformResponse: (value, meta, arg) => {
        return value;
      },
      transformErrorResponse(value, meta, arg) {
        return value;
      }
    })
  }),
  reducerPath: "comments"
});
const {
  useGetCommentsQuery,
  useLazyGetCommentsQuery,
  reducer,
  middleware,
  util,
  endpoints,
  injectEndpoints
} = api;
function Comment({ comment, endpoint, isFetching, arg }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const undo = () => {
    dispatch();
  };
  const args = useMemo(() => arg ? arg : void 0, [arg]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.body === text)
      return;
    dispatch(
      util.updateQueryData(endpoint, args, (data) => {
        const result = data.map((dt) => {
          if (dt.id === comment.id) {
            return {
              ...dt,
              body: text
            };
          }
          return dt;
        });
        return result;
      })
    );
  };
  return /* @__PURE__ */ jsxs("div", { style: { background: "aqua", padding: "10px", marginBottom: "8px" }, children: [
    /* @__PURE__ */ jsx(Link, { to: `/comments?postId=${comment.postId}`, children: /* @__PURE__ */ jsx("h2", { children: isFetching ? "refetching ..." : comment.name }) }),
    /* @__PURE__ */ jsx("p", { children: comment.body }),
    /* @__PURE__ */ jsxs("form", { action: "", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: text,
          onChange: (e) => setText(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx("button", { style: { margin: "0 0 0 10px", cursor: "pointer" }, children: "Update" }),
      /* @__PURE__ */ jsx("button", { onClick: undo, children: "Undo" })
    ] })
  ] });
}
function EachComment() {
  const { useGetCommentQuery } = injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      getComment: builder.query({
        query: (postId2) => ({ url: `/comments?postId=${postId2}` })
      })
    })
  });
  const { search } = useLocation();
  const postId = useMemo(() => {
    return new URLSearchParams(search).get("postId");
  }, [search]);
  const { data, isLoading, isError, isFetching } = useGetCommentQuery(postId);
  if (isError)
    return /* @__PURE__ */ jsxs("h2", { style: { color: "red" }, children: [
      "Error happened ... ",
      JSON.stringify(error, null, 4),
      " "
    ] });
  if (isLoading)
    return /* @__PURE__ */ jsx("h2", { children: "Loading ..." });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h1", { children: [
      "Post ",
      postId,
      " ' s comments"
    ] }),
    /* @__PURE__ */ jsx(Link, { to: "/", children: "Go to home" }),
    data.map((comment) => /* @__PURE__ */ jsx(
      Comment,
      {
        isFetching,
        endpoint: "getComment",
        comment,
        arg: postId
      },
      comment.id
    ))
  ] });
}
const store = configureStore({
  reducer: {
    comments: reducer,
    user: (state = { name: "", surname: "" }, action) => {
      return state;
    }
  },
  preloadedState: (() => {
    console.log(typeof window !== "undefined" && window.__PRELOADED_STATE__);
    return typeof window !== "undefined" ? { user: window.__PRELOADED_STATE__ } : {};
  })(),
  middleware: (getDefaultMiddlewares) => {
    return getDefaultMiddlewares().concat(middleware);
  }
});
function App() {
  const [{ start, end }, setStartEnd] = useState({ start: 0, end: 100 });
  const { data, isError, isFetching, isLoading, error: error2 } = useGetCommentsQuery(
    void 0,
    { pollingInterval: 0 }
  );
  console.log(store.getState());
  if (isError)
    return /* @__PURE__ */ jsxs("h2", { style: { color: "red" }, children: [
      "Error happened ... ",
      JSON.stringify(error2, null, 4),
      " "
    ] });
  if (isLoading)
    return /* @__PURE__ */ jsx("h2", { children: "Loading ..." });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Link, { to: "/dashboard", children: "Go to dashboard" }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        value: start,
        onChange: (e) => setStartEnd({ start: e.target.value, end }),
        children: [
          /* @__PURE__ */ jsx("option", { value: 0, children: "0" }),
          /* @__PURE__ */ jsx("option", { value: 50, children: "50" }),
          /* @__PURE__ */ jsx("option", { value: 100, children: "100" }),
          /* @__PURE__ */ jsx("option", { value: 150, children: "150" }),
          /* @__PURE__ */ jsx("option", { value: 200, children: "200" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "select",
      {
        value: end,
        onChange: (e) => setStartEnd({ end: e.target.value, start }),
        children: [
          /* @__PURE__ */ jsx("option", { value: 100, children: "100" }),
          /* @__PURE__ */ jsx("option", { value: 250, children: "250" }),
          /* @__PURE__ */ jsx("option", { value: 300, children: "300" }),
          /* @__PURE__ */ jsx("option", { value: 350, children: "350" }),
          /* @__PURE__ */ jsx("option", { value: 400, children: "400" }),
          /* @__PURE__ */ jsx("option", { value: 450, children: "450" }),
          /* @__PURE__ */ jsx("option", { value: 500, children: "500" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(
        Route,
        {
          index: true,
          element: data.map((comment) => /* @__PURE__ */ jsx(
            Comment,
            {
              endpoint: "getComments",
              comment,
              isFetching
            },
            comment.id
          ))
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/dashboard",
          element: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h1", { children: "Dashboard" }),
            /* @__PURE__ */ jsx(Link, { to: "/", children: "Go back to home" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(Route, { path: `/comments`, element: /* @__PURE__ */ jsx(EachComment, {}) })
    ] })
  ] });
}
function render() {
  const html = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(Provider, { store, children: /* @__PURE__ */ jsx(StaticRouter, { basename: "/", children: /* @__PURE__ */ jsx(App, {}) }) })
  );
  return {
    html
  };
}
export {
  render
};

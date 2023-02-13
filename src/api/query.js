import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
    cache: "default",
    credentials: "same-origin",
  }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getComments: builder.query({
      query: () => ({
        url: `/comments`,
        cache: "default",
      }),
      onQueryStarted(arg, api) {
        const c = api.getCacheEntry();
        const s = api.getState();
      },
      providesTags: (result, err, args) => {
        return result.map((comment) => ({ type: "Comment", id: comment.id }));
      },

      onCacheEntryAdded(arg, api) {
        const c = api.getCacheEntry();
        const s = api.getState();
      },
      transformResponse: (value, meta, arg) => {
        return value;
      },
      transformErrorResponse(value, meta, arg) {
        return value;
      },
    }),
  }),
  reducerPath: "comments",
});

export const {
  useGetCommentsQuery,
  useLazyGetCommentsQuery,
  reducer,
  middleware,
  util,
  endpoints,
  injectEndpoints,
} = api;

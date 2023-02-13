import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { injectEndpoints } from "./api/query";
import Comment from "./Comment";

function EachComment() {
  const { useGetCommentQuery } = injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      getComment: builder.query({
        query: (postId) => ({ url: `/comments?postId=${postId}` }),
      }),
    }),
  });

  const { search } = useLocation();

  const postId = useMemo(() => {
    return new URLSearchParams(search).get("postId");
  }, [search]);

  const { data, isLoading, isError, isFetching } = useGetCommentQuery(postId);

  if (isError)
    return (
      <h2 style={{ color: "red" }}>
        Error happened ... {JSON.stringify(error, null, 4)}{" "}
      </h2>
    );
  if (isLoading) return <h2>Loading ...</h2>;

  return (
    <div>
      <h1>Post {postId} ' s comments</h1>
      <Link to="/">Go to home</Link>
      {data.map((comment) => (
        <Comment
          isFetching={isFetching}
          endpoint={"getComment"}
          key={comment.id}
          comment={comment}
          arg={postId}
        />
      ))}
    </div>
  );
}

export default EachComment;

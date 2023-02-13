import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { util } from "./api/query";

function Comment({ comment, endpoint, arg }) {
  const [text, setText] = useState("");

  const dispatch = useDispatch();
  const undo = () => {
    dispatch();
  };

  const args = useMemo(() => (arg ? arg : undefined), [arg]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.body === text) return;
    dispatch(
      util.updateQueryData(endpoint, args, (data) => {
        const result = data.map((dt) => {
          if (dt.id === comment.id) {
            return {
              ...dt,
              body: text,
            };
          }
          return dt;
        });
        return result;
      })
    );
  };

  return (
    <div style={{ background: "aqua", padding: "10px", marginBottom: "8px" }}>
      <Link to={`/comments?postId=${comment.postId}`}>
        <h2>{comment.name}</h2>
      </Link>
      <p>{comment.body}</p>
      <form action="" onSubmit={handleSubmit}>
        <input
          type={"text"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button style={{ margin: "0 0 0 10px", cursor: "pointer" }}>
          Update
        </button>
        <button onClick={undo}>Undo</button>
      </form>
    </div>
  );
}

export default Comment;

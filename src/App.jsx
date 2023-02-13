import { Link, Route, Routes } from "react-router-dom";
import Comment from "./Comment";
import EachComment from "./EachComment";

function App({ data }) {
  return (
    <div>
      <Link to={"/dashboard"}>Go to dashboard</Link>
      <Routes>
        <Route
          index
          element={data.map((comment) => (
            <Comment
              endpoint={"getComments"}
              comment={comment}
              key={comment.id}
            />
          ))}
        />
        <Route
          path="/dashboard"
          element={
            <>
              <h1>Dashboard</h1>
              <Link to={"/"}>Go back to home</Link>
            </>
          }
        />
        <Route path={`/comments`} element={<EachComment />} />
      </Routes>
    </div>
  );
}

export async function getServerSideProps() {
  const data = await fetch(
    "https://jsonplaceholder.typicode.com/comments"
  ).then((res) => res.json());
  return {
    props: {
      data,
    },
  };
}

export default App;

import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_AUTHORS, All_BOOKS, ADD_BOOK, EDIT_AUTHOR } from "./queries";

import { useMutation, useQuery } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(All_BOOKS);
  const [createBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: All_BOOKS }, { query: ALL_AUTHORS }],
  });
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (authors.loading) {
    return <div>loading...</div>;
  }

  if (books.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors
        show={page === "authors"}
        authors={authors.data.allAuthors}
        editAuthor={editAuthor}
      />

      <Books show={page === "books"} books={books.data.allBooks} />

      <NewBook show={page === "add"} createBook={createBook} />
    </div>
  );
};

export default App;

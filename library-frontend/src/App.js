import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Favourite from "./components/Favourite";
import { ALL_AUTHORS, All_BOOKS, EDIT_AUTHOR, BOOK_ADDED } from "./queries";

import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let title = item.title;
      return seen.has(title) ? false : seen.add(title);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(null);
  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(All_BOOKS);

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.map((a) =>
            a.name === response.data.editAuthor.name
              ? response.data.editAuthor
              : a
          ),
        };
      });
    },
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data);
      const addedBook = data.data.bookAdded;
      window.alert(`New book added: ${addedBook.title}`);
      updateCache(client.cache, { query: All_BOOKS }, addedBook);
    },
  });

  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (authors.loading || books.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("favourite")}>favourite</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>Login</button>
        )}
      </div>

      <Authors
        show={page === "authors"}
        authors={authors.data.allAuthors}
        editAuthor={editAuthor}
      />
      <Books show={page === "books"} books={books.data.allBooks} />
      <NewBook show={page === "add"} />
      <LoginForm show={page === "login"} setToken={setToken} />
      <Favourite show={page === "favourite"} />
    </div>
  );
};

export default App;

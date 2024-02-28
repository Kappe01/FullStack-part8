import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_BOOKS_BY_GENRE } from "../queries";

const Books = (props) => {
  const [currGenre, setCurrGenre] = useState("all");

  const { loading, error, data, refetch } = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: [currGenre] },
    skip: currGenre === "all",
  });

  if (!props.show) {
    return null;
  }

  let books = currGenre === "all" ? props.books : data?.allBooks;

  const filterByGenre = (genre) => {
    setCurrGenre(genre);
    refetch({ genre: [genre] });
  };

  const genres = [...new Set(props.books.map((book) => book.genres).flat())];

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <h2>books</h2>
      in genre <strong>{currGenre}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => filterByGenre("all")} key={"all"}>
          all genres
        </button>
        {genres.map((genre) => (
          <button onClick={() => filterByGenre(genre)} key={genre}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;

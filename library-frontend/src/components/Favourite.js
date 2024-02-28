import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_BOOKS_BY_GENRE, USER } from "../queries";

const Favourite = (props) => {
  const [favouriteGenre, setFavouriteGenre] = useState("all");
  const user = useQuery(USER);
  const { loading, error, data, refetch } = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: [favouriteGenre] },
    skip: favouriteGenre === "all",
  });

  useEffect(() => {
    try {
      if (!user.loading) {
        setFavouriteGenre(user.data.me.favoriteGenre);
        refetch({ genre: [favouriteGenre] });
      }
    } catch (e) {
      return null;
    }
  }, [setFavouriteGenre, user, refetch, favouriteGenre]);

  if (!props.show) {
    return null;
  }

  let books = data?.allBooks;

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <h2>books</h2>
      books in your favourite genre <strong>{favouriteGenre}</strong>
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
    </div>
  );
};

export default Favourite;

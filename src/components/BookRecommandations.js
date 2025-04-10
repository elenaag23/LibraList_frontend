import React from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import $ from "jquery";

const BookItem = ({ book, number }) => {
  return (
    <div
      className={"mycell col-2"}
      id={book.identifier}
      style={{ paddingLeft: "0px", position: "relative", margin: "20px" }}
    >
      {/* <a
      href={`https://archive.org/download/${encodeURIComponent(
        book.identifier
      )}/${book.url}`}
      target="_blank" 
      rel="noopener noreferrer"
    > */}

      <Link to="/read-book" state={{ book: book }} className="book-link">
        <div className="bookItemWrapper">
          <img
            src={`https://archive.org/download/${encodeURIComponent(
              book.identifier
            )}/${encodeURIComponent(book.jpg)}`}
            alt="Book Cover"
            className="bookImage"
          />
        </div>
      </Link>

      <div className="bookName">
        <span>{book.title}</span>
      </div>
    </div>
  );
};

const BookRow = ({ books }) => (
  <div className="row" style={{ marginLeft: "5%" }}>
    {books.map((book, index) => (
      <BookItem key={index} book={book} number={books.length} />
    ))}
  </div>
);

const BookRecommendations = ({ books, max }) => {
  const rows = [];
  console.log("books: ", books);
  for (let i = 0; i < max; i += 5) {
    rows.push(books.slice(i, i + 5));
  }

  return (
    <div style={{ margin: "16px" }}>
      {rows.map((row, index) => (
        <BookRow key={index} books={row} max={max} />
      ))}
    </div>
  );
};

export default BookRecommendations;

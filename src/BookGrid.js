import React from "react";
import { Link } from "react-router-dom";

const BookItem = ({ book }) => (
  <div className="col" id="mycell">
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

const BookRow = ({ books }) => (
  <div className="row">
    {books.map((book, index) => (
      <BookItem key={index} book={book} />
    ))}
  </div>
);

const BookGrid = ({ books }) => {
  const rows = [];
  for (let i = 0; i < books.length; i += 3) {
    rows.push(books.slice(i, i + 3));
  }

  return (
    <div style={{ margin: "16px" }}>
      {rows.map((row, index) => (
        <BookRow key={index} books={row} />
      ))}
    </div>
  );
};

export default BookGrid;

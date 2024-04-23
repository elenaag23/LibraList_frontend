import React from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const BookItem = ({ book, number, onDelete, origin }) => {
  // const [hidden, setHidden] = useState(false);

  console.log("origin of book item: ", origin);

  const handleDelete = () => {
    onDelete(book.identifier);
  };
  return (
    <div
      className={number % 3 == 0 ? "mycell col" : "mycell col-4"}
      id={book.identifier}
      style={{ paddingLeft: "0px", position: "relative" }}
    >
      {/* <a
      href={`https://archive.org/download/${encodeURIComponent(
        book.identifier
      )}/${book.url}`}
      target="_blank" 
      rel="noopener noreferrer"
    > */}

      {origin === "library" ? (
        <div
          className="deleteButton2"
          style={{ display: "flex", justifyContent: "end" }}
        >
          <button onClick={handleDelete} className="deleteButton">
            <DeleteIcon></DeleteIcon>
          </button>
        </div>
      ) : null}

      <Link to="/read-book" state={{ book: book }} className="book-link">
        <div className="bookItemWrapper">
          {console.log("book pages: ", book.pageNumber, book.totalPages)}
          {book.pageNumber && book.totalPages ? (
            <div className="hovered">
              <div className="pagingStatus">
                Page {book.pageNumber} of {book.totalPages}
              </div>
            </div>
          ) : null}

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

const BookRow = ({ books, onDelete, origin }) => (
  <div className="row">
    {books.map((book, index) => (
      <BookItem
        key={index}
        book={book}
        number={books.length}
        onDelete={onDelete}
        origin={origin}
      />
    ))}
  </div>
);

const BookGrid = ({ books, onDelete, origin }) => {
  const rows = [];
  console.log("books: ", books);
  for (let i = 0; i < books.length; i += 3) {
    rows.push(books.slice(i, i + 3));
  }

  return (
    <div style={{ margin: "16px" }}>
      {rows.map((row, index) => (
        <BookRow key={index} books={row} onDelete={onDelete} origin={origin} />
      ))}
    </div>
  );
};

export default BookGrid;

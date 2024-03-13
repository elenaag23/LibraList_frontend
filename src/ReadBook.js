import { React, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PDFViewer from "./PDFViewer";
import Sidebar from "./Sidebar";

const ReadBook = () => {
  // Access the location object
  const location = useLocation();

  console.log("Location state:", location.state);

  // Retrieve the state from the location object
  const { state } = location;

  // Assuming the book object is passed as state from the previous page
  const book = state && state.book;

  useEffect(() => {
    console.log("prev page: ", localStorage.getItem("prevPage"));
    localStorage.setItem("prevPage", location.pathname);
  });

  // Render the book details
  return (
    <div>
      <Sidebar></Sidebar>
      {book ? (
        <div>
          <div className="readBookContent">
            <div className="iframeDisplay bookBox">
              <PDFViewer
                pdfUrl={`https://archive.org/download/${encodeURIComponent(
                  book.identifier
                )}/${book.url}`}
              />
            </div>

            <div className="bookSide">
              <div className="boxZones" style={{ display: "flow" }}>
                <div style={{ paddingTop: "8px" }}>
                  <h3>{book.title}</h3>
                </div>
                <div className="horizontalLine">
                  <hr></hr>
                </div>
              </div>

              {/* <div className="boxZones">
                <h3>book comments</h3>
              </div> */}
            </div>
          </div>
        </div>
      ) : (
        <p>No book details available.</p>
      )}
    </div>
  );
};

export default ReadBook;

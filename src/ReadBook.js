import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PDFViewer from "./PDFViewer";
import Sidebar from "./Sidebar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ReadBook = () => {
  const location = useLocation();
  console.log("Location state:", location.state);
  const { state } = location;
  const book = state && state.book;
  const user = localStorage.getItem("user");
  const [added, setAdded] = useState(false);

  const addToLibrary = async () => {
    console.log("in add to library: ", user, book.identifier);
    setAdded(true);
    fetch("http://127.0.0.1:8000/addToLibrary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ user: user, book: book.identifier }),
    })
      .then((response) => {
        console.log("response: ", response.json());
      })
      .catch((error) => {
        // Handle any errors
      });
  };

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
                <div
                  style={{
                    paddingLeft: "28px",
                    display: "flex",
                    paddingTop: "8px",
                  }}
                >
                  <div style={{ width: "80%" }}>
                    <h3>{book.title}</h3>
                  </div>
                  {!added ? (
                    <div style={{ paddingTop: "10px", width: "20%" }}>
                      {" "}
                      <button
                        onClick={addToLibrary}
                        className="addToLibraryButton"
                      >
                        <AddCircleIcon></AddCircleIcon>
                      </button>
                    </div>
                  ) : (
                    <div style={{ paddingTop: "10px", width: "20%" }}>
                      {" "}
                      <CheckCircleIcon></CheckCircleIcon>
                    </div>
                  )}
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

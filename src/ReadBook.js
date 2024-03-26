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
  const userMail = localStorage.getItem("userMail");
  const [added, setAdded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const addToLibrary = () => {
    setAdded(true);
    fetch("http://127.0.0.1:8000/addToLibrary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ user: userMail, book: book.identifier }),
    })
      .then((response) => {
        console.log("response: ", response.json());
      })
      .catch((error) => {
        // Handle any errors
      });
  };

  const userHasBook = () => {
    fetch(
      `http://127.0.0.1:8000/userBook?userMail=${userMail}&bookIdentifier=${book.identifier}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        console.log("response in ujser has book data: ", data);
        if (data.has == true) setAdded(true);
        else setAdded(false);
        setLoading(false);
      })
      .catch((error) => {});
  };

  const getPDF = () => {
    const url = `https://archive.org/download/${encodeURIComponent(
      book.identifier
    )}/${book.url}`;
    fetch(`http://127.0.0.1:8000/getpdf?url=${url}`, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        setPdf(blob);
      })
      .catch((error) => {
        console.error("Error fetching PDF:", error);
      });
  };

  useEffect(() => {
    console.log("prev page: ", localStorage.getItem("prevPage"));
    localStorage.setItem("prevPage", location.pathname);
    console.log("pdf?? ", pdf);

    getPDF();
    userHasBook();
  }, []);

  // Render the book details
  return (
    <div>
      <Sidebar></Sidebar>
      {book ? (
        <div>
          <div className="readBookContent">
            <div className="iframeDisplay bookBox">
              {pdf && <PDFViewer pdfUrl={pdf}></PDFViewer>}
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
                  {!loading && !added ? (
                    <div style={{ paddingTop: "10px", width: "20%" }}>
                      {" "}
                      <button
                        onClick={addToLibrary}
                        className="addToLibraryButton"
                      >
                        <AddCircleIcon></AddCircleIcon>
                      </button>
                    </div>
                  ) : !loading ? (
                    <div style={{ paddingTop: "10px", width: "20%" }}>
                      {" "}
                      <CheckCircleIcon></CheckCircleIcon>
                    </div>
                  ) : null}
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

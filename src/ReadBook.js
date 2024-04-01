import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PDFViewer from "./PDFViewer";
import Sidebar from "./Sidebar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightComponent from "./HighlightComponent";

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
  const [highlights, setHighlights] = useState(null);
  const [highlightedColors, setHiglightedColors] = useState(null);
  const [col, setCol] = useState(null);
  const [highlighted, setHighlighted] = useState(null);

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

  const displayHighlights = () => {
    fetch(
      `http://127.0.0.1:8000/displayHighlights?userMail=${userMail}&bookIdentifier=${book.identifier}`,
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
        // if (data.has == true) setAdded(true);
        // else setAdded(false);
        // setLoading(false);
      })
      .catch((error) => {});
  };

  const userHasHighlights = () => {
    fetch(
      `http://127.0.0.1:8000/userHighlightsBook?userMail=${userMail}&bookIdentifier=${book.identifier}`,
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
        console.log("response in user book highlights data: ", data);
        console.log("hello ", Object.keys(data["colors"]));
        console.log("hello1 ", data["colors"]);
        console.log("hello2 ", data["colors"]["highlighted-text-def"]);
        setHighlights(data["highlights"]);
        setHiglightedColors(Object.keys(data["colors"]));
        setHighlighted(data["colors"]);

        if (Object.keys(data["colors"]).length < 2) setCol("col-4");
        else setCol("col");
      })
      .catch((error) => {});
  };

  useEffect(() => {
    console.log("prev page: ", localStorage.getItem("prevPage"));
    localStorage.setItem("prevPage", location.pathname);
    console.log("pdf?? ", pdf);

    getPDF();
    userHasBook();
    userHasHighlights();
  }, []);

  // Render the book details
  return (
    <div>
      <Sidebar></Sidebar>
      {book ? (
        <div>
          <div className="readBookContent">
            <div className="iframeDisplay bookBox">
              {pdf && book && highlights && (
                <PDFViewer
                  pdfUrl={pdf}
                  book={book}
                  highs={highlights}
                ></PDFViewer>
              )}
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

          <div className="row" style={{ width: "100%", marginTop: "36px" }}>
            {highlights && (
              <div className="pageTitle">
                <span>Your Highlights</span>
              </div>
            )}

            <div className="row" style={{ marginTop: "16px" }}>
              {highlightedColors &&
                highlightedColors.map((element, index) => (
                  <HighlightComponent
                    colorHeader={`backgroundColor${element.split("-").pop()}`}
                    col={col}
                    highlighted={highlighted[element]}
                  />
                ))}

              {/* <HighlightComponent colorHeader={"backgroundColorRed"} />
              <HighlightComponent colorHeader={"backgroundColorBlue"} />
              <HighlightComponent colorHeader={"backgroundColorGreen"} />
              <HighlightComponent colorHeader={"backgroundColorOrange"} />
              <HighlightComponent colorHeader={"backgroundColorDef"} /> */}

              {/* <div className="col">div 2</div>

              <div className="col">div 3</div>
              <div className="col">div 4</div>
              <div className="col">div 5</div> */}
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

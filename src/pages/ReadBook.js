import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";
import Sidebar from "../components/Sidebar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightComponent from "../components/HighlightComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "../components/LoadingComponent";

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
  const [highlightedColors, setHighlightedColors] = useState(null);
  const [col, setCol] = useState(null);
  const [highlighted, setHighlighted] = useState(null);
  const [noHighlights, setNoHighlights] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const token = localStorage.getItem("authToken");
  const [genre, setGenre] = useState(null);
  const [description, setDescription] = useState(null);
  const [colors, setColors] = useState([]);

  const showToastMessage = () => {
    console.log("entered toast");
    toast.info("Book added to your library!", {
      position: "top-center",
    });
  };

  const getUserColors = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/getColorTags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("response: ", data);
        console.log("colors: ", data["colors"]["colors"]);
        setColors(data["colors"]["colors"]);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const addToLibrary = () => {
    fetch("http://localhost:8000/addToLibrary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-XSRF-TOKEN": localStorage.getItem("xsrf"),
      },
      credentials: "include",
      body: JSON.stringify({ book: book.identifier }),
    })
      .then((response) => {
        //console.log("response: ", response.json());
        if (response.ok) {
          setAdded(true);
          showToastMessage();
        }
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
        if (data.has == true) {
          setAdded(true);
          setPageNumber(data.pageNumber);
        } else setAdded(false);
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
        console.log("here s blob: ", blob);
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

        if (data["highlights"].length == 0) {
          console.log("entered if");
          setHighlights([]);
          setHighlightedColors([]);
          setHighlighted(null);
        } else {
          console.log("entered else");
          setHighlights(data["highlights"]);
          setHighlightedColors(Object.keys(data["colors"]));
          setHighlighted(data["colors"]);
          setNoHighlights(false);
        }

        if (Object.keys(data["colors"]).length < 2) setCol("col-4");
        else setCol("col");
      })
      .catch((error) => {});
  };

  const deleteHighlights = () => {
    var highsDef = document.getElementsByClassName("highlighted-text-def");

    if (highsDef.length > 0) {
      Array.from(highsDef).forEach((element) => {
        element.remove();
      });
    }

    var highsRed = document.getElementsByClassName("highlighted-text-red");

    if (highsRed.length > 0) {
      Array.from(highsRed).forEach((element) => {
        element.remove();
      });
    }

    var highsBlue = document.getElementsByClassName("highlighted-text-blue");

    if (highsBlue.length > 0) {
      Array.from(highsBlue).forEach((element) => {
        element.remove();
      });
    }

    var highsGreen = document.getElementsByClassName("highlighted-text-green");

    if (highsGreen.length > 0) {
      Array.from(highsGreen).forEach((element) => {
        element.remove();
      });
    }

    var highsOrange = document.getElementsByClassName(
      "highlighted-text-orange"
    );

    if (highsOrange.length > 0) {
      Array.from(highsOrange).forEach((element) => {
        element.remove();
      });
    }
  };

  const getBookInfo = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/getBookInfo?bookTitle=${book.title}&bookIdentifier=${book.identifier}`,
        {
          method: "GET",
        }
      );

      if (response.status == 200) {
        const data = await response.json();
        setGenre(data["bookGenre"]);
        setDescription(data["bookDescription"]);

        console.log(
          "genre and description: ",
          data["bookGenre"],
          data["bookDescription"]
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    console.log("prev page: ", localStorage.getItem("prevPage"));
    localStorage.setItem("prevPage", location.pathname);

    getBookInfo();

    getPDF();
    console.log("pdf?? ", pdf);
    userHasBook();
    userHasHighlights();
    getUserColors();

    return () => {
      deleteHighlights();
    };
  }, []);

  const handleClickOutside = () => {
    // Handle click outside by triggering blur event
    //console.log("entered here: ", $("#pageInput").val());
    console.log("page pageNumber: ", pageNumber);
    if (!pageNumber) {
      console.log("entered if");
      setPageNumber(1);
    }

    const input = document.getElementById("pageInput");
    if (!input) {
      input.blur();
    }
  };

  // Render the book details
  return (
    <div>
      <Sidebar></Sidebar>
      <ToastContainer />
      {book ? (
        <div onClick={handleClickOutside}>
          <div className="readBookContent">
            <div className="iframeDisplay bookBox">
              {console.log("pdf:", pdf)}
              {console.log("book:", book)}
              {console.log("highlights:", highlights)}
              {console.log("highlightedColors:", highlightedColors)}
              {!(
                pdf &&
                book &&
                highlights !== null &&
                highlightedColors !== null
              ) ? (
                <div style={{ marginLeft: "20%", marginTop: "15%" }}>
                  <LoadingComponent current={"book"} />
                </div>
              ) : (
                <PDFViewer
                  pdfUrl={pdf}
                  book={book}
                  highs={highlights}
                  highlighted={highlightedColors}
                  currentPageNumber={pageNumber}
                  ownStatus={added}
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
                {genre && description && (
                  <div>
                    <li className="noListType">
                      <span style={{ fontWeight: "600" }}>{description}</span>
                    </li>

                    <li className="noListType">
                      <span className="propertyFont">Genre: </span>
                      <span>{genre}</span>
                    </li>
                  </div>
                )}

                <div className="horizontalLine">
                  <hr></hr>
                </div>
              </div>

              {/* <div className="boxZones">
                <h3>book comments</h3>
              </div> */}
            </div>
          </div>

          <div
            className="row"
            style={{ width: "100%", marginTop: "36px" }}
            id="highlightsContainer"
          >
            {highlighted && (
              <div className="pageTitle">
                <span>Your Highlights</span>
              </div>
            )}

            <div
              className="row"
              style={{ marginTop: "16px" }}
              id="highlightsComponent"
            >
              {highlightedColors &&
                highlightedColors.map((element, index) => (
                  <HighlightComponent
                    colorHeader={`backgroundColor${element.split("-").pop()}`}
                    col={col}
                    highlighted={highlighted[element]}
                    colors={colors}
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

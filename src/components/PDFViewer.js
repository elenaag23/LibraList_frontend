import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import $ from "jquery";
import ClearIcon from "@mui/icons-material/Clear";
import LoadingComponent from "./LoadingComponent";
import { Link, NavLink } from "react-router-dom";
import RatingComponent from "./RatingComponent";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({
  pdfUrl,
  book,
  highs,
  highlighted,
  currentPageNumber,
  myRating,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(currentPageNumber);
  const [selectedText, setSelectedText] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [idCounter, setIdCounter] = useState(0);
  const [highlights, setHighlights] = useState(null);
  const userMail = localStorage.getItem("userMail");
  const [scale, setScale] = useState(1);
  const [noColors, setNoColors] = useState(0);
  const [value, setValue] = useState(pageNumber);
  const [rating, setRating] = useState(myRating);
  const token = localStorage.getItem("authToken");

  const setReadingPage = async (pageNumber) => {
    var currentdate = new Date();
    var datetime =
      currentdate.getFullYear() +
      "-" +
      (currentdate.getMonth() + 1) +
      "-" +
      currentdate.getDate() +
      " " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    try {
      const response = await fetch("http://127.0.0.1:8000/setPage", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user: localStorage.getItem("userMail"),
          book: book.identifier,
          pageNumber: pageNumber,
          accessTime: datetime,
          bookPages: numPages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update book page");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      // Handle any errors
    }
  };

  useEffect(() => {
    console.log("PAGES: ", numPages);
    const setPageNumberAsync = async () => {
      await setReadingPage(pageNumber);
    };

    setPageNumberAsync();
    return () => {};
  }, [pageNumber]);

  useEffect(() => {
    console.log("in pdf viewer: ", pdfUrl);
    console.log("in pdf highs: ", highs);
    console.log("in pdf highlightedColors: ", highlighted);
    setHighlights(highs);
    setNoColors(highlighted.length);
    //setPageNumber(currentPageNumber);
    $("#pageInput").val(currentPageNumber);
  }, []);

  const displayHighlights = (pageNumber) => {
    console.log("in display highlights: ", pageNumber, highlights);
    if (Object.keys(highlights).indexOf(pageNumber.toString()) != -1) {
      for (var highlight of highlights[pageNumber]) {
        console.log("current highlight: ", highlight);
        const span = document.createElement("span");
        span.className = highlight.classname;
        span.style.position = "absolute";
        span.style.top = highlight.top + "px";
        span.style.left = highlight.left + "px";
        span.style.width = highlight.width + "px";
        span.style.height = highlight.height + "px";
        span.id = highlight.id;

        console.log("span creat: ", span);
        document.body.appendChild(span);
      }
    }
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

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("highlights: ", highlights);
    console.log("highlighted colors: ", highlighted);
    displayHighlights(pageNumber);
    setTimeout(() => {
      var elements = document.getElementsByClassName(
        "react-pdf__Page__textContent textLayer"
      );
      if (elements.length > 0) {
        var firstElement = elements[0];
        var width = firstElement.clientWidth;
        if (width < 300) {
          setScale(2);
        } else if (width < 400) {
          setScale(1.7);
        } else if (width < 500) {
          setScale(1.4);
        }
        console.log("First page element: ", firstElement);
        console.log("height: ", firstElement.clientHeight);
        console.log("width: ", firstElement.clientWidth);
      } else {
        console.log("Element not found");
      }
    }, 1000);

    setNumPages(numPages);
  };

  const generateId = (top, left) => {
    let cnt = idCounter + 1;
    setIdCounter(idCounter + 1);
    return `P${pageNumber}-C${cnt}-T${top}-L${left}`;
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selRange = selection.getRangeAt(0);

    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      const startContainer = range.startContainer;
      const endContainer = range.endContainer;
      const isMultiRowSelection = startContainer !== endContainer;

      const rect = range.getBoundingClientRect();
      const span = document.createElement("span");

      span.className =
        selectedColor != null
          ? "highlighted-text-" + selectedColor
          : "highlighted-text-def";
      span.style.position = "absolute";
      span.style.top = rect.top + window.scrollY + "px";
      span.style.left = rect.left + "px";
      span.style.width = rect.width + "px";
      span.style.height = rect.height + "px";

      span.id = generateId(
        rect.top.toString().split(".")[0],
        rect.left.toString().split(".")[0]
      );

      const highlight = {
        id: span.id,
        page: pageNumber,
        top: rect.top + window.scrollY,
        left: rect.left,
        height: rect.height,
        width: rect.width,
        classname: span.className,
        text: selection.toString(),
      };

      if (pageNumber in highlights) {
        highlights[pageNumber].push(highlight);
      } else highlights[pageNumber] = [highlight];

      const deepCopy = (highlights) => {
        if (typeof highlights !== "object" || highlights === null) {
          return highlights;
        }

        const newObj = Array.isArray(highlights) ? [] : {};
        for (let key in highlights) {
          newObj[key] = [...highlights[key]];
        }

        return newObj;
      };

      setHighlights(deepCopy);

      document.body.appendChild(span);
      console.log("book: ", span);
      insertIntoDb(highlight);

      var liElement = $(`<li>${selection.toString()}</li>`);
      var classOfElem =
        "highlighted-text-" + (selectedColor != null ? selectedColor : "def");

      if (highlighted.indexOf(classOfElem) != -1) {
        console.log("does exist");
        $(
          `.colorHeader.backgroundColor${
            selectedColor != null ? selectedColor : "def"
          }`
        )
          .next(".contentHighlight")
          .append(liElement);
      } else {
        console.log("does not exist");

        //var getCol = noColors < 2 ? "col-2" : "col";
        var classname = `colorHeader backgroundColor${
          selectedColor != null ? selectedColor : "def"
        }`;
        var firstDiv = $(
          `<div class = 'col-3 highlights'><div class = '${classname}'></div></div>`
        );

        var liDiv = $("<div class = 'contentHighlight'></div>");

        liDiv.append(liElement);
        firstDiv.append(liDiv);

        console.log("this is how firstDiv looks like: ", firstDiv);
        $("#highlightsComponent").append(firstDiv);
        // if (noColors == 0) {
        //   var title = $(
        //     '<div class="pageTitle"><span>Your Highlights</span></div>'
        //   );

        //   $("#highlightsContainer").append(title);
        // }
        setNoColors(noColors + 1);
      }
    }

    console.log("selected range: ", selection.toString());

    setSelectedText(selection.toString());
  };

  const insertIntoDb = (highlight) => {
    fetch("http://localhost:8000/addHighlight", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-XSRF-TOKEN": localStorage.getItem("xsrf"),
      },
      credentials: "include",
      body: JSON.stringify({
        book: book.identifier,
        highlight: highlight,
      }),
    })
      .then((response) => {
        console.log("response: ", response.json());
      })
      .catch((error) => {
        // Handle any errors
      });
  };

  const goToPreviousPage = () => {
    deleteHighlights();

    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      console.log("highlights 1: ", highlights);
      if (highlights != null) displayHighlights(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    deleteHighlights();

    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
      console.log("highlights 2: ", highlights);

      if (highlights != null) displayHighlights(pageNumber + 1);
    }
  };

  const handleRadioChange = (event) => {
    setSelectedColor(event.target.value);
    console.log("changed color: ", event.target.value);
  };

  const removeColor = () => {
    $("input[name=colorOptions]").prop("checked", false);
    setSelectedColor(null);
  };

  const handleZoomIn = () => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(scale - 0.1);
  };

  const handleChangePage = (e) => {
    const newPageNumber = parseInt(e.target.value);
    console.log("page no: ", newPageNumber);
    //let lastPageNumber = pageNumber;
    //if (newPageNumber) {
    //console.log("entered change");
    setPageNumber(newPageNumber);
    //}
  };

  const handleClickOutside = () => {
    console.log("entered here: ", $("#pageInput").val());
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

  const handleValueChange = (rating) => {
    setRating(rating);
  };

  return (
    <div style={{ width: "100%" }} className="row" onClick={handleClickOutside}>
      <div className="col-7">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div style={{ marginLeft: "20%", marginTop: "15%" }}>
              <LoadingComponent current={"pdf"} />
            </div>
          }
        >
          <Page
            pageNumber={pageNumber ? pageNumber : 1}
            className="pdf-page"
            renderTextLayer={true}
            loading={<LoadingComponent current={"pdf"} />}
            onMouseUp={handleTextSelection}
            scale={scale}
          ></Page>
        </Document>
      </div>

      <div className="col-5">
        <div className="pagesDiv">
          <div className="row" style={{ paddingTop: "15px", height: "50%" }}>
            <div>
              <input
                id="pageInput"
                type="number"
                value={pageNumber}
                onChange={handleChangePage}
                min="1"
                max={numPages}
              />
              <span className="pageNumberFont">/ {numPages}</span>
            </div>
          </div>

          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button disabled={pageNumber <= 1} onClick={goToPreviousPage}>
              Previous
            </button>
            <button disabled={pageNumber >= numPages} onClick={goToNextPage}>
              Next
            </button>
          </div>
          {/* <div className="selected-text">Selected Text: {selectedText}</div> */}
        </div>

        <div className="pagesDiv" style={{ height: "70px" }}>
          <div
            style={{
              color: "#eceef8",
              fontWeight: "BOLD",
              display: "flex",
              justifyContent: "end",
              marginRight: "20px",
              marginBottom: "8px",
              marginTop: "3px",
            }}
          >
            {/* <span>Choose higlight color</span> */}
            <div className="removeColor">
              <button onClick={removeColor}>
                <ClearIcon style={{ color: "#eceef8" }} />
              </button>
            </div>
          </div>
          <div style={{ paddingTop: "8px" }} className="colorButtons">
            <input
              type="radio"
              class="btn-check"
              name="colorOptions"
              id="option1"
              autocomplete="off"
              value="red"
              onChange={handleRadioChange}
            ></input>
            <label
              class="btn "
              for="option1"
              style={{
                backgroundColor: "red",
              }}
            ></label>
            <input
              type="radio"
              class="btn-check"
              name="colorOptions"
              id="option2"
              autocomplete="off"
              value="blue"
              onChange={handleRadioChange}
            ></input>
            <label
              class="btn btn-secondary"
              for="option2"
              style={{
                backgroundColor: "blue",
              }}
            ></label>
            <input
              type="radio"
              class="btn-check"
              name="colorOptions"
              id="option3"
              autocomplete="off"
              value="orange"
              onChange={handleRadioChange}
            ></input>
            <label
              class="btn btn-secondary"
              for="option3"
              style={{
                backgroundColor: "orange",
              }}
            ></label>
            <input
              type="radio"
              class="btn-check"
              name="colorOptions"
              id="option4"
              autocomplete="off"
              value="green"
              onChange={handleRadioChange}
            ></input>
            <label
              class="btn btn-secondary"
              for="option4"
              style={{
                backgroundColor: "green",
              }}
            ></label>
          </div>
        </div>

        <div
          className="row reviewBox"
          style={{ marginLeft: "25%", marginBottom: "10%" }}
        >
          <div className="reviewFont">
            <span>Your review</span>
          </div>
          <div className="playlistButton">
            {console.log("rating in pdf: ", rating)}
            <RatingComponent book={book} rating={rating}></RatingComponent>
          </div>
        </div>

        <div className="playlistButton">
          <Link
            to="/playlist"
            className="myLibraryButton"
            state={{ book: book }}
          >
            <div className="playlistDiv">Generate playlist</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;

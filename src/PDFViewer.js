import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import $ from "jquery";
import ClearIcon from "@mui/icons-material/Clear";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ pdfUrl, book, highs }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedText, setSelectedText] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [idCounter, setIdCounter] = useState(0);
  const [highlights, setHighlights] = useState(null);
  const userMail = localStorage.getItem("userMail");
  const [scale, setScale] = useState(1.7);

  useEffect(() => {
    console.log("in pdf viewer: ", pdfUrl);
    setHighlights(highs);
  }, []);

  const displayHighlights = (pageNumber) => {
    if (Object.keys(highlights).indexOf(pageNumber.toString()) != -1) {
      for (var highlight of highlights[pageNumber]) {
        console.log("current highlight: ", highlight);
        const span = document.createElement("span");
        span.className = highlight.classname;
        span.style.position = "absolute";
        span.style.top = highlight.top * scale + "px";
        span.style.left = highlight.left * scale + "px";
        span.style.width = highlight.width * scale + "px";
        span.style.height = highlight.height * scale + "px";
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
    // Wait for the DOM to be fully loaded
    $(document).ready(function () {
      // Execute code after DOM is ready

      // Get the canvas element
      var $canvas = $(".react-pdf__Page__canvas");

      // Check if the canvas element exists
      if ($canvas.length > 0) {
        // Get the inline style of the canvas element
        var canvasStyle = $canvas.attr("style");

        // Check if inline style is defined
        if (canvasStyle) {
          // Extract width and height from the inline style
          var matchWidth = canvasStyle.match(/width:\s*([\d.]+)px/);
          var matchHeight = canvasStyle.match(/height:\s*([\d.]+)px/);

          // Extracted width and height values
          var canvasWidth = matchWidth ? parseFloat(matchWidth[1]) : null;
          var canvasHeight = matchHeight ? parseFloat(matchHeight[1]) : null;

          console.log("Width:", canvasWidth, "Height:", canvasHeight);
        } else {
          console.log("Canvas element style attribute is not defined.");
        }
      } else {
        console.log("Canvas element not found.");
      }
    });

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
      span.style.top = (rect.top + window.scrollY) * scale + "px";
      span.style.left = rect.left * scale + "px";
      span.style.width = rect.width * scale + "px";
      span.style.height = rect.height * scale + "px";

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

      document.body.appendChild(span);
      console.log("book: ", span);
      insertIntoDb(highlight);

      const liElement = $(`<li>${selection.toString()}</li>`);
      $(
        `.colorHeader.backgroundColor${
          selectedColor != null ? selectedColor : "def"
        }`
      )
        .next(".contentHighlight")
        .append(liElement);
    }

    console.log("selected range: ", selection.toString());
    setSelectedText(selection.toString());
  };

  const insertIntoDb = (highlight) => {
    fetch("http://127.0.0.1:8000/addHighlight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user: userMail,
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

  return (
    <div style={{ display: "flex" }}>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          pageNumber={pageNumber}
          className="pdf-page"
          renderTextLayer={true}
          loading={<div>Wait, your pdf is loading...</div>}
          onMouseUp={handleTextSelection}
          scale={scale}
        ></Page>
      </Document>

      <div>
        <div className="pagesDiv">
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <div style={{ paddingLeft: "15px" }}>
            <button disabled={pageNumber <= 1} onClick={goToPreviousPage}>
              Previous
            </button>
            <button disabled={pageNumber >= numPages} onClick={goToNextPage}>
              Next
            </button>
          </div>
          <div className="selected-text">Selected Text: {selectedText}</div>
        </div>

        <div className="pagesDiv" style={{ height: "85px" }}>
          <div style={{ marginTop: "8px", color: "white", fontWeight: "BOLD" }}>
            <span>Choose higlight color</span>
            <div className="removeColor">
              <button onClick={removeColor}>
                <ClearIcon />
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
      </div>
    </div>
  );
};

export default PDFViewer;

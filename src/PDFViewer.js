import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import $ from "jquery";
import ClearIcon from "@mui/icons-material/Clear";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ pdfUrl, book }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedText, setSelectedText] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [idCounter, setIdCounter] = useState(0);
  const [highlights, setHighlights] = useState(null);
  const userMail = localStorage.getItem("userMail");

  useEffect(() => {
    userHasHighlights();
  }, []);

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
        console.log(
          "response in user book highlights data: ",
          data["highlights"],
          typeof data["highlights"]
        );

        setHighlights(data["highlights"]);
      })
      .catch((error) => {});
  };

  const displayHighlights = (pageNumber) => {
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

      document.body.appendChild(span);
      console.log("book: ", span);
      insertIntoDb(highlight);
    }

    console.log("selected range: ", selectedText);
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
      displayHighlights(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    deleteHighlights();

    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
      displayHighlights(pageNumber + 1);
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

  return (
    <div style={{ display: "flex" }}>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          pageNumber={pageNumber}
          className="pdf-page"
          renderTextLayer={true}
          loading={<div>Wait, your pdf is loading...</div>}
          onMouseUp={handleTextSelection}
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

import React, { useState } from "react";
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
  const userMail = localStorage.getItem("userMail");

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
        height: rect.width,
        width: rect.height,
        text: selection.toString(),
      };

      document.body.appendChild(span);
      //console.log("book: ", book);
      //insertIntoDb(highlight);
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
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
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

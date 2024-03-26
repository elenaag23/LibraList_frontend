import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import $ from "jquery";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const MyPDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedText, setSelectedText] = useState("");

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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

      if (
        isMultiRowSelection ||
        range.startOffset !== 0 ||
        range.endOffset !== range.startContainer.textContent.length
      ) {
        const rect = range.getBoundingClientRect();
        const span = document.createElement("span");
        span.className = "highlighted-text";
        span.style.position = "absolute";
        span.style.top = rect.top + window.scrollY + "px";
        span.style.left = rect.left + "px";
        span.style.width = rect.width + "px";
        span.style.height = rect.height + "px";

        document.body.appendChild(span);
      } else {
        const span = document.createElement("span");
        span.className = "highlighted-text";
        range.deleteContents();
        range.insertNode(span);
      }
    }

    console.log("I've selected: ", selection);
    console.log("Range: ", selRange);
    setSelectedText(selection.toString());
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
          <div style={{ marginTop: "8px" }}>
            <span>Choose higlight color</span>
          </div>
          <div
            style={{ marginLeft: "15px", paddingTop: "8px" }}
            className="colorButtons"
          >
            <button
              style={{ backgroundColor: "red", width: "30px", height: "30px" }}
            ></button>
            <button
              style={{ backgroundColor: "blue", width: "30px", height: "30px" }}
            ></button>
            <button
              style={{
                backgroundColor: "green",
                width: "30px",
                height: "30px",
              }}
            ></button>
            <button
              style={{
                backgroundColor: "orange",
                width: "30px",
                height: "30px",
              }}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPDFViewer;

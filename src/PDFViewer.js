import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

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
          onMouseUp={handleTextSelection}
          className="pdf-page"
          renderTextLayer={true}
          loading={<div>Wait, your pdf is loading...</div>}
        />
      </Document>

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
    </div>
  );
};

export default MyPDFViewer;

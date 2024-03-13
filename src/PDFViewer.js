import React, { useRef, useEffect } from "react";

const PDFViewer = ({ pdfUrl }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = pdfUrl;
    }
  }, [pdfUrl]);

  return (
    <iframe
      ref={iframeRef}
      title="PDF Viewer"
      width="100%"
      height="570px"
      style={{ border: "5px solid #6d7fcc" }}
    />
  );
};

export default PDFViewer;

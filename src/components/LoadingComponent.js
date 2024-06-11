import React, { useEffect, useState } from "react";

function LoadingComponent({ current }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (current == "search") {
      setMessage("Wait, books are loading");
    } else if (current == "book") {
      setMessage("Wait, your book is loading...");
    } else if (current == "pdf") {
      setMessage("Loading PDF...");
    } else if (current == "playlist") {
      setMessage("Generating your playlist...");
    } else if (current == "library") {
      setMessage("Getting your books...");
    } else {
      setMessage("Loading...");
    }
  }, []);

  return (
    <div className="spinner-container">
      <div class="lds-default">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="spinnerTitle">
        <span>{message}</span>
      </div>
    </div>
  );
}

export default LoadingComponent;

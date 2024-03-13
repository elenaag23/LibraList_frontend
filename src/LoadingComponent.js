import React from "react";

function LoadingComponent(current) {
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
        {current == "search" ? (
          <span>Wait, books are loading...</span>
        ) : (
          <span>Your books are being processed...</span>
        )}
      </div>
    </div>
  );
}

export default LoadingComponent;

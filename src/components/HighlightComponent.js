import React, { useState, useEffect } from "react";

const HighlightComponent = ({ colorHeader, col, highlighted }) => {
  console.log("highlighted in component: ", highlighted);
  return (
    <div className={`${col} highlights`}>
      <div className={`colorHeader ${colorHeader}`}></div>
      <div className="contentHighlight">
        {highlighted &&
          highlighted.map((elem, index) => <li key={index}>{elem["text"]}</li>)}
      </div>
    </div>
  );
};

export default HighlightComponent;

import React, { useState, useEffect } from "react";

const HighlightComponent = ({ colorHeader, col, highlighted, colors }) => {
  console.log(
    "highlighted in component: ",
    highlighted,
    colorHeader,
    col,
    colors,
    colorHeader.split("backgroundColor")[1]
  );
  return (
    <div className={`${col} highlights`}>
      <div
        className={`colorHeader ${colorHeader}`}
        style={{
          color: "white",
          fontSize: "20px",
          fontWeight: "600",
          paddingTop: "3px",
        }}
      >
        <span>{colors[colorHeader.split("backgroundColor")[1]]}</span>
      </div>
      <div className="contentHighlight">
        {highlighted &&
          highlighted.map((elem, index) => <li key={index}>{elem["text"]}</li>)}
      </div>
    </div>
  );
};

export default HighlightComponent;

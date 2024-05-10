import React, { useState, useEffect } from "react";

const RatingComponent = () => {
  const [currentRating, setCurrentRating] = useState(0);
  const totalStars = 5;
  const stars = Array(totalStars).fill(0);

  return (
    <div className="rating-container">
      {stars.map((_, index) => (
        <span
          key={index}
          className={`star ${index < currentRating ? "filled" : ""}`}
          onClick={() => setCurrentRating(index + 1)}
        >
          ☆
        </span>
      ))}
    </div>
  );
};

export default RatingComponent;

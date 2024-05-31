import React, { useState, useEffect } from "react";

const RatingComponent = ({ book }) => {
  const [currentRating, setCurrentRating] = useState(0);
  const totalStars = 5;
  const stars = Array(totalStars).fill(0);
  const token = localStorage.getItem("authToken");

  const handleChange = (rating) => {
    setCurrentRating(rating);
  };

  useEffect(() => {
    if (currentRating != 0) editRating();
  }, [currentRating]);

  const editRating = async () => {
    console.log("colors in edit colors: ", currentRating);
    try {
      const response = await fetch(`http://127.0.0.1:8000/editRating`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([currentRating, book]),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      //setUser(data["user"]);
    } catch (error) {}
  };

  return (
    <div className="rating-container">
      {stars.map((_, index) => (
        <span
          key={index}
          className={`star ${index < currentRating ? "filled" : ""}`}
          onClick={() => handleChange(index + 1)}
        >
          ☆
        </span>
      ))}
    </div>
  );
};

export default RatingComponent;

import "./App.css";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import $ from "jquery";
import BookGrid from "./BookGrid";

function Library() {
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userMail = localStorage.getItem("userMail");

  useEffect(() => {
    $("#myLibraryButton").addClass("selected");
    getUserBooks();
  }, []);

  const getUserBooks = () => {
    fetch(`http://127.0.0.1:8000/bookList?userMail=${userMail}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data received: ", data["books"]);
        const parsed = data["books"].map((jsonString) =>
          JSON.parse(jsonString)
        );
        setUserBooks(parsed);
      })
      .catch((error) => {});
  };

  return (
    <div style={{ width: "100%" }}>
      <Sidebar></Sidebar>

      <div className="pageTitle">
        <span>My library</span>
      </div>
      <BookGrid books={userBooks}></BookGrid>
    </div>
  );
}

export default Library;

import "./App.css";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import $ from "jquery";
import BookGrid from "./BookGrid";
import LoadingComponent from "./LoadingComponent";

function Library() {
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userMail = localStorage.getItem("userMail");

  const onDelete = async (book) => {
    console.log("ENTERED ON DELETE: ", book);
    try {
      const token = localStorage.getItem("authToken");
      console.log("current token: ", token);

      const response = await fetch(
        `http://127.0.0.1:8000/deleteBook?book=${book}&user=${localStorage.getItem(
          "userMail"
        )}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response stst: ", response);
      if (response.status != 200) {
        throw new Error("Failed to fetch user data");
      }
      const data = response.json();
      //style("display", "none");
      $("#" + book).css({ display: "none" });
      for (var i = 0; i < userBooks.length; i++) {
        //console.log("current identifier: ");
        if (userBooks[i]["identifier"] == book) {
          userBooks.splice(i, 1);
          break;
        }
      }

      console.log("new user books array: ", userBooks);
      const newBooksArray = [...userBooks];
      setUserBooks(newBooksArray);
      //showToastMessage();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    $("#myLibraryButton").addClass("selected");
    getUserBooks();
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {});
  };

  return (
    <div style={{ width: "100%" }}>
      <Sidebar></Sidebar>

      <div className="pageTitle">
        <span>My library</span>
      </div>
      {loading && <LoadingComponent current={"library"}></LoadingComponent>}
      {!loading && userBooks.length > 0 ? (
        <BookGrid
          books={userBooks}
          onDelete={onDelete}
          origin={"library"}
        ></BookGrid>
      ) : (
        !loading && (
          <div className="noBooks">
            <span>No books in your library</span>
          </div>
        )
      )}
    </div>
  );
}

export default Library;

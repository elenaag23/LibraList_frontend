import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import $ from "jquery";
import UserProfile from "./UserProfile";

const Profile = () => {
  const token = localStorage.getItem("authToken");
  const [user, setUser] = useState(null);
  const [option, setOption] = useState("1");
  const [titles, setTitles] = useState([]);
  const [book, setBooks] = useState([]);
  const cheerio = require("cheerio");

  useEffect(() => {
    $("#profileButton").addClass("selected");
    $("#option1").prop("checked", true);
    getUserData();
    //getRecommandations();
  }, []);

  const getUserData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/userData`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setUser(data["user"]);
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchData() {
      const response = await findBook();
    }
    fetchData();
  }, [titles]);

  const findBook = async () => {
    var results = [];
    var resBooks = [];
    for (var title of titles) {
      const res = await searchBook(title);
      console.log("RES RECEIVED: ", res);
      if (Array.isArray(res)) results.push(res);
    }

    for (var result of results) {
      const book = await processData(result);
      if (book != 0) resBooks.push(book);
    }

    setBooks(resBooks);
  };

  const getRecommandations = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/getRecommendations`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setTitles(data["titles"]);
      //setUser(data["user"]);
    } catch (error) {}
  };

  const selectOption = (event) => {
    setOption(event.target.value);
  };

  const searchBook = async (searchTerm) => {
    //setSearching(true);
    const apiUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
      searchTerm
    )}&output=json&mediatype=texts`;

    //const searchCache = await searchInCache(apiUrl);

    // if (!searchCache) {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log("data received: ", data);

      if ("response" in data && "docs" in data["response"]) {
        console.log("look data: ", searchTerm, data["response"]["docs"]);
        return data["response"]["docs"];
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return 0;
    }
  };

  const pdfAvailable = async (identifier, title) => {
    return new Promise((resolve, reject) => {
      const apiUrl = `http://127.0.0.1:8000/pdf/${encodeURIComponent(
        identifier
      )}`;
      fetch(apiUrl)
        .then((response) => response.text())
        .then((html) => {
          const $ = cheerio.load(html);

          const currentBook = {};
          $("table.directory-listing-table tbody tr").each((index, element) => {
            const isRestricted = $(element).hasClass(
              "directory-listing-table__restricted-file"
            );
            if (!isRestricted) {
              const url = $(element).find("td:first-child a").attr("href");
              if (url && url.split(".")[1] === "pdf") {
                currentBook.url = url;
              } else if (url && url.split(".")[1] === "jpg") {
                currentBook.jpg = url;
              }

              currentBook.identifier = identifier;
              currentBook.title = title;
            }
          });

          resolve(currentBook);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const findBookDB = async (identifier) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/getBookData?book=${identifier}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response == 204) {
        return null;
      } else {
        const data = await response.json();
        const foundBook = data["book"];
        return foundBook;
      }
    } catch (error) {}
  };

  const processData = async (data, url) => {
    //console.log("data in process data & origin: ", data, origin);
    //setSearching(false);
    //setProcessing(true);

    const arrBooks = [];
    const availableBooks = [];
    var bookIds = [];

    console.log("Process data function called: ", data);

    if (!Array.isArray(data)) return 0;

    for (const book of data) {
      if (
        book["mediatype"] === "texts" &&
        book["format"].includes("Text PDF") &&
        (book["language"] == "eng" || book["language"] == "English")
      ) {
        arrBooks.push(book);
        console.log("identifier: ", book["identifier"]);

        const res = await findBookDB(book["identifier"]);
        //const res = null;

        if (res != null) {
          //availableBooks.push(res);
          return res;
        } else {
          try {
            const cBook = await pdfAvailable(book["identifier"], book["title"]);
            if (cBook && "url" in cBook) {
              //bookIds.push([book["identifier"], book["title"]]);
              //availableBooks.push(cBook);
              return cBook;
            }
          } catch (error) {
            console.error("Error fetching PDF:", error);
            return 0;
          }
        }
      }
    }

    // addDataIntoCache("search", availableBooks, url);
    // console.log("text books: ", arrBooks);
    // console.log("book results: ", availableBooks);
    // setBookData(availableBooks);
    // console.log("search term: ", searchTerm);
    // localStorage.setItem("search", [searchTerm, url]);
    // console.log("get item after set: ", localStorage.getItem("search"));
    // setProcessing(false);

    return 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User data submitted:", user);
    editUser();
  };

  const editUser = async () => {
    console.log("user in edit user: ", user);
    try {
      const response = await fetch(`http://127.0.0.1:8000/editUser`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      //setUser(data["user"]);
    } catch (error) {}
  };

  return (
    <div>
      <Sidebar></Sidebar>
      <div className="pageTitle">
        <span>Profile page</span>
      </div>

      <div className="recommendationsTitle" style={{ marginLeft: "90px" }}>
        <span>Profile settings</span>
      </div>

      {user && (
        <div className="userForm">
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group" style={{ marginBottom: "10px" }}>
              <label
                className="userDetailsLabel"
                style={{ marginLeft: "25px" }}
              >
                Username:
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  className="userDetailsInput"
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="form-group" style={{ marginBottom: "10px" }}>
              <label
                className="userDetailsLabel"
                style={{ marginLeft: "25px" }}
              >
                Email:
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  className="userDetailsInput"
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label className="userDetailsLabel">
                Password:
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  className="userDetailsInput"
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <button
              type="submit"
              className="savePlaylistButton"
              style={{ marginLeft: "0" }}
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;

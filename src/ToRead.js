import React, { useState, useEffect } from "react";
import "./App.css";
import SearchIcon from "@mui/icons-material/Search";
import BookGrid from "./BookGrid";
import PDFViewer from "./PDFViewer";
import LoadingComponent from "./LoadingComponent";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation } from "react-router-dom";
import $ from "jquery";
import Sidebar from "./Sidebar";

function ToRead() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [search, setSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const cheerio = require("cheerio");
  const [prevPage, setPrevPage] = useState(null);
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    $("#bookshelfButton").addClass("selected");
    //getCurrentUser();
    console.log("previous page: ", localStorage.getItem("prevPage"));

    if (localStorage.getItem("prevPage") == "/read-book") {
      console.log("previously searched: ", localStorage.getItem("search"));

      if (localStorage.getItem("search") != null) {
        console.log(
          "first item: ",
          localStorage.getItem("search").split(",")[0]
        );
        $("#searchField").val(localStorage.getItem("search").split(",")[0]);
        setSearchTerm(localStorage.getItem("search").split(",")[0]);
        //handleInputChange(localStorage.getItem("search")[0]);
        searchInCache(localStorage.getItem("search").split(",")[1]);
      }
    }
    //setPrevPage(localStorage.getItem("prevPage"));
    localStorage.setItem("prevPage", location.pathname);
  }, []);

  useEffect(() => {
    if (bookData) insertIntoDB();
  }, [bookData]);

  const insertIntoDB = async () => {
    console.log("enetered insert into database");
    console.log("bookData: ", bookData);

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://127.0.0.1:8000/insertBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) {
        throw new Error("Failed inserting books in database");
      }

      const data = await response.json();
      console.log("insert book response: ", data);
    } catch (error) {
      // Handle any errors
    }
  };

  const addDataIntoCache = (cacheName, values, url) => {
    if ("caches" in window) {
      caches.open(cacheName).then((cache) => {
        const response = new Response(JSON.stringify(values));
        cache.put(url, response);
      });
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
    console.log("data in process data: ", data);
    setSearching(false);
    setProcessing(true);

    const arrBooks = [];
    const availableBooks = [];
    var bookIds = [];

    for (const book of data) {
      if (
        book["mediatype"] === "texts" &&
        book["format"].includes("Text PDF") &&
        (book["language"] == "eng" || book["language"] == "English")
      ) {
        arrBooks.push(book);
        console.log("identifier: ", book["identifier"]);

        const res = await findBookDB(book["identifier"]);

        if (res != null) {
          availableBooks.push(res);
        } else {
          try {
            const cBook = await pdfAvailable(book["identifier"], book["title"]);
            if (cBook && "url" in cBook) {
              bookIds.push([book["identifier"], book["title"]]);
              availableBooks.push(cBook);
            }
          } catch (error) {
            console.error("Error fetching PDF:", error);
          }
        }
      }
    }

    addDataIntoCache("search", availableBooks, url);
    console.log("text books: ", arrBooks);
    console.log("book results: ", availableBooks);
    setBookData(availableBooks);
    console.log("search term: ", searchTerm);
    localStorage.setItem("search", [searchTerm, url]);
    console.log("get item after set: ", localStorage.getItem("search"));
    setProcessing(false);
  };

  const searchInCache = async (apiUrl) => {
    return new Promise((resolve, reject) => {
      if ("caches" in window) {
        caches.open("search").then((cache) => {
          console.log("first cache: ", cache);
          cache.match(apiUrl).then((cachedResponse) => {
            if (cachedResponse) {
              cachedResponse.json().then(async (books) => {
                setBookData(books);
                setSearching(false);
                resolve(cachedResponse);
              });
            } else {
              resolve(false);
            }
          });
        });
      } else {
        resolve(false);
      }
    });
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    setSearching(true);
    const apiUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
      searchTerm
    )}&output=json&mediatype=texts`;

    const searchCache = await searchInCache(apiUrl);

    if (!searchCache)
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          processData(data["response"]["docs"], apiUrl);
          setSearchResults(data);
          setSearch(true);
          console.log("raspuns: ", data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    else {
      console.log("search term: ", searchTerm);
      localStorage.setItem("search", [searchTerm, apiUrl]);
    }
  };

  const getCurrentUser = async () => {
    const token = localStorage.getItem("authToken");

    console.log("current token: ", token);

    fetch("http://127.0.0.1:8000/authUser", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("current user: ", data);
        setCurrentUser(data);
      })
      .catch((error) => {});
  };

  return (
    <div style={{ width: "100%" }}>
      <Sidebar></Sidebar>

      <div className="pageTitle">
        <span>Find on Bookshelf</span>
      </div>

      <div className="mysearchbar">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group mb-4 border" style={{ width: "500px" }}>
            <input
              type="search"
              placeholder="Search for a book"
              aria-describedby="button-addon4"
              className="form-control bg-none border-0"
              value={searchTerm || ""}
              onChange={handleInputChange}
              id="searchField"
            ></input>
            <div
              className="input-group-prepend border-0"
              style={{
                marginLeft: "5px",
                marginBottom: "5px",
                marginRight: "5px",
              }}
            >
              <button
                id="button-addon4"
                type="button"
                className="searchbtn"
                onClick={handleSearch}
              >
                <SearchIcon></SearchIcon>
              </button>
            </div>
          </div>
        </form>
      </div>

      {searching && <LoadingComponent props={"search"}></LoadingComponent>}
      {processing && <LoadingComponent props={"process"}></LoadingComponent>}

      {bookData != null ? (
        <div>
          <BookGrid books={bookData} origin={"search"} />
        </div>
      ) : null}

      {bookData != null && bookData.length == 0 ? (
        <div className="noBooks">
          <span>Sorry, we found no books that match your search</span>
        </div>
      ) : null}
    </div>
  );
}

export default ToRead;

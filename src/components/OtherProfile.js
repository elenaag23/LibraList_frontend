import React, { useState, useEffect } from "react";
import "../App.css";
import Sidebar from "../components/Sidebar";
import $ from "jquery";
import UserProfile from "../UserProfile";
import Cookies from "js-cookie";
import BookGrid from "../components/BookGrid";
import BookRecommendations from "../components/BookRecommandations";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import UpdateOutlined from "@mui/icons-material/UpdateOutlined";
import { useParams } from "react-router-dom";

const OtherProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [option, setOption] = useState("1");
  const [titles, setTitles] = useState([]);
  const [books, setBooks] = useState([]);
  const [colors, setColors] = useState(null);
  const cheerio = require("cheerio");
  const [bookData, setBookData] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [map, setMap] = useState([]);
  const [favBooks, setFavBooks] = useState([]);

  useEffect(() => {
    $("#option1").prop("checked", true);
    getUserData();
    getColorTags();
    getLikes();
    getFavBooks();
    //getRecommandations();
  }, []);

  const getUserData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/otherUserData?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setUser(data["user"][0]);
    } catch (error) {}
  };

  const getFavBooks = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/getFavBooksUser?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setFavBooks(data["books"]);
    } catch (error) {}
  };

  const getLikes = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/getLikesUser?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setMap(data["map"]);
      setQuotes(data["highlights"]);
      setBookData(data["books"]);
    } catch (error) {}
  };

  const getColorTags = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/getColorTagsUser?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setColors(data["colors"]["colors"]);
      console.log("COLORS: ", data["colors"]);
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchData() {
      const response = await findBook();
      console.log("RESPONSE AFTER FIND BOOK: ", response);
      console.log("RESPONSE AFTER FIND BOOK books: ", books);
    }
    fetchData();
  }, [titles]);

  const findBook = async () => {
    var results = [];
    var resBooks = [];
    var i = 0;
    for (var title of titles) {
      //if (i == 9) break;
      const res = await searchBook(title);
      console.log("RES RECEIVED: ", res);
      if (Array.isArray(res)) results.push(res);
      i += 1;
    }

    for (var result of results) {
      const book = await processData(result);
      console.log("RES PROCESS DATA: ", book);
      if (book != 0 && "jpg" in book) resBooks.push(book);
      if (resBooks.length == 10) break;
    }
    console.log("book results: ", resBooks);

    setBooks(resBooks);
  };

  const getRecommandations = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/getRecommendations`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setTitles(data["titles"]);
      console.log("TITLES: ", titles);
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

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const search = await searchInCache(user["id"]);
      };
      fetchData();
    }
    //if(user["recommDate"]) getRecommandations();
  }, [user]);

  const searchInCache = async (userId) => {
    console.log("entered search in cache");
    return new Promise((resolve, reject) => {
      if ("caches" in window) {
        caches.open("recommandations").then((cache) => {
          console.log("first cache: ", cache);
          cache.match("/" + userId).then((cachedResponse) => {
            if (cachedResponse) {
              cachedResponse.json().then(async (books) => {
                console.log("chacked response: ", books);
                setBooks(books);
                // setSearching(false);
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

  const generateRecommandations = () => {
    getRecommandations();
  };

  return (
    <div>
      <Sidebar></Sidebar>
      <div className="pageTitle">
        <span>Profile page</span>
      </div>

      <div
        className="row"
        style={{
          marginTop: "30px",
          width: "99%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div className="col-3 highlights" style={{ paddingBottom: "16px" }}>
          <div className="titles">
            <span>Profile settings</span>
          </div>
          {console.log("here is the user: ", user)}

          {user && (
            <div className="userForm">
              <form className="user-form">
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
                      readOnly
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
                      readOnly
                    />
                  </label>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    marginLeft: "3%",
                    height: "35px",
                    width: "100%",
                  }}
                >
                  <label className="userDetailsLabel">Bio:</label>
                  <textarea
                    id="comment"
                    placeholder="Leave a comment here..."
                    style={{ width: "80%" }}
                    className="userInputDetails"
                  ></textarea>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="col-3 highlights" style={{ paddingBottom: "16px" }}>
          <div className="titles">
            <span>Colour tags</span>
          </div>

          {colors && (
            <div style={{ marginTop: "25px" }}>
              <form className="user-form">
                <div
                  className="form-group"
                  style={{
                    marginBottom: "10px",
                    marginRight: "60%",
                    paddingBottom: "16px",
                  }}
                >
                  <label
                    class="btn btn-secondary"
                    style={{
                      backgroundColor: "blue",
                    }}
                  >
                    <input
                      type="text"
                      name="blue"
                      value={colors.blue}
                      className="userDetailsInput"
                      readOnly
                      style={{ marginLeft: "40px" }}
                    />
                  </label>
                </div>
                <div
                  className="form-group"
                  style={{ marginBottom: "10px", marginRight: "60%" }}
                >
                  <label
                    class="btn btn-secondary"
                    style={{
                      backgroundColor: "red",
                    }}
                  >
                    <input
                      type="text"
                      name="red"
                      value={colors.red}
                      className="userDetailsInput"
                      readOnly
                      style={{ marginLeft: "40px" }}
                    />
                  </label>
                </div>
                <div
                  className="form-group"
                  style={{ marginBottom: "10px", marginRight: "60%" }}
                >
                  <label
                    class="btn btn-secondary"
                    style={{
                      backgroundColor: "green",
                    }}
                  >
                    <input
                      type="text"
                      name="green"
                      value={colors.green}
                      className="userDetailsInput"
                      readOnly
                      style={{ marginLeft: "40px" }}
                    />
                  </label>
                </div>
                <div
                  className="form-group"
                  style={{ marginBottom: "10px", marginRight: "60%" }}
                >
                  <label
                    class="btn btn-secondary"
                    style={{
                      backgroundColor: "orange",
                    }}
                  >
                    <input
                      type="text"
                      name="orange"
                      value={colors.orange}
                      className="userDetailsInput"
                      readOnly
                      style={{ marginLeft: "40px" }}
                    />
                  </label>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="col-3 highlights" style={{ paddingBottom: "16px" }}>
          <div className="titles">
            <span>Favorite books</span>
          </div>

          <div>
            {favBooks &&
              favBooks.map((elem, index) => <li key={index}>{elem}</li>)}
          </div>
        </div>
      </div>

      <div
        className="row"
        style={{
          marginTop: "30px",
          width: "99%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div>
          <div className="recommendationsTitle" style={{ marginLeft: "90px" }}>
            <span>Liked quotes</span>
          </div>

          <div>
            <div className="highlights">
              <div className="contentHighlight">
                {console.log("QUOTES: ", quotes)}
                {/* {quotes &&
                  quotes.map((elem, index) => <li key={index}>{elem}</li>)} */}

                {quotes &&
                  Object.entries(quotes).map(([key, value]) => (
                    <li key={key}>
                      <span style={{ color: "#6d7fcc", fontWeight: "600" }}>
                        {bookData[map[key]]}:
                      </span>{" "}
                      <span>{value}</span>
                    </li>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: "30px", width: "99%" }}>
        <div>
          <div className="recommendationsTitle" style={{ marginLeft: "90px" }}>
            <span>Book recommandations</span>
          </div>

          <div>
            <div className="highlights">
              <div className="contentHighlight refreshRecomm">
                <button
                  onClick={generateRecommandations}
                  className="refreshRecommButton"
                >
                  <UpdateOutlined></UpdateOutlined>
                </button>
              </div>
              <div>
                {books && (
                  <BookRecommendations
                    books={books}
                    max={10}
                  ></BookRecommendations>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherProfile;

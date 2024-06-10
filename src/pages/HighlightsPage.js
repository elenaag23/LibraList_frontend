import React, { useState, useEffect } from "react";
import "../App.css";
import Sidebar from "../components/Sidebar";
import $ from "jquery";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { ToastContainer, toast } from "react-toastify";

const HighlightsPage = () => {
  const token = localStorage.getItem("authToken");
  const [user, setUser] = useState(null);
  const [option, setOption] = useState("0");
  const [books, setBooks] = useState([]);
  const [displayedHighlights, setDisplayedHighlights] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [colors, setColors] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [color, setColor] = useState(null);
  const [displayedColor, setDisplayedColor] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    $("#highlightsButton").addClass("selected");
    console.log("eleemnt: ", $("#option0"));
    initiateCall();
  }, []);

  const showToastMessageSuccessAdd = () => {
    console.log("entered toast");
    toast.info("Quote added to favorites!", {
      position: "top-center",
    });
  };

  const showToastMessageSuccessRemove = () => {
    console.log("entered toast");
    toast.info("Quote removed from your favorites!", {
      position: "top-center",
    });
  };

  const showToastMessageError = () => {
    console.log("entered toast");
    toast.error("Error at like! Try again", {
      position: "top-center",
    });
  };

  const initiateCall = async () => {
    const res = await bookHighlights();
    console.log("books returned: ", res["books"]);
    setBooks(res["books"]);
    setHighlights(res["map"]);
    setDisplayedHighlights(res["map"][res["books"][0]["bookId"]]);
    setColors(res["colors"]);
    setDisplayedColor(res["colors"][res["books"][0]["bookId"]]);
    const firstKey = Object.keys(res["map"][res["books"][0]["bookId"]])[0];
    setQuotes(res["map"][res["books"][0]["bookId"]][firstKey]);
    setColor(res["colors"][res["books"][0]["bookId"]][0]);
    console.log("books : ", res["map"][res["books"][0]["bookId"]][firstKey]);
    setLikes(res["liked"]);
  };

  useEffect(() => {
    $("#option0").prop("checked", true);
  }, [books]);

  useEffect(() => {
    $("#color0").prop("checked", true);
  }, [displayedColor]);

  const bookHighlights = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/booksHighlights`, {
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

      console.log("data returned: ", data);
      //setBooks(data["books"]);
      return data;
    } catch (error) {}
  };

  const likeButton = async (highlightId) => {
    console.log("click like: ", likes);
    const res = await toggleLike(highlightId);

    if (res == 1) {
      if (likes.indexOf(highlightId) == -1) {
        var newLikes = likes.slice();
        newLikes.push(highlightId);
        setLikes(newLikes);
        console.log("likes in if: ", newLikes);
        showToastMessageSuccessAdd();
      } else {
        likes.splice(likes.indexOf(highlightId), 1);
        var newLikes = likes.slice();
        setLikes(newLikes);
        console.log("likes in else: ", newLikes);
        showToastMessageSuccessRemove();
      }
      console.log("new likes: ", likes);
    } else showToastMessageError();
  };

  const toggleLike = async (highlightId) => {
    console.log("click like2: ", highlightId);
    try {
      const response = await fetch(`http://127.0.0.1:8000/toggleLike`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(highlightId),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
        return 0;
      }

      const data = await response.json();
      console.log("data returned: ", data);
      return 1;
    } catch (error) {}
  };

  const selectOption = (event) => {
    console.log("clicked: ", colors);
    console.log("clicked2: ", highlights);
    console.log("clicked3: ", displayedHighlights);
    setOption(event.target.value);
    //setColors(highlights[event.target.value][1]);
    setDisplayedHighlights(highlights[event.target.value]);
    setDisplayedColor(colors[event.target.value]);
    var first = colors[event.target.value][0];
    setColor(colors[event.target.value][0]);
    setQuotes(highlights[event.target.value][first]);
  };

  const selectColor = (event) => {
    //setDisplayedHighlights(highlights[option][event.target.value]);

    console.log("highlights: ", displayedHighlights[event.target.value]);
    setQuotes(displayedHighlights[event.target.value]);
    setColor(event.target.value);
  };

  return (
    <div>
      <Sidebar></Sidebar>
      <ToastContainer />
      <div className="pageTitle">
        <span>Book quotes</span>
      </div>
      <div
        className="row"
        style={{ width: "97vw", height: "100vh", margin: "16px" }}
      >
        <div
          className="col-3"
          style={{ backgroundColor: "#8e9bd7", paddingLeft: "0px" }}
        >
          {console.log("books at display: ", books)}
          {books.length > 0 &&
            books.map((book, index) => {
              return (
                <div
                  style={{ width: "100%", height: "50px" }}
                  className="bookBar"
                >
                  <input
                    type="radio"
                    class="btn-check2"
                    name="bookSidebar"
                    id={`option${index}`}
                    autocomplete="off"
                    value={book.bookId}
                    onChange={selectOption}
                    style={{ position: "absolute", appearance: "none" }}
                  ></input>
                  <label
                    id="songLabel"
                    class="btn settingsLabel"
                    htmlFor={`option${index}`}
                    style={{
                      borderRadius: "0px",
                      paddingTop: "10px",
                      fontSize: "large",
                      fontWeight: "700",
                      width: "100%",
                      height: "50px",
                    }}
                  >
                    {book.bookName}
                  </label>
                </div>
              );
            })}
        </div>
        <div
          className="col-9 row"
          style={{
            backgroundColor: "#c6cdeb",
            borderLeft: "2px solid #a1acde",
          }}
        >
          <div className="row" style={{ height: "10%" }}>
            {console.log("colors at display: ", colors)}
            {displayedColor.length > 0 &&
              displayedColor.map((color, index) => {
                return (
                  <div className="col">
                    <div style={{ width: "100%", height: "50px" }}>
                      <input
                        type="radio"
                        class="btn-check2"
                        name="colorHighlight"
                        id={`color${index}`}
                        autocomplete="off"
                        value={color}
                        onChange={selectColor}
                        style={{ position: "absolute", appearance: "none" }}
                      ></input>
                      <label
                        id="songLabel"
                        class="btn settingsLabel"
                        htmlFor={`color${index}`}
                        style={{
                          borderRadius: "0px",
                          paddingTop: "10px",
                          fontSize: "large",
                          fontWeight: "700",
                          width: "100%",
                          height: "50px",
                          backgroundColor: color.split("text-")[1],
                        }}
                      ></label>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="row" style={{ height: "90%" }}>
            {color != null && (
              <div className={`bulletColor${color.split("text-")[1]}`}>
                {quotes.length > 0 &&
                  quotes.map((quote, index) => {
                    return (
                      <li>
                        <span style={{ fontSize: "500" }}>
                          {quote.highlightText}
                        </span>
                        {likes && (
                          <div
                            style={{ display: "inline-flex", marginLeft: "8%" }}
                          >
                            <button
                              onClick={() => likeButton(quote.highlightId)}
                            >
                              <span>
                                {likes.indexOf(quote.highlightId) == -1 ? (
                                  <FavoriteBorderIcon></FavoriteBorderIcon>
                                ) : (
                                  <FavoriteIcon></FavoriteIcon>
                                )}
                              </span>
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightsPage;

import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";
import Sidebar from "../components/Sidebar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightComponent from "../components/HighlightComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "../components/LoadingComponent";
import $ from "jquery";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const ReadBook = () => {
  const location = useLocation();
  console.log("Location state:", location.state);
  const { state } = location;
  const book = state && state.book;
  const userMail = localStorage.getItem("userMail");
  const [added, setAdded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [highlights, setHighlights] = useState(null);
  const [highlightedColors, setHighlightedColors] = useState(null);
  const [col, setCol] = useState(null);
  const [highlighted, setHighlighted] = useState(null);
  const [noHighlights, setNoHighlights] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const token = localStorage.getItem("authToken");
  const [genre, setGenre] = useState(null);
  const [description, setDescription] = useState(null);
  const [colors, setColors] = useState([]);
  const [retrievedComments, setRetrievedComments] = useState([]);
  const [map, setMap] = useState([]);
  const [users, setUsers] = useState([]);
  const [inEdit, setInEdit] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [commentIndex, setCommentIndex] = useState(null);
  const [commentsNumber, setCommentsNumber] = useState(0);

  const editIcon =
    '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditOutlinedIcon"><path d="m14.06 9.02.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"></path></svg>';

  const deleteIcon =
    '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteOutlineOutlinedIcon"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5-1-1h-5l-1 1H5v2h14V4z"></path></svg>';

  const showToastMessage = () => {
    console.log("entered toast");
    toast.info("Book added to your library!", {
      position: "top-center",
    });
  };

  const getUserColors = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/getColorTags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("response: ", data);
        console.log("colors: ", data["colors"]["colors"]);
        setColors(data["colors"]["colors"]);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const addToLibrary = () => {
    fetch("http://localhost:8000/addToLibrary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-XSRF-TOKEN": localStorage.getItem("xsrf"),
      },
      credentials: "include",
      body: JSON.stringify({ book: book.identifier }),
    })
      .then((response) => {
        //console.log("response: ", response.json());
        if (response.ok) {
          setAdded(true);
          showToastMessage();
        }
      })
      .catch((error) => {
        // Handle any errors
      });
  };

  const userHasBook = () => {
    fetch(
      `http://127.0.0.1:8000/userBook?userMail=${userMail}&bookIdentifier=${book.identifier}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        console.log("response in ujser has book data: ", data);
        if (data.has == true) {
          setAdded(true);
          setPageNumber(data.pageNumber);
        } else setAdded(false);
        setLoading(false);
      })
      .catch((error) => {});
  };

  const getPDF = () => {
    const url = `https://archive.org/download/${encodeURIComponent(
      book.identifier
    )}/${book.url}`;
    fetch(`http://127.0.0.1:8000/getpdf?url=${url}`, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        console.log("here s blob: ", blob);
        setPdf(blob);
      })
      .catch((error) => {
        console.error("Error fetching PDF:", error);
      });
  };

  const displayHighlights = () => {
    fetch(
      `http://127.0.0.1:8000/displayHighlights?userMail=${userMail}&bookIdentifier=${book.identifier}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        console.log("response in ujser has book data: ", data);
        // if (data.has == true) setAdded(true);
        // else setAdded(false);
        // setLoading(false);
      })
      .catch((error) => {});
  };

  const userHasHighlights = () => {
    fetch(
      `http://127.0.0.1:8000/userHighlightsBook?userMail=${userMail}&bookIdentifier=${book.identifier}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        console.log("response in user book highlights data: ", data);

        if (data["highlights"].length == 0) {
          console.log("entered if");
          setHighlights([]);
          setHighlightedColors([]);
          setHighlighted(null);
        } else {
          console.log("entered else");
          setHighlights(data["highlights"]);
          setHighlightedColors(Object.keys(data["colors"]));
          setHighlighted(data["colors"]);
          setNoHighlights(false);
        }

        if (Object.keys(data["colors"]).length < 2) setCol("col-4");
        else setCol("col");
      })
      .catch((error) => {});
  };

  const deleteHighlights = () => {
    var highsDef = document.getElementsByClassName("highlighted-text-def");

    if (highsDef.length > 0) {
      Array.from(highsDef).forEach((element) => {
        element.remove();
      });
    }

    var highsRed = document.getElementsByClassName("highlighted-text-red");

    if (highsRed.length > 0) {
      Array.from(highsRed).forEach((element) => {
        element.remove();
      });
    }

    var highsBlue = document.getElementsByClassName("highlighted-text-blue");

    if (highsBlue.length > 0) {
      Array.from(highsBlue).forEach((element) => {
        element.remove();
      });
    }

    var highsGreen = document.getElementsByClassName("highlighted-text-green");

    if (highsGreen.length > 0) {
      Array.from(highsGreen).forEach((element) => {
        element.remove();
      });
    }

    var highsOrange = document.getElementsByClassName(
      "highlighted-text-orange"
    );

    if (highsOrange.length > 0) {
      Array.from(highsOrange).forEach((element) => {
        element.remove();
      });
    }
  };

  const getBookInfo = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/getBookInfo?bookTitle=${book.title}&bookIdentifier=${book.identifier}`,
        {
          method: "GET",
        }
      );

      if (response.status == 200) {
        const data = await response.json();
        setGenre(data["bookGenre"]);
        setDescription(data["bookDescription"]);

        console.log(
          "genre and description: ",
          data["bookGenre"],
          data["bookDescription"]
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    var element1 = $(
      `<div class='commentStyle'><div><span class='userComment'>SilvanaP:</span><span>Adventure book fans... this is a must</span></div></div>`
    );
    var element2 = $(
      `<div class='commentStyle'><div><span class='userComment'>PatryM:</span><span>This story engaged my lust for travel</span></div></div>`
    );
    //   $("#commentSection").append(element1);
    //  $("#commentSection").append(element2);

    console.log("prev page: ", localStorage.getItem("prevPage"));
    localStorage.setItem("prevPage", location.pathname);

    getBookInfo();

    getPDF();
    console.log("pdf?? ", pdf);
    userHasBook();
    userHasHighlights();
    getUserColors();
    getComments(book.identifier);

    return () => {
      deleteHighlights();
    };
  }, []);

  // const handleClickOutside = () => {
  //   // Handle click outside by triggering blur event
  //   //console.log("entered here: ", $("#pageInput").val());
  //   console.log("page pageNumber: ", pageNumber);
  //   if (!pageNumber) {
  //     console.log("entered if");
  //     setPageNumber(1);
  //   }

  //   const input = document.getElementById("pageInput");
  //   if (!input) {
  //     input.blur();
  //   }
  // };

  const addComment = async (comment) => {
    return fetch(process.env.REACT_APP_BACKEND_URL + "/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-XSRF-TOKEN": localStorage.getItem("xsrf"),
      },
      credentials: "include",
      body: JSON.stringify({ book: book.identifier, comment: comment }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("error adding comment");
        } else return response.json();
      })
      .then((data) => {
        console.log("data to add comments: ", data);
        console.log("here is id comment!: ", data["idComment"]);
        return data["idComment"];
      })
      .catch((error) => {
        // Handle any errors
      });
  };

  const getComments = (identifier) => {
    fetch(
      process.env.REACT_APP_BACKEND_URL + `/getComments?book=${identifier}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          console.log("Error retrieving comments ");
        } else return response.json();
      })
      .then((data) => {
        console.log("data to comments: ", data);
        setRetrievedComments(data["comments"]);
        setMap(data["map"]);
        setUsers(data["users"]);
        setCommentsNumber(data["comments"].length);
      })
      .catch((error) => {
        // Handle any errors
      });
  };

  const editComment = (commentText) => {
    console.log("entered edit comment");
    fetch(process.env.REACT_APP_BACKEND_URL + "/editComment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-XSRF-TOKEN": localStorage.getItem("xsrf"),
      },
      credentials: "include",
      body: JSON.stringify({
        book: book.identifier,
        comment: commentId,
        commentText: commentText,
      }),
    })
      .then((response) => {})

      .catch((error) => {
        // Handle any errors
      });
  };

  const deleteComment = (commentId) => {
    console.log("entered edit comment");
    fetch(process.env.REACT_APP_BACKEND_URL + "/deleteComment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-XSRF-TOKEN": localStorage.getItem("xsrf"),
      },
      credentials: "include",
      body: JSON.stringify({
        comment: commentId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          //setAdded(true);
          //showToastMessage();
        }
      })
      .catch((error) => {
        // Handle any errors
      });
  };

  const submitComment = async () => {
    console.log("entered submit");
    var comment = document.getElementById("comment").value;
    if (inEdit === false) {
      var idComment = await addComment(comment);
      console.log("id comment in submit comment: ", idComment);
      var element = $(
        `<div class='commentStyle' id='comment${commentsNumber}'><div><span class='userComment'>${localStorage.getItem(
          "userName"
        )}:</span><span>${comment}</span></div><div><button class='editButton' id='editButton${idComment}'>${editIcon}
</button><button class='editButton' id='deleteButton${idComment}'>${deleteIcon}</button></div></div>`
      );
      $("#myCommentSection").append(element);
      $(`#editButton${idComment}`).on("click", function () {
        handleCommentEdit(idComment, commentsNumber, comment);
      });
      $(`#deleteButton${idComment}`).on("click", function () {
        handleCommentDelete(idComment, commentsNumber);
      });
      setCommentsNumber(commentsNumber + 1);
    } else {
      editComment(comment);
      $("#" + commentIndex).text(comment);
      setInEdit(false);
    }
    document.getElementById("comment").value = "";
  };

  const handleCommentEdit = (commentId, index, commentText) => {
    console.log("entered handle edit");
    setInEdit(true);
    setCommentId(commentId);
    setCommentIndex(index);
    document.getElementById("comment").value = commentText;
  };

  const handleCommentDelete = (commentId, index) => {
    console.log("entered handle delete");
    deleteComment(commentId);
    setCommentsNumber(commentsNumber - 1);
    $("#comment" + index).css("display", "none");
  };

  return (
    <div>
      <Sidebar></Sidebar>
      <ToastContainer />
      {book ? (
        <div>
          <div className="readBookContent">
            <div className="iframeDisplay bookBox">
              {console.log("pdf:", pdf)}
              {console.log("book:", book)}
              {console.log("highlights:", highlights)}
              {console.log("highlightedColors:", highlightedColors)}
              {!(
                pdf &&
                book &&
                highlights !== null &&
                highlightedColors !== null
              ) ? (
                <div style={{ marginLeft: "20%", marginTop: "15%" }}>
                  <LoadingComponent current={"book"} />
                </div>
              ) : (
                <PDFViewer
                  pdfUrl={pdf}
                  book={book}
                  highs={highlights}
                  highlighted={highlightedColors}
                  currentPageNumber={pageNumber}
                  ownStatus={added}
                ></PDFViewer>
              )}
            </div>

            <div className="bookSide">
              <div className="boxZones" style={{ display: "flow" }}>
                <div
                  style={{
                    paddingLeft: "28px",
                    display: "flex",
                    paddingTop: "8px",
                  }}
                >
                  <div style={{ width: "80%" }}>
                    <h3>{book.title}</h3>
                  </div>
                  {!loading && !added ? (
                    <div style={{ paddingTop: "10px", width: "20%" }}>
                      {" "}
                      <button
                        onClick={addToLibrary}
                        className="addToLibraryButton"
                      >
                        <AddCircleIcon></AddCircleIcon>
                      </button>
                    </div>
                  ) : !loading ? (
                    <div style={{ paddingTop: "10px", width: "20%" }}>
                      {" "}
                      <CheckCircleIcon></CheckCircleIcon>
                    </div>
                  ) : null}
                </div>
                {genre && description && (
                  <div>
                    <li className="noListType">
                      <span style={{ fontWeight: "600" }}>{description}</span>
                    </li>

                    <li className="noListType">
                      <span className="propertyFont">Genre: </span>
                      <span>{genre}</span>
                    </li>
                  </div>
                )}

                <div className="horizontalLine">
                  <hr></hr>
                </div>

                <div>
                  <div>
                    <div className="commentSection">Comment section</div>
                    <div className="row" style={{ width: "98%" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          marginLeft: "3%",
                          height: "38px",
                        }}
                      >
                        <textarea
                          id="comment"
                          placeholder="Leave a comment here..."
                          style={{ width: "90%" }}
                        ></textarea>
                        <button className="editButton" onClick={submitComment}>
                          <SendOutlinedIcon></SendOutlinedIcon>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* <button>
                      <EditOutlinedIcon></EditOutlinedIcon>
                    </button>

                    <button>
                      <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
                    </button> */}
                  </div>
                  <div
                    id="myCommentSection"
                    className="row"
                    style={{ width: "95%" }}
                  ></div>
                  <div
                    id="commentSection"
                    className="row"
                    style={{ width: "95%" }}
                  >
                    {retrievedComments &&
                      retrievedComments.map((elem, index) => (
                        <div className="commentStyle" id={`comment${index}`}>
                          <div>
                            <span class="userComment">
                              {users[map[elem["commentId"]]]}
                            </span>
                            <span id={index}>{elem["commentText"]}</span>
                          </div>

                          {localStorage.getItem("userName") ===
                            users[map[elem["commentId"]]] && (
                            <div>
                              <button
                                class="editButton"
                                onClick={() =>
                                  handleCommentEdit(
                                    elem["commentId"],
                                    index,
                                    elem["commentText"]
                                  )
                                }
                              >
                                <EditOutlinedIcon />
                              </button>
                              <button
                                class="editButton"
                                onClick={() =>
                                  handleCommentDelete(elem["commentId"], index)
                                }
                              >
                                <DeleteOutlineOutlinedIcon />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* <div className="boxZones">
                <h3>book comments</h3>
              </div> */}
            </div>
          </div>

          <div
            className="row"
            style={{ width: "100%", marginTop: "36px" }}
            id="highlightsContainer"
          >
            {highlighted && (
              <div className="pageTitle">
                <span>Your Highlights</span>
              </div>
            )}

            <div
              className="row"
              style={{ marginTop: "16px" }}
              id="highlightsComponent"
            >
              {highlightedColors &&
                highlightedColors.map((element, index) => (
                  <HighlightComponent
                    colorHeader={`backgroundColor${element.split("-").pop()}`}
                    col={col}
                    highlighted={highlighted[element]}
                    colors={colors}
                  />
                ))}

              {/* <HighlightComponent colorHeader={"backgroundColorRed"} />
              <HighlightComponent colorHeader={"backgroundColorBlue"} />
              <HighlightComponent colorHeader={"backgroundColorGreen"} />
              <HighlightComponent colorHeader={"backgroundColorOrange"} />
              <HighlightComponent colorHeader={"backgroundColorDef"} /> */}

              {/* <div className="col">div 2</div>

              <div className="col">div 3</div>
              <div className="col">div 4</div>
              <div className="col">div 5</div> */}
            </div>
          </div>
        </div>
      ) : (
        <p>No book details available.</p>
      )}
    </div>
  );
};

export default ReadBook;

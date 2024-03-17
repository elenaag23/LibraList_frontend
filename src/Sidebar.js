import React, { useState, useEffect } from "react";
import "./App.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, NavLink } from "react-router-dom";

function Sidebar() {
  const [currentUser, setCurrentUser] = useState(null);
  const username = localStorage.getItem("userName");

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    fetch("127.0.0.1:8000/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        response.json();
        console.log("response: ", response);
        window.location.href = "/login";
      })
      .then((data) => {
        // Handle the response data here
      })
      .catch((error) => {
        // Handle any errors
      });
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
    <div className="readBookTitle">
      <div className="row" style={{ width: "100%" }}>
        <div className="col-4">
          <div className="row">
            <div className="col-4"></div>
            <div
              className="col-4 pageActive"
              style={{ height: "60px" }}
              id="myLibraryButton"
            >
              <Link to="/library" className="myLibraryButton">
                <div className="littleDiv">My library</div>
              </Link>
            </div>
            <div
              className="col-4 pageActive"
              style={{ height: "60px" }}
              id="bookshelfButton"
            >
              <Link to="/toread" className="myLibraryButton">
                <div className="littleDiv">Bookshelf</div>
              </Link>
            </div>
          </div>
          {/* <Link to="/library" className="myLibraryButton">
            <div>My library</div>
          </Link> */}
        </div>
        <div className="col-4">
          <div className="row">
            <div className="col-6"></div>
            <div className="col-6"></div>
          </div>
        </div>
        <div className="col-4">
          <div className="row">
            <div className="col-3"></div>
            <div className="col-3"></div>
            <div
              className="displayIn col-6"
              style={{ paddingLeft: "80px", paddingTop: "10px" }}
            >
              <div className="displayName">
                <span>Hello</span>
                {username != null ? <span>, {username}</span> : null}
                <span>!</span>
              </div>
              <div id="logoutButton">
                <button
                  onClick={handleLogout}
                  style={{
                    border: "none",
                    backgroundColor: "inherit",
                    color: "inherit",
                    fontSize: "18px",
                  }}
                >
                  <LogoutIcon></LogoutIcon>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 

         */}
      </div>
    </div>
  );
}

export default Sidebar;

import React, { useState, useEffect } from "react";
import "./App.css";
import LogoutIcon from "@mui/icons-material/Logout";

function Sidebar() {
  const [currentUser, setCurrentUser] = useState(null);

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
      <div className="displayLogoutButton">
        <div className="displayIn">
          <div className="displayName">
            <span>Hello</span>
            {currentUser != null ? <span>, {currentUser.name}</span> : null}
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
  );
}

export default Sidebar;

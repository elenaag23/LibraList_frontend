import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import $ from "jquery";

const UserPlaylists = () => {
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylist] = useState(null);
  const userMail = localStorage.getItem("userMail");

  useEffect(() => {
    $("#playlistButton").addClass("selected");
    setLoading(true);
  }, []);

  const getUserPlaylists = () => {
    fetch(`http://127.0.0.1:8000/userPlaylists?userMail=${userMail}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data received: ", data);
        setLoading(false);
      })
      .catch((error) => {});
  };

  return (
    <div style={{ width: "100%" }}>
      <Sidebar></Sidebar>
      <div className="pageTitle">
        <span>Playlists</span>
      </div>

      <div></div>
    </div>
  );
};

export default UserPlaylists;

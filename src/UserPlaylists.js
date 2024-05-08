import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import $ from "jquery";

const UserPlaylists = () => {
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylist] = useState(null);
  const [songs, setSongs] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(0);
  const userMail = localStorage.getItem("userMail");

  useEffect(() => {
    console.log("entered user playlist");
    $("#playlistButton").addClass("selected");
    setLoading(true);
    getUserPlaylists();
  }, []);

  const getUserPlaylists = () => {
    fetch(`http://127.0.0.1:8000/userPlaylists`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data received: ", data);
        console.log(
          "selected playlist: ",
          data["playlistData"][0]["playlistId"]
        );
        console.log(data["map"]["7"]);
        setPlaylist(data["playlistData"]);
        console.log(" playlis data: ");
        setSongs(data["map"]);
        console.log(" songssss");
        console.log(" final");

        setLoading(false);
      })
      .catch((error) => {});
  };

  const selectPlaylist = (event) => {
    setSelectedPlaylist(event.target.value);
    console.log("changed color: ", event.target.value);
  };

  return (
    // <div>
    //   <div>gol</div>
    // </div>
    <div style={{ width: "100%" }}>
      <Sidebar></Sidebar>
      <div className="pageTitle">
        <span>Playlists</span>
      </div>

      <div></div>

      <div
        className="row"
        style={{ width: "97vw", height: "100vh", margin: "16px" }}
      >
        <div
          className="col-3"
          style={{ backgroundColor: "#d9def2" }}
          id="playlistRectangle"
        >
          {console.log("SELECTED PLAYLIST: ", selectedPlaylist)}
          {playlists &&
            playlists.map((playlist, index) => (
              <div
                key={index}
                className="playlistsList"
                style={{ width: "95%" }}
              >
                <div className="songItem" style={{ width: "100%" }}>
                  {/* <span className="songFont2" style={{ color: "white" }}>
                    {playlist.playlistName}
                  </span> */}

                  <input
                    type="radio"
                    class="btn-check2"
                    name="playlistOptions"
                    id={`option${index}`}
                    autocomplete="off"
                    value={index}
                    onChange={selectPlaylist}
                    style={{ position: "absolute", bottom: "0px" }}
                  ></input>
                  <label
                    class="btn "
                    for={`option${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      color: "white",
                      fontWeight: "500",
                    }}
                  >
                    {playlist.playlistName}
                  </label>
                </div>
              </div>
            ))}
        </div>
        <div
          className="col-9 row"
          style={{
            backgroundColor: "#6d7fcc",
            borderLeft: "2px solid #a1acde",
          }}
        >
          <div className="col-8" style={{ height: "100vh" }}>
            <div className="video-container">
              <iframe
                width="560"
                height="315"
                src={"https://www.youtube.com/embed/xo1VInw-SKc"}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="col-4" style={{ height: "100vh" }}>
            <div className="songTitle">
              <span>{playlists[0]["playlistName"]} songs</span>
            </div>
            {songs &&
              songs[playlists[{ selectedPlaylist }]["playlistId"]] &&
              songs[playlists[{ selectedPlaylist }]["playlistId"]].map(
                (song, index) => (
                  <div key={index} className="playlistsList">
                    {console.log("playlist: ", song)}

                    <div
                      className="songItem2"
                      style={{ height: "50px", width: "100%" }}
                    >
                      <span className="songFont2">
                        {song.songName} - {song.songArtist}
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPlaylists;

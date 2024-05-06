import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import $ from "jquery";

const PlaylistUser = () => {
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylist] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(0);
  const [selectedSong, setSelectedSong] = useState(0);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    initiateData();
    console.log("entered user playlist");
    setLoading(true);
  }, []);

  const initiateData = async () => {
    const response = await getUserPlaylists();
    setSelectedSong(
      songs[playlists[selectedPlaylist]["playlistId"]][0]["songLink"].split(
        "?v="
      )[1]
    );
    $("#option0").prop("checked", true);
    $("#song0").prop("checked", true);
  };

  const getUserPlaylists = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/userPlaylists2`, {
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
      setPlaylist(data["playlistData"]);
      console.log(" playlis data: ");
      setSongs(data["map"]);
      console.log(" songssss");
      console.log(" final");

      setLoading(false);
    } catch (error) {}
  };

  const selectPlaylist = (event) => {
    setSelectedPlaylist(event.target.value);
    console.log("changed color: ", event.target.value);
    setSelectedSong(
      songs[playlists[event.target.value]["playlistId"]][0]["songLink"].split(
        "?v="
      )[1]
    );
  };

  const selectSong = (event) => {
    setSelectedSong(event.target.value);
    console.log("changed song: ", event.target.value);
  };

  return (
    // <div>
    //   <div>gol</div>
    // </div>
    <div style={{ width: "100%" }}>
      <Sidebar></Sidebar>
      {/* <div className="pageTitle">
        <span>Playlists</span>
      </div>

      <div></div> */}

      <div
        className="row"
        style={{ width: "97vw", height: "100vh", margin: "16px" }}
      >
        <div
          className="col-3"
          style={{ backgroundColor: "#6d7fcc" }}
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
                    style={{ position: "absolute", appearance: "none" }}
                  ></input>
                  <label
                    id="songLabel"
                    class="btn"
                    for={`option${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
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
            backgroundColor: "#d9def2",
            borderLeft: "2px solid #a1acde",
          }}
        >
          <div className="col-8" style={{ height: "100vh" }}>
            <div className="video-container">
              <iframe
                width="600"
                height="400"
                src={`https://www.youtube.com/embed/${selectedSong}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: "7px solid #6d7fcc", borderRadius: "5px" }}
              ></iframe>
            </div>
          </div>
          <div className="col-4" style={{ height: "100vh" }}>
            <div className="songTitle">
              <span>{playlists[selectedPlaylist]["playlistName"]} songs</span>
            </div>
            {songs &&
              songs[playlists[selectedPlaylist]["playlistId"]] &&
              songs[playlists[selectedPlaylist]["playlistId"]].map(
                (song, index) => (
                  <div key={index} className="playlistsList">
                    {console.log("playlist: ", song)}

                    <div
                      className="songItem2"
                      style={{ height: "40px", width: "100%" }}
                    >
                      {/* <span className="songFont2">
                        {song.songName} - {song.songArtist}
                      </span> */}
                      <input
                        type="radio"
                        class="btn-check3"
                        name="songOptions"
                        id={`song${index}`}
                        autocomplete="off"
                        value={song.songLink.split("?v=")[1]}
                        onChange={selectSong}
                        style={{ position: "absolute", appearance: "none" }}
                      ></input>
                      <label
                        class="btn "
                        for={`song${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          color: "white",
                          fontWeight: "500",
                          display: "flex",
                        }}
                      >
                        <span className="songFont2">
                          {song.songName} - {song.songArtist}
                        </span>
                      </label>
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

export default PlaylistUser;

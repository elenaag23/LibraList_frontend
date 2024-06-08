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
    const fetchData = async () => {
      await initiateData();
      setLoading(true);
      console.log("entered user playlist");
    };

    $("#playlistButton").addClass("selected");
    fetchData();

    // Optionally return a cleanup function here if needed
    return () => {
      // Cleanup logic if necessary
    };
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      await initiateData();
      setLoading(true);
      console.log("entered user playlist");
    };

    $("#playlistButton").addClass("selected");
    fetchData();
  }, []);

  const initiateData = async () => {
    const response = await getUserPlaylists();
    console.log("response of initiate data: ", response);

    if (response != undefined) {
      const firstPlaylist = response["playlistData"][0]["playlistId"];
      console.log("first playlist: ", firstPlaylist);
      const firstSong = response["map"][firstPlaylist][0]["songId"];
      console.log(
        "first song: ",
        response["map"][firstPlaylist][0]["songLink"].split("?v=")[1]
      );
      setSelectedSong(
        response["map"][firstPlaylist][0]["songLink"].split("?v=")[1]
      );
      $("#option0").prop("checked", true);
      $("#song0").prop("checked", true);
    }
  };

  const getUserPlaylists = async () => {
    try {
      const response = await fetch(`http://localhost:8000/userPlaylists`, {
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
      console.log(" playlis data: ", data);
      setSongs(data["map"]);
      console.log(" songssss");
      console.log(" final");

      return data;

      setLoading(false);
    } catch (error) {}
  };

  const selectPlaylist = (event) => {
    event.preventDefault();
    setSelectedPlaylist(event.target.value);
    console.log("changed color: ", event.target.value);
    setSelectedSong(
      songs[playlists[event.target.value]["playlistId"]][0]["songLink"].split(
        "?v="
      )[1]
    );
  };

  const selectSong = (event) => {
    event.preventDefault();
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
          {selectedSong && (
            <div className="col-8" style={{ height: "100vh" }}>
              <div className="video-container">
                {console.log("current slected song: ", selectedSong)}
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
          )}

          <div className="col-4" style={{ height: "100vh" }}>
            {playlists.length > 0 && (
              <div className="songTitle">
                <span>{playlists[selectedPlaylist]["playlistName"]} songs</span>
              </div>
            )}

            {console.log("SONGS: ", songs)}

            {songs &&
              playlists.length > 0 &&
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

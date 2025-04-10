import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { OpenAI } from "openai";
import LoadingComponent from "../components/LoadingComponent";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import $ from "jquery";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClearIcon from "@mui/icons-material/Clear";
import CachedIcon from "@mui/icons-material/Cached";

const Playlist = () => {
  const location = useLocation();
  const { state } = location;
  const book = state && state.book;
  const [playlist, setPlaylist] = useState([
    // { songArtist: "Dwight Yoakam", songName: "Thousand Miles from Nowhere" },
    // {
    //   songName: "Love Story",
    //   songArtist: "Taylor Swift",
    // },
    // {
    //   songName: "The One That Got Away",
    //   songArtist: "Katy Perry",
    // },
    // {
    //   songName: "Bleeding Love",
    //   songArtist: "Leona Lewis",
    // },
  ]);
  //const [links, setLinks] = useState([
  // [
  //   "https://www.youtube.com/watch?v=8xg3vE8Ie_E",
  //   "https://i.ytimg.com/vi/8xg3vE8Ie_E/default.jpg",
  // ],
  // {
  //   artist: "Taylor Swift",
  //   link: "https://www.youtube.com/watch?v=8xg3vE8Ie_E",
  //   name: "Love Story",
  //   url: "https://i.ytimg.com/vi/8xg3vE8Ie_E/default.jpg",
  // },
  //]);

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [playingSong, setPlayingSong] = useState(null);
  const [generated, setGenerated] = useState(0);

  console.log("yt: ", process.env.REACT_APP_YT_KEY);
  console.log("yt2: ", process.env.REACT_APP_API_KEY);
  console.log("linksss: ", links);

  const generatePlaylist = async () => {
    try {
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const inputText = `Generate playlist 5 songs based on the subject of the book ${book.title} as JSON with 'songName' and 'songArtist' as attributes`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`, // Replace with your OpenAI API key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-0125", // Specify the ChatGPT model you want to use
          messages: [{ role: "user", content: inputText }],
          response_format: { type: "json_object" },
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("RASPUNS LA OPENAI", data.choices[0].message.content);
      let playlist11 = JSON.parse(data.choices[0].message.content);
      console.log("playlist: ", playlist11.playlist);
      //console.log("playlist: ", playlist11.playlist);
      setPlaylist(playlist11.playlist);
      return playlist11.playlist;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getYTLink = async (song) => {
    console.log("song in get yt link: ", song);
    try {
      const ytApi = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${
        song.songName.indexOf(" ") != -1
          ? song.songName.split(" ").join(",")
          : song.songName
      }, ${
        song.songArtist.indexOf(" ") != -1
          ? song.songArtist.split(" ").join(",")
          : song.songArtist
      }}&order=relevance&key=${process.env.REACT_APP_YT_KEY}`;
      //console.log("yt api url: ", ytApi);
      const response = await fetch(ytApi, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      console.log("data from yt api: ", data);
      return [
        data.items[0].id.videoId,
        data.items[0].snippet.thumbnails.default.url,
        song.songName,
        song.songArtist,
      ];
    } catch (error) {
      console.error("Error:", error);
      throw error; // Rethrow the error to be caught by the caller if necessary
    }
  };

  const getSongs = async (myPlaylist) => {
    console.log("entered get songs: ", myPlaylist);
    if (myPlaylist.length !== 0) {
      var linksArray = [];
      await Promise.all(
        myPlaylist.map(async (song) => {
          try {
            const data = await getYTLink(song);
            let obj = {
              link: `https://www.youtube.com/watch?v=${data[0]}`,
              artist: data[3],
              name: data[2],
              url: data[1],
            };
            linksArray.push(obj);
            console.log("obiectul: ", obj);
            console.log("array ul: ", linksArray);
            console.log("Data:", data);
          } catch (error) {
            console.error("Error:", error);
          }
        })
      );
      console.log("links array: ", linksArray);
      return linksArray;
    }
    return [];
  };

  const playlistCreation = async () => {
    setLoading(true);
    setGenerated(1);
    const myPlaylist = await generatePlaylist();
    console.log("playlist: ", myPlaylist);
    if (myPlaylist) {
      try {
        const songs = await getSongs(myPlaylist);
        console.log("songs in fetchSongs: ", songs);
        setLinks(songs); // This sets the links variable
        setLoading(false);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    }
  };

  const savePlaylist = async () => {
    var currentdate = new Date();
    var datetime =
      currentdate.getFullYear() +
      "-" +
      (currentdate.getMonth() + 1) +
      "-" +
      currentdate.getDate() +
      " " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    console.log(
      "body: ",
      localStorage.getItem("userMail"),
      book,
      links,
      datetime
    );

    const token = localStorage.getItem("authToken");
    const xsrf = localStorage.getItem("xsrf");

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/savePlaylist",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-XSRF-TOKEN": xsrf,
          },
          credentials: "include",
          body: JSON.stringify({
            book: book.identifier,
            links: links,
            date: datetime,
            playlistName: inputValue,
          }),
        }
      );

      console.log("response stst: ", response);
      if (response.status != 201) {
        throw new Error("Failed to add playlist data");
      }
      const data = response.json();
      showToastMessage();
    } catch (error) {
      console.error("Error at saving playlist: ", error);
    }
  };

  const showToastMessage = () => {
    console.log("entered toast");
    toast.info("Playlist saved successfully!", {
      position: "top-center",
    });
  };

  const getPrompt = () => {
    $("#playlistNamePrompt").css({ display: "block" });
    $("#firstRow").css({ opacity: "0.5" });
    $("#content").css({ opacity: "0.5" });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    console.log(e.target.value);
  };

  const savePlaylistTitle = () => {
    console.log("Prompt submitted:", inputValue);
    $("#playlistNamePrompt").css({ display: "none" });
    $("#firstRow").css({ opacity: "1" });
    $("#content").css({ opacity: "1" });
    savePlaylist();
    //setInputValue("");
  };

  const exitSaving = () => {
    $("#playlistNamePrompt").css({ display: "none" });
    $("#firstRow").css({ opacity: "1" });
    $("#content").css({ opacity: "1" });
  };

  const handleLinkClick = (e, song) => {
    e.preventDefault();
    setPlayingSong(song);
  };

  return (
    <div style={{ width: "100%" }} id="fullPage">
      <Sidebar></Sidebar>
      <ToastContainer />
      <div
        className="pageTitle"
        id="firstRow"
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "8%",
          width: "92%",
        }}
      >
        <span style={{ position: "absolute" }}>{book.title}'s playlist</span>
        <div style={{ marginLeft: "73%" }}>
          <button
            onClick={playlistCreation}
            className="savePlaylistButton"
            style={{ marginLeft: "0" }}
          >
            {generated == 0 ? "Generate" : <CachedIcon></CachedIcon>}
          </button>
        </div>
      </div>

      <div style={{ position: "relative", marginTop: "1%", marginLeft: "35%" }}>
        <div className="playlistPrompt" id="playlistNamePrompt">
          <div className="promptName" style={{ position: "relative" }}>
            <span>Give your playlist a name</span>
            <div
              className="removeColor"
              style={{ position: "absolute", paddingLeft: "20%" }}
            >
              <button onClick={exitSaving}>
                <ClearIcon style={{ color: "#eceef8" }} />
              </button>
            </div>
          </div>
          <div className="inputPromptComponent">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Playlist name"
              style={{ width: "400px", height: "50px" }}
            />
            <button onClick={savePlaylistTitle} className="savePlaylistButton">
              Save
            </button>
          </div>
        </div>
      </div>

      <div id="content" style={{ marginTop: "5%" }}>
        {loading && <LoadingComponent current={"playlist"}></LoadingComponent>}
        <div className="row" style={{ width: "99%" }}>
          {console.log("links at render: ", links)}

          <div className="col-6">
            {links &&
              links.map((song, index) => (
                <div key={index} className="songLink">
                  {console.log(
                    "song: ",
                    song.artist,
                    song.name,
                    song.link,
                    song.url
                  )}
                  <a
                    href="#"
                    style={{ textDecoration: "none" }}
                    onClick={(e) => handleLinkClick(e, song)}
                  >
                    <div className="songItem">
                      <span className="songFont">
                        {song.name} - {song.artist}
                      </span>
                      <img src={song.url} alt={song.name}></img>
                    </div>
                  </a>
                </div>
              ))}
          </div>

          <div className="col-6">
            {console.log("first link: ", links[0])}
            {links.length > 0 && (
              <div className="video-container" style={{ marginTop: "1%" }}>
                <div style={{ display: "inline-flex" }}>
                  <div className="addPlaylistFont">
                    <span>Add playlist to your collection</span>
                  </div>
                  <button
                    onClick={getPrompt}
                    className="addPlaylistButton"
                    style={{ marginLeft: "15px" }}
                  >
                    <LibraryMusicIcon></LibraryMusicIcon>
                  </button>
                </div>
                <div className="songTitle">
                  {playingSong ? playingSong.artist : links[0].artist} -{" "}
                  {playingSong ? playingSong.name : links[0].name}
                </div>
                <iframe
                  width="600"
                  height="400"
                  src={`https://www.youtube.com/embed/${
                    playingSong
                      ? playingSong.link.split("?v=")[1]
                      : links[0].link.split("?v=")[1]
                  }`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    border: "7px solid #6d7fcc",
                    borderRadius: "5px",
                    marginTop: "5%",
                  }}
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Playlist;

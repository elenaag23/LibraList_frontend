import logo from "./logo.svg";
import "./App.css";
import ToRead from "./pages/ToRead";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ReadBook from "./pages/ReadBook";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useEffect } from "react";
import Library from "./pages/Library";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Playlist from "./pages/Playlist";
import PlaylistUser from "./pages/PlaylistUser";
import Highlights from "./pages/HighlightsPage";
import Profile from "./pages/Profile";

function App() {
  let local = "http://127.0.0.1:8000";
  window.API_URL = local;

  useEffect(() => {
    localStorage.setItem("prevPage", "/");
    const getCurrentUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("current token: ", process.env.REACT_APP_BACKEND_URL);

        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/authUser",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();

        console.log("current user: ", data);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userMail", data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getCurrentUser();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/toread" element={<ToRead />} />
          <Route path="/read-book" element={<ReadBook />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/library" element={<Library />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/playlistUser" element={<PlaylistUser />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

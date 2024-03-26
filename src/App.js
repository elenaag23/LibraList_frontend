import logo from "./logo.svg";
import "./App.css";
import ToRead from "./ToRead";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ReadBook from "./ReadBook";
import Register from "./Register";
import Login from "./Login";
import { useEffect } from "react";
import Library from "./Library";
import "@react-pdf-viewer/core/lib/styles/index.css";

function App() {
  let local = "http://127.0.0.1:8000";
  window.API_URL = local;

  useEffect(() => {
    localStorage.setItem("prevPage", "/");
    const getCurrentUser = async () => {
      try {
        const token = localStorage.getItem("authToken");

        console.log("current token: ", token);

        const response = await fetch("http://127.0.0.1:8000/authUser", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

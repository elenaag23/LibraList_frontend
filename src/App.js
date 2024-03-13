import logo from "./logo.svg";
import "./App.css";
import ToRead from "./ToRead";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ReadBook from "./ReadBook";
import Register from "./Register";
import Login from "./Login";
import { useEffect } from "react";

function App() {
  let local = "http://127.0.0.1:8000";
  window.API_URL = local;

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
        localStorage.setItem("user", data.id);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    localStorage.setItem("prevPage", "/");
    getCurrentUser();
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/toread" element={<ToRead />} />
          <Route path="/read-book" element={<ReadBook />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

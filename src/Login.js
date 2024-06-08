import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const userData = {
    email: email,
    password: password,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/sanctum/csrf-cookie",
          {
            method: "GET", // or 'POST', 'PUT', etc. depending on your API
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const cookie = Cookies.get("XSRF-TOKEN");
        localStorage.setItem("xsrf", cookie);
        console.log("cookie: ", cookie);
        //const responseData = await response.json();
        //setData(responseData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleLogin = async () => {
    //await fetchData();
    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": localStorage.getItem("xsrf"),
      },
      credentials: "include",
      body: JSON.stringify(userData),
    })
      .then((response) => {
        // if (response.ok) {
        //   var data = response.json();
        //   console.log("tokennnn: ", data);
        //   localStorage.setItem("authToken", data.token);
        //   //window.location.href = "/toread";
        // }
        return response.json(); // Return the parsed JSON data
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          window.location.href = "/toread";
        } else if (data.message) {
          alert(data.message);
        }
        console.log("data received: ", data.message);
        //window.location.href = "/toread";
      })
      .catch((error) => {});
  };

  return (
    <div
      className="mycontainer"
      style={{ backgroundImage: "url('bookBackground.jpg')" }}
    >
      <div className="loginComponent">
        <div
          className="pageTitle"
          style={{ marginTop: "50px", color: "white" }}
        >
          <span>Login</span>
        </div>

        <div className="form-group">
          <div className="formItem">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inputStyle"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inputStyle"
            />
          </div>

          <div>
            <button onClick={handleLogin} className="loginButton">
              Login
            </button>
            {error && <p>{error}</p>}
          </div>

          <div className="redirectRegister">
            <a href="/register">
              <span>
                If you don't have an account yet, click here to register
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

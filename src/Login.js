import React, { useState, useEffect } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const userData = {
    email: email,
    password: password,
  };

  const handleLogin = async () => {
    fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        // Parse the JSON response
        return response.json(); // Return the parsed JSON data
      })
      .then((data) => {
        console.log("data received: ", data);
        localStorage.setItem("authToken", data.token);
        window.location.href = "/toread";
      })
      .catch((error) => {
        // Handle any errors
      });
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

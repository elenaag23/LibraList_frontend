// Register.js
import React, { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);

  const userData = {
    name: name,
    email: email,
    password: password,
    password_confirm: password_confirm,
  };

  const handleRegister = async () => {
    fetch("127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        response.json();
        console.log("response: ", response);
        window.location.href = "/login";
      })
      .then((data) => {
        // Handle the response data here
      })
      .catch((error) => {
        // Handle any errors
      });
  };

  return (
    <div className="mycontainer" style={{ backgroundColor: "#b4bce4" }}>
      <div className="registerComponent">
        <div className="pageTitle" style={{ marginTop: "50px" }}>
          <span>Register</span>
        </div>

        <div className="form-group">
          <div className="formItem">
            <input
              type="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="inputStyle"
            />
          </div>
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
            <input
              type="password_confirm"
              placeholder="Confirm Password"
              value={password_confirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="inputStyle"
            />
          </div>

          <div>
            <button
              onClick={handleRegister}
              className="loginButton"
              style={{ width: "100px" }}
            >
              Register
            </button>

            {error && <p>{error}</p>}
          </div>

          <div className="redirectLogin">
            <a href="/login">
              <span>If you already have an account, click here to sign in</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

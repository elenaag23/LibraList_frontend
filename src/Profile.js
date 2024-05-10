import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import $ from "jquery";
import UserProfile from "./UserProfile";

const Profile = () => {
  const token = localStorage.getItem("authToken");
  const [user, setUser] = useState(null);
  const [option, setOption] = useState("1");

  useEffect(() => {
    $("#profileButton").addClass("selected");
    $("#option1").prop("checked", true);
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/userData`, {
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
      setUser(data["user"]);
    } catch (error) {}
  };

  const getRecommandations = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/getRecommandations`, {
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
      //setUser(data["user"]);
    } catch (error) {}
  };

  const selectOption = (event) => {
    setOption(event.target.value);
  };

  return (
    <div>
      <Sidebar></Sidebar>
      <div
        className="row"
        style={{ width: "97vw", height: "100vh", margin: "16px" }}
      >
        <div
          className="col-3"
          style={{ backgroundColor: "#a1acde", paddingLeft: "0px" }}
        >
          <div
            style={{ width: "100%", height: "50px" }}
            className="profileSetting"
          >
            <input
              type="radio"
              class="btn-check2"
              name="profileSidebar"
              id="option1"
              autocomplete="off"
              value="1"
              onChange={selectOption}
              style={{ position: "absolute", appearance: "none" }}
            ></input>
            <label
              id="songLabel"
              class="btn settingsLabel"
              htmlFor="option1"
              style={{
                borderRadius: "0px",
                paddingTop: "10px",
                fontSize: "large",
                fontWeight: "700",
              }}
            >
              Profile Settings
            </label>
          </div>

          <div
            style={{ width: "100%", height: "50px" }}
            className="profileSetting"
          >
            <input
              type="radio"
              class="btn-check2"
              name="profileSidebar"
              id="option2"
              autocomplete="off"
              value="2"
              onChange={selectOption}
              style={{ position: "absolute", appearance: "none" }}
            ></input>
            <label
              id="songLabel"
              class="btn settingsLabel"
              htmlFor="option2"
              style={{
                borderRadius: "0px",
                paddingTop: "10px",
                fontSize: "large",
                fontWeight: "700",
              }}
            >
              Recommandations
            </label>
          </div>

          <div
            style={{ width: "100%", height: "50px" }}
            className="profileSetting"
          >
            <input
              type="radio"
              class="btn-check2"
              name="profileSidebar"
              id="option3"
              autocomplete="off"
              value="3"
              onChange={selectOption}
              style={{ position: "absolute", appearance: "none" }}
            ></input>
            <label
              id="songLabel"
              class="btn settingsLabel"
              htmlFor="option3"
              style={{
                borderRadius: "0px",
                paddingTop: "10px",
                fontSize: "large",
                fontWeight: "700",
              }}
            >
              Highlights
            </label>
          </div>

          <div
            style={{ width: "100%", height: "50px" }}
            className="profileSetting"
          >
            <input
              type="radio"
              class="btn-check2"
              name="profileSidebar"
              id="option4"
              autocomplete="off"
              value="4"
              onChange={selectOption}
              style={{ position: "absolute", appearance: "none" }}
            ></input>
            <label
              id="songLabel"
              class="btn settingsLabel"
              htmlFor="options4"
              style={{
                borderRadius: "0px",
                paddingTop: "10px",
                fontSize: "large",
                fontWeight: "700",
              }}
            >
              Reviews
            </label>
          </div>
        </div>
        <div
          className="col-9 row"
          style={{
            backgroundColor: "#c6cdeb",
            borderLeft: "2px solid #a1acde",
          }}
        >
          {option == "1" && user && <UserProfile user={user}></UserProfile>}
        </div>
      </div>
    </div>
  );
};

export default Profile;

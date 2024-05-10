import React from "react";

const UserProfile = ({ user }) => {
  return (
    <div>
      <div>
        <span>Current username: </span>
        <span>{user.name}</span>
      </div>
      <div>
        <span>Email: </span>
        <span>{user.email}</span>
      </div>
    </div>
  );
};

export default UserProfile;

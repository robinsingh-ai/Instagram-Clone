import React from "react";
import "./ProfilePostImg.css";
function ProfilePostImg({ photo, likes, comments }) {
  return (
    <div className="profile__postsimg">
      <img className="profile__postimg" src={photo} />
      <p>{comments}</p>
    </div>
  );
}

export default ProfilePostImg;

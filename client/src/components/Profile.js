import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useStateValue } from "../StateProvide";
import { Button } from "@material-ui/core";
import { actionTypes } from "../reducer";
import LoadingPage from "./LoadingPage";
function Profile() {
  const [post, setpost] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [img, setimg] = useState("");
  const [imgurl, setimgurl] = useState(undefined);
  const [loading, setloading] = useState(false);

  console.log(user);
  console.log(post);
  useEffect(() => {
    fetch("/myprofile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWT"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setpost(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (img) {
      const data = new FormData();
      data.append("file", img);
      data.append("upload_preset", "instagram-web-clone");
      data.append("cloud_name", "robin");
      fetch("https://api.cloudinary.com/v1_1/robin/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setimgurl(data.url);

          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("JWT"),
            },
            body: JSON.stringify({
              profile: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem("User", JSON.stringify(result));
              
              dispatch({
                type: actionTypes.UPDATEPIC,
                action: result.profile,
              });

              window.location.reload();
            });
        })
        .catch((event) => console.log(event));
    }
  }, [img]);

  const updateDP = (file) => {
    setimg(file);
  };


















  
  return (
    <>
      {post ? (
        <div className="profile1">
          <div className="profile">
            <div className="profile__info">
              <div className="profile__avatar">
                <img
                  className="profile__img"
                  src={user?.action.profile}
                  alt="user img"
                />
              </div>
              <input
                type="file"
                placeholder="Profile Pic"
                onChange={(event) => updateDP(event.target.files[0])}
              />
              <Button
                className="profile__edit"
                onClick={() => {
                  updateDP();
                }}
              >
                Update
              </Button>

              <div className="profile__options">
                <h4>{user?.action.name}</h4>
                <div className="profile__stats">
                  <h6>{post.length} posts</h6>
                  <h6>{user?.action.followers.length} followers</h6>
                  <h6>{user?.action.following.length} following</h6>
                </div>
              </div>
            </div>

            <div className="profile__imgs">
              {post.map((item) => {
                return (
                  <>
                    <img
                      key={item.body}
                      className="profile__postimg"
                      src={item.photo}
                      alt="User Img"
                    />
                  </>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}

export default Profile;

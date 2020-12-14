import React, { useEffect, useState } from "react";
import "./UserPage.css";
import { Button } from "@material-ui/core";
import { useStateValue } from "../StateProvide";
import { useParams } from "react-router-dom";
import { actionTypes } from "../reducer";
import LoadingPage from "./LoadingPage";
function UserPage() {
  const [post, setpost] = useState(null);
  const [{ user }, dispatch] = useStateValue();
  const { userid } = useParams();

  const [showFollow, setfollow] = useState(
    user ? !user.action.following.includes(userid) : true
  );
  
  useEffect(() => {
    
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWT"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        
        setpost(result);
      });
  }, []);

  const followuser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("JWT"),
      },
      
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((resultt) => {
        console.log(resultt);
        dispatch({
          type: actionTypes.UPDATE,
          action: {
            followers: resultt.followers,
            following: resultt.following,
          },
        });
        localStorage.setItem("User", JSON.stringify(resultt));
        setpost((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, resultt._id],
            },
          };
        });
        setfollow(false);
      });
  };
















  const unfollowuser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("JWT"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((resultt) => {
        console.log(resultt);
        dispatch({
          type: actionTypes.UPDATE,
          action: {
            followers: resultt.followers,
            following: resultt.following,
          },
        });
        localStorage.setItem("User", JSON.stringify(resultt));
        setpost((prevState) => {
          const newfollowers = prevState.user.followers.filter(
            (item) => item != resultt._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newfollowers,
            },
          };
        });
        setfollow(true);
      });
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
                  src={post.user.profile}
                  alt="user img"
                />
              </div>
              <div className="profile__options">
                <h4>{post.user.name}</h4>
                <div className="profile__stats">
                  <h6>{post.posts.length} posts</h6>
                  <h6>{post.user.followers.length} followers </h6>
                  <h6>{post.user.following.length} following</h6>
                </div>
                {showFollow ? (
                  <Button
                    className="follow__button"
                    onClick={() => followuser()}
                  >
                    Follow
                  </Button>
                ) : (
                  <Button
                    className="unfollow__button"
                    onClick={() => unfollowuser()}
                  >
                    Un Follow
                  </Button>
                )}
              </div>
            </div>

            <div className="profile__imgs">
              {post.posts.map((item) => {
                return (
                  <img
                    key={item.body}
                    className="profile__postimg"
                    src={item.photo}
                    alt="User Img"
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          <LoadingPage />
        </>
      )}
    </>
  );
}

export default UserPage;

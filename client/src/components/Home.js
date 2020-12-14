import React, { useState, useEffect } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import "./Home.css";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { Avatar, Input, Button, IconButton } from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { useStateValue } from "../StateProvide";
import { Link } from "react-router-dom";

function Home() {
  const [{ user }, dispatch] = useStateValue();
  const [posts, setposts] = useState([]);
  const [likeclicked, setlikeclicked] = useState(null);
  console.log(posts);

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWT"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setposts(result.posts);
        // setsameposts(result.posts);
        console.log(result);
        setlikeclicked(null);
      });
  }, [likeclicked, posts]);







  const postlike = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("JWT"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((resultt) => {
        console.log(resultt);
        const newlikesarray = posts.map((item) => {
          if (item._id == resultt._id) {
            return resultt;
          } else {
            return item;
          }
        });
        console.log(newlikesarray);
        setposts(newlikesarray);
        setlikeclicked(true);
      });
  };








  const postunlike = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("JWT"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((resultt) => {
        const newlikesarray = posts.map((item) => {
          if (item._id == resultt._id) {
            return resultt;
          } else {
            return item;
          }
        });
        console.log(newlikesarray);
        setposts(newlikesarray);
        setlikeclicked(false);
      });
  };







  const comment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("JWT"),
      },
      body: JSON.stringify({
        postId: postId,
        text: text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result); 
        const Data = posts.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setposts(Data);
      });
  };










  const deletepost = (postid) => {
    fetch(`/delete/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWT"),
      },
    })
      
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = posts.filter((item) => {
          return item._id !== result._id;
        });
        setposts(newData);
      });
  };









  return (
    <div>
      {posts.map((item) => {
        console.log(item);
        return (
          <div className="home">
            <div className="home__postheader">
              <div className=" home__AvatarUser ">
                <Link
                  to={
                    item.postedBy._id !== user.action._id
                      ? "/userprofile/" + item.postedBy._id
                      : "/profile"
                  }
                >
                  <Avatar
                    className="home__avatarimg"
                    src={item.postedBy.profile}
                    alt="user profile "
                  />
                </Link>
                <h4 className="home__username">{item.postedBy.name}</h4>
              </div>
              <div>
                
                {item.postedBy._id == user.action._id && (
                  <IconButton
                    onClick={() => deletepost(item._id)}
                    className="home__delete"
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </div>
            </div>

            <img className="homepost__img" src={item.photo} alt="post Img" />

            <h5 className="home__postText">
              
              {item.likes.includes(user.action._id) ? (
                <IconButton
                  className="like__button"
                  onClick={() => {
                    postunlike(item._id);
                  }}
                >
                  <FavoriteIcon className="home__redfav" />
                </IconButton>
              ) : (
                <IconButton
                  className="like__button"
                  onClick={() => {
                    postlike(item._id);
                  }}
                >
                  <FavoriteBorderIcon />
                </IconButton>
              )}

              <h5>
                {item.likes.length}
                {"  likes"}{" "}
              </h5>
              <Link
                className="profile__postlink"
                to={
                  item.postedBy._id !== user.action._id
                    ? "/userprofile/" + item.postedBy._id
                    : "/profile"
                }
              >
                <strong className="profile__postname">
                  {item.postedBy.name}
                </strong>
              </Link>
              <p>{item.body + "  " + item.title}</p>
            </h5>

            <div className="home__posted_comm">
              {item.comments.map((comms) => {
                return (
                  <p className="" key={comms.postedBy._id}>
                    <Link
                      className="profile__postlink"
                      to={
                        comms.postedBy._id !== user.action._id
                          ? "/userprofile/" + comms.postedBy._id
                          : "/profile"
                      }
                    >
                      <strong className="profile__postname">
                        {comms.postedBy.name}
                      </strong>
                    </Link>
                    {comms.text}
                  </p>
                );
              })}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                comment(event.target[0].value, item._id);
                
              }}
              className="home__form"
            >
              <Input
                className="home__postcomment"
                type="text"
                placeholder="Add a comment"
              />
              <Button
                color="primary"
                variant="outlined"
                className="homecomment__button"
              >
                Post
              </Button>
            </form>
          </div>
        );
      })}
    </div>
  );
}

export default Home;

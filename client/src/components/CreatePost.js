import React, { useState, useEffect } from "react";
import "./Createpost.css";
import { useHistory } from "react-router-dom";
import { Input, Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
// import { createFilterOptions } from "@material-ui/lab";
function CreatePost() {
  const [caption, setcaption] = useState("");
  const [servermsg, setservermsg] = useState(null);
  const [title, settitle] = useState("");
  const [img, setimg] = useState("");
  const [url, seturl] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("JWT"),
        },
        body: JSON.stringify({
          title: title,
          body: caption,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            setservermsg(data.error);
          } else {
            seturl(null);
            history.push("/");
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
  }, [url]);






  const PostInfo = () => {
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "instagram-web-clone");
    data.append("cloud_name", "robinnaglewala");
    fetch("https://api.cloudinary.com/v1_1/robin/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        seturl(data.url);
      })
      .catch((event) => console.log(event));
  };

  return (
    <div className="createpost">
      <Input
        type="text"
        placeholder="title"
        value={title}
        onChange={(event) => settitle(event.target.value)}
      />
      <Input
        type="text"
        placeholder="caption"
        value={caption}
        onChange={(event) => setcaption(event.target.value)}
      />
      <Input
        type="file"
        placeholder="file"
        onChange={(event) => setimg(event.target.files[0])}
      />

      {servermsg ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <strong>{servermsg}</strong>
        </Alert>
      ) : (
        <p></p>
      )}
      <Button onClick={PostInfo}>Upload</Button>
    </div>
  );
}

export default CreatePost;

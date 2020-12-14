import React, { useState, useEffect } from "react";
import "./Signup.css";
import { Input, Button } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { Alert, AlertTitle } from "@material-ui/lab";
import Footer from "./Footer";
function Signup() {
  const [img, setimg] = useState("");
  const [imgurl, setimgurl] = useState(undefined);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [servermsg, setservermsg] = useState(null);
  const [submited, setsubmited] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (imgurl) {
      uploadFields();
    }
  }, [imgurl]);

  const uploadFields = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        
        profile: imgurl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          setservermsg(data.error);
        } else {
          setsubmited(data.message);
          history.push("/signin");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };



  const PostData = () => {
    if (img) {
      uploadDP();
    } else {
      uploadFields();
    }
  };



  const uploadDP = () => {
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
      })
      .catch((event) => console.log(event));
  };










  return (
    <div className="signup">
      <div className="signup__form">
        <div className="signup__box">
          <img
            className="signup__img"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="instagram logo"
          />

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) => setname(event.target.value)}
          />
          <input
            onChange={(event) => setemail(event.target.value)}
            type="email"
            placeholder="Email"
            value={email}
          />
          <input
            type="password"
            onChange={(event) => setpassword(event.target.value)}
            placeholder="Password"
            value={password}
          />

          <input
            type="file"
            placeholder="Profile Pic"
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

          {submited ? (
            <Alert severity="success">
              <AlertTitle>Successfully Submitted</AlertTitle>
              <strong>{submited}</strong>
            </Alert>
          ) : (
            <p></p>
          )}
          <Button onClick={PostData}>Sign Up</Button>
        </div>
        <div className="signup__box2">
          <h6>
            Already Have An Account?{" "}
            <Link className="signup__link" to="/signin">
              Sign In
            </Link>
          </h6>
        </div>
      </div>
        <Footer/>
    </div>
  );
}

export default Signup;

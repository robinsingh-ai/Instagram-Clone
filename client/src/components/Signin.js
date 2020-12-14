import React, { useState } from "react";
import "./Signin.css";
import { Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "../StateProvide";
import { actionTypes } from "../reducer";
function Signin() {
  const [{ user }, dispatch] = useStateValue();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [servermsg, setservermsg] = useState(null);
  const [submited, setsubmited] = useState(null);
  const history = useHistory();

  const PostData = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          setservermsg(data.error);
        } else {
          
          localStorage.setItem("JWT", data.token);
          localStorage.setItem("User", JSON.stringify(data.user));
          dispatch({
            type: actionTypes.SET_USER,
            action: data.user,
          });
          setsubmited(data.message);
          history.push("/");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };













  return (
    <div className="signin">
      <div className="signin__form">
        <div className="signin__box">
          <img
            className="signin__img"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="instagram logo"
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

          {submited ? (
            <Alert severity="success">
              <AlertTitle>Successfully Submitted</AlertTitle>
              <strong>{submited}</strong>
            </Alert>
          ) : (
            <p></p>
          )}
          {servermsg ? (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              <strong>{servermsg}</strong>
            </Alert>
          ) : (
            <p></p>
          )}
          <Button onClick={PostData}>Log In</Button>
        </div>
        <div className="signin__box2">
          <h6>
            Don't have an account?{" "}
            <Link className="signin__link" to="/signup">
              Sign Up
            </Link>
          </h6>
          <h6>
            Forgot Password ?{" "}
            <Link className="signin__link" to="/reset">
              Click Here
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
}

export default Signin;

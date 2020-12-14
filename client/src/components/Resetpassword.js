import React, { useState } from "react";
import "./Signin.css";
import { Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Link, useHistory } from "react-router-dom";

function Resetpassword() {
  const [email, setemail] = useState("");

  const [servermsg, setservermsg] = useState(null);
  const [submited, setsubmited] = useState(null);
  const history = useHistory();







  const PostData = () => {
    fetch("/resetpassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setservermsg(data.error);
        } else {
          setsubmited(data.message);

          history.push("/signin");
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
          <Button onClick={PostData}>Reset Password</Button>
        </div>
        <div className="signin__box2">
          <h6>
            Don't have an account?{" "}
            <Link className="signin__link" to="/signup">
              Sign Up
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
}

export default Resetpassword;

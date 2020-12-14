import React, { useState } from "react";
import "./Signin.css";
import { Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Link, useHistory, useParams } from "react-router-dom";




function Newpassword() {
  const [password, setpassword] = useState("");
  const [servermsg, setservermsg] = useState(null);
  const [submited, setsubmited] = useState(null);
  const history = useHistory();
  const { token } = useParams();









  const PostData = () => {
    fetch("/newpassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        token: token,
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
            type="password"
            onChange={(event) => setpassword(event.target.value)}
            placeholder="New Password"
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
          <Button onClick={PostData}>Reset</Button>
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

export default Newpassword;

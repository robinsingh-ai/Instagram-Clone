import React, { useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import Home from "./components/Home";

import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Signin from "./components/Signin";
import CreatePost from "./components/CreatePost";
import { useStateValue } from "./StateProvide";
import { actionTypes } from "./reducer";
import UserPage from "./components/UserPage";
import FollowedUser from "./components/FollowedUser";
import Resetpassword from "./components/Resetpassword";
import Newpassword from "./components/Newpassword";

function App() {
  const Routing = () => {
    const [{ user }, dispatch] = useStateValue();
    const history = useHistory();
    useEffect(() => {
      
      const mainuser = JSON.parse(localStorage.getItem("User"));

      if (mainuser) {
        dispatch({
          type: actionTypes.SET_USER,

          action: mainuser,
        });
      } else {
        if (!history.location.pathname.startsWith("/reset"))
          history.push("/signin");
      }
    }, []);

    return (
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/signin">
          <Signin />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/followedpost">
          <FollowedUser />
        </Route>
        <Route exact path="/userprofile/:userid">
          <UserPage />
        </Route>
        <Route exact path="/createpost">
          <CreatePost />
        </Route>
        <Route exact path="/reset">
          <Resetpassword />
        </Route>
        <Route exact path="/reset/:token">
          <Newpassword />
        </Route>
      </Switch>
    );
  };

  return (
    <div className="app">
      <Router>
        <Header />
        <Routing />
      </Router>
    </div>
  );
}

export default App;

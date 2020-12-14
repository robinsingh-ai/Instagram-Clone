import React, { useState } from "react";
import "./Header.css";
import { Button, Avatar, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvide";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AddIcon from "@material-ui/icons/Add";
import { actionTypes } from "../reducer";
import SearchIcon from "@material-ui/icons/Search";
function Header() {
  const [{ user }, dispatch] = useStateValue();

  const renderList = () => {
    console.log(user);
    if (user) {
      return [
        <Link to="/profile">
          <Avatar
            className="profile__avatar"
            src={user?.action.profile}
            alt="USER"
          />
        </Link>,
        <Link to="/followedpost">
          <IconButton>
            <FavoriteIcon />
          </IconButton>
        </Link>,
        <Link to="/createpost">
          <IconButton>
            <AddIcon />
          </IconButton>
        </Link>,
        <Button
          className="navbar__mainbutton"
          href="/signin"
          onClick={() => {
            localStorage.clear();
            dispatch({
              type: actionTypes.LOGOUT_USER,
            });
          }}
        >
          Logout
        </Button>,
      ];
    } else {
      return [
        <Link to="/signin">
          <Button className="navbar__mainbutton">Signin</Button>
        </Link>,
        <Link to="/signup">
          <Button className="navbar__mainbutton">Sign Up</Button>
        </Link>,
      ];
    }
  };

  return (
    <div className="header">
      <nav className="navbar container">
        <a className="navbar-brand">
          <Link to="/">
            <img
              className="App__img container "
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="instagram logo"
            />
          </Link>
        </a>
        <div className="header__search">
          <input placeholder="search" />
          <SearchIcon className="header__searchicon" />
        </div>

        <div className="login__container">{renderList()}</div>
      </nav>
    </div>
  );
}

export default Header;

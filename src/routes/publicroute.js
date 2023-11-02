import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../components/login/login";
import Signup from "../components/signup/signup";
import Name from "../components/main/db_test";
function PublicRoute(props) {
  const { currentUser, Component } = props;
  const url = window.location.href;
  const passedUrl = new URL(url);
  const passedName = passedUrl.pathname;

  return (
    <>
      {currentUser === "null" ? (
        <Component />
      ) : currentUser === "Email verification pending in signup..." ? (
        <Signup />
      ) : currentUser === "Email verification pending..." ? (
        <Name />
      ) : currentUser === ("App access pending..." || "App access declined") ? (
        <Login />
      ) : (
        <Navigate to="/home" />
      )}
    </>
  );
}

export default PublicRoute;

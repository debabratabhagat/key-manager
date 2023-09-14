import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../components/login/login";

function PublicRoute(props) {
  const { currentUser, Component } = props;
  console.log("         inside Publicroute");

  return (
    <>
      {currentUser === "null" ? (
        <Component />
      ) : currentUser === "doc upload pending..." ? (
        Component === Login ? (
          <Navigate to="/signup" />
        ) : (
          <Component />
        )
      ) : (
        <Navigate to="/home" />
      )}
    </>
  );
}

export default PublicRoute;

import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute(props) {
  const { currentUser, Component } = props;

  console.log("inside PrivateRoute");

  return (
    <>
      {currentUser === "null" ? (
        <Navigate to="/" />
      ) : currentUser === "doc upload pending..." ? (
        <Navigate to="/signup" />
      ) : (
        <Component />
      )}
    </>
  );
}

export default PrivateRoute;

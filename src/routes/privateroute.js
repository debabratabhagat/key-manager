import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Name from "../components/main/db_test";

function PrivateRoute(props) {
  const { currentUser, Component } = props;
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  useEffect(() => {
    if (typeof currentUser === Object) {
      const adminDocRef = doc(db, "admin-users", currentUser.id);
      getDoc(adminDocRef).then((adminDoc) => {
        //checking whether the user is admin or not
        if (adminDoc.exists()) {
          setUserIsAdmin(true);
        } else {
          setUserIsAdmin(false);
        }
      });
    }
  }, []);

  return (
    <>
      {currentUser === "null" ? (
        <Navigate to="/" />
      ) : currentUser === "doc upload pending..." ? (
        <Navigate to="/signup" />
      ) : currentUser === ("App access denied..." || "App access pending...") ||
        currentUser.includes("Email verification pending...") ? (
        <Navigate to="/" />
      ) : userIsAdmin ? (
        <Component />
      ) : (
        <Name />
      )}
    </>
  );
}

export default PrivateRoute;

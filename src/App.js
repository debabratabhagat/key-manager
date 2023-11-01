import "./components/signup/signup.css";
import "./App.css";
import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Name from "./components/main/db_test";
import LoadingSign from "./components/loader/loader";
import PrivateRoute from "./routes/privateroute";
import PublicRoute from "./routes/publicroute";
import firebase from "firebase/app";
import { AuthContext } from "./components/auth";
import ExternalSignup from "./components/signup/external-signup-doc";
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import AdminPanel from "./components/admin/admin-panel";

import push from "./components/notification";

//message trial

//messasge trial ends

function App() {
  // const currentUser = useContext(AuthContext);
  const [currentUser, unsubscribe] = useContext(AuthContext);

  // Notification permission

  // console.log(typeof currentUser);
  async function notificationPermission() {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      //generate token
      const token = await getToken(messaging, {
        vapidKey:
          "BFMPBroQEd4Bl5PV-VbCAaBlClizBohZrR-Nkr_G6odIU6jqkMhtyCLZssViUsk5TWtBtNWMoZ2sDAS73HNPy6w",
      });
      console.log("token == ", token);
      push();
    } else if (permission === "denied") {
      alert("notification access was not given");
    }
  }

  useEffect(() => {
    // requesting user to give permission
    notificationPermission();
  }, []);

  // Notification permission

  return (
    <BrowserRouter>
      {currentUser === "fetching..." ? (
        <LoadingSign />
      ) : currentUser === "external signup doc upload pending..." ? (
        <ExternalSignup />
      ) : (
        <Routes>
          <Route
            exact
            path="/"
            element={
              <PublicRoute currentUser={currentUser} Component={Login} />
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute currentUser={currentUser} Component={Name} />
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute currentUser={currentUser} Component={AdminPanel} />
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute currentUser={currentUser} Component={Signup} />
            }
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;

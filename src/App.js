import "./components/signup/signup.css";
import "./App.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Name from "./components/main/db_test";
import LoadingSign from "./components/loader/loader";
import PasswordReset from "./components/login/resetpassword";
import { AuthContext } from "./components/auth";
import AdminPanel from "./components/admin/admin-panel";
import Logs from "./components/logs/User-logs";
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
// import push from "./components/notification";

function App() {
  const currentUser = useContext(AuthContext);
  const docIn = useRef(null);
  const token = useRef(null);
  // const [userIsAdmin, setUserIsAdmin] = useState(null);

  // console.log(currentUser); ++++++++++++++++++ required for testing
  async function notificationPermission() {
    const permission = await Notification.requestPermission();

    // console.log(permission); ++++++++++++++++++ required for testing
    if (permission === "granted") {
      // tokenGeneration();
      console.log("notification access given");
    } else if (permission === "denied") {
      console.log("notification access was not given");
    }
  }

  const tokenGeneration = async () => {
    try {
      token.current = await getToken(messaging, {
        vapidKey:
          "BFMPBroQEd4Bl5PV-VbCAaBlClizBohZrR-Nkr_G6odIU6jqkMhtyCLZssViUsk5TWtBtNWMoZ2sDAS73HNPy6w",
      });

      await updateDoc(doc(db, "users", currentUser.id), {
        fcmToken: token.current,
      });
    } catch (error) {
      // console.log("token generating"); ++++++++++++++++++ required for testing
    }
  };
  try {
    notificationPermission();
    tokenGeneration();
  } catch (error) {
    console.log("error from notification section", error);
  }

  // ***************Notification permission*********************//

  const getComponentToRenderLogin = () => {
    if (
      currentUser === "App access pending..." ||
      currentUser === "App access declined..." ||
      currentUser === "Email verification pending..." ||
      currentUser === "null"
    ) {
      return <Login />;
    } else if (currentUser === "Email verification pending in signup...") {
      return <Navigate to="/signup" />;
    } else {
      return <Navigate to="/home" />;
    }
  };
  const getComponentToRenderSignup = () => {
    if (
      currentUser === "null" ||
      currentUser === "Email verification pending in signup..."
    ) {
      return <Signup />;
    } else if (
      currentUser === "App access pending..." ||
      currentUser === "App access declined..." ||
      currentUser === "Email verification pending..."
    ) {
      return <Navigate to="/" />;
    } else {
      return <Navigate to="/home" />;
    }
  };
  const getComponentToRenderAdmin = () => {
    if (
      currentUser === "App access pending..." ||
      currentUser === "App access declined..." ||
      currentUser === "Email verification pending..." ||
      currentUser === "null"
    ) {
      return <Navigate to="/" />;
    } else if (currentUser === "Email verification pending in signup...") {
      return <Navigate to="/signup" />;
    } else {
      // console.log(currentUser.isAdmin);
      if (currentUser.isAdmin) {
        return <AdminPanel />;
      } else {
        return <Navigate to="/home" />;
      }
    }
  };
  const getComponentToRenderLogs = () => {
    if (
      currentUser === "App access pending..." ||
      currentUser === "App access declined..." ||
      currentUser === "Email verification pending..." ||
      currentUser === "null"
    ) {
      return <Navigate to="/" />;
    } else if (currentUser === "Email verification pending in signup...") {
      return <Navigate to="/signup" />;
    } else {
      // console.log(currentUser.isAdmin);
      if (currentUser) {
        return <Logs />;
      } else {
        return <Navigate to="/home" />;
      }
    }
  };
  const getComponentToRenderHome = () => {
    if (
      currentUser === "App access pending..." ||
      currentUser === "App access declined..." ||
      currentUser === "Email verification pending..." ||
      currentUser === "null"
    ) {
      return <Navigate to="/" />;
    } else if (currentUser === "Email verification pending in signup...") {
      return <Navigate to="/signup" />;
    } else {
      return <Name />;
    }
  };

  //***************** use effect block ends ********************//

  return (
    <BrowserRouter>
      {currentUser === "fetching..." ? (
        <LoadingSign />
      ) : (
        <Routes>
          <Route exact path="/" element={getComponentToRenderLogin()} />
          <Route path="/signup" element={getComponentToRenderSignup()} />
          <Route path="/admin" element={getComponentToRenderAdmin()} />
          <Route path="/logs" element={getComponentToRenderLogs()} />
          <Route path="/home" element={getComponentToRenderHome()} />
          <Route path="/*" element={<Navigate to="/" />} />
          <Route path="/resetPassword" element={<PasswordReset />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;

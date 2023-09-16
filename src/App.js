import "./components/signup/signup.css";
import "./App.css";
import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Name from "./components/main/db";
import LoadingSign from "./components/loader/loader";
import PrivateRoute from "./routes/privateroute";
import PublicRoute from "./routes/publicroute";

import { AuthContext } from "./components/auth";
import ExternalSignup from "./components/signup/external-signup-doc";

function App() {
  const currentUser = useContext(AuthContext);

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

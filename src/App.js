import "./App.css";

import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Signout from "./components/signout";
import { AuthContext, AuthProvider } from "./components/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Navbar from "./components/navbar";
import Name from "./components/main/db";

function App() {
  const user = useContext(AuthContext);

  // useEffect(()=>{

  // },[user])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Name />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signout" element={<Signout />} />
          {/* <Route path="/" element={<Navbar />}>
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import "./App.css";

import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Signout from "./components/signout";
import { AuthProvider } from "./components/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Name from "./components/main/db";
import LoadingSign from "./components/loader/loader";

function App() {
  // const user = useContext(AuthContext);   #########

  // useEffect(()=>{

  // },[user])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<LoadingSign />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Name />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signout" element={<Signout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

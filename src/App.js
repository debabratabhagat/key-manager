import "./App.css";
import Name from "./db";
import Home from "./components/home";
// import { BrowserRouter as Router,Link,Routes,Route } from 'react-router-dom';
import React, { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  // const ownername =async() => await addTodo()
  // console.log(ownername)

  const [user, setUser] = useState();

  const CheckUser = () => {
    const temp = onAuthStateChanged(auth, (authUser) => {
      console.log(authUser);
    });
  };

  return (
    <div className="App">
      <CheckUser />
    </div>
  );
}

export default App;

import './App.css';
import Name from "./db";
// import { BrowserRouter as Router,Link,Routes,Route } from 'react-router-dom';
import React from 'react';
import Signup from "./components/signup";

function App() {
  
  // const ownername =async() => await addTodo()
  // console.log(ownername)


  return (
    <div className="App">
      <Name/>
      <Signup />
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import "./db";
// import { BrowserRouter as Router,Link,Routes,Route } from 'react-router-dom';
import React,{useState}from 'react';

function App() {

  const [name,setName]= useState("debabrata")

  const newname = () =>{
    setName("Rahul")
  }

  return (
    <div className="App">
      <h1>{name}</h1>
      <button onClick={()=> newname()}>change name</button>
    </div>
  );
}

export default App;

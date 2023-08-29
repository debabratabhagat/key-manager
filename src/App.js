import "./App.css";
import Name from "./db";
// import Home from "./components/home";
import Login from './components/login';
import Signup from './components/signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase";
import Navbar from "./components/navbar";

function App() {
  // const ownername =async() => await addTodo()
  // console.log(ownername)

  // const [user, setUser] = useState();

  // const CheckUser = () => {
  //   const temp = onAuthStateChanged(auth, (authUser) => {
  //     console.log(authUser);
  //   });
  // };

  return (
    <BrowserRouter>
      {/* <CheckUser /> */}
      <Routes>
          <Route path='/' element={ <Navbar /> } >  
            <Route path='/' element={ <Name /> } />
            <Route path='login' element={ <Login /> } />
            <Route path='signup' element={ <Signup /> } />
          </Route> 
        </Routes>
      </BrowserRouter>
  );
}

export default App;

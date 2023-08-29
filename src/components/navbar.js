import React from 'react'
import { useNavigate, Link, Outlet } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  
  return (
    <>
    
    <nav>
    <div>
      <Link  to="/">CYBORG HOME</Link>
    </div>
      
      <div>
      <button onClick={() => {navigate('/login')}} type="button">Login</button>
      <button onClick={() => {navigate('/signup')}} type="button">Sign Up</button>
      </div>
  </nav>
  <Outlet />
  </>
  )
}



export default Navbar
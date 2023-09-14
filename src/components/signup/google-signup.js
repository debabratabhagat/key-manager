import React from 'react'
import { signInWithPopup } from 'firebase/auth'

import {auth, googleProvider } from "../../firebase"
import "./signup.css"
import { useNavigate } from 'react-router-dom'

const GoogleSignup = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    signInWithPopup(auth, googleProvider).then( (data) => {
        console.log(data.user.email);
        navigate('/signup');

    })
  }

  return (
    <>
    </>
  )
}

export default GoogleSignup

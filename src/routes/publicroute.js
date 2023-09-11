import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PublicRoute(props) {
  const { currentUser, Component } = props;
  const navigate = useNavigate();

  useEffect( () => {
    if (currentUser !== "null") { 
      navigate("/home") }
  });


  return (
    <Component />
  )
}

export default PublicRoute

import React, { useEffect }from 'react'
import { useNavigate } from 'react-router-dom'


function PrivateRoute( props ) {
    const { currentUser, Component } = props;
    const navigate = useNavigate();

    useEffect( () => {
        if (currentUser === "null") { 
           navigate("/") }
    });




    return (
        <Component />
    )
}

export default PrivateRoute;

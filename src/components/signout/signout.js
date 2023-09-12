import React, { useContext } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

import { AuthContext } from "../auth";
import "./signout.css"

function Signout() {
  const user = useContext(AuthContext);
  const handleSignout = async () => {
    await signOut(auth);
    window.location.href = '/';
    // console.log("signed out");
    // console.log(user);
  };

  return (
    <div className="button-enclosure">
      <button id="sign-out-button" onClick={handleSignout}>signout</button>
    </div>
  );
}

export default Signout;

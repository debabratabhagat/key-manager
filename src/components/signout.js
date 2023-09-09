import React, { useContext } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "./auth";

function Signout() {
  const user = useContext(AuthContext);
  const handleSignout = async () => {
    await signOut(auth);
    window.location.href = '/';
    console.log("signed out");
    console.log(user);
  };

  return (
    <div>
      <button onClick={handleSignout}>signout</button>
    </div>
  );
}

export default Signout;

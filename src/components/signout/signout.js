import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

import { AuthContext } from "../auth";
import "../main/style.css";

function Signout() {
  const handleSignout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      alert(error);
    }
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <>
      <button className="Signout" onClick={handleSignout}>
        signout
      </button>
    </>
  );
}

export default Signout;

import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

import "./signout.css";

function Signout() {
  const handleSignout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="button-enclosure">
      <button id="sign-out-button" onClick={handleSignout}>
        signout
      </button>
    </div>
  );
}

export default Signout;

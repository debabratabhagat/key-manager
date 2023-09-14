import React, { useContext } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

import { AuthContext } from "../auth";
import "../main/style.css";

function Signout() {
  const user = useContext(AuthContext);
  const handleSignout = async () => {
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

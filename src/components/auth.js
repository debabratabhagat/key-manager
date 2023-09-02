import React, { useContext, createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "@firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentOwner, setCurrentOwner] = useState(null);
  // console.log("rummomg");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentOwner(user);
    });
  }, []);

  return (
    <AuthContext.Provider value={currentOwner}>{children}</AuthContext.Provider>
  );
};

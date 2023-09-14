import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("fetching...");

  useEffect(() => {
    try {
      onAuthStateChanged(auth, async (user) => {
        const signupBtn = document.querySelector(".signup-button");

        if (user && signupBtn) {
          // "Waiting for data upload"
        } else if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          await setCurrentUser({ id: user.uid, name: userDoc.data().name });
        } else {
          setCurrentUser("null");
        }
      });
    } catch (error) {}
  }, [auth]);

  return (
    <AuthContext.Provider value={currentUser}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

import React, { createContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("fetching...");
  console.log(currentUser, "outside useEffect Hook");

  const unsubscribe = useRef(null);

  useEffect(() => {
    console.log("inside useEffect Hook");

    unsubscribe.current = onAuthStateChanged(auth, async (user) => {
      console.log("inside useEffect Hook and onAuthStateChanged method");

      if (user) {
        console.log(auth.currentUser, user);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.data()) {
          setCurrentUser({ id: user.uid, name: userDoc.data().name });
        } else {
          setCurrentUser("doc upload pending...");
        }
      } else {
        setCurrentUser("null");
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

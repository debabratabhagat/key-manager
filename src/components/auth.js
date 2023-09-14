import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("fetching...");

  useEffect(() => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
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
    } catch (error) {
      alert(error);
    }
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

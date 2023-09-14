import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("fetching...");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.data()) {
            setCurrentUser({ id: user.uid, name: userDoc.data().name });
          } else {
            setCurrentUser("doc upload pending...");
          }
        } catch (error) {
          alert(error);
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

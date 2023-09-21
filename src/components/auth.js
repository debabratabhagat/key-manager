import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("fetching...");

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          var authUser = auth.currentUser;
          if (userDoc.data()) {
            setCurrentUser({ id: user.uid, name: userDoc.data().name });
          } else {
            authUser.providerData.forEach(function (profile) {
              if (profile.providerId === "password") {
                setCurrentUser("doc upload pending...");
              } else if (
                profile.providerId === ("google.com" || "microsoft.com")
              ) {
                setCurrentUser("external signup doc upload pending...");
              }
            });
          }
        } else {
          setCurrentUser("null");
        }
      });
    } catch (error) {
      if (error.code === "auth/network-request-failed") {
        toast.error("Network error:", error.message);
      } else if (error.code === "auth/id-token-expired") {
        toast.error("Firebase auth id-token-expired");
      } else {
        toast.error("Firebase Authentication error:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

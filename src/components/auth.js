import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";
// import Signout from "./signout/signout";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("fetching...");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // console.log(user);
        if (user) {
          const url = window.location.href;
          const passedUrl = new URL(url);
          const pathName = passedUrl.pathname;
          if (user.emailVerified) {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            // var authUser = auth.currentUser;
            if (userDoc.data()) {
              const userDocRef = doc(db, "users", user.uid);
              const userDoc = await getDoc(userDocRef);
              // var authUser = auth.currentUser;
              // console.log(userDoc.data().fcmToken);
              if (userDoc.data()) {
                const adminDocRef = doc(db, "admin-users", user.uid);
                const adminDoc = await getDoc(adminDocRef);

                //checking whether the user is admin or not

                if (adminDoc.exists()) {
                  setCurrentUser({
                    id: user.uid,
                    name: userDoc.data().name,
                    isAdmin: true,
                    fcmToken: userDoc.data().fcmToken || "null",
                  });
                } else {
                  setCurrentUser({
                    id: user.uid,
                    name: userDoc.data().name,
                    isAdmin: false,
                    fcmToken: userDoc.data().fcmToken || "null",
                  });
                }
              }
            } else {
              const adminUserDocRef = doc(db, "admin", user.uid);
              const declinedUserDocRef = doc(db, "declined-requests", user.uid);
              const adminUserDoc = await getDoc(adminUserDocRef);
              const declinedUserDoc = await getDoc(declinedUserDocRef);

              if (adminUserDoc.data()) {
                // Signout(auth).then(
                //   alert(
                //     "Your request to access the app is pending with our admin,please wait for them to give you access"
                //   )
                // );
                setCurrentUser("App access pending...");
              } else if (declinedUserDoc.data()) {
                // Signout(auth).then(
                //   alert(
                //     "Your request to access the app is declined by our admins,contact them for further assistance"
                //   )
                // );
                setCurrentUser("App access declined...");
              } else {
                setCurrentUser("doc upload pending...");
              }

              const inputBoxes = document.querySelectorAll(".input-field");
              for (let inputBox of inputBoxes) {
                inputBox.value = "";
              }
            }
          } else {
            // alert("please verify to continue");
            if (pathName === "/signup") {
              setCurrentUser(`Email verification pending in signup...`);
            } else {
              setCurrentUser("Email verification pending...");
            }
            const inputBoxes = document.querySelectorAll(".input-field");
            for (let inputBox of inputBoxes) {
              inputBox.value = "";
            }
          }
        } else {
          setCurrentUser("null");
        }
      } catch (error) {
        if (error.code === "auth/network-request-failed") {
          toast.error("Network error:", error.message);
        } else if (error.code === "auth/id-token-expired") {
          toast.error("Firebase auth id-token-expired");
        } else {
          toast.error("Firebase Authentication error:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

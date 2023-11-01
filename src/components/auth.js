import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("fetching...");
  const passUnsubscribe = onAuthStateChanged(auth, async () => {});

  useEffect(() => {
    // console.log("component did mount");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // console.log(`inside onAuthstateChanged listener callback function:`);
        // console.log(user);
        if (user) {
          const url = window.location.href;
          const parsedUrl = new URL(url);
          const pathname = parsedUrl.pathname;
          if (user.emailVerified) {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            var authUser = auth.currentUser;
            if (userDoc.data()) {
              setCurrentUser({ id: user.uid, name: userDoc.data().name });
            } else {
              const userDocRef = doc(db, "admin", user.uid);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.data()) {
                if (pathname === "/") {
                  await toast.promise(setTimeout(signOut(auth), 3000), {
                    loading:
                      "Your request to access the app is pending with our admin",
                    success: "please wait for them to give you access",
                    error: (error) => {
                      toast.dismiss();
                      return error;
                    },
                  });
                  const inputBoxes = document.querySelectorAll("input-field");
                  for (let inputBox of inputBoxes) {
                    inputBox.value = "";
                  }
                }
              } else {
                authUser.providerData.forEach(function (profile) {
                  if (profile.providerId === "password") {
                    setCurrentUser("doc upload pending...");
                  } else if (profile.providerId === "google.com") {
                    setCurrentUser("external signup doc upload pending...");
                  }
                });
              }
            }
          } else {
            // console.log(`user.emailVerified: ${user.emailVerified}`);
            if (pathname === "/") {
              await toast.promise(signOut(auth), {
                loading: "",
                success: "please verify to continue",
                error: (error) => {
                  toast.dismiss();
                  return error;
                },
              });
              const inputBoxes = document.querySelectorAll("input");
              for (let inputBox of inputBoxes) {
                inputBox.value = "";
              }
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

    // console.log("unsubcribe" + unsubscribe);
    // return unsubscribe;

    // setPassUnsubscribe(unsubscribe);
  }, []);

  // console.log(passUnsubscribe);
  // console.log([currentUser, passUnsubscribe]);
  return (
    <AuthContext.Provider value={[currentUser, passUnsubscribe]}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

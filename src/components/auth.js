import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { getDoc, doc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState( { id: '', name: '' } );
  
  
  useEffect( ()=> {
    onAuthStateChanged(auth, async (user) => {
      const signupBtn = document.querySelector(".signup-button");
      // console.log(user);

      if (user && signupBtn){
        // console.log("Waiting for data upload");
        
      }

      else if(user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        setCurrentUser({ id: user.uid, name: userDoc.data().name });
      }
      });

  }, []);
  
  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import "./style.css";

import { db } from "../../firebase";
import { AuthContext } from "../auth";
import Signout from "../signout/signout";
import LoadingSign from "../loader/loader";

const Name = () => {
  const [keyHolder, setKeyHolder] = useState({ id: "", name: "" });
  const [userIsKeyHolder, setUserIsKeyHolder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [changingOwner, setChangingOwner] = useState(false);
  const currentUser = useContext(AuthContext);

  useEffect(() => {
    const func = async () => {
      const q = query(collection(db, "users"), where("haskey", "==", true)); //querying who has keys
      const keyHolderDocRef = await getDocs(q);
      const keyHolderDoc = keyHolderDocRef.docs[0];

      setKeyHolder({
        name: keyHolderDoc.data().name,
        id: keyHolderDoc.id,
        phone: keyHolderDoc.data().phone,
      });

      if (keyHolderDoc.id === currentUser.id) {
        setUserIsKeyHolder(true);
      }
      setIsLoading(false);
    };

    try {
      func();
    } catch (errror) {
      alert(errror);
    }
  }, []);

  useEffect(() => {
    const newOwner = async () => {
      const keyHolderDocRef = doc(db, "users", keyHolder.id);
      const currentUserDocRef = doc(db, "users", currentUser.id);
      const currentUserDoc = await getDoc(currentUserDocRef);

      await Promise.all([
        updateDoc(currentUserDocRef, { haskey: true }),
        updateDoc(keyHolderDocRef, { haskey: false }),
      ]);

      setKeyHolder({
        id: currentUserDoc.id,
        name: currentUserDoc.data().name,
        phone: currentUserDoc.data().phone,
      });
      setUserIsKeyHolder(true);
      setIsLoading(false);
      setChangingOwner(false);
    };
    if (changingOwner) {
      try {
        newOwner();
      } catch (error) {
        alert(error);
      }
    } else {
    }
  }, [changingOwner]);

  return (
    <>
      {isLoading ? <LoadingSign /> : null}
      <div>
        <div className="user-info">
          <div>{currentUser.name}</div>
          <h3>CYBORG</h3>
          <Signout></Signout>
        </div>

        <div className="container">
          <div className="container-box">
            <h2 className="header">
              Keys' with <span className="highlighted">{keyHolder.name}</span>{" "}
            </h2>
            <div className="phone-number">
              <h3>+91 {keyHolder.phone}</h3>
            </div>
            {userIsKeyHolder ? null : (
              <button
                onClick={() => {
                  setIsLoading(true);
                  setChangingOwner(true);
                }}
              >
                <h1>I've the Key</h1>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Name;

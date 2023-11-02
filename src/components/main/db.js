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
import "./gears.css";
import cyborglogo from "./cyborg-logo.png";

import { db } from "../../firebase";
import { AuthContext } from "../auth";
import LoadingSign from "../loader/loader";
import Signout from "../signout/signout";
import toast from "react-hot-toast";

const Name = () => {
  const [keyHolder, setKeyHolder] = useState({ id: "", name: "", phone: "" });
  const [userIsKeyHolder, setUserIsKeyHolder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [changingOwner, setChangingOwner] = useState(false);
  const currentUser = useContext(AuthContext);

  useEffect(() => {
    const func = async () => {
      const q = query(collection(db, "users"), where("haskey", "==", true)); //querying who has keys

      const keyHolderDocRef = await getDocs(q);

      const keyHolderDoc = keyHolderDocRef.docs[0];

      // contact button

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
      toast.dismiss();
      func();
    } catch (error) {
      if (error.code === "permission-denied") {
        toast.error("Permission denied:", error.message);
      } else if (error.code === "not-found") {
        toast.error("Document not found:", error.message);
      } else {
        toast.error("Firestore error:", error);
      }
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
        if (error.code === "permission-denied") {
          toast.error("Permission denied:", error.message);
        } else if (error.code === "not-found") {
          toast.error("Document not found:", error.message);
        } else {
          toast.error("Firestore error:", error);
        }
      }
    } else {
    }
  }, [changingOwner]);

  return (
    <>
      {isLoading ? <LoadingSign /> : null}
      <div>
        {/* HTml body here  */}

        <div className="container">
          <div className="box">
            {/* <div className="circle2"></div>
            <div className="circle1"></div> */}

            <div className="side-aisle" id="side-aisle-mobile">
              <div className="logo-container">
                <img src={cyborglogo} alt="img here" className="logo" />
                <div className="app-name-container">
                  <h2 className="app-name">Key Manager</h2>
                </div>
              </div>

              <div className="btn-signout-container">
                <Signout></Signout>
              </div>
            </div>

            <div className="main-box">
              <div className="user-name">
                <h2>{currentUser.name}</h2>
                <span className="material-symbols-outlined user-img">
                  account_circle
                </span>
              </div>
              <div className="key-owner-container">
                <h3 className="text key-owner-name">
                  Keys Are Currently with{" "}
                  <span className="ownername">{keyHolder.name}</span>
                </h3>
                <div className="button-container">
                  <button
                    className="contact-button"
                    onClick={() => {
                      const contactBtn =
                        document.querySelector(".contact-button");

                      if (contactBtn.innerHTML === "Contact") {
                        contactBtn.innerHTML = keyHolder.phone;
                        contactBtn.classList.add("content-b");
                      } else {
                        contactBtn.innerHTML = "Contact";
                        contactBtn.classList.remove("content-b");
                      }
                    }}
                  >
                    Contact
                  </button>

                  {/* i have the key buttton */}
                  {userIsKeyHolder ? null : (
                    <button
                      onClick={() => {
                        if (
                          window.confirm("are you sure you have the key ?") ==
                          true
                        ) {
                          setIsLoading(true);
                          setChangingOwner(true);
                        } else {
                        }
                      }}
                      className="change-owner"
                    >
                      i have the key
                    </button>
                  )}

                  {/* i have the key buttton */}
                </div>
              </div>
              <div className="main-gear">
                <div className="container-gear">
                  <svg
                    className="large-gear"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 13.306v-2.612l-2.452-.614c-.081-.407-.188-.805-.318-1.192l1.815-1.756-1.306-2.263-2.432.695c-.272-.309-.562-.599-.871-.871l.695-2.432-2.263-1.306-1.756 1.815c-.387-.13-.785-.237-1.192-.318l-.614-2.452h-2.612l-.614 2.452c-.407.081-.805.188-1.192.319l-1.757-1.816-2.262 1.306.695 2.433c-.309.271-.599.562-.871.87l-2.432-.695-1.306 2.262 1.815 1.757c-.13.387-.237.785-.318 1.192l-2.452.614v2.612l2.452.614c.082.407.188.805.318 1.192l-1.815 1.756 1.306 2.263 2.432-.695c.272.308.562.599.871.871l-.695 2.432 2.263 1.306 1.756-1.816c.387.131.785.237 1.192.319l.614 2.452h2.612l.614-2.452c.407-.082.805-.188 1.192-.319l1.756 1.816 2.263-1.306-.695-2.432c.309-.272.599-.563.871-.871l2.432.695 1.306-2.263-1.815-1.756c.131-.387.237-.785.318-1.192l2.452-.614zm-12 2.694c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
                  </svg>
                  <svg
                    className="medium-gear"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 13.306v-2.612l-2.452-.614c-.081-.407-.188-.805-.318-1.192l1.815-1.756-1.306-2.263-2.432.695c-.272-.309-.562-.599-.871-.871l.695-2.432-2.263-1.306-1.756 1.815c-.387-.13-.785-.237-1.192-.318l-.614-2.452h-2.612l-.614 2.452c-.407.081-.805.188-1.192.319l-1.757-1.816-2.262 1.306.695 2.433c-.309.271-.599.562-.871.87l-2.432-.695-1.306 2.262 1.815 1.757c-.13.387-.237.785-.318 1.192l-2.452.614v2.612l2.452.614c.082.407.188.805.318 1.192l-1.815 1.756 1.306 2.263 2.432-.695c.272.308.562.599.871.871l-.695 2.432 2.263 1.306 1.756-1.816c.387.131.785.237 1.192.319l.614 2.452h2.612l.614-2.452c.407-.082.805-.188 1.192-.319l1.756 1.816 2.263-1.306-.695-2.432c.309-.272.599-.563.871-.871l2.432.695 1.306-2.263-1.815-1.756c.131-.387.237-.785.318-1.192l2.452-.614zm-12 2.694c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* html body ends here/ */}
      </div>
    </>
  );
};

export default Name;

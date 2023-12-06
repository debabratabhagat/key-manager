import {
  collection,
  query,
  where,
  setDoc,
  updateDoc,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import "./gears.css";
import cyborglogo from "./cyborg-logo.png";
import { MdAccountCircle } from "react-icons/md";
import { db } from "../../firebase";
import { AuthContext } from "../auth";
import LoadingSign from "../loader/loader";
import Signout from "../signout/signout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Requests from "./requests";
import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase";

const Name = () => {
  const [keyHolder, setKeyHolder] = useState({ id: "", name: "", phone: "" });
  const [userIsKeyHolder, setUserIsKeyHolder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useContext(AuthContext);
  const [claimingPersonsArr, setClaimingPersonsArr] = useState([]); //************
  const [userHasSentMsg, setUserHasSentMsg] = useState(false); //************
  const userIsAdmin = useRef(false);
  const token = useRef("");
  const navigate = useNavigate();
  const date = new Date();
  const currentDate = date.toISOString();

  /***********notification testing *********/

  const tokenGeneration = async () => {
    try {
      token.current = await getToken(messaging, {
        vapidKey:
          "BFMPBroQEd4Bl5PV-VbCAaBlClizBohZrR-Nkr_G6odIU6jqkMhtyCLZssViUsk5TWtBtNWMoZ2sDAS73HNPy6w",
      });

      // console.log(token.current); +++++++++++++++++++ required for testing
      await updateDoc(doc(db, "users", currentUser.id), {
        fcmToken: token.current,
      });
    } catch (error) {
      // console.log("Generating token"); +++++++++++++++++++ required for testing
    }
  };

  // console.log("key holder "); +++++++++++++++++++ required for testing
  // console.log(keyHolder); +++++++++++++++++++ required for testing
  /***********notification testing*********/

  //************* popup
  const [isRequestPopupOpen, setIsRequestPopupOpen] = useState(false);
  //************* popup ends

  //************* popup
  const [isLogsPopupOpen, setIsLogsPopupOpen] = useState(false);
  //************* popup ends

  useEffect(() => {
    const q = query(collection(db, "users"), where("haskey", "==", true)); //querying who has keys
    const adminDocRef = doc(db, "admin-users", currentUser.id);

    getDoc(adminDocRef).then((adminDoc) => {
      //checking whether the user is admin or not
      if (adminDoc.exists()) {
        userIsAdmin.current = true;
      } else {
        userIsAdmin.current = false;
      }
    });
    //snaphot of query(who is having the keys)//
    const queryListener = onSnapshot(q, (keyHolderSnapshot) => {
      try {
        keyHolderSnapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            toast("key-holder changed!!!!");
          }
        });
        keyHolderSnapshot.forEach((keyHolder) => {
          setKeyHolder(
            //creating an object with current key holder's details//
            {
              name: keyHolder.data().name,
              id: keyHolder.id,
              phone: keyHolder.data().phone,
              fcmToken: keyHolder.data().fcmToken || "null",
            }
          );
          if (keyHolder.id === currentUser.id) {
            //checking whether user is keyHolder or not//
            setUserIsKeyHolder(true);
          } else {
            setUserIsKeyHolder(false);
          }

          //-----------------------------------------------------------------------------------------//
          const keyClaimersCollection = collection(db, "key-claimers");

          //snapshot of key-claimers collection//
          onSnapshot(keyClaimersCollection, async (collecSnapshot) => {
            try {
              //checking whether user is keyHolder or not
              if (keyHolder.id === currentUser.id) {
                const arr = [];
                collecSnapshot.forEach((doc) => {
                  arr.push({ id: doc.id, name: doc.data().name });
                });
                setClaimingPersonsArr(arr);
              } else {
                const currentUserDocRef = doc(
                  db,
                  "key-claimers",
                  currentUser.id
                );
                // const currentUserDoc = await getDoc(currentUserDocRef);

                const currentUserDoc = await getDoc(currentUserDocRef);

                if (currentUserDoc.exists()) {
                  setUserHasSentMsg(true);
                } else {
                  setUserHasSentMsg(false);
                }
              }
            } catch (error) {
              console.log(error);
            }
          });
          //-----------------------------------------------------------------------------------------//
        });
      } catch (error) {
        console.log(error);
      }
    });

    setIsLoading(false);

    return () => {
      queryListener();
    };
  }, []);

  /*************** SENDING AN ALERT MESSAGE TO THE CURRENT KEY OWNER *******************/
  /****For members who are not having the keys*****/
  const sendAnAlertMessage = async () => {
    await setDoc(doc(db, "key-claimers", currentUser.id), {
      name: currentUser.name,
    });
    setUserHasSentMsg(true);

    //setIsLoading(false);

    /************notification testing************ */

    tokenGeneration();
    const requestData = {
      fcmToken: keyHolder.fcmToken,
      dataTitle: "Key change request",
      dataBody: `${currentUser.name} is requesting for the key `,
    };

    // console.log(requestData); +++++++++++++++++++++++++++++++++++REquired for testing
    try {
      fetch("https://cyborgkeys-backend.onrender.com/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({ requestData }),
      })
        .then((response) => {
          // console.log(response); +++++++++++++++++++++++required for testing
        })
        .catch((error) => {
          console.log("Fetch error:", error);
        });
    } catch (error) {
      // console.log(error); +++++++++++++++++++++++required for testing
    }

    /************notification testing************ */
    /************notification testing************ */
  };
  /************************************************************************************/
  /*****************************unique id  for logs***********************************/
  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }
  /************************************************************************************/
  /***********************KEY HOLDER PASSES THE KEY TO SOMEONE ELSE*******************/
  const changeOwner = async (id) => {
    const newKeyHolderDocRef = doc(db, "users", id);
    const currentKeyHolderDocRef = doc(db, "users", currentUser.id);
    const newKeyHolderDoc = await getDoc(newKeyHolderDocRef);

    const uidLogs = generateRandomString(28);
    // console.log(newKeyHolderDoc.data()); +++++++++++++required for testing

    const logId = Math.random();
    await Promise.all([
      setDoc(doc(db, "Logs", uidLogs), {
        name: newKeyHolderDoc.data().name,
        time: currentDate,
        phone: newKeyHolderDoc.data().phone,
        rollNo: newKeyHolderDoc.data().rollNo,
      }),
      updateDoc(currentKeyHolderDocRef, { haskey: false }),
      updateDoc(newKeyHolderDocRef, { haskey: true }),
    ]);
    //deleting new key-holder's request message
    await deleteDoc(doc(db, "key-claimers", id));

    const requestData = {
      datatitle: "Key Owner changed",
      dataBody: `${newKeyHolderDoc.data().name} now has the keys`,
    };

    try {
      fetch("https://cyborgkeys-backend.onrender.com/sendAll", {
        method: "POSt",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestData }),
      })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  /*********************************************************/

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
              <div className="side-aisle-btn-container">
                {userIsAdmin.current ? (
                  <div
                    className="admin-path"
                    onClick={() => {
                      navigate("/admin");
                    }}
                  >
                    <p className="admin-heading">Admin</p>
                  </div>
                ) : (
                  <div
                    className="admin-path"
                    onClick={() => {
                      navigate("/logs");
                    }}
                  >
                    <p className="admin-heading">Logs</p>
                  </div>
                )}

                <div className="btn-signout-container">
                  <Signout></Signout>
                </div>
              </div>
            </div>

            <div className="main-box">
              <div className="user-name">
                <h2>{currentUser.name.split(" ")[0]}</h2>
                <MdAccountCircle />

                {/* <span className="material-symbols-outlined user-img">
                  account_circle
                </span> */}
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
                  {/* {console.log(userHasSentMsg)} */}
                  {userIsKeyHolder ? (
                    <>
                      <button
                        onClick={() => {
                          setIsRequestPopupOpen(true);
                        }}
                        className="change-owner"
                      >
                        Requests
                      </button>
                      <Requests
                        trigger={isRequestPopupOpen}
                        setTrigger={setIsRequestPopupOpen}
                        keyClaimersCollection={claimingPersonsArr}
                        newOwner={changeOwner}
                      ></Requests>
                    </>
                  ) : //request pop up ends
                  userHasSentMsg ? null : (
                    /*************/ <button
                      onClick={() => {
                        if (
                          window.confirm("are you sure you have the key ?") ===
                          true
                        ) {
                          //   setIsLoading(true);
                          sendAnAlertMessage(); /*************/
                          // setChangingOwner(true);
                        } else {
                        }
                      }}
                      className="change-owner"
                    >
                      I have the key
                    </button>
                  )}
                  {/* i have the key buttton */}
                </div>
              </div>
              {/*if user has sent a message to the owner of the key claiming the ownership of the key */}
              {userHasSentMsg ? (
                <div className="sent-message-status-box">
                  Wait until the key-holder responds to your message{" "}
                </div>
              ) : null}
              {/***************************************************************/}
              {/* Messages-start*/} {/**************************/}
              {/* {userIsKeyHolder && claimingPersonsArr.length && (
                <div className="alert-messages">
                  
                  <div className="keys-possesion-claimers">
                    {claimingPersonsArr.map((doc) => {
                      return (
                        <div className="individual-keys-possesion-claimers">
                          {doc.name}
                          <button
                            id={doc.id}
                            onClick={(e) => {
                              changeOwner(e.target.id);
                            }}
                          >
                            yes
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <button
                      onClick={async () => {
                        const batch = writeBatch(db);
                        claimingPersonsArr.forEach((member) => {
                          batch.delete(doc(db, "key-claimers", member.id));
                        });
                        await batch.commit();
                      }}
                    >
                      None of them
                    </button>
                  </div>
                </div>
              )} */}
              {/* Messages-end*/} {/*****************************/}
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

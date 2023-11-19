import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

import "./admin-panel.css";

const AdminPanel = () => {
  const [option, setOption] = useState("Member Requests");
  const [logs, setLogs] = useState({});
  const [arrLogs, setArrLogs] = useState([]);
  const [usersDocs, setUsersDocs] = useState({});
  const [memberRequestsDocs, setMemberRequestsDocs] = useState({});

  /******toggle logs****** */
  const showLogsDetail = (key) => {
    // console.log(key);

    try {
      const element = document.getElementById(`logs${key}`);
      element.classList.toggle("reg-mem-hidden");
    } catch (e) {}
  };

  /**********toggle reg mem******** */
  const showRegMemDetails = (key) => {
    // console.log(key);

    try {
      const element = document.getElementById(`reg-mem-${key}-drop-down`);
      element.classList.toggle("reg-mem-hidden");
    } catch (e) {}
  };

  /**********toggle new mem******** */
  const showNewMemDetails = (key) => {
    // console.log(key);

    try {
      const element = document.getElementById(`new-mem-req-${key}-drop-down`);
      element.classList.toggle("reg-mem-hidden");
    } catch (e) {}
  };
  useEffect(() => {
    const usersCollection = collection(db, "users");
    const logsCollectionRef = collection(db, "Logs");
    // const logsArr = [];

    getDocs(logsCollectionRef).then((collection) => {
      const object = {};
      collection.docs.forEach((doc) => {
        object[doc.id] = doc.data();
      });
      // console.log(object);
      const logsArr = Object.entries(object);
      logsArr.sort((a, b) => new Date(b[1].time) - new Date(a[1].time));
      setLogs(logsArr);
      // console.log(Object.entries(logs));
    });

    getDocs(usersCollection).then((collection) => {
      const object = {};
      collection.docs.forEach((doc) => {
        object[doc.id] = doc.data();
      });
      setUsersDocs(object);
    });

    const usersCollectionSnapshot = onSnapshot(
      collection(db, "users"),
      (collecSnapshot) => {
        collecSnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            setUsersDocs((prevDocs) => ({
              ...prevDocs,
              [change.doc.id]: change.doc.data(),
            }));
          }
          if (change.type === "modified") {
            setUsersDocs((prevDocs) => ({
              ...prevDocs,
              [change.doc.id]: {
                ...prevDocs[change.doc.id],
                ...change.doc.data(),
              },
            }));
          }
          if (change.type === "removed") {
            setUsersDocs((prevState) => {
              const newState = { ...prevState };
              delete newState[change.doc.id];
              return newState;
            });
          }
        });
      }
    );

    const requestsCollection = collection(db, "admin");
    getDocs(requestsCollection).then((collection) => {
      const object = {};
      collection.docs.forEach((doc) => {
        object[doc.id] = doc.data();
      });
      setMemberRequestsDocs(object);
    });
    const requestsCollectionSnapshot = onSnapshot(
      collection(db, "admin"),
      (collecSnapshot) => {
        collecSnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            setMemberRequestsDocs((prevDocs) => ({
              ...prevDocs,
              [change.doc.id]: change.doc.data(),
            }));
          }
          if (change.type === "modified") {
            setMemberRequestsDocs((prevDocs) => ({
              ...prevDocs,
              [change.doc.id]: {
                ...prevDocs[change.doc.id],
                ...change.doc.data(),
              },
            }));
          }
          if (change.type === "removed") {
            setMemberRequestsDocs((prevState) => {
              const newState = { ...prevState };
              delete newState[change.doc.id];
              return newState;
            });
          }
        });
      }
    );
    return () => {
      usersCollectionSnapshot();
      requestsCollectionSnapshot();
    };
  }, []);

  /////// Accepting a user //////////////
  const handleAcceptbtn = async (id) => {
    const docRef = doc(db, "admin", id);
    const document = await getDoc(docRef);
    await toast.promise(
      setDoc(doc(db, "users", document.id), document.data()),
      {
        loading: "adding new member",
        success: "A new member has been succesfully added",
        error: (error) => {
          toast.dismiss();
          return error.code;
        },
      }
    );
    await toast.promise(deleteDoc(doc(db, "admin", document.id)), {
      loading: "wait...",
      success: "All set",
      error: (error) => {
        toast.dismiss();
        return error.code;
      },
    });
  };
  ////////// Declining a user //////////
  const handleDeclinebtn = async (id) => {
    const docRef = doc(db, "admin", id);
    const document = await getDoc(docRef);
    await toast.promise(
      setDoc(doc(db, "declined-requests", document.id), document.data()),
      {
        loading: "adding document to the declined members collection...",
        success: "added succesfully",
        error: (error) => {
          toast.dismiss();
          return error.code;
        },
      }
    );
    await toast.promise(deleteDoc(doc(db, "admin", document.id)), {
      loading: "declining member request...",
      success: "Member request declined successfully",
      error: (error) => {
        toast.dismiss();
        return error.code;
      },
    });
  };

  return (
    <div className="container">
      <div className="admin-main-body">
        <div className="nav-bar">
          <ul className="nav-bar-list">
            <li
              className={
                option === "Member Requests"
                  ? "selected-nav-bar-li-element"
                  : "unselected-nav-bar-li-element"
              }
              onClick={() => {
                setOption("Member Requests");
              }}
            >
              <p className="admin-panel-p">
                Requests
                <span id="admin-panel-number-of-requests">
                  {Object.keys(memberRequestsDocs).length}
                </span>
              </p>
            </li>
            <li
              id="logs"
              className={
                option === "Logs"
                  ? "selected-nav-bar-li-element"
                  : "unselected-nav-bar-li-element"
              }
              onClick={() => {
                setOption("Logs");
              }}
            >
              <p className="admin-panel-p">Logs </p>
            </li>

            <li
              id="registered-members"
              className={
                option === "Registered Members"
                  ? "selected-nav-bar-li-element"
                  : "unselected-nav-bar-li-element"
              }
              onClick={() => {
                setOption("Registered Members");
              }}
            >
              <p className="admin-panel-p">Members</p>
            </li>
          </ul>
        </div>
        <div className="members-list">
          {option === "Member Requests" ? (
            <div>
              <ul>
                {Object.keys(memberRequestsDocs).map((docKey) => {
                  return (
                    <>
                      <li className="new-mem-req-li-element">
                        <div
                          id={`new-mem-req-${docKey}`}
                          className="new-mem-req-div-element"
                          object={memberRequestsDocs}
                          onClick={(e) => {
                            showNewMemDetails(docKey);
                          }}
                        >
                          {memberRequestsDocs[docKey]["name"]}
                        </div>
                        <div id={docKey} className="admin-btn-container">
                          <button
                            className="admin-btn"
                            onClick={(e) => {
                              handleAcceptbtn(e.target.parentElement.id);
                            }}
                          >
                            Accept
                          </button>
                          <button
                            className="admin-btn"
                            onClick={(e) => {
                              handleDeclinebtn(e.target.parentElement.id);
                            }}
                          >
                            Decline
                          </button>
                        </div>
                      </li>
                      <ul
                        id={`new-mem-req-${docKey}-drop-down`}
                        className="new-mem-req-drop-down-ul-element drop-down-ul-element reg-mem-hidden"
                        // hidden={true}
                      >
                        <li key="1">{`Email: ${memberRequestsDocs[docKey]["email"]}`}</li>
                        <li key="2">{`Phone: ${memberRequestsDocs[docKey]["phone"]}`}</li>
                        <li key="3">{`RollNo: ${memberRequestsDocs[docKey]["rollNo"]}`}</li>
                      </ul>
                    </>
                  );
                })}
              </ul>
            </div>
          ) : option === "Registered Members" ? (
            <>
              <ul>
                {Object.keys(usersDocs).map((docKey) => {
                  return (
                    <>
                      <li className="reg-mem-li-element" key={`${docKey}-mem`}>
                        <div
                          id={`reg-mem-${docKey}`}
                          className="reg-mem-div-element"
                          object={usersDocs}
                          onClick={(e) => {
                            showRegMemDetails(docKey);
                          }}
                        >
                          {usersDocs[docKey]["name"]}
                        </div>
                      </li>
                      <ul
                        id={`reg-mem-${docKey}-drop-down`}
                        className="reg-mem-drop-down-ul-element drop-down-ul-element reg-mem-hidden"

                        // hidden={true}
                      >
                        <li key="1">{`Email: ${usersDocs[docKey]["email"]}`}</li>
                        <li key="2">{`Phone: ${usersDocs[docKey]["phone"]}`}</li>
                        <li key="3">{`RollNo: ${usersDocs[docKey]["rollNo"]}`}</li>
                      </ul>
                    </>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <ul className="logs-list-ul">
                {/* {console.log(logs)} */}
                {Object.keys(logs).map((element) => {
                  // console.log(logs.length);
                  // console.log(Number(element) + 1);
                  return (
                    <>
                      <li
                        key={element}
                        className="logs-list-li"
                        onClick={() => {
                          showLogsDetail(logs[element][0]);
                        }}
                      >
                        <p>{`${logs[element][1].name}`}</p>
                        <p>{`${new Date(logs[element][1].time).toLocaleString(
                          undefined,
                          {
                            hour24: true,
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}`}</p>
                      </li>
                      {Number(element) + 1 < logs.length ? (
                        <>
                          <ul
                            // id={`reg-mem-${docKey}-drop-down`}
                            className="reg-mem-drop-down-ul-element drop-down-ul-element reg-mem-hidden"
                            id={`logs${logs[element][0]}`}
                            // hidden={true}
                          >
                            <li key="1">{`Last Owner: ${
                              logs[Number(element) + 1][1].name
                            }`}</li>
                            <li key="2">{`Phone: ${
                              logs[Number(element) + 1][1].phone
                            }`}</li>
                            <li key="3">{`RollNo: ${
                              logs[Number(element) + 1][1].rollNo
                            }`}</li>
                          </ul>
                        </>
                      ) : null}
                    </>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

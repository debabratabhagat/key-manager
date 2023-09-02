import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth";
import { Link } from "react-router-dom";
import Signout from "../signout";
import Signup from "../signup/signup";
import "./style.css";

function Name() {
  const [currentOwner, setCurrentOwner] = useState("");
  const [nextOwner, setNextOwner] = useState("");
  const [fallacy, setfallacy] = useState(false);
  const user = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnapshot = await getDoc(docRef);
        console.log(docSnapshot.data().name);
        // console.log(docSnapshot.data().haskey);

        if (docSnapshot.data().haskey && user) {
          console.log("inside true");
          setfallacy(true);
        }

        console.log(fallacy);
        console.log(docSnapshot.data());
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  //   console.log(user.uid);

  useEffect(() => {
    getName();
  }, []);

  const getName = async () => {
    const whole = await getDocs(collection(db, "users"));
    const listenTo = collection(db, "users");
    const q = query(collection(db, "users"), where("haskey", "==", true));

    onSnapshot(listenTo, (element) => {
      element.forEach((doc) => {
        if (doc.data().haskey) {
          //   console.log(doc.data().name);
          setCurrentOwner(doc.data().name);
        }
      });
    });

    try {
      const querySnapshot = await getDocs(q);

      // console.log(querySnapshot.docs[0].data());
      setCurrentOwner(querySnapshot.docs[0].data().name);

      //   whole.forEach((doc) => {
      //     console.log("heello");
      //     console.log(doc.data());
      //   });
    } catch (error) {
      console.log(error);
    }
  };

  const newOwner = async () => {
    setfallacy(false);
    //changing database values
    const nextq = query(
      collection(db, "users"),
      where("name", "==", nextOwner)
    );
    const currentq = query(
      collection(db, "users"),
      where("name", "==", currentOwner)
    );

    try {
      const currentQuerySnapshot = await getDocs(currentq);
      const nextQuerySnapshot = await getDocs(nextq);

      const currentUID = currentQuerySnapshot.docs[0].id;
      const nextUID = nextQuerySnapshot.docs[0].id;

      const nextRef = doc(db, "users", nextUID);
      const currentRef = doc(db, "users", currentUID);

      await Promise.all([
        updateDoc(nextRef, { haskey: true }),
        updateDoc(currentRef, { haskey: false }),
      ]);
      // await updateDoc(nextRef, { haskey: true });
      // await updateDoc(currentRef, { haskey: false });
    } catch (error) {
      console.log(error);
    }

    // console.log(nextOwner);
    setNextOwner("");
  };

  return (
    <div className="container">
      <div className="container-box">
        <h1 className="title">WELCOME</h1>
        <h2 className="header">
          Keys with <span className="highlighted">{currentOwner}</span>{" "}
        </h2>

        {fallacy ? (
          <div className="formContainer">
            {" "}
            <input
              type="text"
              placeholder="new owner"
              name="owner"
              value={nextOwner}
              onChange={(val) => {
                setNextOwner(val.target.value);
              }}
              className="input-field"
            />
            <button
              className="button"
              onClick={() => {
                newOwner();
              }}
            >
              Has the key{" "}
            </button>
          </div>
        ) : (
          <h3 className="message">
            owner can be changed by the person who holds the keys
          </h3>
        )}

        {user ? (
          <Signout></Signout>
        ) : (
          <div>
            <h3 className="linkContainer">
              <Link to="/signup" className="link">SignUP</Link>/ <Link to="/login" className="link">login</Link>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Name;

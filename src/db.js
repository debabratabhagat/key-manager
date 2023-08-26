import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import React, { useEffect, useState } from "react";

function Name() {
  const [currentOwner, setCurrentOwner] = useState("");
  const [nextOwner, setNextOwner] = useState("");

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
          console.log(doc.data().name);
          setCurrentOwner(doc.data().name);
        }
      });
    });

    try {
      const querySnapshot = await getDocs(q);

      // console.log(querySnapshot.docs[0].data());
      setCurrentOwner(querySnapshot.docs[0].data().name);

      whole.forEach((doc) => {
        console.log("heello");
        console.log(doc.data());
      });
    } catch (error) {
      console.log(error);
    }
  };

  const newOwner = async () => {
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
    <div>
      <h1>{currentOwner}</h1>

      <input
        type="text"
        placeholder="new owner"
        name="owner"
        value={nextOwner}
        onChange={(val) => {
          setNextOwner(val.target.value);
        }}
      />

      <button onClick={() => newOwner()}>Has the key </button>
    </div>
  );
}

export default Name;

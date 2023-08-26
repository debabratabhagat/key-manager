// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVhpqjCB1HmBkAoLQWyhQ0zy1J3q3S0E0",
  authDomain: "my-first-firebase-projec-f2244.firebaseapp.com",
  databaseURL:
    "https://my-first-firebase-projec-f2244-default-rtdb.firebaseio.com",
  projectId: "my-first-firebase-projec-f2244",
  storageBucket: "my-first-firebase-projec-f2244.appspot.com",
  messagingSenderId: "915781204773",
  appId: "1:915781204773:web:d829de456a6f00b3fab8cc",
  measurementId: "G-K3H2ZE1J84",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

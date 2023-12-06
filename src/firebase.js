// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getMessaging, onMessage } from "firebase/messaging";
// import { Messaging } from "firebase/messaging";

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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export { db, app, auth, googleProvider, microsoftProvider, messaging };

// onMessage(messaging, (payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };
//   if (Notification.permission === "granted") {
//     new Notification(notificationTitle, notificationOptions);

//   } else {
//     // You might want to request permission here
//     // or handle the case where permission is not granted
//   }
// });

// runtime.register().then((registration) => {
// registration.showNotification(notificationTitle, notificationOptions);
// });

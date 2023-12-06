importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

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

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

console.log("debugging");

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

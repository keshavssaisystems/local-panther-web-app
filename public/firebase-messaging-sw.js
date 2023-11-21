/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCwJ9XU5LfjGXkD77q6MwsPkvz5QdLUHKY",
  authDomain: "panther-test-8cd56.firebaseapp.com",
  projectId: "panther-test-8cd56",
  storageBucket: "panther-test-8cd56.appspot.com",
  messagingSenderId: "275858738478",
  appId: "1:275858738478:web:b191ac1830f73fb7fe7ebf",
  measurementId: "G-41FNE7FGNE",
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
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

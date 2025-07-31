/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBkc5ZFqejClCiGb8NavO2bvTuU0YwSCPU", 
  authDomain: "openworx-e54f7.firebaseapp.com", 
  projectId: "openworx-e54f7", 
  storageBucket: "openworx-e54f7.appspot.com", 
  messagingSenderId: "534510481965", 
  appId: "1:534510481965:web:6bbbd4c282f9d52f577ea4", 
  measurementId: "G-K5T2MCQPGY"
};

firebase.initializeApp(firebaseConfig);
export const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
export const analytics = firebase.analytics(initApp);
export const database = firebase.database();
//messaging.onBackgroundMessage((payload) => {
//  console.log(
//    "[firebase-messaging-sw.js] Received background message ",
//    payload
//  );
//  const notificationTitle = payload.notification.title;
//  const notificationOptions = {
//    body: payload.notification.body,
//    icon: payload.notification.image,
//  };

//  self.registration.showNotification(notificationTitle, notificationOptions);
//});

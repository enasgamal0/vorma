// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyAXNtEwiz0yx5lkd0zGenS3fS0bQdE2F2Y",
  authDomain: "vorma-e3cdb.firebaseapp.com",
  projectId: "vorma-e3cdb",
  storageBucket: "vorma-e3cdb.firebasestorage.app",
  messagingSenderId: "1096230928002",
  appId: "1:1096230928002:web:42d77016fcaed7ae2b7e9b",
  measurementId: "G-24JHM4SPWR"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log("Received background message", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(payload);
    });
  });
});
// =================================== new ==========================

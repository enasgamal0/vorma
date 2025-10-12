//firebase.js
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firebase-messaging";

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

export default firebase.messaging();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0V579ZjUg6qGKMkZvK45QZvTb4ChkWqU",
  authDomain: "vibrantboreholedrilling.firebaseapp.com",
  projectId: "vibrantboreholedrilling",
  storageBucket: "vibrantboreholedrilling.firebasestorage.app",
  messagingSenderId: "610146375745",
  appId: "1:610146375745:web:388e624a8b3da4f0a28ec0",
  measurementId: "G-LG7JNM2PZY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;

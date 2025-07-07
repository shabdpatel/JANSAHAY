// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD4XZTId3YMZr-b70PTG-TJLNgUTPmx158",
    authDomain: "jansahay-f7a2b.firebaseapp.com",
    databaseURL: "https://jansahay-f7a2b-default-rtdb.firebaseio.com",
    projectId: "jansahay-f7a2b",
    storageBucket: "jansahay-f7a2b.firebasestorage.app",
    messagingSenderId: "982949734729",
    appId: "1:982949734729:web:f8e72e7991cb1d8849d298",
    measurementId: "G-LWVCSTP763"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);


// 🔴 Ensure your .env has the correct storage bucket (should end with .appspot.com):
// VITE_FIREBASE_STORAGE_BUCKET=jansahay-f7a2b.appspot.com

export { app, db, auth };
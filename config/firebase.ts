// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnBGCugf_gM8U_MkdOXQ4BdYVICS-MFyk",
  authDomain: "chat-next-4262b.firebaseapp.com",
  projectId: "chat-next-4262b",
  storageBucket: "chat-next-4262b.appspot.com",
  messagingSenderId: "682725788526",
  appId: "1:682725788526:web:52548098be165b46558f7f",
  measurementId: "G-GF1DZCVSM4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };

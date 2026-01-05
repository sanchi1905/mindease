// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdz04yjP4UFUaxgTw5HsDFvlaK68PHWnA",
  authDomain: "mindease-app-187b0.firebaseapp.com",
  projectId: "mindease-app-187b0",
  storageBucket: "mindease-app-187b0.firebasestorage.app",
  messagingSenderId: "486410927650",
  appId: "1:486410927650:web:5ad0d0a344a1dc935a947b",
  measurementId: "G-EZB2HD278H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
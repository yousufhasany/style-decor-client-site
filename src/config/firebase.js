// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzV5pdIz1PtVllie5PyWbgXMJQI17JX94",
  authDomain: "smart-home-and-ceremony-dec.firebaseapp.com",
  projectId: "smart-home-and-ceremony-dec",
  storageBucket: "smart-home-and-ceremony-dec.firebasestorage.app",
  messagingSenderId: "373966472518",
  appId: "1:373966472518:web:2b4aa33497c327827b1147"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

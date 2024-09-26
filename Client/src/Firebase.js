// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-67008.firebaseapp.com",
  projectId: "blog-app-67008",
  storageBucket: "blog-app-67008.appspot.com",
  messagingSenderId: "834922813160",
  appId: "1:834922813160:web:76c78fdadbd73a6d741b5d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
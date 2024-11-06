// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxGcfgREDpVFKefLcT-nbN8BND2-JjOxM",
  authDomain: "imagegen-f7823.firebaseapp.com",
  projectId: "imagegen-f7823",
  storageBucket: "imagegen-f7823.appspot.com",
  messagingSenderId: "482860578957",
  appId: "1:482860578957:web:d294562ee3e91e32ffcac4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Auth = getAuth(app)
const Provider = new GoogleAuthProvider()
const db = getFirestore(app)
const storage = getStorage(app)
const API_TOKEN = "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";

export {Auth, Provider, db, storage, API_TOKEN};
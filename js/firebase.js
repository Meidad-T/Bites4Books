import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMVeFwEdYDjipEsS3PRqIpcM9MWeCQcZU",
  authDomain: "bites2books.firebaseapp.com",
  projectId: "bites2books",
  storageBucket: "bites2books.firebasestorage.app",
  messagingSenderId: "464466219086",
  appId: "1:464466219086:web:5fb9d69cd14d3fc497f31f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "points");
const provider = new GoogleAuthProvider();

export { app, auth, db, provider, signInWithPopup, signOut, onAuthStateChanged, doc, getDoc, setDoc, updateDoc, arrayUnion };

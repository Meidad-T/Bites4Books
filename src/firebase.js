import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMVeFwEdYDjipEsS3PRqIpcM9MWeCQcZU",
  authDomain: "bites2books.firebaseapp.com",
  projectId: "bites2books",
  storageBucket: "bites2books.firebasestorage.app",
  messagingSenderId: "464466219086",
  appId: "1:464466219086:web:5fb9d69cd14d3fc497f31f"
};

let app, auth, db, googleProvider;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app, "points"); // Explicitly routing to named database ID
    googleProvider = new GoogleAuthProvider();
  } else {
    console.warn("⚠️ Firebase blocked: VITE_FIREBASE_API_KEY is missing from .env!");
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export { auth, db, googleProvider };

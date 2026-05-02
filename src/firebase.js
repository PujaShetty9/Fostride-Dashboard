import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQrLmX_Qd03zWSdFE6JrwVPPfaJ902Tv4",
  authDomain: "fostride-dashboard.firebaseapp.com",
  projectId: "fostride-dashboard",
  storageBucket: "fostride-dashboard.firebasestorage.app",
  messagingSenderId: "89083421164",
  appId: "1:89083421164:web:2c7104a6c98584e54ae0c9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
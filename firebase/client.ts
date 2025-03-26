import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAas-QcDReDhO6LG6dPNAWBtBz_uR_7tqU",
  authDomain: "prepwise-my.firebaseapp.com",
  projectId: "prepwise-my",
  storageBucket: "prepwise-my.firebasestorage.app",
  messagingSenderId: "1086245642128",
  appId: "1:1086245642128:web:050e90c894199accb09d15",
  measurementId: "G-1CGYKX8HXQ",
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

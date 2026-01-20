import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCq43UJE8OklXM3xyUDhWcwffPF4yGs-0A",
  authDomain: "fir-auth-assignment-4e0aa.firebaseapp.com",
  projectId: "fir-auth-assignment-4e0aa",
  storageBucket: "fir-auth-assignment-4e0aa.firebasestorage.app",
  messagingSenderId: "273954462970",
  appId: "1:273954462970:web:da923e6861a9dce4833d43",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export {
  initializeApp,
  getAuth,
  auth,
  provider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  db,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
};

// Import the functions you need from the SDKs you need
import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    where,
  } from "firebase/firestore";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FirebaseContext = createContext(null);
const firebaseConfig = {
  apiKey: "AIzaSyAZg-DaDq-EcgJSKezZbun5ffr3dOdEymw",
  authDomain: "eloom-e079f.firebaseapp.com",
  projectId: "eloom-e079f",
  storageBucket: "eloom-e079f.appspot.com",
  messagingSenderId: "884448076828",
  appId: "1:884448076828:web:ec3204c2ea13b24484ebd9",
  measurementId: "G-XY79G942BV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
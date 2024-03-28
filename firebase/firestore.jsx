// Import the functions you need from the SDKs you need
import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const FirebaseContext = createContext(null);
const firebaseConfig = {
  apiKey: "AIzaSyAZg-DaDq-EcgJSKezZbun5ffr3dOdEymw",
  authDomain: "eloom-e079f.firebaseapp.com",
  projectId: "eloom-e079f",
  storageBucket: "eloom-e079f.appspot.com",
  messagingSenderId: "884448076828",
  appId: "1:884448076828:web:ec3204c2ea13b24484ebd9",
  measurementId: "G-XY79G942BV",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

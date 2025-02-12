// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase} from "firebase/database";
import {getFirestore} from "firebase/firestore";
import {initializeAuth,getReactNativePersistence} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhkqHAVWJ38_lvI4wbtg4_J4P-hXMNnGs",
  authDomain: "chanelapp-b6eb1.firebaseapp.com",
  projectId: "chanelapp-b6eb1",
  storageBucket: "chanelapp-b6eb1.firebasestorage.app",
  messagingSenderId: "154165902603",
  appId: "1:154165902603:web:f1748d09f1656413c4360e",
  measurementId: "G-3FFWVREC40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const autch = initializeAuth(app,{
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const database = getDatabase(app);
export const db = getFirestore(app);
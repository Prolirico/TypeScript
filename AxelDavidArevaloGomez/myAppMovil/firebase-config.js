// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz47saKgN_-f1mhgZAsSjhTw6hkeEFHdQ",
  authDomain: "marcachanel-553b3.firebaseapp.com",
  projectId: "marcachanel-553b3",
  //storageBucket: "marcachanel-553b3.firebasestorage.app",
  storageBucket: "marcachanel-553b3.appspot.com",
  messagingSenderId: "877519760510",
  appId: "1:877519760510:web:0720cebba71fdb9b0a7c2f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore/lite"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBlFyO_gMM9OavMyuTHSiFBGlRcJ9Uokzg",
  authDomain: "studiogoods-5758c.firebaseapp.com",
  projectId: "studiogoods-5758c",
  storageBucket: "studiogoods-5758c.appspot.com",
  messagingSenderId: "179070010011",
  appId: "1:179070010011:web:52b6a415673f3f66753c3e",
  measurementId: "G-PJLCQ1TGBD",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth()
export const storage = getStorage(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlsn1YfQ_KNilp9dA2LG2g3ARPqH55Do0",
  authDomain: "dbttest-ce8bc.firebaseapp.com",
  projectId: "dbttest-ce8bc",
  storageBucket: "dbttest-ce8bc.appspot.com",
  messagingSenderId: "92632875625",
  appId: "1:92632875625:web:d824d71da18fc796e298f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
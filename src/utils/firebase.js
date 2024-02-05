// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'alpaago-assignmen.firebaseapp.com',
  projectId: 'alpaago-assignmen',
  storageBucket: 'alpaago-assignmen.appspot.com',
  messagingSenderId: '305748782144',
  appId: '1:305748782144:web:ff305b5ebc7bb636c9c3a5',
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
// Initialize Realtime Database and get a reference to the service
export const rtdb = getDatabase(app);
